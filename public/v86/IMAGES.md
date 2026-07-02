# v86 Image Fayllari

Real Terminal (`/terminal` sahifasi) v86 x86 emulyatordan foydalanadi. U quyidagi fayllarga muhtoj:

- **BIOS**: `bios/seabios.bin`, `bios/vgabios.bin` — SeaBIOS + VGA BIOS
- **Kernel**: `images/buildroot-bzimage.bin` — Buildroot Linux (BusyBox + Lua + curl)

## Default: proxy orqali copy.sh CDN

Kod fayllarni quyidagi manzillardan qidiradi:

1. **Lokal** — `/v86/bios/...` va `/v86/images/...` (bu papka)
2. **Fallback** — Vite / Vercel / Nginx proxy orqali copy.sh:
   - `/v86-cdn/bios/*` → `https://copy.sh/v86/bios/*`
   - `/v86-img/*`     → `https://i.copy.sh/*` (Referer bilan)

`i.copy.sh` — Bunny CDN, hotlink protection bor. Shuning uchun to'g'ridan-to'g'ri fetch bloklanadi va proxy talab qilinadi.

## Offline / Self-hosted

Internetdan mustaqil ishlash uchun fayllarni lokalga tushiring:

```bash
# public/v86/ ichida
mkdir -p bios images
cd bios
curl -O https://copy.sh/v86/bios/seabios.bin
curl -O https://copy.sh/v86/bios/vgabios.bin
cd ../images
curl -H 'Referer: https://copy.sh/v86/' -O https://i.copy.sh/buildroot-bzimage.bin
```

Total: ~5.2 MB.

Kod avval `/v86/` yo'lini tekshiradi — fayl bo'lsa lokal ishlaydi, aks holda proxy'ga tushadi.

## Deployment eslatmalari

### Vite dev

`vite.config.js` ichida proxy sozlangan (Referer bilan). Hech narsa qilish kerak emas.

### Vercel

`vercel.json` `rewrites` ishlatadi, ammo Vercel Referer header'ni o'zgartira olmaydi. Shuning uchun prod'da:
- Fayllarni `public/v86/` ichiga qo'ying (yuqorida), YOKI
- Vercel Edge Function yozing (proxy uchun), YOKI
- O'z S3/R2/bunny hosting'ingizda saqlab, `BIOS_BASE`/`IMAGE_BASE` ni almashtiring.

### Nginx (Docker)

`nginx.conf` ichida `/v86-cdn/` va `/v86-img/` uchun `proxy_pass` sozlangan, Referer to'g'ri qo'yiladi. Ishlaydi.

## Boshqa OS variantlar

Kod `RealTerminal.jsx` ichidagi `resolveImage()` chaqiruvini o'zgartirib boshqa OS yuklash mumkin. `i.copy.sh` orqali mavjud fayllar (namunalar):

- `buildroot-bzimage.bin` (5 MB) — hozirgi default
- `buildroot-bzimage68.bin` (10 MB) — Buildroot 6.8
- `linux4.iso` (7.4 MB) — VGA screen bilan bootable ISO
- `alpine-3.19.1/*` — Alpine Linux (katta, apk bilan)
- `archlinux/*` — Arch Linux 32-bit (~200 MB)

To'liq ro'yxat: https://copy.sh/v86 (`build/v86_all.js` ichida `d+"..."` bilan boshlangan URL'lar).
