/* ARJONA +AI STUDIO — COMPLETE FIXED JS */

/* ===== BG CANVAS DISABLED ===== */
var bgC = document.getElementById('bgCanvas');
var bgX = bgC.getContext('2d');
var bgTime = 0, bgW = 0, bgH = 0;
var stars = [], nebClouds = [], shootStars = [], galSpirals = [];

function initUniverseBg() {
    bgW = bgC.width = 10;
    bgH = bgC.height = 10;
}

function renderUniverseBg() {
    // Disabled — nebula moved to AI box
}

/* ===== NEBULA FACTORY ===== */
function createNebula(canvas) {
    if (!canvas) return null;
    var nb = {
        c: canvas,
        x: canvas.getContext('2d'),
        W: 0, H: 0,
        time: 0,
        stars: [],
        clouds: [],
        shoot: [],
        spirals: [],
        orbs: [],
        running: false,
        animId: null
    };

    function resize() {
        nb.W = nb.c.offsetWidth || 280;
        nb.H = nb.c.offsetHeight || 380;
        nb.c.width = nb.W;
        nb.c.height = nb.H;
    }

    function init() {
        resize();
        nb.stars = [];
        nb.clouds = [];
        nb.spirals = [];
        nb.orbs = [];
        nb.shoot = [];
        var cols = [
            'rgba(0,242,254,',
            'rgba(180,100,255,',
            'rgba(255,255,255,',
            'rgba(244,114,182,',
            'rgba(56,189,248,'
        ];
        for (var i = 0; i < 120; i++) {
            nb.stars.push({
                x: Math.random(), y: Math.random(),
                r: Math.random() * 1.4 + 0.2,
                sp: Math.random() * 0.02 + 0.005,
                tw: Math.random() * Math.PI * 2,
                col: cols[Math.floor(Math.random() * cols.length)]
            });
        }
        for (var i = 0; i < 6; i++) {
            nb.clouds.push({
                x: Math.random(), y: Math.random(),
                rx: Math.random() * 0.5 + 0.25,
                ry: Math.random() * 0.35 + 0.15,
                hue: Math.random() * 360,
                sp: Math.random() * 0.003 + 0.001,
                phase: Math.random() * Math.PI * 2,
                op: Math.random() * 0.18 + 0.08
            });
        }
        for (var i = 0; i < 60; i++) {
            nb.spirals.push({
                angle: Math.random() * Math.PI * 4,
                dist: Math.random() * 0.22 + 0.04,
                size: Math.random() * 1.8 + 0.4,
                bright: Math.random() * 0.7 + 0.2,
                sp: Math.random() * 0.004 + 0.001
            });
        }
        for (var i = 0; i < 4; i++) {
            nb.orbs.push({
                x: Math.random(), y: Math.random(),
                r: Math.random() * 0.12 + 0.06,
                hue: Math.random() * 360,
                sp: Math.random() * 0.002 + 0.001,
                phase: Math.random() * Math.PI * 2,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function render() {
        if (!nb.running) return;
        nb.time += 0.012;
        var W = nb.W, H = nb.H, cx = nb.x;
        cx.clearRect(0, 0, W, H);

        var base = cx.createLinearGradient(0, 0, W, H);
        base.addColorStop(0, '#020818');
        base.addColorStop(0.4, '#060d24');
        base.addColorStop(0.7, '#030a1a');
        base.addColorStop(1, '#010510');
        cx.fillStyle = base;
        cx.fillRect(0, 0, W, H);

        var cgx = W * 0.5 + Math.sin(nb.time * 0.4) * W * 0.08;
        var cgy = H * 0.45 + Math.cos(nb.time * 0.3) * H * 0.06;
        var cg = cx.createRadialGradient(cgx, cgy, 0, cgx, cgy, W * 0.55);
        cg.addColorStop(0, 'rgba(120,60,255,0.22)');
        cg.addColorStop(0.3, 'rgba(0,180,255,0.10)');
        cg.addColorStop(0.6, 'rgba(255,60,180,0.05)');
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        cx.fillStyle = cg;
        cx.fillRect(0, 0, W, H);

        for (var i = 0; i < nb.clouds.length; i++) {
            var cl = nb.clouds[i];
            var clx = (cl.x + Math.sin(nb.time * cl.sp + cl.phase) * 0.08) * W;
            var cly = (cl.y + Math.cos(nb.time * cl.sp * 0.7 + cl.phase) * 0.06) * H;
            var pulse = 1 + Math.sin(nb.time * 0.6 + cl.phase) * 0.12;
            var rx = cl.rx * W * pulse;
            var ry = cl.ry * H * pulse;
            if (rx <= 0) continue;
            var h2 = cl.hue + nb.time * 12;
            var ng = cx.createRadialGradient(clx, cly, 0, clx, cly, rx);
            ng.addColorStop(0, 'hsla(' + h2 + ',85%,65%,' + (cl.op * 1.6) + ')');
            ng.addColorStop(0.35, 'hsla(' + (h2 + 40) + ',75%,55%,' + cl.op + ')');
            ng.addColorStop(0.65, 'hsla(' + (h2 + 80) + ',65%,45%,' + (cl.op * 0.4) + ')');
            ng.addColorStop(1, 'hsla(' + (h2 + 120) + ',50%,35%,0)');
            cx.fillStyle = ng;
            cx.save();
            cx.scale(1, ry / rx);
            cx.beginPath();
            cx.arc(clx, cly * (rx / ry), rx, 0, Math.PI * 2);
            cx.fill();
            cx.restore();
        }

        for (var i = 0; i < nb.orbs.length; i++) {
            var ob = nb.orbs[i];
            var ox = (ob.x + Math.sin(nb.time * ob.sp + ob.phase) * 0.15) * W;
            var oy = (ob.y + Math.cos(nb.time * ob.sp + ob.phase) * 0.12) * H;
            var or2 = ob.r * Math.min(W, H) * (1 + Math.sin(nb.time * 1.2 + ob.pulse) * 0.2);
            var oh = ob.hue + nb.time * 15;
            var og = cx.createRadialGradient(ox, oy, 0, ox, oy, or2);
            og.addColorStop(0, 'hsla(' + oh + ',100%,80%,0.35)');
            og.addColorStop(0.4, 'hsla(' + oh + ',90%,60%,0.12)');
            og.addColorStop(1, 'hsla(' + oh + ',80%,50%,0)');
            cx.fillStyle = og;
            cx.beginPath();
            cx.arc(ox, oy, or2, 0, Math.PI * 2);
            cx.fill();
        }

        cx.save();
        cx.translate(cgx, cgy);
        for (var i = 0; i < nb.spirals.length; i++) {
            var sp = nb.spirals[i];
            var a2 = sp.angle + nb.time * sp.sp;
            var d2 = sp.dist * Math.min(W, H);
            var px2 = Math.cos(a2) * d2;
            var py2 = Math.sin(a2) * d2 * 0.55;
            var al2 = sp.bright * (0.4 + Math.sin(nb.time * 2.5 + sp.angle) * 0.35);
            if (al2 < 0) al2 = 0;
            var hsp = 200 + (i / nb.spirals.length) * 180;
            cx.fillStyle = 'hsla(' + hsp + ',100%,80%,' + al2 + ')';
            cx.beginPath();
            cx.arc(px2, py2, sp.size, 0, Math.PI * 2);
            cx.fill();
        }
        cx.restore();

        for (var i = 0; i < nb.stars.length; i++) {
            var s2 = nb.stars[i];
            s2.tw += s2.sp;
            var al3 = 0.25 + Math.sin(s2.tw) * 0.55;
            if (al3 < 0) al3 = 0;
            if (al3 > 1) al3 = 1;
            cx.fillStyle = s2.col + al3 + ')';
            cx.beginPath();
            cx.arc(s2.x * W, s2.y * H, s2.r, 0, Math.PI * 2);
            cx.fill();
            if (s2.r > 1.0 && al3 > 0.7) {
                cx.save();
                cx.strokeStyle = s2.col + (al3 * 0.5) + ')';
                cx.lineWidth = 0.6;
                cx.beginPath();
                cx.moveTo(s2.x * W - s2.r * 4, s2.y * H);
                cx.lineTo(s2.x * W + s2.r * 4, s2.y * H);
                cx.moveTo(s2.x * W, s2.y * H - s2.r * 4);
                cx.lineTo(s2.x * W, s2.y * H + s2.r * 4);
                cx.stroke();
                cx.restore();
            }
        }

        if (nb.shoot.length < 2 && Math.random() < 0.008) {
            nb.shoot.push({
                x: Math.random() * W * 0.7, y: -5,
                len: Math.random() * 60 + 30,
                o: 1,
                dx: Math.random() * 3 + 1.5,
                dy: Math.random() * 2.5 + 1.5,
                hue: Math.random() * 60 + 170
            });
        }
        for (var i = nb.shoot.length - 1; i >= 0; i--) {
            var ss = nb.shoot[i];
            ss.x += ss.dx; ss.y += ss.dy; ss.o -= 0.018;
            if (ss.o <= 0 || ss.x > W || ss.y > H) {
                nb.shoot.splice(i, 1); continue;
            }
            var st2 = ss.dx + ss.dy;
            var tx2 = ss.x - ss.len * (ss.dx / st2);
            var ty2 = ss.y - ss.len * (ss.dy / st2);
            var ssg = cx.createLinearGradient(ss.x, ss.y, tx2, ty2);
            ssg.addColorStop(0, 'hsla(' + ss.hue + ',100%,95%,' + ss.o + ')');
            ssg.addColorStop(0.4, 'hsla(' + ss.hue + ',80%,75%,' + (ss.o * 0.5) + ')');
            ssg.addColorStop(1, 'hsla(' + (ss.hue + 50) + ',60%,50%,0)');
            cx.save();
            cx.strokeStyle = ssg;
            cx.lineWidth = 1.8;
            cx.lineCap = 'round';
            cx.shadowColor = 'hsla(' + ss.hue + ',100%,80%,0.6)';
            cx.shadowBlur = 6;
            cx.beginPath();
            cx.moveTo(ss.x, ss.y);
            cx.lineTo(tx2, ty2);
            cx.stroke();
            cx.restore();
        }

        for (var i = 0; i < 6; i++) {
            var epx = W * 0.5 + Math.sin(nb.time * 1.8 + i * 1.2) * W * 0.35;
            var epy = H * 0.5 + Math.cos(nb.time * 1.1 + i * 1.0) * H * 0.28;
            var epa = 0.06 + Math.sin(nb.time + i) * 0.04;
            var eph = 180 + i * 30;
            cx.fillStyle = 'hsla(' + eph + ',100%,70%,' + epa + ')';
            cx.beginPath();
            cx.arc(epx, epy, 2.5 + Math.sin(nb.time * 1.5 + i) * 1, 0, Math.PI * 2);
            cx.fill();
        }

        var ringR = (0.12 + Math.sin(nb.time * 0.8) * 0.04) * Math.min(W, H);
        var ringG = cx.createRadialGradient(cgx, cgy, ringR * 0.7, cgx, cgy, ringR);
        ringG.addColorStop(0, 'rgba(0,220,255,0)');
        ringG.addColorStop(0.5, 'rgba(0,220,255,0.08)');
        ringG.addColorStop(0.85, 'rgba(150,50,255,0.12)');
        ringG.addColorStop(1, 'rgba(0,0,0,0)');
        cx.fillStyle = ringG;
        cx.beginPath();
        cx.arc(cgx, cgy, ringR, 0, Math.PI * 2);
        cx.fill();

        nb.animId = requestAnimationFrame(render);
    }

    nb.init = init;
    nb.render = function () { nb.running = true; render(); };
    nb.stop = function () {
        nb.running = false;
        if (nb.animId) cancelAnimationFrame(nb.animId);
    };
    nb.resize = resize;
    return nb;
}

/* ===== AI CHAT ===== */
var aiChatOpen = false, ttsOn = false, lastActionTime = Date.now();
var aiChatMem = [];
try {
    aiChatMem = JSON.parse(localStorage.getItem('ai_chat_mem') || '[]');
} catch (e) { aiChatMem = []; }

function toggleAiChat() {
    var box = document.getElementById('aiChatBox');
    aiChatOpen = !aiChatOpen;
    if (aiChatOpen) box.classList.remove('hidden');
    else box.classList.add('hidden');
}

function getCanvasContext() {
    var imgC = 0;
    for (var i = 0; i < els.length; i++) {
        if (els[i].type === 'image') imgC++;
    }
    return canvas.width + 'x' + canvas.height + ',' +
        els.length + ' els,' + imgC + ' imgs';
}

function addAiMem(role, text) {
    aiChatMem.push({ role: role, text: text });
    if (aiChatMem.length > 10) aiChatMem = aiChatMem.slice(-10);
    try {
        localStorage.setItem('ai_chat_mem', JSON.stringify(aiChatMem));
    } catch (e) { }
    lastActionTime = Date.now();
}

function addChatMsg(text, isBot) {
    var body = document.getElementById('aiChatBody');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ' + (isBot ? 'ai-msg-bot' : 'ai-msg-user');
    div.innerText = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function showTyping(s) {
    var el = document.getElementById('aiTyping');
    if (el) el.style.display = s ? 'block' : 'none';
}

function askAI(context, showInChat) {
    if (showInChat !== false) addAiMem('sys', context);
    var prompt = 'You are Arjona AI, funny Hinglish design buddy.' +
        ' Max 20 words. Canvas: ' + getCanvasContext() +
        '. Context: ' + context;
    showTyping(true);
    fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt))
        .then(function (r) { return r.text(); })
        .then(function (text) {
            showTyping(false);
            text = (text || '').trim().substring(0, 120);
            if (!text || text.length < 2) text = 'Mast kaam boss!';
            if (showInChat !== false) {
                addChatMsg(text, true);
                addAiMem('bot', text);
            }
            updateLog(text);
            if (ttsOn) speakTTS(text);
        })
        .catch(function () {
            showTyping(false);
            var fb = ['Design solid!', 'Boss mode!', 'Mast!', 'Zabardast!'];
            if (showInChat !== false)
                addChatMsg(fb[Math.floor(Math.random() * fb.length)], true);
        });
}

function sendAiChat() {
    var inp = document.getElementById('aiChatInput');
    var msg = (inp.value || '').trim();
    inp.value = '';
    if (!msg) return;
    addChatMsg(msg, false);
    addAiMem('user', msg);
    var low = msg.toLowerCase();
    if (low.indexOf('add text') >= 0) { addText(); askAI('added text'); }
    else if (low.indexOf('gray') >= 0) { grayscale(); askAI('grayscale'); }
    else if (low.indexOf('blur') >= 0) { applyBlur(4); askAI('blur'); }
    else if (low.indexOf('invert') >= 0) { invertColors(); askAI('invert'); }
    else if (low.indexOf('export') >= 0) { exportHD(); askAI('export'); }
    else if (low.indexOf('undo') >= 0) { triggerUndo(); askAI('undo'); }
    else if (low.indexOf('remove bg') >= 0) { bgRemove('smart'); askAI('bg remove'); }
    else { askAI('user: ' + msg); }
}

function startAiVoice() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    var rec = new SR();
    rec.lang = 'en-US';
    var btn = document.getElementById('aiVoiceBtn');
    if (btn) btn.innerText = '...';
    rec.onresult = function (e) {
        document.getElementById('aiChatInput').value =
            e.results[0][0].transcript;
        sendAiChat();
    };
    rec.onend = function () { if (btn) btn.innerText = 'Mic'; };
    rec.onerror = function () { if (btn) btn.innerText = 'Mic'; };
    rec.start();
}

function speakTTS(text) {
    if (!('speechSynthesis' in window)) return;
    try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'hi-IN';
        u.rate = 1.1;
        speechSynthesis.speak(u);
    } catch (e) { }
}

function toggleTTS() {
    ttsOn = !ttsOn;
    var btn = document.getElementById('ttsBtn');
    if (btn) btn.innerText = ttsOn ? 'Voice On' : 'Voice Off';
}

function react(k) { askAI(k, false); }

function updateLog(text) {
    var l1 = document.getElementById('logTxt');
    var l2 = document.getElementById('logTxt2');
    if (l1) l1.innerText = text;
    if (l2) l2.innerText = text;
}

setInterval(function () {
    if (Date.now() - lastActionTime > 20000) {
        askAI('user idle', false);
        lastActionTime = Date.now();
    }
}, 15000);

/* ===== THEME ===== */
function toggleTheme() {
    var h = document.documentElement;
    var n = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    h.setAttribute('data-theme', n);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.innerText = n === 'dark' ? 'Night' : 'Day';
    try { localStorage.setItem('ds_theme', n); } catch (e) { }
}

function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('ds_theme'); } catch (e) { }
    if (!saved && window.matchMedia &&
        window.matchMedia('(prefers-color-scheme:light)').matches)
        saved = 'light';
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        var btn = document.getElementById('themeToggle');
        if (btn) btn.innerText = saved === 'dark' ? 'Night' : 'Day';
    }
}

