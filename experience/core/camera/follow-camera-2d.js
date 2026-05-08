import { Camera } from "./camera.js";
import { AABB } from "../../utils/aabb.js";
import { Vector2 } from "../../utils/vector2.js";
import { clamp } from "../../utils/math.js";
import {
    FOLLOW_LERP_SPEED,
    CAMERA_COLLIDER_INSET,
    CAMERA_ACC,
    CAMERA_DEACC,
    CAMERA_MAX_SPEED,
} from "../../config.js";

export class FollowCamera2D extends Camera {
    #target = null;
    #lerpSpeed;
    #colliderInset;

    #dx = 0;
    #dy = 0;

    #accX;
    #accY;
    #deaccX;
    #deaccY;
    #maxDx;
    #maxDy;

    #up = false;
    #down = false;
    #left = false;
    #right = false;

    worldBounds = null;

    constructor(
        screenRect,
        lerpSpeed = FOLLOW_LERP_SPEED,
        colliderInset = CAMERA_COLLIDER_INSET,
    ) {
        super(screenRect);
        this.#lerpSpeed = lerpSpeed;
        this.#colliderInset = colliderInset;
        this.#accX = CAMERA_ACC;
        this.#accY = CAMERA_ACC;
        this.#deaccX = CAMERA_DEACC;
        this.#deaccY = CAMERA_DEACC;
        this.#maxDx = CAMERA_MAX_SPEED;
        this.#maxDy = CAMERA_MAX_SPEED;
    }

    setTarget(target) {
        this.#target = target;
    }

    get collider() {
        const vp = this.viewport;
        const i = this.#colliderInset;
        return new AABB(vp.x + i, vp.y + i, vp.w - i * 2, vp.h - i * 2);
    }

    input(inp) {
        this.#up = inp.up.down;
        this.#down = inp.down.down;
        this.#left = inp.left.down;
        this.#right = inp.right.down;

        if (this.#up && this.#down) {
            this.#up = false;
            this.#down = false;
        }
        if (this.#left && this.#right) {
            this.#left = false;
            this.#right = false;
        }
    }

    update(dt) {
        this.#move(dt);

        if (this.#target) {
            const goal = this.#target.position ?? this.#target;
            const t = 1 - Math.exp(-this.#lerpSpeed * dt);
            this.position = this.position.lerp(goal, t);
        }
    }

    #move(dt) {
        if (this.#up) this.#dy -= this.#accY * dt;
        if (this.#down) this.#dy += this.#accY * dt;
        if (this.#left) this.#dx -= this.#accX * dt;
        if (this.#right) this.#dx += this.#accX * dt;

        this.#dx = clamp(this.#dx, -this.#maxDx, this.#maxDx);
        this.#dy = clamp(this.#dy, -this.#maxDy, this.#maxDy);

        if (!this.#left && !this.#right) {
            const dec = this.#deaccX * dt;
            if (this.#dx > 0) this.#dx = Math.max(0, this.#dx - dec);
            else this.#dx = Math.min(0, this.#dx + dec);
        }
        if (!this.#up && !this.#down) {
            const dec = this.#deaccY * dt;
            if (this.#dy > 0) this.#dy = Math.max(0, this.#dy - dec);
            else this.#dy = Math.min(0, this.#dy + dec);
        }

        // single allocation — avoids the intermediate Vector2 from .add()
        this.position = new Vector2(
            this.position.x + this.#dx * dt,
            this.position.y + this.#dy * dt,
        );

        this.#clampToWorld();
    }

    #clampToWorld() {
        if (!this.worldBounds) return;

        const c = this.collider;
        const wb = this.worldBounds;
        let { x, y } = this.position;

        if (c.x < wb.x) {
            x += wb.x - c.x;
            this.#dx = Math.max(0, this.#dx);
        }
        if (c.maxX > wb.maxX) {
            x += wb.maxX - c.maxX;
            this.#dx = Math.min(0, this.#dx);
        }
        if (c.y < wb.y) {
            y += wb.y - c.y;
            this.#dy = Math.max(0, this.#dy);
        }
        if (c.maxY > wb.maxY) {
            y += wb.maxY - c.maxY;
            this.#dy = Math.min(0, this.#dy);
        }

        this.position = new Vector2(x, y);
    }
}
