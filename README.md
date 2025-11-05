# 📸 PhotoXinh - Photobooth Online

Ứng dụng chụp ảnh photobooth trực tuyến với nhiều hiệu ứng, layout và frames đẹp mắt.

![Photobooth Demo](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Tính năng

- � **Chụp ảnh từ webcam** - Hỗ trợ chọn camera (bao gồm Phone Link)
- 🎨 **6 bộ lọc màu** - Gốc, Đen Trắng, Sepia, Ấm Áp, Lạnh, Vintage
- 📐 **3 layout** - 1×4 (vertical) / 2×2 (portrait grid) / 2×3 (landscape grid)
- 🖼️ **100+ frames đa dạng** - Import frames từ freehihi.com dễ dàng
- ⏱️ **Đếm ngược tùy chỉnh** - 0s / 3s / 5s / 10s / 15s hoặc custom
- 🔄 **Hoán đổi ảnh** - Kéo thả để đổi vị trí
- 🗑️ **Xóa từng ảnh** - Chụp lại ảnh nào không đẹp
- ⚡ **Chụp tự động** - Tự động chụp tất cả ảnh liên tiếp
- 💾 **Tải về** - Download ảnh ghép với frame chất lượng cao
- 📱 **Responsive** - Hoạt động tốt trên mobile

## 🚀 Quick Start

### Cách 1: Python Server (Đơn giản nhất)

```bash
cd Photobooth
python -m http.server 8000
```

Mở trình duyệt: `http://localhost:8000`

### Cách 2: Live Server (VS Code)

1. Install extension "Live Server"
2. Right-click `index.html` → "Open with Live Server"

### Cách 3: Node.js

```bash
npx http-server
```

## � Cấu trúc Project

```
Photobooth/
├── index.html                      # HTML chính
├── vercel.json                     # Vercel config
├── css/                            # Stylesheets
│   ├── main.css                    # Global styles
│   ├── camera.css                  # Camera & video
│   ├── filters.css                 # Bộ lọc
│   ├── frames.css                  # Frame styles
│   ├── camera-selector.css         # Camera dropdown
│   └── responsive.css              # Mobile responsive
├── js/                             # JavaScript modules
│   ├── app.js                      # Entry point
│   ├── config.js                   # Config & state
│   ├── camera.js                   # Camera control
│   ├── camera-selector.js          # Camera selector
│   ├── capture.js                  # Photo capture
│   ├── filters.js                  # Filter management
│   ├── layouts.js                  # Layout switching
│   ├── ui.js                       # UI updates
│   ├── default-frames.js           # Default frames data
│   └── frames/                     # Frame management
│       ├── frames.js               # Frame loader
│       ├── frame-positions-1x4.js  # 1x4 positions
│       ├── frame-positions-2x2.js  # 2x2 positions
│       └── frame-positions-2x3.js  # 2x3 positions
├── tools/                          # Developer tools
│   └── frame-detector/             # Frame position detector
│       ├── detector-1x4.html
│       ├── detector-2x2.html
│       └── detector-2x3.html
├── DEPLOY.md                       # Deploy guide
└── README.md                       # This file
```

## 🏗️ Kiến trúc Code

### Module Pattern

Code được tách thành các module nhỏ, mỗi module có trách nhiệm riêng:

- **config.js** - Quản lý state toàn cục
- **camera.js** - Xử lý camera (getUserMedia, flip, stop)
- **camera-selector.js** - Dropdown chọn camera
- **capture.js** - Logic chụp ảnh với crop theo layout
- **filters.js** - Quản lý bộ lọc màu
- **layouts.js** - Chuyển đổi layout & countdown
- **frames.js** - Quản lý frames & positions
- **ui.js** - Cập nhật giao diện
- **app.js** - Entry point, khởi tạo app

### ES6 Modules

```javascript
// Export từ module
export function startCamera() { ... }

// Import vào module khác
import { startCamera } from './camera.js';
```

### State Management

```javascript
const STATE = {
    stream: null,
    photos: [null, null, null, null, null, null],
    currentFilter: 'none',
    currentLayout: '1x4',
    selectedDeviceId: null,
    // ...
};
```

## 🎯 Workflow chụp ảnh

### Layout 2x2 & 2x3

1. **Video Preview Crop** - Camera preview tự động crop để match tỷ lệ frame
   - 2x2: Tỷ lệ 3:4 (dọc/portrait) → video "gầy" đi
   - 2x3: Tỷ lệ 522:391 (ngang/landscape) → video rộng hơn

2. **Photo Capture Crop** - Ảnh chụp được crop từ vùng giữa camera
   - Tính toán aspect ratio target
   - Crop vùng giữa để match với khung frame
   - Canvas resize theo vùng cropped

3. **Frame Overlay** - Ghép ảnh vào frame với positions chính xác
   - centerX: false → dùng X positions chính xác (cho grid 2x2, 2x3)
   - centerX: true → center horizontally (cho vertical 1x4)

## 🔧 Developer Tools

### Frame Position Detector

Tool tự động phát hiện vị trí khung ảnh trong frame:

- `tools/frame-detector/detector-1x4.html` - Cho layout 1x4
- `tools/frame-detector/detector-2x2.html` - Cho layout 2x2
- `tools/frame-detector/detector-2x3.html` - Cho layout 2x3

**Tính năng:**
- ✅ Auto-detect transparent areas
- ✅ Manual editor với drag & drop
- ✅ Apply Standard Size button
- ✅ Export JSON positions
- ✅ Support cả frames nhỏ & lớn (aspect ratio matching)

## 📦 Dependencies

- TailwindCSS 2.2.19 (CDN)
- Font Awesome 6.5.0 (CDN)

## 🚀 Deploy lên Vercel

Xem hướng dẫn chi tiết trong file [`DEPLOY.md`](./DEPLOY.md)

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔒 Requirements

- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)
- Cho phép truy cập camera
- HTTPS (bắt buộc khi deploy - Vercel tự động enable)

