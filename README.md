# LFCS Exam Preparation Platform

Linux Foundation Certified System Administrator (LFCS) imtihoniga tayyorgarlik uchun React + Vite platformasi. O'zbek tilida darslar, quizlar va real Linux terminal (brauzerda ishlaydigan v86 x86 emulator).

## Features

- 12 modul, 51+ dars (nazariya, lab, quiz, exam task)
- LFCS Practice Exam — 2 soatlik timer, 6 ta real task
- Progress tracking (localStorage'da saqlanadi, XP hisobi)
- **Real Linux Terminal** — brauzerda ishlaydigan Buildroot Linux VM (`/terminal`)
- Responsive dizayn (mobile + desktop sidebar)

## Ishga tushirish

```bash
npm install
npm run dev
```

`http://localhost:5173` da ochiladi.

## Real Terminal (v86)

`/terminal` sahifasi haqiqiy Linux VM'ni brauzerda ishga tushiradi. Ishlash uchun:

- Boot fayllar (`~5 MB`) copy.sh CDN'dan yuklab olinadi (proxy orqali)
- Buildroot Linux — BusyBox + Lua + curl bilan
- Barcha o'zgarishlar RAM'da, sahifa yopilganda yo'qoladi

Offline / self-hosted variant uchun: [public/v86/IMAGES.md](public/v86/IMAGES.md).

## Deploy

- **Vercel**: `vercel.json` sozlangan. Image proxying uchun `public/v86/` ichiga fayllar tushiring (yuqoriga qarang).
- **Docker + Nginx**: `Dockerfile` va `nginx.conf` mavjud. `docker build -t lfcs . && docker run -p 8080:80 lfcs`.

## Stack

- React 19 + Vite 7
- React Router 7
- Tailwind CSS 3
- lucide-react (icons)
- react-syntax-highlighter (code blocks)
- **v86** (x86 emulator, WASM)
- **@xterm/xterm** (terminal UI)
