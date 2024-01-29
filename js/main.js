import * as THREE from 'three';
import '../style.css';

import { Map } from './Map.js';
import { MyFontLoader } from './FontLoader.js';
import { Camera } from './Camera.js';
import { Text3D } from './TextHandler.js';
import { checkCollision } from './BoundingBox.js';
import { Player } from './Player.js';
import { Button } from './Button.js';
import { addDiv } from './TextPrompt.js';
import { deleteDiv } from './TextPrompt.js';

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

var buttonGroup = new THREE.Group();
buttonGroup.type = "buttons";
var composer;
var renderer;
var scene;
var camera;
var map;
var player;
var collisionChecker;

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
    renderer = new THREE.WebGLRenderer({canvas: canvas});
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
    bloomPass.layers = 2;
    composer.addPass( bloomPass );

    const mainLight = new THREE.PointLight(0xffffff, 14000, 100000);
    mainLight.position.set(0, 100, 0);
    scene.add(mainLight);

    map = new Map();
    scene.add(map.mesh);

    const fontLoader = new MyFontLoader();
    fontLoader.loadFont("/fonts/Cabin_Regular.json");
    while (fontLoader.getFont() == null) {
        await new Promise(r => setTimeout(r, 100));
    }

    const wipGroup = new THREE.Group();
    const workInProgText = new Text3D("This site is still work in progress", 1, 0.5);
    workInProgText.setColor(0xff0000);
    workInProgText.position.set(0, -0.8, 0);
    workInProgText.rotation.x = Math.PI * 1.8;
    wipGroup.add(workInProgText);

    const workInProg2Text = new Text3D("More content will be added soon", 0.4, 0.02);
    workInProg2Text.setColor(0xff0000);
    workInProg2Text.position.set(0, -0.8, 1);
    workInProg2Text.rotation.x = Math.PI * 1.8;
    wipGroup.add(workInProg2Text);

    wipGroup.position.set(-20, 0, -20);
    scene.add(wipGroup);

    const welcomeText = new Text3D("Welcome to!", 1, 0.02);
    welcomeText.position.set(-4, -0.9, -12);
    scene.add(welcomeText);

    const welcome2Text = new Text3D("My Interactive Portifolio Website ", 1.2, 0.02);
    welcome2Text.position.set(-10, -0.9, -10);
    scene.add(welcome2Text);

    const authorText = new Text3D("Made by: Ulvang", 1, 0.5);
    authorText.position.set(9, -0.5, -14.5);
    authorText.rotation.x = Math.PI * 1.8;
    authorText.rotation.y = -Math.PI * 0.2;
    authorText.rotation.z = -Math.PI * 0.12;
    scene.add(authorText);

    const moveText = new Text3D("Use W S A D to move", 0.4, 0.02);
    moveText.position.set(2, -0.9, 3.5);
    scene.add(moveText);

    const move2Text = new Text3D("Or simply just click and drag", 0.4, 0.02);
    move2Text.position.set(2, -0.9, 4.5);
    scene.add(move2Text);

    const resetText = new Text3D("Press R to reset position", 0.4, 0.02);
    resetText.position.set(2, -0.9, 5.5);
    scene.add(resetText);

    const button = new Button("GithubButton", new THREE.Vector2(2, 1));
    button.setPos(-8, -0.9, 5);
    button.setPicTexture("/pictures/GitHub_Logo_White.png");
    buttonGroup.add(button);
    scene.add(buttonGroup);

    const gltfLoader = new GLTFLoader();
    const pillarAlcoa = new THREE.Group();
    gltfLoader.load('/models/pillarAlcoa.glb', (gltf) => {
        gltf.scene.traverse((child) => {
            child.layers.enable(1);
            child.castShadow = true;
            child.type = "pillar";
            child.name = "Alcoa";
        });
        gltf.scene.position.set(-40, -1, -5);
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.rotation.y = Math.PI * 0.5;
        gltf.scene.name = "Alcoa";
        gltf.scene.type = "pillar";
        gltf.scene.layers.set(1);
        pillarAlcoa.add(gltf.scene);
        scene.add(gltf.scene);
    } );

    const pillarElkjop = new THREE.Group();
    gltfLoader.load('/models/pillarElkjop.glb', (gltf) => {
        gltf.scene.traverse((child) => {
            child.layers.enable(1);
            child.castShadow = true;
            child.type = "pillar";
            child.name = "Elkjop";
        });
        gltf.scene.position.set(-30, -1, -5);
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.rotation.y = Math.PI;
        gltf.scene.name = "Elkjop";
        gltf.scene.type = "pillar";
        gltf.scene.layers.set(1);
        pillarElkjop.add(gltf.scene);
        scene.add(gltf.scene);
    } );

    const alcoaLight = new THREE.PointLight(0xffffff, 2, 10);
    alcoaLight.position.set(-40, 2, -4.6);
    scene.add(alcoaLight);

    const elkjopLight = new THREE.PointLight(0xffffff, 2, 10);
    elkjopLight.position.set(-30, 2, -4.6);
    scene.add(elkjopLight);

    const prevJobText = new Text3D("Previous jobs", 1, 0.5);
    prevJobText.position.set(-28, -0.5, -7);
    prevJobText.rotation.x = Math.PI * 1.8;
    prevJobText.rotation.y = Math.PI * 0.2;
    prevJobText.rotation.z = Math.PI * 0.12;
    scene.add(prevJobText);

    const prevJob2Text = new Text3D("Click on the pillars to learn more", 0.4, 0.02);
    prevJob2Text.position.set(-27.5, -0.8, -6.5);
    prevJob2Text.rotation.x = Math.PI * 1.8;
    prevJob2Text.rotation.y = Math.PI * 0.2;
    prevJob2Text.rotation.z = Math.PI * 0.12;
    scene.add(prevJob2Text);


    const alcoaText = new Text3D("Alcoa Mosjøen", 0.6, 0.2);
    alcoaText.position.set(-42.5, -0.8, -3.6);
    alcoaText.rotation.x = Math.PI * 1.8;
    alcoaText.type = "pillar";
    alcoaText.name = "Alcoa";
    alcoaText.layers.set(1);
    scene.add(alcoaText);

    const elkjopText = new Text3D("Elkjøp Mosjøen", 0.6, 0.2);
    elkjopText.position.set(-32.5, -0.8, -3.6);
    elkjopText.rotation.x = Math.PI * 1.8;
    elkjopText.type = "pillar";
    elkjopText.name = "Elkjop";
    elkjopText.layers.set(1);
    scene.add(elkjopText);

    const skillGroup = new THREE.Group();
    gltfLoader.load('/models/wallOfProgSkills.glb', (gltf) => {
        gltf.scene.traverse((child) => {
            child.layers.enable(1);
            child.castShadow = true;
        });
        gltf.scene.position.set(40, 3, -15);
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        gltf.scene.layers.set(1);
        skillGroup.add(gltf.scene);
    } );

    const skillText = new Text3D("Programming skills:", 1, 0.5);
    skillText.position.set(22, 0, -12);
    skillText.rotation.x = Math.PI * 1.8;
    skillGroup.add(skillText);

    var i;
    for (i = 0; i < 10; i++) {
        const light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(40 +( 11.2 * i ), 7, -13);
        skillGroup.add(light);
    }

    const planeGeo = new THREE.PlaneGeometry(67.2, 20);
    const planeMat = new THREE.MeshStandardMaterial({ 
        transparent: true,
        opacity: 1,
        color: 0x000000,
        roughness: 1,
        metalness: 0,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(68.5 - 0.5, -0.99, -5.5);
    plane.rotation.x = -Math.PI * 0.5;
    skillGroup.add(plane);
    scene.add(skillGroup);



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
    composer.setSize(sizes.width, sizes.height);
});

