/* ============================================================
   DESIGNSMITH AI STUDIO + 360° ALGORITHMIC 3D CHARACTER
   ============================================================ */

/* =========================
   GLOBAL DOM REFS
========================= */
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const loader = document.getElementById("aiLoader");
const loaderMessage = document.getElementById("loaderMessage");
const aiLog = document.getElementById("aiLog");

const characterWrap = document.getElementById("assistantCharacter");
const characterCanvas = document.getElementById("characterCanvas");
const charCtx = characterCanvas.getContext("2d");
const characterMoodIcon = document.getElementById("characterMoodIcon");
const characterBubbleText = document.getElementById("characterBubbleText");

/* =========================
   STATE
========================= */
let elements = [];
let selectedElementId = null;
let aiBackgroundImage = null;
let canvasBackgroundConfig = null;

let undoStack = [];
let redoStack = [];

let activeCanvasMode = "select";
let brushSize = 25;

let isDraggingElement = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

let uploadedFonts = [];

/* =========================
   3D CHARACTER STATE
========================= */
const characterState = {
    x: window.innerWidth - 160,
    y: window.innerHeight - 160,
    dragging: false,
    offsetX: 0,
    offsetY: 0,
    angle: 0,
    speed: 0.9,
    scale: 1,
    glow: 18,
    color: "#00f2fe",
    bob: 0,
};

const moodBank = {
    happy: ["🤖", "😊", "😎", "🤩", "✨", "😄", "🥳"],
    thinking: ["🤔", "🧐", "💭", "🤨", "🔍", "💡"],
    excited: ["🎉", "🔥", "⚡", "🚀", "💥", "🎊"],
    hover: ["😲", "👀", "😂", "🤪", "😳", "🙈"],
    working: ["⚙️", "🛠️", "💻", "🎨", "📐", "✏️"],
    love: ["❤️", "😍", "🥰", "💕", "😘"],
    cool: ["😎", "🕶️", "🤟", "✌️", "🎸"],
    magic: ["✨", "🪄", "🔮", "🌟", "💫"],
};

const thoughtBank = {
    welcome: { text: "Welcome Boss! 👑", icon: "🤖", mood: "happy" },
    textAdd: { text: "Text Added! 🔥", icon: "✍️", mood: "excited" },
    imageAdd: { text: "Image Loaded! 📸", icon: "📸", mood: "happy" },
    bgRemove: { text: "BG Removed! ✨", icon: "🧹", mood: "magic" },
    aiGen: { text: "AI Working... ⚡", icon: "🤖", mood: "working" },
    aiDone: { text: "AI Done! 🎨", icon: "🎉", mood: "excited" },
    undo: { text: "Undone! ⏪", icon: "🔄", mood: "happy" },
    redo: { text: "Redone! ⏩", icon: "➡️", mood: "happy" },
    del: { text: "Deleted! 💨", icon: "🗑️", mood: "cool" },
    select: { text: "Selected! 🎯", icon: "🧐", mood: "thinking" },
    hover: { text: "Hey! Focus! 😂", icon: "😲", mood: "hover" },
    hoverLong: { text: "I am cool, right? 😏", icon: "🤭", mood: "love" },
    export: { text: "Exported! 💾", icon: "🎉", mood: "excited" },
    bgChanged: { text: "Background Changed! 🎨", icon: "🎨", mood: "excited" },
    copy: { text: "Cloned! 🧬", icon: "📋", mood: "magic" },
    drag: { text: "Flying! ✈️", icon: "🚀", mood: "excited" },
    drop: { text: "Landed! 📍", icon: "📍", mood: "happy" },
    draw: { text: "Nice Draw! 🎨", icon: "✍️", mood: "excited" },
    error: { text: "Oops! 😅", icon: "😅", mood: "happy" },
    reset: { text: "Fresh Canvas! 🧹", icon: "🧹", mood: "excited" },
    idle1: {
        text: "Waiting for your next move... 😴",
        icon: "😴",
        mood: "happy",
    },
    idle2: { text: "Try AI Generate! 🤖", icon: "💡", mood: "thinking" },
    idle3: { text: "Drag me anywhere! 🌐", icon: "🌐", mood: "cool" },
};

let currentCharacterThought = thoughtBank.welcome.text;
let currentCharacterIcon = thoughtBank.welcome.icon;
let currentCharacterMood = thoughtBank.welcome.mood;
let hoverCycles = 0;
let hoverEmojiInterval = null;

/* =========================
   LOG + CHARACTER THOUGHTS
========================= */
function setStudioLog(text) {
    if (aiLog) aiLog.innerText = text;
}

function reactCharacter(key) {
    const item = thoughtBank[key];
    if (!item) return;
    currentCharacterThought = item.text;
    currentCharacterIcon = item.icon;
    currentCharacterMood = item.mood;
    if (characterMoodIcon) characterMoodIcon.innerText = currentCharacterIcon;
    if (characterBubbleText)
        characterBubbleText.innerText = currentCharacterThought;
    setStudioLog(`🤖 ${currentCharacterThought}`);
}

/* =========================
   ANIMATED SPACE BACKGROUND
========================= */
let stars = [];
let shootingStars = [];
let nebulaPulse = 0;

function initBackgroundSpace() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    stars = [];
    shootingStars = [];
    for (let i = 0; i < 130; i++) {
        stars.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            size: Math.random() * 1.4 + 0.3,
            opacity: Math.random(),
            speed: Math.random() * 0.016 + 0.004,
        });
    }
}

function animateBackgroundSpace() {
    nebulaPulse += 0.004;
    bgCtx.fillStyle = "#020206";
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    const nx = bgCanvas.width / 2 + Math.cos(nebulaPulse) * 90;
    const ny = bgCanvas.height / 2 + Math.sin(nebulaPulse * 0.7) * 60;
    const nr = Math.max(bgCanvas.width * 0.45, 450) + Math.sin(nebulaPulse) * 25;

    const ng = bgCtx.createRadialGradient(nx, ny, 15, nx, ny, nr);
    ng.addColorStop(0, "rgba(157,0,255,.2)");
    ng.addColorStop(0.35, "rgba(0,242,254,.1)");
    ng.addColorStop(0.75, "rgba(8,12,36,.3)");
    ng.addColorStop(1, "rgba(0,0,0,0)");
    bgCtx.fillStyle = ng;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    stars.forEach((star) => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) star.speed = -star.speed;
        bgCtx.fillStyle = `rgba(0,242,254,${Math.max(0, Math.min(1, star.opacity))})`;
        bgCtx.beginPath();
        bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        bgCtx.fill();
    });

    if (shootingStars.length < 3 && Math.random() < 0.015) {
        shootingStars.push({
            x: Math.random() * bgCanvas.width * 0.7,
            y: -20,
            length: Math.random() * 100 + 60,
            opacity: 1,
            dx: Math.random() * 4 + 3,
            dy: Math.random() * 3 + 3,
        });
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.dx;
        s.y += s.dy;
        s.opacity -= 0.014;
        if (s.opacity <= 0 || s.x > bgCanvas.width || s.y > bgCanvas.height) {
            shootingStars.splice(i, 1);
            continue;
        }
        const total = s.dx + s.dy;
        const tx = s.x - s.length * (s.dx / total);
        const ty = s.y - s.length * (s.dy / total);

        const grad = bgCtx.createLinearGradient(s.x, s.y, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        grad.addColorStop(0.25, `rgba(0,242,254,${s.opacity * 0.85})`);
        grad.addColorStop(1, "rgba(157,0,255,0)");

        bgCtx.save();
        bgCtx.strokeStyle = grad;
        bgCtx.lineWidth = 2.5;
        bgCtx.lineCap = "round";
        bgCtx.shadowColor = "#00f2fe";
        bgCtx.shadowBlur = 10;
        bgCtx.beginPath();
        bgCtx.moveTo(s.x, s.y);
        bgCtx.lineTo(tx, ty);
        bgCtx.stroke();
        bgCtx.restore();
    }

    requestAnimationFrame(animateBackgroundSpace);
}

