# 📸 BinCun Photo - Photobooth Online# 📸 PhotoXinh - Photobooth Online# 📸 PhotoXinh - Photobooth Online



Ứng dụng chụp ảnh photobooth trực tuyến với nhiều hiệu ứng và layout đẹp mắt.



## 🗂️ Cấu trúc ProjectỨng dụng chụp ảnh photobooth trực tuyến với nhiều hiệu ứng và layout đẹp mắt.Ứng dụng chụp ảnh online với nhiều hiệu ứng và bộ lọc màu xinh xắn.



```

Photobooth/

├── index.html          # HTML chính (chỉ markup, không inline CSS/JS)## 🗂️ Cấu trúc Project## ✨ Tính năng

├── css/                # Thư mục CSS modules

│   ├── main.css       # Global styles, buttons, layouts

│   ├── camera.css     # Camera, video, photo slots

│   ├── filters.css    # Filter buttons & styles```- 📷 Chụp ảnh trực tiếp từ webcam

│   ├── camera-selector.css  # Camera selector dropdown

│   └── responsive.css # Mobile responsivePhotobooth/- 🎨 6 bộ lọc màu: Gốc, Đen Trắng, Sepia, Ấm Áp, Lạnh, Vintage

├── js/                 # Thư mục JavaScript modules

│   ├── app.js         # Entry point, initialize app├── index.html          # HTML chính (chỉ markup, không inline CSS/JS)- ⚡ Chế độ chụp đơn hoặc tự động chụp 4 ảnh liên tiếp

│   ├── config.js      # Configuration & state management

│   ├── camera.js      # Camera logic (start, stop, flip)├── css/                # Thư mục CSS modules- ⏱️ Đếm ngược: Không / 3s / 5s / 10s

│   ├── camera-selector.js  # Camera device selector

│   ├── capture.js     # Photo capture logic│   ├── main.css       # Global styles, buttons, layouts- 🖼️ Layout linh hoạt: 1×4 / 2×2 / 2×3

│   ├── filters.js     # Filter management

│   ├── layouts.js     # Layout switching (1x4, 2x2, 2x3)│   ├── camera.css     # Camera, video, photo slots- 🗑️ Xóa từng ảnh riêng lẻ

│   └── ui.js          # UI updates (slots, download, swap)

├── package.json        # NPM config│   ├── filters.css    # Filter buttons & styles- 💾 Tải về ảnh ghép (2×2 layout)

└── README.md          # This file

```│   └── responsive.css # Mobile responsive- 📱 Responsive trên mọi thiết bị



## ✨ Tính năng├── js/                 # Thư mục JavaScript modules



- 📷 Chụp ảnh từ webcam│   ├── app.js         # Entry point, initialize app## 🚀 Deploy lên Vercel

- 📱 **Chọn camera từ dropdown** (hỗ trợ Phone Link để dùng camera điện thoại!)

- 🎨 6 bộ lọc màu (Gốc, Đen Trắng, Sepia, Ấm, Lạnh, Vintage)│   ├── config.js      # Configuration & state management

- 📐 3 layout khác nhau (1×4, 2×2, 2×3)

- ⏱️ Đếm ngược tùy chỉnh (0s, 3s, 5s, 10s, 15s)│   ├── camera.js      # Camera logic (start, stop, flip)1. Fork/Clone repo này

- 🔄 Hoán đổi vị trí ảnh

- 🗑️ Xóa từng ảnh│   ├── capture.js     # Photo capture logic2. Đăng nhập [Vercel](https://vercel.com)

- ⚡ Chụp tự động tất cả ảnh

- 💾 Tải về ảnh ghép│   ├── filters.js     # Filter management3. Import project từ GitHub

- 📱 Responsive mobile

│   ├── layouts.js     # Layout switching (1x4, 2x2, 2x3)4. Deploy!

## 🚀 Chạy Project

│   └── ui.js          # UI updates (slots, download, swap)

### Cách 1: Python Server

```bash├── package.json        # NPM config## 💻 Chạy local

python -m http.server 8000

```└── README.md          # This file



### Cách 2: Live Server (VS Code)``````bash

Install extension "Live Server" và click "Go Live"

python -m http.server 8000

### Cách 3: Node.js

```bash## ✨ Tính năng```

npx http-server

```



Truy cập: `http://localhost:8000`- 📷 Chụp ảnh từ webcamMở trình duyệt: `http://localhost:8000`



## 🏗️ Kiến trúc Code- 🎨 6 bộ lọc màu (Gốc, Đen Trắng, Sepia, Ấm, Lạnh, Vintage)



### Module Pattern- 📐 3 layout khác nhau (1×4, 2×2, 2×3)## 🔒 Yêu cầu

Code được tách thành các module nhỏ, mỗi module có trách nhiệm riêng:

- ⏱️ Đếm ngược tùy chỉnh (0s, 3s, 5s, 10s, 15s)

- **config.js**: Quản lý cấu hình & state toàn cục

- **camera.js**: Xử lý camera (getUserMedia, flip, stop)- 🔄 Hoán đổi vị trí ảnh- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)

- **camera-selector.js**: Dropdown chọn camera (phát hiện Phone Link tự động)

- **capture.js**: Logic chụp ảnh (countdown, capture, auto-capture)- 🗑️ Xóa từng ảnh- Cho phép truy cập camera

- **filters.js**: Quản lý bộ lọc màu

