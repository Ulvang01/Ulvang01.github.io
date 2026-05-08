import { AABB } from "../utils/aabb.js";

export class Box {
    // position: Vector2 — center of the box in world space
    constructor(position, w, h, color = "#ffffff") {
        this.position = position;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    // World-space AABB — used for culling and future collision
    get bounds() {
        return new AABB(
            this.position.x - this.w * 0.5,
            this.position.y - this.h * 0.5,
            this.w,
            this.h,
        );
    }

    update(dt) {}

    draw(ctx) {
        const x = this.position.x - this.w * 0.5;
        const y = this.position.y - this.h * 0.5;

        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.w, this.h);

        // outline so edges are clear against any background
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, this.w - 1, this.h - 1);
    }
}
