// Frames Module
import { STATE } from '../config.js';
import { FRAME_POSITIONS_1X4, STANDARD_CONFIG_1X4 } from './frame-positions-1x4.js';
import { FRAME_POSITIONS_2X2, STANDARD_CONFIG_2X2 } from './frame-positions-2x2.js';
import { FRAME_POSITIONS_2X3, STANDARD_CONFIG_2X3 } from './frame-positions-2x3.js';

/**
 * ============================================================================
 * 📐 FRAME POSITIONS CONFIGURATION - MULTI LAYOUT SUPPORT
 * ============================================================================
 * 
 * Hệ thống hỗ trợ 3 loại layout:
 * - 1x4: Frame chiều dọc với 4 slots (1181 x 2512 px)
 * - 2x2: Frame 4 slots 2 cột x 2 hàng (1140 x 1613 px)
 * - 2x3: Frame 6 slots 2 cột x 3 hàng (1120 x 1368 px)
 * 
 * Để update positions:
 * 1. Mở tool tương ứng trong tools/frame-detector/
 *    - detector-1x4.html (cho frames 1x4)
 *    - detector-2x2.html (cho frames 2x2)
 *    - detector-2x3.html (cho frames 2x3)
 * 2. Tool sẽ tự động filter frames theo kích thước
 * 3. Detect hoặc manual edit positions
 * 4. Copy JSON result
 * 5. Paste vào file tương ứng:
 *    - frame-positions-1x4.js
 *    - frame-positions-2x2.js
 *    - frame-positions-2x3.js
 * ============================================================================
 */

/**
 * Detect layout from image dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Layout type: '1x4', '2x2', '2x3', or '1x4' (default)
 */
export function detectLayoutFromDimensions(width, height) {
    const aspectRatio = width / height;
    
    // 2x2 layout: ~1140x1613 (aspect ratio ~0.707, tolerance ±10%)
    // Check both exact dimensions and aspect ratio
    const ratio_2x2 = 1140 / 1613; // ~0.707
    if (
        (Math.abs(width - 1140) <= 100 && Math.abs(height - 1613) <= 100) ||
        (Math.abs(aspectRatio - ratio_2x2) <= 0.07 && width > 500 && height > 700 && height > width)
    ) {
        console.log(`  ✅ Detected 2x2: ${width}x${height} (ratio: ${aspectRatio.toFixed(3)})`);
        return '2x2';
    }
    
    // 2x3 layout: ~1120x1368 (aspect ratio ~0.819, tolerance ±10%)
    const ratio_2x3 = 1120 / 1368; // ~0.819
    if (
        (Math.abs(width - 1120) <= 100 && Math.abs(height - 1368) <= 100) ||
        (Math.abs(aspectRatio - ratio_2x3) <= 0.08 && width > 500 && height > 600 && height > width)
    ) {
        console.log(`  ✅ Detected 2x3: ${width}x${height} (ratio: ${aspectRatio.toFixed(3)})`);
        return '2x3';
    }
    
    // 1x4 layout: Vertical frames (height > width && height > 2000)
    // Or very tall aspect ratio (height/width > 2.5)
    if ((height > width && height > 2000) || (aspectRatio < 0.5 && height > 1500)) {
        console.log(`  ✅ Detected 1x4: ${width}x${height} (ratio: ${aspectRatio.toFixed(3)})`);
        return '1x4';
    }
    
    // Default: Check which ratio is closest
    const ratios = {
        '2x2': Math.abs(aspectRatio - ratio_2x2),
        '2x3': Math.abs(aspectRatio - ratio_2x3),
        '1x4': Math.abs(aspectRatio - 0.4) // Typical 1x4 ratio
    };
    
    const closest = Object.entries(ratios).reduce((a, b) => a[1] < b[1] ? a : b)[0];
    console.log(`  ⚠️ No exact match for ${width}x${height} (ratio: ${aspectRatio.toFixed(3)}), closest: ${closest}`);
    
    return closest;
}

/**
 * Load image and detect its layout
 * @param {string} url - Image URL
 * @returns {Promise<string>} Layout type
 */
export function detectLayoutFromImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const layout = detectLayoutFromDimensions(img.width, img.height);
            resolve(layout);
        };
        img.onerror = () => {
            console.warn(`Failed to load image for layout detection: ${url}`);
            resolve('1x4'); // Default fallback
        };
        img.src = url;
    });
}

// Frame configurations
export const FRAMES = {
    none: {
        name: 'Không khung',
        image: null,
        layout: 'all'
    }
};

