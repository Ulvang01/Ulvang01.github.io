import * as THREE from 'three';

export class Button extends THREE.Mesh{
    isHovered = false;

    constructor(name) {
        super();
        this.geometry = new THREE.PlaneGeometry(2, 1);
        this.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, color: 0xffffff});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.position.set(0, -1, 0);
        this.rotation.x = -Math.PI * 0.5;
        this.name = name;
        this.layers.set(1);

        this.linematerial = new THREE.LineBasicMaterial({ color: 0x000000 });
        this.points = [];
        this.points.push(new THREE.Vector3(-1, 0, 0.2));
        this.points.push(new THREE.Vector3(-1, 0, 1.8));
        this.points.push(new THREE.Vector3(1, 0, 1.8));
        this.points.push(new THREE.Vector3(1, 0, 0.2));
        this.points.push(new THREE.Vector3(-1, 0, 0.2));
    

        this.linegeometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(this.linegeometry, this.linematerial);
        this.line.position.set(0, -1, 0);
        this.line.rotation.x = -Math.PI * 0.5;

        this.add(this.line);
    }

    setPos(x, y, z) {
        this.position.set(x, y, z);
    }

    hover() {
        this.material.color.setHex(0x575757);
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

    setPicTexture(picture) {
        new THREE.TextureLoader().load(picture, (texture) => {
            this.material.map = texture;
            this.material.needsUpdate = true;

        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}