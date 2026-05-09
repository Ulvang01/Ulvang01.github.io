import { Scene } from "../core/scene.js";
import { GameManager } from "../core/game-manager.js";

// The main gameplay scene.
// Thin wrapper around GameManager for now — as the game grows,
// scene-specific setup (loading assets, spawning UI, etc.) lives here.

export class PlayScene extends Scene {
    #canvas;
    #gm = null;

    constructor(canvas) {
        super();
        this.#canvas = canvas;
    }

    init() {
        this.#gm = new GameManager(this.#canvas);
    }

    destroy() {
        this.#gm?.destroy();
        this.#gm = null;
    }

    update(dt) {
        this.#gm?.update(dt);
    }
    draw(ctx, alpha) {
        this.#gm?.draw(ctx, alpha);
    }
}