// Load external frames from localStorage cache
export async function loadExternalFrames() {
    try {
        const cached = localStorage.getItem('photobooth_external_frames');
        if (cached) {
            const externalFrames = JSON.parse(cached);
            console.log(`✅ Loading ${externalFrames.length} external frames from cache`);
            
            // Detect layout for frames that don't have it
            const framesToProcess = [];
            for (const frame of externalFrames) {
                if (!frame.layout) {
                    framesToProcess.push(
                        detectLayoutFromImage(frame.url)
                            .then(layout => {
                                frame.layout = layout;
                                return frame;
                            })
                            .catch(error => {
                                console.error(`❌ Failed to detect layout for ${frame.name}:`, error);
                                frame.layout = '1x4'; // Default fallback
                                return frame;
                            })
                    );
                } else {
                    framesToProcess.push(Promise.resolve(frame));
                }
            }
            
            // Wait for all layout detections to complete
            const processedFrames = await Promise.all(framesToProcess);
            
            console.log(`✅ Processed ${processedFrames.length} frames (started with ${externalFrames.length})`);
            
            // Update localStorage with detected layouts
            localStorage.setItem('photobooth_external_frames', JSON.stringify(processedFrames));
            
            // Merge external frames into FRAMES object with proper format
            processedFrames.forEach((frame, index) => {
                const frameKey = `external_${index}`;
                
                const layout = frame.layout || '1x4';
                
                // Get positions from appropriate config based on layout
                let positionConfig;
                if (layout === '2x2') {
                    positionConfig = FRAME_POSITIONS_2X2[frame.url] || STANDARD_CONFIG_2X2;
                } else if (layout === '2x3') {
                    positionConfig = FRAME_POSITIONS_2X3[frame.url] || STANDARD_CONFIG_2X3;
                } else {
                    // Default to 1x4
                    positionConfig = FRAME_POSITIONS_1X4[frame.url] || STANDARD_CONFIG_1X4;
                }
                
                FRAMES[frameKey] = {
                    name: frame.name || `Frame ${index + 1}`,
                    image: frame.url,
                    layout: layout,
                    photoSize: positionConfig.photoSize,
                    positions: positionConfig.positions,
                    isExternal: true // Mark as external frame
                };
            });
            
            console.log(`✅ Loaded ${processedFrames.length} external frames (total frames: ${Object.keys(FRAMES).length})`);
            
            // Log layout distribution
            const layoutCounts = processedFrames.reduce((acc, f) => {
                acc[f.layout] = (acc[f.layout] || 0) + 1;
                return acc;
            }, {});
            console.log(`📊 Layout distribution:`, layoutCounts);
            
            return processedFrames.length;
        } else {
            console.warn('⚠️ No external frames in cache. Use frame-manager.html to import.');
        }
    } catch (error) {
        console.error('❌ Error loading external frames:', error);
    }
    return 0;
}

// Force re-detect all frame layouts
export async function forceRedetectLayouts() {
    try {
        const cached = localStorage.getItem('photobooth_external_frames');
        if (!cached) {
            console.warn('No frames in cache to re-detect');
            return;
        }
        
        const frames = JSON.parse(cached);
        console.log(`🔄 Re-detecting layouts for ${frames.length} frames...`);
        
        // Clear FRAMES object (except 'none')
        Object.keys(FRAMES).forEach(key => {
            if (key !== 'none') delete FRAMES[key];
        });
        
        // Re-detect layouts
        for (const frame of frames) {
            const layout = await detectLayoutFromImage(frame.url);
            frame.layout = layout;
            console.log(`  ✅ ${frame.name}: ${layout}`);
        }
        
        // Save back to localStorage
        localStorage.setItem('photobooth_external_frames', JSON.stringify(frames));
        
        console.log('✅ Re-detection complete! Reloading frames...');
        
        // Reload frames
        await loadExternalFrames();
        
        return frames;
    } catch (error) {
        console.error('❌ Error re-detecting layouts:', error);
    }
}

// Check if cache needs refresh (older than 24 hours)
export function needsCacheRefresh() {
    try {
        const timestamp = localStorage.getItem('photobooth_external_frames_timestamp');
        if (!timestamp) return true;
        
        const age = Date.now() - parseInt(timestamp);
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours
        
        return age > oneDay;
    } catch (error) {
        return true;
    }
}

// Get frames for current layout
export function getFramesForLayout(layout) {
    const allFrames = Object.entries(FRAMES);
    console.log(`🔍 Filtering frames for layout: ${layout}, Total frames: ${allFrames.length}`);
    
    // Log all frames with their layouts
    allFrames.forEach(([key, frame]) => {
        console.log(`  📋 ${key}: ${frame.name} (layout: ${frame.layout})`);
    });
    
    const filtered = allFrames
        .filter(([key, frame]) => {
            const matches = frame.layout === 'all' || frame.layout === layout;
            return matches;
        })
        .map(([key, frame]) => ({ key, ...frame }));
    
    console.log(`✅ Found ${filtered.length} frames for layout ${layout}`);
    
    // If no frames found for this layout, show warning and return all frames
    if (filtered.length === 0) {
        console.warn(`⚠️ No frames found for layout ${layout}. Showing all frames as fallback.`);
        console.warn(`💡 Tip: Clear localStorage and reload to re-detect frame layouts.`);
        return allFrames.map(([key, frame]) => ({ key, ...frame }));
    }
    
    return filtered;
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
    
    // Load frame image with CORS support
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous"; // Fix CORS issue for external images
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
