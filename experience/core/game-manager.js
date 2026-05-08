import { PIXEL_RATIO, CAMERA_PADDING, WORLD_W, WORLD_H } from "../config.js";
import { AABB } from "../utils/aabb.js";
import { Vector2 } from "../utils/vector2.js";
import { FollowCamera2D } from "./camera/follow-camera-2d.js";
import { Input } from "./input.js";
import { Box } from "../entities/box.js";

export class GameManager {
    #camera = null;
    #lastW = 0;
    #lastH = 0;
    #entities = [];
    #input = new Input();

    // world is centered at origin
    #worldBounds = new AABB(-WORLD_W / 2, -WORLD_H / 2, WORLD_W, WORLD_H);

    constructor() {
        this.#initEntities();
    }

    #initEntities() {
        this.#entities = [
            new Box(new Vector2(-100, -50), 70, 70, "#4a90d9"),
            new Box(new Vector2(120, 80), 90, 50, "#7ed321"),
            new Box(new Vector2(530, 0), 60, 60, "#f5a623"), // edge
            new Box(new Vector2(-750, 0), 60, 60, "#d0021b"), // outside left
            new Box(new Vector2(0, 380), 60, 60, "#9b59b6"), // outside bottom
        ];
    }

    destroy() {
        this.#input.destroy();
    }

    update(dt) {
        this.#input.tick();
        this.#camera?.input(this.#input);
        this.#camera?.update(dt);
        for (const e of this.#entities) e.update(dt);
    }

    draw(ctx, alpha) {
        const w = ctx.canvas.width / PIXEL_RATIO;
        const h = ctx.canvas.height / PIXEL_RATIO;

        this.#syncCamera(w, h);

        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, w, h);

        this.#camera.apply(ctx);
        this.#drawWorld(ctx);
        this.#camera.restore(ctx);

        this.#drawDebug(ctx);
    }

    #syncCamera(w, h) {
        if (w === this.#lastW && h === this.#lastH) return;
        this.#lastW = w;
        this.#lastH = h;

        const pad = CAMERA_PADDING;
        const screenRect = new AABB(pad, pad, w - pad * 2, h - pad * 2);

        if (!this.#camera) {
            this.#camera = new FollowCamera2D(screenRect);
            this.#camera.worldBounds = this.#worldBounds;
        } else {
            this.#camera.screenRect = screenRect;
        }
    }

    #drawWorld(ctx) {
        // world boundary
        const wb = this.#worldBounds;
        ctx.strokeStyle = "#c8a96e";
        ctx.lineWidth = 2;
        ctx.strokeRect(wb.x, wb.y, wb.w, wb.h);

        // entities — culled against camera viewport
        const viewport = this.#camera.viewport;
        for (const e of this.#entities) {
            if (viewport.intersects(e.bounds)) e.draw(ctx);
        }
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
