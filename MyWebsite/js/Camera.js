import * as THREE from 'three';

export class Camera extends THREE.PerspectiveCamera {
    constructor(fov, aspectRatio, near, far) {
        super(fov, aspectRatio, near, far);
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z);
    }

    setTarget(x, y, z) {
        this.lookAt(x, y, z);
    }

    setTargetMesh(mesh) {
        this.lookAt(mesh.position);
    }

    updateAspectRatio(aspectRatio) {
        this.aspect = aspectRatio;
        this.updateProjectionMatrix();
    }

    getCamera() {
        return this.camera;
    }
}
