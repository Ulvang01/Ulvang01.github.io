import * as THREE from "three";
import { Vector2 } from "three";

export class Player {
    constructor() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({ color: 0x271f86 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.speed = new Vector2(0, 0);
        this.isPickedUp = false;
        this.maxSpeed = 0.5;
        this.acceleration = 0.1;
        this.deacceleration = 0.2;

        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    move() {
        if (this.isPickedUp) {
            return;
        }
        if (this.up) {
            this.speed.y -= this.acceleration;
            if (this.speed.y < -this.maxSpeed) {
                this.speed.y = -this.maxSpeed;
            }
        } else if (this.speed.y < 0) {
            this.speed.y += this.deacceleration;
            if (this.speed.y > 0) {
                this.speed.y = 0;
            }
        }
        if (this.down) {
            this.speed.y += this.acceleration;
            if (this.speed.y > this.maxSpeed) {
                this.speed.y = this.maxSpeed;
            }
        } else if (this.speed.y > 0) {
            this.speed.y -= this.deacceleration;
            if (this.speed.y < 0) {
                this.speed.y = 0;
            }
        }
        if (this.left) {
            this.speed.x -= this.acceleration;
            if (this.speed.x < -this.maxSpeed) {
                this.speed.x = -this.maxSpeed;
            }
        } else if (this.speed.x < 0) {
            this.speed.x += this.deacceleration;
            if (this.speed.x > 0) {
                this.speed.x = 0;
            }
        }
        if (this.right) {
            this.speed.x += this.acceleration;
            if (this.speed.x > this.maxSpeed) {
                this.speed.x = this.maxSpeed;
            }
        } else if (this.speed.x > 0) {
            this.speed.x -= this.deacceleration;
            if (this.speed.x < 0) {
                this.speed.x = 0;
            }
        }


        this.mesh.position.x += this.speed.x;
        this.mesh.position.z += this.speed.y;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    addSpeed(speed) {
        this.speed.add(speed);
    }

    pickUp() {
        this.isPickedUp = true;
        this.mesh.position.y += 2;
    }

    drop() {
        this.isPickedUp = false;
        this.mesh.position.y -= 2;
    }

    setPos(x, y, z) {
        this.mesh.position.set(x, y, z);
    }
}