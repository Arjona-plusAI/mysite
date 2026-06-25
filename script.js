const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('aiLoader');

// Global Architectural State Layers
let aiGeneratedImage = new Image();
let localUploadedImage = new Image();

let isAILoaded = false;
let isUserPhotoLoaded = false;

// Typography Dragging Configurations
let textX = 640;
let textY = 360;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let activeTextColor = "#ffffff";
const fontStyleFamily = "bold Arial";

// Canvas System Initialization Loop
setupCanvasResolution(1280, 720);

// Set up event binders for local changes
document.getElementById('aiPrompt').addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); executeMergedAIPipeline(); } });

// Hook Event listeners onto interactive canvas layout for Draggable Text System
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseout', handleMouseUp);

// Mobile Touch integration loops for Draggable Text System
canvas.addEventListener('touchstart', (e) => { 
    const touch = e.touches[0]; 
    const rect = canvas.getBoundingClientRect();
    handleMouseDown({ 
        offsetX: (touch.clientX - rect.left) * (canvas.width / rect.width), 
        offsetY: (touch.clientY - rect.top) * (canvas.height / rect.height) 
    }); 
});
canvas.addEventListener('touchmove', (e) => { 
    const touch = e.touches[0]; 
    const rect = canvas.getBoundingClientRect();
    handleMouseMove({ 
        offsetX: (touch.clientX - rect.left) * (canvas.width / rect.width), 
        offsetY: (touch.clientY - rect.top) * (canvas.height / rect.height) 
    }); 
    e.preventDefault(); 
});
canvas.addEventListener('touchend', handleMouseUp);

// Function to handle automatic preset selections 
function handlePresetDimensionChange() {
    const preset = document.getElementById('dimensionPreset').value;
    const dimensions = preset.split('x');
    const width = parseInt(dimensions[0]);
    const height = parseInt(dimensions[1]);
    
    setupCanvasResolution(width, height);
    document.getElementById('aiLog').innerText = `📐 Bounds reallocated to ${width}x${height}`;
}

function setupCanvasResolution(w, h) {
    canvas.width = w;
    canvas.height = h;
    textX = canvas.width / 2;
    textY = canvas.height / 2;
    renderAll();
}

// Handler for manual photo upload processing node
function handleLocalImageUpload(event) {
    const file = event.target.files[0];
    const feedback = document.getElementById('uploadFeedback');
    
    if (!file) return;
    
    feedback.innerText = "⏳ Processing image file structure...";
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    
    fileReader.onload = function(e) {
        localUploadedImage.src = e.target.result;
        localUploadedImage.onload = function() {
            isUserPhotoLoaded = true;
            feedback.innerHTML = `📸 <span style="color:#10b981; font-weight:bold;">Active:</span> ${file.name.substring(0,15)}...`;
            renderAll();
        };
    };
}

