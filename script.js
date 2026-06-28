/* =============================================
   ARJONA +AI STUDIO — COMPLETE JS (PART 1)
   AI BRAIN + RESIZE + CHARACTER + MODALS
   + THEME + PANEL LOCK + CORNER HANDLES
   ============================================= */

/* ===== AI CHARACTER BRAIN ===== */
var charMood = 'happy', charVoiceOn = false, typewriterTimer = null, lastActionTime = Date.now();
var charMemory = [];
try { charMemory = JSON.parse(localStorage.getItem('ds_mem') || '[]'); } catch (e) { charMemory = []; }

function getCanvasContext() {
    var texts = [], imgC = 0;
    for (var i = 0; i < els.length; i++) {
        if (els[i].type === 'text') texts.push(els[i].text || '');
        if (els[i].type === 'image') imgC++;
    }
    return els.length + ' els,' + imgC + ' imgs,texts:[' + texts.join(',') + '],bg:' + (bgCf ? bgCf.type : (aiBg ? 'ai' : 'default'));
}

function addMemory(action) {
    charMemory.push({ a: action, t: Date.now() });
    if (charMemory.length > 5) charMemory = charMemory.slice(-5);
    try { localStorage.setItem('ds_mem', JSON.stringify(charMemory)); } catch (e) { }
    lastActionTime = Date.now();
}

function askCharacter(context) {
    addMemory(context);
    var memStr = '';
    for (var i = 0; i < charMemory.length; i++) { memStr += (i > 0 ? ',' : '') + charMemory[i].a; }
    var prompt = 'You are Arjona AI, funny Hinglish design buddy. User did: ' + context + '. Canvas: ' + getCanvasContext() + '. Recent: ' + memStr + '. Reply 1 line max 15 words.';
    fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt)).then(function (r) { return r.text(); }).then(function (text) {
        text = (text || '').trim().substring(0, 80);
        if (!text || text.length < 2) text = 'Mast kaam boss! Fire hai! 🔥';
        setMood(context); typewriterShow(text);
        if (charVoiceOn) speakText(text);
    }).catch(function () {
        var fb = ['Mast kaam! 🔥', 'Bhai waah! 🎨', 'Solid design! 💪', 'Boss mode! 👑', 'Jhakaas! 🤩', 'Ekdum fire! 🔥'];
        setMood(context); typewriterShow(fb[Math.floor(Math.random() * fb.length)]);
    });
}

function setMood(context) {
    var c = (context || '').toLowerCase();
    if (c.indexOf('error') >= 0 || c.indexOf('fail') >= 0) charMood = 'sad';
    else if (c.indexOf('generate') >= 0 || c.indexOf('export') >= 0 || c.indexOf('done') >= 0) charMood = 'excited';
    else if (c.indexOf('idle') >= 0) charMood = 'thinking';
    else if (c.indexOf('hover') >= 0) charMood = 'naughty';
    else charMood = 'happy';
    var bub = document.getElementById('chBub');
    if (bub) bub.className = 'chBub mood-' + charMood;
    var em = { happy: '😊', thinking: '🤔', excited: '🔥', naughty: '😜', sad: '😢' };
    if (chI) chI.innerText = em[charMood] || '🤖';
}

function typewriterShow(text) {
    if (typewriterTimer) clearInterval(typewriterTimer);
    var el = document.getElementById('chT'); if (!el) return;
    el.innerText = ''; var idx = 0;
    typewriterTimer = setInterval(function () {
        if (idx < text.length) { el.innerText = text.substring(0, idx + 1); idx++; }
        else { clearInterval(typewriterTimer); typewriterTimer = null; }
    }, 22);
    var l1 = document.getElementById('logTxt'), l2 = document.getElementById('logTxt2');
    if (l1) l1.innerText = text; if (l2) l2.innerText = text;
}

function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    try { speechSynthesis.cancel(); } catch (e) { }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'hi-IN'; u.rate = 1.1; u.volume = 0.7;
    u.pitch = charMood === 'excited' ? 1.4 : charMood === 'sad' ? 0.8 : 1.1;
    u.onboundary = function () { if (chI) chI.innerText = chI.innerText === '😮' ? '😊' : '😮'; };
    u.onend = function () { var em = { happy: '😊', thinking: '🤔', excited: '🔥', naughty: '😜', sad: '😢' }; if (chI) chI.innerText = em[charMood] || '🤖'; };
    try { speechSynthesis.speak(u); } catch (e) { }
}

function toggleVoice() {
    charVoiceOn = !charVoiceOn;
    var btn = document.getElementById('voiceBtn');
    if (btn) btn.innerText = charVoiceOn ? '🔊' : '🔇';
    askCharacter(charVoiceOn ? 'voice on' : 'voice off');
}

function talkToAI() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech not supported'); return; }
    var rec = new SR(); rec.lang = 'en-US';
    var btn = document.getElementById('talkBtn');
    if (btn) btn.innerText = '🔴';
    rec.onresult = function (e) { askCharacter('user said: ' + e.results[0][0].transcript); };
    rec.onend = function () { if (btn) btn.innerText = '🎙️'; };
    rec.onerror = function () { if (btn) btn.innerText = '🎙️'; };
    rec.start();
}

function charSetSize(val) {
    chS.sc = parseInt(val) / 100;
    var lbl = document.getElementById('v-char');
    if (lbl) lbl.innerText = val + '%';
}

function react(k) { askCharacter(k); }

/* IDLE CHECK */
setInterval(function () {
    if (Date.now() - lastActionTime > 15000) { askCharacter('user idle'); lastActionTime = Date.now(); }
}, 10000);

/* ===== THEME ===== */
function toggleTheme() {
    var h = document.documentElement;
    var n = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    h.setAttribute('data-theme', n);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.innerText = n === 'dark' ? '🌙 Night' : '☀️ Day';
    try { localStorage.setItem('ds_theme', n); } catch (e) { }
}

function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('ds_theme'); } catch (e) { }
    if (!saved) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches) saved = 'light';
        else saved = 'dark';
    }
    document.documentElement.setAttribute('data-theme', saved);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.innerText = saved === 'dark' ? '🌙 Night' : '☀️ Day';
}

/* ===== MODALS ===== */
function openHelp() { document.getElementById('helpModal').style.display = 'flex'; }
function closeHelp() { document.getElementById('helpModal').style.display = 'none'; }
function openDev() { document.getElementById('devModal').style.display = 'flex'; }
function closeDev() { document.getElementById('devModal').style.display = 'none'; }

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeHelp(); closeDev(); }
});

/* ===== DEV OPTIONS ===== */
function devSet(prop, val) {
    document.documentElement.style.setProperty(prop, val);
    var settings = {};
    try { settings = JSON.parse(localStorage.getItem('ds_dev') || '{}'); } catch (e) { }
    settings[prop] = val;
    try { localStorage.setItem('ds_dev', JSON.stringify(settings)); } catch (e) { }
    if (prop === '--r') { var lbl = document.getElementById('devRadVal'); if (lbl) lbl.innerText = val; }
}

function devReset() {
    var props = ['--ac', '--bg', '--sf', '--tx', '--r'];
    for (var i = 0; i < props.length; i++) { document.documentElement.style.removeProperty(props[i]); }
    document.documentElement.style.fontSize = '';
    try { localStorage.removeItem('ds_dev'); } catch (e) { }
}

function devExport() {
    var settings = {};
    try { settings = JSON.parse(localStorage.getItem('ds_dev') || '{}'); } catch (e) { }
    var blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    var link = document.createElement('a');
    link.download = 'arjona_settings.json'; link.href = URL.createObjectURL(blob); link.click();
}

function devImport() {
    var input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = function (e) {
        var file = e.target.files[0]; if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var settings = JSON.parse(ev.target.result);
                for (var k in settings) { document.documentElement.style.setProperty(k, settings[k]); }
                localStorage.setItem('ds_dev', JSON.stringify(settings));
            } catch (err) { alert('Invalid settings file'); }
        };
        reader.readAsText(file);
    };
    input.click();
}

function restoreDevSettings() {
    try {
        var settings = JSON.parse(localStorage.getItem('ds_dev') || '{}');
        for (var k in settings) { document.documentElement.style.setProperty(k, settings[k]); }
    } catch (e) { }
}

/* ===== PANEL LOCK ===== */
function togglePanelLock() {
    var locked = document.body.getAttribute('data-panels-locked') === 'true';
    var newState = !locked;
    document.body.setAttribute('data-panels-locked', newState ? 'true' : 'false');
    var overlay = document.getElementById('lockOverlay');
    if (overlay) overlay.style.display = newState ? 'flex' : 'none';
    var btn = document.getElementById('panelLockBtn');
    if (btn) btn.innerText = newState ? '🔓' : '🔒';
    try { localStorage.setItem('ds_locked', newState ? '1' : '0'); } catch (e) { }
}

function unlockPanels() {
    document.body.setAttribute('data-panels-locked', 'false');
    var overlay = document.getElementById('lockOverlay');
    if (overlay) overlay.style.display = 'none';
    var btn = document.getElementById('panelLockBtn');
    if (btn) btn.innerText = '🔒';
    try { localStorage.setItem('ds_locked', '0'); } catch (e) { }
    closeDev();
}

