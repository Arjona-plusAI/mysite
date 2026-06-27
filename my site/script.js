/* ═══════════════════════════════════════════
   DESIGNSMITH AI STUDIO PRO — FULL ENGINE
   ═══════════════════════════════════════════ */

// ── SPACE BG ──
const bgC = document.getElementById('bgCanvas'), bgX = bgC.getContext('2d');
let strs = [], shts = [], nP = 0, gP = 0;
function iBg() { bgC.width = innerWidth; bgC.height = innerHeight; strs = []; for (let i = 0; i < 150; i++)strs.push({ x: Math.random() * bgC.width, y: Math.random() * bgC.height, s: Math.random() * 1.5 + .3, o: Math.random(), d: Math.random() * .014 + .003, c: Math.random() > .7 }) }

function bF() {
    nP += .003; gP += .006; bgX.fillStyle = '#020206'; bgX.fillRect(0, 0, bgC.width, bgC.height);
    // 3D grid
    bgX.save(); bgX.strokeStyle = 'rgba(0,242,254,.03)'; bgX.lineWidth = 1;
    const hz = bgC.height * .4; for (let i = 0; i < 18; i++) { const t = i / 18; const y = hz + t * t * (bgC.height - hz); bgX.globalAlpha = t * .4; bgX.beginPath(); bgX.moveTo(0, y); bgX.lineTo(bgC.width, y); bgX.stroke() }
    for (let i = -8; i <= 8; i++) { const cx = bgC.width / 2; const off = i * 80 + Math.sin(gP) * 25; bgX.globalAlpha = .025; bgX.beginPath(); bgX.moveTo(cx + off * .2, hz); bgX.lineTo(cx + off * 3, bgC.height); bgX.stroke() } bgX.restore();
    // Nebula
    const nx = bgC.width / 2 + Math.cos(nP) * 90, ny = bgC.height * .35 + Math.sin(nP * .7) * 50, nr = Math.max(bgC.width * .4, 400) + Math.sin(nP) * 30;
    const ng = bgX.createRadialGradient(nx, ny, 15, nx, ny, nr); ng.addColorStop(0, 'rgba(124,58,237,.15)'); ng.addColorStop(.3, 'rgba(0,242,254,.06)'); ng.addColorStop(.7, 'rgba(8,12,36,.2)'); ng.addColorStop(1, 'rgba(0,0,0,0)'); bgX.fillStyle = ng; bgX.fillRect(0, 0, bgC.width, bgC.height);
    // Stars
    strs.forEach(s => { s.o += s.d; if (s.o > 1 || s.o < 0) s.d = -s.d; bgX.fillStyle = `rgba(${s.c ? '124,58,237' : '0,242,254'},${Math.max(0, Math.min(1, s.o))})`; bgX.beginPath(); bgX.arc(s.x, s.y, s.s, 0, Math.PI * 2); bgX.fill() });
    // Shooting
    if (shts.length < 3 && Math.random() < .012) shts.push({ x: Math.random() * bgC.width * .7, y: -20, l: Math.random() * 100 + 60, o: 1, dx: Math.random() * 4 + 3, dy: Math.random() * 3 + 3 });
    for (let i = shts.length - 1; i >= 0; i--) { const p = shts[i]; p.x += p.dx; p.y += p.dy; p.o -= .013; if (p.o <= 0 || p.x > bgC.width || p.y > bgC.height) { shts.splice(i, 1); continue } const t = p.dx + p.dy; const tx = p.x - p.l * (p.dx / t), ty = p.y - p.l * (p.dy / t); const sg = bgX.createLinearGradient(p.x, p.y, tx, ty); sg.addColorStop(0, `rgba(255,255,255,${p.o})`); sg.addColorStop(.3, `rgba(0,242,254,${p.o * .8})`); sg.addColorStop(1, 'rgba(124,58,237,0)'); bgX.save(); bgX.strokeStyle = sg; bgX.lineWidth = 2.5; bgX.lineCap = 'round'; bgX.shadowColor = '#00f2fe'; bgX.shadowBlur = 12; bgX.beginPath(); bgX.moveTo(p.x, p.y); bgX.lineTo(tx, ty); bgX.stroke(); bgX.restore() }
    requestAnimationFrame(bF)
}
addEventListener('resize', () => { iBg(); R() }); iBg(); bF();

// ── THEME ──
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    document.getElementById('themeBtn').innerText = next === 'dark' ? '🌙' : '☀️';
}

// ── STATE ──
const canvas = document.getElementById('mainCanvas'), ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
let els = [], selId = null, aiBg = null, bgCf = null, uS = [], rS = [], mode = 'select', bSz = 25, drag = false, dX = 0, dY = 0;

// ── CHARACTER ──
const cEl = document.getElementById('charWrap'), cCv = document.getElementById('charCanvas'), cX = cCv.getContext('2d');
const cIcon = document.getElementById('charIcon'), cTxt = document.getElementById('charText');
const charS = { x: 100, y: 100, drag: false, ox: 0, oy: 0, time: 0, scale: .85, fuel: 100, action: 'idle', blinkT: 0, eyeOpen: true, mouthO: 0, lx: 0, ly: 0, emotion: 'happy', voiceOn: false };
const moods = { happy: ['😊', '😎', '🤩', '✨', '😄'], thinking: ['🤔', '🧐', '💭', '💡'], excited: ['🎉', '🔥', '⚡', '🚀'], hover: ['😲', '👀', '😂', '🤪'], working: ['⚙️', '💻', '🎨'], love: ['❤️', '😍', '🥰'], cool: ['😎', '🕶️', '🤟'] };
const thoughts = { welcome: { t: 'Hey Boss! Ready to design! 👑', m: 'happy' }, textAdd: { t: 'Text added! Try glow! 🔥', m: 'excited' }, imageAdd: { t: 'Image loaded! 📸', m: 'happy' }, bgRemove: { t: 'Background removed! ✨', m: 'excited' }, aiGen: { t: 'AI creating... ⚡', m: 'working' }, aiDone: { t: 'AI done! 🎨', m: 'excited' }, undo: { t: 'Undone! ⏪', m: 'happy' }, redo: { t: 'Redone! ⏩', m: 'happy' }, del: { t: 'Deleted! 💨', m: 'cool' }, sel: { t: 'Selected! 🎯', m: 'thinking' }, hover: { t: 'Hey! 😂', m: 'hover' }, hoverL: { t: 'I know I am cute! 😏', m: 'love' }, exp: { t: 'Exported! 💾', m: 'excited' }, bgChg: { t: 'BG changed! 🎨', m: 'excited' }, copy: { t: 'Cloned! 🧬', m: 'excited' }, err: { t: 'Oops! 😅', m: 'happy' }, reset: { t: 'Fresh start! 🧹', m: 'excited' }, idle1: { t: 'Try the AI generator! 🤖', m: 'thinking' }, idle2: { t: 'Looking good so far! 🔥', m: 'excited' }, idle3: { t: 'Need help? Hover me! 💡', m: 'thinking' } };
let curM = 'happy', emoT = null, hovC = 0, lastMouse = { x: 0, y: 0 };

