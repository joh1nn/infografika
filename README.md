# ✦ AI Infografika Studio

Professional mahsulot infografika posterlarini AI yordamida yaratuvchi dastur.

## Ishga tushirish

### 1. Node.js o'rnating
https://nodejs.org — LTS versiyani yuklab o'rnating

### 2. Papkani oching
```
cd infographic-studio
```

### 3. Paketlarni o'rnating
```
npm install
```

### 4. Dasturni ishga tushiring
```
npm run dev
```

Brauzer avtomatik ochiladi: http://localhost:5173

---

## API kalit olish

1. https://console.anthropic.com saytiga kiring
2. "API Keys" bo'limida yangi kalit yarating
3. Dasturning yuqori o'ng burchagiga kiriting
4. Kalit brauzerde saqlanadi (localStorage)

---

## Qanday ishlatiladi

1. **Mahsulot rasmi** — mahsulotingiz rasmini yuklang
2. **Referens rasm** — o'xshatmoqchi bo'lgan dizayn rasmini yuklang  
3. **Ma'lumotlar** — nom, narx, xususiyatlar kiriting
4. **Uslub tanlang** — yoki AI Auto qoldiring
5. **"AI bilan yaratish"** tugmasini bosing
6. **HTML yuklab oling** — brauzerda oching, screenshot oling

---

## PNG qilish usuli

HTML yuklab olgach:
- Chrome'da oching → `Ctrl+P` → "Save as PDF" → PDF'ni PNG ga o'tkazing
- Yoki: Chrome DevTools → Screenshot oling

---

## Texnologiyalar

- React 18 + Vite
- Anthropic Claude claude-sonnet-4-6 API
- Vanilla CSS
