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
    camera.setTarget(player.mesh);

    const light = new THREE.DirectionalLight(0xf887ff, 1);
    light.position.set(2, 20, 0);
    scene.add(light);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    cube.type = "cube";
    cube.layers.set(1);
    scene.add(cube);

    const gltfLoader = new GLTFLoader();
    const groundGroup = new THREE.Group();
    groundGroup.name = "groundGroup";
    groundGroup.layers.set(layers.ground);

    const floor1Group = new THREE.Group();
    floor1Group.name = "floor1Group";
    floor1Group.layers.set(layers.floor1);

    const floor2Group = new THREE.Group();
    floor2Group.name = "floor2Group";
    floor2Group.layers.set(layers.floor2);

    const roofGroup = new THREE.Group();
    roofGroup.name = "roofGroup";
    roofGroup.layers.set(layers.roof);
    console.log(roofGroup.layers);

    gltfLoader.load('/models/synthHouse.glb', (gltf) => {
        var models = gltf.scene.children;
        var floor1Names = ["Floor1"];
        var floor2Names = ["Floor2"];
        var roofNames = ["Roof"];
        while (models.length > 0) {
            const element = models[0];
            if (floor1Names.includes(element.name)) {
                element.layers.set(layers.floor1);
                floor1Group.add(element);
            } else if (floor2Names.includes(element.name)) {
                element.layers.set(layers.floor2);
                floor2Group.add(element);
            } else if (roofNames.includes(element.name)) {
                element.layers.set(layers.roof);
                roofGroup.add(element);
            } else {
                element.layers.set(layers.ground);
                groundGroup.add(element);
            }
        }
    });

    console.log(groundGroup);
    console.log(floor1Group);
    console.log(floor2Group.layers);
    console.log(roofGroup.layers);

    groundGroup.position.set(50, 0, -80);
    floor1Group.position.set(50, 0, -80);
    floor2Group.position.set(50, 0, -80);
    roofGroup.position.set(50, 0, -80);

    groundGroup.rotation.y = Math.PI;
    floor1Group.rotation.y = Math.PI;
    floor2Group.rotation.y = Math.PI;
    roofGroup.rotation.y = Math.PI;

    scene.add(groundGroup);
    scene.add(floor1Group);


    camera.addLayer(layers.ground);
    camera.addLayer(layers.floor1);
    camera.addLayer(layers.floor2);
    camera.addLayer(layers.roof);
    camera.addLayer(layers.hitbox);
    camera.removeLayer(layers.roof);
    camera.removeLayer(layers.hitbox);
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
        player.resetPos();
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
