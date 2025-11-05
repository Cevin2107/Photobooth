# 📚 Hướng dẫn Bookmarklet - Extract Frames

## 🎯 Bookmarklet là gì?

Bookmarklet là một đoạn JavaScript nhỏ được lưu dưới dạng bookmark trong trình duyệt. Khi click vào, nó sẽ chạy trên trang web hiện tại để thực hiện một tác vụ nào đó.

## ⚡ Tại sao dùng Bookmarklet?

- ✅ **Nhanh nhất**: Chỉ 1 click, không cần copy-paste code vào Console
- ✅ **Đơn giản**: Không cần kỹ năng kỹ thuật
- ✅ **Tiện lợi**: Luôn sẵn sàng trong bookmark bar
- ✅ **An toàn**: Code chạy local, không gửi data đi đâu

## 📖 Cách sử dụng (3 bước đơn giản)

### Bước 1: Thêm Bookmarklet

Có 2 cách để thêm:

#### **Cách 1: Kéo thả (Khuyên dùng - Dễ nhất!)**

1. Mở file `bookmarklet.html`
2. Hiện bookmark bar: Nhấn `Ctrl+Shift+B` (Windows) hoặc `Cmd+Shift+B` (Mac)
3. **Kéo** button **"🎨 Extract Frames"** lên bookmark bar
4. Xong!

#### **Cách 2: Copy & Paste (Nếu kéo thả không được)**

1. Mở file `bookmarklet.html`
2. Click vào **box màu đen** để copy code
3. Right-click vào bookmark bar → chọn **"Add page"** hoặc **"Add bookmark"**
4. Điền thông tin:
   - **Name**: `Extract Frames` (hoặc tên bạn thích)
   - **URL**: Paste code vừa copy (phải bắt đầu bằng `javascript:`)
5. Save!

### Bước 2: Sử dụng Bookmarklet

1. Mở trang https://photo.freehihi.com/viewframe
2. **QUAN TRỌNG**: Scroll xuống hết trang để load tất cả frames (trang có lazy loading)
3. Click vào bookmarklet **"Extract Frames"** trong bookmark bar
4. Sẽ hiện thông báo: ✅ Copied X frames!
5. JSON đã được copy vào clipboard tự động!

### Bước 3: Import vào Photobooth

1. Mở `frame-manager.html`
2. Paste JSON vào ô input (Ctrl+V)
3. Click **"Import Frames"**
4. Xong! Frames đã sẵn sàng!

## 🧪 Test Bookmarklet

Trước khi dùng thật, bạn có thể test trên local:

1. Mở `test-bookmarklet.html`
2. Click bookmarklet **"Extract Frames"**
3. Kiểm tra có hiện alert không
4. Hoặc dùng button **"Test Extract (Manual)"** để test

## ❓ Troubleshooting

### Bookmarklet không chạy?

**Kiểm tra:**
1. ✅ Bookmark URL có bắt đầu bằng `javascript:` không?
2. ✅ Đang ở đúng trang freehihi.com chưa?
3. ✅ Đã scroll xuống load hết frames chưa?
4. ✅ Trình duyệt có block JavaScript không?

**Giải pháp:**

**Vấn đề: Browser block bookmarklet**
- Chrome/Edge: Vào Settings → Privacy → Site Settings → JavaScript → Allow
- Firefox: Thử thêm `void(` ở đầu: `javascript:void((function(){...})())`

**Vấn đề: Copy failed (clipboard không hoạt động)**
- Browser sẽ tự động download file JSON thay thế
- Mở file JSON và copy nội dung để paste vào Frame Manager

**Vấn đề: Không tìm thấy frames**
- Đảm bảo đã scroll xuống hết trang
- Trang có lazy loading, cần scroll để load
- Thử refresh (F5) và scroll lại

### Kéo thả không được?

1. Thử cách 2 (Copy & Paste)
2. Hoặc:
   - Right-click vào button → Copy link
   - Right-click vào bookmark bar → Add page
   - Paste link vào URL

### Test không thành công?

1. Mở `test-bookmarklet.html`
2. Mở DevTools (F12)
3. Click bookmarklet
4. Xem Console có error không
5. Hoặc dùng button manual test

## 🔧 Alternative Options

Nếu bookmarklet vẫn không hoạt động, có 2 cách khác:

### Option 1: Frame Extractor Tool (Console script)
1. Mở `frame-extractor.html`
2. Làm theo hướng dẫn copy script vào Console
3. Phức tạp hơn nhưng luôn hoạt động

### Option 2: Manual Export
1. Tự tạo JSON file từ URLs
2. Import vào Frame Manager

## 📝 Code của Bookmarklet

```javascript
javascript:(function(){
var f=[];
var s=new Set();
var imgs=document.querySelectorAll('img[src*="cdn.freehihi.com"]');
imgs.forEach(function(img){
var u=img.src;
if(!s.has(u)&&u.toLowerCase().endsWith('.png')){
s.add(u);
f.push({name:img.alt||img.title||'Frame '+(f.length+1),url:u,index:f.length});
}
});
if(f.length>0){
var json=JSON.stringify(f,null,2);
navigator.clipboard.writeText(json).then(function(){
alert('✅ Copied '+f.length+' frames!\n\nPaste in Frame Manager to import.');
}).catch(function(){
var blob=new Blob([json],{type:'application/json'});
var url=URL.createObjectURL(blob);
var a=document.createElement('a');
a.href=url;
a.download='frames-'+Date.now()+'.json';
a.click();
URL.revokeObjectURL(url);
alert('✅ Downloaded '+f.length+' frames!\n\nOpen JSON file and paste in Frame Manager.');
});
}else{
alert('⚠️ No frames found!\n\nPlease scroll down to load all frames first.');
}
})();
```

## 🎨 Giải thích Code

1. **Tìm tất cả images** từ CDN freehihi.com
2. **Lọc**: Chỉ lấy PNG files
3. **Loại bỏ trùng lặp**: Dùng Set
4. **Tạo JSON** với format: name, url, index
5. **Copy vào clipboard** tự động
6. **Fallback**: Nếu copy fail → Auto download JSON file

## ✨ Tính năng

- ⚡ Siêu nhanh: 1 click
- 🎯 Chính xác: Auto filter & dedupe
- 📋 Auto copy: Clipboard tự động
- 💾 Backup: Auto download nếu clipboard fail
- 🔒 An toàn: Code chạy local only
- 🚫 No dependencies: Pure JavaScript
- 📱 Cross-browser: Chrome, Edge, Firefox, Safari

## 🎓 Tips & Tricks

1. **Đặt tên ngắn**: `EF` thay vì `Extract Frames` để tiết kiệm space
2. **Thêm emoji**: Dễ nhận biết trong bookmark bar
3. **Tạo folder**: Nhóm các bookmarklets liên quan
4. **Keyboard shortcut**: Một số browser hỗ trợ assign phím tắt cho bookmark

## 🤝 Support

Nếu có vấn đề:
1. Đọc lại Troubleshooting section
2. Test trên `test-bookmarklet.html`
3. Dùng Frame Extractor tool thay thế
4. Check DevTools Console để debug

---

**Happy extracting! 🎉**