function react(k) { const r = thoughts[k]; if (!r) return; charS.emotion = r.m; curM = r.m; cIcon.innerText = (moods[r.m] || moods.happy)[Math.floor(Math.random() * (moods[r.m] || moods.happy).length)]; cTxt.innerText = r.t; document.getElementById('logTxt').innerText = `${cIcon.innerText} ${r.t}`; if (charS.voiceOn) speak(r.t) }
function speak(t) { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.rate = 1.1; u.pitch = 1.3; u.volume = .5; speechSynthesis.speak(u) }

// Character renderer
function proj(x, y, z, yaw) { const c = Math.cos(yaw), s = Math.sin(yaw); const rx = x * c - z * s, rz = x * s + z * c; const f = 260, d = f / (f + rz + 200); return { x: cCv.width / 2 + rx * d * charS.scale, y: cCv.height / 2 + 16 + y * d * charS.scale, z: rz, sc: d * charS.scale } }
function dLimb(a, b, w, c1, c2) { const g = cX.createLinearGradient(a.x, a.y, b.x, b.y); g.addColorStop(0, c1); g.addColorStop(1, c2); cX.strokeStyle = g; cX.lineWidth = w; cX.lineCap = 'round'; cX.beginPath(); cX.moveTo(a.x, a.y); cX.lineTo(b.x, b.y); cX.stroke() }
function dSphere(p, r, c1, c2, gl) { const rd = r * p.sc; const g = cX.createRadialGradient(p.x - rd * .3, p.y - rd * .3, rd * .15, p.x, p.y, rd); g.addColorStop(0, c1); g.addColorStop(1, c2); cX.save(); if (gl) { cX.shadowColor = '#00f2fe'; cX.shadowBlur = 12 } cX.fillStyle = g; cX.beginPath(); cX.arc(p.x, p.y, rd, 0, Math.PI * 2); cX.fill(); cX.restore() }

