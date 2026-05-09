export class AABB {
    // x, y: top-left corner in world space
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get maxX() {
        return this.x + this.w;
    }
    get maxY() {
        return this.y + this.h;
    }
    get centerX() {
        return this.x + this.w * 0.5;
    }
    get centerY() {
        return this.y + this.h * 0.5;
    }

    // point: { x, y }
    contains(point) {
        return (
            point.x >= this.x &&
            point.x <= this.maxX &&
            point.y >= this.y &&
            point.y <= this.maxY
        );
    }

    intersects(other) {
        return (
            this.x < other.maxX &&
            this.maxX > other.x &&
            this.y < other.maxY &&
            this.maxY > other.y
        );
    }

    // Returns a new AABB shifted by a Vector2
    translate(v) {
        return new AABB(this.x + v.x, this.y + v.y, this.w, this.h);
    }

    // Returns a new AABB expanded outward by `margin` on all sides
    expand(margin) {
        return new AABB(this.x - margin, this.y - margin, this.w + margin * 2, this.h + margin * 2);
    }

    // Convenience: tight AABB around a circle
    static fromCircle(cx, cy, r) {
        return new AABB(cx - r, cy - r, r * 2, r * 2);
    }
}
