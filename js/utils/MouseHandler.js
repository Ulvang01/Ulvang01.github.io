export class MouseHandler {
    constructor() {
        this.mouse = {
            x: -1,
            y: -1,
            b: -1
        };
        this.scroll = 0;
    }

    getMouse() {
        return this.mouse;
    }

    getX() {
        return this.mouse.x;
    }

    getY() {
        return this.mouse.y;
    }

    getButton() {
        return this.mouse.b;
    }

    mouseDragged(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    mousePressed(event) {
        this.mouse.b = event.button;
        console.log(this.mouse.b);
    }

    mouseReleased(event) {
        this.mouse.b = -1;
    }

    mouseWheel(event) {
        this.scroll = event.deltaY;
    }
    mouseWheelReset() {
        this.scroll = 0;
    }
}
 