/* ===== MODALS ===== */
function openHelp() {
    document.getElementById('helpModal').style.display = 'flex';
}
function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

/* ===== MOBILE MENU ===== */
function toggleMobMenu() {
    var d = document.getElementById('mobMenuDrawer');
    var o = document.getElementById('mobMenuOverlay');
    if (d.classList.contains('open')) {
        d.classList.remove('open');
        o.classList.remove('open');
    } else {
        d.classList.add('open');
        o.classList.add('open');
    }
}

function closeMobMenu() {
    document.getElementById('mobMenuDrawer').classList.remove('open');
    document.getElementById('mobMenuOverlay').classList.remove('open');
}

/* ===== MOBILE BOTTOM SHEETS WITH SMOOTH TRANSITION ===== */
var currentSheet = null, sheetDragging = false, sheetStartY = 0;

function openBottomSheet(btn, sheetId) {
    var btns = document.querySelectorAll('.mob-bar-btn');
    for (var i = 0; i < btns.length; i++)
        btns[i].classList.remove('active');
    if (btn && btn.classList) btn.classList.add('active');

    var overlay = document.getElementById('mobSheetOverlay');

    // Same sheet — close it
    if (currentSheet === sheetId) {
        var oldSheet = document.getElementById(sheetId);
        if (oldSheet) oldSheet.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('sheet-open');
        currentSheet = null;
        return;
    }

    // Different sheet — smooth transition
    var prevSheet = currentSheet
        ? document.getElementById(currentSheet) : null;

    if (prevSheet) {
        // Slide out current first then slide in new
        prevSheet.classList.remove('open');
        setTimeout(function () {
            var newSheet = document.getElementById(sheetId);
            if (newSheet) {
                newSheet.classList.add('open');
                overlay.classList.add('open');
                document.body.classList.add('sheet-open');
                currentSheet = sheetId;
                if (sheetId === 'sheetHist') renderHistList();
            }
        }, 180);
    } else {
        var newSheet = document.getElementById(sheetId);
        if (newSheet) {
            newSheet.classList.add('open');
            overlay.classList.add('open');
            document.body.classList.add('sheet-open');
            currentSheet = sheetId;
            if (sheetId === 'sheetHist') renderHistList();
        }
    }
}

function closeBottomSheet() {
    var sheets = document.querySelectorAll('.mob-sheet');
    for (var i = 0; i < sheets.length; i++)
        sheets[i].classList.remove('open');
    document.getElementById('mobSheetOverlay').classList.remove('open');
    document.body.classList.remove('sheet-open');
    currentSheet = null;
    // Reset all bar btn active states
    var btns = document.querySelectorAll('.mob-bar-btn');
    for (var i = 0; i < btns.length; i++)
        btns[i].classList.remove('active');
}

function sheetDragStart(e) {
    sheetDragging = true;
    sheetStartY = e.touches[0].clientY;
}

function sheetDragMove(e) {
    if (!sheetDragging) return;
    if (e.touches[0].clientY - sheetStartY > 60) closeBottomSheet();
}

function sheetDragEnd() { sheetDragging = false; }

/* ===== MOBILE PANEL RESIZE ===== */
var mobResizing = false, mobResizeType = '',
    mobResizeStartY = 0, mobResizeStartH = 0;

function startMobResize(e, type) {
    e.preventDefault();
    mobResizing = true;
    mobResizeType = type;
    var touch = e.touches ? e.touches[0] : e;
    mobResizeStartY = touch.clientY;
    if (type === 'top') {
        mobResizeStartH =
            document.getElementById('mobTopBar').offsetHeight;
    } else {
        mobResizeStartH =
            document.getElementById('mobBottomBar').offsetHeight;
    }
}