function restorePanelLock() {
    try {
        var locked = localStorage.getItem('ds_locked') === '1';
        if (locked) {
            document.body.setAttribute('data-panels-locked', 'true');
            var overlay = document.getElementById('lockOverlay');
            if (overlay) overlay.style.display = 'flex';
            var btn = document.getElementById('panelLockBtn');
            if (btn) btn.innerText = '🔓';
        }
    } catch (e) { }
}

/* ===== RESIZE PANELS ===== */
var resLOn = false, resLX = 0, resLW = 0, resBOn = false, resBY = 0, resBH = 0;

/* ===== CORNER RESIZE ===== */
var cornerDrag = null, cornerStartX = 0, cornerStartY = 0, cornerStartScale = 100;

function showCornerHandles(el) {
    var ids = ['rhNW', 'rhNE', 'rhSW', 'rhSE'];
    if (!el) { for (var i = 0; i < ids.length; i++) { var h = document.getElementById(ids[i]); if (h) h.style.display = 'none'; } return; }
    var cr = canvas.getBoundingClientRect();
    var sx = cr.width / canvas.width, sy = cr.height / canvas.height;
    var ex, ey, ew, eh;
    if (el.type === 'image') {
        ew = el.content.width * (el.scale / 100); eh = el.content.height * (el.scale / 100); ex = el.x; ey = el.y;
    } else {
        ctx.save(); ctx.font = 'bold ' + (el.scale * 0.6) + 'px "' + el.font + '"';
        var tw = ctx.measureText(el.text || '').width; ctx.restore();
        ew = tw + 20; eh = el.scale * 0.8; ex = el.x - ew / 2; ey = el.y - eh / 2;
    }
    var px = cr.left + ex * sx, py = cr.top + ey * sy, pw = ew * sx, ph = eh * sy;
    var positions = [[px - 5, py - 5], [px + pw - 5, py - 5], [px - 5, py + ph - 5], [px + pw - 5, py + ph - 5]];
    for (var i = 0; i < ids.length; i++) {
        var h = document.getElementById(ids[i]);
        if (h) { h.style.left = positions[i][0] + 'px'; h.style.top = positions[i][1] + 'px'; h.style.display = 'block'; }
    }
}

function hideCornerHandles() {
    var ids = ['rhNW', 'rhNE', 'rhSW', 'rhSE'];
    for (var i = 0; i < ids.length; i++) { var h = document.getElementById(ids[i]); if (h) h.style.display = 'none'; }
}

function initCornerResize(id, e) {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (!el) return;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    cornerDrag = id; cornerStartX = e.clientX; cornerStartY = e.clientY; cornerStartScale = el.scale;
    document.body.style.userSelect = 'none';
}

/* ===== SPACE BG ===== */
var bgC = document.getElementById('bgCanvas'), bgX = bgC.getContext('2d'), strs = [], shts = [], nP = 0;
function iBg() { bgC.width = innerWidth; bgC.height = innerHeight; strs = []; for (var i = 0; i < 100; i++)strs.push({ x: Math.random() * bgC.width, y: Math.random() * bgC.height, s: Math.random() * 1.2 + .3, o: Math.random(), d: Math.random() * .01 + .002, c: Math.random() > .75 }); }
function bF() { nP += .003; bgX.fillStyle = '#020206'; bgX.fillRect(0, 0, bgC.width, bgC.height); var nx = bgC.width / 2 + Math.cos(nP) * 60, ny = bgC.height * .35 + Math.sin(nP * .7) * 30, nr = Math.max(bgC.width * .3, 250); var ng = bgX.createRadialGradient(nx, ny, 10, nx, ny, nr); ng.addColorStop(0, 'rgba(124,58,237,.08)'); ng.addColorStop(.3, 'rgba(0,242,254,.03)'); ng.addColorStop(1, 'rgba(0,0,0,0)'); bgX.fillStyle = ng; bgX.fillRect(0, 0, bgC.width, bgC.height); for (var i = 0; i < strs.length; i++) { var s = strs[i]; s.o += s.d; if (s.o > 1 || s.o < 0) s.d = -s.d; bgX.fillStyle = 'rgba(' + (s.c ? '124,58,237' : '0,242,254') + ',' + Math.max(0, Math.min(1, s.o)) + ')'; bgX.beginPath(); bgX.arc(s.x, s.y, s.s, 0, Math.PI * 2); bgX.fill(); } if (shts.length < 2 && Math.random() < .006) shts.push({ x: Math.random() * bgC.width * .7, y: -10, l: Math.random() * 60 + 30, o: 1, dx: Math.random() * 3 + 2, dy: Math.random() * 2 + 2 }); for (var i = shts.length - 1; i >= 0; i--) { var p = shts[i]; p.x += p.dx; p.y += p.dy; p.o -= .011; if (p.o <= 0 || p.x > bgC.width || p.y > bgC.height) { shts.splice(i, 1); continue; } var t = p.dx + p.dy, tx = p.x - p.l * (p.dx / t), ty = p.y - p.l * (p.dy / t); var sg = bgX.createLinearGradient(p.x, p.y, tx, ty); sg.addColorStop(0, 'rgba(255,255,255,' + p.o + ')'); sg.addColorStop(.3, 'rgba(0,242,254,' + p.o * .6 + ')'); sg.addColorStop(1, 'rgba(124,58,237,0)'); bgX.save(); bgX.strokeStyle = sg; bgX.lineWidth = 1.5; bgX.lineCap = 'round'; bgX.shadowColor = '#00f2fe'; bgX.shadowBlur = 5; bgX.beginPath(); bgX.moveTo(p.x, p.y); bgX.lineTo(tx, ty); bgX.stroke(); bgX.restore(); } requestAnimationFrame(bF); }
window.addEventListener('resize', function () { iBg(); R(); }); iBg(); bF();

/* ===== STATE ===== */
var canvas = document.getElementById('mainCanvas'), ctx = canvas.getContext('2d'), loader = document.getElementById('loader');
var els = [], selId = null, aiBg = null, bgCf = null, uS = [], rS = [], mode = 'select', bSz = 25, drag = false, dX = 0, dY = 0;

/* ===== TABS ===== */
function bpTab(btn) { var ts = document.querySelectorAll('.bp-tab'), ps = document.querySelectorAll('.bp-pan'); for (var i = 0; i < ts.length; i++)ts[i].classList.remove('active'); for (var i = 0; i < ps.length; i++)ps[i].classList.remove('active'); btn.classList.add('active'); var p = document.getElementById(btn.getAttribute('data-p')); if (p) p.classList.add('active'); }
function bgT(btn) { var ts = document.querySelectorAll('.bgt'), ps = document.querySelectorAll('.bgp'); for (var i = 0; i < ts.length; i++)ts[i].classList.remove('active'); for (var i = 0; i < ps.length; i++)ps[i].classList.remove('active'); btn.classList.add('active'); var p = document.getElementById(btn.getAttribute('data-p')); if (p) p.classList.add('active'); }

/* ===== 3D CHARACTER — 180% default ===== */
var cEl = document.getElementById('charW'), cCv = document.getElementById('chCv'), cX = cCv.getContext('2d'), chI = document.getElementById('chI'), chT = document.getElementById('chT');
var chS = { x: 100, y: 100, drag: false, ox: 0, oy: 0, t: 0, sc: 1.80, blink: 0, eyeO: true, mo: 0, lx: 0, ly: 0, fuel: 100 };
var lastM = { x: 0, y: 0 };

function proj(x, y, z, yaw) { var c = Math.cos(yaw), s = Math.sin(yaw), rx = x * c - z * s, rz = x * s + z * c, f = 160, d = f / (f + rz + 130); return { x: cCv.width / 2 + rx * d * chS.sc, y: cCv.height / 2 + 8 + y * d * chS.sc, z: rz, s: d * chS.sc }; }
function dL(a, b, w, c1, c2) { var g = cX.createLinearGradient(a.x, a.y, b.x, b.y); g.addColorStop(0, c1); g.addColorStop(1, c2); cX.strokeStyle = g; cX.lineWidth = w; cX.lineCap = 'round'; cX.beginPath(); cX.moveTo(a.x, a.y); cX.lineTo(b.x, b.y); cX.stroke(); }
function dSp(p, r, c1, c2, gl) { var rd = r * p.s, g = cX.createRadialGradient(p.x - rd * .3, p.y - rd * .3, rd * .15, p.x, p.y, rd); g.addColorStop(0, c1); g.addColorStop(1, c2); cX.save(); if (gl) { cX.shadowColor = '#00f2fe'; cX.shadowBlur = 4; } cX.fillStyle = g; cX.beginPath(); cX.arc(p.x, p.y, rd, 0, Math.PI * 2); cX.fill(); cX.restore(); }

