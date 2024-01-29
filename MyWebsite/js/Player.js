import * as THREE from "three";
import { Vector2 } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Player {

    constructor() {
        const person = new THREE.Group();
        person.type = "player";
        this.mixer;
        this.walkAction;
        this.stillAction;
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/js/models/person.glb', (gltf) => {
            const model = gltf.scene;
            person.add(model);
            this.mixer = new THREE.AnimationMixer(model);
            this.walkAction = this.mixer.clipAction(gltf.animations[3]);
            this.stillAction = this.mixer.clipAction(gltf.animations[1]);
        });
        this.mesh = person;
        this.mesh.scale.set(0.6, 0.6, 0.6);
        this.mesh.position.set(0, 2, 0);
        this.speed = new Vector2(0, 0);
        this.isPickedUp = false;
        this.maxSpeed = 0.2;
        this.acceleration = 0.05;
        this.deacceleration = 0.1;

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

        if (Math.abs(this.speed.x) > 0.01 || Math.abs(this.speed.y) > 0.01){
            this.mesh.rotation.y = -Math.atan2(this.speed.y, this.speed.x) + Math.PI * 0.5;
        }
    
        if (this.mixer != undefined) {
            this.mixer.update(0.15 * Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y));
            if (Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y) == 0){
                this.walkAction.stop();
                this.stillAction.play();
            }
            else {
                this.stillAction.stop();
                this.walkAction.play();
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
        this.mesh.position.y = 4;
    }

    drop() {
        this.isPickedUp = false;
        this.mesh.position.y = 2;
    }

    setPos(x, y, z) {
        this.mesh.position.set(x, y, z);
    }
}