import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MyFontLoader } from './FontLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';


export class Text3D extends THREE.Mesh{
    size;
    height;
    text;
    font;

    constructor(text, size, height){
        super();

        this.size = size;
        this.height = height;
        this.text = text;

        const fontLoader = new MyFontLoader();
        if (fontLoader.getFont() == null) {
            console.log("font not loaded");
            return;
        }
        
        this.font = fontLoader.getFont();
        this.geometry = new TextGeometry(text, {
            font: this.font,
            size: size,
            height: height,
            textAlign: "center",
        });
        this.material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        this.position.set(0, 0, 0);
        this.rotation.x = -Math.PI * 0.4;
    }

    setText(text) {
        this.text = text;
        this.geometry = new TextGeometry(text, {
            font: fontLoader.getFont(),
            size: size,
            height: height,
        });
    }

    setSize(size) {
        this.size = size;
        this.geometry = new TextGeometry(text, {
            font: fontLoader.getFont(),
            size: size,
            height: height,
        });
    }

    setHeight(height) {
        this.height = height;
        this.geometry = new TextGeometry(text, {
            font: fontLoader.getFont(),
            size: size,
            height: height,
        });
    }

    setPos(x, y, z) {
        this.position.set(x, y, z);
    }

    setRot(x, y, z) {
        this.rotation.set(x, y, z);
    }

    setMaterial(material) {
        this.material = material;
    }

    setColor(colorHex) {
        this.material.color = new THREE.Color(colorHex);
    }
};