function renderCh() { cX.clearRect(0, 0, cCv.width, cCv.height); chS.t += .016; var t = chS.t; chS.blink += .016; if (chS.blink > 3 + Math.random() * 2) { chS.eyeO = false; setTimeout(function () { chS.eyeO = true; }, 120); chS.blink = 0; } chS.mo = Math.sin(t * 5) * .12 + .12; var rect = cCv.getBoundingClientRect(); chS.lx = Math.max(-1, Math.min(1, (lastM.x - (chS.x + rect.width / 2)) / 220)); chS.ly = Math.max(-1, Math.min(1, (lastM.y - (chS.y + rect.height / 2)) / 220)); if (!chS.drag && chS.fuel > 15 && Math.random() < .0002) { chS.fuel -= .4; chS.y = Math.max(40, chS.y - .4); posC(); } if (chS.fuel < 100) chS.fuel = Math.min(100, chS.fuel + .005); var wk = Math.sin(t * 2.8), bob = Math.sin(t * 1.3) * 1.5, yaw = chS.lx * .22; var sk = '#f4c89a', skD = '#dba878', hr = '#2c1810', sh = '#1e40af', pn = '#1e293b'; cX.save(); cX.fillStyle = 'rgba(0,0,0,.03)'; cX.beginPath(); cX.ellipse(cCv.width / 2, cCv.height - 5, 16 * chS.sc, 3 * chS.sc, 0, 0, Math.PI * 2); cX.fill(); cX.restore(); var head = proj(0, -48 + bob, 0, yaw), lS = proj(-13, -28 + bob, 0, yaw), rS_ = proj(13, -28 + bob, 0, yaw), lH = proj(-16, 3 + bob + wk * 2, wk * 3, yaw), rH = proj(16, 3 + bob - wk * 2, -wk * 3, yaw), lHip = proj(-6, 2 + bob, 0, yaw), rHip = proj(6, 2 + bob, 0, yaw), lK = proj(-6, 18 + bob - wk * 3, wk * 2, yaw), rK = proj(6, 18 + bob + wk * 3, -wk * 2, yaw), lF = proj(-7, 32 + bob + wk * 3, -wk, yaw), rF = proj(7, 32 + bob - wk * 3, wk, yaw); dL(lHip, lK, 5 * lHip.s, pn, '#0f172a'); dL(lK, lF, 4 * lK.s, pn, '#0f172a'); dSp(lF, 2.5, '#374151', '#1f2937'); dL(rHip, rK, 5 * rHip.s, pn, '#0f172a'); dL(rK, rF, 4 * rK.s, pn, '#0f172a'); dSp(rF, 2.5, '#374151', '#1f2937'); dL(lS, lH, 4 * lS.s, sk, skD); dSp(lH, 2, sk, skD); dL(rS_, rH, 4 * rS_.s, sk, skD); dSp(rH, 2, sk, skD); var tP = proj(0, -10 + bob, 0, yaw), bg2 = cX.createLinearGradient(tP.x - 10 * tP.s, tP.y - 13 * tP.s, tP.x + 10 * tP.s, tP.y + 13 * tP.s); bg2.addColorStop(0, sh); bg2.addColorStop(1, '#1e3a5f'); cX.save(); cX.shadowColor = '#00f2fe'; cX.shadowBlur = 3; cX.fillStyle = bg2; cX.beginPath(); cX.ellipse(tP.x, tP.y, 10 * tP.s, 13 * tP.s, 0, 0, Math.PI * 2); cX.fill(); cX.restore(); dSp(head, 10, sk, '#c9935e', true); cX.save(); cX.fillStyle = hr; cX.beginPath(); cX.ellipse(head.x, head.y - 7 * head.s, 8 * head.s, 5 * head.s, 0, Math.PI, 0); cX.fill(); cX.restore(); var ff = Math.cos(yaw); if (ff > -.1) { var es = 5 * head.s * Math.max(.3, ff), ey = head.y - .3 * head.s; cX.save(); cX.globalAlpha = Math.max(0, ff); for (var ei = 0; ei < 2; ei++) { var side = ei === 0 ? -1 : 1, ex = head.x + side * es; cX.fillStyle = '#fff'; cX.beginPath(); cX.ellipse(ex, ey, 1.6 * head.s, chS.eyeO ? 1.4 * head.s : .2 * head.s, 0, 0, Math.PI * 2); cX.fill(); if (chS.eyeO) { cX.fillStyle = side === -1 ? '#3b82f6' : '#8b5cf6'; cX.beginPath(); cX.arc(ex + chS.lx * .7 * head.s, ey + chS.ly * .5 * head.s, .6 * head.s, 0, Math.PI * 2); cX.fill(); cX.fillStyle = '#000'; cX.beginPath(); cX.arc(ex + chS.lx * .7 * head.s, ey + chS.ly * .5 * head.s, .25 * head.s, 0, Math.PI * 2); cX.fill(); } } var mY = head.y + 5 * head.s; cX.fillStyle = '#dc2626'; cX.beginPath(); cX.moveTo(head.x - 3 * head.s, mY); cX.quadraticCurveTo(head.x, mY + chS.mo * 2 * head.s + head.s, head.x + 3 * head.s, mY); cX.fill(); cX.restore(); } requestAnimationFrame(renderCh); }

document.addEventListener('mousemove', function (e) { lastM = { x: e.clientX, y: e.clientY }; });
function posC() { cEl.style.left = chS.x + 'px'; cEl.style.top = chS.y + 'px'; }
cEl.addEventListener('mousedown', function (e) { chS.drag = true; chS.ox = e.clientX - chS.x; chS.oy = e.clientY - chS.y; cEl.style.cursor = 'grabbing'; e.preventDefault(); e.stopPropagation(); });
document.addEventListener('mousemove', function (e) { if (!chS.drag) return; chS.x = Math.max(-5, Math.min(innerWidth - 5, e.clientX - chS.ox)); chS.y = Math.max(0, Math.min(innerHeight - 10, e.clientY - chS.oy)); posC(); });
document.addEventListener('mouseup', function () { if (chS.drag) { chS.drag = false; cEl.style.cursor = 'grab'; } });
cEl.addEventListener('touchstart', function (e) { e.preventDefault(); var tc = e.touches[0]; chS.drag = true; chS.ox = tc.clientX - chS.x; chS.oy = tc.clientY - chS.y; }, { passive: false });
document.addEventListener('touchmove', function (e) { if (!chS.drag) return; var tc = e.touches[0]; chS.x = Math.max(-5, Math.min(innerWidth - 5, tc.clientX - chS.ox)); chS.y = Math.max(0, Math.min(innerHeight - 10, tc.clientY - chS.oy)); posC(); }, { passive: false });
document.addEventListener('touchend', function () { chS.drag = false; });
cEl.addEventListener('mouseenter', function () { askCharacter('user hovering'); });
cEl.addEventListener('mouseleave', function () { setMood('happy'); });
/* =============================================
   ARJONA +AI STUDIO — JS PART 2
   CANVAS, LAYERS, TEXT FX, GRADING, PIXART,
   AI GEN, BG REMOVE, KEYBOARD, INIT
   ============================================= */

/* ===== SEL BAR + DELETE + CORNERS ===== */
function showSelBar(el) {
    var bar = document.getElementById('selBar'), df = document.getElementById('delFloat');
    if (!el) { bar.style.display = 'none'; df.style.display = 'none'; hideCornerHandles(); return; }
    var r = canvas.getBoundingClientRect(), bx, by;
    if (el.type === 'image') {
        var w = el.content.width * (el.scale / 100);
        bx = r.left + el.x * (r.width / canvas.width) + w * (r.width / canvas.width) / 2;
        by = r.top + el.y * (r.height / canvas.height) - 22;
    } else {
        bx = r.left + el.x * (r.width / canvas.width);
        by = r.top + el.y * (r.height / canvas.height) - el.scale * .25 * (r.height / canvas.height) - 22;
    }
    bar.style.left = Math.max(3, Math.min(innerWidth - 170, bx - 75)) + 'px';
    bar.style.top = Math.max(42, by) + 'px';
    bar.style.display = 'flex';
    df.style.display = 'block';
    showCornerHandles(el);
}

/* ===== AI CMD ===== */
function analyzeCanvas() {
    var s = [];
    if (!els.length) { s.push('Upload image or add text'); }
    else {
        var ht = false, hi = false;
        for (var i = 0; i < els.length; i++) { if (els[i].type === 'text') ht = true; if (els[i].type === 'image') hi = true; }
        if (!ht) s.push('Add text'); if (!hi) s.push('Add image');
        if (!bgCf && !aiBg) s.push('Set background');
        s.push('Try AI Generator');
    }
    var el = document.getElementById('aiSug');
    if (el) el.innerHTML = s.map(function (x) { return '<div>💡 ' + x + '</div>'; }).join('');
    askCharacter('canvas analyzed');
}

function execAiCmd() {
    var inp = document.getElementById('aiCmd');
    var cmd = (inp.value || '').trim().toLowerCase();
    inp.value = ''; if (!cmd) return;
    if (cmd.indexOf('text') >= 0) addText();
    else if (cmd.indexOf('gray') >= 0) grayscale();
    else if (cmd.indexOf('invert') >= 0) invertColors();
    else if (cmd.indexOf('blur') >= 0) applyBlur(4);
    else if (cmd.indexOf('sharp') >= 0) applySharpen();
    else if (cmd.indexOf('pixel') >= 0) pixelate(10);
    else if (cmd.indexOf('noise') >= 0) applyNoise(20);
    else if (cmd.indexOf('flip h') >= 0) flipH();
    else if (cmd.indexOf('flip v') >= 0) flipV();
    else if (cmd.indexOf('edge') >= 0) edgeDetect();
    else if (cmd.indexOf('export') >= 0) exportHD();
    else if (cmd.indexOf('undo') >= 0) triggerUndo();
    else if (cmd.indexOf('remove') >= 0) bgRemove('smart');
    else { var sg = document.getElementById('aiSug'); if (sg) sg.innerText = 'Try: blur, gray, pixel, invert'; }
}

/* ===== CANVAS ===== */
function setupC(w, h) {
    canvas.width = w; canvas.height = h;
    var info = document.getElementById('cvInfo');
    if (info) info.innerText = w + ' \u00D7 ' + h;
    R();
}

