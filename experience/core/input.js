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
        this.#absorbs = this.#presses; // drain any queued clicks — prevents phantom click on refocus
    }
}

export class Input {
    // movement
    up;
    down;
    left;
    right;

    // actions
    attack;
    interact;
    menu;

    #bindings = new Map();
    #allKeys = [];

    constructor() {
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

        window.addEventListener("keydown", this.#onKeyDown);
        window.addEventListener("keyup", this.#onKeyUp);
        window.addEventListener("blur", this.#onBlur);
    }

    tick() {
        for (const key of this.#allKeys) key.tick();
    }

    destroy() {
        window.removeEventListener("keydown", this.#onKeyDown);
        window.removeEventListener("keyup", this.#onKeyUp);
        window.removeEventListener("blur", this.#onBlur);
    }

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
    };
}