## 🔮 Roadmap

- [x] Multiple layouts (1x4, 2x2, 2x3)
- [x] Camera selector với Phone Link support
- [x] Frame position detector tools
- [x] Auto crop ảnh theo tỷ lệ frame
- [ ] Thêm stickers/overlays
- [ ] Video recording
- [ ] Share social media
- [ ] PWA support
- [ ] Backend upload & gallery

## 📝 License

MIT License - Made with 💖 by PhotoXinh Team

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

---

⭐ Star repo nếu bạn thấy hữu ích!




## ✨ Tính năngỨng dụng chụp ảnh photobooth trực tuyến với nhiều hiệu ứng và layout đẹp mắt.



- 📷 **Chụp ảnh từ webcam** - Hỗ trợ chọn camera (bao gồm Phone Link)

- 🎨 **6 bộ lọc màu** - Gốc, Đen Trắng, Sepia, Ấm Áp, Lạnh, Vintage

- 📐 **3 layout** - 1×4 / 2×2 / 2×3## 🗂️ Cấu trúc ProjectỨng dụng chụp ảnh photobooth trực tuyến với nhiều hiệu ứng và layout đẹp mắt.Ứng dụng chụp ảnh online với nhiều hiệu ứng và bộ lọc màu xinh xắn.

- 🖼️ **Frames đa dạng** - Import frames từ freehihi.com dễ dàng

- ⏱️ **Đếm ngược** - 0s / 3s / 5s / 10s / 15s

- 🔄 **Hoán đổi ảnh** - Kéo thả để đổi vị trí

- 🗑️ **Xóa từng ảnh** - Chụp lại ảnh nào không đẹp```

- ⚡ **Chụp tự động** - Tự động chụp 4 ảnh liên tiếp

- 💾 **Tải về** - Download ảnh ghép với framePhotobooth/

- 📱 **Responsive** - Hoạt động tốt trên mobile

├── index.html          # HTML chính (chỉ markup, không inline CSS/JS)## 🗂️ Cấu trúc Project## ✨ Tính năng

## 🚀 Chạy Project

├── css/                # Thư mục CSS modules

### Cách 1: Python Server (Đơn giản nhất)

```bash│   ├── main.css       # Global styles, buttons, layouts

python -m http.server 8000

```│   ├── camera.css     # Camera, video, photo slots



### Cách 2: Live Server (VS Code)│   ├── filters.css    # Filter buttons & styles```- 📷 Chụp ảnh trực tiếp từ webcam

Install extension "Live Server" và click "Go Live"

│   ├── camera-selector.css  # Camera selector dropdown

### Cách 3: Node.js

```bash│   └── responsive.css # Mobile responsivePhotobooth/- 🎨 6 bộ lọc màu: Gốc, Đen Trắng, Sepia, Ấm Áp, Lạnh, Vintage

npx http-server

```├── js/                 # Thư mục JavaScript modules



Mở trình duyệt: `http://localhost:8000`│   ├── app.js         # Entry point, initialize app├── index.html          # HTML chính (chỉ markup, không inline CSS/JS)- ⚡ Chế độ chụp đơn hoặc tự động chụp 4 ảnh liên tiếp



## 🎨 Quản lý Frames│   ├── config.js      # Configuration & state management



### Lấy Frames mới từ freehihi.com│   ├── camera.js      # Camera logic (start, stop, flip)├── css/                # Thư mục CSS modules- ⏱️ Đếm ngược: Không / 3s / 5s / 10s



**Sử dụng Bookmarklet (Nhanh nhất - 1 click):**│   ├── camera-selector.js  # Camera device selector