/* =========================
   360° ALGORITHMIC 3D CHARACTER
========================= */
function project3D(x, y, z, yaw) {
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);

    const rx = x * cos - z * sin;
    const rz = x * sin + z * cos;

    const fov = 240;
    const depth = fov / (fov + rz + 180);
    const cx = characterCanvas.width / 2;
    const cy = characterCanvas.height / 2 + 18;

    return {
        x: cx + rx * depth * characterState.scale,
        y: cy + (y + characterState.bob) * depth * characterState.scale,
        z: rz,
        scale: depth * characterState.scale,
    };
}

function drawLimb(p1, p2, width, colorA, colorB) {
    const grad = charCtx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    grad.addColorStop(0, colorA);
    grad.addColorStop(1, colorB);
    charCtx.strokeStyle = grad;
    charCtx.lineWidth = width;
    charCtx.lineCap = "round";
    charCtx.beginPath();
    charCtx.moveTo(p1.x, p1.y);
    charCtx.lineTo(p2.x, p2.y);
    charCtx.stroke();
}

function drawSphere(p, radius, color1, color2, glow = false) {
    const r = radius * p.scale;
    const grad = charCtx.createRadialGradient(
        p.x - r * 0.35,
        p.y - r * 0.35,
        r * 0.2,
        p.x,
        p.y,
        r,
    );
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);

    charCtx.save();
    if (glow) {
        charCtx.shadowColor = characterState.color;
        charCtx.shadowBlur = characterState.glow;
    }
    charCtx.fillStyle = grad;
    charCtx.beginPath();
    charCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
    charCtx.fill();
    charCtx.restore();
}

function drawCapsule(center, rx, ry, color1, color2, glow = false) {
    const px = center.x;
    const py = center.y;
    const sx = rx * center.scale;
    const sy = ry * center.scale;

    const grad = charCtx.createLinearGradient(px - sx, py - sy, px + sx, py + sy);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);

    charCtx.save();
    if (glow) {
        charCtx.shadowColor = characterState.color;
        charCtx.shadowBlur = characterState.glow * 0.6;
    }
    charCtx.fillStyle = grad;
    charCtx.beginPath();
    charCtx.ellipse(px, py, sx, sy, 0, 0, Math.PI * 2);
    charCtx.fill();
    charCtx.restore();
}

function drawCharacter360() {
    charCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);

    characterState.angle += characterState.speed * 0.01;
    characterState.bob = Math.sin(characterState.angle * 2) * 4;

    const yaw = characterState.angle;

    // Ground shadow
    charCtx.save();
    charCtx.fillStyle = "rgba(0,242,254,.08)";
    charCtx.beginPath();
    charCtx.ellipse(
        120,
        228,
        44 * characterState.scale,
        10 * characterState.scale,
        0,
        0,
        Math.PI * 2,
    );
    charCtx.fill();
    charCtx.restore();

    const head = project3D(0, -70, 0, yaw);
    const torso = project3D(0, -10, 0, yaw);

    const leftShoulder = project3D(-42, -18, 0, yaw);
    const rightShoulder = project3D(42, -18, 0, yaw);

    const leftHand = project3D(-62, 22, Math.sin(yaw * 2) * 8, yaw);
    const rightHand = project3D(62, 22, -Math.sin(yaw * 2) * 8, yaw);

    const leftHip = project3D(-18, 34, 0, yaw);
    const rightHip = project3D(18, 34, 0, yaw);

    const leftFoot = project3D(-20, 82, Math.cos(yaw * 2) * 6, yaw);
    const rightFoot = project3D(20, 82, -Math.cos(yaw * 2) * 6, yaw);

    const parts = [
        { type: "arm", z: (leftShoulder.z + leftHand.z) / 2, side: "left" },
        { type: "arm", z: (rightShoulder.z + rightHand.z) / 2, side: "right" },
        { type: "leg", z: (leftHip.z + leftFoot.z) / 2, side: "left" },
        { type: "leg", z: (rightHip.z + rightFoot.z) / 2, side: "right" },
        { type: "torso", z: torso.z },
        { type: "head", z: head.z },
    ].sort((a, b) => a.z - b.z);

    charCtx.save();
    charCtx.shadowColor = characterState.color;
    charCtx.shadowBlur = characterState.glow * 0.45;

    parts.forEach((part) => {
        if (part.type === "arm") {
            if (part.side === "left") {
                drawLimb(
                    leftShoulder,
                    leftHand,
                    16 * leftShoulder.scale,
                    "#1c3f72",
                    "#0c1731",
                );
                drawSphere(leftHand, 7, "#2f86ff", "#091b38", true);
            } else {
                drawLimb(
                    rightShoulder,
                    rightHand,
                    16 * rightShoulder.scale,
                    "#1c3f72",
                    "#0c1731",
                );
                drawSphere(rightHand, 7, "#2f86ff", "#091b38", true);
            }
        }

        if (part.type === "leg") {
            if (part.side === "left") {
                drawLimb(leftHip, leftFoot, 18 * leftHip.scale, "#10274d", "#081324");
                drawSphere(leftFoot, 8, "#0f2240", "#040b16");
            } else {
                drawLimb(
                    rightHip,
                    rightFoot,
                    18 * rightHip.scale,
                    "#10274d",
                    "#081324",
                );
                drawSphere(rightFoot, 8, "#0f2240", "#040b16");
            }
        }

        if (part.type === "torso") {
            drawCapsule(torso, 38, 46, "#173c6a", "#081423", true);

            // chest screen
            const frontFactor = Math.max(0, Math.cos(yaw));
            if (frontFactor > 0.08) {
                const w = 30 * torso.scale * frontFactor;
                const h = 20 * torso.scale;
                charCtx.save();
                charCtx.fillStyle = "rgba(0,242,254,.18)";
                charCtx.strokeStyle = "rgba(0,242,254,.45)";
                charCtx.lineWidth = 1.2 * torso.scale;
                charCtx.beginPath();
                charCtx.roundRect(
                    torso.x - w / 2,
                    torso.y - h / 2,
                    w,
                    h,
                    6 * torso.scale,
                );
                charCtx.fill();
                charCtx.stroke();

                // signal bars
                const barW = w / 5;
                const bars = [
                    8 + Math.sin(characterState.angle * 3) * 4,
                    12 + Math.sin(characterState.angle * 4 + 1) * 4,
                    15 + Math.sin(characterState.angle * 5 + 2) * 4,
                ];
                const colors = ["#00f2fe", "#8b5cf6", "#ff4db8"];
                for (let i = 0; i < 3; i++) {
                    charCtx.fillStyle = colors[i];
                    charCtx.fillRect(
                        torso.x - w / 2 + barW * (i + 1) - barW * 0.45,
                        torso.y + h / 2 - bars[i] * torso.scale - 2,
                        barW * 0.6,
                        bars[i] * torso.scale,
                    );
                }
                charCtx.restore();
            }
        }

        if (part.type === "head") {
            drawSphere(head, 30, "#2a80f7", "#0d2850", true);

            const frontFactor = Math.cos(yaw);
            if (frontFactor > -0.15) {
                const visorW = Math.max(
                    8,
                    40 * head.scale * Math.max(0.2, frontFactor),
                );
                const visorH = 16 * head.scale;
                charCtx.save();
                charCtx.fillStyle = "rgba(0,242,254,.12)";
                charCtx.strokeStyle = "rgba(0,242,254,.45)";
                charCtx.lineWidth = 1.1 * head.scale;
                charCtx.beginPath();
                charCtx.roundRect(
                    head.x - visorW / 2,
                    head.y - visorH / 2,
                    visorW,
                    visorH,
                    8 * head.scale,
                );
                charCtx.fill();
                charCtx.stroke();

                if (frontFactor > 0.1) {
                    const eyeOffset = visorW * 0.22;
                    const eyeR = 4.6 * head.scale;
                    charCtx.shadowColor = "#00f2fe";
                    charCtx.shadowBlur = 12;
                    ["#00f2fe", "#7c3aed"].forEach((col, idx) => {
                        charCtx.fillStyle = col;
                        charCtx.beginPath();
                        charCtx.arc(
                            head.x + (idx === 0 ? -eyeOffset : eyeOffset),
                            head.y,
                            eyeR,
                            0,
                            Math.PI * 2,
                        );
                        charCtx.fill();
                    });
                    charCtx.shadowBlur = 0;

                    // mouth
                    charCtx.strokeStyle = "#00f2fe";
                    charCtx.lineWidth = 2 * head.scale;
                    charCtx.lineCap = "round";
                    charCtx.beginPath();
                    charCtx.moveTo(head.x - visorW * 0.18, head.y + visorH * 0.58);
                    charCtx.quadraticCurveTo(
                        head.x,
                        head.y + visorH * 0.92,
                        head.x + visorW * 0.18,
                        head.y + visorH * 0.58,
                    );
                    charCtx.stroke();
                }

                charCtx.restore();
            }

            // side antenna
            const antennaTop = project3D(0, -108, 0, yaw);
            charCtx.save();
            charCtx.strokeStyle = "#00f2fe";
            charCtx.lineWidth = 2.2 * antennaTop.scale;
            charCtx.beginPath();
            charCtx.moveTo(head.x, head.y - 25 * head.scale);
            charCtx.lineTo(antennaTop.x, antennaTop.y);
            charCtx.stroke();
            charCtx.fillStyle = "#00f2fe";
            charCtx.shadowColor = "#00f2fe";
            charCtx.shadowBlur = 15;
            charCtx.beginPath();
            charCtx.arc(
                antennaTop.x,
                antennaTop.y,
                5 * antennaTop.scale,
                0,
                Math.PI * 2,
            );
            charCtx.fill();
            charCtx.restore();
        }
    });

    charCtx.restore();
    requestAnimationFrame(drawCharacter360);
}