// Movement
function move() {
    if (!running) {
        return;
    }
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

function resetPos() {
    player.mesh.position.set(0, 2, 0);
    player.speed.set(0, 0);
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
    if (event.key == "r") {
        resetPos();
    }
    if (event.key == "p") {
        console.log(player.mesh.position);
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
        player.mesh.position.x += -0.04 * event.movementX;
        player.mesh.position.z += -0.04 * event.movementY;
    }

});

window.addEventListener('mousedown', (event) => {
    if (event.target.id == "closebutton") {
        deleteDiv();
        running = true;
        return;
    }
    if (!running) {
        return;
    }
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
        console.log(intersects[i].object);
        for (let j = 0; j < buttonGroup.children.length; j++) {
            if (intersects[i].object == buttonGroup.children[j]) {
                if (buttonGroup.children[j].getName() == "GithubButton") {
                    window.open("https://github.com/Ulvang01");
                }
                return
            }
            if (intersects[i].object.type == "pillar") {
                if (intersects[i].object.name == "Alcoa") {
                    addDiv("alcoa");
                    running = false;
                } else if (intersects[i].object.name == "Elkjop") {
                    addDiv("elkjop");
                    running = false;
                }
                return;
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
    if (!running) {
        return;
    }
    if (!player.isPickedUp) return;
    player.drop();
    camOffset.y += 2;
} );