import { Camera } from "./camera.js";
import { AABB } from "../../utils/aabb.js";
import { Vector2 } from "../../utils/vector2.js";
import { config } from "../../config.js";

export class FollowCamera2D extends Camera {
    #target = null;

    #isDragging = false;
    #baseZoom = 1;
    #targetZoom = 1;

    worldBounds = null;

    constructor(screenRect) {
        super(screenRect);
    }

    setTarget(target) {
        this.#target = target;
    }

    get collider() {
        const vp = this.viewport;
        const i = config.CAMERA_COLLIDER_INSET;
        return new AABB(vp.x + i, vp.y + i, vp.w - i * 2, vp.h - i * 2);
    }

    input(inp) {
        this.#isDragging = inp.isDragging;

        // Drag — screen-pixel delta converted to world units, inverted direction.
        // Camera leads during drag; follow lerp is suppressed in update().
        if (inp.dragDx !== 0 || inp.dragDy !== 0) {
            this.position = new Vector2(
                this.position.x - inp.dragDx / this.zoom,
                this.position.y - inp.dragDy / this.zoom,
            );
        }

        // Zoom out while pointer is held; zoom back on release
        this.#targetZoom = inp.isDragging
            ? config.CAMERA_DRAG_ZOOM
            : this.#baseZoom;
    }

    update(dt) {
        // During drag the camera is the leader — skip follow lerp so the
        // player can hang behind the camera position instead of the reverse.
        if (this.#target && !this.#isDragging) {
            const goal = this.#target.position ?? this.#target;
            const t = 1 - Math.exp(-config.FOLLOW_LERP_SPEED * dt);
            this.position = this.position.lerp(goal, t);
        }

        this.#clampToWorld();
        this.#animateZoom(dt);
    }

    #animateZoom(dt) {
        const t = 1 - Math.exp(-config.CAMERA_ZOOM_LERP_SPEED * dt);
        this.zoom = this.zoom + (this.#targetZoom - this.zoom) * t;
    }

    #clampToWorld() {
        if (!this.worldBounds) return;

        const c = this.collider;
        const wb = this.worldBounds;
        let { x, y } = this.position;

        if (c.x < wb.x) x += wb.x - c.x;
        if (c.maxX > wb.maxX) x += wb.maxX - c.maxX;
        if (c.y < wb.y) y += wb.y - c.y;
        if (c.maxY > wb.maxY) y += wb.maxY - c.maxY;

        this.position = new Vector2(x, y);
    }
}
