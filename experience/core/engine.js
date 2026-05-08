import { TPS, MAX_FRAME_MS } from "../config.js";

const TICK_MS = 1000 / TPS;
const TICK_S = TICK_MS / 1000;

export class Engine {
    #gm;
    #ctx;
    #accumulator = 0;
    #lastTime = null;
    #rafId = null;

    constructor(ctx, gameManager) {
        this.#ctx = ctx;
        this.#gm = gameManager;
    }

    start() {
        this.#rafId = requestAnimationFrame(this.#loop);
    }

    stop() {
        if (this.#rafId !== null) cancelAnimationFrame(this.#rafId);
        this.#rafId = null;
        this.#gm.destroy?.();
    }

    #loop = (timestamp) => {
        if (this.#lastTime === null) this.#lastTime = timestamp;

        let frameMs = timestamp - this.#lastTime;
        this.#lastTime = timestamp;

        if (frameMs > MAX_FRAME_MS) frameMs = MAX_FRAME_MS;

        this.#accumulator += frameMs;

        while (this.#accumulator >= TICK_MS) {
            this.#gm.update(TICK_S);
            this.#accumulator -= TICK_MS;
        }

        // alpha: sub-tick fraction [0, 1) — available for interpolation later
        this.#gm.draw(this.#ctx, this.#accumulator / TICK_MS);

        this.#rafId = requestAnimationFrame(this.#loop);
    };
}
