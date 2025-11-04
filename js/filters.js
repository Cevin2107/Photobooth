// Filters Module
import { STATE, CONFIG } from './config.js';
import { video } from './camera.js';

// Set filter
export function setFilter(filterName) {
    STATE.currentFilter = filterName;
    
    // Update active button (support all filter styles)
    document.querySelectorAll('.filter-btn, .filter-compact-item, .modern-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const filterElement = document.querySelector(`[data-filter="${filterName}"]`);
    if (filterElement) {
        filterElement.classList.add('active');
    }
    
    // Apply filter to video preview
    video.style.filter = CONFIG.filters[filterName].filter || 'none';
}

// Initialize filter buttons
export function initFilterButtons() {
    // Old style filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterName = this.dataset.filter;
            setFilter(filterName);
        });
    });
    
    // Compact filter items
    document.querySelectorAll('.filter-compact-item').forEach(item => {
        item.addEventListener('click', function() {
            const filterName = this.dataset.filter;
            setFilter(filterName);
        });
    });
    
    // Modern filter buttons
    document.querySelectorAll('.modern-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterName = this.dataset.filter;
            setFilter(filterName);
        });
    });
}
