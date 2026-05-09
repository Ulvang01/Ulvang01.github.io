import { Vector2 } from "../utils/vector2.js";
import { clamp }   from "../utils/math.js";

// Cell size in world units. Should be >= the diameter of the largest entity
// so that entities span at most 2×2 cells, keeping candidate lists short.
const CELL_SIZE = 200;

export class CollisionSystem {
    // Reused every tick — cleared instead of reallocated to reduce GC pressure
    #grid    = new Map();
    #checked = new Set();

    // Main entry point — call once per tick after all entities have moved.
    resolve(entities, worldBounds) {
        // 1. Entity-entity via spatial grid
        this.#buildGrid(entities);
        this.#resolveEntities(entities);

        // 2. World border — runs last so walls always win
        for (const e of entities) {
            if (e.collidable) this.#resolveWorldBorder(e, worldBounds);
        }
    }

    // ── Spatial grid ──────────────────────────────────────────────────────────

    #buildGrid(entities) {
        this.#grid.clear();
        for (const e of entities) {
            if (!e.collidable) continue;
            for (const key of this.#cellKeys(e.bounds)) {
                let bucket = this.#grid.get(key);
                if (!bucket) { bucket = []; this.#grid.set(key, bucket); }
                bucket.push(e);
            }
        }
    }

    // Returns numeric keys for every cell the AABB touches.
    // Numeric keys are faster to hash than strings.
    // Multiplier 100003 > max y-cells (world 3200 / cell 200 = 16), so no collisions.
    #cellKeys(bounds) {
        const x0 = Math.floor(bounds.x    / CELL_SIZE);
        const y0 = Math.floor(bounds.y    / CELL_SIZE);
        const x1 = Math.floor(bounds.maxX / CELL_SIZE);
        const y1 = Math.floor(bounds.maxY / CELL_SIZE);

        // Common case: entity fits in one cell — skip array allocation
        if (x0 === x1 && y0 === y1) return [x0 * 100003 + y0];

