# 📦 Hướng dẫn Deploy với Default Frames

## 🎯 Workflow Đơn Giản

### **Bước 1: Lấy JSON từ Bookmarklet**

1. Mở https://photo.freehihi.com/viewframe
2. Scroll xuống load hết frames
3. Click bookmarklet **"Extract Frames"**
4. JSON được copy vào clipboard tự động ✅

---

### **Bước 2: Paste vào Code**

1. Mở file: `js/default-frames.js`
2. Tìm dòng: `export const DEFAULT_FRAMES_JSON = [`
3. **Paste JSON array** vào giữa `[` và `]`
4. Save file

**Ví dụ:**
```javascript
export const DEFAULT_FRAMES_JSON = [
  {name: "Frame 1", url: "https://cdn.freehihi.com/...", index: 0},
  {name: "Frame 2", url: "https://cdn.freehihi.com/...", index: 1},
  // ... 103 frames
];
```

---

### **Bước 3: Deploy lên Vercel**

```bash
git add .
git commit -m "Update frames"
git push
```

Vercel sẽ tự động deploy! 🚀

User vào web → **Có sẵn 103 frames** ngay lập tức!

---

## 🔍 Kiểm tra Trùng lặp (Optional)

Khi có JSON mới từ freehihi.com:

1. Mở `frame-manager.html`
2. Paste JSON mới vào input
3. Click **"Import Frames"** → localStorage có frames mới
4. Click **"🔍 Check Duplicates with Code"**
5. Xem báo cáo:
   - Frames trùng lặp
   - Frames mới trong localStorage (chưa add vào code)
   - Frames mới trong code

---

## 📋 Chi tiết Files

### **File chính: `js/default-frames.js`**

```javascript
// Paste JSON vào đây
export const DEFAULT_FRAMES_JSON = [
  // 👉 PASTE JSON TỪ BOOKMARKLET 👈
];

// Function này tự động load frames lần đầu
export function loadDefaultFrames() {
  // Kiểm tra localStorage
  // Nếu chưa có → Load từ DEFAULT_FRAMES_JSON
  // Nếu có rồi → Skip (giữ nguyên user data)
}
```

### **Auto-load trong `app.js`:**

```javascript
import { loadDefaultFrames } from './default-frames.js';

// App khởi động
loadDefaultFrames(); // Tự động load nếu user chưa có frames
loadExternalFrames(); // Load từ localStorage
```

---

## ✅ Ưu điểm của Workflow này

1. **Đơn giản**: Chỉ 1 file duy nhất để paste JSON
2. **Nhanh**: Bookmarklet → Paste → Deploy (3 bước)
3. **Linh hoạt**: User vẫn có thể thêm frames riêng
4. **An toàn**: Không ghi đè data của user
5. **Dễ update**: Paste JSON mới, deploy là xong

---

## 🧪 Test Local

1. Xóa localStorage: 
   - F12 → Application → Local Storage → Clear
2. Refresh trang
3. Kiểm tra Console:
   - `🎨 Loading X default frames...`
   - `✅ Default frames loaded successfully!`
4. Check frame selector → Phải có 103 frames

---

## 📊 Frame Manager Features

### **1. Import Frames** (Cho testing)
- Paste JSON để test
- Tự động phát hiện trùng
- Merge với frames cũ

### **2. Check Duplicates with Code** (Mới!)
- So sánh localStorage vs code
- Hiển thị frames trùng, frames mới
- Console log chi tiết

### **3. Export JSON**
- Backup frames hiện tại
- Share với người khác

---

## 🚀 Deploy Checklist

- [ ] Bookmarklet extract → Copy JSON
- [ ] Paste vào `js/default-frames.js`
- [ ] Test local (clear localStorage, refresh)
- [ ] Check Console logs
- [ ] Open frame selector → Có 103 frames?
- [ ] Git commit & push
- [ ] Vercel deploy
- [ ] Test production

---

## 💡 Tips

**Cập nhật frames mới:**
1. Dùng bookmarklet extract JSON mới
2. Paste vào `frame-manager.html` → Import
3. Click "Check Duplicates with Code"
4. Nếu có frames mới → Copy từ localStorage
5. Update `default-frames.js`
6. Deploy

**Rollback:**
- Git revert commit
- Hoặc paste JSON cũ lại vào `default-frames.js`

---

**Happy Deploying! 🎉**
