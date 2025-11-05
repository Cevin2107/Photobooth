// Capture Module
import { STATE, CONFIG } from './config.js';
import { video, canvas, ctx } from './camera.js';
import { updatePhotoSlots, updatePhotoCount } from './ui.js';
import { openFrameSelector } from './frames/frames.js';

// Cache button elements
const buttons = {
    capture: document.getElementById('captureBtn'),
    autoCapture: document.getElementById('autoCaptureBtn'),
    reset: document.getElementById('resetBtn'),
    download: document.getElementById('downloadBtn'),
    changeFrame: document.getElementById('changeFrameBtn')
};

// Layout aspect ratios
const ASPECT_RATIOS = {
    '2x2': 3 / 4,      // Portrait
    '2x3': 522 / 391,  // Landscape ~1.335
    default: 4 / 3     // Default landscape
};

// Toggle button states after all photos taken
const showCompletionButtons = () => {
    buttons.capture?.classList.add('hidden');
    buttons.autoCapture?.classList.add('hidden');
    buttons.reset?.classList.remove('hidden');
    buttons.download?.classList.remove('hidden');
    buttons.changeFrame?.classList.remove('hidden');
    
    console.log('All photos taken! Layout:', STATE.currentLayout);
    setTimeout(() => openFrameSelector(), 500);
};

// Countdown function
export async function doCountdown() {
    const countdownEl = document.getElementById('countdown');
    const numberEl = document.getElementById('countdownNumber');
    countdownEl.classList.remove('hidden');
    
    for (let i = STATE.countdownTime; i > 0; i--) {
        numberEl.textContent = i;
        numberEl.style.animation = 'none';
        setTimeout(() => numberEl.style.animation = 'pulse 0.5s ease-in-out', 10);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    countdownEl.classList.add('hidden');
}

// Capture single image
export async function captureImage() {
    ctx.filter = CONFIG.filters[STATE.currentFilter].filter || 'none';
    
    // Get target aspect ratio based on layout
    const targetAspectRatio = ASPECT_RATIOS[STATE.currentLayout] || ASPECT_RATIOS.default;
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    
    let sourceX = 0, sourceY = 0, sourceWidth = video.videoWidth, sourceHeight = video.videoHeight;
    
    // Crop to match target aspect ratio (center crop)
    if (videoAspectRatio > targetAspectRatio) {
        sourceWidth = video.videoHeight * targetAspectRatio;
        sourceX = (video.videoWidth - sourceWidth) / 2;
    } else if (videoAspectRatio < targetAspectRatio) {
        sourceHeight = video.videoWidth / targetAspectRatio;
        sourceY = (video.videoHeight - sourceHeight) / 2;
    }
    
    // Set canvas size to match cropped area
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    
    // Draw with flip to match video preview
    ctx.save();
    if (!STATE.isFlipped) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.filter = 'none';
    
    // Save photo to first empty slot
    const emptyIndex = STATE.photos.findIndex(p => p === null);
    if (emptyIndex !== -1) {
        STATE.photos[emptyIndex] = canvas.toDataURL('image/png');
    }
    
    updatePhotoSlots();
    updatePhotoCount();
}

// Single capture
export async function singleCapture() {
    if (STATE.isCapturing || STATE.photos.filter(p => p === null).length === 0) {
        if (STATE.photos.filter(p => p === null).length === 0) {
            alert('Đã chụp đủ ảnh! Xóa ảnh hoặc nhấn "Chụp Lại".');
        }
        return;
    }
    
    buttons.capture.disabled = true;
    buttons.autoCapture.disabled = true;
    
    if (STATE.countdownTime > 0) await doCountdown();
    await captureImage();
    
    buttons.capture.disabled = false;
    buttons.autoCapture.disabled = false;
    
    if (STATE.photos.filter(p => p !== null).length >= STATE.maxPhotos) {
        showCompletionButtons();
    }
}

// Auto capture all remaining photos
export async function autoCapture() {
    const availableSlots = STATE.photos.filter(p => p === null).length;
    if (STATE.isCapturing || availableSlots === 0) {
        if (availableSlots === 0) alert('Đã chụp đủ ảnh! Xóa ảnh hoặc nhấn "Chụp Lại".');
        return;
    }
    
    buttons.autoCapture.disabled = true;
    buttons.capture.disabled = true;
    STATE.isCapturing = true;
    
    const photosToTake = Math.min(STATE.maxPhotos, availableSlots);
    for (let i = 0; i < photosToTake; i++) {
        if (STATE.countdownTime > 0) await doCountdown();
        await captureImage();
        if (i < photosToTake - 1) await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    STATE.isCapturing = false;
    buttons.autoCapture.disabled = false;
    buttons.capture.disabled = false;
    
    if (STATE.photos.filter(p => p !== null).length >= STATE.maxPhotos) {
        showCompletionButtons();
    }
}
