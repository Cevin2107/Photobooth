# 📸 BinCun Photobooth - Photobooth Online

Ứng dụng chụp ảnh photobooth trực tuyến với nhiều hiệu ứng, bộ lọc màu và khung ảnh đẹp mắt. Hỗ trợ chụp ảnh từ webcam hoặc camera điện thoại qua Phone Link, với giao diện responsive thân thiện trên mọi thiết bị.

![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Tính năng

- 📷 **Chụp ảnh từ webcam** - Hỗ trợ chọn camera (bao gồm Phone Link)
- 🎨 **6 bộ lọc màu** - Gốc, Đen Trắng, Sepia, Ấm Áp, Lạnh, Vintage
- 📐 **3 layout linh hoạt** - 1×4 (dọc), 2×2 (vuông), 2×3 (ngang)
- 🖼️ **100+ khung ảnh đa dạng** - Dễ dàng import từ freehihi.com
- ⏱️ **Đếm ngược tùy chỉnh** - 0s, 3s, 5s, 10s, 15s
- 🔄 **Hoán đổi ảnh** - Kéo thả để đổi vị trí ảnh
- 🗑️ **Xóa từng ảnh** - Chụp lại ảnh bất kỳ
- ⚡ **Chụp tự động** - Tự động chụp tất cả ảnh liên tiếp
- 💾 **Tải về chất lượng cao** - Download ảnh ghép với frame
- 📱 **Responsive** - Hoạt động mượt mà trên mobile và desktop

## 🚀 Cài đặt

### Cách 1: Python Server (Khuyên dùng)

```bash
cd Photobooth
python -m http.server 8000
```

Mở trình duyệt: `http://localhost:8000`

### Cách 2: Live Server (VS Code)

1. Cài extension "Live Server"
2. Click phải `index.html` → "Open with Live Server"

### Cách 3: Node.js

```bash
npx http-server
```

### Yêu cầu hệ thống

- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)
- Cho phép truy cập camera
- HTTPS (bắt buộc khi deploy online)

## 📄 Bản quyền

MIT License

Copyright (c) 2025 Cevin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Made with 💖 by Cevin