function renderChar() {
    cX.clearRect(0, 0, cCv.width, cCv.height); charS.time += .016; const t = charS.time;
    charS.blinkT += .016; if (charS.blinkT > 3.5 + Math.random() * 2) { charS.eyeOpen = false; setTimeout(() => charS.eyeOpen = true, 150); charS.blinkT = 0 }
    charS.mouthO = speechSynthesis.speaking ? Math.sin(t * 20) * .5 + .5 : Math.sin(t * 5) * .2 + .2;
    const rect = cCv.getBoundingClientRect(); charS.lx = Math.max(-1, Math.min(1, (lastMouse.x - (charS.x + rect.width / 2)) / 300)); charS.ly = Math.max(-1, Math.min(1, (lastMouse.y - (charS.y + rect.height / 2)) / 300));

    // Auto jet & movement
    if (!charS.drag && charS.fuel > 20 && Math.random() < .001) { charS.action = 'fly'; charS.fuel -= 5; setTimeout(() => charS.action = 'idle', 2000) }
    if (charS.action === 'fly' && !charS.drag) { charS.y = Math.max(50, charS.y - 1); posChar() }
    if (charS.fuel < 100 && charS.action === 'idle') charS.fuel = Math.min(100, charS.fuel + .02);

    const wk = Math.sin(t * 4), bob = Math.sin(t * 2) * 2.5, yaw = charS.lx * .35;
    const skin = '#f4c89a', skinD = '#dba878', hair = '#2c1810', shirt = '#1e40af', pants = '#1e293b';

    // Shadow
    cX.save(); cX.fillStyle = 'rgba(0,0,0,.08)'; cX.beginPath(); cX.ellipse(cCv.width / 2, cCv.height - 14, 32 * charS.scale, 6 * charS.scale, 0, 0, Math.PI * 2); cX.fill(); cX.restore();

    const head = proj(0, -72 + bob, 0, yaw); const torso = proj(0, -24 + bob, 0, yaw);
    const lSh = proj(-24, -44 + bob, 0, yaw), rSh = proj(24, -44 + bob, 0, yaw);
    const lHand = proj(-32, 6 + bob + wk * 6, wk * 8, yaw), rHand = proj(32, 6 + bob - wk * 6, -wk * 8, yaw);
    const lFoot = proj(-14, 62 + bob + wk * 8, -wk * 4, yaw), rFoot = proj(14, 62 + bob - wk * 8, wk * 4, yaw);
    const lKnee = proj(-13, 34 + bob - wk * 6, wk * 5, yaw), rKnee = proj(13, 34 + bob + wk * 6, -wk * 5, yaw);
    const lHip = proj(-11, 4 + bob, 0, yaw), rHip = proj(11, 4 + bob, 0, yaw);

    // Jets
    if (charS.action === 'fly' || charS.fuel > 80) {
        const jL = proj(-15, -6 + bob, -14, yaw), jR = proj(15, -6 + bob, -14, yaw);
        dSphere(jL, 7, '#4b5563', '#1f2937', true); dSphere(jR, 7, '#4b5563', '#1f2937', true);
        if (charS.action === 'fly') { [jL, jR].forEach(jp => { const fH = 22 + Math.random() * 12; const fg = cX.createLinearGradient(jp.x, jp.y, jp.x, jp.y + fH * jp.sc); fg.addColorStop(0, '#fff'); fg.addColorStop(.15, '#00f2fe'); fg.addColorStop(.4, '#f59e0b'); fg.addColorStop(1, 'rgba(239,68,68,0)'); cX.fillStyle = fg; cX.beginPath(); cX.moveTo(jp.x - 4 * jp.sc, jp.y + 5 * jp.sc); cX.lineTo(jp.x + 4 * jp.sc, jp.y + 5 * jp.sc); cX.lineTo(jp.x + (Math.random() * 2 - 1) * jp.sc, jp.y + (5 + fH) * jp.sc); cX.closePath(); cX.fill() }) }
    }

    // Legs
    dLimb(lHip, lKnee, 11 * lHip.sc, pants, '#0f172a'); dLimb(lKnee, lFoot, 9 * lKnee.sc, pants, '#0f172a'); dSphere(lFoot, 6, '#374151', '#1f2937');
    dLimb(rHip, rKnee, 11 * rHip.sc, pants, '#0f172a'); dLimb(rKnee, rFoot, 9 * rKnee.sc, pants, '#0f172a'); dSphere(rFoot, 6, '#374151', '#1f2937');
    // Arms
    dLimb(lSh, lHand, 9 * lSh.sc, skin, skinD); dSphere(lHand, 4.5, skin, skinD);
    dLimb(rSh, rHand, 9 * rSh.sc, skin, skinD); dSphere(rHand, 4.5, skin, skinD);
    // Body
    const tP = proj(0, -22 + bob, 0, yaw); const g = cX.createLinearGradient(tP.x - 22 * tP.sc, tP.y - 28 * tP.sc, tP.x + 22 * tP.sc, tP.y + 28 * tP.sc); g.addColorStop(0, shirt); g.addColorStop(1, '#1e3a5f'); cX.save(); cX.shadowColor = '#00f2fe'; cX.shadowBlur = 6; cX.fillStyle = g; cX.beginPath(); cX.ellipse(tP.x, tP.y, 22 * tP.sc, 28 * tP.sc, 0, 0, Math.PI * 2); cX.fill(); cX.restore();
    if (Math.cos(yaw) > .1) { const lo = proj(0, -28 + bob, 0, yaw); cX.save(); cX.font = `bold ${10 * lo.sc}px Arial`; cX.textAlign = 'center'; cX.fillStyle = '#00f2fe'; cX.shadowColor = '#00f2fe'; cX.shadowBlur = 6; cX.fillText('DS', lo.x, lo.y); cX.restore() }

    // Head
    dSphere(head, 20, skin, '#c9935e', true);
    cX.save(); cX.fillStyle = hair; cX.beginPath(); cX.ellipse(head.x, head.y - 14 * head.sc, 18 * head.sc, 10 * head.sc, 0, Math.PI, 0); cX.fill();
    for (let i = -2; i <= 2; i++) { const sp = proj(i * 6, -98 + bob + Math.abs(i) * 3, 0, yaw); cX.beginPath(); cX.moveTo(sp.x - 3 * sp.sc, head.y - 10 * head.sc); cX.lineTo(sp.x, sp.y); cX.lineTo(sp.x + 3 * sp.sc, head.y - 10 * head.sc); cX.fill() } cX.restore();

    // Face
    const ff = Math.cos(yaw);
    if (ff > -.1) {
        const fa = Math.max(0, ff); const es = 9 * head.sc * Math.max(.3, ff); const ey = head.y - 1.5 * head.sc;
        cX.save(); cX.globalAlpha = fa;
        [-1, 1].forEach(side => {
            const ex = head.x + side * es;
            cX.fillStyle = '#fff'; cX.beginPath(); cX.ellipse(ex, ey, 3.8 * head.sc, charS.eyeOpen ? 3.4 * head.sc : .6 * head.sc, 0, 0, Math.PI * 2); cX.fill();
            if (charS.eyeOpen) { cX.fillStyle = side === -1 ? '#3b82f6' : '#8b5cf6'; cX.beginPath(); cX.arc(ex + charS.lx * 2 * head.sc, ey + charS.ly * 1.5 * head.sc, 1.8 * head.sc, 0, Math.PI * 2); cX.fill(); cX.fillStyle = '#000'; cX.beginPath(); cX.arc(ex + charS.lx * 2 * head.sc, ey + charS.ly * 1.5 * head.sc, .9 * head.sc, 0, Math.PI * 2); cX.fill(); cX.fillStyle = 'rgba(255,255,255,.8)'; cX.beginPath(); cX.arc(ex + 1 * head.sc, ey - 1 * head.sc, .7 * head.sc, 0, Math.PI * 2); cX.fill() }
            cX.strokeStyle = hair; cX.lineWidth = 1.8 * head.sc; cX.lineCap = 'round'; const bl = charS.emotion === 'excited' ? -2 : 0; cX.beginPath(); cX.moveTo(ex - 3.5 * head.sc, ey - 4 * head.sc + bl * head.sc); cX.quadraticCurveTo(ex, ey - 6.5 * head.sc + bl * head.sc, ex + 3.5 * head.sc, ey - 4 * head.sc + bl * head.sc); cX.stroke()
        });
        // Nose
        cX.fillStyle = '#c9935e'; cX.beginPath(); cX.moveTo(head.x, head.y + 1.5 * head.sc); cX.lineTo(head.x - 2 * head.sc, head.y + 6 * head.sc); cX.lineTo(head.x + 2 * head.sc, head.y + 6 * head.sc); cX.closePath(); cX.fill();
        // Mouth
        const mY = head.y + 10 * head.sc, mW = 6.5 * head.sc, mH = charS.mouthO * 4 * head.sc;
        cX.fillStyle = '#dc2626'; cX.beginPath(); cX.moveTo(head.x - mW, mY); cX.quadraticCurveTo(head.x, mY + mH + 2.5 * head.sc, head.x + mW, mY); cX.fill();
        if (charS.emotion === 'love' || charS.emotion === 'hover') { cX.fillStyle = 'rgba(239,68,68,.18)'; cX.beginPath(); cX.ellipse(head.x - 11 * head.sc, head.y + 4 * head.sc, 4 * head.sc, 2.5 * head.sc, 0, 0, Math.PI * 2); cX.fill(); cX.beginPath(); cX.ellipse(head.x + 11 * head.sc, head.y + 4 * head.sc, 4 * head.sc, 2.5 * head.sc, 0, 0, Math.PI * 2); cX.fill() }
        cX.restore();
    }
    dSphere(proj(-19, -72 + bob, -3, yaw), 3.5, skin, '#c9935e'); dSphere(proj(19, -72 + bob, -3, yaw), 3.5, skin, '#c9935e');
    requestAnimationFrame(renderChar)
}