function changeTextColor(hexColor, buttonElement) {
    activeTextColor = hexColor;
    document.querySelectorAll('.palette-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    renderAll();
}

// 🎯 DRAGGABLE MOUSE INTERACTION AND CURSOR SWITCHER ALGORITHM
function getTextBorders() {
    const fontSize = parseInt(document.getElementById('sl-fontSize').value);
    const textValue = document.getElementById('textLayer').value;
    ctx.font = `${fontSize}px ${fontStyleFamily}`;
    
    const calculatedWidth = ctx.measureText(textValue).width;
    const calculatedHeight = fontSize; 
    
    return {
        left: textX - calculatedWidth / 2,
        right: textX + calculatedWidth / 2,
        top: textY - calculatedHeight / 2,
        bottom: textY + calculatedHeight / 2
    };
}

function handleMouseDown(e) {
    const bounds = getTextBorders();
    // Convert current client view coordinates into raw internal canvas dimensions
    const canvasRect = canvas.getBoundingClientRect();
    const computedX = e.offsetX * (canvas.width / canvasRect.width);
    const computedY = e.offsetY * (canvas.height / canvasRect.height);

    if (computedX >= bounds.left && computedX <= bounds.right && computedY >= bounds.top && computedY <= bounds.bottom) {
        isDragging = true;
        dragOffsetX = computedX - textX;
        dragOffsetY = computedY - textY;
    }
}

function handleMouseMove(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const computedX = e.offsetX * (canvas.width / canvasRect.width);
    const computedY = e.offsetY * (canvas.height / canvasRect.height);
    const bounds = getTextBorders();

    // DYNAMIC CURSOR FEEDBACK SYSTEM: Change cursor to crosshair/move when hovering over textual overlay layers
    if (computedX >= bounds.left && computedX <= bounds.right && computedY >= bounds.top && computedY <= bounds.bottom) {
        canvas.style.cursor = 'move';
    } else {
        canvas.style.cursor = 'default';
    }

    if (isDragging) {
        textX = computedX - dragOffsetX;
        textY = computedY - dragOffsetY;
        renderAll();
    }
}

function handleMouseUp() {
    isDragging = false;
}

// 🪄 UNIFIED MERGED INTELLIGENT AI MAGIC GENERATION ENGINE 
async function executeMergedAIPipeline() {
    const promptValue = document.getElementById('aiPrompt').value.trim();
    const logSystem = document.getElementById('aiLog');
    
    if (!promptValue) {
        alert("Please enter a visual description command inside the prompt engine box!");
        return;
    }

    loader.style.display = 'flex';
    logSystem.style.color = "#eab308";
    logSystem.innerText = "Connecting to Neural Cluster server nodes...";

    try {
        let finalCompoundedPrompt = promptValue;
        
        // Smart Pipeline branching detection
        if (isUserPhotoLoaded) {
            logSystem.innerText = "🎛️ Local layer detected. Injecting subject and swapping background environment...";
            finalCompoundedPrompt = `a clean realistic professional photo, with background completely modified into: ${promptValue}`;
        } else {
            logSystem.innerText = "🌌 No active local subject. Designing absolute pristine scenery backdrop...";
        }

        const encodedQuery = encodeURIComponent(finalCompoundedPrompt);
        const randomSeedVector = Math.floor(Math.random() * 888888);
        const requestEndpoint = `https://image.pollinations.ai/p/${encodedQuery}?width=${canvas.width}&height=${canvas.height}&nologo=true&seed=${randomSeedVector}&turbo=true&enhance=false`;
        aiGeneratedImage.src = requestEndpoint;
        aiGeneratedImage.crossOrigin = "anonymous";

        aiGeneratedImage.onload = function() {
            isAILoaded = true;
            renderAll();
            logSystem.style.color = "#10b981";
            logSystem.innerText = "✨ Matrix Layer Compilation successfully deployed on canvas.";
            loader.style.display = 'none';
        };

        aiGeneratedImage.onerror = function() { throw new Error("Render pipeline broke down."); };

    } catch(err) {
        logSystem.style.color = "#f87171";
        logSystem.innerText = "❌ Neural Sync failure. Resubmit prompt query instruction set.";
        loader.style.display = 'none';
        console.error(err);
    }
}

// REALTIME COMPOSITING LOGIC CORE: Binds image blending, local objects overlay and lightroom filters
function renderAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sliders Interface Monitors Value Update Linker
    const expVal = document.getElementById('sl-bright').value;
    const conVal = document.getElementById('sl-contrast').value;
    const satVal = document.getElementById('sl-saturate').value;
    const hueVal = document.getElementById('sl-hue').value;
    const fontVal = document.getElementById('sl-fontSize').value;
    
    document.getElementById('val-bright').innerText = `${expVal}%`;
    document.getElementById('val-contrast').innerText = `${conVal}%`;
    document.getElementById('val-saturate').innerText = `${satVal}%`;
    document.getElementById('val-hue').innerText = `${hueVal}°`;
    document.getElementById('val-font').innerText = `${fontVal}px`;

    // Layer 1: Apply Base Background (AI Rendered or Default Fallback Slate)
    if (isAILoaded) {
        ctx.save();
        // Bind Lightroom Filter String matrices together instantly
        ctx.filter = `brightness(${expVal}%) contrast(${conVal}%) saturate(${satVal}%) hue-rotate(${hueVal}deg)`;
        ctx.drawImage(aiGeneratedImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    } else {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Layer 2: Subject Blending Layer (If a user local photo was supplied, blend it neatly in center foreground context)
    if (isUserPhotoLoaded) {
        ctx.save();
        // Calculate bounds aspect ratios to maintain shape logic cleanly inside viewports
        const scaleFactor = Math.min((canvas.width * 0.6) / localUploadedImage.width, (canvas.height * 0.7) / localUploadedImage.height);
        const iw = localUploadedImage.width * scaleFactor;
        const ih = localUploadedImage.height * scaleFactor;
        
        // Centers image perfectly above the compiled background layers
        const ix = (canvas.width - iw) / 2;
        const iy = canvas.height - ih; // Anchor securely to bottom standard baseline
        
        ctx.drawImage(localUploadedImage, ix, iy, iw, ih);
        ctx.restore();
    }

    // Default instruction when both canvas channels remain unallocated
    if (!isAILoaded && !isUserPhotoLoaded) {
        ctx.fillStyle = "#475569";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";
        ctx.fillText("AI STUDIO MAX: System Idle. Allocate parameters or media to begin rendering.", canvas.width / 2, canvas.height / 2);
    }

    // Layer 3: Render Typography String Engine Node
    const textDataString = document.getElementById('textLayer').value;
    
    ctx.fillStyle = activeTextColor;
    ctx.font = `${fontVal}px ${fontStyleFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Smooth shadows parameters rendering setup to pop texts visibly above noisy backdrops
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 15;
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000000";
    
    ctx.strokeText(textDataString, textX, textY);
    ctx.fillText(textDataString, textX, textY);
}

// Global master file downloads engine exporter
function downloadMasterHD() {
    const downloadNode = document.createElement('a');
    downloadNode.download = `AI_STUDIO_MAX_PRODUCTION_MASTER.png`;
    downloadNode.href = canvas.toDataURL('image/png', 1.0);
    downloadNode.click();
}