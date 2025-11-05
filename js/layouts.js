// Layouts Module
import { STATE } from './config.js';
import { updatePhotoSlots, updatePhotoCount } from './ui.js';

// Cache DOM elements
const elements = {
    photoSlots: document.getElementById('photoSlots'),
    captureBtn: document.getElementById('captureBtn'),
    autoCaptureBtn: document.getElementById('autoCaptureBtn'),
    resetBtn: document.getElementById('resetBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    customTimerInput: document.getElementById('customTimerInput'),
    customTimerValue: document.getElementById('customTimerValue'),
    customTimerBtn: document.getElementById('customTimerBtn'),
    applyCustomBtn: document.getElementById('applyCustomTimer')
};

// Change layout
export function changeLayout(layout, max) {
    STATE.currentLayout = layout;
    STATE.maxPhotos = max;
    STATE.photos = new Array(6).fill(null);
    
    document.body.setAttribute('data-layout', layout);
    elements.photoSlots.className = `layout-${layout}`;
    
    // Show/hide slots based on layout
    document.querySelectorAll('.photo-slot').forEach((slot, index) => {
        slot.classList.toggle('hidden', index >= max);
    });
    
    updatePhotoSlots();
    updatePhotoCount();
    
    // Reset buttons
    elements.captureBtn?.classList.remove('hidden');
    elements.autoCaptureBtn?.classList.remove('hidden');
    elements.resetBtn?.classList.add('hidden');
    elements.downloadBtn?.classList.add('hidden');
}

// Set countdown time
export function setCountdown(seconds) {
    STATE.countdownTime = seconds;
}

// Setup custom timer
const setupCustomTimer = () => {
    elements.customTimerBtn?.addEventListener('click', function() {
        document.querySelectorAll('.layout-option[data-timer], .timer-btn[data-timer]').forEach(b => 
            b.classList.remove('active')
        );
        this.classList.add('active');
        elements.customTimerInput?.classList.remove('hidden');
        elements.customTimerValue?.focus();
    });
    
    elements.applyCustomBtn?.addEventListener('click', () => {
        let seconds = parseInt(elements.customTimerValue.value);
        seconds = Math.max(1, Math.min(60, isNaN(seconds) ? 3 : seconds));
        elements.customTimerValue.value = seconds;
        setCountdown(seconds);
        
        const span = elements.customTimerBtn?.querySelector('span');
        if (span) span.textContent = `${seconds}s`;
        elements.customTimerBtn?.setAttribute('data-custom-value', seconds + 's');
    });
    
    elements.customTimerValue?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') elements.applyCustomBtn?.click();
    });
};

// Initialize layout buttons
export function initLayoutButtons() {
    // Layout selection
    document.querySelectorAll('.layout-option[data-layout]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.layout-option[data-layout]').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            changeLayout(this.dataset.layout, parseInt(this.dataset.max));
        });
    });
    
    // Timer selection (both old and new styles)
    document.querySelectorAll('.layout-option[data-timer], .timer-btn[data-timer]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.layout-option[data-timer], .timer-btn[data-timer], .timer-btn-custom').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            setCountdown(parseInt(this.dataset.timer));
            elements.customTimerInput?.classList.add('hidden');
        });
    });
    
    // Custom timer
    setupCustomTimer();
}
