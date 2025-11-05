# Photobooth - PhotoXinh

📸 Ứng dụng chụp ảnh online với nhiều hiệu ứng và bộ lọc màu xinh xắn

## 🚀 Deploy lên Vercel

### Bước 1: Chuẩn bị

1. Tạo tài khoản Vercel (nếu chưa có): https://vercel.com/signup
2. Cài đặt Vercel CLI (tùy chọn):
   ```bash
   npm install -g vercel
   ```

### Bước 2: Deploy từ Git (Khuyến nghị)

1. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/photobooth.git
   git push -u origin main
   ```

2. **Import vào Vercel:**
   - Truy cập: https://vercel.com/new
   - Click "Import Git Repository"
   - Chọn repository `photobooth`
   - Click "Import"
   - Vercel sẽ tự động detect và deploy!

### Bước 3: Deploy từ CLI (Nhanh)

```bash
# Di chuyển vào thư mục project
cd d:\Code\Photobooth

# Login Vercel (lần đầu)
vercel login

# Deploy
vercel

# Hoặc deploy production
vercel --prod
```

### Bước 4: Deploy từ Dashboard (Không cần Git)

1. Truy cập: https://vercel.com/new
2. Chọn tab "Deploy from folder"
3. Kéo thả thư mục `Photobooth` vào
4. Click "Deploy"

## 🎯 Sau khi Deploy

Vercel sẽ tự động:
- ✅ Generate URL preview: `https://your-project.vercel.app`
- ✅ Enable HTTPS
- ✅ CDN global (tốc độ nhanh toàn cầu)
- ✅ Auto deploy khi push code mới (nếu connect Git)

## 📝 Lưu ý quan trọng

### Camera Permission
- App cần HTTPS để truy cập camera
- Vercel tự động enable HTTPS ✅
- Localhost cũng work (http://localhost:8000)

### Custom Domain (Tùy chọn)
1. Vào Project Settings trên Vercel
2. Chọn "Domains"
3. Thêm domain của bạn: `photobooth.yourdomain.com`
4. Config DNS theo hướng dẫn

### Environment Variables (Nếu cần)
- Vào Project Settings → Environment Variables
- Thêm các biến môi trường (API keys, etc.)

## 🔧 Troubleshooting

### Lỗi: Module not found
- Vercel tự động detect static site, không cần config thêm
- File `vercel.json` đã có sẵn

### Camera không hoạt động
- Kiểm tra HTTPS đã enable chưa
- Cho phép camera permission trong browser
- Test trên mobile: có thể cần camera rear/front khác nhau

### Frames không load
- Kiểm tra CORS cho CDN frames
- Nếu dùng external CDN, đảm bảo có header CORS

## 📱 Test App

Sau deploy, test các tính năng:
- ✅ Camera preview
- ✅ Filter effects
- ✅ Layout switch (1x4, 2x2, 2x3)
- ✅ Frame selector
- ✅ Photo capture
- ✅ Download merged photo

## 🌐 URL Examples

- Preview: `https://photobooth-abc123.vercel.app`
- Production: `https://photobooth.vercel.app`
- Custom: `https://photo.yourdomain.com`

---

Made with 💖 by PhotoXinh Team
