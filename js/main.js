import '../style.css';

import * as THREE from 'three';
import { MyFontLoader } from './graphics/FontLoader';
import { addDiv, deleteDiv } from './objects/TextPrompt';
import { PcState } from './states/pcState';
import { MobileState } from './states/mobileState';
import { State } from './states/state';
import { AABB } from './utils/AABB.js';
import { KeyHandler } from './utils/Keyhandler.js';
import { MouseHandler } from './utils/MouseHandler.js';
import { Player } from './objects/Player.js';
import { Camera } from './utils/Camera.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const layers = {
    default: 0,
    raycast: 1,
    ground: 2,
    floor1: 3,
    floor2: 4,
    roof: 5,
    hitbox: 9,
    gui: 10
};

var scene = new THREE.Scene();
var state = new State(scene);
var renderer;
var camera;
var keyHandler;
var mouseHandler;
var player;
var running = false

var collisionGroup = [];

async function init() {
    keyHandler = new KeyHandler();
    mouseHandler = new MouseHandler();

    camera = new Camera(75, sizes.width / sizes.height, 0.1, 100);

    const canvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);

    camera.position.z = 10;

    addDiv("loading");
    const fontLoader = new MyFontLoader();
    await fontLoader.loadFont("/fonts/Cabin_Regular.json");
    deleteDiv();

    const regex = /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (regex.test(navigator.userAgent)) {
        state = new MobileState(scene);
        console.log("mobile");
    } else {
        state = new PcState(scene);
        console.log("pc");
    }

    player = new Player();
    scene.add(player.mesh);
    player.mesh.layers.set(11);
    camera.setTarget(player.mesh);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/models/playground.glb', (gltf) => {
        var models = gltf.scene
        models.position.set(200, 0, -200);
        scene.add(models);
    });

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    scene.add(groundGroup);

    running = true;
}   
init();

const tick = function () {
    if (!running) return;
    state.tick();
    player.input(keyHandler, mouseHandler);
    camera.input(mouseHandler);
    player.move();
    player.groundedCheck(scene);   
    collisionGroup.forEach(element => {
        player.collisionCheck(element);
    });
    camera.move();
    camera.update();
    player.update();
    keyHandler.keys["r"].update();
    if (keyHandler.keys["r"].clicked) {
        console.log(player.mesh.position);
    }
}
setInterval(tick, 1000 / 60);

const animate = function () {
    state.animate();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    renderer.setSize(sizes.width, sizes.height);
    camera.updateAspectRatio(sizes.width / sizes.height);
});

window.addEventListener('keydown', (e) => {
    keyHandler.toggleKey(e.key, true);
});

window.addEventListener('keyup', (e) => {
    keyHandler.toggleKey(e.key, false);
});

window.addEventListener('mousedown', (e) => {
    mouseHandler.mousePressed(e);
});

window.addEventListener('mouseup', (e) => {
    mouseHandler.mouseReleased();
});

window.addEventListener('mousemove', (e) => {
    mouseHandler.mouseDragged(e);
});

window.addEventListener('wheel', (e) => {
    mouseHandler.mouseWheel(e);
});