/* ===== BG ===== */
function setBg(type, sub) {
    if (type === 'solid') { bgCf = { type: 'solid', color: document.getElementById('bgSC').value }; }
    else if (type === 'grad') { bgCf = { type: 'grad', c1: document.getElementById('bgG1').value, c2: document.getElementById('bgG2').value, dir: document.getElementById('bgGD').value }; }
    else if (type === 'pat') { bgCf = { type: 'pat', pat: sub, pc: document.getElementById('bgPC').value, bc: document.getElementById('bgPB').value }; }
    aiBg = null; sH(); R(); react('bg changed');
}
function preBg(c1, c2) { bgCf = c1 === c2 ? { type: 'solid', color: c1 } : { type: 'grad', c1: c1, c2: c2, dir: 'diag' }; aiBg = null; sH(); R(); react('preset bg'); }
function clearBg() { bgCf = null; aiBg = null; sH(); R(); }

function paintBg() {
    var W = canvas.width, H = canvas.height;
    if (aiBg && aiBg.complete && aiBg.naturalWidth > 0) {
        var s = Math.max(W / aiBg.naturalWidth, H / aiBg.naturalHeight);
        ctx.drawImage(aiBg, (W - aiBg.naturalWidth * s) / 2, (H - aiBg.naturalHeight * s) / 2, aiBg.naturalWidth * s, aiBg.naturalHeight * s); return;
    }
    if (!bgCf) { var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#090f1d'); g.addColorStop(.5, '#0c1a2e'); g.addColorStop(1, '#060b16'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); return; }
    var c = bgCf;
    if (c.type === 'solid') { ctx.fillStyle = c.color; ctx.fillRect(0, 0, W, H); }
    else if (c.type === 'grad') {
        var g;
        if (c.dir === 'rad') g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) / 2);
        else if (c.dir === 'lr') g = ctx.createLinearGradient(0, 0, W, 0);
        else if (c.dir === 'diag') g = ctx.createLinearGradient(0, 0, W, H);
        else g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, c.c1); g.addColorStop(1, c.c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    else if (c.type === 'pat') {
        ctx.fillStyle = c.bc || '#0a0f1e'; ctx.fillRect(0, 0, W, H);
        ctx.save(); ctx.strokeStyle = c.pc || '#00f2fe'; ctx.fillStyle = c.pc || '#00f2fe'; ctx.globalAlpha = .12; var sz = 24;
        if (c.pat === 'dots') { for (var x = 0; x < W; x += sz)for (var y = 0; y < H; y += sz) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); } }
        else if (c.pat === 'grid') { ctx.lineWidth = 1; for (var x = 0; x <= W; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (var y = 0; y <= H; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
        else if (c.pat === 'stripe') { ctx.lineWidth = 2; for (var x = -H; x < W + H; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - H, H); ctx.stroke(); } }
        else if (c.pat === 'check') { for (var x = 0; x < W; x += sz)for (var y = 0; y < H; y += sz) { if ((Math.floor(x / sz) + Math.floor(y / sz)) % 2 === 0) ctx.fillRect(x, y, sz, sz); } }
        else if (c.pat === 'diamond') { ctx.lineWidth = 1; for (var x = 0; x < W; x += sz)for (var y = 0; y < H; y += sz) { ctx.beginPath(); ctx.moveTo(x + sz / 2, y); ctx.lineTo(x + sz, y + sz / 2); ctx.lineTo(x + sz / 2, y + sz); ctx.lineTo(x, y + sz / 2); ctx.closePath(); ctx.stroke(); } }
        else if (c.pat === 'zigzag') { ctx.lineWidth = 2; for (var y = 0; y < H; y += sz) { ctx.beginPath(); for (var x = 0; x < W; x += sz / 2) { var yo = (Math.floor(x / (sz / 2)) % 2 === 0) ? y : y + sz / 2; if (x === 0) ctx.moveTo(x, yo); else ctx.lineTo(x, yo); } ctx.stroke(); } }
        ctx.restore();
    }
}

/* ===== HISTORY ===== */
function serS() {
    return JSON.stringify({
        els: els.map(function (e) {
            var c = {}; for (var k in e) c[k] = e[k];
            if (e.type === 'image') { c.src = e.content.src; delete c.content; }
            if (e.eraserMask) { c.mask = e.eraserMask.toDataURL(); delete c.eraserMask; }
            return c;
        }), bgCf: bgCf
    });
}
function sH() { uS.push(serS()); if (uS.length > 40) uS.shift(); rS = []; }
function triggerUndo() { if (uS.length <= 1) return; rS.push(uS.pop()); restS(uS[uS.length - 1]); react('undo'); }
function triggerRedo() { if (!rS.length) return; var s = rS.pop(); uS.push(s); restS(s); react('redo'); }
function restS(json) {
    var p = JSON.parse(json); bgCf = p.bgCf || null;
    var ic = 0; for (var i = 0; i < p.els.length; i++)if (p.els[i].type === 'image') ic++;
    var ld = 0;
    els = p.els.map(function (e) {
        var o = {}; for (var k in e) o[k] = e[k];
        if (e.type === 'image') {
            o.content = new Image(); o.content.crossOrigin = 'anonymous'; o.content.src = e.src || '';
            o.content.onload = function () { ld++; if (ld >= ic) R(); };
            o.eraserMask = document.createElement('canvas');
            if (e.mask) { var mi = new Image(); mi.src = e.mask; mi.onload = function () { o.eraserMask.width = mi.width; o.eraserMask.height = mi.height; o.eraserMask.getContext('2d').drawImage(mi, 0, 0); }; }
            else { o.eraserMask.width = 400; o.eraserMask.height = 400; var mc = o.eraserMask.getContext('2d'); mc.fillStyle = '#fff'; mc.fillRect(0, 0, 400, 400); }
        }
        return o;
    });
    selId = null; sUI(); if (!ic) R();
}

/* ===== LAYERS ===== */
function addText() {
    els.push({
        id: 't' + Date.now(), type: 'text', text: 'EDIT TEXT',
        x: canvas.width / 2, y: canvas.height / 2,
        scale: 100, rotate: 0, opacity: 100,
        font: 'Arial', color: '#00f2fe', charSpacing: 0, curve: 0,
        stroke: 2, strokeColor: '#000000',
        emboss: 0, embossColor: '#ffffff',
        threeDDepth: 0, threeDColor: '#1e293b',
        threeDShadow: 0, threeDShadowColor: '#000000',
        innerShadow: 0, innerShadowColor: '#000000',
        reflection: 0, glow: 8, glowColor: '#00f2fe'
    });
    selId = els[els.length - 1].id; sH(); R(); sUI();
    bpTab(document.querySelector('[data-p=bpText]'));
    react('added text');
}

function addImg(ev) { var f = ev.target.files[0]; if (f) loadI(f); ev.target.value = ''; }

function loadI(file) {
    var r = new FileReader(); r.readAsDataURL(file);
    r.onload = function (e) {
        var img = new Image(); img.src = e.target.result;
        img.onload = function () {
            var mc = document.createElement('canvas'); mc.width = img.width; mc.height = img.height;
            var mx = mc.getContext('2d'); mx.fillStyle = '#fff'; mx.fillRect(0, 0, mc.width, mc.height);
            var sc = 50;
            if (img.width * (sc / 100) > canvas.width * .6) sc = Math.floor(canvas.width * .6 / img.width * 100);
            if (img.height * (sc / 100) > canvas.height * .6) sc = Math.min(sc, Math.floor(canvas.height * .6 / img.height * 100));
            sc = Math.max(12, sc);
            els.push({
                id: 'i' + Date.now(), type: 'image', content: img,
                x: canvas.width / 2 - img.width * (sc / 100) / 2,
                y: canvas.height / 2 - img.height * (sc / 100) / 2,
                scale: sc, rotate: 0, opacity: 100, eraserMask: mc
            });
            selId = els[els.length - 1].id; sH(); R(); sUI(); react('uploaded image');
        };
    };
}

function layerOp(a) {
    if (!selId) return;
    var i = -1; for (var j = 0; j < els.length; j++) { if (els[j].id === selId) { i = j; break; } }
    if (i === -1) return;
    if (a === 'del') { els.splice(i, 1); selId = null; react('deleted'); showSelBar(null); }
    else if (a === 'front') { els.push(els.splice(i, 1)[0]); }
    else if (a === 'back') { els.unshift(els.splice(i, 1)[0]); }
    else if (a === 'dup') {
        var s = els[i], c = {}; for (var k in s) c[k] = s[k];
        c.id = 'd' + Date.now(); c.x = s.x + 12; c.y = s.y + 12;
        if (s.type === 'image' && s.eraserMask) {
            var nm = document.createElement('canvas'); nm.width = s.eraserMask.width; nm.height = s.eraserMask.height;
            nm.getContext('2d').drawImage(s.eraserMask, 0, 0); c.eraserMask = nm; c.content = s.content;
        }
        els.push(c); selId = c.id; react('duplicated');
    }
    sH(); R(); sUI();
}