1. Mở `bookmarklet.html`│   ├── capture.js     # Photo capture logic│   ├── main.css       # Global styles, buttons, layouts- 🖼️ Layout linh hoạt: 1×4 / 2×2 / 2×3

2. Nhấn `Ctrl+Shift+B` để hiện bookmark bar

3. Kéo button "🎨 Extract Frames" lên bookmark bar│   ├── filters.js     # Filter management

4. Truy cập https://photo.freehihi.com/viewframe

5. Scroll xuống hết để load frames│   ├── layouts.js     # Layout switching (1x4, 2x2, 2x3)│   ├── camera.css     # Camera, video, photo slots- 🗑️ Xóa từng ảnh riêng lẻ

6. Click bookmarklet → JSON tự động copy!

7. Mở `frame-manager.html` → Paste → Import│   └── ui.js          # UI updates (slots, download, swap)



📖 **Chi tiết:** Xem `BOOKMARKLET_GUIDE.md`├── package.json        # NPM config│   ├── filters.css    # Filter buttons & styles- 💾 Tải về ảnh ghép (2×2 layout)



### Công cụ hỗ trợ└── README.md          # This file



- **`bookmarklet.html`** - Extract frames từ freehihi.com (1 click)```│   └── responsive.css # Mobile responsive- 📱 Responsive trên mọi thiết bị

- **`test-bookmarklet.html`** - Test bookmarklet trước khi dùng

- **`frame-manager.html`** - Import frames từ JSON vào project

- **`BOOKMARKLET_GUIDE.md`** - Hướng dẫn chi tiết bookmarklet

- **`FRAME_GUIDE.md`** - Hướng dẫn về cấu trúc frames## ✨ Tính năng├── js/                 # Thư mục JavaScript modules



## 🗂️ Cấu trúc Project



```- 📷 Chụp ảnh từ webcam│   ├── app.js         # Entry point, initialize app## 🚀 Deploy lên Vercel

Photobooth/

├── index.html              # Trang chính- 📱 **Chọn camera từ dropdown** (hỗ trợ Phone Link để dùng camera điện thoại!)

├── bookmarklet.html        # Tool extract frames

├── test-bookmarklet.html   # Test bookmarklet- 🎨 6 bộ lọc màu (Gốc, Đen Trắng, Sepia, Ấm, Lạnh, Vintage)│   ├── config.js      # Configuration & state management

├── frame-manager.html      # Import frames

├── css/                    # Stylesheets- 📐 3 layout khác nhau (1×4, 2×2, 2×3)

│   ├── main.css

│   ├── camera.css- ⏱️ Đếm ngược tùy chỉnh (0s, 3s, 5s, 10s, 15s)│   ├── camera.js      # Camera logic (start, stop, flip)1. Fork/Clone repo này

│   ├── filters.css

│   ├── frames.css- 🔄 Hoán đổi vị trí ảnh

│   ├── camera-selector.css

│   └── responsive.css- 🗑️ Xóa từng ảnh│   ├── capture.js     # Photo capture logic2. Đăng nhập [Vercel](https://vercel.com)

├── js/                     # JavaScript modules

│   ├── app.js              # Entry point- ⚡ Chụp tự động tất cả ảnh

│   ├── config.js           # Config & state

│   ├── camera.js           # Camera logic- 💾 Tải về ảnh ghép│   ├── filters.js     # Filter management3. Import project từ GitHub

│   ├── camera-selector.js  # Camera selector

│   ├── capture.js          # Capture logic- 📱 Responsive mobile

│   ├── filters.js          # Filter management

│   ├── layouts.js          # Layout switching│   ├── layouts.js     # Layout switching (1x4, 2x2, 2x3)4. Deploy!

│   ├── frames.js           # Frame management

├── js/
│   ├── app.js               # Entry point
│   ├── camera.js            # Camera control
│   ├── camera-selector.js   # Camera dropdown
│   ├── capture.js           # Photo capture
│   ├── config.js            # Global state
│   ├── filters.js           # Color filters
│   ├── frames.js            # Frame management
│   ├── layouts.js           # Layout switching
│   ├── default-frames.js    # Default frames data
│   └── ui.js                # UI updates
├── css/                     # Stylesheets
├── bookmarklet.html         # Bookmarklet guide
├── frame-manager.html       # Frame duplicate checker
├── BOOKMARKLET_GUIDE.md     # Bookmarklet docs
├── DEPLOY_GUIDE.md          # Deploy guide
├── package.json
└── README.md

python -m http.server 8000

## 🏗️ Kiến trúc Code

