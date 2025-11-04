// Camera Selector Module (Dropdown version)
import { STATE } from './config.js';
import { startCamera, stopCamera } from './camera.js';

// Get available cameras
export async function getCameraDevices() {
    try {
        // Request permission for integrated camera first (no specific facing mode)
        // This will trigger permission dialog but won't auto-connect to phone cameras
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 }, 
                height: { ideal: 960 } 
            } 
        });
        
        // Stop the stream immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        return videoDevices;
    } catch (err) {
        console.error('Error getting camera devices:', err);
        return [];
    }
}

// Detect if it's a phone/mobile camera (Phone Link detection)
function isPhoneCamera(label) {
    const phoneKeywords = [
        'phone', 'mobile', 'android', 'iphone', 'samsung',
        'remote', 'link', 'wireless', 'virtual', 'obs'
    ];
    
    const lowerLabel = label.toLowerCase();
    return phoneKeywords.some(keyword => lowerLabel.includes(keyword));
}

// Detect if it's a virtual/software camera
function isVirtualCamera(label) {
    const virtualKeywords = [
        'vmix', 'obs', 'virtual', 'snap', 'manycam', 
        'xsplit', 'streamlabs', 'droidcam', 'iriun',
        'epoccam', 'ndi', 'software'
    ];
    
    const lowerLabel = label.toLowerCase();
    return virtualKeywords.some(keyword => lowerLabel.includes(keyword));
}

// Detect integrated/built-in camera
function isIntegratedCamera(label) {
    const integratedKeywords = [
        'integrated', 'built-in', 'facetime', 'webcam',
        'hd webcam', 'laptop', 'internal'
    ];
    
    const lowerLabel = label.toLowerCase();
    return integratedKeywords.some(keyword => lowerLabel.includes(keyword));
}

// Populate camera dropdown
export async function populateCameraList() {
    const select = document.getElementById('cameraSelect');
    
    if (!select) return;
    
    // Show loading
    select.innerHTML = '<option value="">Đang tải...</option>';
    
    const cameras = await getCameraDevices();
    
    // Clear and add default option
    select.innerHTML = '<option value="">📷 Chọn camera...</option>';
    
    if (cameras.length === 0) {
        select.innerHTML = '<option value="" disabled>Không tìm thấy camera</option>';
        return;
    }
    
    // Add each camera
    cameras.forEach((camera, index) => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        
        // Get camera name
        let cameraName = camera.label || `Camera ${index + 1}`;
        
        // Add emoji and attributes based on camera type
        if (isPhoneCamera(cameraName)) {
            option.textContent = `📱 ${cameraName}`;
            option.setAttribute('data-phone', 'true');
        } else if (isVirtualCamera(cameraName)) {
            option.textContent = `🎥 ${cameraName} (Virtual)`;
            option.setAttribute('data-virtual', 'true');
        } else if (isIntegratedCamera(cameraName)) {
            option.textContent = `📹 ${cameraName}`;
            option.setAttribute('data-integrated', 'true');
        } else {
            option.textContent = `📹 ${cameraName}`;
        }
        
        select.appendChild(option);
    });
    
    // Auto-select default camera: Prioritize integrated > physical > virtual/phone
    if (!STATE.selectedDeviceId && cameras.length > 0) {
        let defaultCamera = null;
        
        // 1st priority: Integrated camera (laptop built-in)
        defaultCamera = cameras.find(camera => isIntegratedCamera(camera.label));
        
        // 2nd priority: First non-virtual, non-phone camera
        if (!defaultCamera) {
            defaultCamera = cameras.find(camera => 
                !isPhoneCamera(camera.label) && !isVirtualCamera(camera.label)
            );
        }
        
        // 3rd priority: Any camera except phone (to avoid auto-connecting phone)
        if (!defaultCamera) {
            defaultCamera = cameras.find(camera => !isPhoneCamera(camera.label));
        }
        
        // Last resort: First camera
        if (!defaultCamera) {
            defaultCamera = cameras[0];
        }
        
        // Set the dropdown value
        select.value = defaultCamera.deviceId;
        STATE.selectedDeviceId = defaultCamera.deviceId;
        
        // Auto-start the camera
        await startCamera(defaultCamera.deviceId);
    } else if (STATE.selectedDeviceId) {
        // Restore previously selected camera
        select.value = STATE.selectedDeviceId;
    }
}

// Handle camera selection change
export async function onCameraChange(event) {
    const deviceId = event.target.value;
    
    if (!deviceId) {
        // User selected "Choose camera..." option - stop current camera
        stopCamera();
        
        // Show start camera button
        document.getElementById('startCameraBtn').classList.remove('hidden');
        document.getElementById('captureBtn').classList.add('hidden');
        document.getElementById('autoCaptureBtn').classList.add('hidden');
        document.getElementById('flipCameraBtn').classList.add('hidden');
        return;
    }
    
    // Stop current camera if any
    stopCamera();
    
    // Start new camera
    const success = await startCamera(deviceId);
    
    if (success) {
        // Save selection
        STATE.selectedDeviceId = deviceId;
    }
}

// Initialize camera selector
export async function initCameraSelection() {
    const select = document.getElementById('cameraSelect');
    const refreshBtn = document.getElementById('refreshCameraBtn');
    
    if (select) {
        select.addEventListener('change', onCameraChange);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            await populateCameraList();
        });
    }
    
    // Initial populate
    await populateCameraList();
}

// Refresh camera list
export async function refreshCameraList() {
    await populateCameraList();
}
