/**
 * A 3D vector class.
 * @class Vector3
 * @constructor
 * @param {Number} x The x component of the vector.
 * @param {Number} y The y component of the vector.
 * @param {Number} z The z component of the vector.
 */
export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.set(x, y, z);
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setX(x) {
        this.x = x;
    }
    addX(x) {
        this.x += x;
    }

    setY(y) {
        this.y = y;
    }
    addY(y) {
        this.y += y;
    }

    setZ(z) {
        this.z = z;
    }
    addZ(z) {
        this.z += z;
    }

    getVector3() {
        return new Vector3(this.x, this.y, this.z);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZ() {
        return this.z;
    }

    setFromVector3(otherVector) {
        this.x = otherVector.x;
        this.y = otherVector.y;
        this.z = otherVector.z;
    }

    add(otherVector) {
        return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    }

    subtract(otherVector) {
        return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    }

    multiply(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    dotProduct(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
    }

    crossProduct(otherVector) {
        const x = this.y * otherVector.z - this.z * otherVector.y;
        const y = this.z * otherVector.x - this.x * otherVector.z;
        const z = this.x * otherVector.y - this.y * otherVector.x;
        return new Vector3(x, y, z);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const magnitude = this.magnitude();
        return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }
}