document.addEventListener('mousemove', e => { lastMouse = { x: e.clientX, y: e.clientY } });
function posChar() { cEl.style.left = charS.x + 'px'; cEl.style.top = charS.y + 'px' }

// Drag
cEl.addEventListener('mousedown', e => { charS.drag = true; charS.ox = e.clientX - charS.x; charS.oy = e.clientY - charS.y; cEl.style.cursor = 'grabbing'; e.preventDefault(); e.stopPropagation() });
document.addEventListener('mousemove', e => { if (!charS.drag) return; charS.x = Math.max(-30, Math.min(innerWidth - 30, e.clientX - charS.ox)); charS.y = Math.max(0, Math.min(innerHeight - 40, e.clientY - charS.oy)); posChar() });
document.addEventListener('mouseup', () => { if (charS.drag) { charS.drag = false; cEl.style.cursor = 'grab' } });
cEl.addEventListener('touchstart', e => { e.preventDefault(); const tc = e.touches[0]; charS.drag = true; charS.ox = tc.clientX - charS.x; charS.oy = tc.clientY - charS.y }, { passive: false });
document.addEventListener('touchmove', e => { if (!charS.drag) return; const tc = e.touches[0]; charS.x = Math.max(-30, Math.min(innerWidth - 30, tc.clientX - charS.ox)); charS.y = Math.max(0, Math.min(innerHeight - 40, tc.clientY - charS.oy)); posChar() }, { passive: false });
document.addEventListener('touchend', () => { charS.drag = false });

// Hover
let hEmo = null;
cEl.addEventListener('mouseenter', () => { hovC = 0; react('hover'); if (hEmo) clearInterval(hEmo); hEmo = setInterval(() => { hovC++; cIcon.innerText = (moods.hover || moods.happy)[hovC % (moods.hover || moods.happy).length]; if (hovC > 8) { clearInterval(hEmo); hEmo = null; react('hoverL') } }, 300) });
cEl.addEventListener('mouseleave', () => { if (hEmo) { clearInterval(hEmo); hEmo = null } hovC = 0; curM = 'happy'; cIcon.innerText = '🤖'; cTxt.innerText = 'Ready! ⚡' });

// Ambient
setInterval(() => { if (charS.drag || hEmo) return; const em = moods[curM] || moods.happy; cIcon.innerText = em[Math.floor(Math.random() * em.length)] }, 4500);
setInterval(() => { if (charS.drag || hEmo) return; const il = ['idle1', 'idle2', 'idle3']; react(il[Math.floor(Math.random() * il.length)]) }, 20000);

// Wave on enter
setTimeout(() => { react('welcome') }, 1000);

// ── CANVAS FUNCTIONS ──
function setupC(w, h) { canvas.width = w; canvas.height = h; R() }
function headerSizeChange() { const v = document.getElementById('canvasSizeSelect').value; const p = v.split('x'); setupC(+p[0], +p[1]) }

function miniTab(btn, tbId, panId) { document.getElementById(tbId).querySelectorAll('.mt').forEach(b => b.classList.remove('active')); document.getElementById(panId).querySelectorAll('.mp').forEach(p => p.classList.remove('active')); btn.classList.add('active'); document.getElementById(btn.dataset.p)?.classList.add('active') }

function setBg(type, sub) { if (type === 'solid') bgCf = { type: 'solid', color: document.getElementById('bgSC').value }; else if (type === 'grad') bgCf = { type: 'grad', c1: document.getElementById('bgG1').value, c2: document.getElementById('bgG2').value, dir: document.getElementById('bgGD').value }; else if (type === 'pat') bgCf = { type: 'pat', pat: sub, pc: document.getElementById('bgPC').value, bc: document.getElementById('bgPB').value }; aiBg = null; sH(); R(); react('bgChg') }
function preBg(c1, c2) { bgCf = c1 === c2 ? { type: 'solid', color: c1 } : { type: 'grad', c1, c2, dir: 'diag' }; aiBg = null; sH(); R(); react('bgChg') }
function clearBg() { bgCf = null; aiBg = null; sH(); R() }