function positionCharacter() {
    characterWrap.style.left = `${characterState.x}px`;
    characterWrap.style.top = `${characterState.y}px`;
}

function updateCharacterSetting(type, value) {
    const num = parseFloat(value);
    if (type === "speed") {
        characterState.speed = num;
        document.getElementById("v-char-speed").innerText = value;
    }
    if (type === "scale") {
        characterState.scale = num / 100;
        document.getElementById("v-char-scale").innerText = `${value}%`;
    }
    if (type === "glow") {
        characterState.glow = num;
        document.getElementById("v-char-glow").innerText = `${value}px`;
    }
}

/* Character drag */
characterWrap.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    characterState.dragging = true;
    characterState.offsetX = e.clientX - characterState.x;
    characterState.offsetY = e.clientY - characterState.y;
    reactCharacter("drag");
});

document.addEventListener("mousemove", (e) => {
    if (!characterState.dragging) return;
    characterState.x = Math.max(
        -30,
        Math.min(window.innerWidth - 30, e.clientX - characterState.offsetX),
    );
    characterState.y = Math.max(
        0,
        Math.min(window.innerHeight - 40, e.clientY - characterState.offsetY),
    );
    positionCharacter();
});

document.addEventListener("mouseup", () => {
    if (!characterState.dragging) return;
    characterState.dragging = false;
    reactCharacter("drop");
});

characterWrap.addEventListener(
    "touchstart",
    (e) => {
        e.preventDefault();
        const t = e.touches[0];
        characterState.dragging = true;
        characterState.offsetX = t.clientX - characterState.x;
        characterState.offsetY = t.clientY - characterState.y;
        reactCharacter("drag");
    },
    { passive: false },
);

document.addEventListener(
    "touchmove",
    (e) => {
        if (!characterState.dragging) return;
        const t = e.touches[0];
        characterState.x = Math.max(
            -30,
            Math.min(window.innerWidth - 30, t.clientX - characterState.offsetX),
        );
        characterState.y = Math.max(
            0,
            Math.min(window.innerHeight - 40, t.clientY - characterState.offsetY),
        );
        positionCharacter();
    },
    { passive: false },
);

document.addEventListener("touchend", () => {
    if (!characterState.dragging) return;
    characterState.dragging = false;
    reactCharacter("drop");
});

/* Hover mood */
characterWrap.addEventListener("mouseenter", () => {
    hoverCycles = 0;
    reactCharacter("hover");
    if (hoverEmojiInterval) clearInterval(hoverEmojiInterval);
    hoverEmojiInterval = setInterval(() => {
        hoverCycles++;
        const list = moodBank.hover;
        characterMoodIcon.innerText = list[hoverCycles % list.length];
        if (hoverCycles > 8) {
            clearInterval(hoverEmojiInterval);
            hoverEmojiInterval = null;
            reactCharacter("hoverLong");
        }
    }, 300);
});

characterWrap.addEventListener("mouseleave", () => {
    if (hoverEmojiInterval) clearInterval(hoverEmojiInterval);
    hoverEmojiInterval = null;
    currentCharacterIcon = "🤖";
    currentCharacterThought = "Ready! ⚡";
    currentCharacterMood = "happy";
    characterMoodIcon.innerText = currentCharacterIcon;
    characterBubbleText.innerText = currentCharacterThought;
});

setInterval(() => {
    if (characterState.dragging || hoverEmojiInterval) return;
    const idleKeys = ["idle1", "idle2", "idle3"];
    reactCharacter(idleKeys[Math.floor(Math.random() * idleKeys.length)]);
}, 20000);

/* =========================
   CANVAS BACKGROUND TABS
========================= */
function switchBackgroundTab(tab, btn) {
    document
        .querySelectorAll(".bg-tab-btn")
        .forEach((b) => b.classList.remove("active"));
    document
        .querySelectorAll(".bg-tab-panel")
        .forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");

    if (tab === "solid")
        document.getElementById("bgPanelSolid").classList.add("active");
    if (tab === "gradient")
        document.getElementById("bgPanelGradient").classList.add("active");
    if (tab === "pattern")
        document.getElementById("bgPanelPattern").classList.add("active");
    if (tab === "presets")
        document.getElementById("bgPanelPresets").classList.add("active");
}

/* =========================
   TOOLKIT TABS
========================= */
function switchToolkitTab(tab, btn) {
    document
        .querySelectorAll(".toolkit-tab-btn")
        .forEach((b) => b.classList.remove("active"));
    document
        .querySelectorAll(".toolkit-panel")
        .forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");

    if (tab === "layers")
        document.getElementById("toolkitLayers").classList.add("active");
    if (tab === "text")
        document.getElementById("toolkitText").classList.add("active");
    if (tab === "effects")
        document.getElementById("toolkitEffects").classList.add("active");
    if (tab === "mask")
        document.getElementById("toolkitMask").classList.add("active");
}

/* =========================
   CANVAS SIZE
========================= */
function setupCanvasResolution(w, h) {
    canvas.width = w;
    canvas.height = h;
    renderAll();
}

function handlePresetDimensionChange() {
    const value = document.getElementById("dimensionPreset").value;
    const customRow = document.getElementById("customSizeRow");
    if (value === "custom") {
        customRow.style.display = "block";
        return;
    }
    customRow.style.display = "none";
    const [w, h] = value.split("x").map(Number);
    setupCanvasResolution(w, h);
}

function applyCustomSize() {
    const w = Math.max(
        100,
        Math.min(
            4096,
            parseInt(document.getElementById("customW").value || "1280"),
        ),
    );
    const h = Math.max(
        100,
        Math.min(4096, parseInt(document.getElementById("customH").value || "720")),
    );
    setupCanvasResolution(w, h);
}