document.addEventListener('mousemove', handleMobResize);
document.addEventListener('touchmove', handleMobResize, { passive: false });
document.addEventListener('mouseup', function () { mobResizing = false; });
document.addEventListener('touchend', function () { mobResizing = false; });

function handleMobResize(e) {
    if (!mobResizing) return;
    if (e.preventDefault) e.preventDefault();
    var touch = e.touches ? e.touches[0] : e;
    var dy = touch.clientY - mobResizeStartY;
    if (mobResizeType === 'top') {
        var el = document.getElementById('mobTopBar');
        el.style.maxHeight =
            Math.max(50, Math.min(200, mobResizeStartH + dy)) + 'px';
    } else {
        var el = document.getElementById('mobBottomBar');
        el.style.height =
            Math.max(40, Math.min(120, mobResizeStartH - dy)) + 'px';
    }
}

/* ===== MOBILE CANVAS SIZE ===== */
function mobSetSize(btn, w, h) {
    var btns = document.querySelectorAll('.mob-cs-btn');
    for (var i = 0; i < btns.length; i++)
        btns[i].classList.remove('active');
    btn.classList.add('active');
    setupC(w, h);
}

/* ===== MOBILE AI GENERATE ===== */
function generateAIMobile() {
    var prompt = document.getElementById('mobAiPrompt').value.trim();
    if (!prompt) return;
    var style = document.getElementById('mobAiStyle').value || '';
    var el = document.getElementById('aiPrompt');
    if (el) el.value = prompt;
    var stEl = document.getElementById('aiStyle');
    if (stEl) stEl.value = style;
    var modeEl = document.getElementById('aiMode');
    if (modeEl) modeEl.value = 'bg';
    generateAI();
}

/* ===== MOBILE BG SOLID ===== */
function applyMobBgSolid() {
    var c = document.getElementById('mobBgSC');
    if (c) {
        bgCf = { type: 'solid', color: c.value };
        aiBg = null;
        sH('BG Solid');
        R();
        react('bg solid');
    }
}

/* ===== CORNER RESIZE ===== */
var resLOn = false, resLX = 0, resLW = 0;
var resBOn = false, resBY = 0, resBH = 0;
var cornerDrag = null, cornerStartX = 0,
    cornerStartY = 0, cornerStartScale = 100;

function findEl(id) {
    for (var i = 0; i < els.length; i++) {
        if (els[i].id === id) return els[i];
    }
    return null;
}

function showCornerHandles(el) {
    var ids = ['rhNW', 'rhNE', 'rhSW', 'rhSE'];
    if (!el) {
        for (var i = 0; i < ids.length; i++) {
            var h = document.getElementById(ids[i]);
            if (h) h.style.display = 'none';
        }
        return;
    }
    var cr = canvas.getBoundingClientRect();
    var sx = cr.width / canvas.width;
    var sy = cr.height / canvas.height;
    var ex, ey, ew, eh;
    if (el.type === 'image') {
        ew = el.content.width * (el.scale / 100);
        eh = el.content.height * (el.scale / 100);
        ex = el.x; ey = el.y;
    } else {
        ctx.save();
        ctx.font = 'bold ' + (el.scale * 0.6) + 'px "' +
            (el.font || 'Arial') + '"';
        var tw = ctx.measureText(el.text || '').width;
        ctx.restore();
        ew = tw + 20; eh = el.scale * 0.8;
        ex = el.x - ew / 2; ey = el.y - eh / 2;
    }
    var px = cr.left + ex * sx;
    var py = cr.top + ey * sy;
    var pw = ew * sx;
    var ph = eh * sy;
    var pos = [
        [px - 6, py - 6],
        [px + pw - 6, py - 6],
        [px - 6, py + ph - 6],
        [px + pw - 6, py + ph - 6]
    ];
    for (var i = 0; i < ids.length; i++) {
        var h = document.getElementById(ids[i]);
        if (h) {
            h.style.left = pos[i][0] + 'px';
            h.style.top = pos[i][1] + 'px';
            h.style.display = 'block';
        }
    }
}

function hideCornerHandles() {
    var ids = ['rhNW', 'rhNE', 'rhSW', 'rhSE'];
    for (var i = 0; i < ids.length; i++) {
        var h = document.getElementById(ids[i]);
        if (h) h.style.display = 'none';
    }
}

function initCornerResize(id, e) {
    var el = findEl(selId);
    if (!el) return;
    if (e.preventDefault) e.preventDefault();
    cornerDrag = id;
    cornerStartX = e.clientX;
    cornerStartY = e.clientY;
    cornerStartScale = el.scale;
    document.body.style.userSelect = 'none';
}

/* ===== STATE ===== */
var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');
var loader = document.getElementById('loader');
var els = [], selId = null, aiBg = null, bgCf = null;
var uS = [], rS = [], mode = 'select', bSz = 25;
var drag = false, dX = 0, dY = 0;

/* ===== TABS WITH SMOOTH TRANSITION ===== */
function bpTab(btn) {
    var ts = document.querySelectorAll('.bp-tab');
    var ps = document.querySelectorAll('.bp-pan');
    var targetId = btn.getAttribute('data-p');

    // Find current active panel
    var currentPan = null;
    for (var i = 0; i < ps.length; i++) {
        if (ps[i].classList.contains('active')) {
            currentPan = ps[i];
            break;
        }
    }

    if (currentPan && currentPan.id === targetId) return;

    // Fade out current
    if (currentPan) {
        currentPan.style.opacity = '0';
        currentPan.style.transform = 'translateY(4px)';
    }

    for (var i = 0; i < ts.length; i++) ts[i].classList.remove('active');
    btn.classList.add('active');

    setTimeout(function () {
        for (var i = 0; i < ps.length; i++) {
            ps[i].classList.remove('active');
            ps[i].style.opacity = '';
            ps[i].style.transform = '';
        }
        var p = document.getElementById(targetId);
        if (p) p.classList.add('active');
    }, 120);
}

function bgT(btn) {
    var ts = document.querySelectorAll('.bgt');
    var ps = document.querySelectorAll('.bgp');

    // Fade out current bgp
    for (var i = 0; i < ps.length; i++) {
        if (ps[i].classList.contains('active')) {
            ps[i].style.opacity = '0';
            ps[i].style.transform = 'translateX(4px)';
        }
    }

    setTimeout(function () {
        for (var i = 0; i < ts.length; i++) ts[i].classList.remove('active');
        for (var i = 0; i < ps.length; i++) {
            ps[i].classList.remove('active');
            ps[i].style.opacity = '';
            ps[i].style.transform = '';
        }
        btn.classList.add('active');
        var p = document.getElementById(btn.getAttribute('data-p'));
        if (p) p.classList.add('active');
    }, 120);
}

/* ===== SEL BAR ===== */
function showSelBar(el) {
    var bar = document.getElementById('selBar');
    if (bar) bar.style.display = 'none';
    if (!el) { hideCornerHandles(); return; }
    showCornerHandles(el);
}

/* ===== CANVAS SETUP ===== */
function setupC(w, h) {
    canvas.width = w;
    canvas.height = h;
    var info = document.getElementById('cvInfo');
    if (info) info.innerText = w + ' x ' + h;
    R();
}

/* ===== BG ===== */
function setBg(type, sub) {
    if (type === 'solid')
        bgCf = { type: 'solid', color: document.getElementById('bgSC').value };
    else if (type === 'grad')
        bgCf = {
            type: 'grad',
            c1: document.getElementById('bgG1').value,
            c2: document.getElementById('bgG2').value,
            dir: document.getElementById('bgGD').value
        };
    else if (type === 'pat')
        bgCf = {
            type: 'pat', pat: sub,
            pc: document.getElementById('bgPC').value,
            bc: document.getElementById('bgPB').value
        };
    aiBg = null; sH('BG Change'); R(); react('bg changed');
}

function preBg(c1, c2) {
    bgCf = c1 === c2
        ? { type: 'solid', color: c1 }
        : { type: 'grad', c1: c1, c2: c2, dir: 'diag' };
    aiBg = null; sH('BG Preset'); R(); react('preset bg');
}

function clearBg() { bgCf = null; aiBg = null; sH('BG Clear'); R(); }

