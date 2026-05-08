import { AABB } from "../utils/aabb.js";

export class Box {
    #position;
    #bounds = null;

    constructor(position, w, h, color = "#ffffff") {
        this.#position = position;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    get position() {
        return this.#position;
    }
    set position(v) {
        this.#position = v;
        this.#bounds = null;
    }

    get bounds() {
        if (!this.#bounds) {
            this.#bounds = new AABB(
                this.#position.x - this.w * 0.5,
                this.#position.y - this.h * 0.5,
                this.w,
                this.h,
            );
        }
        return this.#bounds;
    }

    update(dt) {}

    draw(ctx) {
        const x = this.#position.x - this.w * 0.5;
        const y = this.#position.y - this.h * 0.5;

        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.w, this.h);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, this.w - 1, this.h - 1);
    }
}
