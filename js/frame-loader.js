// Frame Loader Module - Load frames from external source
import { FRAMES } from './frames.js';

const CACHE_KEY = 'photobooth_external_frames';
const CACHE_TIMESTAMP_KEY = 'photobooth_external_frames_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// External frame source configuration
const EXTERNAL_SOURCES = {
    freehihi: {
        name: 'FreeHiHi Frames',
        apiEndpoints: [
            'https://photo.freehihi.com/api/frames',
            'https://cdn.freehihi.com/frames.json',
            'https://photo.freehihi.com/api/v1/frames'
        ],
        enabled: true
    }
};

// Load frames from cache or fetch new ones
export async function loadExternalFrames() {
    try {
        // Check cache first
        const cachedFrames = getCachedFrames();
        if (cachedFrames) {
            console.log('✅ Loaded frames from cache');
            return cachedFrames;
        }

        // If no cache or expired, fetch new frames
        console.log('🔄 Fetching new frames...');
        const frames = await fetchFramesFromSource();
        
        // Cache the frames
        cacheFrames(frames);
        
        return frames;
    } catch (error) {
        console.error('❌ Error loading external frames:', error);
        return [];
    }
}

// Get cached frames if valid
function getCachedFrames() {
    try {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();
        
        // Check if cache is still valid (within 1 hour)
        if (timestamp && (now - parseInt(timestamp)) < CACHE_DURATION) {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// Cache frames to localStorage
function cacheFrames(frames) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(frames));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log('✅ Frames cached successfully');
    } catch (error) {
        console.error('Error caching frames:', error);
    }
}

// Fetch frames from source
async function fetchFramesFromSource() {
    // Try API endpoints first
    for (const endpoint of EXTERNAL_SOURCES.freehihi.apiEndpoints) {
        try {
            console.log(`🔍 Trying API: ${endpoint}`);
            const response = await fetch(endpoint, {
                mode: 'cors',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Got data from ${endpoint}:`, data);
                
                // Try to parse different response formats
                let frames = [];
                
                // Format 1: Direct array
                if (Array.isArray(data)) {
                    frames = data.map((item, index) => ({
                        id: `freehihi_${index + 1}`,
                        name: item.name || item.title || item.alt || `Frame ${index + 1}`,
                        url: item.url || item.src || item.image,
                        layout: item.layout || '1x4',
                        source: 'freehihi'
                    }));
                }
                // Format 2: Object with frames property
                else if (data.frames && Array.isArray(data.frames)) {
                    frames = data.frames.map((item, index) => ({
                        id: `freehihi_${index + 1}`,
                        name: item.name || item.title || item.alt || `Frame ${index + 1}`,
                        url: item.url || item.src || item.image,
                        layout: item.layout || '1x4',
                        source: 'freehihi'
                    }));
                }
                // Format 3: Object with data property
                else if (data.data && Array.isArray(data.data)) {
                    frames = data.data.map((item, index) => ({
                        id: `freehihi_${index + 1}`,
                        name: item.name || item.title || item.alt || `Frame ${index + 1}`,
                        url: item.url || item.src || item.image,
                        layout: item.layout || '1x4',
                        source: 'freehihi'
                    }));
                }
                
                if (frames.length > 0) {
                    console.log(`✅ Parsed ${frames.length} frames from API`);
                    return frames;
                }
            }
        } catch (error) {
            console.log(`❌ Failed to fetch from ${endpoint}:`, error.message);
        }
    }
    
    // If all API endpoints fail, use manual list as fallback
    console.log('⚠️ All API endpoints failed. Using manual list as fallback.');
    return await fetchManualFrameList();
}

// Manual frame list (you can update this)
async function fetchManualFrameList() {
    // This list can be updated manually or via a backend API
    const manualFrames = [
        {
            id: 'freehihi_1',
            name: 'Basic-11 (gốc)',
            url: 'https://cdn.freehihi.com/68df4242dfa05.png',
            layout: '1x4',
            source: 'freehihi'
        },
        {
            id: 'freehihi_2',
            name: 'Frame Style 2',
            url: 'https://cdn.freehihi.com/68df42a174a8d.png',
            layout: '1x4',
            source: 'freehihi'
        },
        {
            id: 'freehihi_3',
            name: 'Frame Style 3',
            url: 'https://cdn.freehihi.com/68df41df4934f.png',
            layout: '1x4',
            source: 'freehihi'
        }
        // Add more frames here...
    ];
    
    return manualFrames;
}

// Parse frame configuration from external frame
export async function parseFrameConfig(frameUrl) {
    // Load the image to get dimensions
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Assuming 1x4 layout with standard sizing
            const config = {
                photoSize: {
                    width: 771,
                    height: 565
                },
                positions: [
                    { x: 0, y: 64, centerX: true },
                    { x: 0, y: 676, centerX: true },
                    { x: 0, y: 1288, centerX: true },
                    { x: 0, y: 1900, centerX: true }
                ]
            };
            
            resolve(config);
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load frame image'));
        };
        
        img.src = frameUrl;
    });
}

// Convert external frame to internal FRAMES format
export async function convertExternalFrameToInternal(externalFrame) {
    try {
        const config = await parseFrameConfig(externalFrame.url);
        
        return {
            name: externalFrame.name,
            image: externalFrame.url,
            layout: externalFrame.layout || '1x4',
            photoSize: config.photoSize,
            positions: config.positions
        };
    } catch (error) {
        console.error('Error converting frame:', error);
        return null;
    }
}

// Initialize external frames and merge with local frames
export async function initializeFrames() {
    try {
        const externalFrames = await loadExternalFrames();
        
        // Convert and add to FRAMES object
        for (const extFrame of externalFrames) {
            const converted = await convertExternalFrameToInternal(extFrame);
            if (converted) {
                FRAMES[extFrame.id] = converted;
            }
        }
        
        console.log(`✅ Loaded ${externalFrames.length} external frames`);
        return externalFrames.length;
    } catch (error) {
        console.error('Error initializing frames:', error);
        return 0;
    }
}

// Refresh frames cache
export async function refreshFramesCache() {
    console.log('🔄 Refreshing frames cache...');
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    return await loadExternalFrames();
}

// Auto-refresh frames every hour
export function startAutoRefresh() {
    // Refresh on page load
    loadExternalFrames();
    
    // Set up interval to refresh every hour
    setInterval(async () => {
        console.log('⏰ Auto-refreshing frames...');
        await refreshFramesCache();
        
        // Reload frames into FRAMES object
        await initializeFrames();
    }, CACHE_DURATION);
    
    console.log('✅ Auto-refresh enabled (every 1 hour)');
}

// Helper: Import frames from a list of URLs (for manual updates)
export async function importFramesFromList(frameUrls) {
    const frames = frameUrls.map((url, index) => ({
        id: `imported_${Date.now()}_${index}`,
        name: `Frame ${index + 1}`,
        url: url,
        layout: '1x4',
        source: 'manual'
    }));
    
    cacheFrames(frames);
    console.log(`✅ Imported ${frames.length} frames`);
    
    return frames;
}
