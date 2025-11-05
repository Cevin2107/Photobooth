// Configuration & State
const CONFIG = {
    filters: {
        none: {},
        grayscale: { filter: 'grayscale(100%)' },
        sepia: { filter: 'sepia(100%)' },
        warm: { filter: 'sepia(30%) saturate(1.4) brightness(1.1)' },
        cool: { filter: 'hue-rotate(180deg) saturate(1.2)' },
        vintage: { filter: 'sepia(50%) contrast(1.2) brightness(0.9)' }
    },
    defaultCountdown: 3,
    defaultLayout: '1x4',
    defaultMaxPhotos: 4
};

const STATE = {
    stream: null,
    photos: [null, null, null, null, null, null],
    currentFilter: 'none',
    countdownTime: CONFIG.defaultCountdown,
    maxPhotos: CONFIG.defaultMaxPhotos,
    currentLayout: CONFIG.defaultLayout,
    isAutoCapture: false,
    isCapturing: false,
    isFlipped: false,
    swapFromIndex: null,
    selectedDeviceId: null,
    selectedFrame: 'none'
};

export { CONFIG, STATE };
