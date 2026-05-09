import { config } from "../config.js";
import { AABB } from "../utils/aabb.js";
import { Vector2 } from "../utils/vector2.js";
import { clamp } from "../utils/math.js";
import { FollowCamera2D } from "./camera/follow-camera-2d.js";
import { CollisionSystem } from "./collision.js";
import { Input } from "./input.js";
import { Box } from "../entities/box.js";
import { Player } from "../entities/player.js";

export class GameManager {
    #camera = null;
    #lastW = 0;
    #lastH = 0;
    #input;
    #player = new Player(new Vector2(0, 0));
    #entities = [];
    #collision = new CollisionSystem();

    // Tracks previous drag state to detect the landing transition
    #wasDragging = false;

    // World is centered at origin
    #worldBounds = new AABB(
        -config.WORLD_W / 2,
        -config.WORLD_H / 2,
        config.WORLD_W,
        config.WORLD_H,
    );

    // canvas — passed through so Input can register non-passive pointer listeners
    // directly on the canvas element instead of window, enabling preventDefault()
    // to suppress browser scroll/zoom on mobile.
    constructor(canvas) {
        this.#input = new Input(canvas);
        this.#initEntities();
    }

    #initEntities() {
        this.#entities = [
            new Box(new Vector2(-100, -150), 70, 90, "#4a90d9"),
            new Box(new Vector2(120, 80), 60, 50, "#7ed321"),
            new Box(new Vector2(530, 0), 60, 160, "#f5a623"),
            new Box(new Vector2(-750, 0), 260, 260, "#d0021b"),
            new Box(new Vector2(0, 480), 220, 160, "#9b59b6"),
        ];
    }

    destroy() {
        this.#input.destroy();
    }

    update(dt) {
        this.#input.tick();

        // Camera always processes drag and zoom first
        this.#camera?.input(this.#input);

        const dragging = this.#input.isDragging;
        const justLanded = this.#wasDragging && !dragging;
        this.#wasDragging = dragging;

        this.#player.lifted = dragging;

        if (dragging) {
            // ── Drag mode: camera leads, player hangs behind ──────────────────
            this.#player.dx = 0;
            this.#player.dy = 0;

            const t = 1 - Math.exp(-config.PLAYER_DRAG_LERP * dt);
            this.#player.position = this.#player.position.lerp(
                this.#camera.position,
                t,
            );
        } else {
            // ── Normal / sliding mode ─────────────────────────────────────────
            // Only feed keyboard input when the player is free to move
            if (!this.#player.sliding) {
                this.#player.input(this.#input);
            }
        }

        // Always update — size animation runs regardless of state
        this.#player.update(dt);
        for (const e of this.#entities) e.update(dt);

        // ── Collision ─────────────────────────────────────────────────────────
        // On landing, force sliding=true so correctionRate kicks in immediately.
        // The collision system will then nudge the player out gradually each tick.
        if (justLanded) {
            this.#player.sliding = true;
        }

        // Lifted player has collidable=false — passes through everything in the air
        this.#collision.resolve(
            [this.#player, ...this.#entities],
            this.#worldBounds,
        );

        // After collision resolution, check whether the player is still inside any
        // entity.  Use exact circle-AABB geometry so we don't flip off too early.
        if (this.#player.sliding) {
            // Accumulate the push normal from every entity the player overlaps.
            // Summing normals handles being wedged between two boxes correctly.
            let nx = 0,
                ny = 0,
                count = 0;
            for (const e of this.#entities) {
                const n = this.#playerPushNormal(e);
                if (n) {
                    nx += n.nx;
                    ny += n.ny;
                    count++;
                }
            }

            if (count === 0) {
                // Player is fully clear — restore normal control
                this.#player.sliding = false;
            } else {
                // Normalize the combined direction
                const len = Math.sqrt(nx * nx + ny * ny) || 1;
                nx /= len;
                ny /= len;

                // Accelerate in the exit direction, capped at slide max speed.
                // deacc is zeroed by Player.update() while sliding, so this
                // velocity accumulates freely until the player exits the box.
                const acc = config.PLAYER_SLIDE_ACC;
                const maxSpeed = config.PLAYER_SLIDE_MAX_SPEED;
                this.#player.dx = clamp(
                    this.#player.dx + nx * acc * dt,
                    -maxSpeed,
                    maxSpeed,
                );
                this.#player.dy = clamp(
                    this.#player.dy + ny * acc * dt,
                    -maxSpeed,
                    maxSpeed,
                );
            }
        }

        this.#camera?.update(dt);
    }

    draw(ctx, alpha) {
        const w = ctx.canvas.width / config.PIXEL_RATIO;
        const h = ctx.canvas.height / config.PIXEL_RATIO;

        this.#syncCamera(w, h);

        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, w, h);

        this.#camera.apply(ctx);
        this.#drawWorld(ctx);
        this.#camera.restore(ctx);

        if (config.ENV === "development") this.#drawDebug(ctx);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    #syncCamera(w, h) {
        if (w === this.#lastW && h === this.#lastH) return;
        this.#lastW = w;
        this.#lastH = h;

        const pad = config.CAMERA_PADDING;
        const screenRect = new AABB(pad, pad, w - pad * 2, h - pad * 2);

        if (!this.#camera) {
            this.#camera = new FollowCamera2D(screenRect);
            this.#camera.worldBounds = this.#worldBounds;
            this.#camera.setTarget(this.#player);
        } else {
            this.#camera.screenRect = screenRect;
        }
    }

    // Exact circle-AABB overlap test (mirrors the narrow phase in collision.js).
    // Returns the outward push normal {nx, ny} if the player overlaps the entity,
    // or null if there is no overlap.
    #playerPushNormal(entity) {
        const p = this.#player.position;
        const r = this.#player.size;
        const bb = entity.bounds;

        const cx = clamp(p.x, bb.x, bb.maxX);
        const cy = clamp(p.y, bb.y, bb.maxY);
        const dx = p.x - cx;
        const dy = p.y - cy;
        const distSq = dx * dx + dy * dy;

        if (distSq >= r * r) return null; // not overlapping

        if (distSq === 0) {
            // Center inside box — eject along axis of least penetration
            const dL = p.x - bb.x,
                dR = bb.maxX - p.x;
            const dT = p.y - bb.y,
                dB = bb.maxY - p.y;
            const m = Math.min(dL, dR, dT, dB);
            if (m === dL) return { nx: -1, ny: 0 };
            if (m === dR) return { nx: 1, ny: 0 };
            if (m === dT) return { nx: 0, ny: -1 };
            return { nx: 0, ny: 1 };
        }

        const dist = Math.sqrt(distSq);
        return { nx: dx / dist, ny: dy / dist };
    }

    #drawWorld(ctx) {
        const wb = this.#worldBounds;
        ctx.strokeStyle = "#c8a96e";
        ctx.lineWidth = 2;
        ctx.strokeRect(wb.x, wb.y, wb.w, wb.h);

        // Expand the viewport by VIEWPORT_CULL_MARGIN so entities just outside
        // the screen edge aren't popped in/out as the camera moves.
        const cullArea = this.#camera.viewport.expand(
            config.VIEWPORT_CULL_MARGIN,
        );

        for (const e of this.#entities) {
            if (cullArea.intersects(e.bounds)) e.draw(ctx);
        }

        // Player is always drawn (camera follows it, so it's always visible)
        this.#player.draw(ctx);
    }

    #drawDebug(ctx) {
        ctx.save();
        ctx.setLineDash([6, 4]);

        const sr = this.#camera.screenRect;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(sr.x + 0.5, sr.y + 0.5, sr.w, sr.h);

        const col = this.#camera.collider;
        const tl = this.#camera.worldToScreen({ x: col.x, y: col.y });
        const br = this.#camera.worldToScreen({ x: col.maxX, y: col.maxY });
        ctx.strokeStyle = "rgba(255, 180, 0, 0.35)";
        ctx.strokeRect(tl.x + 0.5, tl.y + 0.5, br.x - tl.x, br.y - tl.y);

        ctx.restore();
    }
}