function alignEl(p) {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (!el) return;
    if (el.type === 'text') {
        if (p === 'l') el.x = 40; if (p === 'c') el.x = canvas.width / 2;
        if (p === 'r') el.x = canvas.width - 40; if (p === 'm') el.y = canvas.height / 2;
    } else {
        var w = el.content.width * (el.scale / 100), h = el.content.height * (el.scale / 100);
        if (p === 'l') el.x = 0; if (p === 'c') el.x = (canvas.width - w) / 2;
        if (p === 'r') el.x = canvas.width - w; if (p === 'm') el.y = (canvas.height - h) / 2;
    }
    sH(); R();
}

/* ===== CANVAS MOUSE ===== */
function gCC(e) {
    var r = canvas.getBoundingClientRect();
    var ox = e.offsetX !== undefined ? e.offsetX : (e.clientX - r.left);
    var oy = e.offsetY !== undefined ? e.offsetY : (e.clientY - r.top);
    return { x: ox * (canvas.width / r.width), y: oy * (canvas.height / r.height) };
}

canvas.addEventListener('mousedown', mD);
canvas.addEventListener('mousemove', mV);
canvas.addEventListener('mouseup', mU);
canvas.addEventListener('mouseleave', mU);
canvas.addEventListener('touchstart', function (e) { e.preventDefault(); var r = canvas.getBoundingClientRect(), t = e.touches[0]; mD({ offsetX: (t.clientX - r.left) * (canvas.width / r.width), offsetY: (t.clientY - r.top) * (canvas.height / r.height) }); }, { passive: false });
canvas.addEventListener('touchmove', function (e) { e.preventDefault(); var r = canvas.getBoundingClientRect(), t = e.touches[0]; mV({ offsetX: (t.clientX - r.left) * (canvas.width / r.width), offsetY: (t.clientY - r.top) * (canvas.height / r.height) }); }, { passive: false });
canvas.addEventListener('touchend', mU);

function mD(e) {
    var co = gCC(e), x = co.x, y = co.y;
    if (mode !== 'select') { drag = true; doErase(x, y); return; }
    var hit = null; for (var i = els.length - 1; i >= 0; i--) { if (hitEl(els[i], x, y)) { hit = els[i]; break; } }
    if (hit) { selId = hit.id; drag = true; dX = x - hit.x; dY = y - hit.y; sUI(); react('selected'); showSelBar(hit); }
    else { selId = null; sUI(); showSelBar(null); } R();
}

function hitEl(el, x, y) {
    if (el.type === 'image') { var w = el.content.width * (el.scale / 100), h = el.content.height * (el.scale / 100); return x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h; }
    if (el.type === 'text') { ctx.save(); ctx.font = 'bold ' + (el.scale * .6) + 'px "' + el.font + '"'; var tw = ctx.measureText(el.text || '').width; ctx.restore(); return x >= el.x - tw / 2 - 10 && x <= el.x + tw / 2 + 10 && y >= el.y - el.scale * .3 && y <= el.y + el.scale * .3; }
    return false;
}

function mV(e) {
    var co = gCC(e), x = co.x, y = co.y;
    if (!drag) return; if (mode !== 'select') { doErase(x, y); return; }
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (el) { el.x = x - dX; el.y = y - dY; R(); showSelBar(el); }
}

function mU() { if (drag) sH(); drag = false; }

function setMode(m, btn) {
    mode = m; canvas.style.cursor = m !== 'select' ? 'crosshair' : 'default';
    var btns = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < btns.length; i++)btns[i].classList.remove('active');
    if (btn) btn.classList.add('active');
}

function doErase(cx, cy) {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (!el || el.type !== 'image') return;
    var mc = el.eraserMask.getContext('2d');
    var iw = el.content.width * (el.scale / 100), ih = el.content.height * (el.scale / 100);
    var rx = ((cx - el.x) / iw) * el.eraserMask.width, ry = ((cy - el.y) / ih) * el.eraserMask.height;
    var br = bSz * (el.eraserMask.width / Math.max(iw, 1));
    mc.save(); mc.globalCompositeOperation = 'destination-out'; mc.fillStyle = 'rgba(0,0,0,1)';
    mc.beginPath();
    if (mode === 'mask') mc.rect(rx - br, ry - br, br * 2, br * 2);
    else mc.arc(rx, ry, br, 0, Math.PI * 2);
    mc.fill(); mc.restore(); R();
}

function restMask() {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (!el || el.type !== 'image') { alert('Select image!'); return; }
    var mc = el.eraserMask.getContext('2d');
    mc.globalCompositeOperation = 'source-over'; mc.fillStyle = '#fff';
    mc.fillRect(0, 0, el.eraserMask.width, el.eraserMask.height); sH(); R();
}

/* ===== PROPS — ALL 13+ SLIDERS SYNCED ===== */
function setTxt(v) {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (el && el.type === 'text') { el.text = v; R(); }
}

function setProp(p, v) {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (!el) return;
    var cp = ['color', 'strokeColor', 'threeDColor', 'glowColor', 'font', 'innerShadowColor', 'embossColor', 'threeDShadowColor'];
    el[p] = cp.indexOf(p) >= 0 ? v : parseFloat(v);
    var lm = { scale: ['v-sc', '%'], rotate: ['v-rt', '\u00B0'], opacity: ['v-op', '%'], charSpacing: ['v-sp', 'px'], curve: ['v-cu', '\u00B0'], stroke: ['v-st', 'px'], glow: ['v-gw', 'px'], threeDDepth: ['v-3d', 'px'], innerShadow: ['v-is', 'px'], emboss: ['v-em', 'px'], threeDShadow: ['v-3s', 'px'], reflection: ['v-rf', '%'] };
    if (lm[p]) { var l = document.getElementById(lm[p][0]); if (l) l.innerText = v + lm[p][1]; }
    R();
}

function upFont(ev) {
    var f = ev.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function (e) {
        var n = f.name.replace(/\.[^/.]+$/, '');
        try {
            var fc = new FontFace(n, 'url(' + e.target.result + ')');
            fc.load().then(function (l) {
                document.fonts.add(l);
                var sel = document.getElementById('fontSel');
                var op = document.createElement('option'); op.value = n; op.textContent = n;
                sel.appendChild(op); sel.value = n; react('font ' + n);
            }).catch(function (err) { alert('Font error: ' + err.message); });
        } catch (err) { alert('Font load failed: ' + err.message); }
    };
    r.readAsDataURL(f); ev.target.value = '';
}

function sV(id, v) { var e = document.getElementById(id); if (e) e.value = (v !== undefined && v !== null) ? v : 0; }
function sL(id, v, s) { var e = document.getElementById(id); if (e) e.innerText = ((v !== undefined && v !== null) ? v : 0) + s; }

/* FULL UI SYNC — all sliders + color pickers */
function sUI() {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    var lb = document.getElementById('selLbl');
    if (!el) { if (lb) lb.innerText = 'None'; showSelBar(null); return; }
    if (lb) lb.innerText = el.type === 'text' ? '"' + (el.text || '').substring(0, 8) + '"' : 'Image';
    sV('sl-sc', el.scale || 100); sL('v-sc', el.scale || 100, '%');
    sV('sl-rt', el.rotate || 0); sL('v-rt', el.rotate || 0, '\u00B0');
    sV('sl-op', el.opacity || 100); sL('v-op', el.opacity || 100, '%');
    if (el.type === 'text') {
        var ti = document.getElementById('txtIn'); if (ti) ti.value = el.text || '';
        var fs = document.getElementById('fontSel'); if (fs) { var opts = fs.querySelectorAll('option'); var has = false; for (var i = 0; i < opts.length; i++) { if (opts[i].value === el.font) has = true; } if (has) fs.value = el.font; }
        var tc = document.getElementById('txtCol'); if (tc) tc.value = el.color || '#00f2fe';
        sV('sl-sp', el.charSpacing || 0); sL('v-sp', el.charSpacing || 0, 'px');
        sV('sl-cu', el.curve || 0); sL('v-cu', el.curve || 0, '\u00B0');
        sV('sl-st', el.stroke || 2); sL('v-st', el.stroke || 2, 'px');
        var sc = document.getElementById('c-stroke'); if (sc) sc.value = el.strokeColor || '#000000';
        sV('sl-gw', el.glow || 8); sL('v-gw', el.glow || 8, 'px');
        var gc = document.getElementById('c-glow'); if (gc) gc.value = el.glowColor || '#00f2fe';
        sV('sl-3d', el.threeDDepth || 0); sL('v-3d', el.threeDDepth || 0, 'px');
        var td = document.getElementById('c-3d'); if (td) td.value = el.threeDColor || '#1e293b';
        sV('sl-is', el.innerShadow || 0); sL('v-is', el.innerShadow || 0, 'px');
        var isc = document.getElementById('c-is'); if (isc) isc.value = el.innerShadowColor || '#000000';
        sV('sl-em', el.emboss || 0); sL('v-em', el.emboss || 0, 'px');
        var emc = document.getElementById('c-em'); if (emc) emc.value = el.embossColor || '#ffffff';
        sV('sl-3s', el.threeDShadow || 0); sL('v-3s', el.threeDShadow || 0, 'px');
        var tsc = document.getElementById('c-3ds'); if (tsc) tsc.value = el.threeDShadowColor || '#000000';
        sV('sl-rf', el.reflection || 0); sL('v-rf', el.reflection || 0, '%');
    }
}