function paintBg() {
    var W = canvas.width, H = canvas.height;
    if (aiBg && aiBg.complete && aiBg.naturalWidth > 0) {
        var s = Math.max(W / aiBg.naturalWidth, H / aiBg.naturalHeight);
        ctx.drawImage(aiBg,
            (W - aiBg.naturalWidth * s) / 2,
            (H - aiBg.naturalHeight * s) / 2,
            aiBg.naturalWidth * s, aiBg.naturalHeight * s);
        return;
    }
    if (!bgCf) {
        var g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, '#090f1d');
        g.addColorStop(.5, '#0c1a2e');
        g.addColorStop(1, '#060b16');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        return;
    }
    var c = bgCf;
    if (c.type === 'solid') {
        ctx.fillStyle = c.color;
        ctx.fillRect(0, 0, W, H);
    } else if (c.type === 'grad') {
        var g;
        if (c.dir === 'rad')
            g = ctx.createRadialGradient(
                W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) / 2);
        else if (c.dir === 'lr')
            g = ctx.createLinearGradient(0, 0, W, 0);
        else if (c.dir === 'diag')
            g = ctx.createLinearGradient(0, 0, W, H);
        else
            g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, c.c1);
        g.addColorStop(1, c.c2);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    } else if (c.type === 'pat') {
        ctx.fillStyle = c.bc || '#0a0f1e';
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.strokeStyle = c.pc || '#00f2fe';
        ctx.fillStyle = c.pc || '#00f2fe';
        ctx.globalAlpha = .12;
        var sz = 24;
        if (c.pat === 'dots') {
            for (var x = 0; x < W; x += sz)
                for (var y = 0; y < H; y += sz) {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
        } else if (c.pat === 'grid') {
            ctx.lineWidth = 1;
            for (var x = 0; x <= W; x += sz) {
                ctx.beginPath();
                ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (var y = 0; y <= H; y += sz) {
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }
        } else if (c.pat === 'stripe') {
            ctx.lineWidth = 2;
            for (var x = -H; x < W + H; x += sz) {
                ctx.beginPath();
                ctx.moveTo(x, 0); ctx.lineTo(x - H, H); ctx.stroke();
            }
        } else if (c.pat === 'check') {
            for (var x = 0; x < W; x += sz)
                for (var y = 0; y < H; y += sz) {
                    if ((Math.floor(x / sz) + Math.floor(y / sz)) % 2 === 0)
                        ctx.fillRect(x, y, sz, sz);
                }
        } else if (c.pat === 'diamond') {
            ctx.lineWidth = 1;
            for (var x = 0; x < W; x += sz)
                for (var y = 0; y < H; y += sz) {
                    ctx.beginPath();
                    ctx.moveTo(x + sz / 2, y);
                    ctx.lineTo(x + sz, y + sz / 2);
                    ctx.lineTo(x + sz / 2, y + sz);
                    ctx.lineTo(x, y + sz / 2);
                    ctx.closePath();
                    ctx.stroke();
                }
        } else if (c.pat === 'zigzag') {
            ctx.lineWidth = 2;
            for (var y = 0; y < H; y += sz) {
                ctx.beginPath();
                for (var x = 0; x < W; x += sz / 2) {
                    var yo = (Math.floor(x / (sz / 2)) % 2 === 0)
                        ? y : y + sz / 2;
                    if (x === 0) ctx.moveTo(x, yo);
                    else ctx.lineTo(x, yo);
                }
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

/* ===== HISTORY ===== */
function serS() {
    return JSON.stringify({
        els: els.map(function (e) {
            var c = {};
            for (var k in e) c[k] = e[k];
            if (e.type === 'image') { c.src = e.content.src; delete c.content; }
            if (e.eraserMask) { c.mask = e.eraserMask.toDataURL(); delete c.eraserMask; }
            return c;
        }),
        bgCf: bgCf
    });
}

var histLabels = [];

function sH(label) {
    uS.push(serS());
    histLabels.push(label || getHistLabel());
    if (uS.length > 40) { uS.shift(); histLabels.shift(); }
    rS = [];
}

function getHistLabel() {
    if (!selId) return 'Canvas Edit';
    var el = findEl(selId);
    if (!el) return 'Edit';
    return el.type === 'text'
        ? 'Text: "' + (el.text || '').substring(0, 10) + '"'
        : 'Image Edit';
}

function renderHistList() {
    var list = document.getElementById('histList');
    if (!list) return;
    if (uS.length <= 1) {
        list.innerHTML = '<div class="hist-empty">No history yet</div>';
        return;
    }
    list.innerHTML = '';
    for (var i = uS.length - 1; i >= 0; i--) {
        var item = document.createElement('div');
        item.className = 'hist-item' + (i === uS.length - 1 ? ' current' : '');
        var dot = document.createElement('div');
        dot.className = 'hist-item-dot' + (i === uS.length - 1 ? '' : ' old');
        var lbl = document.createElement('div');
        lbl.className = 'hist-item-label';
        lbl.innerText = histLabels[i] || ('Step ' + (i + 1));
        var num = document.createElement('div');
        num.className = 'hist-item-num';
        num.innerText = '#' + (i + 1);
        item.appendChild(dot);
        item.appendChild(lbl);
        item.appendChild(num);
        (function (idx) {
            item.onclick = function () { jumpToHistory(idx); };
        })(i);
        list.appendChild(item);
    }
}

function jumpToHistory(idx) {
    if (idx < 0 || idx >= uS.length) return;
    restS(uS[idx]);
    uS = uS.slice(0, idx + 1);
    histLabels = histLabels.slice(0, idx + 1);
    renderHistList();
}

function clearHistory() {
    var last = uS[uS.length - 1];
    var lastLbl = histLabels[histLabels.length - 1];
    uS = last ? [last] : [];
    histLabels = lastLbl ? [lastLbl] : [];
    renderHistList();
}

function triggerUndo() {
    if (uS.length <= 1) return;
    rS.push(uS.pop());
    histLabels.pop();
    restS(uS[uS.length - 1]);
    react('undo');
}

function triggerRedo() {
    if (!rS.length) return;
    var s = rS.pop();
    uS.push(s);
    restS(s);
}

function restS(json) {
    var p = JSON.parse(json);
    bgCf = p.bgCf || null;
    var ic = 0;
    for (var i = 0; i < p.els.length; i++)
        if (p.els[i].type === 'image') ic++;
    var ld = 0;
    els = p.els.map(function (e) {
        var o = {};
        for (var k in e) o[k] = e[k];
        if (e.type === 'image') {
            o.content = new Image();
            o.content.crossOrigin = 'anonymous';
            o.content.src = e.src || '';
            o.content.onload = function () { ld++; if (ld >= ic) R(); };
            o.eraserMask = document.createElement('canvas');
            if (e.mask) {
                var mi = new Image();
                mi.src = e.mask;
                mi.onload = function () {
                    o.eraserMask.width = mi.width;
                    o.eraserMask.height = mi.height;
                    o.eraserMask.getContext('2d').drawImage(mi, 0, 0);
                };
            } else {
                o.eraserMask.width = 400;
                o.eraserMask.height = 400;
                var mc = o.eraserMask.getContext('2d');
                mc.fillStyle = '#fff';
                mc.fillRect(0, 0, 400, 400);
            }
        }
        return o;
    });
    selId = null;
    sUI();
    if (!ic) R();
}

/* ===== LAYERS ===== */
function addText() {
    els.push({
        id: 't' + Date.now(), type: 'text',
        text: 'EDIT TEXT',
        x: canvas.width / 2, y: canvas.height / 2,
        scale: 100, rotate: 0, opacity: 100,
        font: 'Arial', color: '#00f2fe',
        charSpacing: 0, curve: 0,
        stroke: 2, strokeColor: '#000000',
        emboss: 0, embossColor: '#ffffff',
        threeDDepth: 0, threeDColor: '#1e293b',
        threeDShadow: 0, threeDShadowColor: '#000000',
        innerShadow: 0, innerShadowColor: '#000000',
        reflection: 0, glow: 8, glowColor: '#00f2fe'
    });
    selId = els[els.length - 1].id;
    sH('Add Text'); R(); sUI(); react('added text');
}

function addImg(ev) {
    var f = ev.target.files[0];
    if (f) loadI(f);
    ev.target.value = '';
}

function loadI(file) {
    var r = new FileReader();
    r.readAsDataURL(file);
    r.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            var mc = document.createElement('canvas');
            mc.width = img.width; mc.height = img.height;
            var mx = mc.getContext('2d');
            mx.fillStyle = '#fff';
            mx.fillRect(0, 0, mc.width, mc.height);
            var sc = 50;
            if (img.width * (sc / 100) > canvas.width * .6)
                sc = Math.floor(canvas.width * .6 / img.width * 100);
            if (img.height * (sc / 100) > canvas.height * .6)
                sc = Math.min(sc, Math.floor(canvas.height * .6 / img.height * 100));
            sc = Math.max(12, sc);
            els.push({
                id: 'i' + Date.now(), type: 'image',
                content: img,
                x: canvas.width / 2 - img.width * (sc / 100) / 2,
                y: canvas.height / 2 - img.height * (sc / 100) / 2,
                scale: sc, rotate: 0, opacity: 100,
                eraserMask: mc
            });
            selId = els[els.length - 1].id;
            sH('Upload Image'); R(); sUI(); react('uploaded image');
        };
    };
}

function layerOp(a) {
    if (!selId) return;
    var i = -1;
    for (var j = 0; j < els.length; j++) {
        if (els[j].id === selId) { i = j; break; }
    }
    if (i === -1) return;
    if (a === 'del') {
        els.splice(i, 1);
        selId = null;
        react('deleted');
        showSelBar(null);
    } else if (a === 'front') {
        els.push(els.splice(i, 1)[0]);
    } else if (a === 'back') {
        els.unshift(els.splice(i, 1)[0]);
    } else if (a === 'dup') {
        var s = els[i], c = {};
        for (var k in s) c[k] = s[k];
        c.id = 'd' + Date.now();
        c.x = s.x + 12; c.y = s.y + 12;
        if (s.type === 'image' && s.eraserMask) {
            var nm = document.createElement('canvas');
            nm.width = s.eraserMask.width;
            nm.height = s.eraserMask.height;
            nm.getContext('2d').drawImage(s.eraserMask, 0, 0);
            c.eraserMask = nm;
            c.content = s.content;
        }
        els.push(c);
        selId = c.id;
        react('duplicated');
    }
    sH('Layer: ' + a); R(); sUI();
}

function alignEl(p) {
    var el = findEl(selId);
    if (!el) return;
    if (el.type === 'text') {
        if (p === 'l') el.x = 40;
        if (p === 'c') el.x = canvas.width / 2;
        if (p === 'r') el.x = canvas.width - 40;
        if (p === 'm') el.y = canvas.height / 2;
    } else {
        var w = el.content.width * (el.scale / 100);
        if (p === 'l') el.x = 0;
        if (p === 'c') el.x = (canvas.width - w) / 2;
        if (p === 'r') el.x = canvas.width - w;
        if (p === 'm') el.y = canvas.height / 2;
    }
    sH('Align ' + p); R();
}

/* ===== CANVAS COORDS ===== */
function gCC(e) {
    var r = canvas.getBoundingClientRect();
    var ox = e.offsetX !== undefined ? e.offsetX : (e.clientX - r.left);
    var oy = e.offsetY !== undefined ? e.offsetY : (e.clientY - r.top);
    return {
        x: ox * (canvas.width / r.width),
        y: oy * (canvas.height / r.height)
    };
}

/* ===== MOUSE EVENTS PC ===== */
canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();
    mD(gCC(e));
});

canvas.addEventListener('mousemove', function (e) {
    if (!drag) return;
    mV(gCC(e));
});

canvas.addEventListener('mouseup', function () { mU(); });
canvas.addEventListener('mouseleave', function () { if (drag) mU(); });

/* ===== TOUCH EVENTS MOBILE ===== */
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        var r = canvas.getBoundingClientRect();
        var t = e.touches[0];
        mD({
            x: (t.clientX - r.left) * (canvas.width / r.width),
            y: (t.clientY - r.top) * (canvas.height / r.height)
        });
    }
}, { passive: false });

canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var r = canvas.getBoundingClientRect();

    // Two-finger pinch resize
    if (e.touches.length === 2 && selId) {
        var t1 = e.touches[0], t2 = e.touches[1];
        var dist = Math.sqrt(
            Math.pow(t2.clientX - t1.clientX, 2) +
            Math.pow(t2.clientY - t1.clientY, 2)
        );
        if (!canvas._pinchStart) {
            canvas._pinchStart = {
                dist: dist,
                scale: (findEl(selId) || {}).scale || 100
            };
        }
        var el = findEl(selId);
        if (el) {
            el.scale = Math.max(12, Math.min(320,
                Math.round(canvas._pinchStart.scale *
                    (dist / canvas._pinchStart.dist))
            ));
            sUI(); R();
        }
        return;
    }

    // Single finger drag
    if (e.touches.length === 1) {
        var t = e.touches[0];
        mV({
            x: (t.clientX - r.left) * (canvas.width / r.width),
            y: (t.clientY - r.top) * (canvas.height / r.height)
        });
    }
}, { passive: false });

canvas.addEventListener('touchend', function () {
    canvas._pinchStart = null;
    mU();
}, { passive: false });

/* ===== MOUSE DOWN ===== */
function mD(pt) {
    var x = pt.x, y = pt.y;
    if (mode !== 'select') { drag = true; doErase(x, y); return; }
    var hit = null;
    for (var i = els.length - 1; i >= 0; i--) {
        if (hitEl(els[i], x, y)) { hit = els[i]; break; }
    }
    if (hit) {
        selId = hit.id;
        drag = true;
        dX = x - hit.x;
        dY = y - hit.y;
        canvas.style.cursor = 'move';
        sUI();
        showCornerHandles(hit);
    } else {
        selId = null;
        drag = false;
        canvas.style.cursor = 'default';
        hideCornerHandles();
        sUI();
    }
    R();
}

function hitEl(el, x, y) {
    if (el.type === 'image') {
        if (!el.content || !el.content.complete) return false;
        var w = el.content.width * (el.scale / 100);
        var h = el.content.height * (el.scale / 100);
        var cx2 = el.x + w / 2;
        var cy2 = el.y + h / 2;
        var rot = (el.rotate || 0) * Math.PI / 180;
        var cos = Math.cos(-rot);
        var sin = Math.sin(-rot);
        var lx = cos * (x - cx2) - sin * (y - cy2);
        var ly = sin * (x - cx2) + cos * (y - cy2);
        return lx >= -w / 2 && lx <= w / 2 &&
            ly >= -h / 2 && ly <= h / 2;
    }
    if (el.type === 'text') {
        ctx.save();
        ctx.font = 'bold ' + (el.scale * .6) + 'px "' +
            (el.font || 'Arial') + '"';
        var tw = ctx.measureText(el.text || '').width;
        ctx.restore();
        return x >= el.x - tw / 2 - 10 &&
            x <= el.x + tw / 2 + 10 &&
            y >= el.y - el.scale * .3 &&
            y <= el.y + el.scale * .3;
    }
    return false;
}

/* ===== MOUSE MOVE ===== */
function mV(pt) {
    var x = pt.x, y = pt.y;
    if (!drag) return;
    if (mode !== 'select') { doErase(x, y); return; }
    var el = findEl(selId);
    if (el) {
        el.x = x - dX;
        el.y = y - dY;
        R();
        showCornerHandles(el);
    }
}

/* ===== MOUSE UP ===== */
function mU() {
    if (drag && selId) sH('Move');
    drag = false;
    if (mode === 'select') {
        canvas.style.cursor = selId ? 'move' : 'default';
    }
}

function setMode(m, btn) {
    mode = m;
    canvas.style.cursor = m !== 'select' ? 'crosshair' : 'default';
    var btns = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < btns.length; i++)
        btns[i].classList.remove('active');
    if (btn) btn.classList.add('active');
}

function doErase(cx, cy) {
    var el = findEl(selId);
    if (!el || el.type !== 'image') return;
    var mc = el.eraserMask.getContext('2d');
    var iw = el.content.width * (el.scale / 100);
    var ih = el.content.height * (el.scale / 100);
    var rx = ((cx - el.x) / iw) * el.eraserMask.width;
    var ry = ((cy - el.y) / ih) * el.eraserMask.height;
    var br = bSz * (el.eraserMask.width / Math.max(iw, 1));
    mc.save();
    mc.globalCompositeOperation = 'destination-out';
    mc.fillStyle = 'rgba(0,0,0,1)';
    mc.beginPath();
    if (mode === 'mask') mc.rect(rx - br, ry - br, br * 2, br * 2);
    else mc.arc(rx, ry, br, 0, Math.PI * 2);
    mc.fill();
    mc.restore();
    R();
}

function restMask() {
    var el = findEl(selId);
    if (!el || el.type !== 'image') return;
    var mc = el.eraserMask.getContext('2d');
    mc.globalCompositeOperation = 'source-over';
    mc.fillStyle = '#fff';
    mc.fillRect(0, 0, el.eraserMask.width, el.eraserMask.height);
    sH('Restore Mask'); R();
}

/* ===== PROPS ===== */
function setTxt(v) {
    var el = findEl(selId);
    if (el && el.type === 'text') {
        el.text = v; R();
        var di = document.getElementById('txtIn');
        if (di && di !== document.activeElement) di.value = v;
        var mi = document.getElementById('mobTxtIn');
        if (mi && mi !== document.activeElement) mi.value = v;
    }
}

function setProp(p, v) {
    var el = findEl(selId);
    if (!el) return;
    var cp = ['color', 'strokeColor', 'threeDColor', 'glowColor',
        'font', 'innerShadowColor', 'embossColor', 'threeDShadowColor'];
    el[p] = cp.indexOf(p) >= 0 ? v : parseFloat(v);
    var lm = {
        scale: ['v-sc', '%', 'mob-v-sc'],
        rotate: ['v-rt', '°', 'mob-v-rt'],
        opacity: ['v-op', '%', 'mob-v-op'],
        charSpacing: ['v-sp', 'px'],
        curve: ['v-cu', '°'],
        stroke: ['v-st', 'px'],
        glow: ['v-gw', 'px'],
        threeDDepth: ['v-3d', 'px'],
        innerShadow: ['v-is', 'px'],
        emboss: ['v-em', 'px'],
        reflection: ['v-rf', '%']
    };
    if (lm[p]) {
        var l = document.getElementById(lm[p][0]);
        if (l) l.innerText = v + lm[p][1];
        if (lm[p][2]) {
            var ml = document.getElementById(lm[p][2]);
            if (ml) ml.innerText = v + lm[p][1];
        }
    }
    R();
}

function upFont(ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function (e) {
        var n = f.name.replace(/\.[^/.]+$/, '');
        try {
            var fc = new FontFace(n, 'url(' + e.target.result + ')');
            fc.load().then(function (l) {
                document.fonts.add(l);
                var sel = document.getElementById('fontSel');
                var op = document.createElement('option');
                op.value = n; op.textContent = n;
                sel.appendChild(op);
                sel.value = n;
                react('font ' + n);
            }).catch(function () { });
        } catch (err) { }
    };
    r.readAsDataURL(f);
    ev.target.value = '';
}

function sV(id, v) {
    var e = document.getElementById(id);
    if (e) e.value = (v !== undefined && v !== null) ? v : 0;
}

function sL(id, v, s) {
    var e = document.getElementById(id);
    if (e) e.innerText = ((v !== undefined && v !== null) ? v : 0) + s;
}

function sUI() {
    var el = findEl(selId);
    var lb = document.getElementById('selLbl');
    var lbd = document.getElementById('selLblDesk');
    var name = el
        ? (el.type === 'text'
            ? '"' + (el.text || '').substring(0, 8) + '"'
            : 'Image')
        : 'None';
    if (lb) lb.innerText = name;
    if (lbd) lbd.innerText = name;
    if (!el) { showSelBar(null); return; }
    sV('sl-sc', el.scale || 100); sL('v-sc', el.scale || 100, '%');
    sV('sl-rt', el.rotate || 0); sL('v-rt', el.rotate || 0, '°');
    sV('sl-op', el.opacity || 100); sL('v-op', el.opacity || 100, '%');
    sV('mob-sl-sc', el.scale || 100); sL('mob-v-sc', el.scale || 100, '%');
    sV('mob-sl-rt', el.rotate || 0); sL('mob-v-rt', el.rotate || 0, '°');
    sV('mob-sl-op', el.opacity || 100); sL('mob-v-op', el.opacity || 100, '%');
    if (el.type === 'text') {
        var ti = document.getElementById('txtIn');
        if (ti) ti.value = el.text || '';
        var mti = document.getElementById('mobTxtIn');
        if (mti) mti.value = el.text || '';
        var tc = document.getElementById('txtCol');
        if (tc) tc.value = el.color || '#00f2fe';
        var mtc = document.getElementById('mobTxtCol');
        if (mtc) mtc.value = el.color || '#00f2fe';
        sV('sl-sp', el.charSpacing || 0); sL('v-sp', el.charSpacing || 0, 'px');
        sV('sl-cu', el.curve || 0); sL('v-cu', el.curve || 0, '°');
        sV('sl-st', el.stroke || 2); sL('v-st', el.stroke || 2, 'px');
        var sc2 = document.getElementById('c-stroke');
        if (sc2) sc2.value = el.strokeColor || '#000000';
        sV('sl-gw', el.glow || 8); sL('v-gw', el.glow || 8, 'px');
        var gc = document.getElementById('c-glow');
        if (gc) gc.value = el.glowColor || '#00f2fe';
        sV('sl-3d', el.threeDDepth || 0); sL('v-3d', el.threeDDepth || 0, 'px');
        var td = document.getElementById('c-3d');
        if (td) td.value = el.threeDColor || '#1e293b';
        sV('sl-is', el.innerShadow || 0); sL('v-is', el.innerShadow || 0, 'px');
        var isc = document.getElementById('c-is');
        if (isc) isc.value = el.innerShadowColor || '#000000';
        sV('sl-em', el.emboss || 0); sL('v-em', el.emboss || 0, 'px');
        sV('sl-rf', el.reflection || 0); sL('v-rf', el.reflection || 0, '%');
    }
}

