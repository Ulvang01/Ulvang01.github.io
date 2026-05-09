export class Key {
    down = false;
    clicked = false;
    #presses = 0;
    #absorbs = 0;

    press() {
        this.down = true;
        this.#presses++;
    }

    release() {
        this.down = false;
    }

    tick() {
        if (this.#absorbs < this.#presses) {
            this.#absorbs++;
            this.clicked = true;
        } else {
            this.clicked = false;
        }
    }

    reset() {
        this.down = false;
        this.clicked = false;
        this.#absorbs = this.#presses; // drain queued clicks — prevents phantom click on refocus
    }
}

export class Input {
    // Movement
    up;
    down;
    left;
    right;

    // Actions
    attack;
    interact;
    menu;

    // Drag — screen-pixel delta consumed each tick, then zeroed
    #dragDx = 0;
    #dragDy = 0;
    #pendingDragDx = 0;
    #pendingDragDy = 0;
    #activePointerId = null;
    #lastPX = 0;
    #lastPY = 0;

    #bindings = new Map();
    #allKeys = [];

    // The element that owns pointer down/move listeners.
    // Keeping a ref lets destroy() remove them from the right target.
    #pointerTarget;

    get dragDx() {
        return this.#dragDx;
    }
    get dragDy() {
        return this.#dragDy;
    }
    get isDragging() {
        return this.#activePointerId !== null;
    }

    // pointerTarget should be the canvas element.
    // Pointer down/move are registered there (non-passive so we can preventDefault),
    // while up/cancel stay on window so a release is never missed.
    constructor(pointerTarget = window) {
        this.#pointerTarget = pointerTarget;

        this.up = this.#addKey();
        this.down = this.#addKey();
        this.left = this.#addKey();
        this.right = this.#addKey();
        this.attack = this.#addKey();
        this.interact = this.#addKey();
        this.menu = this.#addKey();

        this.#bind("KeyW", this.up);
        this.#bind("ArrowUp", this.up);
        this.#bind("KeyS", this.down);
        this.#bind("ArrowDown", this.down);
        this.#bind("KeyA", this.left);
        this.#bind("ArrowLeft", this.left);
        this.#bind("KeyD", this.right);
        this.#bind("ArrowRight", this.right);
        this.#bind("Space", this.attack);
        this.#bind("KeyE", this.interact);
        this.#bind("Escape", this.menu);

        // Stop the browser from handling touch-scroll / pinch-zoom on the canvas.
        // Must be set before any pointer events fire, or the browser may claim
        // the gesture first and send pointercancel instead of pointermove.
        if (pointerTarget instanceof HTMLElement) {
            pointerTarget.style.touchAction = "none";
            pointerTarget.style.userSelect = "none";
        }

        window.addEventListener("keydown", this.#onKeyDown);
        window.addEventListener("keyup", this.#onKeyUp);
        window.addEventListener("blur", this.#onBlur);

        // Non-passive so preventDefault() can suppress native scroll/zoom mid-drag.
        // Down/move on the canvas only — we own that surface.
        pointerTarget.addEventListener("pointerdown", this.#onPointerDown, {
            passive: false,
        });
        pointerTarget.addEventListener("pointermove", this.#onPointerMove, {
            passive: false,
        });

        // Up/cancel on window — ensures release is captured even if the finger
        // slides off the canvas element.
        window.addEventListener("pointerup", this.#onPointerUp);
        window.addEventListener("pointercancel", this.#onPointerUp);
    }

    tick() {
        for (const key of this.#allKeys) key.tick();
        this.#dragDx = this.#pendingDragDx;
        this.#dragDy = this.#pendingDragDy;
        this.#pendingDragDx = 0;
        this.#pendingDragDy = 0;
    }

    destroy() {
        window.removeEventListener("keydown", this.#onKeyDown);
        window.removeEventListener("keyup", this.#onKeyUp);
        window.removeEventListener("blur", this.#onBlur);

        this.#pointerTarget.removeEventListener(
            "pointerdown",
            this.#onPointerDown,
        );
        this.#pointerTarget.removeEventListener(
            "pointermove",
            this.#onPointerMove,
        );

        window.removeEventListener("pointerup", this.#onPointerUp);
        window.removeEventListener("pointercancel", this.#onPointerUp);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    #addKey() {
        const k = new Key();
        this.#allKeys.push(k);
        return k;
    }

    #bind(code, key) {
        this.#bindings.set(code, key);
    }

    #onKeyDown = (e) => {
        if (e.repeat) return;
        this.#bindings.get(e.code)?.press();
    };

    #onKeyUp = (e) => {
        this.#bindings.get(e.code)?.release();
    };

    #onBlur = () => {
        for (const key of this.#allKeys) key.reset();
        this.#activePointerId = null;
        this.#pendingDragDx = 0;
        this.#pendingDragDy = 0;
    };

    // Only track the first pointer — ignore extra fingers/stylus.
    #onPointerDown = (e) => {
        if (this.#activePointerId !== null) return;
        e.preventDefault(); // stop browser claiming the gesture (scroll / zoom)
        this.#activePointerId = e.pointerId;
        this.#lastPX = e.clientX;
        this.#lastPY = e.clientY;
        // Capture the pointer so move/up events keep arriving even if the finger
        // slides off the canvas element entirely.
        e.target.setPointerCapture(e.pointerId);
    };

    #onPointerMove = (e) => {
        if (e.pointerId !== this.#activePointerId) return;
        e.preventDefault();
        this.#pendingDragDx += e.clientX - this.#lastPX;
        this.#pendingDragDy += e.clientY - this.#lastPY;
        this.#lastPX = e.clientX;
        this.#lastPY = e.clientY;
    };

    #onPointerUp = (e) => {
        if (e.pointerId !== this.#activePointerId) return;
        this.#activePointerId = null;
    };
}