/* ===== TEXT RENDER — uses all FX colors ===== */
function dTxt(el) {
    ctx.save(); ctx.globalAlpha = el.opacity / 100;
    var fs = Math.max(el.scale * .6, 8);
    ctx.font = 'bold ' + fs + 'px "' + (el.font || 'Arial') + '"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var txt = el.text || '', sp = el.charSpacing || 0;
    function tw(s) { var w = 0; for (var i = 0; i < s.length; i++)w += ctx.measureText(s[i]).width + sp; return Math.max(w - sp, 1); }
    ctx.save(); ctx.translate(el.x, el.y); ctx.rotate((el.rotate || 0) * Math.PI / 180);
    if (el.curve && el.curve !== 0) {
        var ang = el.curve / 180 * Math.PI, al = tw(txt), rad = al / Math.abs(ang) || 300, ca = -Math.PI / 2 - ang / 2;
        for (var i = 0; i < txt.length; i++) { var ch = txt[i], cw = ctx.measureText(ch).width + sp, dA = cw / rad; ctx.save(); ctx.translate(Math.cos(ca + dA / 2) * rad, Math.sin(ca + dA / 2) * rad + (el.curve > 0 ? rad : -rad)); ctx.rotate(ca + dA / 2 + Math.PI / 2 + (el.curve > 0 ? 0 : Math.PI)); cFx(el, ch, 0, 0); ctx.restore(); ca += dA; }
    } else {
        var total = tw(txt), xO = -total / 2;
        for (var i = 0; i < txt.length; i++) { var ch = txt[i], cw = ctx.measureText(ch).width; cFx(el, ch, xO + cw / 2, 0); xO += cw + sp; }
        if ((el.reflection || 0) > 0) { ctx.save(); ctx.scale(1, -1); ctx.globalAlpha = el.reflection / 100 * .3; var rg = ctx.createLinearGradient(0, 0, 0, fs); rg.addColorStop(0, el.color || '#00f2fe'); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; var x2 = -total / 2; for (var i = 0; i < txt.length; i++) { var ch = txt[i], cw = ctx.measureText(ch).width; ctx.fillText(ch, x2 + cw / 2, -fs * .15); x2 += cw + sp; } ctx.restore(); }
    }
    ctx.restore(); ctx.restore();
}

function cFx(el, ch, x, y) {
    var d = el.threeDDepth || 0;
    if ((el.glow || 0) > 0) { ctx.save(); ctx.shadowColor = el.glowColor || '#00f2fe'; ctx.shadowBlur = el.glow; ctx.fillStyle = el.color || '#00f2fe'; ctx.fillText(ch, x, y); ctx.restore(); }
    if (d > 0) { ctx.fillStyle = el.threeDColor || '#1e293b'; for (var i = d; i >= 1; i--)ctx.fillText(ch, x + i * .8, y + i * .6); }
    if ((el.threeDShadow || 0) > 0) { ctx.save(); ctx.shadowColor = el.threeDShadowColor || 'rgba(0,0,0,.55)'; ctx.shadowBlur = el.threeDShadow; ctx.shadowOffsetX = d * .5; ctx.shadowOffsetY = d * .5; ctx.fillStyle = el.color || '#00f2fe'; ctx.fillText(ch, x, y); ctx.restore(); }
    if ((el.emboss || 0) > 0) { ctx.save(); ctx.fillStyle = el.embossColor || 'rgba(255,255,255,.3)'; ctx.globalAlpha = .3; ctx.fillText(ch, x - el.emboss * .4, y - el.emboss * .4); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillText(ch, x + el.emboss * .4, y + el.emboss * .4); ctx.restore(); }
    if ((el.innerShadow || 0) > 0) { ctx.save(); ctx.shadowColor = el.innerShadowColor || 'rgba(0,0,0,.7)'; ctx.shadowBlur = el.innerShadow; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2; ctx.fillStyle = el.color || '#00f2fe'; ctx.fillText(ch, x, y); ctx.restore(); }
    if ((el.stroke || 0) > 0) { ctx.save(); ctx.lineWidth = el.stroke; ctx.strokeStyle = el.strokeColor || '#000'; ctx.lineJoin = 'round'; ctx.strokeText(ch, x, y); ctx.restore(); }
    ctx.fillStyle = el.color || '#00f2fe'; ctx.fillText(ch, x, y);
}

/* ===== RENDER ===== */
function R() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); paintBg();
    for (var i = 0; i < els.length; i++) {
        var el = els[i]; ctx.save(); ctx.globalAlpha = (el.opacity || 100) / 100;
        if (el.type === 'image') {
            if (!el.content || !el.content.complete || !el.content.naturalWidth) { ctx.restore(); continue; }
            var w = el.content.width * (el.scale / 100), h = el.content.height * (el.scale / 100);
            if (w <= 0 || h <= 0) { ctx.restore(); continue; }
            ctx.translate(el.x + w / 2, el.y + h / 2); ctx.rotate((el.rotate || 0) * Math.PI / 180);
            var tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
            var tx = tmp.getContext('2d'); tx.drawImage(el.content, 0, 0, w, h);
            if (el.eraserMask) { tx.globalCompositeOperation = 'destination-in'; tx.drawImage(el.eraserMask, 0, 0, w, h); }
            ctx.drawImage(tmp, -w / 2, -h / 2);
        } else if (el.type === 'text') { dTxt(el); }
        ctx.restore();
    }
}

/* ===== GRADING ===== */
function liveG() { var ids = ['br', 'ct', 'sa', 'te', 'vi', 'gr']; for (var i = 0; i < ids.length; i++) { var s = document.getElementById('sg-' + ids[i]), v = document.getElementById('vg-' + ids[i]); if (s && v) v.innerText = s.value; } }
var gPD = { cinematic: { br: -10, ct: 30, sa: -15, te: 10, vi: 40, gr: 5 }, vintage: { br: 5, ct: 10, sa: -30, te: 15, vi: 30, gr: 15 }, warm: { br: 10, ct: 10, sa: 15, te: 30, vi: 10, gr: 0 }, cool: { br: 0, ct: 15, sa: -10, te: -30, vi: 15, gr: 0 }, noir: { br: -20, ct: 50, sa: -100, te: 0, vi: 60, gr: 10 }, neon: { br: 0, ct: 40, sa: 50, te: -10, vi: 20, gr: 0 }, sepia: { br: 10, ct: 10, sa: -60, te: 30, vi: 20, gr: 8 }, golden: { br: 10, ct: 20, sa: 20, te: 35, vi: 15, gr: 0 }, hdr: { br: 5, ct: 50, sa: 30, te: 0, vi: 10, gr: 0 } };
function gradeP(n) { var p = gPD[n]; if (!p) return; for (var k in p) { var sl = document.getElementById('sg-' + k); if (sl) sl.value = p[k]; } liveG(); }
function resetGrade() { var ids = ['br', 'ct', 'sa', 'te', 'vi', 'gr']; for (var i = 0; i < ids.length; i++) { var sl = document.getElementById('sg-' + ids[i]); if (sl) sl.value = 0; } liveG(); }
function applyGrade() {
    R();
    try {
        var d = ctx.getImageData(0, 0, canvas.width, canvas.height), px = d.data;
        var br = parseInt(document.getElementById('sg-br').value) || 0;
        var ct = parseInt(document.getElementById('sg-ct').value) || 0;
        var sa = parseInt(document.getElementById('sg-sa').value) || 0;
        var te = parseInt(document.getElementById('sg-te').value) || 0;
        var vi = parseInt(document.getElementById('sg-vi').value) || 0;
        var gr = parseInt(document.getElementById('sg-gr').value) || 0;
        var cf = (259 * (ct + 255)) / (255 * (259 - ct));
        for (var i = 0; i < px.length; i += 4) {
            var r = px[i], g = px[i + 1], b = px[i + 2];
            r += br; g += br; b += br;
            r = cf * (r - 128) + 128; g = cf * (g - 128) + 128; b = cf * (b - 128) + 128;
            r += te; b -= te;
            var gray = .299 * r + .587 * g + .114 * b, sf = 1 + sa / 100;
            r = gray + sf * (r - gray); g = gray + sf * (g - gray); b = gray + sf * (b - gray);
            px[i] = Math.max(0, Math.min(255, r)); px[i + 1] = Math.max(0, Math.min(255, g)); px[i + 2] = Math.max(0, Math.min(255, b));
        }
        if (vi > 0) { var W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, mD = Math.sqrt(cx * cx + cy * cy); for (var y = 0; y < H; y++)for (var x = 0; x < W; x++) { var dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) / mD, f = 1 - dist * dist * (vi / 100) * 1.5, idx = (y * W + x) * 4; px[idx] *= f; px[idx + 1] *= f; px[idx + 2] *= f; } }
        if (gr > 0) { for (var i = 0; i < px.length; i += 4) { var n = (Math.random() - .5) * gr * 3; px[i] = Math.max(0, Math.min(255, px[i] + n)); px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n)); px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n)); } }
        ctx.putImageData(d, 0, 0);
        var img = new Image(); img.src = canvas.toDataURL(); img.onload = function () { aiBg = img; bgCf = null; sH(); R(); };
        react('grade applied');
    } catch (e) { react('grade error'); alert('Grade failed: ' + e.message); }
}

