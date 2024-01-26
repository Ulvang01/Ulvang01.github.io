import * as THREE from 'three';
import '../style.css';

import { Map } from './Map.js';
import { MyFontLoader } from './FontLoader.js';
import { Camera } from './Camera.js';
import { Text3D } from './TextHandler.js';
import { checkCollision } from './BoundingBox.js';
import { Player } from './Player.js';
import { Button } from './Button.js';
import { WallOfSkills } from './WallOfSkills.js';

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

var buttonGroup = new THREE.Group();
buttonGroup.type = "buttons";
var composer;
var scene;
var camera;
var map;
var player;

var up;
var down;
var left;
var right;

var camOffset = new THREE.Vector3(0, 10, 6);

var running = false;

init();

// Functions 
async function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new Camera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.layers.enable(0);
    camera.layers.enable(1);
    camera.setPosition(0, 10, 6);
    camera.setTarget(0, 0, 0);
    scene.add(camera);

    const canvas = document.querySelector('.webgl');
    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(sizes.width, sizes.height);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const renderScene = new RenderPass( scene, camera );
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );

    const bloomPass = new UnrealBloomPass( 
        new THREE.Vector2( sizes.width, sizes.height ),
            1.5,
            0.4,
            0.85 );
    bloomPass.threshold = 1;
    bloomPass.strength = 1;
    bloomPass.radius = 0.2;
    composer.addPass( bloomPass );

    const light = new THREE.PointLight(0xffffff, 200, 1000);
    light.position.set(0, 10, 0);
    scene.add(light);

    map = new Map();
    scene.add(map.mesh);

    const fontLoader = new MyFontLoader();
    fontLoader.loadFont("/js/fonts/Cabin_Regular.json");
    while (fontLoader.getFont() == null) {
        await new Promise(r => setTimeout(r, 100));
    }

    const welcomeText = new Text3D("Welcome to!", 1, 0.02);
    welcomeText.position.set(-4, -0.9, -6);
    scene.add(welcomeText);

    const welcome2Text = new Text3D("My Interactive Portifolio Website ", 1, 0.02);
    welcome2Text.position.set(-9, -0.9, -4);
    scene.add(welcome2Text);

    const moveText = new Text3D("Use W S A D to move", 0.4, 0.02);
    moveText.position.set(2, -0.9, 3.5);
    scene.add(moveText);

    const move2Text = new Text3D("Or simply just click and drag", 0.4, 0.02);
    move2Text.position.set(2, -0.9, 4.5);
    scene.add(move2Text);

    const wallOfSkills = new WallOfSkills();
    wallOfSkills.setPos(30, -1, -2);
    scene.add(wallOfSkills);

    const button = new Button("GithubButton");
    button.setPos(2, 0, 2);
    button.setPicTexture("/js/pictures/GitHub_Logo_White.png");
    buttonGroup.add(button);
    scene.add(buttonGroup);

    player = new Player();
    scene.add(player.mesh);

    renderer.render(scene, camera);
    running = true;
    tick();
    animate();
}

// Game loop
function tick() {
    if (!running) {
        return;
    }

    move();
}

setInterval(tick, 16.67);

// Animation loop
function animate() {
    camera.setPosition(
            player.mesh.position.x + camOffset.x,
            player.mesh.position.y + camOffset.y,
            player.mesh.position.z + camOffset.z
        );
    composer.render();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.updateAspectRatio(sizes.width / sizes.height);
    renderer.setSize(sizes.width, sizes.height);
});

// Movement
function move() {
    player.up = up;
    player.down = down;
    player.left = left;
    player.right = right;

    if (up && down) {
        player.up = false;
        player.down = false;
    }
    if (left && right) {
        player.left = false;
        player.right = false;
    }

    player.move();
}


// Event listeners
window.addEventListener('keydown', (event) => {
    if (event.key == "w") {
        up = true;
    }
    if (event.key == "s") {
        down = true;
    }
    if (event.key == "a") {
        left = true;
    }
    if (event.key == "d") {
        right = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key == "w") {
        up = false;
    }
    if (event.key == "s") {
        down = false;
    }
    if (event.key == "a") {
        left = false;
    }
    if (event.key == "d") {
        right = false;
    }
});


window.addEventListener('wheel', (event) => {
    
    camOffset.y += 10 * event.deltaY / 1000;
    camOffset.z += 6 * event.deltaY / 1000;

    if (camOffset.y < 2) {
        camOffset.y = 2;
        camOffset.z = 1.2;
    } else if (camOffset.y > 20) {
        camOffset.y = 20;
        camOffset.z = 12;
    }
});

window.addEventListener('mousemove', (event) => {
    // Calculate normalized device coordinates (NDC) from mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    // Calculate ray
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check if any intersections are buttons
    
    for (let i = 0; i < buttonGroup.children.length; i++) {
        buttonGroup.children[i].isHovered = false;
        buttonGroup.children[i].unhover();
        for (let j = 0; j < intersects.length; j++) {
            if (intersects[j].object == buttonGroup.children[i]) {
                buttonGroup.children[i].isHovered = true;
                buttonGroup.children[i].hover();
                break;
            }
        }
    }
    if (player == null) {
        return;
    }
    if (player.isPickedUp) {
        player.mesh.position.x += -0.1 * event.movementX;
        player.mesh.position.z += -0.1 * event.movementY;
    }

});

window.addEventListener('mousedown', (event) => {
    // Calculate normalized device coordinates (NDC) from mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    // Calculate ray
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check if any intersections are buttons
    for (let i = 0; i < intersects.length; i++) {
        for (let j = 0; j < buttonGroup.children.length; j++) {
            if (intersects[i].object == buttonGroup.children[j]) {
                if (buttonGroup.children[j].getName() == "GithubButton") {
                    window.open("https://github.com/Ulvang01");
                }
                break;
            }
        }
        break;
    }

    for (let i = 0; i < buttonGroup.children.length; i++) {
        if (buttonGroup.children[i].isHovered) {
            return;
        }
    }

    player.pickUp();
    camOffset.y -= 2;

} );

window.addEventListener('mouseup', (event) => {
    player.drop();
    camOffset.y += 2;
} );