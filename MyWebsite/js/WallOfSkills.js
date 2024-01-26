import * as THREE from 'three';

export class WallOfSkills extends THREE.Object3D {
    constructor() {
        super();

        const geometry = new THREE.BoxGeometry(10, 5, 1); // Adjust the dimensions as per your requirements
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Set the color to white
        
        const box = new THREE.Mesh(geometry, material);
        this.add(box);
    }

    setPos(x, y, z) {
        this.position.set(x, y, z);
    }
}