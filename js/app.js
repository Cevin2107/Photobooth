// Main App Entry Point
import { startCamera, toggleFlip, stopCamera, resetPhotos } from './camera.js';
import { singleCapture, autoCapture } from './capture.js';
import { initFilterButtons } from './filters.js';
import { initLayoutButtons } from './layouts.js';
import { deletePhoto, openSwapModal, closeSwapModal, downloadPhotos } from './ui.js';
import { initCameraSelection, refreshCameraList } from './camera-selector.js';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
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
    
    // Refresh camera list button
    const refreshBtn = document.getElementById('refreshCameraBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshCameraList);
    }
    
    // Make functions available globally for inline handlers
    window.deletePhoto = deletePhoto;
    window.openSwapModal = openSwapModal;
    window.closeSwapModal = closeSwapModal;
    
    // Cleanup on exit
    window.addEventListener('beforeunload', stopCamera);
});
