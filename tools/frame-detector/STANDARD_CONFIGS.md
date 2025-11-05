# Standard Position Configs for All Layouts

This document describes the standard position configurations for each frame layout used in the "Apply Standard Size" feature.

## Layout 1x4 (Vertical)

**Frame Dimensions:** 880x2650px (và các variants khác)  
**Photo Slot Size:** 771 × 565px  
**Layout:** 4 photos in vertical column

### Positions:
```
Photo 1: x = center, y = 64px
Photo 2: x = center, y = 676px   (64 + 565 + 47)
Photo 3: x = center, y = 1288px  (676 + 565 + 47)
Photo 4: x = center, y = 1900px  (1288 + 565 + 47)
```

### Spacing:
- Top margin: 64px
- Vertical spacing between photos: 47px
- Horizontal: Centered

---

## Layout 2x2 (Grid)

**Frame Dimensions:** 1140 × 1613px  
**Photo Slot Size:** 512 × 689px  
**Layout:** 4 photos in 2×2 grid

### Positions:
```
Photo 1 (Top-Left):     x = 43px,  y = 43px
Photo 2 (Top-Right):    x = 585px, y = 43px   (43 + 512 + 30)
Photo 3 (Bottom-Left):  x = 43px,  y = 764px  (43 + 689 + 32)
Photo 4 (Bottom-Right): x = 585px, y = 764px
```

### Spacing:
- Left margin: 43px
- Top margin: 43px
- Horizontal spacing between columns: 30px
- Vertical spacing between rows: 32px

### Calculations:
```
Photo width = 512px
Photo height = 689px
Column 1 X = 43px
Column 2 X = 43 + 512 + 30 = 585px
Row 1 Y = 43px
Row 2 Y = 43 + 689 + 32 = 764px
```

---

## Layout 2x3 (Grid)

**Frame Dimensions:** 1120 × 1368px  
**Photo Slot Size:** 522 × 391px  
**Layout:** 6 photos in 2×3 grid (2 columns × 3 rows)

### Positions:
```
Photo 1 (Row 1, Col 1): x = 26px,  y = 26px
Photo 2 (Row 1, Col 2): x = 572px, y = 26px   (26 + 522 + 24)
Photo 3 (Row 2, Col 1): x = 26px,  y = 441px  (26 + 391 + 24)
Photo 4 (Row 2, Col 2): x = 572px, y = 441px
Photo 5 (Row 3, Col 1): x = 26px,  y = 856px  (441 + 391 + 24)
Photo 6 (Row 3, Col 2): x = 572px, y = 856px
```

### Spacing:
- Left margin: 26px
- Top margin: 26px
- Horizontal spacing between columns: 24px
- Vertical spacing between rows: 24px

### Calculations:
```
Photo width = 522px
Photo height = 391px
Column 1 X = 26px
Column 2 X = 26 + 522 + 24 = 572px
Row 1 Y = 26px
Row 2 Y = 26 + 391 + 24 = 441px
Row 3 Y = 441 + 391 + 24 = 856px
```

---

## Notes

1. **Auto-detection still works independently** - These standard configs are only used when clicking "Apply Standard Size" in the manual editor
2. **Tolerance added (+5px)** - The assistant mentioned potentially adding 5-10px to prevent overlap, this can be adjusted if needed
3. **Sorting Order** - For grid layouts (2x2, 2x3), photos are sorted row-first, then column (top-left to bottom-right reading order)
4. **Scale Calculation** - All positions are automatically scaled based on the actual frame size vs canvas display size
