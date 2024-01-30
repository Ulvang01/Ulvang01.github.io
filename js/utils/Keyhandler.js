export class KeyHandler {
    constructor() {
        this.keys = {
            w: new Key("w"),
            a: new Key("a"),
            s: new Key("s"),
            d: new Key("d"),
            space: new Key("space"),
            shift: new Key("shift"),
            ctrl: new Key("ctrl"),
            r: new Key("r")
        };
    }

    toggleKey(key, isPressed) {
        switch (key) {
            case "w":
            case "ArrowUp":
                this.keys["w"].toggle(isPressed);
                break;
            case "a":
            case "ArrowLeft":
                this.keys["a"].toggle(isPressed);
                break;
            case "s":
            case "ArrowDown":
                this.keys["s"].toggle(isPressed);
                break;
            case "d":
            case "ArrowRight":
                this.keys["d"].toggle(isPressed);
                break;
            case " ":
                this.keys["space"].toggle(isPressed);
                break;
            case "Shift":
                this.keys["shift"].toggle(isPressed);
                break;
            case "Control":
                this.keys["ctrl"].toggle(isPressed);
                break;
            case "r":
                this.keys["r"].toggle(isPressed);
                break;
        }
    }
}

class Key {
    constructor(key) {
        this.key = key;
        this.presses = 0;
        this.absorbs = 0;
        this.down = false;
        this.clicked = false;
    }
    toggle(pressed) {
        if (pressed != this.down) {
            this.down = pressed;
        }
        if (pressed) {
            this.presses++;
        }
    }
    update() {
        if (this.absorbs < this.presses) {
            this.absorbs++;
            this.clicked = true;
        } else {
            this.clicked = false;
        }
    }
}