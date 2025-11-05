# Hướng dẫn thêm Frame mới

## Cấu trúc Frame

### 1. Thêm file ảnh frame
Đặt file ảnh frame vào thư mục `frames/`

### 2. Cập nhật frames.js

Mở file `js/frames.js` và thêm frame mới vào object `FRAMES`:

```javascript
export const FRAMES = {
    none: {
        name: 'Không khung',
        image: null,
        layout: 'all'  // Hiển thị cho tất cả layout
    },
    frame1x4: {
        name: 'Khung 1x4 Classic',
        image: 'frames/68df42a174a8d.png',
        layout: '1x4',  // Chỉ hiển thị cho layout 1x4
        photoSize: {
            width: 771,   // Chiều rộng ảnh (px)
            height: 565   // Chiều cao ảnh (px)
        },
        positions: [
            { x: 0, y: 64, centerX: true },      // Ảnh 1
            { x: 0, y: 676, centerX: true },     // Ảnh 2
            { x: 0, y: 1288, centerX: true },    // Ảnh 3
            { x: 0, y: 1900, centerX: true }     // Ảnh 4
        ]
    },
    // Thêm frame mới ở đây
    frameTenMoi: {
        name: 'Tên frame hiển thị',
        image: 'frames/ten-file.png',
        layout: '2x2',  // hoặc '1x4', '2x3', 'all'
        photoSize: {
            width: 500,   // Chiều rộng ảnh
            height: 400   // Chiều cao ảnh
        },
        positions: [
            { x: 50, y: 100, centerX: false },   // Ảnh 1: x và y cố định
            { x: 0, y: 300, centerX: true },     // Ảnh 2: căn giữa theo chiều ngang
            // ... thêm vị trí cho các ảnh khác
        ]
    }
};
```

## Giải thích các thuộc tính

### `name` (string)
Tên hiển thị của frame trong giao diện chọn frame

### `image` (string | null)
- Đường dẫn đến file ảnh frame (tính từ root)
- Dùng `null` cho option "Không khung"

### `layout` (string)
Layout mà frame này áp dụng:
- `'1x4'` - Chỉ hiển thị cho layout 1 cột 4 hàng
- `'2x2'` - Chỉ hiển thị cho layout 2x2
- `'2x3'` - Chỉ hiển thị cho layout 2x3
- `'all'` - Hiển thị cho tất cả layout

### `photoSize` (object - optional)
Kích thước ảnh sẽ được vẽ vào frame:
```javascript
photoSize: {
    width: 771,   // Chiều rộng ảnh (pixels)
    height: 565   // Chiều cao ảnh (pixels)
}
```
**Lưu ý:** Nếu không có `photoSize`, hệ thống sẽ dùng kích thước mặc định từ camera canvas.

### `positions` (array)
Mảng các vị trí để đặt ảnh lên frame. Mỗi vị trí là một object:

```javascript
{
    x: 0,           // Vị trí x (pixels từ bên trái)
    y: 18,          // Vị trí y (pixels từ trên xuống)
    centerX: true   // true: căn giữa theo chiều ngang, false: dùng x cố định
}
```

## Ví dụ tính toán vị trí cho layout 1x4

Giả sử:
- Frame có kích thước: 880px (width) × 2650px (height)
- Mỗi ảnh chụp: 771px (width) × 565px (height)
- Khoảng cách giữa các ảnh: 47px
- Khoảng cách từ top xuống ảnh đầu tiên: 64px

**Cách tính:**
- Ảnh 1: y = 64
- Ảnh 2: y = 64 + 565 + 47 = 676
- Ảnh 3: y = 676 + 565 + 47 = 1288
- Ảnh 4: y = 1288 + 565 + 47 = 1900

```javascript
frame1x4: {
    name: 'Khung 1x4',
    image: 'frames/frame1x4.png',
    layout: '1x4',
    photoSize: {
        width: 771,
        height: 565
    },
    positions: [
        { x: 0, y: 64, centerX: true },      // Ảnh 1
        { x: 0, y: 676, centerX: true },     // Ảnh 2
        { x: 0, y: 1288, centerX: true },    // Ảnh 3
        { x: 0, y: 1900, centerX: true }     // Ảnh 4
    ]
}
```

## Ví dụ cho layout 2x2

```javascript
frame2x2: {
    name: 'Khung 2x2 Cute',
    image: 'frames/frame-2x2.png',
    layout: '2x2',
    positions: [
        { x: 20, y: 20, centerX: false },      // Ảnh 1: góc trên trái
        { x: 270, y: 20, centerX: false },     // Ảnh 2: góc trên phải
        { x: 20, y: 210, centerX: false },     // Ảnh 3: góc dưới trái
        { x: 270, y: 210, centerX: false }     // Ảnh 4: góc dưới phải
    ]
}
```

## Tips

1. **Căn giữa theo chiều ngang**: Dùng `centerX: true` khi bạn muốn ảnh luôn nằm giữa frame theo chiều ngang (bất kể frame rộng bao nhiêu)

2. **Vị trí cố định**: Dùng `centerX: false` và chỉ định `x` chính xác khi bạn muốn ảnh ở vị trí cố định

3. **Kiểm tra kích thước**: Mở frame trong một editor ảnh để xem kích thước chính xác và đo vị trí cần đặt ảnh

4. **Test ngay**: Sau khi thêm frame, reload trang và chụp thử để kiểm tra vị trí có chính xác không

## Workflow chụp ảnh với Frame

1. User chọn layout (1x4, 2x2, hoặc 2x3)
2. User chụp đủ số ảnh theo layout đã chọn
3. Sau khi chụp xong, modal chọn frame sẽ tự động hiển thị
4. User chọn frame yêu thích (hoặc "Không khung")
5. User có thể swap vị trí các ảnh nếu muốn
6. User click "Chọn Khung Ảnh" để thay đổi frame bất cứ lúc nào
7. User click "Tải Ảnh Lẻn" để tải ảnh kết hợp với frame về máy

## Lưu ý kỹ thuật

- **Thứ tự vẽ:** Ảnh được vẽ trước (bottom layer), Frame được vẽ sau (top layer)
- **Lợi ích:** Frame có thể có các decoration tràn ra ngoài và che lên ảnh (borders, stickers, icons)
- Ảnh sẽ được vẽ theo đúng thứ tự trong mảng `positions`
- Nếu không load được frame, hệ thống sẽ tự động fallback về grid đơn giản
- Mỗi layout có thể có nhiều frame khác nhau
- Kích thước ảnh trong `photoSize` sẽ được sử dụng khi vẽ, không phụ thuộc vào kích thước camera
