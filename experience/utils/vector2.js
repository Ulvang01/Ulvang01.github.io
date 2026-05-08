export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    scale(s) {
        return new Vector2(this.x * s, this.y * s);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        const l = this.length();
        return l > 0 ? this.scale(1 / l) : new Vector2();
    }

    lerp(v, t) {
        return new Vector2(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t,
        );
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    static zero() {
        return new Vector2(0, 0);
    }
    static one() {
        return new Vector2(1, 1);
    }
    static up() {
        return new Vector2(0, -1);
    }
    static down() {
        return new Vector2(0, 1);
    }
    static left() {
        return new Vector2(-1, 0);
    }
    static right() {
        return new Vector2(1, 0);
    }
}
