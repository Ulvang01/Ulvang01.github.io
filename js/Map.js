import * as THREE from 'three';

export class Map {
    constructor() {
        this.geometry = new THREE.PlaneGeometry(1000, 1000);
        this.material = new THREE.MeshStandardMaterial({ 
            transparent: true,
            opacity: 1,
            color: 0x226b02,
            roughness: 1,
            metalness: 0,
        });
        const texture = new THREE.TextureLoader().load('/pictures/grass.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 100);
        this.material.map = texture;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, -1, 0);
        this.mesh.rotation.x = -Math.PI * 0.5;
    }
}

