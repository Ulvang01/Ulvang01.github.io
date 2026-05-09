import { setupCanvas } from "./core/canvas.js";
import { Engine } from "./core/engine.js";
import { SceneManager } from "./core/scene-manager.js";
import { PlayScene } from "./scenes/play-scene.js";

const canvas = document.getElementById("canvas");
const { ctx, disconnect } = setupCanvas(canvas);

const sm = new SceneManager();
sm.go(new PlayScene(canvas));

const engine = new Engine(ctx, sm, disconnect);
engine.start();
