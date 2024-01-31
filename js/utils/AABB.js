import { Vector3 } from "./Vector3f";

export class AABB {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
    }

    setBox(pos, size) {
        this.pos = pos;
        this.size = size;
    }

    setPos(pos) {
        this.pos = pos;
    }

    setSize(size) {
        this.size = size;
    }

    setXOffset(xOffset) {
        this.xOffset = xOffset;
    }

    setYOffset(yOffset) {
        this.yOffset = yOffset;
    }

    setZOffset(zOffset) {
        this.zOffset = zOffset;
    }

    getRight() {
        return this.pos.x + this.size.x / 2 + this.xOffset;
    }

    getLeft() {
        return this.pos.x - this.size.x / 2 + this.xOffset;
    }

    getTop() {
        return this.pos.y + this.size.y / 2 + this.yOffset;
    }

    getBottom() {
        return this.pos.y - this.size.y / 2 + this.yOffset;
    }

    getFront() {
        return this.pos.z + this.size.z / 2 + this.zOffset;
    }

    getBack() {
        return this.pos.z - this.size.z / 2 + this.zOffset;
    }


    collides(otherBox) {
        if (this.getRight() > otherBox.getLeft() &&
            this.getLeft() < otherBox.getRight() &&
            this.getFront() > otherBox.getBack() &&
            this.getBack() < otherBox.getFront()) {
                console.log(otherBox.getLeft());
                console.log(otherBox.pos.x - otherBox.size.x / 2);
                return true;
            }
        return false;
    }

}