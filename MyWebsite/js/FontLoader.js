import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export class MyFontLoader {
    static font = null;

    constructor() {
        this.loader = new FontLoader();
    }

    loadFont(fontName) {
        console.log("loading font: " + fontName);
        this.loader.load(fontName, function (font) {
            console.log("font loaded");
            MyFontLoader.font = font;
        });
    }

    getFont() {
        return MyFontLoader.font;
    }
}
