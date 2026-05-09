import { Entity } from "./entity.js";
import { AABB }   from "../utils/aabb.js";

export class Box extends Entity {
    #bounds = null;

    w;
    h;
    color;

    constructor(position, w, h, color = "#ffffff") {
        // Boxes are static — no movement physics
        super(position, Math.max(w, h));
        this.isStatic = true;
        this.w        = w;
        this.h        = h;
        this.color    = color;
    }

    // Override both get and set to invalidate bounds cache on position change
    get position()  { return super.position; }
    set position(v) { super.position = v; this.#bounds = null; }

    get bounds() {
        if (!this.#bounds) {
            const p = this.position;
            this.#bounds = new AABB(
                p.x - this.w * 0.5,
                p.y - this.h * 0.5,
                this.w,
                this.h,
            );
        }
        return this.#bounds;
    }

    update(dt) {}

    draw(ctx) {
        const p = this.position;
        const x = p.x - this.w * 0.5;
        const y = p.y - this.h * 0.5;

        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.w, this.h);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth   = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, this.w - 1, this.h - 1);
    }
}
