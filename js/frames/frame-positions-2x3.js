/**
 * ============================================================================
 * 📐 FRAME POSITIONS - LAYOUT 2x3
 * ============================================================================
 * 
 * Frame dimensions: 1120 x 1368 px (hoặc lớn hơn với cùng aspect ratio ~0.819)
 * Photo slots: 6 slots (2 columns x 3 rows)
 * Photo size: 522 x 391 px (landscape/ngang)
 * 
 * Để update positions:
 * 1. Mở tools/frame-detector/detector-2x3.html
 * 2. Detect hoặc manual edit
 * 3. Copy JSON result
 * 4. Paste vào FRAME_POSITIONS_2X3 bên dưới
 * 
 * ⚠️ QUAN TRỌNG: Khi paste JSON từ detector:
 *    - Paste trực tiếp vào trong dấu { } của FRAME_POSITIONS_2X3
 *    - KHÔNG paste cả dòng "export const FRAME_POSITIONS_2X3 = { }"
 *    - Chỉ paste nội dung bên trong (các frame URLs và positions)
 * ============================================================================
 */

export const FRAME_POSITIONS_2X3 = {
    // Paste detected positions here
    // Example:
    // "https://cdn.freehihi.com/frames/2x3/abc.png": {
    //     "photoSize": { "width": XXX, "height": XXX },
    //     "positions": [
    //       { "x": XX, "y": XX, "centerX": false },
    //       { "x": XX, "y": XX, "centerX": false },
    //       { "x": XX, "y": XX, "centerX": false },
    //       { "x": XX, "y": XX, "centerX": false },
    //       { "x": XX, "y": XX, "centerX": false },
    //       { "x": XX, "y": XX, "centerX": false }
    //     ]
    // }
};

export const STANDARD_CONFIG_2X3 = {
    // Will be defined later with actual measurements
    photoSize: { width: 0, height: 0 },
    positions: [],
    slotCount: 6,
    layout: '2x3'
};
