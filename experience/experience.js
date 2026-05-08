import { setupCanvas } from "./core/canvas.js";
import { Engine } from "./core/engine.js";
import { GameManager } from "./core/game-manager.js";

const canvas = document.getElementById("canvas");
const { ctx, disconnect } = setupCanvas(canvas);
const gm = new GameManager();
const engine = new Engine(ctx, gm, disconnect);

engine.start();
