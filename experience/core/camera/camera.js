import { Vector2 } from "../../utils/vector2.js";
import { AABB } from "../../utils/aabb.js";

export class Camera {
    constructor(screenRect) {
        this.position = Vector2.zero();
        this.angle = 0; // radians
        this.zoom = 1;
        this.screenRect = screenRect; // AABB — where on canvas this camera renders
    }

    // AABB in world space representing what this camera sees.
    // When rotated, returns a conservative AABB enclosing the rotated rectangle
    // so culling never incorrectly discards partially visible objects.
    get viewport() {
        const hw = (this.screenRect.w / this.zoom) * 0.5;
        const hh = (this.screenRect.h / this.zoom) * 0.5;

        if (this.angle === 0) {
            return new AABB(
                this.position.x - hw,
                this.position.y - hh,
                hw * 2,
                hh * 2,
            );
        }

        const cos = Math.abs(Math.cos(this.angle));
        const sin = Math.abs(Math.sin(this.angle));
        const rw = hw * cos + hh * sin;
        const rh = hw * sin + hh * cos;
        return new AABB(
            this.position.x - rw,
            this.position.y - rh,
            rw * 2,
            rh * 2,
        );
    }

    worldToScreen(v) {
        const dx = (v.x - this.position.x) * this.zoom;
        const dy = (v.y - this.position.y) * this.zoom;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return new Vector2(
            dx * cos - dy * sin + this.screenRect.centerX,
            dx * sin + dy * cos + this.screenRect.centerY,
        );
    }

    screenToWorld(v) {
        const dx = v.x - this.screenRect.centerX;
        const dy = v.y - this.screenRect.centerY;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return new Vector2(
            (dx * cos + dy * sin) / this.zoom + this.position.x,
            (-dx * sin + dy * cos) / this.zoom + this.position.y,
        );
    }

    // Push camera transform. Call before drawing world objects.
    apply(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.rect(
            this.screenRect.x,
            this.screenRect.y,
            this.screenRect.w,
            this.screenRect.h,
        );
        ctx.clip();

        ctx.translate(this.screenRect.centerX, this.screenRect.centerY);
        ctx.rotate(this.angle);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.position.x, -this.position.y);
    }

    restore(ctx) {
        ctx.restore();
    }

    update(dt) {
        throw new Error(`${this.constructor.name} must implement update(dt)`);
    }
}
