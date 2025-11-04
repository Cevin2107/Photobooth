// Camera Module
import { STATE } from './config.js';
import { updatePhotoSlots, updatePhotoCount } from './ui.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Start camera (with optional device ID)
export async function startCamera(deviceId = null) {
    try {
        // If called from button click without deviceId, get it from dropdown
        if (!deviceId) {
            const select = document.getElementById('cameraSelect');
            if (select && select.value) {
                deviceId = select.value;
            } else {
                alert('Vui lòng chọn camera từ danh sách!');
                return false;
            }
        }
        
        const constraints = deviceId 
            ? { video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 960 } } }
            : { video: { width: { ideal: 1280 }, height: { ideal: 960 } } };
        
        STATE.stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = STATE.stream;
        
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });
        
        // Save selected device
        if (deviceId) {
            STATE.selectedDeviceId = deviceId;
        }
        
        // Update UI
        document.getElementById('startCameraBtn').classList.add('hidden');
        document.getElementById('captureBtn').classList.remove('hidden');
        document.getElementById('autoCaptureBtn').classList.remove('hidden');
        document.getElementById('flipCameraBtn').classList.remove('hidden');
        
        return true;
    } catch (err) {
        alert('Không thể truy cập camera! Vui lòng cấp quyền.');
        return false;
    }
}

// Flip camera
export function toggleFlip() {
    STATE.isFlipped = !STATE.isFlipped;
    if (STATE.isFlipped) {
        video.classList.add('flipped');
    } else {
        video.classList.remove('flipped');
    }
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
    updatePhotoSlots();
    updatePhotoCount();
    
    document.getElementById('captureBtn').classList.remove('hidden');
    document.getElementById('autoCaptureBtn').classList.remove('hidden');
    document.getElementById('captureBtn').disabled = false;
    document.getElementById('resetBtn').classList.add('hidden');
    document.getElementById('downloadBtn').classList.add('hidden');
}

export { video, canvas, ctx };
