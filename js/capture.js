// Capture Module
import { STATE, CONFIG } from './config.js';
import { video, canvas, ctx } from './camera.js';
import { updatePhotoSlots, updatePhotoCount } from './ui.js';
import { openFrameSelector } from './frames.js';

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
    // Apply filter and capture
    ctx.filter = CONFIG.filters[STATE.currentFilter].filter || 'none';
    
    // Draw with flip to match video preview
    ctx.save();
    
    // If video is NOT flipped (default mirror mode), flip the captured image
    if (!STATE.isFlipped) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.filter = 'none';
    
    const photoData = canvas.toDataURL('image/png');
    
    // Find first empty slot
    const emptyIndex = STATE.photos.findIndex(p => p === null);
    if (emptyIndex !== -1) {
        STATE.photos[emptyIndex] = photoData;
    }
    
    // Update UI
    updatePhotoSlots();
    updatePhotoCount();
}

// Single capture
export async function singleCapture() {
    if (STATE.isCapturing) return;
    
    const availableSlots = STATE.photos.filter(p => p === null).length;
    if (availableSlots === 0) {
        alert('Đã chụp đủ ảnh! Xóa ảnh hoặc nhấn "Chụp Lại".');
        return;
    }
    
    // Disable buttons
    document.getElementById('captureBtn').disabled = true;
    document.getElementById('autoCaptureBtn').disabled = true;
    
    if (STATE.countdownTime > 0) {
        await doCountdown();
    }
    await captureImage();
    
    // Re-enable buttons
    document.getElementById('captureBtn').disabled = false;
    document.getElementById('autoCaptureBtn').disabled = false;
    
    // Check if all photos taken
    if (STATE.photos.filter(p => p !== null).length >= STATE.maxPhotos) {
        console.log('All photos taken! Layout:', STATE.currentLayout);
        document.getElementById('captureBtn').classList.add('hidden');
        document.getElementById('autoCaptureBtn').classList.add('hidden');
        document.getElementById('resetBtn').classList.remove('hidden');
        document.getElementById('downloadBtn').classList.remove('hidden');
        
        // Only show frame selector for 1x4 layout
        if (STATE.currentLayout === '1x4') {
            console.log('Layout is 1x4, showing frame selector...');
            const changeFrameBtn = document.getElementById('changeFrameBtn');
            if (changeFrameBtn) {
                changeFrameBtn.classList.remove('hidden');
                console.log('Change frame button shown');
            } else {
                console.error('Change frame button not found!');
            }
            
            // Open frame selector after completing all photos
            setTimeout(() => {
                console.log('Calling openFrameSelector...');
                openFrameSelector();
            }, 500);
        } else {
            console.log('Layout is not 1x4, skipping frame selector');
        }
    }
}

// Auto capture all remaining photos
export async function autoCapture() {
    if (STATE.isCapturing) return;
    
    const availableSlots = STATE.photos.filter(p => p === null).length;
    if (availableSlots === 0) {
        alert('Đã chụp đủ ảnh! Xóa ảnh hoặc nhấn "Chụp Lại".');
        return;
    }
    
    // Disable buttons
    document.getElementById('autoCaptureBtn').disabled = true;
    document.getElementById('captureBtn').disabled = true;
    STATE.isCapturing = true;
    
    const photosToTake = Math.min(STATE.maxPhotos, availableSlots);
    for (let i = 0; i < photosToTake; i++) {
        if (STATE.countdownTime > 0) {
            await doCountdown();
        }
        await captureImage();
        
        // Wait between photos (except last one)
        if (i < photosToTake - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    STATE.isCapturing = false;
    document.getElementById('autoCaptureBtn').disabled = false;
    document.getElementById('captureBtn').disabled = false;
    
    // Check if all photos taken
    if (STATE.photos.filter(p => p !== null).length >= STATE.maxPhotos) {
        console.log('All photos taken (auto)! Layout:', STATE.currentLayout);
        document.getElementById('autoCaptureBtn').classList.add('hidden');
        document.getElementById('captureBtn').classList.add('hidden');
        document.getElementById('resetBtn').classList.remove('hidden');
        document.getElementById('downloadBtn').classList.remove('hidden');
        
        // Only show frame selector for 1x4 layout
        if (STATE.currentLayout === '1x4') {
            console.log('Layout is 1x4, showing frame selector...');
            const changeFrameBtn = document.getElementById('changeFrameBtn');
            if (changeFrameBtn) {
                changeFrameBtn.classList.remove('hidden');
                console.log('Change frame button shown');
            } else {
                console.error('Change frame button not found!');
            }
            
            // Open frame selector after completing all photos
            setTimeout(() => {
                console.log('Calling openFrameSelector...');
                openFrameSelector();
            }, 500);
        } else {
            console.log('Layout is not 1x4, skipping frame selector');
        }
    }
}
