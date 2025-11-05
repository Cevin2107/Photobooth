// Filters Module
import { STATE, CONFIG } from './config.js';
import { video } from './camera.js';

// Set filter
export function setFilter(filterName) {
    STATE.currentFilter = filterName;
    
    // Update active button (all filter button styles)
    const filterElements = document.querySelectorAll('.filter-btn, .filter-compact-item, .modern-filter-btn');
    filterElements.forEach(btn => btn.classList.remove('active'));
    
    const activeElement = document.querySelector(`[data-filter="${filterName}"]`);
    activeElement?.classList.add('active');
    
    // Apply filter to video preview
    video.style.filter = CONFIG.filters[filterName].filter || 'none';
}

// Initialize filter buttons
export function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn, .filter-compact-item, .modern-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}
