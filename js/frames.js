// Frames Module
import { STATE } from './config.js';

// Frame configurations
export const FRAMES = {
    none: {
        name: 'Không khung',
        image: null,
        layout: 'all'
    },
    frame1: {
        name: 'Khung Classic',
        image: 'frames/68df42a174a8d.png',
        layout: '1x4',
        photoSize: {
            width: 771,
            height: 565
        },
        positions: [
            { x: 0, y: 64, centerX: true },      // Ảnh 1: cách top 64px
            { x: 0, y: 676, centerX: true },     // Ảnh 2: 64 + 565 + 47 = 676
            { x: 0, y: 1288, centerX: true },    // Ảnh 3: 676 + 565 + 47 = 1288
            { x: 0, y: 1900, centerX: true }     // Ảnh 4: 1288 + 565 + 47 = 1900
        ]
    },
    frame2: {
        name: 'Khung Style 2',
        image: 'frames/68df41df4934f.png',
        layout: '1x4',
        photoSize: {
            width: 771,
            height: 565
        },
        positions: [
            { x: 0, y: 64, centerX: true },      // Ảnh 1
            { x: 0, y: 676, centerX: true },     // Ảnh 2
            { x: 0, y: 1288, centerX: true },    // Ảnh 3
            { x: 0, y: 1900, centerX: true }     // Ảnh 4
        ]
    }
    // Có thể thêm nhiều frame khác ở đây
};

// Get frames for current layout
export function getFramesForLayout(layout) {
    return Object.entries(FRAMES)
        .filter(([key, frame]) => frame.layout === 'all' || frame.layout === layout)
        .map(([key, frame]) => ({ key, ...frame }));
}

