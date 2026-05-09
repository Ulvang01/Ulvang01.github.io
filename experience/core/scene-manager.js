// Manages the single active scene.
// Implements the same update / draw / destroy interface as GameManager so the
// Engine doesn't need to know about scenes at all.
//
// Usage:
//   const sm = new SceneManager();
//   sm.go(new PlayScene());
//
//   // Later, from anywhere (e.g. via Events):
//   sm.go(new MenuScene());

export class SceneManager {
    #scene = null;

    // Replace the active scene. The outgoing scene's destroy() is called first,
    // then the incoming scene's init(). Safe to call with no active scene.
    go(scene) {
        this.#scene?.destroy();
        this.#scene = scene;
        this.#scene.init();
    }

    get current() {
        return this.#scene;
    }

    // ── Engine interface ──────────────────────────────────────────────────────

    update(dt) {
        this.#scene?.update(dt);
    }
    draw(ctx, alpha) {
        this.#scene?.draw(ctx, alpha);
    }
    destroy() {
        this.#scene?.destroy();
        this.#scene = null;
    }
}
