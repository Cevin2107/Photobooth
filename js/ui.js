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
        const uploadBtn = slot.querySelector('.upload-btn');
        
        if (hasPhoto) {
            if (!img) {
                img = document.createElement('img');
                slot.innerHTML = '';
                slot.appendChild(img);
                slot.appendChild(deleteBtn);
                slot.appendChild(swapBtn);
                slot.appendChild(uploadBtn);
            }
            img.src = hasPhoto;
            slot.classList.add('has-photo');
        } else {
            slot.innerHTML = '<i class="fas fa-image text-pink-300 text-4xl"></i>';
            slot.appendChild(deleteBtn);
            slot.appendChild(swapBtn);
            slot.appendChild(uploadBtn);
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

// Upload photo
export function uploadPhoto(index) {
    const fileInput = document.getElementById('photoUploadInput');
    
    // Remove old event listener
    const newFileInput = fileInput.cloneNode();
    fileInput.parentNode.replaceChild(newFileInput, fileInput);
    
    // Add new event listener for this specific slot
    newFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log(`📤 Uploading photo for slot ${index}`);
        
        try {
            // Read and crop the image
            const croppedDataUrl = await cropImageToSlot(file, index);
            
            // Save to STATE
            STATE.photos[index] = croppedDataUrl;
            
            // Update UI
            updatePhotoSlots();
            updatePhotoCount();
            
            // Show download/reset buttons
            elements.resetBtn?.classList.remove('hidden');
            elements.downloadBtn?.classList.remove('hidden');
            document.getElementById('changeFrameBtn')?.classList.remove('hidden');
            
            console.log(`✅ Photo uploaded and cropped for slot ${index}`);
        } catch (err) {
            console.error('❌ Error uploading photo:', err);
            alert('Không thể upload ảnh. Vui lòng thử lại!');
        }
        
        // Reset file input
        newFileInput.value = '';
    });
    
    // Trigger file selection
    newFileInput.click();
}

// Crop image to fit slot aspect ratio
async function cropImageToSlot(file, slotIndex) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                // Get target aspect ratio based on layout
                const targetAspectRatio = getSlotAspectRatio();
                
                // Calculate crop dimensions
                const imgAspect = img.width / img.height;
                let cropWidth, cropHeight, cropX, cropY;
                
                if (imgAspect > targetAspectRatio) {
                    // Image wider than target - crop width
                    cropHeight = img.height;
                    cropWidth = cropHeight * targetAspectRatio;
                    cropX = (img.width - cropWidth) / 2;
                    cropY = 0;
                } else {
                    // Image taller than target - crop height
                    cropWidth = img.width;
                    cropHeight = cropWidth / targetAspectRatio;
                    cropX = 0;
                    cropY = (img.height - cropHeight) / 2;
                }
                
                // Create canvas for cropping
                const cropCanvas = document.createElement('canvas');
                const targetWidth = canvas.width || 1280;
                const targetHeight = Math.round(targetWidth / targetAspectRatio);
                
                cropCanvas.width = targetWidth;
                cropCanvas.height = targetHeight;
                
                const ctx = cropCanvas.getContext('2d');
                
                // Draw cropped image
                ctx.drawImage(
                    img,
                    cropX, cropY, cropWidth, cropHeight,
                    0, 0, targetWidth, targetHeight
                );
                
                console.log(`✂️ Cropped image: ${img.width}x${img.height} → ${cropWidth}x${cropHeight} → ${targetWidth}x${targetHeight}`);
                console.log(`📐 Aspect ratio: ${imgAspect.toFixed(2)} → ${targetAspectRatio.toFixed(2)}`);
                
                // Return as data URL
                resolve(cropCanvas.toDataURL('image/png'));
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Get slot aspect ratio based on current layout
function getSlotAspectRatio() {
    switch (STATE.currentLayout) {
        case '1x4':
            return 4 / 3; // 1280x960
        case '2x2':
            return 3 / 4; // 532x705 (portrait)
        case '2x3':
            return 522 / 391; // 522x391 (landscape)
        default:
            return 4 / 3;
    }
}