/* ===== PIXART ===== */
function getD() { R(); return ctx.getImageData(0, 0, canvas.width, canvas.height); }
function apD(d) { ctx.putImageData(d, 0, 0); var img = new Image(); img.src = canvas.toDataURL(); img.onload = function () { aiBg = img; bgCf = null; sH(); R(); }; react('effect applied'); }
function pixelate(sz) { R(); var W = canvas.width, H = canvas.height, d = ctx.getImageData(0, 0, W, H), px = d.data; for (var y = 0; y < H; y += sz)for (var x = 0; x < W; x += sz) { var r = 0, g = 0, b = 0, c = 0; for (var dy = 0; dy < sz && y + dy < H; dy++)for (var dx = 0; dx < sz && x + dx < W; dx++) { var i = ((y + dy) * W + (x + dx)) * 4; r += px[i]; g += px[i + 1]; b += px[i + 2]; c++; } r /= c; g /= c; b /= c; for (var dy = 0; dy < sz && y + dy < H; dy++)for (var dx = 0; dx < sz && x + dx < W; dx++) { var i = ((y + dy) * W + (x + dx)) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; } } apD(d); }
function applyBlur(rad) { R(); var W = canvas.width, H = canvas.height, src = ctx.getImageData(0, 0, W, H), dst = ctx.createImageData(W, H), s = src.data, d = dst.data; for (var y = 0; y < H; y++)for (var x = 0; x < W; x++) { var r = 0, g = 0, b = 0, c = 0; for (var dy = -rad; dy <= rad; dy++)for (var dx = -rad; dx <= rad; dx++) { var nx = x + dx, ny = y + dy; if (nx >= 0 && nx < W && ny >= 0 && ny < H) { var i = (ny * W + nx) * 4; r += s[i]; g += s[i + 1]; b += s[i + 2]; c++; } } var i = (y * W + x) * 4; d[i] = r / c; d[i + 1] = g / c; d[i + 2] = b / c; d[i + 3] = s[i + 3]; } apD(dst); }
function applySharpen() { R(); var W = canvas.width, H = canvas.height, src = ctx.getImageData(0, 0, W, H), dst = ctx.createImageData(W, H), s = src.data, d = dst.data; var k = [0, -1, 0, -1, 5, -1, 0, -1, 0]; for (var y = 1; y < H - 1; y++)for (var x = 1; x < W - 1; x++) { var r = 0, g = 0, b = 0, ki = 0; for (var dy = -1; dy <= 1; dy++)for (var dx = -1; dx <= 1; dx++) { var i = ((y + dy) * W + (x + dx)) * 4; r += s[i] * k[ki]; g += s[i + 1] * k[ki]; b += s[i + 2] * k[ki]; ki++; } var i = (y * W + x) * 4; d[i] = Math.max(0, Math.min(255, r)); d[i + 1] = Math.max(0, Math.min(255, g)); d[i + 2] = Math.max(0, Math.min(255, b)); d[i + 3] = s[i + 3]; } apD(dst); }
function invertColors() { var d = getD(), px = d.data; for (var i = 0; i < px.length; i += 4) { px[i] = 255 - px[i]; px[i + 1] = 255 - px[i + 1]; px[i + 2] = 255 - px[i + 2]; } apD(d); }
function grayscale() { var d = getD(), px = d.data; for (var i = 0; i < px.length; i += 4) { var g = .299 * px[i] + .587 * px[i + 1] + .114 * px[i + 2]; px[i] = px[i + 1] = px[i + 2] = g; } apD(d); }
function posterize(lv) { var d = getD(), px = d.data, step = 255 / lv; for (var i = 0; i < px.length; i += 4) { px[i] = Math.round(px[i] / step) * step; px[i + 1] = Math.round(px[i + 1] / step) * step; px[i + 2] = Math.round(px[i + 2] / step) * step; } apD(d); }
function edgeDetect() { R(); var W = canvas.width, H = canvas.height, src = ctx.getImageData(0, 0, W, H), dst = ctx.createImageData(W, H), s = src.data, d = dst.data; for (var y = 1; y < H - 1; y++)for (var x = 1; x < W - 1; x++) { var i = (y * W + x) * 4; var gx = (-s[((y - 1) * W + x - 1) * 4] + s[((y - 1) * W + x + 1) * 4] - 2 * s[(y * W + x - 1) * 4] + 2 * s[(y * W + x + 1) * 4] - s[((y + 1) * W + x - 1) * 4] + s[((y + 1) * W + x + 1) * 4]); var gy = (-s[((y - 1) * W + x - 1) * 4] - 2 * s[((y - 1) * W + x) * 4] - s[((y - 1) * W + x + 1) * 4] + s[((y + 1) * W + x - 1) * 4] + 2 * s[((y + 1) * W + x) * 4] + s[((y + 1) * W + x + 1) * 4]); d[i] = d[i + 1] = d[i + 2] = Math.min(255, Math.sqrt(gx * gx + gy * gy)); d[i + 3] = 255; } apD(dst); }
function applyNoise(amt) { var d = getD(), px = d.data; for (var i = 0; i < px.length; i += 4) { var n = (Math.random() - .5) * amt * 2; px[i] = Math.max(0, Math.min(255, px[i] + n)); px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n)); px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n)); } apD(d); }
function flipH() { R(); var W = canvas.width, H = canvas.height, d = ctx.getImageData(0, 0, W, H), px = d.data; for (var y = 0; y < H; y++)for (var x = 0; x < Math.floor(W / 2); x++) { var l = (y * W + x) * 4, r = (y * W + (W - 1 - x)) * 4; for (var c = 0; c < 4; c++) { var tmp = px[l + c]; px[l + c] = px[r + c]; px[r + c] = tmp; } } apD(d); }
function flipV() { R(); var W = canvas.width, H = canvas.height, d = ctx.getImageData(0, 0, W, H), px = d.data; for (var x = 0; x < W; x++)for (var y = 0; y < Math.floor(H / 2); y++) { var t = (y * W + x) * 4, b = ((H - 1 - y) * W + x) * 4; for (var c = 0; c < 4; c++) { var tmp = px[t + c]; px[t + c] = px[b + c]; px[b + c] = tmp; } } apD(d); }

/* ===== AI BG REMOVE ===== */
function bgRemove(method) {
    var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
    if (!el || el.type !== 'image') { alert('Select image!'); return; }
    react('removing bg'); loader.style.display = 'flex'; document.getElementById('ldrMsg').innerText = 'Removing...';
    var tol = parseInt(document.getElementById('sl-tol').value) || 50;
    setTimeout(function () {
        try {
            var mc = el.eraserMask, mx = mc.getContext('2d');
            var tc = document.createElement('canvas'); tc.width = el.content.width; tc.height = el.content.height;
            tc.getContext('2d').drawImage(el.content, 0, 0);
            var d;
            try { d = tc.getContext('2d').getImageData(0, 0, tc.width, tc.height); }
            catch (e) { loader.style.display = 'none'; alert('CORS error'); return; }
            var data = d.data, W = tc.width, H = tc.height;
            mx.globalCompositeOperation = 'source-over'; mx.fillStyle = '#fff'; mx.fillRect(0, 0, mc.width, mc.height);
            var md = mx.getImageData(0, 0, mc.width, mc.height), mD = md.data, scX = mc.width / W, scY = mc.height / H;
            function mark(px, py) { var mx2 = Math.round(px * scX), my2 = Math.round(py * scY); if (mx2 >= 0 && mx2 < mc.width && my2 >= 0 && my2 < mc.height) { var mi = (my2 * mc.width + mx2) * 4; mD[mi] = mD[mi + 1] = mD[mi + 2] = mD[mi + 3] = 0; } }
            if (method === 'color' || method === 'smart') { var corners = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]], tR = 0, tG = 0, tB = 0; for (var ci = 0; ci < corners.length; ci++) { var idx = (corners[ci][1] * W + corners[ci][0]) * 4; tR += data[idx]; tG += data[idx + 1]; tB += data[idx + 2]; } tR /= 4; tG /= 4; tB /= 4; for (var py = 0; py < H; py++)for (var px = 0; px < W; px++) { var si = (py * W + px) * 4; if (Math.sqrt(Math.pow(data[si] - tR, 2) + Math.pow(data[si + 1] - tG, 2) + Math.pow(data[si + 2] - tB, 2)) < tol) mark(px, py); } }
            if (method === 'bright' || method === 'smart') { for (var py = 0; py < H; py++)for (var px = 0; px < W; px++) { var si = (py * W + px) * 4, b = (data[si] + data[si + 1] + data[si + 2]) / 3; if (b > 255 - tol / 2 || b < tol / 2) mark(px, py); } }
            if (method === 'edge' || method === 'smart') { var vis = new Uint8Array(W * H), starts = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]]; for (var si2 = 0; si2 < starts.length; si2++) { var stk = [starts[si2]], ri = (starts[si2][1] * W + starts[si2][0]) * 4, rR = data[ri], rG = data[ri + 1], rB = data[ri + 2]; while (stk.length) { var pt = stk.pop(), cx2 = pt[0], cy2 = pt[1]; if (cx2 < 0 || cx2 >= W || cy2 < 0 || cy2 >= H) continue; var idx2 = cy2 * W + cx2; if (vis[idx2]) continue; vis[idx2] = 1; var pi = idx2 * 4; if (Math.sqrt(Math.pow(data[pi] - rR, 2) + Math.pow(data[pi + 1] - rG, 2) + Math.pow(data[pi + 2] - rB, 2)) < tol) { mark(cx2, cy2); if (stk.length < 500000) stk.push([cx2 + 1, cy2], [cx2 - 1, cy2], [cx2, cy2 + 1], [cx2, cy2 - 1]); } } } }
            mx.putImageData(md, 0, 0); sH(); R(); react('bg removed');
        } catch (e) { react('bg remove error'); }
        finally { loader.style.display = 'none'; }
    }, 400);
}