function paintBg() { const W = canvas.width, H = canvas.height; if (aiBg && aiBg.complete && aiBg.naturalWidth > 0) { const s = Math.max(W / aiBg.naturalWidth, H / aiBg.naturalHeight); ctx.drawImage(aiBg, (W - aiBg.naturalWidth * s) / 2, (H - aiBg.naturalHeight * s) / 2, aiBg.naturalWidth * s, aiBg.naturalHeight * s); return } if (!bgCf) { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#090f1d'); g.addColorStop(.5, '#0c1a2e'); g.addColorStop(1, '#060b16'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); return } const c = bgCf; if (c.type === 'solid') { ctx.fillStyle = c.color; ctx.fillRect(0, 0, W, H) } else if (c.type === 'grad') { let g; if (c.dir === 'rad') g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) / 2); else if (c.dir === 'lr') g = ctx.createLinearGradient(0, 0, W, 0); else if (c.dir === 'diag') g = ctx.createLinearGradient(0, 0, W, H); else g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c.c1); g.addColorStop(1, c.c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H) } else if (c.type === 'pat') { ctx.fillStyle = c.bc || '#0a0f1e'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.strokeStyle = c.pc || '#00f2fe'; ctx.fillStyle = c.pc || '#00f2fe'; ctx.globalAlpha = .18; const s = 30; if (c.pat === 'dots') for (let x = 0; x < W; x += s)for (let y = 0; y < H; y += s) { ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill() } else if (c.pat === 'grid') { ctx.lineWidth = 1; for (let x = 0; x <= W; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() } for (let y = 0; y <= H; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() } } else if (c.pat === 'stripe') { ctx.lineWidth = 2; for (let x = -H; x < W + H; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - H, H); ctx.stroke() } } else if (c.pat === 'check') for (let x = 0; x < W; x += s)for (let y = 0; y < H; y += s) { if ((Math.floor(x / s) + Math.floor(y / s)) % 2 === 0) ctx.fillRect(x, y, s, s) } else if (c.pat === 'diamond') { ctx.lineWidth = 1; for (let x = 0; x < W; x += s)for (let y = 0; y < H; y += s) { ctx.beginPath(); ctx.moveTo(x + s / 2, y); ctx.lineTo(x + s, y + s / 2); ctx.lineTo(x + s / 2, y + s); ctx.lineTo(x, y + s / 2); ctx.closePath(); ctx.stroke() } } else if (c.pat === 'zigzag') { ctx.lineWidth = 2; for (let y = 0; y < H; y += s) { ctx.beginPath(); for (let x = 0; x < W; x += s / 2) { const yo = (Math.floor(x / (s / 2)) % 2 === 0) ? y : y + s / 2; x === 0 ? ctx.moveTo(x, yo) : ctx.lineTo(x, yo) } ctx.stroke() } } ctx.restore() } }

// History
function serS() { return JSON.stringify({ els: els.map(e => { const c = { ...e }; if (e.type === 'image') { c.src = e.content.src; delete c.content } if (e.eraserMask) { c.mask = e.eraserMask.toDataURL(); delete c.eraserMask } if (e.textureImg) { c.tex = e.textureImg.src; delete c.textureImg } return c }), bgCf }) }
function sH() { uS.push(serS()); if (uS.length > 50) uS.shift(); rS = [] }
function triggerUndo() { if (uS.length <= 1) return; rS.push(uS.pop()); restS(uS[uS.length - 1]); react('undo') }
function triggerRedo() { if (!rS.length) return; const s = rS.pop(); uS.push(s); restS(s); react('redo') }
function restS(json) { const p = JSON.parse(json); bgCf = p.bgCf || null; let ic = p.els.filter(e => e.type === 'image').length, ld = 0; els = p.els.map(e => { const o = { ...e }; if (e.type === 'image') { o.content = new Image(); o.content.crossOrigin = 'anonymous'; o.content.src = e.src || ''; o.content.onload = () => { ld++; if (ld >= ic) R() }; o.eraserMask = document.createElement('canvas'); if (e.mask) { const mi = new Image(); mi.src = e.mask; mi.onload = () => { o.eraserMask.width = mi.width; o.eraserMask.height = mi.height; o.eraserMask.getContext('2d').drawImage(mi, 0, 0) } } else { o.eraserMask.width = 400; o.eraserMask.height = 400; const mc = o.eraserMask.getContext('2d'); mc.fillStyle = '#fff'; mc.fillRect(0, 0, 400, 400) } } if (e.tex) { o.textureImg = new Image(); o.textureImg.crossOrigin = 'anonymous'; o.textureImg.src = e.tex } return o }); selId = null; sUI(); if (!ic) R() }

// Layers
function addText() { els.push({ id: 't' + Date.now(), type: 'text', text: 'EDIT TEXT', x: canvas.width / 2, y: canvas.height / 2, scale: 100, rotate: 0, opacity: 100, font: 'Arial', color: '#00f2fe', charSpacing: 0, curve: 0, stroke: 2, strokeColor: '#000', emboss: 0, threeDDepth: 0, threeDRotate: 0, threeDColor: '#1e293b', threeDShadow: 0, reflection: 0, glow: 8, glowColor: '#00f2fe' }); selId = els[els.length - 1].id; sH(); R(); sUI(); react('textAdd') }

function addImg(ev) { const f = ev.target.files[0]; if (f) loadI(f); ev.target.value = '' }
function loadI(file) { const r = new FileReader(); r.readAsDataURL(file); r.onload = e => { const img = new Image(); img.src = e.target.result; img.onload = () => { const mc = document.createElement('canvas'); mc.width = img.width; mc.height = img.height; mc.getContext('2d').fillStyle = '#fff'; mc.getContext('2d').fillRect(0, 0, mc.width, mc.height); let sc = 50; if (img.width * (sc / 100) > canvas.width * .6) sc = Math.floor(canvas.width * .6 / img.width * 100); if (img.height * (sc / 100) > canvas.height * .6) sc = Math.min(sc, Math.floor(canvas.height * .6 / img.height * 100)); sc = Math.max(10, sc); els.push({ id: 'i' + Date.now(), type: 'image', content: img, x: canvas.width / 2 - img.width * (sc / 100) / 2, y: canvas.height / 2 - img.height * (sc / 100) / 2, scale: sc, rotate: 0, opacity: 100, eraserMask: mc }); selId = els[els.length - 1].id; sH(); R(); sUI(); react('imageAdd') } } }

function layerOp(a) { if (!selId) return; const i = els.findIndex(e => e.id === selId); if (i === -1) return; if (a === 'del') { els.splice(i, 1); selId = null; react('del') } else if (a === 'front') els.push(els.splice(i, 1)[0]); else if (a === 'back') els.unshift(els.splice(i, 1)[0]); else if (a === 'copy') { const s = els[i]; const c = { ...s, id: 'c' + Date.now(), x: s.x + 20, y: s.y + 20 }; if (s.type === 'image' && s.eraserMask) { const nm = document.createElement('canvas'); nm.width = s.eraserMask.width; nm.height = s.eraserMask.height; nm.getContext('2d').drawImage(s.eraserMask, 0, 0); c.eraserMask = nm; c.content = s.content } els.push(c); selId = c.id; react('copy') } sH(); R(); sUI() }

function alignEl(p) { const el = els.find(e => e.id === selId); if (!el) return; if (el.type === 'text') { if (p === 'l') el.x = 50; if (p === 'c') el.x = canvas.width / 2; if (p === 'r') el.x = canvas.width - 50; if (p === 'm') el.y = canvas.height / 2 } else { const w = el.content.width * (el.scale / 100), h = el.content.height * (el.scale / 100); if (p === 'l') el.x = 0; if (p === 'c') el.x = (canvas.width - w) / 2; if (p === 'r') el.x = canvas.width - w; if (p === 'm') el.y = (canvas.height - h) / 2 } sH(); R() }

// Canvas mouse
function gCC(e) { const r = canvas.getBoundingClientRect(); return { x: (e.offsetX ?? e.clientX - r.left) * (canvas.width / r.width), y: (e.offsetY ?? e.clientY - r.top) * (canvas.height / r.height) } }
canvas.addEventListener('mousedown', mD); canvas.addEventListener('mousemove', mMv); canvas.addEventListener('mouseup', mU); canvas.addEventListener('mouseleave', mU);
canvas.addEventListener('touchstart', e => { e.preventDefault(); const r = canvas.getBoundingClientRect(); const t = e.touches[0]; mD({ offsetX: (t.clientX - r.left) * (canvas.width / r.width), offsetY: (t.clientY - r.top) * (canvas.height / r.height) }) }, { passive: false });
canvas.addEventListener('touchmove', e => { e.preventDefault(); const r = canvas.getBoundingClientRect(); const t = e.touches[0]; mMv({ offsetX: (t.clientX - r.left) * (canvas.width / r.width), offsetY: (t.clientY - r.top) * (canvas.height / r.height) }) }, { passive: false });
canvas.addEventListener('touchend', mU);

function mD(e) { const { x, y } = gCC(e); if (mode !== 'select') { drag = true; doErase(x, y); return } let hit = null; for (let i = els.length - 1; i >= 0; i--) { if (hitEl(els[i], x, y)) { hit = els[i]; break } } if (hit) { selId = hit.id; drag = true; dX = x - hit.x; dY = y - hit.y; sUI(); react('sel') } else { selId = null; sUI() } R() }
function hitEl(el, x, y) { if (el.type === 'image') { const w = el.content.width * (el.scale / 100), h = el.content.height * (el.scale / 100); return x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h } if (el.type === 'text') { ctx.save(); ctx.font = `bold ${el.scale * .6}px "${el.font}"`; const tw = ctx.measureText(el.text || '').width; ctx.restore(); return x >= el.x - tw / 2 - 15 && x <= el.x + tw / 2 + 15 && y >= el.y - el.scale * .4 && y <= el.y + el.scale * .4 } return false }
function mMv(e) { const { x, y } = gCC(e); if (!drag) return; if (mode !== 'select') { doErase(x, y); return } const el = els.find(e => e.id === selId); if (el) { el.x = x - dX; el.y = y - dY; R() } }
function mU() { if (drag) sH(); drag = false }

function setMode(m, btn) { mode = m; canvas.style.cursor = m !== 'select' ? 'crosshair' : 'default'; document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active') }
function doErase(cx, cy) { const el = els.find(e => e.id === selId); if (!el || el.type !== 'image') return; const mc = el.eraserMask.getContext('2d'); const iw = el.content.width * (el.scale / 100); const rx = ((cx - el.x) / iw) * el.eraserMask.width; const ry = ((cy - el.y) / (el.content.height * (el.scale / 100))) * el.eraserMask.height; const br = bSz * (el.eraserMask.width / Math.max(iw, 1)); mc.save(); mc.globalCompositeOperation = 'destination-out'; mc.fillStyle = 'rgba(0,0,0,1)'; mc.beginPath(); if (mode === 'mask') mc.rect(rx - br, ry - br, br * 2, br * 2); else mc.arc(rx, ry, br, 0, Math.PI * 2); mc.fill(); mc.restore(); R() }
function restMask() { const el = els.find(e => e.id === selId); if (!el || el.type !== 'image') { alert('Select image!'); return } const mc = el.eraserMask.getContext('2d'); mc.globalCompositeOperation = 'source-over'; mc.fillStyle = '#fff'; mc.fillRect(0, 0, el.eraserMask.width, el.eraserMask.height); sH(); R() }

// Properties
function setTxt(v) { const el = els.find(e => e.id === selId); if (el && el.type === 'text') { el.text = v; R() } }
function setProp(p, v) { const el = els.find(e => e.id === selId); if (!el) return; const cp = ['color', 'strokeColor', 'threeDColor', 'glowColor', 'font']; el[p] = cp.includes(p) ? v : +v; const lm = { scale: ['v-sc', '%'], rotate: ['v-rt', '°'], opacity: ['v-op', '%'], charSpacing: ['v-sp', 'px'], curve: ['v-cu', '°'], stroke: ['v-st', 'px'], emboss: ['v-em', 'px'], threeDDepth: ['v-3d', 'px'], threeDRotate: ['v-3r', '°'], reflection: ['v-rf', '%'], glow: ['v-gw', 'px'] }; if (lm[p]) { const l = document.getElementById(lm[p][0]); if (l) l.innerText = v + lm[p][1] } R() }
function upFont(ev) { const f = ev.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = e => { const n = f.name.replace(/\.[^/.]+$/, ''); const fc = new FontFace(n, `url(${e.target.result})`); fc.load().then(l => { document.fonts.add(l); const sel = document.getElementById('fontSel'); const op = document.createElement('option'); op.value = n; op.textContent = n; sel.appendChild(op); sel.value = n }).catch(() => alert('Font error')) }; r.readAsDataURL(f); ev.target.value = '' }

function sV(id, v) { const e = document.getElementById(id); if (e) e.value = v ?? 0 }
function sL(id, v, s) { const e = document.getElementById(id); if (e) e.innerText = (v ?? 0) + s }
function sUI() {
    const el = els.find(e => e.id === selId); const lb = document.getElementById('selLbl'); if (!el) { if (lb) lb.innerText = 'None'; return } if (lb) lb.innerText = el.type === 'text' ? `"${(el.text || '').substring(0, 12)}"` : 'Image'; sV('sl-sc', el.scale ?? 100); sL('v-sc', el.scale ?? 100, '%'); sV('sl-rt', el.rotate ?? 0); sL('v-rt', el.rotate ?? 0, '°'); sV('sl-op', el.opacity ?? 100); sL('v-op', el.opacity ?? 100, '%');
    if (el.type === 'text') { document.getElementById('txtIn').value = el.text; const fs = document.getElementById('fontSel'); let has = false; fs.querySelectorAll('option').forEach(o => { if (o.value === el.font) has = true }); if (has) fs.value = el.font; document.getElementById('txtCol').value = el.color || '#00f2fe'; document.getElementById('stCol').value = el.strokeColor || '#000'; document.getElementById('tdCol').value = el.threeDColor || '#1e293b'; document.getElementById('gwCol').value = el.glowColor || '#00f2fe'; sV('sl-sp', el.charSpacing ?? 0); sL('v-sp', el.charSpacing ?? 0, 'px'); sV('sl-cu', el.curve ?? 0); sL('v-cu', el.curve ?? 0, '°'); sV('sl-st', el.stroke ?? 2); sL('v-st', el.stroke ?? 2, 'px'); sV('sl-em', el.emboss ?? 0); sL('v-em', el.emboss ?? 0, 'px'); sV('sl-3d', el.threeDDepth ?? 0); sL('v-3d', el.threeDDepth ?? 0, 'px'); sV('sl-rf', el.reflection ?? 0); sL('v-rf', el.reflection ?? 0, '%'); sV('sl-gw', el.glow ?? 8); sL('v-gw', el.glow ?? 8, 'px') }
}

// Text render
function dTxt(el) {
    ctx.save(); ctx.globalAlpha = el.opacity / 100; const fs = Math.max(el.scale * .6, 8); ctx.font = `bold ${fs}px "${el.font || 'Arial'}"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const txt = el.text || '', sp = el.charSpacing || 0; function tw(s) { let w = 0; for (const c of s) w += ctx.measureText(c).width + sp; return Math.max(w - sp, 1) } ctx.save(); ctx.translate(el.x, el.y); ctx.rotate(el.rotate * Math.PI / 180);
    if (el.curve && el.curve !== 0) { const ang = el.curve / 180 * Math.PI, al = tw(txt), rad = al / Math.abs(ang) || 300; let ca = -Math.PI / 2 - ang / 2; for (const ch of txt) { const cw = ctx.measureText(ch).width + sp, dA = cw / rad; ctx.save(); ctx.translate(Math.cos(ca + dA / 2) * rad, Math.sin(ca + dA / 2) * rad + (el.curve > 0 ? rad : -rad)); ctx.rotate(ca + dA / 2 + Math.PI / 2 + (el.curve > 0 ? 0 : Math.PI)); cFx(el, ch, 0, 0); ctx.restore(); ca += dA } }
    else { const total = tw(txt); let xO = -total / 2; for (const ch of txt) { const cw = ctx.measureText(ch).width; cFx(el, ch, xO + cw / 2, 0); xO += cw + sp } if ((el.reflection || 0) > 0) { ctx.save(); ctx.scale(1, -1); ctx.globalAlpha = el.reflection / 100 * .45; const rg = ctx.createLinearGradient(0, 0, 0, fs); rg.addColorStop(0, el.color || '#00f2fe'); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; let x2 = -total / 2; for (const ch of txt) { const cw = ctx.measureText(ch).width; ctx.fillText(ch, x2 + cw / 2, -fs * .15); x2 += cw + sp } ctx.restore() } } ctx.restore(); ctx.restore()
}

function cFx(el, ch, x, y) { const d = el.threeDDepth || 0; if ((el.glow || 0) > 0) { ctx.save(); ctx.shadowColor = el.glowColor || '#00f2fe'; ctx.shadowBlur = el.glow; ctx.fillStyle = el.color || '#00f2fe'; ctx.fillText(ch, x, y); ctx.restore() } if (d > 0) { const t = (el.threeDRotate || 0) * .02; ctx.fillStyle = el.threeDColor || '#1e293b'; for (let i = d; i >= 1; i--)ctx.fillText(ch, x + i * .8, y + i * .6 + t * i) } if ((el.emboss || 0) > 0) { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillText(ch, x - el.emboss * .4, y - el.emboss * .4); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillText(ch, x + el.emboss * .4, y + el.emboss * .4); ctx.restore() } if ((el.stroke || 0) > 0) { ctx.save(); ctx.lineWidth = el.stroke; ctx.strokeStyle = el.strokeColor || '#000'; ctx.lineJoin = 'round'; ctx.strokeText(ch, x, y); ctx.restore() } ctx.fillStyle = el.color || '#00f2fe'; ctx.fillText(ch, x, y) }

function R() { ctx.clearRect(0, 0, canvas.width, canvas.height); paintBg(); els.forEach(el => { ctx.save(); ctx.globalAlpha = (el.opacity ?? 100) / 100; if (el.type === 'image') { if (!el.content?.complete || !el.content.naturalWidth) { ctx.restore(); return } const w = el.content.width * (el.scale / 100), h = el.content.height * (el.scale / 100); if (w <= 0 || h <= 0) { ctx.restore(); return } ctx.translate(el.x + w / 2, el.y + h / 2); ctx.rotate(el.rotate * Math.PI / 180); const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h; const tx = tmp.getContext('2d'); tx.drawImage(el.content, 0, 0, w, h); if (el.eraserMask) { tx.globalCompositeOperation = 'destination-in'; tx.drawImage(el.eraserMask, 0, 0, w, h) } ctx.drawImage(tmp, -w / 2, -h / 2) } else if (el.type === 'text') dTxt(el); ctx.restore() }) }

// AI
function bgRemove(method) {
    const el = els.find(e => e.id === selId); if (!el || el.type !== 'image') { alert('Select image!'); return } react('bgRemove'); loader.style.display = 'flex'; document.getElementById('ldrMsg').innerText = 'Removing...'; const tol = +(document.getElementById('sl-tol')?.value || 50); setTimeout(() => {
        try {
            const mc = el.eraserMask, mx = mc.getContext('2d'); const tc = document.createElement('canvas'); tc.width = el.content.width; tc.height = el.content.height; tc.getContext('2d').drawImage(el.content, 0, 0); let d; try { d = tc.getContext('2d').getImageData(0, 0, tc.width, tc.height) } catch (_) { loader.style.display = 'none'; alert('CORS'); return } const data = d.data, W = tc.width, H = tc.height; mx.globalCompositeOperation = 'source-over'; mx.fillStyle = '#fff'; mx.fillRect(0, 0, mc.width, mc.height); const md = mx.getImageData(0, 0, mc.width, mc.height), mD = md.data, scX = mc.width / W, scY = mc.height / H;
            function mark(px, py) { const mx2 = Math.round(px * scX), my2 = Math.round(py * scY); if (mx2 >= 0 && mx2 < mc.width && my2 >= 0 && my2 < mc.height) { const mi = (my2 * mc.width + mx2) * 4; mD[mi] = mD[mi + 1] = mD[mi + 2] = mD[mi + 3] = 0 } }
            if (method === 'color' || method === 'smart') { const corners = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]]; let tR = 0, tG = 0, tB = 0; corners.forEach(([cx, cy]) => { const i = (cy * W + cx) * 4; tR += data[i]; tG += data[i + 1]; tB += data[i + 2] }); tR /= 4; tG /= 4; tB /= 4; for (let py = 0; py < H; py++)for (let px = 0; px < W; px++) { const si = (py * W + px) * 4; if (Math.sqrt((data[si] - tR) ** 2 + (data[si + 1] - tG) ** 2 + (data[si + 2] - tB) ** 2) < tol) mark(px, py) } }
            if (method === 'bright' || method === 'smart') { for (let py = 0; py < H; py++)for (let px = 0; px < W; px++) { const si = (py * W + px) * 4; const b = (data[si] + data[si + 1] + data[si + 2]) / 3; if (b > 255 - tol / 2 || b < tol / 2) mark(px, py) } }
            if (method === 'edge' || method === 'smart') { const vis = new Uint8Array(W * H);[[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]].forEach(([sx, sy]) => { const stk = [[sx, sy]]; const ri = (sy * W + sx) * 4; const rR = data[ri], rG = data[ri + 1], rB = data[ri + 2]; while (stk.length) { const [cx, cy] = stk.pop(); if (cx < 0 || cx >= W || cy < 0 || cy >= H) continue; const idx = cy * W + cx; if (vis[idx]) continue; vis[idx] = 1; const si = idx * 4; if (Math.sqrt((data[si] - rR) ** 2 + (data[si + 1] - rG) ** 2 + (data[si + 2] - rB) ** 2) < tol) { mark(cx, cy); if (stk.length < 500000) stk.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]) } } }) }
            mx.putImageData(md, 0, 0); sH(); R()
        } catch { react('err') } finally { loader.style.display = 'none' }
    }, 500)
}

async function generateAI() {
    const pv = (document.getElementById('aiPrompt')?.value || '').trim(); if (!pv) { alert('Enter prompt!'); return } const style = document.getElementById('aiStyle')?.value || ''; const aiMode = document.getElementById('aiMode')?.value || 'bg'; loader.style.display = 'flex'; document.getElementById('ldrMsg').innerText = '⚡ Generating...'; react('aiGen'); const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(pv + style)}?width=${canvas.width}&height=${canvas.height}&nologo=true&seed=${Math.floor(Math.random() * 99999)}`; const nb = new Image(); nb.crossOrigin = 'anonymous'; const to = setTimeout(() => { loader.style.display = 'none'; react('err') }, 50000); setTimeout(() => { if (loader.style.display !== 'none') document.getElementById('ldrMsg').innerText = '🎨 Almost done...' }, 4000);
    nb.onload = () => { clearTimeout(to); loader.style.display = 'none'; if (aiMode === 'bg') { aiBg = nb; bgCf = null; sH(); R(); react('aiDone') } else { const mc = document.createElement('canvas'); mc.width = nb.width; mc.height = nb.height; mc.getContext('2d').fillRect(0, 0, mc.width, mc.height); let sc = 50; if (nb.width * (sc / 100) > canvas.width * .6) sc = Math.floor(canvas.width * .6 / nb.width * 100); sc = Math.max(10, sc); els.push({ id: 'ai' + Date.now(), type: 'image', content: nb, x: canvas.width / 2 - nb.width * (sc / 100) / 2, y: canvas.height / 2 - nb.height * (sc / 100) / 2, scale: sc, rotate: 0, opacity: 100, eraserMask: mc }); selId = els[els.length - 1].id; sH(); R(); sUI(); react('aiDone') } }; nb.onerror = () => { clearTimeout(to); loader.style.display = 'none'; react('err') }; nb.src = url
}

function resetAll() { if (!confirm('Reset?')) return; els = []; selId = null; aiBg = null; bgCf = null; uS = []; rS = []; sUI(); R(); react('reset') }
function exportHD() { try { const l = document.createElement('a'); l.download = 'DesignSmith_' + Date.now() + '.png'; l.href = canvas.toDataURL('image/png', 1); l.click(); react('exp') } catch { react('err') } }
function doVoice(ev) { ev.preventDefault(); const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) { alert('Not supported'); return } const rec = new SR(); rec.lang = 'en-US'; const btn = ev.target; btn.innerText = '🔴'; rec.onresult = e => { document.getElementById('aiPrompt').value = e.results[0][0].transcript }; rec.onend = () => { btn.innerText = '🎙️' }; rec.start() }

// Keyboard
document.addEventListener('keydown', e => { const t = document.activeElement?.tagName; if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return; if ((e.key === 'Delete' || e.key === 'Backspace') && selId) layerOp('del'); if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); triggerUndo() } if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') { e.preventDefault(); triggerRedo() } if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); if (selId) layerOp('copy') } if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); exportHD() } if (selId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const el = els.find(i => i.id === selId); const st = e.shiftKey ? 10 : 1; if (el) { if (e.key === 'ArrowUp') el.y -= st; if (e.key === 'ArrowDown') el.y += st; if (e.key === 'ArrowLeft') el.x -= st; if (e.key === 'ArrowRight') el.x += st; R() } } });

addEventListener('dragover', e => e.preventDefault()); addEventListener('drop', e => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(f => { if (f.type.startsWith('image/')) loadI(f) }) });

// INIT
document.addEventListener('DOMContentLoaded', () => { setupC(1280, 720); sH(); charS.x = innerWidth - 180; charS.y = innerHeight - 200; posChar(); renderChar(); speechSynthesis.getVoices(); react('welcome'); console.log('🎨 DesignSmith AI Studio Pro Ready!') });