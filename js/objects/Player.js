import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AABB } from "../utils/AABB";

export class Player {

    constructor() {
        const person = new THREE.Group();
        person.type = "player";
        this.mixer;
        this.walkAction;
        this.stillAction;
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/models/person.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.6, 0.6, 0.6);
            person.add(model);
            this.mixer = new THREE.AnimationMixer(model);
            this.walkAction = this.mixer.clipAction(gltf.animations[3]);
            this.stillAction = this.mixer.clipAction(gltf.animations[2]);
        });
        this.mesh = person;
        this.mesh.position.set(0, 4, 0);

        this.speed = new THREE.Vector2(0, 0);
        this.fallingSpeed = 0;
        this.maxSpeed = 0.2;
        this.acceleration = 0.05;
        this.deacceleration = 0.1;

        this.aabb = new AABB(this.mesh.position, 
            new THREE.Vector3(1.2,3,1.2));
        this.aabb.type = "player";
        console.log(this.aabb.size.x, this.aabb.size.y, this.aabb.size.z);
        this.hitgeometry = new THREE.BoxGeometry(this.aabb.size.x, this.aabb.size.y, this.aabb.size.z);
        this.hitmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.2, transparent: true});
        this.hitcube = new THREE.Mesh(this.hitgeometry, this.hitmaterial);
        this.hitcube.name = "hitcube"
        this.hitcube.layers.set(11);
        person.add(this.hitcube);

            
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.grounded = false;
    }

    move() {
        if (this.isPickedUp) {
            return;
        }
        if (!this.grounded) {
            if (this.fallingSpeed > 0.2) {
                this.fallingSpeed = 0.2;
            }
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
            this.mixer.update(0.17 * Math.max(Math.abs(this.speed.x), Math.abs(this.speed.y)));
            if (Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y) == 0){
                this.walkAction.stop();
                this.stillAction.play();
            }
            else {
                this.stillAction.stop();
                this.walkAction.play();
            }
        }

    }

    resetPos() {
        this.mesh.position.set(0, 2, 0);
        this.isGrounded = false;
    }

    update() {
        this.mesh.position.x += this.speed.x;
        this.mesh.position.z += this.speed.y;
        if (this.grounded) {
            this.fallingSpeed = 0;
        }
        this.mesh.position.y -= this.fallingSpeed;
        if (this.mesh.position.y < -10) {
            this.resetPos();
        }
    }

    input (keys, mouse) {
        this.up = keys.keys["w"].down;
        this.down = keys.keys["s"].down;
        this.left = keys.keys["a"].down;
        this.right = keys.keys["d"].down;
        if (this.up && this.down) {
            this.up = false;
            this.down = false;
        }
        if (this.left && this.right) {
            this.left = false;
            this.right = false;
        }
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    addSpeed(speed) {
        this.speed.add(speed);
    }

    setPos(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    isGrounded() {
        return this.grounded;
    }

    groundedCheck(scene) {
        let raycaster = new THREE.Raycaster(this.mesh.position, new THREE.Vector3(0, -1, 0), 0, 2);
        var objects;
        scene.children.forEach(element => {
            if (element.name == "groundGroup") {
                objects = element.children;
            }
        });
        if (objects == undefined || objects == null) {
            this.grounded = false;
            return;
        }
        let intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            this.grounded = true;
        } else {
            this.grounded = false;
        }
        
    }

    collisionCheck(newAABB) {
        this.aabb.setXOffset(this.speed.x);
        if (this.aabb.collides(newAABB)) {
            this.speed.x = 0;
        }
        this.aabb.setXOffset(0);
        this.aabb.setZOffset(this.speed.y);
        if (this.aabb.collides(newAABB)) {
            this.speed.y = 0;
        }
        this.aabb.setZOffset(0);
    }
}