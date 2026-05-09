import { Entity } from "./entity.js";
import { AABB } from "../utils/aabb.js";
import { config } from "../config.js";

export class Player extends Entity {
    #bounds = null;
    #lifted = false;
    #sliding = false;

    constructor(position) {
        super(
            position,
            config.PLAYER_RADIUS,
            config.PLAYER_MAX_SPEED,
            config.PLAYER_ACC,
            config.PLAYER_DEACC,
        );
    }

    get shape() {
        return "circle";
    }
    get radius() {
        return this.size;
    }

    get lifted() {
        return this.#lifted;
    }
    set lifted(v) {
        this.#lifted = v;
        this.collidable = !v;
        // Picking up always cancels the sliding state
        if (v) this.sliding = false;
    }

    get sliding() {
        return this.#sliding;
    }
    set sliding(v) {
        this.#sliding = v;
        // correctionRate = 0: collision system applies no positional correction,
        // but still runs dampVelocity to stop the player going deeper.
        // The actual exit force is applied as velocity by GameManager each tick.
        this.correctionRate = v ? 0 : 1.0;
    }

    // Override both get and set — required in JS when a parent defines the pair.
    // The setter nulls the bounds cache; super.position = v writes the backing field.
    get position() {
        return super.position;
    }
    set position(v) {
        super.position = v;
        this.#bounds = null;
    }

    get bounds() {
        if (!this.#bounds) {
            const p = this.position;
            this.#bounds = AABB.fromCircle(p.x, p.y, this.size);
        }
        return this.#bounds;
    }

    input(inp) {
        this.up = inp.up.down;
        this.down = inp.down.down;
        this.left = inp.left.down;
        this.right = inp.right.down;
    }

    // Always called each tick regardless of drag/sliding state.
    // Handles visual animation and (when applicable) movement physics.
    update(dt) {
        this.maxSpeed = config.PLAYER_MAX_SPEED;
        this.acc = config.PLAYER_ACC;
        this.deacc = config.PLAYER_DEACC;

        // Animate radius between normal and lifted size
        const baseR = config.PLAYER_RADIUS;
        const targetR = this.#lifted ? baseR * config.PLAYER_LIFT_SCALE : baseR;
        const t = 1 - Math.exp(-config.PLAYER_LIFT_LERP * dt);
        this.size = this.size + (targetR - this.size) * t;
        this.#bounds = null; // size changed — invalidate

        if (!this.#lifted) {
            if (this.#sliding) {
                // No keyboard control.
                // Zero deacc so the exit velocity from GameManager isn't fought by friction.
                this.up = this.down = this.left = this.right = false;
                this.deacc = 0;
            }
            this._stepMovement(dt);
        }
    }

    draw(ctx) {
        const p = this.position;
        const r = this.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#e8e8e8";
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}
