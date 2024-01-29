import * as THREE from 'three';

export class WallOfSkills extends THREE.Object3D {
    constructor() {
        super();
        
    }

    setPos(x, y, z) {
        this.position.set(x, y, z);
    }
}