# LFCS Exam Preparation Platform

Linux Foundation Certified System Administrator (LFCS) imtihoniga tayyorgarlik uchun React + Vite platformasi. O'zbek tilida darslar, testlar va real Linux terminal (Docker container yoki brauzerda ishlaydigan v86 emulator) orqali amaliy mashq.

## Features

- **12 modul, 51+ dars** (nazariya, lab, quiz, exam task)
- **LFCS Practice Exam** (`/exam`) — real imtihon tajribasi:
  - Har urinishda 6 domendan bittadan **random task** tanlanadi (18 talik bankdan) — yodlab bo'lmaydi
  - Alohida Docker container ochiladi, tasklar terminalda bajariladi
  - **"Imtihonni tugatish"** yoki timer 0 ga tushganda barcha tasklar birdan tekshiriladi
  - **Weighted natija** (har domen o'z vazniga ega), 66% o'tish chizig'i bilan PASS/FAIL
  - Domain bo'yicha breakdown, sarflangan vaqt, oxirgi urinishlar grafigi
  - **Reconnect**: sahifa yangilansa (F5) sessiya va timer saqlanadi — ish yo'qolmaydi
- **Modul testlari** — har modul sahifasida ikki xil:
  - *Nazariy test* — 12 savol (multiple choice), o'zlashtirish foizi
  - *Amaliy test* — real terminalda ketma-ket topshiriqlar, har biri avtomatik tekshiriladi
- **Dars lablari** — lab darslarida real Docker terminal mashq maydoni
- **Real Linux Terminal** (`/terminal`) — ikki rejim:
  - **Docker** — to'liq Ubuntu 22.04, har sessiya uchun alohida container (backend kerak)
  - **v86** — brauzerda ishlaydigan Buildroot Linux VM (backend kerak emas)
- Progress tracking + XP (localStorage), responsive dizayn

## Ishga tushirish

### Variant 1 — docker-compose (tavsiya, bitta buyruq)

```bash
docker compose up -d --build
```

`http://localhost:8080` da ochiladi. Bu frontend (nginx) + backend + lab image'ni
birga ko'taradi. Backend host Docker daemon'idan foydalanadi (socket mount).

### Variant 2 — lokal ishlab chiqish

```bash
npm install
npm run lab:build   # lab Docker image (bir marta, ~160MB)
npm run dev:full    # frontend (5173) + backend (3001) birga
```

`http://localhost:5173` da ochiladi. Docker daemon (Docker Desktop / OrbStack) aktiv bo'lishi kerak.
Faqat frontend (terminal Docker rejimisiz): `npm run dev`.

## Arxitektura

```
Brauzer (React + xterm.js)
   │  /api/*  (Vite proxy → :3001; prod'da nginx → backend)
   ▼
Backend (server/index.js — Express + ws + dockerode)
   │  har sessiya uchun bitta container
   ▼
Docker (lfcs-lab image — Ubuntu 22.04 + LFCS tools)
```

**Sessiya rejimlari** (`POST /api/sessions` `{mode}`):
- `exam` — 6 random task tanlanadi va fixture'lar seed qilinadi
- `module` — modul amaliy testi (barcha task fixture'lari)
- `playground` — bo'sh muhit (dars lablari, Real Terminal)

**Asosiy endpointlar:**
- `WS /api/terminal?session=...` — xterm.js ↔ `docker exec bash` PTY ko'prigi
- `GET /api/sessions/:id` — reconnect (F5 uchun sessiya holati)
- `POST /api/sessions/:id/verify` — bitta exam task tekshiruvi
- `POST /api/sessions/:id/finish-exam` — yakuniy weighted ball
- `GET /api/module-tasks/:moduleId` + `POST .../verify-module` — modul amaliy testi
- `DELETE /api/sessions/:id` — containerni o'chirish (TTL: 3 soat)

**Task banklar** (har biri container'da mexanik verifikatsiya qilingan —
check'lar toza muhitda FAIL, yechimdan keyin PASS):
- [server/examTasks.js](server/examTasks.js) — 18 exam task (6 domen × 3 variant)
- [server/moduleTasks.js](server/moduleTasks.js) — 77 modul amaliy topshirig'i
- [src/data/moduleTests.js](src/data/moduleTests.js) — 144 nazariy savol

## Xavfsizlik (public deploy uchun)

Backend quyidagi himoyalar bilan keladi (env orqali sozlanadi):

- **`LFCS_CONTAINER_NETWORK=none`** (default) — lab containerlarda tashqi internet yopiq.
  Tasklar internetga muhtoj emas; ochish kerak bo'lsa `bridge` qo'ying.
- **Per-IP limitlar**: `LFCS_MAX_SESSIONS_PER_IP` (default 3),
  `LFCS_CREATES_PER_HOUR` (default 20) — bitta manzil serverni to'ldirib qo'ymaydi.
- **Resurs limitlari**: 512MB RAM, 1 CPU, 256 pids, `AutoRemove`, 3 soat TTL.
- Global: `LFCS_MAX_SESSIONS` (default 10).

> Eslatma: hozircha auth yo'q — internetga chiqarishdan oldin reverse-proxy'da
> autentifikatsiya qo'shish tavsiya etiladi.

## Real Terminal (v86 rejimi)

Backend'siz ham ishlaydigan zaxira rejim — haqiqiy Linux VM brauzerda:

- Boot fayllar (`~5 MB`) copy.sh CDN'dan yuklab olinadi (proxy orqali)
- Buildroot Linux — BusyBox + Lua + curl bilan
- Barcha o'zgarishlar RAM'da, sahifa yopilganda yo'qoladi

Offline / self-hosted variant uchun: [public/v86/IMAGES.md](public/v86/IMAGES.md).

## Deploy

- **docker-compose** (to'liq): `docker compose up -d --build` — yuqoriga qarang.
- **Vercel**: `vercel.json` sozlangan — lekin faqat frontend + v86 rejimi.
  Docker terminal va exam auto-tekshirish uchun backend'ni alohida serverda
  (Docker socket'ga ega VM) ishga tushirish kerak.
- **Docker + Nginx alohida**: `Dockerfile` + `nginx.conf` frontend uchun
  (`/api` → backend proxy sozlangan), backend uchun `docker/backend.Dockerfile`.

## Stack

- React 19 + Vite 7, React Router 7, Tailwind CSS 3
- lucide-react (icons), react-syntax-highlighter (code blocks)
- **@xterm/xterm** (terminal UI)
- **Express + ws + dockerode** (lab backend)
- **v86** (x86 emulator, WASM — zaxira rejim)