/* ===== AI GENERATE ===== */
function generateAI() {
    var pv = (document.getElementById('aiPrompt').value || '').trim();
    if (!pv) { alert('Enter prompt!'); return; }
    loader.style.display = 'flex'; document.getElementById('ldrMsg').innerText = 'Generating...'; react('generating AI');
    var style = document.getElementById('aiStyle').value || '';
    var aiMode = document.getElementById('aiMode').value || 'bg';
    var url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(pv + style) + '?width=' + canvas.width + '&height=' + canvas.height + '&nologo=true&seed=' + Math.floor(Math.random() * 99999);
    var nb = new Image(); nb.crossOrigin = 'anonymous';
    var to = setTimeout(function () { loader.style.display = 'none'; react('generation timeout'); }, 45000);
    nb.onload = function () {
        clearTimeout(to); loader.style.display = 'none';
        if (aiMode === 'bg') { aiBg = nb; bgCf = null; sH(); R(); react('AI bg done'); }
        else {
            var mc = document.createElement('canvas'); mc.width = nb.width; mc.height = nb.height;
            var mx = mc.getContext('2d'); mx.fillStyle = '#fff'; mx.fillRect(0, 0, mc.width, mc.height);
            var sc = 50; if (nb.width * (sc / 100) > canvas.width * .6) sc = Math.floor(canvas.width * .6 / nb.width * 100); sc = Math.max(12, sc);
            els.push({ id: 'ai' + Date.now(), type: 'image', content: nb, x: canvas.width / 2 - nb.width * (sc / 100) / 2, y: canvas.height / 2 - nb.height * (sc / 100) / 2, scale: sc, rotate: 0, opacity: 100, eraserMask: mc });
            selId = els[els.length - 1].id; sH(); R(); sUI(); react('AI layer done');
        }
    };
    nb.onerror = function () { clearTimeout(to); loader.style.display = 'none'; react('AI generation failed'); };
    nb.src = url;
}

/* ===== MISC ===== */
function resetAll() { if (!confirm('Reset everything?')) return; els = []; selId = null; aiBg = null; bgCf = null; uS = []; rS = []; sUI(); R(); react('canvas reset'); }
function exportHD() {
    try {
        var link = document.createElement('a');
        link.download = 'Arjona_' + Date.now() + '.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        react('exported HD PNG');
    } catch (e) {
        react('export error');
        alert('Export failed (CORS): ' + e.message);
    }
}
function doVoice(ev) {
    ev.preventDefault();
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech not supported'); return; }
    var rec = new SR(); rec.lang = 'en-US';
    var btn = ev.target; if (btn) btn.innerText = '🔴';
    rec.onresult = function (e) {
        var t = e.results[0][0].transcript;
        document.getElementById('aiPrompt').value = t;
        askCharacter('voice: ' + t);
    };
    rec.onend = function () { if (btn) btn.innerText = '🎙'; };
    rec.onerror = function () { if (btn) btn.innerText = '🎙'; };
    rec.start();
}

/* ===== KEYBOARD ===== */
document.addEventListener('keydown', function (e) {
    var t = document.activeElement ? document.activeElement.tagName : '';
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (e.key === 'Escape') { closeHelp(); closeDev(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selId) layerOp('del');
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); triggerUndo(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') { e.preventDefault(); triggerRedo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); if (selId) layerOp('dup'); }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); exportHD(); }
    if (e.key === 'c' || e.key === 'C') talkToAI();
    if (e.key === 'v' || e.key === 'V') toggleVoice();
    if (selId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) >= 0) {
        e.preventDefault();
        var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
        var st = e.shiftKey ? 10 : 2;
        if (el) {
            if (e.key === 'ArrowUp') el.y -= st;
            if (e.key === 'ArrowDown') el.y += st;
            if (e.key === 'ArrowLeft') el.x -= st;
            if (e.key === 'ArrowRight') el.x += st;
            R(); showSelBar(el);
        }
    }
});

/* ===== DRAG DROP ===== */
window.addEventListener('dragover', function (e) { e.preventDefault(); });
window.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image/') === 0) loadI(files[i]);
    }
});

/* ===== INIT — everything in DOMContentLoaded ===== */
window.addEventListener('DOMContentLoaded', function () {
    /* Theme */
    initTheme();
    restoreDevSettings();
    restorePanelLock();

    /* Panel resize */
    var rL = document.getElementById('resizeLeft'), rB = document.getElementById('resizeBottom');
    var lSb = document.getElementById('leftSidebar'), bPn = document.getElementById('bottomPanel');
    if (rL && lSb) {
        rL.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); resLOn = true; resLX = e.clientX; resLW = lSb.getBoundingClientRect().width; document.body.style.userSelect = 'none'; document.body.style.cursor = 'col-resize'; rL.style.background = 'var(--ac)'; });
        rL.addEventListener('touchstart', function (e) { e.preventDefault(); resLOn = true; resLX = e.touches[0].clientX; resLW = lSb.getBoundingClientRect().width; }, { passive: false });
    }
    if (rB && bPn) {
        rB.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); resBOn = true; resBY = e.clientY; resBH = bPn.getBoundingClientRect().height; document.body.style.userSelect = 'none'; document.body.style.cursor = 'row-resize'; rB.style.background = 'var(--ac)'; });
        rB.addEventListener('touchstart', function (e) { e.preventDefault(); resBOn = true; resBY = e.touches[0].clientY; resBH = bPn.getBoundingClientRect().height; }, { passive: false });
    }

    /* Corner handles */
    var corners = ['rhNW', 'rhNE', 'rhSW', 'rhSE'];
    for (var ci = 0; ci < corners.length; ci++) {
        (function (cid) {
            var ch = document.getElementById(cid);
            if (ch) {
                ch.addEventListener('mousedown', function (e) { initCornerResize(cid, e); });
                ch.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    initCornerResize(cid, { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, preventDefault: function () { }, stopPropagation: function () { } });
                }, { passive: false });
            }
        })(corners[ci]);
    }

    /* Global mouse for panel + corner resize */
    document.addEventListener('mousemove', function (e) {
        if (resLOn && lSb) { var nw = Math.max(120, Math.min(500, resLW + (e.clientX - resLX))); lSb.style.width = nw + 'px'; lSb.style.minWidth = nw + 'px'; lSb.style.maxWidth = nw + 'px'; }
        if (resBOn && bPn) { var nh = Math.max(50, Math.min(450, resBH - (e.clientY - resBY))); bPn.style.height = nh + 'px'; bPn.style.minHeight = nh + 'px'; bPn.style.maxHeight = nh + 'px'; }
        if (cornerDrag) {
            var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
            if (el) {
                var dx = e.clientX - cornerStartX, dy = e.clientY - cornerStartY;
                var delta = (cornerDrag.indexOf('NW') >= 0 || cornerDrag.indexOf('SW') >= 0) ? -dx : dx;
                if (e.shiftKey) delta = Math.max(Math.abs(dx), Math.abs(dy)) * (dx >= 0 ? 1 : -1);
                var ns = Math.max(12, Math.min(320, cornerStartScale + delta * 0.35));
                el.scale = Math.round(ns); R(); showCornerHandles(el); showSelBar(el); sUI();
            }
        }
    });

    document.addEventListener('mouseup', function () {
        if (resLOn) { resLOn = false; document.body.style.userSelect = ''; document.body.style.cursor = ''; if (rL) rL.style.background = ''; }
        if (resBOn) { resBOn = false; document.body.style.userSelect = ''; document.body.style.cursor = ''; if (rB) rB.style.background = ''; }
        if (cornerDrag) { cornerDrag = null; document.body.style.userSelect = ''; sH(); }
    });

    document.addEventListener('touchmove', function (e) {
        if (resLOn && lSb) { var nw = Math.max(120, Math.min(500, resLW + (e.touches[0].clientX - resLX))); lSb.style.width = nw + 'px'; lSb.style.minWidth = nw + 'px'; lSb.style.maxWidth = nw + 'px'; }
        if (resBOn && bPn) { var nh = Math.max(50, Math.min(450, resBH - (e.touches[0].clientY - resBY))); bPn.style.height = nh + 'px'; bPn.style.minHeight = nh + 'px'; bPn.style.maxHeight = nh + 'px'; }
        if (cornerDrag) {
            var el = null; for (var i = 0; i < els.length; i++) { if (els[i].id === selId) { el = els[i]; break; } }
            if (el) { var dx = e.touches[0].clientX - cornerStartX; var ns = Math.max(12, Math.min(320, cornerStartScale + dx * 0.35)); el.scale = Math.round(ns); R(); showCornerHandles(el); }
        }
    }, { passive: false });

    document.addEventListener('touchend', function () {
        if (resLOn) { resLOn = false; if (rL) rL.style.background = ''; }
        if (resBOn) { resBOn = false; if (rB) rB.style.background = ''; }
        if (cornerDrag) { cornerDrag = null; sH(); }
    });

    /* Canvas init */
    setupC(1280, 720);
    sH();

    /* Character — 180%, center bottom */
    chS.sc = 1.80;
    chS.x = Math.floor(innerWidth / 2 - 70);
    chS.y = innerHeight - 180;
    posC();
    renderCh();

    askCharacter('welcome user opened Arjona AI Studio');
});