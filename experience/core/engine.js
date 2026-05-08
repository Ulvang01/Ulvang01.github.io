import { TPS, MAX_FRAME_MS } from "../config.js";

const TICK_MS = 1000 / TPS;
const TICK_S = TICK_MS / 1000;

export class Engine {
    #gm;
    #ctx;
    #canvasCleanup;
    #accumulator = 0;
    #lastTime = null;
    #rafId = null;

    constructor(ctx, gameManager, canvasCleanup = null) {
        this.#ctx = ctx;
        this.#gm = gameManager;
        this.#canvasCleanup = canvasCleanup;
    }

    start() {
        this.#rafId = requestAnimationFrame(this.#loop);
    }

    stop() {
        if (this.#rafId !== null) cancelAnimationFrame(this.#rafId);
        this.#rafId = null;
        this.#gm.destroy?.();
        this.#canvasCleanup?.();
    }

    #loop = (timestamp) => {
        if (this.#lastTime === null) this.#lastTime = timestamp;

        let frameMs = timestamp - this.#lastTime;
        this.#lastTime = timestamp;

        if (frameMs > MAX_FRAME_MS) frameMs = MAX_FRAME_MS;
        this.#accumulator += frameMs;

        try {
            while (this.#accumulator >= TICK_MS) {
                this.#gm.update(TICK_S);
                this.#accumulator -= TICK_MS;
            }
            this.#gm.draw(this.#ctx, this.#accumulator / TICK_MS);
        } catch (err) {
            console.error(
                "[Engine] Fatal error in game loop — engine stopped.",
                err,
            );
            this.stop();
            return;
        }

        this.#rafId = requestAnimationFrame(this.#loop);
    };
}
