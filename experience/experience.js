const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const state = {
    time: 0,
    player: {
        x: 300,
        y: 300,
        radius: 20,
        speed: 260,
    },
    input: {
        keys: new Set(),
    },
    orbs: Array.from({ length: 6 }).map((_, i) => ({
        baseX: 200 + i * 150,
        baseY: 220 + (i % 2) * 180,
        radius: 30,
        offset: Math.random() * Math.PI * 2,
        label: `Project ${i + 1}`,
    })),
};

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function setupInput() {
    window.addEventListener("keydown", (event) => {
        state.input.keys.add(event.key.toLowerCase());
    });

    window.addEventListener("keyup", (event) => {
        state.input.keys.delete(event.key.toLowerCase());
    });
}

function update(dt) {
    state.time += dt;

    const keys = state.input.keys;
    const player = state.player;

    let dx = 0;
    let dy = 0;

    if (keys.has("w") || keys.has("arrowup")) dy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dy += 1;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;

    const length = Math.hypot(dx, dy);

    if (length > 0) {
        dx /= length;
        dy /= length;
    }

    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;
}

function render() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const t = state.time;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${210 + Math.sin(t) * 20}, 45%, 10%)`);
    gradient.addColorStop(1, `hsl(${265 + Math.cos(t) * 20}, 45%, 16%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawGrid(width, height, t);
    drawOrbs(t);
    drawPlayer();
    drawHud();
}

function drawGrid(width, height, t) {
    const spacing = 60;
    const offset = (t * 20) % spacing;

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    for (let x = -spacing + offset; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = -spacing + offset; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.restore();
}

function drawOrbs(t) {
    state.orbs.forEach((orb, i) => {
        const x = orb.baseX + Math.sin(t + orb.offset) * 20;
        const y = orb.baseY + Math.cos(t + orb.offset) * 20;

        const distanceToPlayer = Math.hypot(
            state.player.x - x,
            state.player.y - y,
        );

        const isNear = distanceToPlayer < state.player.radius + orb.radius + 20;

        ctx.save();

        ctx.shadowColor = `hsl(${180 + i * 24}, 75%, 60%)`;
        ctx.shadowBlur = isNear ? 35 : 18;

        ctx.beginPath();
        ctx.arc(x, y, isNear ? orb.radius + 5 : orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${180 + i * 24}, 75%, ${isNear ? 70 : 58}%)`;
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(orb.label, x, y + orb.radius + 24);

        if (isNear) {
            ctx.font = "12px sans-serif";
            ctx.fillText("Press E to inspect", x, y + orb.radius + 42);
        }

        ctx.restore();
    });
}

function drawPlayer() {
    const player = state.player;

    ctx.save();

    ctx.shadowColor = "white";
    ctx.shadowBlur = 16;

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}

function drawHud() {
    ctx.save();

    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Interactive Portfolio", 30, 42);

    ctx.font = "14px sans-serif";
    ctx.globalAlpha = 0.8;
    ctx.fillText("Move with WASD or arrow keys", 30, 68);

    ctx.restore();
}

let lastTime = performance.now();

function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    update(dt);
    render();

    requestAnimationFrame(frame);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
setupInput();
requestAnimationFrame(frame);
