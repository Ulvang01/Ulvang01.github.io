import * as THREE from 'three';

export class Camera extends THREE.PerspectiveCamera {
    constructor(fov, aspectRatio, near, far) {
        super(fov, aspectRatio, near, far);
        this.target = null;
        this.maxspeed = 0.2;
        this.lastPosition = new THREE.Vector3(0, 0, 0);
        this.offsett = new THREE.Vector3(0, 5, 3);
        this.acceleration = 0.04;
        this.deacceleration = 0.1;
        this.speed = new THREE.Vector3(0, 0, 0);
        this.noOffsett = new THREE.Vector3(0, 0, 0);
    }

    move() {
        this.position.set(this.target.position.x, this.target.position.y, this.target.position.z);
        this.position.add(this.offsett);
    }

    update() {
        this.lookAt(this.target.position);
    }

    setTarget(target) {
        if (target == undefined || target == null) {
            this.lookAt(this.target.position);
            this.target = target;
        }
        this.target = target;
    }

    input(mouse) {
        this.addOffsett(0, mouse.scroll * 0.01, mouse.scroll * 0.006);
        mouse.mouseWheelReset();
    }

    setOffsett(x, y, z) {
        this.offsett.set(x, y, z);
    }

    addOffsett(x, y, z) {
        this.offsett.add(new THREE.Vector3(x, y, z));
        if (this.offsett.y < 5) {
            this.offsett.y = 5;
        } else if (this.offsett.y > 20) {
            this.offsett.y = 20;
        }
        if (this.offsett.z < 3) {
            this.offsett.z = 3;
        } else if (this.offsett.z > 12) {
            this.offsett.z = 12;
        }
    }


    updateAspectRatio(aspectRatio) {
        this.aspect = aspectRatio;
        this.updateProjectionMatrix();
    }

    addLayer(layer) {
        this.layers.enable(layer);
    }

    removeLayer(layer) {
        this.layers.disable(layer);
    }

    getCamera() {
        return this.camera;
    }

    getTarget() {
        return this.target;
    }
}