```└── README.md          # This file

### Module Pattern

Code được tách thành các module nhỏ, mỗi module có trách nhiệm riêng:



- **config.js** - Quản lý cấu hình & state toàn cục### Cách 2: Live Server (VS Code)``````bash

- **camera.js** - Xử lý camera (getUserMedia, flip, stop)

- **camera-selector.js** - Dropdown chọn cameraInstall extension "Live Server" và click "Go Live"

- **capture.js** - Logic chụp ảnh

- **filters.js** - Quản lý bộ lọc màupython -m http.server 8000

- **layouts.js** - Chuyển đổi layout

- **frames.js** - Quản lý frames### Cách 3: Node.js

- **frame-loader.js** - Load frames từ CDN

- **ui.js** - Cập nhật giao diện```bash## ✨ Tính năng```

- **app.js** - Entry point, khởi tạo app

npx http-server

### ES6 Modules

```javascript```

// Export từ module

export function startCamera() { ... }



// Import vào module khácTruy cập: `http://localhost:8000`- 📷 Chụp ảnh từ webcamMở trình duyệt: `http://localhost:8000`

import { startCamera } from './camera.js';

```



### State Management## 🏗️ Kiến trúc Code- 🎨 6 bộ lọc màu (Gốc, Đen Trắng, Sepia, Ấm, Lạnh, Vintage)

```javascript

const STATE = {

    stream: null,

    photos: [],### Module Pattern- 📐 3 layout khác nhau (1×4, 2×2, 2×3)## 🔒 Yêu cầu

    currentFilter: 'none',

    currentFrame: 'none',Code được tách thành các module nhỏ, mỗi module có trách nhiệm riêng:

    selectedDeviceId: null,

    // ...- ⏱️ Đếm ngược tùy chỉnh (0s, 3s, 5s, 10s, 15s)

};

```- **config.js**: Quản lý cấu hình & state toàn cục



## 🎯 Lợi ích của kiến trúc- **camera.js**: Xử lý camera (getUserMedia, flip, stop)- 🔄 Hoán đổi vị trí ảnh- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)



✅ **Dễ maintain** - Mỗi file 50-150 dòng thay vì 900+ dòng  - **camera-selector.js**: Dropdown chọn camera (phát hiện Phone Link tự động)

✅ **Dễ mở rộng** - Thêm feature mới không ảnh hưởng code cũ  

✅ **Tái sử dụng** - Function có thể dùng ở nhiều nơi  - **capture.js**: Logic chụp ảnh (countdown, capture, auto-capture)- 🗑️ Xóa từng ảnh- Cho phép truy cập camera

✅ **Team work** - Nhiều người làm việc song song  

✅ **Testing** - Dễ viết unit test cho từng module  - **filters.js**: Quản lý bộ lọc màu



## 📝 Convention- **layouts.js**: Chuyển đổi layout & countdown timer- ⚡ Chụp tự động tất cả ảnh- HTTPS (bắt buộc khi deploy)



- File CSS: `kebab-case.css`- **ui.js**: Cập nhật giao diện (slots, download, swap photos)

- File JS: `kebab-case.js`

- Function: `camelCase()`- **app.js**: Entry point, khởi tạo app- 💾 Tải về ảnh ghép

- Constant: `UPPER_CASE`

- Class: `PascalCase`



## 📦 Dependencies### ES6 Modules- 📱 Responsive mobile---



- TailwindCSS 2.2.19 (CDN)Sử dụng ES6 import/export để chia code thành modules:

- Font Awesome 6.5.0 (CDN)

```javascript

## 🔒 Yêu cầu

// Export từ module

- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Safari, Edge)

- Cho phép truy cập cameraexport function startCamera() { ... }## 🚀 Chạy ProjectMade with 💖 by PhotoXinh Team

- HTTPS (bắt buộc khi deploy)



## 🚀 Deploy lên Vercel

// Import vào module khác

1. Fork/Clone repo này

2. Đăng nhập [Vercel](https://vercel.com)import { startCamera } from './camera.js';### Cách 1: Python Server

3. Import project từ GitHub

4. Deploy!``````bash



## 🔮 Roadmappython -m http.server 8000



- [x] Camera selector với Phone Link support### State Management```

- [x] Frame system với bookmarklet

- [ ] Video recordingTất cả state được quản lý tập trung trong `config.js`:

- [ ] Share social media

- [ ] PWA support```javascript### Cách 2: Live Server (VS Code)

- [ ] Backend upload

const STATE = {Install extension "Live Server" và click "Go Live"

## 📚 Documentation

    stream: null,

- **FRAME_GUIDE.md** - Hướng dẫn sử dụng và cấu trúc frames

- **BOOKMARKLET_GUIDE.md** - Hướng dẫn chi tiết về bookmarklet tool    photos: [...],### Cách 3: Node.js



---    currentFilter: 'none',```bash



Made with 💖 by Photobooth Team    selectedDeviceId: null,  // Camera được chọnnpx http-server


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
