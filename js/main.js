import '../style.css';

import * as THREE from 'three';
import { MyFontLoader } from './graphics/FontLoader';
import { addDiv, deleteDiv } from './objects/TextPrompt';
import { pcScene } from './scenes/pcScene';
import { mobileScene } from './scenes/mobileScene';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

var scene;
var renderer;
var camera;

async function init() {
    const scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

    const canvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);

    camera.position.z = 5;

    const animate = function () {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    };
    animate();

    addDiv("loading");
    const fontLoader = new MyFontLoader();
    await fontLoader.loadFont("/fonts/Cabin_Regular.json");
    deleteDiv();

    const regex = /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (regex.test(navigator.userAgent)) {
        addDiv("mobile");
    } else {
        addDiv("desktop");
    }
}   

init();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    renderer.setSize(sizes.width, sizes.height);
    camera.updateProjectionMatrix();
});