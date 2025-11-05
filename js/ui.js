// UI Module
import { STATE } from './config.js';
import { canvas } from './camera.js';
import { applyFrameAndDownload } from './frames/frames.js';

// Update photo slots display
export function updatePhotoSlots() {
    const slots = document.querySelectorAll('.photo-slot');
    slots.forEach((slot, index) => {
        let img = slot.querySelector('img');
        const deleteBtn = slot.querySelector('.delete-btn');
        const swapBtn = slot.querySelector('.swap-btn');
        
        if (STATE.photos[index]) {
            if (!img) {
                img = document.createElement('img');
                slot.innerHTML = '';
                slot.appendChild(img);
                slot.appendChild(deleteBtn);
                slot.appendChild(swapBtn);
            }
            img.src = STATE.photos[index];
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
    const photoCountEl = document.getElementById('photoCount');
    if (photoCountEl) {
        photoCountEl.textContent = `${count}/${STATE.maxPhotos}`;
    }
}

// Delete photo
export function deletePhoto(index) {
    STATE.photos[index] = null;
    updatePhotoSlots();
    updatePhotoCount();
    
    // Show capture button again
    document.getElementById('captureBtn').classList.remove('hidden');
    document.getElementById('autoCaptureBtn').classList.remove('hidden');
    document.getElementById('captureBtn').disabled = false;
    
    // Hide reset/download if no photos
    if (STATE.photos.filter(p => p !== null).length === 0) {
        document.getElementById('resetBtn').classList.add('hidden');
        document.getElementById('downloadBtn').classList.add('hidden');
    }
}

// Swap photos
export function swapPhotos(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    
    // Add animation
    const slots = document.querySelectorAll('.photo-slot');
    slots[fromIndex].style.transform = 'scale(0.8)';
    slots[toIndex].style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        if (fromIndex < toIndex) {
            // Moving down: shift photos up
            const temp = STATE.photos[fromIndex];
            for (let i = fromIndex; i < toIndex; i++) {
                STATE.photos[i] = STATE.photos[i + 1];
            }
            STATE.photos[toIndex] = temp;
        } else {
            // Moving up: shift photos down
            const temp = STATE.photos[fromIndex];
            for (let i = fromIndex; i > toIndex; i--) {
                STATE.photos[i] = STATE.photos[i - 1];
            }
            STATE.photos[toIndex] = temp;
        }
        
        updatePhotoSlots();
        
        // Reset animation
        slots.forEach(slot => {
            slot.style.transform = 'scale(1)';
        });
        
        closeSwapModal();
    }, 300);
}

// Open swap modal
export function openSwapModal(fromIndex) {
    if (!STATE.photos[fromIndex]) return;
    
    STATE.swapFromIndex = fromIndex;
    const modal = document.getElementById('swapModal');
    const optionsContainer = document.getElementById('swapOptions');
    optionsContainer.innerHTML = '';
    
    // Generate swap options
    for (let i = 0; i < STATE.maxPhotos; i++) {
        const btn = document.createElement('button');
        btn.className = 'swap-option-btn';
        btn.textContent = `Ảnh ${i + 1}`;
        
        // Disable current photo and empty slots
        if (i === fromIndex || !STATE.photos[i]) {
            btn.classList.add('disabled');
        } else {
            btn.onclick = () => swapPhotos(fromIndex, i);
        }
        
        optionsContainer.appendChild(btn);
    }
    
    modal.classList.add('active');
}

// Close swap modal
export function closeSwapModal() {
    const modal = document.getElementById('swapModal');
    modal.classList.remove('active');
    STATE.swapFromIndex = null;
}

// Download combined photo
export async function downloadPhotos() {
    const cellWidth = canvas.width;
    const cellHeight = canvas.height;
    
    // Apply frame and get final canvas
    const finalCanvas = await applyFrameAndDownload(
        STATE.photos, 
        STATE.currentLayout, 
        cellWidth, 
        cellHeight
    );
    
    // Download
    const link = document.createElement('a');
    link.download = `photobooth-${STATE.currentLayout}-${Date.now()}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
}