/* =========================
   BACKGROUND ENGINE
========================= */
function applyCanvasBackground(type, pattern) {
    if (type === "solid") {
        canvasBackgroundConfig = {
            type: "solid",
            color: document.getElementById("bgSolidColor").value,
        };
    }

    if (type === "gradient") {
        canvasBackgroundConfig = {
            type: "gradient",
            c1: document.getElementById("bgGradColor1").value,
            c2: document.getElementById("bgGradColor2").value,
            dir: document.getElementById("bgGradientDirection").value,
        };
    }

    if (type === "pattern") {
        canvasBackgroundConfig = {
            type: "pattern",
            pattern: pattern,
            patternColor: document.getElementById("bgPatternColor").value,
            patternBase: document.getElementById("bgPatternBase").value,
        };
    }

    aiBackgroundImage = null;
    saveHistoryState();
    renderAll();
    reactCharacter("bgChanged");
}

function applyPresetBackground(c1, c2) {
    if (c1 === c2) {
        canvasBackgroundConfig = { type: "solid", color: c1 };
    } else {
        canvasBackgroundConfig = { type: "gradient", c1, c2, dir: "diag" };
    }
    aiBackgroundImage = null;
    saveHistoryState();
    renderAll();
    reactCharacter("bgChanged");
}

function clearCanvasBackground() {
    canvasBackgroundConfig = null;
    aiBackgroundImage = null;
    saveHistoryState();
    renderAll();
}

function drawCanvasBackground() {
    const W = canvas.width;
    const H = canvas.height;

    // AI image cover fit
    if (
        aiBackgroundImage &&
        aiBackgroundImage.complete &&
        aiBackgroundImage.naturalWidth > 0
    ) {
        const iw = aiBackgroundImage.naturalWidth;
        const ih = aiBackgroundImage.naturalHeight;
        const scale = Math.max(W / iw, H / ih);
        const sw = iw * scale;
        const sh = ih * scale;
        const sx = (W - sw) / 2;
        const sy = (H - sh) / 2;
        ctx.drawImage(aiBackgroundImage, sx, sy, sw, sh);
        return;
    }

    if (!canvasBackgroundConfig) {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#090f1d");
        g.addColorStop(0.5, "#0c1a2e");
        g.addColorStop(1, "#060b16");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        return;
    }

    const cfg = canvasBackgroundConfig;

    if (cfg.type === "solid") {
        ctx.fillStyle = cfg.color || "#0a0f1e";
        ctx.fillRect(0, 0, W, H);
        return;
    }

    if (cfg.type === "gradient") {
        let g;
        if (cfg.dir === "rad")
            g = ctx.createRadialGradient(
                W / 2,
                H / 2,
                0,
                W / 2,
                H / 2,
                Math.max(W, H) / 2,
            );
        else if (cfg.dir === "lr") g = ctx.createLinearGradient(0, 0, W, 0);
        else if (cfg.dir === "diag") g = ctx.createLinearGradient(0, 0, W, H);
        else g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, cfg.c1 || "#00f2fe");
        g.addColorStop(1, cfg.c2 || "#7928ca");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        return;
    }

    if (cfg.type === "pattern") {
        ctx.fillStyle = cfg.patternBase || "#0a0f1e";
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.strokeStyle = cfg.patternColor || "#00f2fe";
        ctx.fillStyle = cfg.patternColor || "#00f2fe";
        ctx.globalAlpha = 0.2;
        const s = 30;

        if (cfg.pattern === "dots") {
            for (let x = 0; x < W; x += s) {
                for (let y = 0; y < H; y += s) {
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        if (cfg.pattern === "grid") {
            ctx.lineWidth = 1;
            for (let x = 0; x <= W; x += s) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = 0; y <= H; y += s) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }
        }

        if (cfg.pattern === "stripe") {
            ctx.lineWidth = 2;
            for (let x = -H; x < W + H; x += s) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x - H, H);
                ctx.stroke();
            }
        }

        if (cfg.pattern === "check") {
            for (let x = 0; x < W; x += s) {
                for (let y = 0; y < H; y += s) {
                    if ((Math.floor(x / s) + Math.floor(y / s)) % 2 === 0) {
                        ctx.fillRect(x, y, s, s);
                    }
                }
            }
        }

        if (cfg.pattern === "diamond") {
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += s) {
                for (let y = 0; y < H; y += s) {
                    ctx.beginPath();
                    ctx.moveTo(x + s / 2, y);
                    ctx.lineTo(x + s, y + s / 2);
                    ctx.lineTo(x + s / 2, y + s);
                    ctx.lineTo(x, y + s / 2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }

        if (cfg.pattern === "zigzag") {
            ctx.lineWidth = 2;
            for (let y = 0; y < H; y += s) {
                ctx.beginPath();
                for (let x = 0; x < W; x += s / 2) {
                    const yo = Math.floor(x / (s / 2)) % 2 === 0 ? y : y + s / 2;
                    if (x === 0) ctx.moveTo(x, yo);
                    else ctx.lineTo(x, yo);
                }
                ctx.stroke();
            }
        }

        ctx.restore();
    }
}

/* =========================
   HISTORY
========================= */
function serializeState() {
    return JSON.stringify({
        elements: elements.map((el) => {
            const copy = { ...el };
            if (el.type === "image") {
                copy.imgSrc = el.content ? el.content.src : "";
                if (el.eraserMask) copy.maskSrc = el.eraserMask.toDataURL();
                delete copy.content;
                delete copy.eraserMask;
            }
            if (el.textureImg) {
                copy.texSrc = el.textureImg.src;
                delete copy.textureImg;
            }
            return copy;
        }),
        background: canvasBackgroundConfig,
        aiBgSrc: aiBackgroundImage ? aiBackgroundImage.src : null,
    });
}

function saveHistoryState() {
    undoStack.push(serializeState());
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
}

function restoreFromState(json) {
    const parsed = JSON.parse(json);
    canvasBackgroundConfig = parsed.background || null;

    if (parsed.aiBgSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = parsed.aiBgSrc;
        img.onload = () => renderAll();
        aiBackgroundImage = img;
    } else {
        aiBackgroundImage = null;
    }

    const restored = [];
    let pending = 0;

    if (!parsed.elements.length) {
        elements = [];
        selectedElementId = null;
        syncUIControls();
        renderAll();
        return;
    }

    parsed.elements.forEach((saved) => {
        const el = { ...saved };
        if (saved.type === "image" && saved.imgSrc) {
            pending++;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = saved.imgSrc;
            img.onload = () => {
                el.content = img;
                const mc = document.createElement("canvas");
                if (saved.maskSrc) {
                    const maskImg = new Image();
                    maskImg.src = saved.maskSrc;
                    maskImg.onload = () => {
                        mc.width = maskImg.width;
                        mc.height = maskImg.height;
                        mc.getContext("2d").drawImage(maskImg, 0, 0);
                        el.eraserMask = mc;
                        restored.push(el);
                        pending--;
                        if (pending === 0) {
                            elements = restored;
                            selectedElementId = null;
                            syncUIControls();
                            renderAll();
                        }
                    };
                } else {
                    mc.width = img.width || 400;
                    mc.height = img.height || 400;
                    const mx = mc.getContext("2d");
                    mx.fillStyle = "#fff";
                    mx.fillRect(0, 0, mc.width, mc.height);
                    el.eraserMask = mc;
                    restored.push(el);
                    pending--;
                    if (pending === 0) {
                        elements = restored;
                        selectedElementId = null;
                        syncUIControls();
                        renderAll();
                    }
                }
            };
        } else {
            if (saved.texSrc) {
                const ti = new Image();
                ti.crossOrigin = "anonymous";
                ti.src = saved.texSrc;
                el.textureImg = ti;
            }
            restored.push(el);
        }
    });

    if (pending === 0) {
        elements = restored;
        selectedElementId = null;
        syncUIControls();
        renderAll();
    }
}

