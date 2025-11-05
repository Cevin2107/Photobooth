// Layouts Module
import { STATE } from './config.js';
import { updatePhotoSlots, updatePhotoCount } from './ui.js';

// Change layout
export function changeLayout(layout, max) {
    STATE.currentLayout = layout;
    STATE.maxPhotos = max;
    
    // Reset photos array
    STATE.photos = new Array(6).fill(null);
    
    // Update body data-layout for CSS targeting
    document.body.setAttribute('data-layout', layout);
    
    // Update grid class
    const photoSlots = document.getElementById('photoSlots');
    photoSlots.className = `layout-${layout}`;
    
    // Show/hide slots based on layout
    const allSlots = document.querySelectorAll('.photo-slot');
    allSlots.forEach((slot, index) => {
        if (index < max) {
            slot.classList.remove('hidden');
        } else {
            slot.classList.add('hidden');
        }
    });
    
    // Update UI
    updatePhotoSlots();
    updatePhotoCount();
    
    // Reset buttons
    document.getElementById('captureBtn').classList.remove('hidden');
    document.getElementById('autoCaptureBtn').classList.remove('hidden');
    document.getElementById('resetBtn').classList.add('hidden');
    document.getElementById('downloadBtn').classList.add('hidden');
}

// Set countdown time
export function setCountdown(seconds) {
    STATE.countdownTime = seconds;
}

// Initialize layout buttons
export function initLayoutButtons() {
    // Layout selection
    document.querySelectorAll('.layout-option[data-layout]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.layout-option[data-layout]').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            
            const layout = this.dataset.layout;
            const max = parseInt(this.dataset.max);
            changeLayout(layout, max);
        });
    });
    
    // Timer selection - support both old and new styles
    document.querySelectorAll('.layout-option[data-timer], .timer-btn[data-timer]').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from both types
            document.querySelectorAll('.layout-option[data-timer], .timer-btn[data-timer], .timer-btn-custom').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            
            const seconds = parseInt(this.dataset.timer);
            setCountdown(seconds);
            
            // Hide custom timer input
            const customInput = document.getElementById('customTimerInput');
            if (customInput) {
                customInput.classList.add('hidden');
            }
        });
    });
    
    // Custom timer button
    const customTimerBtn = document.getElementById('customTimerBtn');
    if (customTimerBtn) {
        customTimerBtn.addEventListener('click', function() {
            // Remove active from all timer buttons
            document.querySelectorAll('.layout-option[data-timer], .timer-btn[data-timer]').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            
            // Show custom timer input
            const customInput = document.getElementById('customTimerInput');
            if (customInput) {
                customInput.classList.remove('hidden');
                document.getElementById('customTimerValue').focus();
            }
        });
    }
    
    // Apply custom timer
    const applyCustomBtn = document.getElementById('applyCustomTimer');
    if (applyCustomBtn) {
        applyCustomBtn.addEventListener('click', function() {
            const input = document.getElementById('customTimerValue');
            let seconds = parseInt(input.value);
            
            // Validate input
            if (isNaN(seconds) || seconds < 1) {
                seconds = 3;
                input.value = 3;
            } else if (seconds > 60) {
                seconds = 60;
                input.value = 60;
            }
            
            setCountdown(seconds);
            
            // Update custom button display
            const customBtn = document.getElementById('customTimerBtn');
            if (customBtn) {
                customBtn.setAttribute('data-custom-value', seconds + 's');
                const span = customBtn.querySelector('span');
                if (span) {
                    span.textContent = `${seconds}s`;
                }
            }
        });
    }
    
    // Allow Enter key to apply custom timer
    const customInput = document.getElementById('customTimerValue');
    if (customInput) {
        customInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('applyCustomTimer').click();
            }
        });
    }
}
