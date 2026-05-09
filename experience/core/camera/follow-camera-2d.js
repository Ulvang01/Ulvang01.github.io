import { Camera }  from "./camera.js";
import { AABB }    from "../../utils/aabb.js";
import { Vector2 } from "../../utils/vector2.js";
import { clamp }   from "../../utils/math.js";
import { config }  from "../../config.js";

export class FollowCamera2D extends Camera {
    #target = null;

    #dx = 0;
    #dy = 0;

    #up    = false;
    #down  = false;
    #left  = false;
    #right = false;

    #baseZoom   = 1;
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
        const i  = config.CAMERA_COLLIDER_INSET;
        return new AABB(vp.x + i, vp.y + i, vp.w - i * 2, vp.h - i * 2);
    }

    input(inp) {
        this.#up    = inp.up.down;
        this.#down  = inp.down.down;
        this.#left  = inp.left.down;
        this.#right = inp.right.down;

        if (this.#up   && this.#down)  { this.#up   = false; this.#down  = false; }
        if (this.#left && this.#right) { this.#left = false; this.#right = false; }

        // Drag — screen-pixel delta converted to world units, inverted direction.
        // Applied directly to position, bypassing velocity entirely.
        if (inp.dragDx !== 0 || inp.dragDy !== 0) {
            this.position = new Vector2(
                this.position.x - inp.dragDx / this.zoom,
                this.position.y - inp.dragDy / this.zoom,
            );
        }

        // Zoom out while pointer is held; zoom back on release
        this.#targetZoom = inp.isDragging ? config.CAMERA_DRAG_ZOOM : this.#baseZoom;
    }

    update(dt) {
        this.#move(dt);
        this.#animateZoom(dt);

        if (this.#target) {
            const goal = this.#target.position ?? this.#target;
            const t    = 1 - Math.exp(-config.FOLLOW_LERP_SPEED * dt);
            this.position = this.position.lerp(goal, t);
        }
    }

    #move(dt) {
        const acc     = config.CAMERA_ACC;
        const deacc   = config.CAMERA_DEACC;
        const maxSpeed = config.CAMERA_MAX_SPEED;

        if (this.#up)    this.#dy -= acc * dt;
        if (this.#down)  this.#dy += acc * dt;
        if (this.#left)  this.#dx -= acc * dt;
        if (this.#right) this.#dx += acc * dt;

        this.#dx = clamp(this.#dx, -maxSpeed, maxSpeed);
        this.#dy = clamp(this.#dy, -maxSpeed, maxSpeed);

        if (!this.#left && !this.#right) {
            const dec = deacc * dt;
            if (this.#dx > 0) this.#dx = Math.max(0, this.#dx - dec);
            else              this.#dx = Math.min(0, this.#dx + dec);
        }
        if (!this.#up && !this.#down) {
            const dec = deacc * dt;
            if (this.#dy > 0) this.#dy = Math.max(0, this.#dy - dec);
            else              this.#dy = Math.min(0, this.#dy + dec);
        }

        // single allocation — avoids the intermediate Vector2 from .add()
        this.position = new Vector2(
            this.position.x + this.#dx * dt,
            this.position.y + this.#dy * dt,
        );

        this.#clampToWorld();
    }

    #animateZoom(dt) {
        const t = 1 - Math.exp(-config.CAMERA_ZOOM_LERP_SPEED * dt);
        this.zoom = this.zoom + (this.#targetZoom - this.zoom) * t;
    }

    #clampToWorld() {
        if (!this.worldBounds) return;

        const c  = this.collider;
        const wb = this.worldBounds;
        let { x, y } = this.position;

        if (c.x < wb.x)       { x += wb.x    - c.x;    this.#dx = Math.max(0, this.#dx); }
        if (c.maxX > wb.maxX) { x += wb.maxX - c.maxX; this.#dx = Math.min(0, this.#dx); }
        if (c.y < wb.y)       { y += wb.y    - c.y;    this.#dy = Math.max(0, this.#dy); }
        if (c.maxY > wb.maxY) { y += wb.maxY - c.maxY; this.#dy = Math.min(0, this.#dy); }

        this.position = new Vector2(x, y);
    }
}