/* ===== TEXT RENDER ===== */
function dTxt(el) {
    ctx.save();
    ctx.globalAlpha = el.opacity / 100;
    var fs = Math.max(el.scale * .6, 8);
    ctx.font = 'bold ' + fs + 'px "' + (el.font || 'Arial') + '"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var txt = el.text || '', sp = el.charSpacing || 0;

    function tw(s) {
        var w = 0;
        for (var i = 0; i < s.length; i++)
            w += ctx.measureText(s[i]).width + sp;
        return Math.max(w - sp, 1);
    }

    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate((el.rotate || 0) * Math.PI / 180);

    if (el.curve && el.curve !== 0) {
        var ang = el.curve / 180 * Math.PI;
        var al = tw(txt);
        var rad = al / Math.abs(ang) || 300;
        var ca = -Math.PI / 2 - ang / 2;
        for (var i = 0; i < txt.length; i++) {
            var ch = txt[i];
            var cw = ctx.measureText(ch).width + sp;
            var dA = cw / rad;
            ctx.save();
            ctx.translate(
                Math.cos(ca + dA / 2) * rad,
                Math.sin(ca + dA / 2) * rad + (el.curve > 0 ? rad : -rad)
            );
            ctx.rotate(ca + dA / 2 + Math.PI / 2 +
                (el.curve > 0 ? 0 : Math.PI));
            cFx(el, ch, 0, 0);
            ctx.restore();
            ca += dA;
        }
    } else {
        var total = tw(txt), xO = -total / 2;
        for (var i = 0; i < txt.length; i++) {
            var ch = txt[i];
            var cw = ctx.measureText(ch).width;
            cFx(el, ch, xO + cw / 2, 0);
            xO += cw + sp;
        }
        if ((el.reflection || 0) > 0) {
            ctx.save();
            ctx.scale(1, -1);
            ctx.globalAlpha = el.reflection / 100 * .3;
            var rg = ctx.createLinearGradient(0, 0, 0, fs);
            rg.addColorStop(0, el.color || '#00f2fe');
            rg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rg;
            var x2 = -total / 2;
            for (var i = 0; i < txt.length; i++) {
                var ch = txt[i];
                var cw = ctx.measureText(ch).width;
                ctx.fillText(ch, x2 + cw / 2, -fs * .15);
                x2 += cw + sp;
            }
            ctx.restore();
        }
    }
    ctx.restore();
    ctx.restore();
}

function cFx(el, ch, x, y) {
    var d = el.threeDDepth || 0;
    if ((el.glow || 0) > 0) {
        ctx.save();
        ctx.shadowColor = el.glowColor || '#00f2fe';
        ctx.shadowBlur = el.glow;
        ctx.fillStyle = el.color || '#00f2fe';
        ctx.fillText(ch, x, y);
        ctx.restore();
    }
    if (d > 0) {
        ctx.fillStyle = el.threeDColor || '#1e293b';
        for (var i = d; i >= 1; i--)
            ctx.fillText(ch, x + i * .8, y + i * .6);
    }
    if ((el.threeDShadow || 0) > 0) {
        ctx.save();
        ctx.shadowColor = el.threeDShadowColor || 'rgba(0,0,0,.55)';
        ctx.shadowBlur = el.threeDShadow;
        ctx.fillStyle = el.color || '#00f2fe';
        ctx.fillText(ch, x, y);
        ctx.restore();
    }
    if ((el.emboss || 0) > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,.25)';
        ctx.fillText(ch, x - el.emboss * .4, y - el.emboss * .4);
        ctx.fillStyle = 'rgba(0,0,0,.25)';
        ctx.fillText(ch, x + el.emboss * .4, y + el.emboss * .4);
        ctx.restore();
    }
    if ((el.innerShadow || 0) > 0) {
        ctx.save();
        ctx.shadowColor = el.innerShadowColor || 'rgba(0,0,0,.7)';
        ctx.shadowBlur = el.innerShadow;
        ctx.fillStyle = el.color || '#00f2fe';
        ctx.fillText(ch, x, y);
        ctx.restore();
    }
    if ((el.stroke || 0) > 0) {
        ctx.save();
        ctx.lineWidth = el.stroke;
        ctx.strokeStyle = el.strokeColor || '#000';
        ctx.lineJoin = 'round';
        ctx.strokeText(ch, x, y);
        ctx.restore();
    }
    ctx.fillStyle = el.color || '#00f2fe';
    ctx.fillText(ch, x, y);
}

/* ===== RENDER ===== */
function R() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintBg();

    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        ctx.save();
        ctx.globalAlpha = (el.opacity || 100) / 100;
        if (el.type === 'image') {
            if (!el.content || !el.content.complete ||
                !el.content.naturalWidth) {
                ctx.restore(); continue;
            }
            var w = el.content.width * (el.scale / 100);
            var h = el.content.height * (el.scale / 100);
            if (w <= 0 || h <= 0) { ctx.restore(); continue; }
            ctx.translate(el.x + w / 2, el.y + h / 2);
            ctx.rotate((el.rotate || 0) * Math.PI / 180);
            var tmp = document.createElement('canvas');
            tmp.width = w; tmp.height = h;
            var tx = tmp.getContext('2d');
            tx.drawImage(el.content, 0, 0, w, h);
            if (el.eraserMask) {
                tx.globalCompositeOperation = 'destination-in';
                tx.drawImage(el.eraserMask, 0, 0, w, h);
            }
            ctx.drawImage(tmp, -w / 2, -h / 2);
        } else if (el.type === 'text') {
            dTxt(el);
        }
        ctx.restore();
    }

    // Selection border
    if (selId) {
        var sel = findEl(selId);
        if (sel) {
            ctx.save();
            ctx.setLineDash([6, 3]);
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00f2fe';
            ctx.shadowBlur = 8;
            if (sel.type === 'image' && sel.content &&
                sel.content.complete && sel.content.naturalWidth) {
                var sw = sel.content.width * (sel.scale / 100);
                var sh = sel.content.height * (sel.scale / 100);
                ctx.save();
                ctx.translate(sel.x + sw / 2, sel.y + sh / 2);
                ctx.rotate((sel.rotate || 0) * Math.PI / 180);
                ctx.strokeRect(-sw / 2 - 4, -sh / 2 - 4, sw + 8, sh + 8);
                ctx.restore();
            } else if (sel.type === 'text') {
                ctx.font = 'bold ' + Math.max(sel.scale * .6, 8) +
                    'px "' + (sel.font || 'Arial') + '"';
                var tw = ctx.measureText(sel.text || '').width +
                    (sel.charSpacing || 0) * (sel.text || '').length;
                var th = sel.scale * 0.75;
                ctx.save();
                ctx.translate(sel.x, sel.y);
                ctx.rotate((sel.rotate || 0) * Math.PI / 180);
                ctx.strokeRect(-tw / 2 - 8, -th / 2 - 6, tw + 16, th + 12);
                ctx.restore();
            }
            ctx.restore();
        }
    }
}

/* ===== GRADING ===== */
function liveG() {
    var ids = ['br', 'ct', 'sa', 'te', 'vi', 'gr'];
    for (var i = 0; i < ids.length; i++) {
        var s = document.getElementById('sg-' + ids[i]) ||
            document.getElementById('mob-sg-' + ids[i]);
        var v = document.getElementById('vg-' + ids[i]);
        if (s && v) v.innerText = s.value;
    }
}

var gPD = {
    cinematic: { br: -10, ct: 30, sa: -15, te: 10, vi: 40, gr: 5 },
    vintage: { br: 5, ct: 10, sa: -30, te: 15, vi: 30, gr: 15 },
    warm: { br: 10, ct: 10, sa: 15, te: 30, vi: 10, gr: 0 },
    cool: { br: 0, ct: 15, sa: -10, te: -30, vi: 15, gr: 0 },
    noir: { br: -20, ct: 50, sa: -100, te: 0, vi: 60, gr: 10 },
    neon: { br: 0, ct: 40, sa: 50, te: -10, vi: 20, gr: 0 },
    sepia: { br: 10, ct: 10, sa: -60, te: 30, vi: 20, gr: 8 },
    golden: { br: 10, ct: 20, sa: 20, te: 35, vi: 15, gr: 0 },
    hdr: { br: 5, ct: 50, sa: 30, te: 0, vi: 10, gr: 0 }
};

function gradeP(n) {
    var p = gPD[n]; if (!p) return;
    for (var k in p) {
        var sl = document.getElementById('sg-' + k);
        if (sl) sl.value = p[k];
        var msl = document.getElementById('mob-sg-' + k);
        if (msl) msl.value = p[k];
    }
    liveG();
}

function resetGrade() {
    ['br', 'ct', 'sa', 'te', 'vi', 'gr'].forEach(function (id) {
        var sl = document.getElementById('sg-' + id);
        if (sl) sl.value = 0;
        var msl = document.getElementById('mob-sg-' + id);
        if (msl) msl.value = 0;
    });
    liveG();
}

function applyGrade() {
    R();
    try {
        var d = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var px = d.data;
        var gv = function (id) {
            return parseInt((
                document.getElementById('sg-' + id) ||
                document.getElementById('mob-sg-' + id) ||
                { value: 0 }
            ).value) || 0;
        };
        var br = gv('br'), ct = gv('ct'), sa = gv('sa');
        var te = gv('te'), vi = gv('vi'), gr = gv('gr');
        var cf = (259 * (ct + 255)) / (255 * (259 - ct));
        for (var i = 0; i < px.length; i += 4) {
            var r = px[i], g = px[i + 1], b = px[i + 2];
            r += br; g += br; b += br;
            r = cf * (r - 128) + 128;
            g = cf * (g - 128) + 128;
            b = cf * (b - 128) + 128;
            r += te; b -= te;
            var gray = .299 * r + .587 * g + .114 * b;
            var sf = 1 + sa / 100;
            r = gray + sf * (r - gray);
            g = gray + sf * (g - gray);
            b = gray + sf * (b - gray);
            px[i] = Math.max(0, Math.min(255, r));
            px[i + 1] = Math.max(0, Math.min(255, g));
            px[i + 2] = Math.max(0, Math.min(255, b));
        }
        if (vi > 0) {
            var W = canvas.width, H = canvas.height;
            var cxv = W / 2, cyv = H / 2;
            var mxD = Math.sqrt(cxv * cxv + cyv * cyv);
            for (var y = 0; y < H; y++) {
                for (var x = 0; x < W; x++) {
                    var dist = Math.sqrt(
                        (x - cxv) * (x - cxv) + (y - cyv) * (y - cyv)
                    ) / mxD;
                    var f = 1 - dist * dist * (vi / 100) * 1.5;
                    var idx = (y * W + x) * 4;
                    px[idx] *= f; px[idx + 1] *= f; px[idx + 2] *= f;
                }
            }
        }
        if (gr > 0) {
            for (var i = 0; i < px.length; i += 4) {
                var n = (Math.random() - .5) * gr * 3;
                px[i] = Math.max(0, Math.min(255, px[i] + n));
                px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n));
                px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n));
            }
        }
        ctx.putImageData(d, 0, 0);
        var img = new Image();
        img.src = canvas.toDataURL();
        img.onload = function () {
            aiBg = img; bgCf = null;
            sH('Grade Applied'); R();
        };
        react('graded');
    } catch (e) { react('grade error'); }
}

