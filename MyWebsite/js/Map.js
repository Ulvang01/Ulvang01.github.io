import * as THREE from 'three';

export class Map {
    constructor() {
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, -1, 0);
        this.mesh.rotation.x = -Math.PI * 0.5;
    }

    move() {
        this.mesh.position.x += this.speed;
    }
}