        const keys = [];
        for (let x = x0; x <= x1; x++)
            for (let y = y0; y <= y1; y++)
                keys.push(x * 100003 + y);
        return keys;
    }

    // ── Entity-entity ─────────────────────────────────────────────────────────

    #resolveEntities(entities) {
        this.#checked.clear();

        for (const a of entities) {
            if (!a.collidable) continue;

            for (const key of this.#cellKeys(a.bounds)) {
                const bucket = this.#grid.get(key);
                if (!bucket) continue;

                for (const b of bucket) {
                    if (b === a || !b.collidable) continue;

                    // Canonical numeric pair key — (a,b) and (b,a) produce the same number.
                    // Assumes entity IDs stay below 100 000, which is always true in practice.
                    const pairId = a.id < b.id
                        ? a.id * 100000 + b.id
                        : b.id * 100000 + a.id;
                    if (this.#checked.has(pairId)) continue;
                    this.#checked.add(pairId);

                    this.#resolvePair(a, b);
                }
            }
        }
    }

    #resolvePair(a, b) {
        const ac = a.shape === 'circle';
        const bc = b.shape === 'circle';

        if      ( ac &&  bc) this.#circleCircle(a, b);
        else if ( ac && !bc) this.#circleAABB(a, b);
        else if (!ac &&  bc) this.#circleAABB(b, a);
        else                 this.#aabbAABB(a, b);
    }

    // ── Narrow phase ──────────────────────────────────────────────────────────

    #circleCircle(a, b) {
        const pa = a.position, pb = b.position;
        const dx = pa.x - pb.x, dy = pa.y - pb.y;
        const distSq  = dx * dx + dy * dy;
        const minDist = a.size + b.size;

        if (distSq >= minDist * minDist) return;

        const dist    = Math.sqrt(distSq) || 0.001;
        const overlap = minDist - dist;
        this.#push(a, b, dx / dist, dy / dist, overlap);
    }

    #circleAABB(circle, box) {
        const p  = circle.position;
        const r  = circle.size;
        const bb = box.bounds;

        // Closest point on AABB to circle center
        const cx = clamp(p.x, bb.x, bb.maxX);
        const cy = clamp(p.y, bb.y, bb.maxY);
        const dx = p.x - cx, dy = p.y - cy;
        const distSq = dx * dx + dy * dy;

        if (distSq >= r * r) return;

        let nx, ny, overlap;
        if (distSq === 0) {
            // Center inside box — eject along axis of least penetration
            const dL = p.x - bb.x,    dR = bb.maxX - p.x;
            const dT = p.y - bb.y,    dB = bb.maxY - p.y;
            const m  = Math.min(dL, dR, dT, dB);
            if      (m === dL) { nx = -1; ny =  0; overlap = r + dL; }
            else if (m === dR) { nx =  1; ny =  0; overlap = r + dR; }
            else if (m === dT) { nx =  0; ny = -1; overlap = r + dT; }
            else               { nx =  0; ny =  1; overlap = r + dB; }
        } else {
            const dist = Math.sqrt(distSq);
            overlap = r - dist;
            nx = dx / dist;
            ny = dy / dist;
        }

        this.#push(circle, box, nx, ny, overlap);
    }

    #aabbAABB(a, b) {
        const ba = a.bounds, bb = b.bounds;
        const ox = Math.min(ba.maxX, bb.maxX) - Math.max(ba.x, bb.x);
        const oy = Math.min(ba.maxY, bb.maxY) - Math.max(ba.y, bb.y);

        if (ox <= 0 || oy <= 0) return;

        let nx = 0, ny = 0, overlap;
        if (ox < oy) {
            overlap = ox;
            nx = ba.centerX < bb.centerX ? -1 : 1;
        } else {
            overlap = oy;
            ny = ba.centerY < bb.centerY ? -1 : 1;
        }

        this.#push(a, b, nx, ny, overlap);
    }

    // Shared push-apart with static/dynamic split, velocity damping, and
    // optional zero-correction support via entity.correctionRate.
    //
    // correctionRate == 1.0  → instant full separation (normal behaviour)
    // correctionRate == 0    → no positional correction; dampVelocity still runs
    //                          so the entity can't sink deeper.  GameManager drives
    //                          the exit via an explicit accelerating velocity.
    #push(a, b, nx, ny, overlap) {
        if (a.isStatic && b.isStatic) return;

        const pa = a.position, pb = b.position;

        if (!a.isStatic && !b.isStatic) {
            const rate = Math.min(a.correctionRate ?? 1.0, b.correctionRate ?? 1.0);
            const h = (overlap * rate) * 0.5;
            if (h > 0) {
                a.position = new Vector2(pa.x + nx * h, pa.y + ny * h);
                b.position = new Vector2(pb.x - nx * h, pb.y - ny * h);
            }
            this.#dampVelocity(a,  nx, ny);
            this.#dampVelocity(b, -nx, -ny);
        } else if (!a.isStatic) {
            const rate       = a.correctionRate ?? 1.0;
            const correction = overlap * rate;
            if (correction > 0) {
                a.position = new Vector2(pa.x + nx * correction, pa.y + ny * correction);
            }
            this.#dampVelocity(a, nx, ny);
        } else {
            const rate       = b.correctionRate ?? 1.0;
            const correction = overlap * rate;
            if (correction > 0) {
                b.position = new Vector2(pb.x - nx * correction, pb.y - ny * correction);
            }
            this.#dampVelocity(b, -nx, -ny);
        }
    }

    // Zero the velocity component pointing into the collision surface
    #dampVelocity(entity, nx, ny) {
        const dot = entity.dx * nx + entity.dy * ny;
        if (dot < 0) {
            entity.dx -= dot * nx;
            entity.dy -= dot * ny;
        }
    }

    // ── World border ──────────────────────────────────────────────────────────

    #resolveWorldBorder(entity, wb) {
        const b = entity.bounds;
        const p = entity.position;
        let x = p.x, y = p.y, moved = false;

        if (b.x < wb.x)       { x += wb.x    - b.x;    if (entity.dx < 0) entity.dx = 0; moved = true; }
        if (b.maxX > wb.maxX) { x += wb.maxX - b.maxX; if (entity.dx > 0) entity.dx = 0; moved = true; }
        if (b.y < wb.y)       { y += wb.y    - b.y;    if (entity.dy < 0) entity.dy = 0; moved = true; }
        if (b.maxY > wb.maxY) { y += wb.maxY - b.maxY; if (entity.dy > 0) entity.dy = 0; moved = true; }

        if (moved) entity.position = new Vector2(x, y);
    }
}