/* ===== PIXART ===== */
function getD() { R(); return ctx.getImageData(0, 0, canvas.width, canvas.height); }

function apD(d) {
    ctx.putImageData(d, 0, 0);
    var img = new Image();
    img.src = canvas.toDataURL();
    img.onload = function () {
        aiBg = img; bgCf = null; sH('FX Applied'); R();
    };
    react('effect');
}

function pixelate(sz) {
    R();
    var W = canvas.width, H = canvas.height;
    var d = ctx.getImageData(0, 0, W, H), px = d.data;
    for (var y = 0; y < H; y += sz) {
        for (var x = 0; x < W; x += sz) {
            var r = 0, g = 0, b = 0, c = 0;
            for (var dy = 0; dy < sz && y + dy < H; dy++) {
                for (var dx = 0; dx < sz && x + dx < W; dx++) {
                    var i = ((y + dy) * W + (x + dx)) * 4;
                    r += px[i]; g += px[i + 1]; b += px[i + 2]; c++;
                }
            }
            r /= c; g /= c; b /= c;
            for (var dy = 0; dy < sz && y + dy < H; dy++) {
                for (var dx = 0; dx < sz && x + dx < W; dx++) {
                    var i = ((y + dy) * W + (x + dx)) * 4;
                    px[i] = r; px[i + 1] = g; px[i + 2] = b;
                }
            }
        }
    }
    apD(d);
}

function applyBlur(rad) {
    R();
    var W = canvas.width, H = canvas.height;
    var src = ctx.getImageData(0, 0, W, H);
    var dst = ctx.createImageData(W, H);
    var s = src.data, d = dst.data;
    for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
            var r = 0, g = 0, b = 0, c = 0;
            for (var dy = -rad; dy <= rad; dy++) {
                for (var dx = -rad; dx <= rad; dx++) {
                    var nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                        var i = (ny * W + nx) * 4;
                        r += s[i]; g += s[i + 1]; b += s[i + 2]; c++;
                    }
                }
            }
            var i = (y * W + x) * 4;
            d[i] = r / c; d[i + 1] = g / c;
            d[i + 2] = b / c; d[i + 3] = s[i + 3];
        }
    }
    apD(dst);
}

function applySharpen() {
    R();
    var W = canvas.width, H = canvas.height;
    var src = ctx.getImageData(0, 0, W, H);
    var dst = ctx.createImageData(W, H);
    var s = src.data, d = dst.data;
    var k = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    for (var y = 1; y < H - 1; y++) {
        for (var x = 1; x < W - 1; x++) {
            var r = 0, g = 0, b = 0, ki = 0;
            for (var dy = -1; dy <= 1; dy++) {
                for (var dx = -1; dx <= 1; dx++) {
                    var i = ((y + dy) * W + (x + dx)) * 4;
                    r += s[i] * k[ki];
                    g += s[i + 1] * k[ki];
                    b += s[i + 2] * k[ki];
                    ki++;
                }
            }
            var i = (y * W + x) * 4;
            d[i] = Math.max(0, Math.min(255, r));
            d[i + 1] = Math.max(0, Math.min(255, g));
            d[i + 2] = Math.max(0, Math.min(255, b));
            d[i + 3] = s[i + 3];
        }
    }
    apD(dst);
}

function invertColors() {
    var d = getD(), px = d.data;
    for (var i = 0; i < px.length; i += 4) {
        px[i] = 255 - px[i];
        px[i + 1] = 255 - px[i + 1];
        px[i + 2] = 255 - px[i + 2];
    }
    apD(d);
}

function grayscale() {
    var d = getD(), px = d.data;
    for (var i = 0; i < px.length; i += 4) {
        var g = .299 * px[i] + .587 * px[i + 1] + .114 * px[i + 2];
        px[i] = px[i + 1] = px[i + 2] = g;
    }
    apD(d);
}

function posterize(lv) {
    var d = getD(), px = d.data, step = 255 / lv;
    for (var i = 0; i < px.length; i += 4) {
        px[i] = Math.round(px[i] / step) * step;
        px[i + 1] = Math.round(px[i + 1] / step) * step;
        px[i + 2] = Math.round(px[i + 2] / step) * step;
    }
    apD(d);
}

function edgeDetect() {
    R();
    var W = canvas.width, H = canvas.height;
    var src = ctx.getImageData(0, 0, W, H);
    var dst = ctx.createImageData(W, H);
    var s = src.data, d = dst.data;
    for (var y = 1; y < H - 1; y++) {
        for (var x = 1; x < W - 1; x++) {
            var i = (y * W + x) * 4;
            var gx = (
                -s[((y - 1) * W + x - 1) * 4] +
                s[((y - 1) * W + x + 1) * 4] -
                2 * s[(y * W + x - 1) * 4] +
                2 * s[(y * W + x + 1) * 4] -
                s[((y + 1) * W + x - 1) * 4] +
                s[((y + 1) * W + x + 1) * 4]
            );
            var gy = (
                -s[((y - 1) * W + x - 1) * 4] -
                2 * s[((y - 1) * W + x) * 4] -
                s[((y - 1) * W + x + 1) * 4] +
                s[((y + 1) * W + x - 1) * 4] +
                2 * s[((y + 1) * W + x) * 4] +
                s[((y + 1) * W + x + 1) * 4]
            );
            d[i] = d[i + 1] = d[i + 2] =
                Math.min(255, Math.sqrt(gx * gx + gy * gy));
            d[i + 3] = 255;
        }
    }
    apD(dst);
}

function applyNoise(amt) {
    var d = getD(), px = d.data;
    for (var i = 0; i < px.length; i += 4) {
        var n = (Math.random() - .5) * amt * 2;
        px[i] = Math.max(0, Math.min(255, px[i] + n));
        px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n));
        px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n));
    }
    apD(d);
}

function flipH() {
    R();
    var W = canvas.width, H = canvas.height;
    var d = ctx.getImageData(0, 0, W, H), px = d.data;
    for (var y = 0; y < H; y++) {
        for (var x = 0; x < Math.floor(W / 2); x++) {
            var l = (y * W + x) * 4;
            var r = (y * W + (W - 1 - x)) * 4;
            for (var c = 0; c < 4; c++) {
                var tmp = px[l + c];
                px[l + c] = px[r + c];
                px[r + c] = tmp;
            }
        }
    }
    apD(d);
}

/* ===== AI BG REMOVE ===== */
function bgRemove(method) {
    var el = findEl(selId);
    if (!el || el.type !== 'image') return;
    react('removing bg');
    loader.style.display = 'flex';
    document.getElementById('ldrMsg').innerText = 'Removing...';
    var tol = parseInt(
        (document.getElementById('sl-tol') || { value: 50 }).value
    ) || 50;
    setTimeout(function () {
        try {
            var mc = el.eraserMask, mx = mc.getContext('2d');
            var tc = document.createElement('canvas');
            tc.width = el.content.width;
            tc.height = el.content.height;
            tc.getContext('2d').drawImage(el.content, 0, 0);
            var d;
            try {
                d = tc.getContext('2d').getImageData(
                    0, 0, tc.width, tc.height);
            } catch (e) { loader.style.display = 'none'; return; }
            var data = d.data, W = tc.width, H = tc.height;
            mx.globalCompositeOperation = 'source-over';
            mx.fillStyle = '#fff';
            mx.fillRect(0, 0, mc.width, mc.height);
            var md = mx.getImageData(0, 0, mc.width, mc.height);
            var mD = md.data;
            var scX = mc.width / W, scY = mc.height / H;

            function mark(px, py) {
                var mx2 = Math.round(px * scX);
                var my2 = Math.round(py * scY);
                if (mx2 >= 0 && mx2 < mc.width &&
                    my2 >= 0 && my2 < mc.height) {
                    var mi = (my2 * mc.width + mx2) * 4;
                    mD[mi] = mD[mi + 1] = mD[mi + 2] = mD[mi + 3] = 0;
                }
            }

            if (method === 'color' || method === 'smart') {
                var corners = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]];
                var tR = 0, tG = 0, tB = 0;
                for (var ci = 0; ci < corners.length; ci++) {
                    var idx = (corners[ci][1] * W + corners[ci][0]) * 4;
                    tR += data[idx]; tG += data[idx + 1]; tB += data[idx + 2];
                }
                tR /= 4; tG /= 4; tB /= 4;
                for (var py = 0; py < H; py++) {
                    for (var px = 0; px < W; px++) {
                        var si = (py * W + px) * 4;
                        if (Math.sqrt(
                            Math.pow(data[si] - tR, 2) +
                            Math.pow(data[si + 1] - tG, 2) +
                            Math.pow(data[si + 2] - tB, 2)
                        ) < tol) mark(px, py);
                    }
                }
            }
            if (method === 'bright' || method === 'smart') {
                for (var py = 0; py < H; py++) {
                    for (var px = 0; px < W; px++) {
                        var si = (py * W + px) * 4;
                        var b = (data[si] + data[si + 1] + data[si + 2]) / 3;
                        if (b > 255 - tol / 2 || b < tol / 2) mark(px, py);
                    }
                }
            }
            if (method === 'edge' || method === 'smart') {
                var vis = new Uint8Array(W * H);
                [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]]
                    .forEach(function (st) {
                        var stk = [st];
                        var ri = (st[1] * W + st[0]) * 4;
                        var rR = data[ri], rG = data[ri + 1], rB = data[ri + 2];
                        while (stk.length) {
                            var pt = stk.pop();
                            var cx2 = pt[0], cy2 = pt[1];
                            if (cx2 < 0 || cx2 >= W || cy2 < 0 || cy2 >= H) continue;
                            var idx2 = cy2 * W + cx2;
                            if (vis[idx2]) continue;
                            vis[idx2] = 1;
                            var pi = idx2 * 4;
                            if (Math.sqrt(
                                Math.pow(data[pi] - rR, 2) +
                                Math.pow(data[pi + 1] - rG, 2) +
                                Math.pow(data[pi + 2] - rB, 2)
                            ) < tol) {
                                mark(cx2, cy2);
                                if (stk.length < 500000)
                                    stk.push(
                                        [cx2 + 1, cy2], [cx2 - 1, cy2],
                                        [cx2, cy2 + 1], [cx2, cy2 - 1]
                                    );
                            }
                        }
                    });
            }
            mx.putImageData(md, 0, 0);
            sH('BG Removed'); R(); react('bg removed');
        } catch (e) { }
        finally { loader.style.display = 'none'; }
    }, 300);
}

