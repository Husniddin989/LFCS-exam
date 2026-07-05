# LFCS Exam Preparation Platform

> Linux Foundation Certified System Administrator (LFCS) imtihoniga tayyorgarlik uchun interaktiv platforma — **brauzerda haqiqiy Linux terminali** va **avtomatik baholash** bilan. Barcha darslar, testlar va topshiriqlar **o'zbek tilida**.

LFCS — bu test emas, **amaliy imtihon**: sizga real Linux muhiti beriladi va vazifalarni terminalda o'z qo'lingiz bilan bajarasiz. Ushbu platforma xuddi shu tajribani beradi — har foydalanuvchiga alohida Docker container ochiladi, siz topshiriqni bajarasiz, tizim esa natijani avtomatik tekshiradi.

---

## 📋 Mundarija

- [Imkoniyatlar](#-imkoniyatlar)
- [Talablar](#-talablar)
- [Tez boshlash](#-tez-boshlash)
- [Qanday foydalaniladi](#-qanday-foydalaniladi)
- [Konfiguratsiya](#️-konfiguratsiya)
- [Muammolarni hal qilish](#-muammolarni-hal-qilish)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [Deploy](#-deploy)
- [Texnologiyalar](#-texnologiyalar)

---

## ✨ Imkoniyatlar

| Bo'lim | Tavsif |
|--------|--------|
| **12 modul, 51+ dars** | Nazariya, lab va amaliy topshiriqlar (Essential Commands, Users, Networking, Storage, Systemd, ...) |
| **Practice Exam** | 2 soatlik taymer, 18 talik bankdan **har urinishda 6 random task**, weighted ball, 66% o'tish chizig'i, real terminalda avtomatik baholash |
| **Modul testlari** | Har modulda *nazariy test* (144 savol) + *amaliy test* (77 topshiriq, terminalda) |
| **Real Terminal** | Docker (to'liq Ubuntu 22.04) yoki v86 (brauzerdagi Linux VM, backend'siz) |
| **Progress + XP** | Ilgarilash localStorage'da saqlanadi, urinishlar tarixi grafigi |

> 💡 **Eng muhimi:** har topshiriq real containerda tekshiriladi — fayl yaratildimi, service to'g'ri sozlandimi, ruxsatlar joyidami. Yodlab bo'lmaydi, chunki tasklar har safar random tanlanadi.

---

## 🔧 Talablar

Platformaning **to'liq ishlashi** (Docker terminali + avtomatik baholash) uchun:

- **Docker** — [Docker Desktop](https://www.docker.com/products/docker-desktop/) yoki [OrbStack](https://orbstack.dev/) (macOS). Daemon ishga tushgan bo'lishi shart.
- **Node.js 20+** — lokal ishlab chiqish rejimi uchun ([nodejs.org](https://nodejs.org/))

> Docker bo'lmasa ham platforma ishlaydi: darslar, nazariy testlar va brauzerdagi **v86 terminali** to'liq ochiladi. Faqat Docker terminali va imtihon avtomatik baholashi o'chadi (o'rniga manual rejim).

---

## 🚀 Tez boshlash

### 1-variant — Docker Compose (tavsiya, bitta buyruq) 🐳

Eng oson yo'l — hammasi (frontend + backend + lab muhiti) birga ko'tariladi:

```bash
git clone https://github.com/Husniddin989/LFCS-exam.git
cd LFCS-exam
docker compose up -d --build
```

Brauzerda oching: **http://localhost:8080**

To'xtatish:
```bash
docker compose down
```

> Birinchi `up` biroz vaqt oladi (lab image quriladi, ~160MB). Keyingi safar tezroq.

### 2-variant — Lokal ishlab chiqish 💻

Kodni o'zgartirib sinab ko'rmoqchi bo'lsangiz:

```bash
git clone https://github.com/Husniddin989/LFCS-exam.git
cd LFCS-exam

npm install
npm run lab:build    # lab Docker image (bir marta, ~160MB)
npm run dev:full     # frontend (5173) + backend (3001) birga
```

Brauzerda oching: **http://localhost:5173**

**Boshqa buyruqlar:**

| Buyruq | Vazifasi |
|--------|----------|
| `npm run dev` | Faqat frontend (Docker terminalisiz, tez) |
| `npm run server` | Faqat backend (alohida terminalda) |
| `npm run dev:full` | Frontend + backend birga |
| `npm run lab:build` | Lab Docker image'ini qurish/yangilash |
| `npm run build` | Production build (`dist/`) |
| `npm run lint` | Kodni tekshirish |

---

## 📖 Qanday foydalaniladi

### Darslar va modullar
Chap paneldan modulni tanlang → darslarni ketma-ket o'qing. Lab darslarida **"Terminal ochish"** tugmasi bor — darsdagi buyruqlarni haqiqiy Ubuntu containerda sinab ko'rasiz.

### Modul testlari
Har modul sahifasi oxirida ikki test bor:
- **Nazariy test** — 12 savol, o'zlashtirish foizingizni ko'rsatadi
- **Amaliy test** — real terminalda ketma-ket topshiriqlar. Har birini bajarib **"Tekshirish"** bosasiz; barcha mezonlar o'tsa keyingisiga o'tasiz.

### Practice Exam (imtihon)
1. `/exam` sahifasida **"Imtihonni boshlash"** — Docker container ochiladi, taymer boshlanadi
2. Har topshiriqni **terminalda** bajaring (chapda topshiriqlar, o'ngda terminal)
3. Xohlasangiz oraliq **"Tekshirish"** bosing (ixtiyoriy)
4. **"Imtihonni tugatish"** (yoki taymer 0 ga tushsa) — barcha tasklar birdan tekshiriladi
5. Natija: weighted ball, PASS/FAIL (66%), domain bo'yicha tahlil, sarflangan vaqt

> 🔄 Sahifa yangilansa (F5) imtihon davom etadi — sessiya va taymer saqlanadi.

### Real Terminal (`/terminal`)
Erkin mashq maydoni — ikki rejim: **Docker** (to'liq Ubuntu) yoki **v86** (brauzerda, backend'siz).

---

## ⚙️ Konfiguratsiya

Backend'ni environment o'zgaruvchilari orqali sozlash mumkin (docker-compose.yml yoki `npm run server` oldidan):

| O'zgaruvchi | Default | Tavsif |
|-------------|---------|--------|
| `PORT` | `3001` | Backend porti |
| `LFCS_LAB_IMAGE` | `lfcs-lab:latest` | Lab Docker image nomi |
| `LFCS_CONTAINER_NETWORK` | `none` | Lab containerlar tarmog'i (`none` = internetsiz, xavfsiz; `bridge` = internetli) |
| `LFCS_MAX_SESSIONS` | `10` | Jami bir vaqtdagi maksimal sessiya |
| `LFCS_MAX_SESSIONS_PER_IP` | `3` | Bitta IP uchun aktiv sessiya |
| `LFCS_CREATES_PER_HOUR` | `20` | Bitta IP soatiga nechta sessiya ocha oladi |
| `LFCS_SESSION_TTL_MS` | `10800000` | Sessiya yashash muddati (3 soat) |

**Misol** (lokal, internetli containerlar bilan):
```bash
LFCS_CONTAINER_NETWORK=bridge npm run server
```

---

## 🔍 Muammolarni hal qilish

<details>
<summary><b>"Docker daemon ishlamayapti" xatosi</b></summary>

Docker Desktop yoki OrbStack ishga tushganini tekshiring:
```bash
docker version
```
Ishlamasa — ilovani oching va daemon to'liq yuklanguncha kuting.
</details>

<details>
<summary><b>Terminal ochilmayapti / "Container ochilmadi"</b></summary>

1. Backend ishlayaptimi? `curl http://localhost:3001/api/health` — `{"ok":true,"docker":true}` qaytishi kerak.
2. Lab image bormi? `docker images lfcs-lab` — bo'sh bo'lsa `npm run lab:build`.
3. Baribir ishlamasa — imtihonni **manual rejimda** davom ettirish mumkin.
</details>

<details>
<summary><b>Sahifa oq/bo'sh, "504 Outdated Optimize Dep" (Vite)</b></summary>

Vite keshi eskirgan. Tozalang va qayta ishga tushiring:
```bash
rm -rf node_modules/.vite
npm run dev
```
</details>

<details>
<summary><b>Port band (5173 / 3001 / 8080)</b></summary>

Boshqa jarayon portni egallagan. Uni yoping yoki port o'zgartiring
(`vite.config.js` da frontend, `PORT` env da backend).
</details>

<details>
<summary><b>Terminal buyruqlari ishlamaydi (systemctl, apt, lvm)</b></summary>

Lab container'da systemd PID 1 emas, LVM/blok qurilmalar yo'q. Shuning uchun
topshiriqlar bularsiz ishlashga moslashtirilgan (systemd unit **fayllari**,
disk **image**lari, firewall **skript**lari). Har topshiriq tavsifida real
imtihondagi farqi izohlangan.
</details>

---

## 📁 Loyiha strukturasi

```
LFCS-exam/
├── src/
│   ├── pages/            # Sahifalar (Exam, Module, ModuleTest, ModuleLabTest, ...)
│   ├── components/       # UI + Terminal (DockerTerminal, LabPractice, ...)
│   ├── data/             # modules.js (darslar), moduleTests.js (savollar)
│   └── context/          # ProgressContext (XP, progress)
├── server/
│   ├── index.js          # Backend: sessiyalar, terminal WS, verify API
│   ├── examTasks.js      # 18 exam task (6 domen × 3 variant)
│   └── moduleTasks.js    # 77 modul amaliy topshirig'i
├── docker/
│   ├── lab.Dockerfile    # Lab muhiti (Ubuntu 22.04 + LFCS toollari)
│   └── backend.Dockerfile
├── docker-compose.yml    # Hammasi bitta buyruq bilan
└── nginx.conf            # Production frontend + /api proxy
```

**Arxitektura:**
```
Brauzer (React + xterm.js)
   │  /api/*  (REST + WebSocket)
   ▼
Backend (Express + ws + dockerode)
   │  har sessiya = bitta container
   ▼
Docker (lfcs-lab: Ubuntu 22.04)
```

Barcha task banklar container ichida **mexanik tekshirilgan**: tekshiruv toza
muhitda muvaffaqiyatsiz, yechimdan keyin muvaffaqiyatli bo'lishi kafolatlangan.

---

## 🌐 Deploy

- **Docker Compose (to'liq):** `docker compose up -d --build` — eng oddiy yo'l.
- **Vercel:** `vercel.json` sozlangan, lekin faqat frontend + v86 rejimi ishlaydi.
  Docker terminali uchun backend'ni Docker socket'ga ega alohida serverda yuritish kerak.
- **Alohida (nginx + backend):** `Dockerfile` + `nginx.conf` frontend uchun
  (`/api` proxy sozlangan), `docker/backend.Dockerfile` backend uchun.

> ⚠️ **Public deploy:** hozircha auth yo'q. Internetga chiqarishdan oldin
> reverse-proxy'da autentifikatsiya qo'shing. Lab containerlar default'da
> internetsiz (`--network none`) va per-IP limitlar bilan himoyalangan.

---

## 🛠 Texnologiyalar

- **Frontend:** React 19, Vite 7, React Router 7, Tailwind CSS 3, lucide-react
- **Terminal:** @xterm/xterm, v86 (WASM x86 emulyator)
- **Backend:** Express, ws (WebSocket), dockerode
- **Infra:** Docker, Nginx, docker-compose

---

## 🤝 Hissa qo'shish

Pull request va issue'lar xush kelibsiz. Yangi topshiriq qo'shsangiz —
u container'da tekshiruvdan o'tishi kerak (toza muhitda FAIL, yechimdan keyin PASS).

## 📄 Litsenziya

Litsenziya hali belgilanmagan. Loyihadan foydalanish shartlari uchun repo egasi
bilan bog'laning yoki `LICENSE` fayli qo'shilishini kuting.