function triggerUndo() {
    if (undoStack.length <= 1) return;
    redoStack.push(undoStack.pop());
    restoreFromState(undoStack[undoStack.length - 1]);
    reactCharacter("undo");
}

function triggerRedo() {
    if (!redoStack.length) return;
    const state = redoStack.pop();
    undoStack.push(state);
    restoreFromState(state);
    reactCharacter("redo");
}

/* =========================
   LAYERS
========================= */
function addNewTextLayer() {
    const el = {
        id: "txt_" + Date.now(),
        type: "text",
        text: "EDIT TEXT",
        x: canvas.width / 2,
        y: canvas.height / 2,
        scale: 100,
        rotate: 0,
        opacity: 100,
        font: "Arial",
        color: "#00f2fe",
        charSpacing: 0,
        curve: 0,
        stroke: 2,
        strokeColor: "#000000",
        innerShadow: 0,
        emboss: 0,
        threeDDepth: 0,
        threeDRotate: 0,
        threeDColor: "#1e293b",
        threeDShadow: 0,
        reflection: 0,
        glow: 8,
        glowColor: "#00f2fe",
    };
    elements.push(el);
    selectedElementId = el.id;
    saveHistoryState();
    renderAll();
    syncUIControls();
    reactCharacter("textAdd");
}

function addNewImageLayer(event) {
    const file = event.target.files[0];
    if (file) processImageFile(file);
    event.target.value = "";
}

function processImageFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            const maskCanvas = document.createElement("canvas");
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;
            const mx = maskCanvas.getContext("2d");
            mx.fillStyle = "#fff";
            mx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            let scale = 50;
            if (img.width * (scale / 100) > canvas.width * 0.6)
                scale = Math.floor(((canvas.width * 0.6) / img.width) * 100);
            if (img.height * (scale / 100) > canvas.height * 0.6)
                scale = Math.min(
                    scale,
                    Math.floor(((canvas.height * 0.6) / img.height) * 100),
                );
            scale = Math.max(10, scale);

            const el = {
                id: "img_" + Date.now(),
                type: "image",
                content: img,
                x: canvas.width / 2 - (img.width * (scale / 100)) / 2,
                y: canvas.height / 2 - (img.height * (scale / 100)) / 2,
                scale,
                rotate: 0,
                opacity: 100,
                eraserMask: maskCanvas,
            };

            elements.push(el);
            selectedElementId = el.id;
            saveHistoryState();
            renderAll();
            syncUIControls();
            reactCharacter("imageAdd");
        };
    };
}

function executeLayerAction(action) {
    if (!selectedElementId) return;
    const index = elements.findIndex((el) => el.id === selectedElementId);
    if (index === -1) return;

    if (action === "delete") {
        elements.splice(index, 1);
        selectedElementId = null;
        reactCharacter("del");
    }

    if (action === "front") {
        elements.push(elements.splice(index, 1)[0]);
    }

    if (action === "back") {
        elements.unshift(elements.splice(index, 1)[0]);
    }

    if (action === "copy") {
        const src = elements[index];
        const clone = {
            ...src,
            id: "copy_" + Date.now(),
            x: src.x + 20,
            y: src.y + 20,
        };
        if (src.type === "image" && src.eraserMask) {
            const nm = document.createElement("canvas");
            nm.width = src.eraserMask.width;
            nm.height = src.eraserMask.height;
            nm.getContext("2d").drawImage(src.eraserMask, 0, 0);
            clone.eraserMask = nm;
        }
        elements.push(clone);
        selectedElementId = clone.id;
        reactCharacter("copy");
    }

    saveHistoryState();
    renderAll();
    syncUIControls();
}

function alignElementRelative(dir) {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el) return;

    if (el.type === "text") {
        if (dir === "left") el.x = 50;
        if (dir === "center") el.x = canvas.width / 2;
        if (dir === "right") el.x = canvas.width - 50;
        if (dir === "middle") el.y = canvas.height / 2;
    } else {
        const w = el.content.width * (el.scale / 100);
        const h = el.content.height * (el.scale / 100);
        if (dir === "left") el.x = 0;
        if (dir === "center") el.x = (canvas.width - w) / 2;
        if (dir === "right") el.x = canvas.width - w;
        if (dir === "middle") el.y = (canvas.height - h) / 2;
    }

    saveHistoryState();
    renderAll();
}

/* =========================
   TEXT + FX
========================= */
function updateSelectedTextContent(value) {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el || el.type !== "text") return;
    el.text = value;
    renderAll();
}

function updateSelectedElementProperty(prop, value) {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el) return;

    const colorProps = [
        "color",
        "strokeColor",
        "threeDColor",
        "glowColor",
        "font",
    ];
    el[prop] = colorProps.includes(prop) ? value : parseFloat(value);

    const labelMap = {
        scale: ["v-scale", "%"],
        rotate: ["v-rotate", "°"],
        opacity: ["v-opacity", "%"],
        charSpacing: ["v-charspacing", "px"],
        curve: ["v-curve", "°"],
        stroke: ["v-stroke", "px"],
        innerShadow: ["v-innershadow", "px"],
        emboss: ["v-emboss", "px"],
        threeDDepth: ["v-3dtext", "px"],
        threeDRotate: ["v-3drotate", "°"],
        threeDShadow: ["v-3dshadow", "px"],
        reflection: ["v-reflection", "%"],
        glow: ["v-glow", "px"],
    };

    if (labelMap[prop]) {
        const [id, unit] = labelMap[prop];
        const node = document.getElementById(id);
        if (node) node.innerText = `${value}${unit}`;
    }

    renderAll();
}

function uploadFontFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const fontName = file.name.replace(/\.[^/.]+$/, "");
        const fontFace = new FontFace(fontName, `url(${e.target.result})`);
        fontFace
            .load()
            .then((loaded) => {
                document.fonts.add(loaded);
                uploadedFonts.push(fontName);
                const select = document.getElementById("fontFamilySelect");
                const option = document.createElement("option");
                option.value = fontName;
                option.textContent = `${fontName} (Custom)`;
                select.appendChild(option);
                select.value = fontName;

                const el = elements.find((item) => item.id === selectedElementId);
                if (el && el.type === "text") {
                    el.font = fontName;
                    renderAll();
                }
            })
            .catch(() => alert("Font load failed"));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
}

function applyTextureToSelectedText(event) {
    const file = event.target.files[0];
    const el = elements.find((e) => e.id === selectedElementId);
    if (!file || !el || el.type !== "text") {
        if (!el || el.type !== "text") alert("Select a text layer first!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            el.textureImg = img;
            saveHistoryState();
            renderAll();
        };
    };
    reader.readAsDataURL(file);
    event.target.value = "";
}

function removeTextureFromSelectedText() {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el || el.type !== "text") return;
    delete el.textureImg;
    saveHistoryState();
    renderAll();
}

