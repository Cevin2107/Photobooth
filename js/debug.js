// Test Debug Script
console.log('=== DEBUG SCRIPT LOADED ===');

// Wait for app to be ready
window.addEventListener('appReady', () => {
    console.log('\n=== APP IS READY ===');
    
    // Check if modal exists
    const modal = document.getElementById('frameModal');
    console.log('Frame Modal:', modal ? 'FOUND ✅' : 'NOT FOUND ❌');
    
    if (modal) {
        console.log('Modal classes:', modal.className);
    }
    
    // Check if functions are available
    console.log('window.openFrameSelector:', typeof window.openFrameSelector);
    console.log('window.closeFrameSelector:', typeof window.closeFrameSelector);
    
    // Check changeFrameBtn
    const changeFrameBtn = document.getElementById('changeFrameBtn');
    console.log('Change Frame Button:', changeFrameBtn ? 'FOUND ✅' : 'NOT FOUND ❌');
    
    if (changeFrameBtn) {
        console.log('Button classes:', changeFrameBtn.className);
    }
    
    console.log('\n📸 Bây giờ hãy chụp 4 ảnh với layout 1x4 để xem modal tự động hiện!');
    console.log('💡 Hoặc gõ: window.openFrameSelector() để test thủ công');
});