// Open frame selector modal
export function openFrameSelector() {
    console.log('Opening frame selector for layout:', STATE.currentLayout);
    
    const modal = document.getElementById('frameModal');
    if (!modal) {
        console.error('Frame modal not found!');
        return;
    }
    
    const container = document.getElementById('frameOptions');
    if (!container) {
        console.error('Frame options container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    const availableFrames = getFramesForLayout(STATE.currentLayout);
    console.log('Available frames:', availableFrames);
    
    availableFrames.forEach(frame => {
        const btn = document.createElement('button');
        btn.className = 'frame-option-btn';
        
        if (frame.key === STATE.selectedFrame) {
            btn.classList.add('active');
        }
        
        if (frame.image) {
            const img = document.createElement('img');
            img.src = frame.image;
            img.alt = frame.name;
            btn.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.className = 'frame-no-frame';
            icon.innerHTML = '<i class="fas fa-ban"></i>';
            btn.appendChild(icon);
        }
        
        const label = document.createElement('span');
        label.textContent = frame.name;
        btn.appendChild(label);
        
        btn.onclick = () => selectFrame(frame.key);
        
        container.appendChild(btn);
    });
    
    modal.classList.add('active');
    console.log('Frame modal opened');
    
    // Generate initial preview
    updatePreview();
}

// Close frame selector modal
export function closeFrameSelector() {
    const modal = document.getElementById('frameModal');
    modal.classList.remove('active');
}

// Select a frame
export function selectFrame(frameKey) {
    console.log('Selected frame:', frameKey);
    STATE.selectedFrame = frameKey;
    
    // Update active state
    document.querySelectorAll('.frame-option-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected frame
    const selectedBtn = Array.from(document.querySelectorAll('.frame-option-btn')).find(btn => {
        return btn.querySelector('img')?.src.includes(FRAMES[frameKey]?.image) || 
               (frameKey === 'none' && btn.querySelector('.frame-no-frame'));
    });
    
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Update preview
    updatePreview();
}

// Update preview with selected frame
async function updatePreview() {
    const previewContainer = document.getElementById('framePreview');
    if (!previewContainer) {
        console.error('Preview container not found');
        return;
    }
    
    // Show loading
    previewContainer.innerHTML = '<div style="padding: 20px; text-align: center;">⏳ Đang tạo preview...</div>';
    
    try {
        // Get camera canvas size
        const canvas = document.getElementById('canvas');
        const cellWidth = canvas.width;
        const cellHeight = canvas.height;
        
        // Generate preview
        const previewCanvas = await applyFrameAndDownload(
            STATE.photos,
            STATE.currentLayout,
            cellWidth,
            cellHeight
        );
        
        // Display preview
        const previewImg = document.createElement('img');
        previewImg.src = previewCanvas.toDataURL('image/png');
        previewImg.style.maxWidth = '100%';
        previewImg.style.borderRadius = '8px';
        previewImg.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        previewImg.style.transform = 'none'; // Ensure no flip
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(previewImg);
    } catch (error) {
        console.error('Error generating preview:', error);
        previewContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">❌ Lỗi tạo preview</div>';
    }
}

// Apply frame to photos and create final image
export async function applyFrameAndDownload(photos, layout, cellWidth, cellHeight) {
    const frame = FRAMES[STATE.selectedFrame];
    
    // If no frame selected or frame doesn't exist, return simple grid
    if (!frame || !frame.image || frame.key === 'none') {
        return createSimpleGrid(photos, layout, cellWidth, cellHeight);
    }
    
    // Load frame image
    const frameImg = new Image();
    try {
        await new Promise((resolve, reject) => {
            frameImg.onload = resolve;
            frameImg.onerror = reject;
            frameImg.src = frame.image;
        });
    } catch (error) {
        console.error('Cannot load frame image, using simple grid:', error);
        return createSimpleGrid(photos, layout, cellWidth, cellHeight);
    }
    
    // Create canvas with frame size
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = frameImg.width;
    finalCanvas.height = frameImg.height;
    const ctx = finalCanvas.getContext('2d');
    
    // Draw white background first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    // Get photo size from frame config or use default
    const photoWidth = frame.photoSize?.width || cellWidth;
    const photoHeight = frame.photoSize?.height || cellHeight;
    
    console.log('Frame size:', finalCanvas.width, 'x', finalCanvas.height);
    console.log('Photo size:', photoWidth, 'x', photoHeight);
    
    // Draw photos FIRST (at the bottom layer)
    const validPhotos = photos.filter(p => p !== null);
    
    for (let i = 0; i < validPhotos.length && i < frame.positions.length; i++) {
        const img = new Image();
        img.src = validPhotos[i];
        
        await new Promise(resolve => {
            img.onload = () => {
                const pos = frame.positions[i];
                let x = pos.x;
                const y = pos.y;
                
                // Center horizontally if specified
                if (pos.centerX) {
                    x = (finalCanvas.width - photoWidth) / 2;
                }
                
                console.log(`Photo ${i+1} position: x=${x}, y=${y}, w=${photoWidth}, h=${photoHeight}`);
                
                // Draw photo at the bottom
                ctx.drawImage(img, x, y, photoWidth, photoHeight);
                resolve();
            };
        });
    }
    
    // Draw frame LAST (on top layer) - this allows frame decorations to overlap photos
    ctx.drawImage(frameImg, 0, 0);
    
    return finalCanvas;
}

// Create simple grid without frame
async function createSimpleGrid(photos, layout, cellWidth, cellHeight) {
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');
    
    // Set canvas size based on layout
    if (layout === '1x4') {
        combinedCanvas.width = cellWidth;
        combinedCanvas.height = cellHeight * 4;
    } else if (layout === '2x2') {
        combinedCanvas.width = cellWidth * 2;
        combinedCanvas.height = cellHeight * 2;
    } else if (layout === '2x3') {
        combinedCanvas.width = cellWidth * 3;
        combinedCanvas.height = cellHeight * 2;
    }
    
    // Background
    combinedCtx.fillStyle = '#ffe4f0';
    combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    
    // Add photos
    const validPhotos = photos.filter(p => p !== null);
    for (let i = 0; i < validPhotos.length; i++) {
        const img = new Image();
        img.src = validPhotos[i];
        await new Promise(resolve => {
            img.onload = () => {
                let x, y;
                
                if (layout === '1x4') {
                    x = 0;
                    y = i * cellHeight;
                } else if (layout === '2x2') {
                    x = (i % 2) * cellWidth;
                    y = Math.floor(i / 2) * cellHeight;
                } else if (layout === '2x3') {
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
    
    return combinedCanvas;
}