/* =========================
   UI SYNC
========================= */
function syncUIControls() {
    const label = document.getElementById("selectedLayerLabel");
    const el = elements.find((e) => e.id === selectedElementId);

    if (!el) {
        label.innerText = "None";
        return;
    }

    if (el.type === "text") {
        label.innerText = `"${(el.text || "").substring(0, 10)}"`;
        if (document.getElementById("textInputSync"))
            document.getElementById("textInputSync").value = el.text || "";
        if (document.getElementById("fontFamilySelect")) {
            const fs = document.getElementById("fontFamilySelect");
            let has = false;
            fs.querySelectorAll("option").forEach((o) => {
                if (o.value === el.font) has = true;
            });
            if (has) fs.value = el.font || "Arial";
        }
        document.getElementById("textColorPicker").value = el.color || "#00f2fe";
        document.getElementById("strokeColorPicker").value =
            el.strokeColor || "#000000";
        document.getElementById("threeDColorPicker").value =
            el.threeDColor || "#1e293b";
        document.getElementById("glowColorPicker").value =
            el.glowColor || "#00f2fe";
    } else {
        label.innerText = "Image Layer";
    }

    document.getElementById("sl-scale").value = el.scale ?? 100;
    document.getElementById("v-scale").innerText = `${el.scale ?? 100}%`;

    document.getElementById("sl-rotate").value = el.rotate ?? 0;
    document.getElementById("v-rotate").innerText = `${el.rotate ?? 0}°`;

    document.getElementById("sl-opacity").value = el.opacity ?? 100;
    document.getElementById("v-opacity").innerText = `${el.opacity ?? 100}%`;

    if (el.type === "text") {
        document.getElementById("sl-charspacing").value = el.charSpacing ?? 0;
        document.getElementById("v-charspacing").innerText =
            `${el.charSpacing ?? 0}px`;

        document.getElementById("sl-curve").value = el.curve ?? 0;
        document.getElementById("v-curve").innerText = `${el.curve ?? 0}°`;

        document.getElementById("sl-stroke").value = el.stroke ?? 2;
        document.getElementById("v-stroke").innerText = `${el.stroke ?? 2}px`;

        document.getElementById("sl-innershadow").value = el.innerShadow ?? 0;
        document.getElementById("v-innershadow").innerText =
            `${el.innerShadow ?? 0}px`;

        document.getElementById("sl-emboss").value = el.emboss ?? 0;
        document.getElementById("v-emboss").innerText = `${el.emboss ?? 0}px`;

        document.getElementById("sl-3dtext").value = el.threeDDepth ?? 0;
        document.getElementById("v-3dtext").innerText = `${el.threeDDepth ?? 0}px`;

        document.getElementById("sl-3drotate").value = el.threeDRotate ?? 0;
        document.getElementById("v-3drotate").innerText =
            `${el.threeDRotate ?? 0}°`;

        document.getElementById("sl-3dshadow").value = el.threeDShadow ?? 0;
        document.getElementById("v-3dshadow").innerText =
            `${el.threeDShadow ?? 0}px`;

        document.getElementById("sl-reflection").value = el.reflection ?? 0;
        document.getElementById("v-reflection").innerText =
            `${el.reflection ?? 0}%`;

        document.getElementById("sl-glow").value = el.glow ?? 8;
        document.getElementById("v-glow").innerText = `${el.glow ?? 8}px`;
    }
}

