// Camera Module
import { STATE } from './config.js';
import { updatePhotoSlots, updatePhotoCount } from './ui.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Cache button elements
const buttons = {
    start: document.getElementById('startCameraBtn'),
    capture: document.getElementById('captureBtn'),
    autoCapture: document.getElementById('autoCaptureBtn'),
    flip: document.getElementById('flipCameraBtn'),
    reset: document.getElementById('resetBtn'),
    download: document.getElementById('downloadBtn'),
    changeFrame: document.getElementById('changeFrameBtn')
};

// Toggle button visibility
const toggleButtons = (show, hide) => {
    show.forEach(btn => btn?.classList.remove('hidden'));
    hide.forEach(btn => btn?.classList.add('hidden'));
};

// Start camera (with optional device ID)
export async function startCamera(deviceId = null) {
    try {
        console.log('📹 Starting camera...', deviceId ? `Device: ${deviceId}` : 'Default');
        
        // Get device ID from dropdown if not provided
        if (!deviceId) {
            const select = document.getElementById('cameraSelect');
            deviceId = select?.value;
            if (!deviceId) {
                alert('Vui lòng chọn camera từ danh sách!');
                return false;
            }
        }
        
        const constraints = {
            video: deviceId 
                ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 960 } }
                : { width: { ideal: 1280 }, height: { ideal: 960 } }
        };
        
        console.log('🎥 Requesting stream:', constraints);
        
        STATE.stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = STATE.stream;
        
        console.log('✅ Camera stream obtained');
        
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            console.log(`📐 Video: ${video.videoWidth}x${video.videoHeight}`);
        });
        
        if (deviceId) STATE.selectedDeviceId = deviceId;
        
        // Update UI
        toggleButtons(
            [buttons.capture, buttons.autoCapture, buttons.flip],
            [buttons.start]
        );
        
        return true;
    } catch (err) {
        console.error('❌ Camera error:', err);
        alert(`Không thể truy cập camera!\n\nLỗi: ${err.name} - ${err.message}\n\nVui lòng:\n1. Cho phép truy cập camera\n2. Đóng app khác đang dùng camera\n3. Thử lại`);
        return false;
    }
}

// Flip camera
export function toggleFlip() {
    STATE.isFlipped = !STATE.isFlipped;
    video.classList.toggle('flipped', STATE.isFlipped);
}

// Stop camera
export function stopCamera() {
    if (STATE.stream) {
        STATE.stream.getTracks().forEach(track => track.stop());
        STATE.stream = null;
    }
}

// Reset photos
export function resetPhotos() {
    STATE.photos = [null, null, null, null, null, null];
    STATE.selectedFrame = 'none';
    updatePhotoSlots();
    updatePhotoCount();
    
    buttons.capture.disabled = false;
    toggleButtons(
        [buttons.capture, buttons.autoCapture],
        [buttons.reset, buttons.download, buttons.changeFrame]
    );
}

export { video, canvas, ctx };
