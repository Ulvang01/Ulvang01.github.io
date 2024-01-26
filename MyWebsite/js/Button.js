import * as THREE from 'three';

export class Button extends THREE.Mesh{

    constructor(name) {
        super();
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.position.set(0, -1, 0);
        this.rotation.x = -Math.PI * 0.5;
        this.name = name;
    }

    setPos(x, y, z) {
        this.position.set(x, y, z);
    }

    hover() {
        this.material.color.setHex(0xff0000);
    }

    unhover() {
        this.material.color.setHex(0xffffff);
    }

    getType() {
        return "button";
    }

    getName() {
        return this.name;
    }
}