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

    // called once per tick — advances clicked state
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

    #bindings = new Map(); // e.code string -> Key
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

    // tick all keys — call once per game tick before any update logic reads input
    tick() {
        for (const key of this.#allKeys) key.tick();
    }

    // remove listeners — call if the engine is stopped
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

    // e.code is physical key position — layout-independent (WASD stays WASD on AZERTY etc.)
    // e.repeat is true when the OS fires key-held repeats — ignore them so one press = one click
    #onKeyDown = (e) => {
        if (e.repeat) return;
        this.#bindings.get(e.code)?.press();
    };

    #onKeyUp = (e) => {
        this.#bindings.get(e.code)?.release();
    };

    // release everything if window loses focus — prevents stuck keys on alt-tab
    #onBlur = () => {
        for (const key of this.#allKeys) key.reset();
    };
}
