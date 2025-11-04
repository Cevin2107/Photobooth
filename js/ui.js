// UI Module
import { STATE } from './config.js';
import { canvas } from './camera.js';

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
            
            // Apply flip state to image to match video orientation
            if (STATE.isFlipped) {
                img.classList.add('flipped');
            } else {
                img.classList.remove('flipped');
            }
            
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
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');
    
    const cellWidth = canvas.width;
    const cellHeight = canvas.height;
    
    // Set canvas size based on layout
    if (STATE.currentLayout === '1x4') {
        combinedCanvas.width = cellWidth;
        combinedCanvas.height = cellHeight * 4;
    } else if (STATE.currentLayout === '2x2') {
        combinedCanvas.width = cellWidth * 2;
        combinedCanvas.height = cellHeight * 2;
    } else if (STATE.currentLayout === '2x3') {
        combinedCanvas.width = cellWidth * 3;
        combinedCanvas.height = cellHeight * 2;
    }
    
    // Background
    combinedCtx.fillStyle = '#ffe4f0';
    combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    
    // Add photos
    const validPhotos = STATE.photos.filter(p => p !== null);
    for (let i = 0; i < validPhotos.length; i++) {
        const img = new Image();
        img.src = validPhotos[i];
        await new Promise(resolve => {
            img.onload = () => {
                let x, y;
                
                if (STATE.currentLayout === '1x4') {
                    x = 0;
                    y = i * cellHeight;
                } else if (STATE.currentLayout === '2x2') {
                    x = (i % 2) * cellWidth;
                    y = Math.floor(i / 2) * cellHeight;
                } else if (STATE.currentLayout === '2x3') {
                    x = (i % 3) * cellWidth;
                    y = Math.floor(i / 3) * cellHeight;
                }
                
                combinedCtx.drawImage(img, x, y, cellWidth, cellHeight);
                
                // Border
                combinedCtx.strokeStyle = '#ff69b4';
                combinedCtx.lineWidth = 5;
                combinedCtx.strokeRect(x, y, cellWidth, cellHeight);
                resolve();
            };
        });
    }
    
    // Download
    const link = document.createElement('a');
    link.download = `photobooth-${STATE.currentLayout}-${Date.now()}.png`;
    link.href = combinedCanvas.toDataURL('image/png');
    link.click();
}