- **layouts.js**: Chuyển đổi layout & countdown timer- ⚡ Chụp tự động tất cả ảnh- HTTPS (bắt buộc khi deploy)

- **ui.js**: Cập nhật giao diện (slots, download, swap photos)

- **app.js**: Entry point, khởi tạo app- 💾 Tải về ảnh ghép



### ES6 Modules- 📱 Responsive mobile---

Sử dụng ES6 import/export để chia code thành modules:

```javascript

// Export từ module

export function startCamera() { ... }## 🚀 Chạy ProjectMade with 💖 by PhotoXinh Team



// Import vào module khác

import { startCamera } from './camera.js';### Cách 1: Python Server

``````bash

python -m http.server 8000

### State Management```

Tất cả state được quản lý tập trung trong `config.js`:

```javascript### Cách 2: Live Server (VS Code)

const STATE = {Install extension "Live Server" và click "Go Live"

    stream: null,

    photos: [...],### Cách 3: Node.js

    currentFilter: 'none',```bash

    selectedDeviceId: null,  // Camera được chọnnpx http-server

    // ...```

};

```Truy cập: `http://localhost:8000`



## 🎯 Lợi ích của việc tách module## 🏗️ Kiến trúc Code



### ✅ Dễ maintain### Module Pattern

- Mỗi file chỉ 50-150 dòng thay vì 900+ dòngCode được tách thành các module nhỏ, mỗi module có trách nhiệm riêng:

- Dễ tìm bug, biết chính xác file nào có vấn đề

- **config.js**: Quản lý cấu hình & state toàn cục

### ✅ Dễ mở rộng- **camera.js**: Xử lý camera (getUserMedia, flip, stop)

- Thêm feature mới chỉ cần tạo module mới- **capture.js**: Logic chụp ảnh (countdown, capture, auto-capture)

- Không ảnh hưởng code cũ- **filters.js**: Quản lý bộ lọc màu

- **layouts.js**: Chuyển đổi layout & countdown timer

### ✅ Tái sử dụng- **ui.js**: Cập nhật giao diện (slots, download, swap photos)

- Function có thể dùng ở nhiều nơi- **app.js**: Entry point, khởi tạo app

- Export/import dễ dàng

### ES6 Modules

### ✅ Team workSử dụng ES6 import/export để chia code thành modules:

- Nhiều người có thể làm việc song song```javascript

- Conflict code ít hơn// Export từ module

export function startCamera() { ... }

### ✅ Testing

- Dễ viết unit test cho từng module// Import vào module khác

- Mock dependencies dễ dàngimport { startCamera } from './camera.js';

```

## 📝 Convention

### State Management

- File CSS: `kebab-case.css`Tất cả state được quản lý tập trung trong `config.js`:

- File JS: `kebab-case.js````javascript

- Function: `camelCase()`const STATE = {

- Constant: `UPPER_CASE`    stream: null,

- Class: `PascalCase`    photos: [...],

    currentFilter: 'none',

## 🐛 Debug    // ...

};

Browser DevTools Console sẽ hiển thị chính xác module nào có lỗi:```

```

Error in camera.js:45## 🎯 Lợi ích của việc tách module

```

### ✅ Dễ maintain

Thay vì file duy nhất:- Mỗi file chỉ 50-150 dòng thay vì 900+ dòng

```- Dễ tìm bug, biết chính xác file nào có vấn đề

Error in index.html:567

```### ✅ Dễ mở rộng

- Thêm feature mới chỉ cần tạo module mới

## 📱 Tính năng Phone Link- Không ảnh hưởng code cũ



App tự động phát hiện camera từ Phone Link (Windows):### ✅ Tái sử dụng

- Hiển thị icon 📱 cho camera điện thoại- Function có thể dùng ở nhiều nơi

- Dễ dàng chọn trong dropdown- Export/import dễ dàng

- Chất lượng ảnh cao từ camera phone

### ✅ Team work

## 📦 Dependencies- Nhiều người có thể làm việc song song

- Conflict code ít hơn

- TailwindCSS 2.2.19 (CDN)

- Font Awesome 6.5.0 (CDN)### ✅ Testing

- Dễ viết unit test cho từng module

## 🔮 Roadmap- Mock dependencies dễ dàng



- [ ] Thêm stickers/frames## 📝 Convention

- [ ] Video recording

- [ ] Share social media- File CSS: `kebab-case.css`

- [ ] PWA support- File JS: `kebab-case.js`

- [ ] Backend upload- Function: `camelCase()`

- [x] Camera selector với Phone Link support- Constant: `UPPER_CASE`

- Class: `PascalCase`

## 🔒 Yêu cầu

## 🐛 Debug

- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)

- Cho phép truy cập cameraBrowser DevTools Console sẽ hiển thị chính xác module nào có lỗi:

- HTTPS (bắt buộc khi deploy lên production)```

Error in camera.js:45

---```



Made with 💖 by BinCun Photo TeamThay vì file duy nhất:

```
Error in index.html:567
```

## 📦 Dependencies

- TailwindCSS 2.2.19 (CDN)
- Font Awesome 6.5.0 (CDN)

## 🔮 Roadmap

- [ ] Thêm stickers/frames
- [ ] Video recording
- [ ] Share social media
- [ ] PWA support
- [ ] Backend upload

## 🔒 Yêu cầu

- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)
- Cho phép truy cập camera
- HTTPS (bắt buộc khi deploy lên production)

---

Made with 💖 by BinCun Photo Team
