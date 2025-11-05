// Main App Entry Point
import { startCamera, toggleFlip, stopCamera, resetPhotos } from './camera.js';
import { singleCapture, autoCapture } from './capture.js';
import { initFilterButtons } from './filters.js';
import { initLayoutButtons } from './layouts.js';
import { deletePhoto, openSwapModal, closeSwapModal, downloadPhotos } from './ui.js';
import { initCameraSelection, refreshCameraList } from './camera-selector.js';
import { openFrameSelector, closeFrameSelector, loadExternalFrames, needsCacheRefresh, forceRedetectLayouts } from './frames/frames.js';
import { loadDefaultFrames } from './default-frames.js';

// Cache DOM elements
const getElements = () => ({
    startCameraBtn: document.getElementById('startCameraBtn'),
    flipCameraBtn: document.getElementById('flipCameraBtn'),
    captureBtn: document.getElementById('captureBtn'),
    autoCaptureBtn: document.getElementById('autoCaptureBtn'),
    resetBtn: document.getElementById('resetBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    changeFrameBtn: document.getElementById('changeFrameBtn'),
    closeFrameBtn: document.getElementById('closeFrameBtn'),
    downloadInModalBtn: document.getElementById('downloadInModalBtn'),
    refreshCameraBtn: document.getElementById('refreshCameraBtn')
});

// Setup event listeners
const setupEventListeners = (elements) => {
    const listeners = [
        [elements.startCameraBtn, 'click', startCamera],
        [elements.flipCameraBtn, 'click', toggleFlip],
        [elements.captureBtn, 'click', singleCapture],
        [elements.autoCaptureBtn, 'click', autoCapture],
        [elements.resetBtn, 'click', resetPhotos],
        [elements.downloadBtn, 'click', downloadPhotos],
        [elements.changeFrameBtn, 'click', openFrameSelector],
        [elements.closeFrameBtn, 'click', closeFrameSelector],
        [elements.downloadInModalBtn, 'click', () => { downloadPhotos(); closeFrameSelector(); }],
        [elements.refreshCameraBtn, 'click', refreshCameraList]
    ];
    
    listeners.forEach(([el, event, handler]) => el?.addEventListener(event, handler));
};

// Load and check frames
const loadFrames = async () => {
    console.log('🎨 Loading frames...');
    
    // Load default frames
    if (loadDefaultFrames()) {
        console.log('✅ Default frames loaded');
    }
    
    // Debug frame counts
    import('./default-frames.js').then(m => {
        const localFrames = localStorage.getItem('photobooth_external_frames');
        const localCount = localFrames ? JSON.parse(localFrames).length : 0;
        console.log(`📊 Frames: default=${m.DEFAULT_FRAMES_JSON.length}, cached=${localCount}`);
        if (localCount < m.DEFAULT_FRAMES_JSON.length) {
            console.warn('⚠️ Cache outdated. Run: localStorage.clear(); location.reload();');
        }
    });
    
    // Load external frames
    const frameCount = await loadExternalFrames();
    console.log(`✅ Loaded ${frameCount} external frames`);
    
    // Check cache freshness
    if (needsCacheRefresh()) {
        console.warn('⚠️ Frame cache >24h old');
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing...');
    
    // Load frames
    await loadFrames();
    
    // Initialize modules
    initFilterButtons();
    initLayoutButtons();
    await initCameraSelection();
    
    // Setup all event listeners
    const elements = getElements();
    setupEventListeners(elements);
    
    // Expose functions globally
    Object.assign(window, {
        deletePhoto,
        openSwapModal,
        closeSwapModal,
        openFrameSelector,
        closeFrameSelector,
        forceRedetectLayouts
    });
    
    console.log('✅ Initialization complete');
    console.log('💡 Debug: window.forceRedetectLayouts()');
    
    // Signal ready and setup cleanup
    window.dispatchEvent(new CustomEvent('appReady'));
    window.addEventListener('beforeunload', stopCamera);
});
