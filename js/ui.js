// UI Module
import { STATE } from './config.js';
import { canvas } from './camera.js';
import { applyFrameAndDownload } from './frames/frames.js';

// Cache DOM elements
const elements = {
    captureBtn: document.getElementById('captureBtn'),
    autoCaptureBtn: document.getElementById('autoCaptureBtn'),
    resetBtn: document.getElementById('resetBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    photoCount: document.getElementById('photoCount'),
    swapModal: document.getElementById('swapModal'),
    swapOptions: document.getElementById('swapOptions')
};

// Update photo slots display
export function updatePhotoSlots() {
    const slots = document.querySelectorAll('.photo-slot');
    slots.forEach((slot, index) => {
        const hasPhoto = STATE.photos[index];
        let img = slot.querySelector('img');
        const deleteBtn = slot.querySelector('.delete-btn');
        const swapBtn = slot.querySelector('.swap-btn');
        
        if (hasPhoto) {
            if (!img) {
                img = document.createElement('img');
                slot.innerHTML = '';
                slot.appendChild(img);
                slot.appendChild(deleteBtn);
                slot.appendChild(swapBtn);
            }
            img.src = hasPhoto;
            slot.classList.add('has-photo');
        } else {
            slot.innerHTML = '<i class="fas fa-image text-pink-300 text-4xl"></i>';
            slot.appendChild(deleteBtn);
            slot.appendChild(swapBtn);
            slot.classList.remove('has-photo');
        }
    });
}

// Update photo count
export function updatePhotoCount() {
    const count = STATE.photos.filter(p => p !== null).length;
    if (elements.photoCount) {
        elements.photoCount.textContent = `${count}/${STATE.maxPhotos}`;
    }
}

// Delete photo
export function deletePhoto(index) {
    STATE.photos[index] = null;
    updatePhotoSlots();
    updatePhotoCount();
    
    elements.captureBtn?.classList.remove('hidden');
    elements.autoCaptureBtn?.classList.remove('hidden');
    if (elements.captureBtn) elements.captureBtn.disabled = false;
    
    // Hide reset/download if no photos
    if (STATE.photos.filter(p => p !== null).length === 0) {
        elements.resetBtn?.classList.add('hidden');
        elements.downloadBtn?.classList.add('hidden');
    }
}

// Swap photos
export function swapPhotos(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    
    const slots = document.querySelectorAll('.photo-slot');
    slots[fromIndex].style.transform = 'scale(0.8)';
    slots[toIndex].style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        // Shift photos based on direction
        const temp = STATE.photos[fromIndex];
        if (fromIndex < toIndex) {
            for (let i = fromIndex; i < toIndex; i++) {
                STATE.photos[i] = STATE.photos[i + 1];
            }
        } else {
            for (let i = fromIndex; i > toIndex; i--) {
                STATE.photos[i] = STATE.photos[i - 1];
            }
        }
        STATE.photos[toIndex] = temp;
        
        updatePhotoSlots();
        slots.forEach(slot => slot.style.transform = 'scale(1)');
        closeSwapModal();
    }, 300);
}

// Open swap modal
export function openSwapModal(fromIndex) {
    if (!STATE.photos[fromIndex]) return;
    
    STATE.swapFromIndex = fromIndex;
    
    elements.swapOptions.innerHTML = '';
    for (let i = 0; i < STATE.maxPhotos; i++) {
        const btn = document.createElement('button');
        btn.className = 'swap-option-btn';
        btn.textContent = `Ảnh ${i + 1}`;
        
        if (i === fromIndex || !STATE.photos[i]) {
            btn.classList.add('disabled');
        } else {
            btn.onclick = () => swapPhotos(fromIndex, i);
        }
        
        elements.swapOptions.appendChild(btn);
    }
    
    elements.swapModal?.classList.add('active');
}

// Close swap modal
export function closeSwapModal() {
    elements.swapModal?.classList.remove('active');
    STATE.swapFromIndex = null;
}

// Download combined photo
export async function downloadPhotos() {
    const finalCanvas = await applyFrameAndDownload(
        STATE.photos, 
        STATE.currentLayout, 
        canvas.width, 
        canvas.height
    );
    
    const link = document.createElement('a');
    link.download = `photobooth-${STATE.currentLayout}-${Date.now()}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
}
