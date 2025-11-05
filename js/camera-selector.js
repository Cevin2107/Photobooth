// Camera Selector Module (Dropdown version)
import { STATE } from './config.js';
import { startCamera, stopCamera } from './camera.js';

// Camera type detection keywords
const CAMERA_TYPES = {
    phone: ['phone', 'mobile', 'android', 'iphone', 'samsung', 'remote', 'link', 'wireless'],
    virtual: ['vmix', 'obs', 'virtual', 'snap', 'manycam', 'xsplit', 'streamlabs', 'droidcam', 'iriun', 'epoccam', 'ndi', 'software'],
    integrated: ['integrated', 'built-in', 'facetime', 'webcam', 'hd webcam', 'laptop', 'internal']
};

// Detect camera type
const detectCameraType = (label) => {
    const lower = label.toLowerCase();
    for (const [type, keywords] of Object.entries(CAMERA_TYPES)) {
        if (keywords.some(keyword => lower.includes(keyword))) return type;
    }
    return 'physical';
};

// Get camera display info
const getCameraDisplay = (camera, index) => {
    const name = camera.label || `Camera ${index + 1}`;
    const type = detectCameraType(name);
    
    const icons = { phone: '📱', virtual: '🎥', integrated: '📹', physical: '📹' };
    const suffix = type === 'virtual' ? ' (Virtual)' : '';
    
    return {
        text: `${icons[type]} ${name}${suffix}`,
        type,
        isPhone: type === 'phone'
    };
};

// Get available cameras
export async function getCameraDevices() {
    try {
        console.log('🔍 Requesting camera permission...');
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: { ideal: 1280 }, height: { ideal: 960 } } 
        });
        
        console.log('✅ Camera permission granted');
        stream.getTracks().forEach(track => track.stop());
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        console.log(`📷 Found ${videoDevices.length} camera(s):`, videoDevices.map(d => d.label));
        return videoDevices;
    } catch (err) {
        console.error('❌ Error getting cameras:', err);
        alert(`Không thể truy cập camera!\n\nLỗi: ${err.message}\n\nVui lòng:\n1. Cho phép truy cập camera\n2. Đóng các app khác đang dùng camera\n3. Reload trang (F5)`);
        return [];
    }
}

// Populate camera dropdown
export async function populateCameraList() {
    const select = document.getElementById('cameraSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Đang tải...</option>';
    
    const cameras = await getCameraDevices();
    select.innerHTML = '<option value="">📷 Chọn camera...</option>';
    
    if (cameras.length === 0) {
        select.innerHTML = '<option value="" disabled>Không tìm thấy camera</option>';
        return;
    }
    
    // Add camera options
    cameras.forEach((camera, index) => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        const display = getCameraDisplay(camera, index);
        option.textContent = display.text;
        if (display.type !== 'physical') {
            option.setAttribute(`data-${display.type}`, 'true');
        }
        select.appendChild(option);
    });
    
    // Auto-select default camera (priority: integrated > physical > virtual/phone)
    if (!STATE.selectedDeviceId && cameras.length > 0) {
        const priority = ['integrated', 'physical', 'virtual', 'phone'];
        let defaultCamera = null;
        
        for (const type of priority) {
            defaultCamera = cameras.find(c => {
                const display = getCameraDisplay(c, 0);
                return display.type === type && (type !== 'phone' || priority.indexOf(type) < 3);
            });
            if (defaultCamera) break;
        }
        
        defaultCamera = defaultCamera || cameras[0];
        select.value = defaultCamera.deviceId;
        STATE.selectedDeviceId = defaultCamera.deviceId;
        await startCamera(defaultCamera.deviceId);
    } else if (STATE.selectedDeviceId) {
        select.value = STATE.selectedDeviceId;
    }
}

// Handle camera selection change
export async function onCameraChange(event) {
    const deviceId = event.target.value;
    
    if (!deviceId) {
        stopCamera();
        const buttons = ['startCameraBtn', 'captureBtn', 'autoCaptureBtn', 'flipCameraBtn'];
        buttons.forEach((id, i) => {
            document.getElementById(id)?.classList.toggle('hidden', i !== 0);
        });
        return;
    }
    
    stopCamera();
    const success = await startCamera(deviceId);
    if (success) STATE.selectedDeviceId = deviceId;
}

// Initialize camera selector
export async function initCameraSelection() {
    const select = document.getElementById('cameraSelect');
    const refreshBtn = document.getElementById('refreshCameraBtn');
    
    select?.addEventListener('change', onCameraChange);
    refreshBtn?.addEventListener('click', populateCameraList);
    
    await populateCameraList();
}

// Refresh camera list
export async function refreshCameraList() {
    await populateCameraList();
}