/* ===== AI GENERATE ===== */
function generateAI() {
    var pv = (document.getElementById('aiPrompt').value || '').trim();
    if (!pv) return;
    loader.style.display = 'flex';
    document.getElementById('ldrMsg').innerText = 'Generating...';
    react('generating AI');
    var style = document.getElementById('aiStyle').value || '';
    var aiMode = document.getElementById('aiMode').value || 'bg';
    var url = 'https://image.pollinations.ai/prompt/' +
        encodeURIComponent(pv + style) +
        '?width=' + canvas.width +
        '&height=' + canvas.height +
        '&nologo=true&seed=' + Math.floor(Math.random() * 99999);
    var nb = new Image();
    nb.crossOrigin = 'anonymous';
    var to = setTimeout(function () {
        loader.style.display = 'none'; react('timeout');
    }, 45000);
    nb.onload = function () {
        clearTimeout(to);
        loader.style.display = 'none';
        if (aiMode === 'bg') {
            aiBg = nb; bgCf = null;
            sH('AI Background'); R(); react('AI bg done');
        } else {
            var mc = document.createElement('canvas');
            mc.width = nb.width; mc.height = nb.height;
            mc.getContext('2d').fillStyle = '#fff';
            mc.getContext('2d').fillRect(0, 0, mc.width, mc.height);
            var sc = 50;
            if (nb.width * (sc / 100) > canvas.width * .6)
                sc = Math.floor(canvas.width * .6 / nb.width * 100);
            sc = Math.max(12, sc);
            els.push({
                id: 'ai' + Date.now(), type: 'image',
                content: nb,
                x: canvas.width / 2 - nb.width * (sc / 100) / 2,
                y: canvas.height / 2 - nb.height * (sc / 100) / 2,
                scale: sc, rotate: 0, opacity: 100,
                eraserMask: mc
            });
            selId = els[els.length - 1].id;
            sH('AI Layer'); R(); sUI(); react('AI layer done');
        }
    };
    nb.onerror = function () {
        clearTimeout(to);
        loader.style.display = 'none';
        react('AI failed');
    };
    nb.src = url;
}

/* ===== MISC ===== */
function resetAll() {
    if (!confirm('Reset everything?')) return;
    els = []; selId = null; aiBg = null; bgCf = null;
    uS = []; rS = []; histLabels = [];
    sUI(); R(); react('reset');
}

function exportHD() {
    try {
        var link = document.createElement('a');
        link.download = 'Arjona_' + Date.now() + '.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        react('exported');
    } catch (e) { alert('Export failed: ' + e.message); }
}

function doVoice(ev) {
    ev.preventDefault();
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    var rec = new SR();
    rec.lang = 'en-US';
    var btn = ev.target;
    if (btn) btn.innerText = '...';
    rec.onresult = function (e) {
        document.getElementById('aiPrompt').value =
            e.results[0][0].transcript;
    };
    rec.onend = function () { if (btn) btn.innerText = 'Mic'; };
    rec.start();
}

/* ===== KEYBOARD ===== */
document.addEventListener('keydown', function (e) {
    var t = document.activeElement ? document.activeElement.tagName : '';
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (e.key === 'Escape') {
        closeHelp(); closeBottomSheet(); closeMobMenu();
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selId)
        layerOp('del');
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault(); triggerUndo();
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault(); triggerRedo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault(); if (selId) layerOp('dup');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); exportHD();
    }
    if (selId && ['ArrowUp', 'ArrowDown',
        'ArrowLeft', 'ArrowRight'].indexOf(e.key) >= 0) {
        e.preventDefault();
        var el = findEl(selId);
        var st = e.shiftKey ? 10 : 2;
        if (el) {
            if (e.key === 'ArrowUp') el.y -= st;
            if (e.key === 'ArrowDown') el.y += st;
            if (e.key === 'ArrowLeft') el.x -= st;
            if (e.key === 'ArrowRight') el.x += st;
            R(); showCornerHandles(el);
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

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initUniverseBg();

    // Two independent nebula instances
    var chatNebula = null;
    var sideNebula = null;

    var aiNbCanvas = document.getElementById('aiNebula');
    if (aiNbCanvas) {
        chatNebula = createNebula(aiNbCanvas);
        chatNebula.init();
        chatNebula.render();
    }

    var aiBoxEl = document.querySelector('.ai-box');
    if (aiBoxEl) {
        var sideNbCanvas = document.createElement('canvas');
        sideNbCanvas.className = 'ai-box-nebula';
        aiBoxEl.insertBefore(sideNbCanvas, aiBoxEl.firstChild);
        sideNebula = createNebula(sideNbCanvas);
        sideNebula.init();
        sideNebula.render();
    }

    // Single resize listener
    window.addEventListener('resize', function () {
        if (chatNebula) chatNebula.resize();
        if (sideNebula) sideNebula.resize();
        R();
    });

    // Desktop resize handles
    var rL = document.getElementById('resizeLeft');
    var rB = document.getElementById('resizeBottom');
    var lSb = document.getElementById('leftSidebar');
    var bPn = document.getElementById('bottomPanel');

    if (rL && lSb) {
        rL.addEventListener('mousedown', function (e) {
            e.preventDefault();
            resLOn = true;
            resLX = e.clientX;
            resLW = lSb.getBoundingClientRect().width;
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'col-resize';
        });
        rL.addEventListener('touchstart', function (e) {
            e.preventDefault();
            resLOn = true;
            resLX = e.touches[0].clientX;
            resLW = lSb.getBoundingClientRect().width;
        }, { passive: false });
    }

    if (rB && bPn) {
        rB.addEventListener('mousedown', function (e) {
            e.preventDefault();
            resBOn = true;
            resBY = e.clientY;
            resBH = bPn.getBoundingClientRect().height;
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'row-resize';
        });
        rB.addEventListener('touchstart', function (e) {
            e.preventDefault();
            resBOn = true;
            resBY = e.touches[0].clientY;
            resBH = bPn.getBoundingClientRect().height;
        }, { passive: false });
    }

    // Corner resize
    var corners = ['rhNW', 'rhNE', 'rhSW', 'rhSE'];
    for (var ci = 0; ci < corners.length; ci++) {
        (function (cid) {
            var ch = document.getElementById(cid);
            if (ch) {
                ch.addEventListener('mousedown', function (e) {
                    initCornerResize(cid, e);
                });
                ch.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    initCornerResize(cid, {
                        clientX: e.touches[0].clientX,
                        clientY: e.touches[0].clientY,
                        preventDefault: function () { },
                        stopPropagation: function () { }
                    });
                }, { passive: false });
            }
        })(corners[ci]);
    }

    // Global mouse move
    document.addEventListener('mousemove', function (e) {
        if (resLOn && lSb) {
            var nw = Math.max(140, Math.min(400, resLW + (e.clientX - resLX)));
            lSb.style.width = nw + 'px';
            lSb.style.minWidth = nw + 'px';
            lSb.style.maxWidth = nw + 'px';
        }
        if (resBOn && bPn) {
            var nh = Math.max(44, Math.min(
                window.innerHeight * 0.6,
                resBH - (e.clientY - resBY)
            ));
            bPn.style.height = nh + 'px';
        }
        if (cornerDrag) {
            var el = findEl(selId);
            if (el) {
                var dx = e.clientX - cornerStartX;
                var delta = (cornerDrag.indexOf('NW') >= 0 ||
                    cornerDrag.indexOf('SW') >= 0) ? -dx : dx;
                if (e.shiftKey)
                    delta = Math.max(Math.abs(dx),
                        Math.abs(e.clientY - cornerStartY)) *
                        (dx >= 0 ? 1 : -1);
                el.scale = Math.max(12, Math.min(320,
                    Math.round(cornerStartScale + delta * 0.35)));
                R(); showCornerHandles(el); sUI();
            }
        }
    });

    // Global mouse up
    document.addEventListener('mouseup', function () {
        if (resLOn) {
            resLOn = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
        if (resBOn) {
            resBOn = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
        if (cornerDrag) {
            cornerDrag = null;
            document.body.style.userSelect = '';
            sH('Resize');
        }
    });

    // Global touch move
    document.addEventListener('touchmove', function (e) {
        if (resLOn && lSb) {
            var nw = Math.max(140, Math.min(400,
                resLW + (e.touches[0].clientX - resLX)));
            lSb.style.width = nw + 'px';
            lSb.style.minWidth = nw + 'px';
            lSb.style.maxWidth = nw + 'px';
        }
        if (resBOn && bPn) {
            var nh = Math.max(44, Math.min(
                window.innerHeight * 0.6,
                resBH - (e.touches[0].clientY - resBY)
            ));
            bPn.style.height = nh + 'px';
        }
        if (cornerDrag) {
            var el = findEl(selId);
            if (el) {
                var dx = e.touches[0].clientX - cornerStartX;
                el.scale = Math.max(12, Math.min(320,
                    Math.round(cornerStartScale + dx * 0.35)));
                R(); showCornerHandles(el);
            }
        }
    }, { passive: false });

    // Global touch end
    document.addEventListener('touchend', function () {
        if (resLOn) resLOn = false;
        if (resBOn) resBOn = false;
        if (cornerDrag) { cornerDrag = null; sH('Resize'); }
    });

    setupC(1280, 720);
    sH('Init');
    askAI('user opened Arjona AI Studio', false);
});