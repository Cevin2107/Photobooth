// Main App Entry Point
import { startCamera, toggleFlip, stopCamera, resetPhotos } from './camera.js';
import { singleCapture, autoCapture } from './capture.js';
import { initFilterButtons } from './filters.js';
import { initLayoutButtons } from './layouts.js';
import { deletePhoto, openSwapModal, closeSwapModal, downloadPhotos } from './ui.js';
import { initCameraSelection, refreshCameraList } from './camera-selector.js';
import { openFrameSelector, closeFrameSelector, loadExternalFrames, needsCacheRefresh, forceRedetectLayouts } from './frames/frames.js';
import { loadDefaultFrames } from './default-frames.js';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 App.js: Initializing...');
    
    // Load default frames first (if user doesn't have any)
    console.log('🎨 Checking for default frames...');
    const defaultLoaded = loadDefaultFrames();
    if (defaultLoaded) {
        console.log('✅ Default frames loaded from code');
    }
    
    // Debug: Check frame counts
    import('./default-frames.js').then(m => {
        const localFrames = localStorage.getItem('photobooth_external_frames');
        const localCount = localFrames ? JSON.parse(localFrames).length : 0;
        console.log(`📊 Frame count check:`);
        console.log(`  - default-frames.js: ${m.DEFAULT_FRAMES_JSON.length} frames`);
        console.log(`  - localStorage: ${localCount} frames`);
        if (localCount < m.DEFAULT_FRAMES_JSON.length) {
            console.warn(`⚠️ localStorage has fewer frames! Clear localStorage to reload.`);
            console.warn(`💡 Run: localStorage.clear(); location.reload();`);
        }
    });
    
    // Load external frames from cache/localStorage
    console.log('📦 Loading external frames...');
    const frameCount = await loadExternalFrames();
    console.log(`✅ Loaded ${frameCount} external frames`);
    
    // Check if cache needs refresh
    if (needsCacheRefresh()) {
        console.warn('⚠️ Frame cache is old (>24h). Consider refreshing via frame-manager.html');
    }
    
    // Initialize modules
    initFilterButtons();
    initLayoutButtons();
    
    // Initialize camera selection
    await initCameraSelection();
    
    // Camera controls
    document.getElementById('startCameraBtn').addEventListener('click', startCamera);
    document.getElementById('flipCameraBtn').addEventListener('click', toggleFlip);
    document.getElementById('captureBtn').addEventListener('click', singleCapture);
    document.getElementById('autoCaptureBtn').addEventListener('click', autoCapture);
    document.getElementById('resetBtn').addEventListener('click', resetPhotos);
    document.getElementById('downloadBtn').addEventListener('click', downloadPhotos);
    
    // Frame selector button
    const changeFrameBtn = document.getElementById('changeFrameBtn');
    if (changeFrameBtn) {
        changeFrameBtn.addEventListener('click', openFrameSelector);
        console.log('Frame selector button listener added');
    }
    
    // Close frame selector button
    const closeFrameBtn = document.getElementById('closeFrameBtn');
    if (closeFrameBtn) {
        closeFrameBtn.addEventListener('click', closeFrameSelector);
        console.log('Close frame selector button listener added');
    }
    
    // Download in modal button
    const downloadInModalBtn = document.getElementById('downloadInModalBtn');
    if (downloadInModalBtn) {
        downloadInModalBtn.addEventListener('click', () => {
            downloadPhotos();
            closeFrameSelector();
        });
        console.log('Download in modal button listener added');
    }
    
    // Refresh camera list button
    const refreshBtn = document.getElementById('refreshCameraBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshCameraList);
    }
    
    // Make functions available globally for inline handlers
    window.deletePhoto = deletePhoto;
    window.openSwapModal = openSwapModal;
    window.closeSwapModal = closeSwapModal;
    window.openFrameSelector = openFrameSelector;
    window.closeFrameSelector = closeFrameSelector;
    window.forceRedetectLayouts = forceRedetectLayouts; // Debug helper
    
    console.log('App.js: Initialization complete');
    console.log('window.openFrameSelector:', typeof window.openFrameSelector);
    console.log('💡 Debug: Run window.forceRedetectLayouts() to re-detect all frame layouts');
    
    // Dispatch custom event to signal app is ready
    window.dispatchEvent(new CustomEvent('appReady'));
    
    // Cleanup on exit
    window.addEventListener('beforeunload', stopCamera);
});