/* =========================
   TEXT DRAWING
========================= */
function drawTextWithEffects(el) {
    ctx.save();
    ctx.globalAlpha = (el.opacity || 100) / 100;

    const fontSize = Math.max((el.scale || 100) * 0.6, 8);
    ctx.font = `bold ${fontSize}px "${el.font || "Arial"}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = el.text || "";
    const spacing = el.charSpacing || 0;

    function totalWidth(str) {
        let w = 0;
        for (const ch of str) w += ctx.measureText(ch).width + spacing;
        return Math.max(w - spacing, 1);
    }

    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate(((el.rotate || 0) * Math.PI) / 180);

    if (el.curve && el.curve !== 0) {
        const angle = (el.curve / 180) * Math.PI;
        const arcLength = totalWidth(text);
        const radius = arcLength / Math.abs(angle) || 300;
        let currentAngle = -Math.PI / 2 - angle / 2;

        for (const ch of text) {
            const cw = ctx.measureText(ch).width + spacing;
            const dA = cw / radius;
            ctx.save();
            ctx.translate(
                Math.cos(currentAngle + dA / 2) * radius,
                Math.sin(currentAngle + dA / 2) * radius +
                (el.curve > 0 ? radius : -radius),
            );
            ctx.rotate(
                currentAngle + dA / 2 + Math.PI / 2 + (el.curve > 0 ? 0 : Math.PI),
            );
            drawTextCharacterFx(el, ch, 0, 0);
            ctx.restore();
            currentAngle += dA;
        }
    } else {
        const total = totalWidth(text);
        let xOff = -total / 2;
        for (const ch of text) {
            const cw = ctx.measureText(ch).width;
            drawTextCharacterFx(el, ch, xOff + cw / 2, 0);
            xOff += cw + spacing;
        }

        if ((el.reflection || 0) > 0) {
            ctx.save();
            ctx.scale(1, -1);
            ctx.globalAlpha = (el.reflection / 100) * 0.45;
            const rg = ctx.createLinearGradient(0, 0, 0, fontSize);
            rg.addColorStop(0, el.color || "#00f2fe");
            rg.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = rg;
            let x2 = -total / 2;
            for (const ch of text) {
                const cw = ctx.measureText(ch).width;
                ctx.fillText(ch, x2 + cw / 2, -fontSize * 0.15);
                x2 += cw + spacing;
            }
            ctx.restore();
        }
    }

    ctx.restore();
    ctx.restore();
}

function drawTextCharacterFx(el, ch, x, y) {
    const depth = el.threeDDepth || 0;

    if ((el.glow || 0) > 0) {
        ctx.save();
        ctx.shadowColor = el.glowColor || "#00f2fe";
        ctx.shadowBlur = el.glow;
        ctx.fillStyle = el.color || "#00f2fe";
        ctx.fillText(ch, x, y);
        ctx.restore();
    }

    if (depth > 0) {
        const tilt = (el.threeDRotate || 0) * 0.02;
        ctx.fillStyle = el.threeDColor || "#1e293b";
        for (let i = depth; i >= 1; i--) {
            ctx.fillText(ch, x + i * 0.8, y + i * 0.6 + tilt * i);
        }
    }

    if ((el.threeDShadow || 0) > 0) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,.55)";
        ctx.shadowBlur = el.threeDShadow;
        ctx.shadowOffsetX = depth * 0.8;
        ctx.shadowOffsetY = depth * 0.8;
        ctx.fillStyle = el.color || "#00f2fe";
        ctx.fillText(ch, x, y);
        ctx.restore();
    }

    if ((el.emboss || 0) > 0) {
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,.35)";
        ctx.fillText(ch, x - el.emboss * 0.4, y - el.emboss * 0.4);
        ctx.fillStyle = "rgba(0,0,0,.35)";
        ctx.fillText(ch, x + el.emboss * 0.4, y + el.emboss * 0.4);
        ctx.restore();
    }

    if ((el.innerShadow || 0) > 0) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,.75)";
        ctx.shadowBlur = el.innerShadow;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = el.color || "#00f2fe";
        ctx.fillText(ch, x, y);
        ctx.restore();
    }

    if ((el.stroke || 0) > 0) {
        ctx.save();
        ctx.lineWidth = el.stroke;
        ctx.strokeStyle = el.strokeColor || "#000";
        ctx.lineJoin = "round";
        ctx.strokeText(ch, x, y);
        ctx.restore();
    }

    if (el.textureImg && el.textureImg.complete) {
        const p = ctx.createPattern(el.textureImg, "repeat");
        ctx.fillStyle = p || el.color || "#00f2fe";
    } else {
        ctx.fillStyle = el.color || "#00f2fe";
    }

    ctx.fillText(ch, x, y);
}

/* =========================
   MAIN RENDER
========================= */
function renderAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvasBackground();

    elements.forEach((el) => {
        ctx.save();
        ctx.globalAlpha = (el.opacity || 100) / 100;

        if (el.type === "image") {
            if (!el.content || !el.content.complete || !el.content.naturalWidth) {
                ctx.restore();
                return;
            }

            const w = el.content.width * (el.scale / 100);
            const h = el.content.height * (el.scale / 100);
            if (w <= 0 || h <= 0) {
                ctx.restore();
                return;
            }

            ctx.translate(el.x + w / 2, el.y + h / 2);
            ctx.rotate(((el.rotate || 0) * Math.PI) / 180);

            const tmp = document.createElement("canvas");
            tmp.width = w;
            tmp.height = h;
            const tx = tmp.getContext("2d");
            tx.drawImage(el.content, 0, 0, w, h);

            if (el.eraserMask) {
                tx.globalCompositeOperation = "destination-in";
                tx.drawImage(el.eraserMask, 0, 0, w, h);
            }

            ctx.drawImage(tmp, -w / 2, -h / 2);
        }

        if (el.type === "text") {
            drawTextWithEffects(el);
        }

        ctx.restore();
    });
}

/* =========================
   MOUSE / TOUCH FOR CANVAS
========================= */
function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const ox = e.offsetX !== undefined ? e.offsetX : e.clientX - rect.left;
    const oy = e.offsetY !== undefined ? e.offsetY : e.clientY - rect.top;
    return {
        x: ox * (canvas.width / rect.width),
        y: oy * (canvas.height / rect.height),
    };
}

function hitTestElement(el, x, y) {
    if (el.type === "image") {
        const w = el.content.width * (el.scale / 100);
        const h = el.content.height * (el.scale / 100);
        return x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h;
    }

    if (el.type === "text") {
        ctx.save();
        ctx.font = `bold ${Math.max((el.scale || 100) * 0.6, 8)}px "${el.font || "Arial"}"`;
        const textW = ctx.measureText(el.text || "").width;
        ctx.restore();
        return (
            x >= el.x - textW / 2 - 15 &&
            x <= el.x + textW / 2 + 15 &&
            y >= el.y - (el.scale || 100) * 0.4 &&
            y <= el.y + (el.scale || 100) * 0.4
        );
    }

    return false;
}

function handleCanvasMouseDown(e) {
    const { x, y } = getCanvasCoords(e);

    if (activeCanvasMode !== "select") {
        isDraggingElement = true;
        executeMaskStroke(x, y);
        return;
    }

    let clicked = null;
    for (let i = elements.length - 1; i >= 0; i--) {
        if (hitTestElement(elements[i], x, y)) {
            clicked = elements[i];
            break;
        }
    }

    if (clicked) {
        selectedElementId = clicked.id;
        isDraggingElement = true;
        dragOffsetX = x - clicked.x;
        dragOffsetY = y - clicked.y;
        syncUIControls();
        reactCharacter("select");
    } else {
        selectedElementId = null;
        syncUIControls();
    }

    renderAll();
}

function handleCanvasMouseMove(e) {
    const { x, y } = getCanvasCoords(e);
    if (!isDraggingElement) return;

    if (activeCanvasMode !== "select") {
        executeMaskStroke(x, y);
        return;
    }

    const el = elements.find((item) => item.id === selectedElementId);
    if (!el) return;

    el.x = x - dragOffsetX;
    el.y = y - dragOffsetY;
    renderAll();
}

function handleCanvasMouseUp() {
    if (isDraggingElement) saveHistoryState();
    isDraggingElement = false;
}

canvas.addEventListener("mousedown", handleCanvasMouseDown);
canvas.addEventListener("mousemove", handleCanvasMouseMove);
canvas.addEventListener("mouseup", handleCanvasMouseUp);
canvas.addEventListener("mouseleave", handleCanvasMouseUp);

canvas.addEventListener(
    "touchstart",
    (e) => {
        e.preventDefault();
        const r = canvas.getBoundingClientRect();
        const t = e.touches[0];
        handleCanvasMouseDown({
            offsetX: (t.clientX - r.left) * (canvas.width / r.width),
            offsetY: (t.clientY - r.top) * (canvas.height / r.height),
        });
    },
    { passive: false },
);

canvas.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
        const r = canvas.getBoundingClientRect();
        const t = e.touches[0];
        handleCanvasMouseMove({
            offsetX: (t.clientX - r.left) * (canvas.width / r.width),
            offsetY: (t.clientY - r.top) * (canvas.height / r.height),
        });
    },
    { passive: false },
);

canvas.addEventListener("touchend", handleCanvasMouseUp);

/* =========================
   MASK / ERASER
========================= */
function switchCanvasMode(mode) {
    activeCanvasMode = mode;
    canvas.style.cursor = mode === "select" ? "default" : "crosshair";
}

function updateBrushSize(value) {
    brushSize = parseInt(value);
    document.getElementById("v-brush").innerText = `${value}px`;
}

function executeMaskStroke(cx, cy) {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el || el.type !== "image") return;

    const mc = el.eraserMask.getContext("2d");
    const iw = el.content.width * (el.scale / 100);
    const ih = el.content.height * (el.scale / 100);

    const rx = ((cx - el.x) / iw) * el.eraserMask.width;
    const ry = ((cy - el.y) / ih) * el.eraserMask.height;
    const br = brushSize * (el.eraserMask.width / Math.max(iw, 1));

    mc.save();
    mc.globalCompositeOperation = "destination-out";
    mc.fillStyle = "rgba(0,0,0,1)";
    mc.beginPath();
    if (activeCanvasMode === "mask") {
        mc.rect(rx - br, ry - br, br * 2, br * 2);
    } else {
        mc.arc(rx, ry, br, 0, Math.PI * 2);
    }
    mc.fill();
    mc.restore();
    renderAll();
}

function restoreSelectedMask() {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el || el.type !== "image") {
        alert("Select an image layer first!");
        return;
    }
    const mc = el.eraserMask.getContext("2d");
    mc.globalCompositeOperation = "source-over";
    mc.fillStyle = "#fff";
    mc.fillRect(0, 0, el.eraserMask.width, el.eraserMask.height);
    saveHistoryState();
    renderAll();
}

/* =========================
   AI BG REMOVE
========================= */
function executeAutoAiBgRemove(method) {
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el || el.type !== "image") {
        alert("Select an image layer first!");
        return;
    }

    reactCharacter("bgRemove");
    loader.style.display = "flex";
    loaderMessage.innerText = "REMOVING BACKGROUND...";

    const tolerance = parseInt(
        document.getElementById("sl-tolerance").value || "50",
    );

    setTimeout(() => {
        try {
            const maskCanvas = el.eraserMask;
            const maskCtx = maskCanvas.getContext("2d");

            const temp = document.createElement("canvas");
            temp.width = el.content.width;
            temp.height = el.content.height;
            const tctx = temp.getContext("2d");
            tctx.drawImage(el.content, 0, 0);

            let imageData;
            try {
                imageData = tctx.getImageData(0, 0, temp.width, temp.height);
            } catch {
                loader.style.display = "none";
                alert("CORS error on image");
                return;
            }

            const data = imageData.data;
            const W = temp.width;
            const H = temp.height;

            maskCtx.globalCompositeOperation = "source-over";
            maskCtx.fillStyle = "#fff";
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            const maskData = maskCtx.getImageData(
                0,
                0,
                maskCanvas.width,
                maskCanvas.height,
            );
            const mD = maskData.data;
            const scX = maskCanvas.width / W;
            const scY = maskCanvas.height / H;

            function mark(px, py) {
                const mx = Math.round(px * scX);
                const my = Math.round(py * scY);
                if (
                    mx >= 0 &&
                    mx < maskCanvas.width &&
                    my >= 0 &&
                    my < maskCanvas.height
                ) {
                    const mi = (my * maskCanvas.width + mx) * 4;
                    mD[mi] = mD[mi + 1] = mD[mi + 2] = mD[mi + 3] = 0;
                }
            }

            if (method === "color" || method === "smart") {
                const corners = [
                    [0, 0],
                    [W - 1, 0],
                    [0, H - 1],
                    [W - 1, H - 1],
                ];
                let tR = 0,
                    tG = 0,
                    tB = 0;
                corners.forEach(([cx, cy]) => {
                    const i = (cy * W + cx) * 4;
                    tR += data[i];
                    tG += data[i + 1];
                    tB += data[i + 2];
                });
                tR /= 4;
                tG /= 4;
                tB /= 4;

                for (let py = 0; py < H; py++) {
                    for (let px = 0; px < W; px++) {
                        const si = (py * W + px) * 4;
                        const dist = Math.sqrt(
                            (data[si] - tR) ** 2 +
                            (data[si + 1] - tG) ** 2 +
                            (data[si + 2] - tB) ** 2,
                        );
                        if (dist < tolerance) mark(px, py);
                    }
                }
            }

            if (method === "brightness" || method === "smart") {
                for (let py = 0; py < H; py++) {
                    for (let px = 0; px < W; px++) {
                        const si = (py * W + px) * 4;
                        const bright = (data[si] + data[si + 1] + data[si + 2]) / 3;
                        if (bright > 255 - tolerance / 2 || bright < tolerance / 2)
                            mark(px, py);
                    }
                }
            }

            if (method === "edge" || method === "smart") {
                const visited = new Uint8Array(W * H);
                [
                    [0, 0],
                    [W - 1, 0],
                    [0, H - 1],
                    [W - 1, H - 1],
                ].forEach(([sx, sy]) => {
                    const stack = [[sx, sy]];
                    const ri = (sy * W + sx) * 4;
                    const rR = data[ri],
                        rG = data[ri + 1],
                        rB = data[ri + 2];

                    while (stack.length) {
                        const [cx, cy] = stack.pop();
                        if (cx < 0 || cx >= W || cy < 0 || cy >= H) continue;
                        const idx = cy * W + cx;
                        if (visited[idx]) continue;
                        visited[idx] = 1;
                        const si = idx * 4;

                        const dist = Math.sqrt(
                            (data[si] - rR) ** 2 +
                            (data[si + 1] - rG) ** 2 +
                            (data[si + 2] - rB) ** 2,
                        );

                        if (dist < tolerance) {
                            mark(cx, cy);
                            if (stack.length < 500000) {
                                stack.push(
                                    [cx + 1, cy],
                                    [cx - 1, cy],
                                    [cx, cy + 1],
                                    [cx, cy - 1],
                                );
                            }
                        }
                    }
                });
            }

            maskCtx.putImageData(maskData, 0, 0);
            saveHistoryState();
            renderAll();
        } catch {
            reactCharacter("error");
        } finally {
            loader.style.display = "none";
        }
    }, 500);
}

/* =========================
   AI GENERATION
========================= */
function generateAiImage() {
    const prompt = (document.getElementById("aiPrompt").value || "").trim();
    if (!prompt) {
        alert("Enter a prompt first!");
        return;
    }

    const mode = document.getElementById("aiGenerateMode").value;
    const style = document.getElementById("aiStyleSelect").value || "";
    const fullPrompt = prompt + style;

    loader.style.display = "flex";
    loaderMessage.innerText = "GENERATING AI IMAGE...";
    reactCharacter("aiGen");

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${canvas.width}&height=${canvas.height}&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";

    const timeout = setTimeout(() => {
        loader.style.display = "none";
        reactCharacter("error");
    }, 50000);

    setTimeout(() => {
        if (loader.style.display !== "none")
            loaderMessage.innerText = "ALMOST DONE...";
    }, 3500);

    img.onload = () => {
        clearTimeout(timeout);
        loader.style.display = "none";

        if (mode === "background") {
            aiBackgroundImage = img;
            canvasBackgroundConfig = null;
            saveHistoryState();
            renderAll();
            reactCharacter("aiDone");
        } else {
            const maskCanvas = document.createElement("canvas");
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;
            const mx = maskCanvas.getContext("2d");
            mx.fillStyle = "#fff";
            mx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            let scale = 50;
            if (img.width * (scale / 100) > canvas.width * 0.6)
                scale = Math.floor(((canvas.width * 0.6) / img.width) * 100);
            if (img.height * (scale / 100) > canvas.height * 0.6)
                scale = Math.min(
                    scale,
                    Math.floor(((canvas.height * 0.6) / img.height) * 100),
                );
            scale = Math.max(10, scale);

            const el = {
                id: "ai_" + Date.now(),
                type: "image",
                content: img,
                x: canvas.width / 2 - (img.width * (scale / 100)) / 2,
                y: canvas.height / 2 - (img.height * (scale / 100)) / 2,
                scale,
                rotate: 0,
                opacity: 100,
                eraserMask: maskCanvas,
            };

            elements.push(el);
            selectedElementId = el.id;
            saveHistoryState();
            renderAll();
            syncUIControls();
            reactCharacter("aiDone");
        }
    };

    img.onerror = () => {
        clearTimeout(timeout);
        loader.style.display = "none";
        reactCharacter("error");
    };

    img.src = url;
}

/* =========================
   EXPORT
========================= */
function exportStudioPNG() {
    try {
        const link = document.createElement("a");
        link.download = `DesignSmith_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png", 1);
        link.click();
        reactCharacter("export");
    } catch {
        reactCharacter("error");
    }
}

