import { Vector2 } from "../../utils/vector2.js";
import { AABB } from "../../utils/aabb.js";

export class Camera {
    // private backing fields — setters mark viewport dirty on change
    #position = Vector2.zero();
    #angle = 0;
    #zoom = 1;
    #screenRect;
    #vpDirty = true;
    #vpCache = null;

    constructor(screenRect) {
        this.#screenRect = screenRect;
    }

    // ── Properties ────────────────────────────────────────────────────────────

    get position() {
        return this.#position;
    }
    set position(v) {
        this.#position = v;
        this.#vpDirty = true;
    }

    get angle() {
        return this.#angle;
    }
    set angle(v) {
        this.#angle = v;
        this.#vpDirty = true;
    }

    get zoom() {
        return this.#zoom;
    }
    set zoom(v) {
        this.#zoom = v;
        this.#vpDirty = true;
    }

    get screenRect() {
        return this.#screenRect;
    }
    set screenRect(v) {
        this.#screenRect = v;
        this.#vpDirty = true;
    }

    // ── Viewport ──────────────────────────────────────────────────────────────

    // Cached — recomputed only when position, angle, zoom, or screenRect changes.
    // When rotated, returns a conservative AABB enclosing the rotated rectangle
    // so culling never incorrectly discards partially visible objects.
    get viewport() {
        if (!this.#vpDirty) return this.#vpCache;

        const hw = (this.#screenRect.w / this.#zoom) * 0.5;
        const hh = (this.#screenRect.h / this.#zoom) * 0.5;

        if (this.#angle === 0) {
            this.#vpCache = new AABB(
                this.#position.x - hw,
                this.#position.y - hh,
                hw * 2,
                hh * 2,
            );
        } else {
            const cos = Math.abs(Math.cos(this.#angle));
            const sin = Math.abs(Math.sin(this.#angle));
            const rw = hw * cos + hh * sin;
            const rh = hw * sin + hh * cos;
            this.#vpCache = new AABB(
                this.#position.x - rw,
                this.#position.y - rh,
                rw * 2,
                rh * 2,
            );
        }

        this.#vpDirty = false;
        return this.#vpCache;
    }

    // ── Coordinate transforms ─────────────────────────────────────────────────

    worldToScreen(v) {
        const dx = (v.x - this.#position.x) * this.#zoom;
        const dy = (v.y - this.#position.y) * this.#zoom;

        if (this.#angle === 0) {
            return new Vector2(
                dx + this.#screenRect.centerX,
                dy + this.#screenRect.centerY,
            );
        }

        const cos = Math.cos(this.#angle);
        const sin = Math.sin(this.#angle);
        return new Vector2(
            dx * cos - dy * sin + this.#screenRect.centerX,
            dx * sin + dy * cos + this.#screenRect.centerY,
        );
    }

    screenToWorld(v) {
        const dx = v.x - this.#screenRect.centerX;
        const dy = v.y - this.#screenRect.centerY;

        if (this.#angle === 0) {
            return new Vector2(
                dx / this.#zoom + this.#position.x,
                dy / this.#zoom + this.#position.y,
            );
        }

        const cos = Math.cos(this.#angle);
        const sin = Math.sin(this.#angle);
        return new Vector2(
            (dx * cos + dy * sin) / this.#zoom + this.#position.x,
            (-dx * sin + dy * cos) / this.#zoom + this.#position.y,
        );
    }

    // ── Context transform ─────────────────────────────────────────────────────

    apply(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.rect(
            this.#screenRect.x,
            this.#screenRect.y,
            this.#screenRect.w,
            this.#screenRect.h,
        );
        ctx.clip();

        ctx.translate(this.#screenRect.centerX, this.#screenRect.centerY);
        ctx.rotate(this.#angle);
        ctx.scale(this.#zoom, this.#zoom);
        ctx.translate(-this.#position.x, -this.#position.y);
    }

    restore(ctx) {
        ctx.restore();
    }

    // ── Abstract ──────────────────────────────────────────────────────────────

    update(dt) {
        throw new Error(`${this.constructor.name} must implement update(dt)`);
    }
}
