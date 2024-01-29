import * as THREE from 'three';

export class Button extends THREE.Mesh{
    isHovered = false;

    constructor(name, size) {
        super();
        this.geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, color: 0xffffff});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.position.set(0, -1, 0);
        this.rotation.x = -Math.PI * 0.5;
        this.name = name;
        this.layers.set(1);

        const bordergeometry = new THREE.BoxGeometry(size.x + 0.1, 0.1, 0.1);
        const bordermaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 1, color: 0x34363b});
        const bordermesh = new THREE.Mesh(bordergeometry, bordermaterial);
        bordermesh.position.set(0, -size.y / 2, 0);
        this.add(bordermesh);

        const bordergeometry2 = new THREE.BoxGeometry(size.x + 0.1, 0.1, 0.1);
        const bordermaterial2 = new THREE.MeshStandardMaterial({ transparent: true, opacity: 1, color: 0x34363b});
        const bordermesh2 = new THREE.Mesh(bordergeometry2, bordermaterial2);
        bordermesh2.position.set(0, size.y / 2, 0);
        this.add(bordermesh2);

        const bordergeometry3 = new THREE.BoxGeometry(0.1, size.y + 0.1, 0.1);
        const bordermaterial3 = new THREE.MeshStandardMaterial({ transparent: true, opacity: 1, color: 0x34363b});
        const bordermesh3 = new THREE.Mesh(bordergeometry3, bordermaterial3);
        bordermesh3.position.set(-size.x / 2, 0, 0);
        this.add(bordermesh3);

        const bordergeometry4 = new THREE.BoxGeometry(0.1, size.y + 0.1, 0.1);
        const bordermaterial4 = new THREE.MeshStandardMaterial({ transparent: true, opacity: 1, color: 0x34363b});
        const bordermesh4 = new THREE.Mesh(bordergeometry4, bordermaterial4);
        bordermesh4.position.set(size.x / 2, 0, 0);
        this.add(bordermesh4);
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