/* =========================
   RESET
========================= */
function resetStudioWorkspace() {
    if (!confirm("Reset everything?")) return;
    elements = [];
    selectedElementId = null;
    aiBackgroundImage = null;
    canvasBackgroundConfig = null;
    undoStack = [];
    redoStack = [];
    saveHistoryState();
    renderAll();
    syncUIControls();
    reactCharacter("reset");
}

/* =========================
   SPEECH
========================= */
function startSpeechToText(event) {
    event.preventDefault();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        alert("Speech recognition not supported. Use Chrome.");
        return;
    }

    const rec = new SR();
    rec.lang = "en-US";
    const btn = document.getElementById("voiceBtn");
    btn.innerText = "🔴";
    btn.style.animation = "pulse 1s infinite";

    rec.onresult = (e) => {
        document.getElementById("aiPrompt").value = e.results[0][0].transcript;
    };

    rec.onend = () => {
        btn.innerText = "🎙️";
        btn.style.animation = "";
    };

    rec.start();
}

/* =========================
   KEYBOARD SHORTCUTS
========================= */
document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        executeLayerAction("delete");
    }

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        triggerUndo();
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        triggerRedo();
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (selectedElementId) executeLayerAction("copy");
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        exportStudioPNG();
    }

    if (
        selectedElementId &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
        e.preventDefault();
        const el = elements.find((item) => item.id === selectedElementId);
        if (!el) return;
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowUp") el.y -= step;
        if (e.key === "ArrowDown") el.y += step;
        if (e.key === "ArrowLeft") el.x -= step;
        if (e.key === "ArrowRight") el.x += step;
        renderAll();
    }
});

/* =========================
   DRAG DROP
========================= */
window.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (cWrap) cWrap.style.boxShadow = "0 0 30px #00f2fe";
});

window.addEventListener("dragleave", (e) => {
    e.preventDefault();
    if (cWrap) cWrap.style.boxShadow = "0 18px 40px rgba(0,0,0,.72)";
});

window.addEventListener("drop", (e) => {
    e.preventDefault();
    if (cWrap) cWrap.style.boxShadow = "0 18px 40px rgba(0,0,0,.72)";
    Array.from(e.dataTransfer.files).forEach((file) => {
        if (file.type.startsWith("image/")) processImageFile(file);
    });
});

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    initBackgroundSpace();
    animateBackgroundSpace();

    setupCanvasResolution(1280, 720);
    positionCharacter();
    drawCharacter360();
    saveHistoryState();
    reactCharacter("welcome");

    // initial character settings
    document.getElementById("v-char-speed").innerText =
        characterState.speed.toFixed(1);
    document.getElementById("v-char-scale").innerText = "100%";
    document.getElementById("v-char-glow").innerText = `${characterState.glow}px`;
    document.getElementById("v-brush").innerText = `${brushSize}px`;

    console.log("🎨 DesignSmith AI Studio + 360° Character Ready");
});
