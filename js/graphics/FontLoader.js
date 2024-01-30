import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export class MyFontLoader {
    static font = null;

    constructor() {
        this.loader = new FontLoader();
    }

    getProgress() {
        return this.loader.loadProgress;
    }

    loadFont(fontName) {
        console.log("loading font: " + fontName);
        this.loader.load(fontName, function (font) {
            MyFontLoader.font = font;
        });
    }



    getFont() {
        return MyFontLoader.font;
    }
}
