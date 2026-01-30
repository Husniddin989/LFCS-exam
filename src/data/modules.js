export const modules = [
  {
    id: 1,
    title: "Essential Commands & Filesystem",
    description: "Linux fayl tizimi, asosiy buyruqlar, find, grep, text processing",
    icon: "Terminal",
    color: "from-green-500 to-emerald-600",
    duration: "4-5 soat",
    difficulty: "Beginner",
    examWeight: "25%",
    lessons: [
      {
        id: 1,
        title: "Linux Filesystem Hierarchy (FHS)",
        type: "theory",
        duration: "20 min",
        content: `
## Linux Filesystem Hierarchy Standard (FHS)

Linux'da barcha narsalar **fayl** sifatida ko'riladi — oddiy fayllar, directorylar, devices, socketlar va boshqalar.

### Asosiy Directorylar

| Directory | Tavsif | Real misol |
|-----------|--------|------------|
| \`/\` | Root directory — barcha narsaning boshlanishi | Sistemaning asosi |
| \`/bin\` | Essential user binaries | \`ls\`, \`cp\`, \`cat\`, \`bash\` |
| \`/sbin\` | System binaries (root uchun) | \`fsck\`, \`reboot\`, \`iptables\` |
| \`/etc\` | Configuration files | \`/etc/nginx/nginx.conf\` |
| \`/home\` | User home directories | \`/home/admin\` |
| \`/root\` | Root user's home | Root'ning shaxsiy papkasi |
| \`/var\` | Variable data | Logs, cache, spool |
| \`/tmp\` | Temporary files | Reboot'da o'chadi |
| \`/usr\` | User programs | Secondary hierarchy |
| \`/opt\` | Third-party software | Custom apps |
| \`/proc\` | Process information (virtual) | \`/proc/cpuinfo\` |
| \`/sys\` | System information (virtual) | Hardware ma'lumotlari |
| \`/dev\` | Device files | \`/dev/sda\`, \`/dev/null\` |

### Production'da Eng Ko'p Ishlatiladigan Pathlar

\`\`\`bash
# Web server configs
/etc/nginx/
/etc/apache2/
/etc/httpd/

# Logs
/var/log/messages
/var/log/syslog
/var/log/nginx/access.log

# Application data
/var/www/html/
/opt/myapp/

# Systemd services
/etc/systemd/system/
/usr/lib/systemd/system/
\`\`\`

### Muhim Tushunchalar

1. **Everything is a file** — Linux falsafasi
2. **Absolute path** — \`/\` dan boshlanadi: \`/home/user/file.txt\`
3. **Relative path** — joriy directoryga nisbatan: \`./file.txt\` yoki \`../parent/file.txt\`
4. **Hidden files** — \`.\` bilan boshlanadi: \`.bashrc\`, \`.ssh/\`

> **LFCS Tip:** Imtihonda ko'pincha "X service config qayerda?" degan savollar bo'ladi. Javob deyarli doim \`/etc/service-name/\` ichida.
        `,
        keyPoints: [
          "Linux'da hamma narsa fayl hisoblanadi",
          "/etc — configuration, /var — variable data, /tmp — temporary",
          "/proc va /sys — virtual filesystem'lar",
          "FHS — standart, lekin distributivlar orasida kichik farqlar bor"
        ]
      },
      {
        id: 2,
        title: "File Operations Mastery",
        type: "lab",
        duration: "30 min",
        content: `
## Lab: File Operations

Bu lab'da siz Linux'da fayl operatsiyalarini o'rganasiz.

### Lab Topshiriqlari

**1. Directory struktura yarating:**

\`\`\`bash
mkdir -p /opt/lfcs-lab/project/{config,logs,scripts,backup}
tree /opt/lfcs-lab/project/
\`\`\`

**2. Fayllar bilan ishlash:**

\`\`\`bash
# Fayl yaratish
touch /opt/lfcs-lab/project/config/app.conf
echo "LOG_LEVEL=debug" > /opt/lfcs-lab/project/config/app.conf

# Multiple fayllar
touch /opt/lfcs-lab/project/logs/{app,error,access}.log

# Copy
cp /opt/lfcs-lab/project/config/app.conf /opt/lfcs-lab/project/backup/

# Move/Rename
mv /opt/lfcs-lab/project/backup/app.conf /opt/lfcs-lab/project/backup/app.conf.bak
\`\`\`

**3. Hard Link vs Symbolic Link:**

\`\`\`bash
# Original fayl
echo "Original content" > /opt/lfcs-lab/original.txt

# Hard link — bir xil inode
ln /opt/lfcs-lab/original.txt /opt/lfcs-lab/hardlink.txt

# Symbolic link — yo'lga ishora
ln -s /opt/lfcs-lab/original.txt /opt/lfcs-lab/symlink.txt

# Farqni ko'ring
ls -li /opt/lfcs-lab/*.txt
\`\`\`

**4. Tekshirish:**

\`\`\`bash
# Original faylni o'chiring
rm /opt/lfcs-lab/original.txt

# Hardlink hali ham ishlaydi
cat /opt/lfcs-lab/hardlink.txt  # ✅ Ishlaydi

# Symlink endi "broken"
cat /opt/lfcs-lab/symlink.txt   # ❌ Xato
\`\`\`

### Muhim Farq

| Xususiyat | Hard Link | Symbolic Link |
|-----------|-----------|---------------|
| Inode | Bir xil | Boshqa |
| Cross filesystem | ❌ | ✅ |
| Directory uchun | ❌ | ✅ |
| Original o'chirilganda | Ishlayveradi | Buziladi |
| Hajmi | 0 (inode ref) | Path uzunligi |
        `,
        commands: [
          { cmd: "mkdir -p /opt/lfcs-lab/project/{config,logs,scripts,backup}", desc: "Directory struktura yaratish" },
          { cmd: "ln file hardlink", desc: "Hard link yaratish" },
          { cmd: "ln -s file symlink", desc: "Symbolic link yaratish" },
          { cmd: "ls -li", desc: "Inode raqamlarini ko'rish" }
        ]
      },
      {
        id: 3,
        title: "Find Command — Professional Usage",
        type: "theory",
        duration: "25 min",
        content: `
## Find Command — Linux Admin's Best Friend

\`find\` — eng kuchli va ko'p ishlatiladigan buyruqlardan biri. Production'da disk to'lganda, security audit'da, cleanup'da ishlatiladi.

### Asosiy Sintaksis

\`\`\`bash
find [path] [options] [expression]
\`\`\`

### Real Production Scenarios

**Scenario 1: Disk to'ldi — katta fayllarni topish**

\`\`\`bash
# 100MB dan katta fayllar
find / -type f -size +100M 2>/dev/null

# Top 10 katta fayllar
find / -type f -size +50M -exec ls -lh {} \\; 2>/dev/null | sort -k5 -rh | head -10
\`\`\`

**Scenario 2: Eski log fayllarni tozalash**

\`\`\`bash
# 30 kundan eski .log fayllar
find /var/log -name "*.log" -type f -mtime +30

# O'chirish (ehtiyot bo'ling!)
find /var/log -name "*.log.gz" -type f -mtime +90 -delete
\`\`\`

**Scenario 3: Security Audit — SUID/SGID**

\`\`\`bash
# SUID bit (4000)
find / -perm -4000 -type f 2>/dev/null

# SGID bit (2000)
find / -perm -2000 -type f 2>/dev/null

# World-writable files
find / -perm -0002 -type f 2>/dev/null
\`\`\`

**Scenario 4: Oxirgi o'zgarishlar**

\`\`\`bash
# Oxirgi 24 soatda o'zgargan fayllar
find /etc -type f -mtime -1

# Oxirgi 1 soatda
find /var/log -type f -mmin -60
\`\`\`

### Find + Exec/Xargs

\`\`\`bash
# Har bir topilgan fayl uchun buyruq
find /opt -name "*.conf" -exec cat {} \\;

# Xargs bilan (tezroq)
find /opt -name "*.conf" | xargs cat

# Xavfsiz variant (space'li nomlar uchun)
find /opt -name "*.conf" -print0 | xargs -0 cat
\`\`\`

### Foydali Kombinatsiyalar

| Vazifa | Buyruq |
|--------|--------|
| Bo'sh directorylar | \`find . -type d -empty\` |
| Executable fayllar | \`find . -type f -executable\` |
| Owner bo'yicha | \`find /home -user admin\` |
| Group bo'yicha | \`find /data -group developers\` |
| Permission bo'yicha | \`find . -perm 644\` |

> **LFCS Warning:** Imtihonda \`find\` buyrug'i juda ko'p keladi. \`-exec\` va \`-delete\` ishlatishni yaxshi o'rganing!
        `,
        keyPoints: [
          "find — path, options, expression ketma-ketligida ishlaydi",
          "-type f (file), -type d (directory)",
          "-mtime (kunlar), -mmin (minutlar)",
          "-exec {} \\; — har bir natija uchun buyruq",
          "-delete — topilganlarni o'chirish (ehtiyot!)"
        ]
      },
      {
        id: 4,
        title: "Find & Locate Lab",
        type: "lab",
        duration: "35 min",
        content: `
## Lab: Find va Locate Mastery

### Setup

\`\`\`bash
# Test environment yaratish
mkdir -p /opt/find-lab/{configs,logs,scripts,temp}
touch /opt/find-lab/configs/{app,db,web}.conf
touch /opt/find-lab/logs/{access,error,debug}.log
echo '#!/bin/bash' > /opt/find-lab/scripts/backup.sh
chmod +x /opt/find-lab/scripts/backup.sh

# Katta fayl simulatsiya
dd if=/dev/zero of=/opt/find-lab/temp/large_file.dat bs=1M count=50 2>/dev/null
\`\`\`

### Topshiriqlar

**Task 1:** Barcha .conf fayllarni toping

\`\`\`bash
find /opt/find-lab -name "*.conf" -type f
\`\`\`

**Task 2:** Executable fayllarni toping

\`\`\`bash
find /opt/find-lab -type f -executable
\`\`\`

**Task 3:** 10MB dan katta fayllarni toping

\`\`\`bash
find /opt/find-lab -type f -size +10M
\`\`\`

**Task 4:** Bo'sh directorylarni toping va o'chiring

\`\`\`bash
# Avval ko'ring
find /opt/find-lab -type d -empty

# Keyin o'chiring
find /opt/find-lab -type d -empty -delete
\`\`\`

**Task 5:** Barcha .log fayllarni arxivlang

\`\`\`bash
find /opt/find-lab -name "*.log" -type f -exec tar -rvf /tmp/logs.tar {} \\;
\`\`\`

### Locate Command

\`locate\` — \`find\` dan tezroq, chunki database'dan qidiradi.

\`\`\`bash
# Database yangilash (root sifatida)
sudo updatedb

# Qidirish
locate nginx.conf
locate -i README  # case-insensitive

# Regex bilan
locate -r '/etc/.*\\.conf$'
\`\`\`

> **Farq:** \`find\` — real-time qidiradi (sekin, lekin aniq). \`locate\` — database'dan (tez, lekin yangilanmagan bo'lishi mumkin).
        `,
        commands: [
          { cmd: "find /path -name '*.log' -mtime +7", desc: "7 kundan eski log fayllar" },
          { cmd: "find / -size +100M 2>/dev/null", desc: "100MB dan katta fayllar" },
          { cmd: "find /etc -type f -mmin -60", desc: "Oxirgi soatda o'zgarganlar" },
          { cmd: "locate -i filename", desc: "Tez qidirish (case-insensitive)" }
        ]
      },
      {
        id: 5,
        title: "Grep & Text Processing",
        type: "theory",
        duration: "25 min",
        content: `
## Grep & Text Processing — Log Analysis Essentials

Production'da log tahlil qilish — kundalik ish. \`grep\`, \`awk\`, \`sed\`, \`cut\`, \`sort\`, \`uniq\` — asosiy qurollaringiz.

### Grep — Pattern Matching

\`\`\`bash
# Oddiy qidirish
grep "error" /var/log/syslog

# Case-insensitive
grep -i "error" /var/log/syslog

# Recursive (directory ichida)
grep -r "password" /etc/

# Line number bilan
grep -n "failed" /var/log/auth.log

# Invert match (NOT)
grep -v "INFO" /var/log/app.log

# Count
grep -c "ERROR" /var/log/app.log

# Context (atrofdagi qatorlar)
grep -A 3 -B 2 "error" file.log  # 3 after, 2 before
\`\`\`

### Extended Grep (Regex)

\`\`\`bash
# egrep yoki grep -E
grep -E "error|warning|critical" /var/log/syslog

# IP address pattern
grep -E "([0-9]{1,3}\\.){3}[0-9]{1,3}" access.log

# Email pattern
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" file.txt
\`\`\`

### Awk — Column Processing

\`\`\`bash
# Access log — IP addresses (1st column)
awk '{print $1}' access.log

# Specific columns
awk '{print $1, $4, $9}' access.log

# Filter by value
awk '$9 == 500 {print $0}' access.log  # 500 errors

# Sum column
awk '{sum += $5} END {print sum}' data.txt
\`\`\`

### Real Production Pipeline

\`\`\`bash
# Top 10 IP addresses by request count
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 500 errorlar qaysi URL'larda
grep '" 500 ' access.log | awk '{print $7}' | sort | uniq -c | sort -rn

# Oxirgi 1000 qator, faqat ERROR
tail -1000 /var/log/app.log | grep -i error

# Vaqt oralig'ida qidirish
awk '/10:00:00/,/11:00:00/' /var/log/syslog
\`\`\`

### Cut & Sed

\`\`\`bash
# Cut — delimiter bilan
cut -d':' -f1 /etc/passwd  # Usernames

# Sed — replace
sed 's/old/new/g' file.txt  # Global replace
sed -i 's/old/new/g' file.txt  # In-place edit
\`\`\`
        `,
        keyPoints: [
          "grep -r — recursive, grep -i — case-insensitive",
          "grep -E — extended regex (egrep)",
          "awk '{print $N}' — N-column chiqarish",
          "sort | uniq -c | sort -rn — frequency analysis",
          "Pipeline — bir nechta buyruqni birlashtirish"
        ]
      },
      {
        id: 6,
        title: "Text Processing Lab",
        type: "lab",
        duration: "40 min",
        content: `
## Lab: Real Log Analysis

Bu lab'da real production scenariolarni simulatsiya qilamiz.

### Setup — Sample Access Log

\`\`\`bash
cat << 'EOF' > /tmp/access.log
192.168.1.100 - admin [30/Jan/2026:10:15:32 +0000] "GET /index.html HTTP/1.1" 200 1234
192.168.1.101 - - [30/Jan/2026:10:15:33 +0000] "GET /api/users HTTP/1.1" 200 5678
192.168.1.100 - admin [30/Jan/2026:10:15:34 +0000] "POST /login HTTP/1.1" 401 89
192.168.1.102 - - [30/Jan/2026:10:15:35 +0000] "GET /index.html HTTP/1.1" 200 1234
192.168.1.100 - admin [30/Jan/2026:10:15:36 +0000] "GET /dashboard HTTP/1.1" 200 9012
192.168.1.103 - - [30/Jan/2026:10:15:37 +0000] "GET /api/data HTTP/1.1" 500 0
192.168.1.101 - - [30/Jan/2026:10:15:38 +0000] "GET /api/users HTTP/1.1" 500 0
192.168.1.100 - admin [30/Jan/2026:10:15:39 +0000] "GET /logout HTTP/1.1" 302 0
192.168.1.104 - hacker [30/Jan/2026:10:15:40 +0000] "GET /admin HTTP/1.1" 403 45
192.168.1.104 - hacker [30/Jan/2026:10:15:41 +0000] "POST /login HTTP/1.1" 401 89
192.168.1.104 - hacker [30/Jan/2026:10:15:42 +0000] "POST /login HTTP/1.1" 401 89
192.168.1.104 - hacker [30/Jan/2026:10:15:43 +0000] "POST /login HTTP/1.1" 401 89
EOF
\`\`\`

### Topshiriqlar

**Task 1:** Top 5 IP manzillarni toping (request count bo'yicha)

\`\`\`bash
awk '{print $1}' /tmp/access.log | sort | uniq -c | sort -rn | head -5
\`\`\`

**Task 2:** 500 error bergan so'rovlarni toping

\`\`\`bash
grep '" 500 ' /tmp/access.log
# yoki
awk '$9 == 500' /tmp/access.log
\`\`\`

**Task 3:** Failed login urinishlari (401)

\`\`\`bash
grep '" 401 ' /tmp/access.log | awk '{print $1, $3}' | sort | uniq -c
\`\`\`

**Task 4:** Suspicious activity — 3+ failed login

\`\`\`bash
grep '" 401 ' /tmp/access.log | awk '{print $1}' | sort | uniq -c | awk '$1 >= 3'
\`\`\`

**Task 5:** Unique URL'lar ro'yxati

\`\`\`bash
awk '{print $7}' /tmp/access.log | sort -u
\`\`\`

**Task 6:** HTTP status code statistikasi

\`\`\`bash
awk '{print $9}' /tmp/access.log | sort | uniq -c | sort -rn
\`\`\`

### Bonus Challenge

Auth log yaratib, brute force attackni aniqlang:

\`\`\`bash
# Suspicious IPs report yarating
grep '" 401 ' /tmp/access.log | \\
  awk '{print $1}' | \\
  sort | uniq -c | \\
  awk '$1 >= 3 {print "ALERT: "$2" has "$1" failed attempts"}' > /tmp/security_report.txt

cat /tmp/security_report.txt
\`\`\`
        `,
        commands: [
          { cmd: "awk '{print $1}' log | sort | uniq -c | sort -rn", desc: "IP frequency analysis" },
          { cmd: 'grep \'" 500 "\' access.log', desc: "500 errorlarni topish" },
          { cmd: "awk '$9 >= 400' access.log", desc: "Barcha error response'lar" }
        ]
      },
      {
        id: 7,
        title: "Archive & Compression",
        type: "theory",
        duration: "20 min",
        content: `
## Archive & Compression — Backup Essentials

### Tar — Tape Archive

\`\`\`bash
# CREATE archive
tar -cvf archive.tar /path/to/dir    # verbose, no compression
tar -czvf archive.tar.gz /path       # gzip compression
tar -cjvf archive.tar.bz2 /path      # bzip2 (better ratio, slower)
tar -cJvf archive.tar.xz /path       # xz (best ratio, slowest)

# EXTRACT
tar -xvf archive.tar                 # extract
tar -xzvf archive.tar.gz             # extract gzip
tar -xvf archive.tar -C /destination # extract to specific dir

# LIST contents
tar -tvf archive.tar.gz

# Flags memory trick: c=create, x=extract, t=list, v=verbose, f=file
\`\`\`

### Compression Comparison

| Tool | Extension | Speed | Ratio | Use Case |
|------|-----------|-------|-------|----------|
| gzip | .gz | Fast | Good | Daily backups |
| bzip2 | .bz2 | Medium | Better | Weekly archives |
| xz | .xz | Slow | Best | Long-term storage |

### Gzip, Bzip2, Xz

\`\`\`bash
# Single file compression
gzip file.txt        # Creates file.txt.gz, removes original
gzip -k file.txt     # Keep original
gunzip file.txt.gz   # Decompress

# Bzip2
bzip2 file.txt
bunzip2 file.txt.bz2

# Xz
xz file.txt
unxz file.txt.xz
\`\`\`

### Production Backup Script

\`\`\`bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backup"

# /etc config backup
tar -czvf $BACKUP_DIR/etc-$DATE.tar.gz /etc

# /home backup (excluding cache)
tar -czvf $BACKUP_DIR/home-$DATE.tar.gz \\
    --exclude='*.cache' \\
    --exclude='.local/share/Trash' \\
    /home

# Eski backuplarni o'chirish (30 kundan eski)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
\`\`\`

> **LFCS Tip:** Imtihonda \`tar -czvf\` va \`tar -xzvf\` flag'larini tez yozish kerak bo'ladi. Yodlang!
        `,
        keyPoints: [
          "tar -czvf — create, gzip, verbose, file",
          "tar -xzvf — extract, gzip, verbose, file",
          "-C option — extract destination",
          "--exclude — pattern'larni chiqarib tashlash"
        ]
      },
      {
        id: 8,
        title: "Module 1 Quiz",
        type: "quiz",
        duration: "15 min",
        questions: [
          {
            id: 1,
            question: "/var directory nimani saqlaydi?",
            options: [
              "Kernel modullarni",
              "Variable data (logs, spool, cache)",
              "User home directorylarni",
              "System binarieslarni"
            ],
            correct: 1,
            explanation: "/var — variable data uchun: /var/log (logs), /var/spool (mail, print queues), /var/cache (application cache)"
          },
          {
            id: 2,
            question: "Hard link va symbolic link o'rtasidagi asosiy farq nima?",
            options: [
              "Hard link boshqa partitionga ishora qila oladi",
              "Symbolic link o'chirilganda original fayl ham o'chadi",
              "Hard link original fayl o'chirilsa ham ishlayveradi",
              "Symbolic link faqat directory uchun ishlaydi"
            ],
            correct: 2,
            explanation: "Hard link original faylning inode'iga to'g'ridan-to'g'ri ishora qiladi. Original o'chirilsa ham, inode bor ekan — data saqlanadi."
          },
          {
            id: 3,
            question: "Quyidagi buyruq nima qiladi: find /home -perm -4000",
            options: [
              "4000 baytdan katta fayllarni topadi",
              "SUID bit o'rnatilgan fayllarni topadi",
              "4000 permission bilan fayllarni topadi",
              "Oxirgi 4000 soniyada yaratilgan fayllarni topadi"
            ],
            correct: 1,
            explanation: "-perm -4000 SUID (Set User ID) bit o'rnatilgan fayllarni topadi. Security audit uchun muhim!"
          },
          {
            id: 4,
            question: "tar -czvf flag'larining ma'nosi nima?",
            options: [
              "copy, zip, verbose, force",
              "create, gzip, verbose, file",
              "compress, zip, verify, file",
              "create, zip, verbose, force"
            ],
            correct: 1,
            explanation: "c=create, z=gzip compression, v=verbose output, f=filename specified"
          },
          {
            id: 5,
            question: "Production serverda katta log fayldan joy bo'shatish uchun qaysi usul xavfsiz?",
            options: [
              "rm -f logfile.log",
              "cat /dev/null > logfile.log",
              "delete logfile.log",
              "shred -u logfile.log"
            ],
            correct: 1,
            explanation: "cat /dev/null > file — faylni truncate qiladi. File descriptor'lar buzilmaydi, service restart kerak emas."
          },
          {
            id: 6,
            question: "grep -v flag nima qiladi?",
            options: [
              "Verbose output beradi",
              "Version ko'rsatadi",
              "Pattern'ga mos KELMAGANLARNI ko'rsatadi",
              "Very fast mode yoqadi"
            ],
            correct: 2,
            explanation: "-v = invert match. Pattern'ga mos kelmaydigan qatorlarni ko'rsatadi. grep -v 'DEBUG' — DEBUG'siz log."
          },
          {
            id: 7,
            question: "Quyidagi pipeline nima qiladi: awk '{print $1}' log | sort | uniq -c | sort -rn | head -5",
            options: [
              "Log'dan oxirgi 5 qatorni oladi",
              "Birinchi column'ni sort qiladi",
              "Eng ko'p takrorlangan 5 ta birinchi column qiymatini topadi",
              "5 ta unique IP address topadi"
            ],
            correct: 2,
            explanation: "Bu classic frequency analysis: 1-column ol → sort → unique count → reverse numeric sort → top 5"
          },
          {
            id: 8,
            question: "find buyrug'ida -mtime -1 nimani anglatadi?",
            options: [
              "1 kundan oldin yaratilgan",
              "Oxirgi 1 kun ichida modified",
              "Aynan 1 kun oldin modified",
              "1 kun ichida accessed"
            ],
            correct: 1,
            explanation: "-mtime -1 = modification time < 1 day (oxirgi 24 soat). +1 = > 1 day, 1 = exactly 1 day."
          }
        ]
      },
      {
        id: 9,
        title: "LFCS Exam Tasks",
        type: "exam",
        duration: "45 min",
        tasks: [
          {
            id: 1,
            title: "Task 1: Find and Copy",
            description: "/home/admin/data directoryda .txt kengaytmali barcha fayllarni toping va ularni /backup/texts/ directoryga COPY qiling. Fayllarning original permissions saqlansin.",
            hints: ["find + -exec cp -p", "mkdir -p kerak bo'lishi mumkin"],
            solution: `mkdir -p /backup/texts
find /home/admin/data -name "*.txt" -type f -exec cp -p {} /backup/texts/ \\;`,
            verification: "ls -la /backup/texts/ da fayllar ko'rinishi kerak"
          },
          {
            id: 2,
            title: "Task 2: Archive with Date",
            description: "/etc directory ni /backup/etc-backup-DATE.tar.gz formatda arxivlang. DATE - bugungi sana bo'lsin (YYYY-MM-DD format). Arxiv gzip bilan siqilsin.",
            hints: ["date +%Y-%m-%d", "tar -czvf"],
            solution: `tar -czvf /backup/etc-backup-$(date +%Y-%m-%d).tar.gz /etc`,
            verification: "ls /backup/etc-backup-*.tar.gz ko'rinishi kerak"
          },
          {
            id: 3,
            title: "Task 3: Log Analysis",
            description: "/var/log/syslog (yoki messages) faylidan ERROR so'zini o'z ichiga olgan qatorlarni toping va natijani /root/errors.log fayliga yozing. Faqat oxirgi 100 ta qatorni tekshiring.",
            hints: ["tail -100", "grep ERROR", "> redirect"],
            solution: `tail -100 /var/log/syslog | grep -i "ERROR" > /root/errors.log`,
            verification: "cat /root/errors.log"
          },
          {
            id: 4,
            title: "Task 4: Symbolic Link",
            description: "/opt/app/current symbolic link yarating, u /opt/app/v2.1.0 directory ga ishora qilsin. Agar oldingi link mavjud bo'lsa, uni yangilang.",
            hints: ["ln -sfn", "mkdir -p for target"],
            solution: `mkdir -p /opt/app/v2.1.0
ln -sfn /opt/app/v2.1.0 /opt/app/current`,
            verification: "ls -la /opt/app/current → v2.1.0"
          },
          {
            id: 5,
            title: "Task 5: Security Audit",
            description: "Tizimda SUID bit o'rnatilgan barcha fayllarni toping va ularning ro'yxatini /root/suid-files.txt ga yozing. Har bir fayl to'liq path bilan bo'lsin.",
            hints: ["find / -perm -4000", "2>/dev/null errors uchun"],
            solution: `find / -perm -4000 -type f 2>/dev/null > /root/suid-files.txt`,
            verification: "cat /root/suid-files.txt | head"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Users, Groups & Permissions",
    description: "User management, groups, file permissions, ACL, sudo configuration",
    icon: "Users",
    color: "from-blue-500 to-indigo-600",
    duration: "4-5 soat",
    difficulty: "Intermediate",
    examWeight: "10%",
    lessons: [
      {
        id: 1,
        title: "User Management Fundamentals",
        type: "theory",
        duration: "25 min",
        content: `
## Linux User Management

### Key Files

| File | Purpose | Example |
|------|---------|---------|
| \`/etc/passwd\` | User accounts | \`admin:x:1000:1000:Admin User:/home/admin:/bin/bash\` |
| \`/etc/shadow\` | Password hashes | \`admin:$6$salt$hash:19000:0:99999:7:::\` |
| \`/etc/group\` | Groups | \`developers:x:1001:admin,john\` |
| \`/etc/gshadow\` | Group passwords | Rarely used |

### /etc/passwd Format

\`\`\`
username:password:UID:GID:GECOS:home_dir:shell
  │         │      │   │    │       │        │
  │         │      │   │    │       │        └─ Login shell
  │         │      │   │    │       └─ Home directory
  │         │      │   │    └─ Comment/Full name
  │         │      │   └─ Primary group ID
  │         │      └─ User ID
  │         └─ x = password in /etc/shadow
  └─ Username
\`\`\`

### User Management Commands

\`\`\`bash
# Create user
useradd -m -s /bin/bash -c "John Developer" john
useradd -m -G developers,docker -s /bin/bash jane  # with groups

# Modify user
usermod -aG sudo john          # Add to sudo group
usermod -s /sbin/nologin john  # Disable shell
usermod -L john                # Lock account
usermod -U john                # Unlock account

# Delete user
userdel john           # Keep home directory
userdel -r john        # Remove home directory

# Password management
passwd john            # Set password
passwd -l john         # Lock
passwd -u john         # Unlock
passwd -e john         # Expire (force change on next login)
chage -l john          # View password aging
chage -M 90 john       # Max password age 90 days
\`\`\`

### System vs Regular Users

| Type | UID Range | Purpose |
|------|-----------|---------|
| Root | 0 | Superuser |
| System | 1-999 | Services (nginx, mysql) |
| Regular | 1000+ | Human users |
        `,
        keyPoints: [
          "useradd -m — home directory yaratadi",
          "usermod -aG — mavjud groupga qo'shadi",
          "-a flag muhim! Usiz boshqa grouplardan chiqariladi",
          "passwd -e — parolni expire qiladi"
        ]
      },
      {
        id: 2,
        title: "File Permissions Deep Dive",
        type: "theory",
        duration: "30 min",
        content: `
## Linux File Permissions

### Permission Bits

\`\`\`
-rwxrw-r-- 1 admin developers 4096 Jan 30 10:00 script.sh
│└┬┘└┬┘└┬┘
│ │  │  └─ Others (o) - boshqa hammasi
│ │  └──── Group (g) - file group
│ └─────── User (u) - file owner
└───────── File type (- file, d directory, l link)
\`\`\`

### Permission Values

| Permission | Letter | Octal | On File | On Directory |
|------------|--------|-------|---------|--------------|
| Read | r | 4 | View content | List files |
| Write | w | 2 | Modify content | Create/delete files |
| Execute | x | 1 | Run as program | Enter directory |

### Chmod — Symbolic & Octal

\`\`\`bash
# Symbolic mode
chmod u+x script.sh      # Add execute for user
chmod g-w file.txt       # Remove write from group
chmod o=r file.txt       # Set others to read only
chmod a+r file.txt       # Add read for all
chmod u=rwx,g=rx,o= file # Full specification

# Octal mode
chmod 755 script.sh      # rwxr-xr-x
chmod 644 file.txt       # rw-r--r--
chmod 700 private/       # rwx------
chmod 600 secret.key     # rw-------
\`\`\`

### Common Permission Patterns

| Octal | Symbolic | Use Case |
|-------|----------|----------|
| 755 | rwxr-xr-x | Scripts, executables |
| 644 | rw-r--r-- | Config files |
| 600 | rw------- | Private keys, secrets |
| 700 | rwx------ | Private directories |
| 775 | rwxrwxr-x | Shared directories |

### Special Permissions

\`\`\`bash
# SUID (4) — Execute as file owner
chmod u+s /usr/bin/passwd   # chmod 4755
ls -l → -rwsr-xr-x

# SGID (2) — Execute as group / inherit group
chmod g+s /shared/dir       # chmod 2775
ls -l → drwxrwsr-x

# Sticky bit (1) — Only owner can delete
chmod +t /tmp               # chmod 1777
ls -l → drwxrwxrwt
\`\`\`
        `,
        keyPoints: [
          "r=4, w=2, x=1 — qo'shib octal hosil qiling",
          "SUID=4000, SGID=2000, Sticky=1000",
          "Directory execute = kirish huquqi",
          "Sticky bit — /tmp da ishlatiladi"
        ]
      },
      {
        id: 3,
        title: "Permissions Lab",
        type: "lab",
        duration: "35 min",
        content: `
## Lab: Permissions Mastery

### Setup

\`\`\`bash
# Users va groups yaratish
sudo groupadd developers
sudo groupadd qa
sudo useradd -m -G developers dev1
sudo useradd -m -G developers dev2
sudo useradd -m -G qa tester1

# Project directory
sudo mkdir -p /projects/webapp
sudo chown root:developers /projects/webapp
sudo chmod 2775 /projects/webapp  # SGID
\`\`\`

### Tasks

**Task 1:** SGID directory yarating

\`\`\`bash
sudo mkdir /shared/team
sudo chown :developers /shared/team
sudo chmod 2775 /shared/team

# Test
sudo -u dev1 touch /shared/team/file1.txt
ls -l /shared/team/file1.txt  # Group = developers bo'lishi kerak
\`\`\`

**Task 2:** Restricted delete directory (Sticky)

\`\`\`bash
sudo mkdir /shared/public
sudo chmod 1777 /shared/public

# Test
sudo -u dev1 touch /shared/public/dev1-file.txt
sudo -u dev2 rm /shared/public/dev1-file.txt  # Permission denied
\`\`\`

**Task 3:** Script execution

\`\`\`bash
cat << 'EOF' > /tmp/test.sh
#!/bin/bash
echo "Running as: $(whoami)"
echo "Effective UID: $EUID"
EOF

chmod 755 /tmp/test.sh
/tmp/test.sh
\`\`\`

**Task 4:** Umask tushunish

\`\`\`bash
# Default umask ko'rish
umask

# File/dir yaratish
touch /tmp/testfile
mkdir /tmp/testdir
ls -la /tmp/test*

# Umask o'zgartirish
umask 027  # files: 640, dirs: 750
touch /tmp/newfile
ls -l /tmp/newfile
\`\`\`

### Umask Calculation

\`\`\`
Default file: 666
Default dir:  777
Umask:        022
─────────────────
File result:  644 (666 - 022)
Dir result:   755 (777 - 022)
\`\`\`
        `,
        commands: [
          { cmd: "chmod 2775 dir", desc: "SGID qo'yish" },
          { cmd: "chmod 1777 dir", desc: "Sticky bit qo'yish" },
          { cmd: "chown user:group file", desc: "Owner va group o'zgartirish" },
          { cmd: "umask 027", desc: "Default permissions o'zgartirish" }
        ]
      },
      {
        id: 4,
        title: "ACL — Access Control Lists",
        type: "theory",
        duration: "25 min",
        content: `
## ACL — Fine-grained Permissions

Standard permissions cheklangan: owner, group, others. ACL — specific user/group uchun permissions berish imkonini beradi.

### ACL Commands

\`\`\`bash
# View ACL
getfacl /path/to/file

# Set ACL for user
setfacl -m u:john:rwx /shared/file

# Set ACL for group
setfacl -m g:developers:rx /shared/dir

# Remove ACL entry
setfacl -x u:john /shared/file

# Remove all ACL
setfacl -b /shared/file

# Default ACL (for new files in directory)
setfacl -d -m g:developers:rwx /shared/dir

# Recursive
setfacl -R -m u:john:rx /shared/project
\`\`\`

### Real Scenario

\`\`\`bash
# Project folder: developers = full, qa = read, manager = read
sudo mkdir /projects/alpha
sudo setfacl -m g:developers:rwx /projects/alpha
sudo setfacl -m g:qa:rx /projects/alpha
sudo setfacl -m u:manager:rx /projects/alpha

# Verify
getfacl /projects/alpha
\`\`\`

### ACL Mask

\`\`\`bash
# Mask limits maximum permissions
getfacl file
# mask::r-x means: no write for any ACL entry

# Set mask
setfacl -m m::rx /shared/file
\`\`\`

### Identifying ACL Files

\`\`\`bash
ls -l /shared/
# + belgisi ACL borligini ko'rsatadi
# -rw-rwxr--+ 1 admin admin 0 Jan 30 file.txt
#          ^
\`\`\`
        `,
        keyPoints: [
          "ACL — standard permissions ustiga qo'shimcha",
          "setfacl -m u:user:rwx — user uchun ACL",
          "setfacl -d — default ACL (yangi fayllar uchun)",
          "+ belgisi — fayl ACL borligini bildiradi"
        ]
      },
      {
        id: 5,
        title: "Sudo Configuration",
        type: "theory",
        duration: "20 min",
        content: `
## Sudo — Superuser Do

### Sudoers File

\`\`\`bash
# Edit (ALWAYS use visudo!)
sudo visudo

# Format:
# user    host=(runas)    commands
admin   ALL=(ALL)       ALL
john    ALL=(ALL)       /usr/bin/systemctl restart nginx

# Group (% prefix)
%wheel  ALL=(ALL)       ALL
%developers ALL=(ALL)   NOPASSWD: /usr/bin/docker

# No password
admin   ALL=(ALL)       NOPASSWD: ALL
\`\`\`

### Sudoers.d Directory

\`\`\`bash
# Better practice: separate files
sudo visudo -f /etc/sudoers.d/developers

# Content:
%developers ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, \\
                                /usr/bin/systemctl status nginx
\`\`\`

### Sudo Aliases

\`\`\`bash
# /etc/sudoers
User_Alias ADMINS = john, jane, bob
Cmnd_Alias SERVICES = /usr/bin/systemctl start *, \\
                      /usr/bin/systemctl stop *, \\
                      /usr/bin/systemctl restart *
Host_Alias WEBSERVERS = web1, web2, web3

ADMINS WEBSERVERS=(ALL) SERVICES
\`\`\`

### Common Sudo Usage

\`\`\`bash
sudo -l                 # List allowed commands
sudo -u postgres psql   # Run as different user
sudo -i                 # Interactive root shell
sudo -s                 # Shell as root (keep env)
sudo !!                 # Re-run last command with sudo
\`\`\`
        `,
        keyPoints: [
          "ALWAYS use visudo — syntax check qiladi",
          "NOPASSWD — password so'ramaydi",
          "/etc/sudoers.d/ — modular configuration",
          "sudo -l — permissions ro'yxatini ko'rish"
        ]
      },
      {
        id: 6,
        title: "Module 2 Quiz",
        type: "quiz",
        duration: "15 min",
        questions: [
          {
            id: 1,
            question: "usermod -aG docker john buyrug'ida -a flag nima qiladi?",
            options: [
              "Admin privileges beradi",
              "User'ni boshqa grouplardan chiqarmasdan qo'shadi",
              "Account'ni activate qiladi",
              "Automatic password yaratadi"
            ],
            correct: 1,
            explanation: "-a = append. Usiz usermod -G faqat ko'rsatilgan group'ga qo'yadi va boshqalardan chiqaradi!"
          },
          {
            id: 2,
            question: "chmod 4755 file nima qiladi?",
            options: [
              "File'ni encrypt qiladi",
              "SUID bit o'rnatadi",
              "Sticky bit o'rnatadi",
              "SGID bit o'rnatadi"
            ],
            correct: 1,
            explanation: "4 = SUID. File execute qilinganda owner permissions bilan ishlaydi (/usr/bin/passwd misoli)."
          },
          {
            id: 3,
            question: "Directory'da sticky bit (chmod +t) nima qiladi?",
            options: [
              "Faqat root o'zgartira oladi",
              "Faqat fayl owner'i o'z faylini o'chira oladi",
              "Directory read-only bo'ladi",
              "Yangi fayllar executable bo'ladi"
            ],
            correct: 1,
            explanation: "Sticky bit — /tmp kabi shared directories uchun. Har kim yozishi mumkin, lekin faqat owner o'chira oladi."
          },
          {
            id: 4,
            question: "setfacl -d -m g:devs:rwx /shared nima qiladi?",
            options: [
              "devs guruhiga /shared uchun rwx beradi",
              "Default ACL yaratadi — /shared ichidagi yangi fayllar devs:rwx oladi",
              "devs guruhidan rwx olib tashlaydi",
              "Directory'ni o'chiradi"
            ],
            correct: 1,
            explanation: "-d = default ACL. Bu directory ichida yaratiladigan YANGI fayllar uchun avtomatik ACL qo'yadi."
          },
          {
            id: 5,
            question: "sudo visudo o'rniga sudo nano /etc/sudoers ishlatish nima uchun xavfli?",
            options: [
              "nano root uchun ishlamaydi",
              "Syntax error bo'lsa sudo umuman ishlamay qolishi mumkin",
              "Fayl encrypt bo'lib qoladi",
              "Hech qanday farqi yo'q"
            ],
            correct: 1,
            explanation: "visudo syntax check qiladi. Xato sudoers tizimni lock qilib qo'yishi mumkin — root ham kiralmaydi!"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Process & Service Management",
    description: "systemd, services, boot process, cron, process management",
    icon: "Cpu",
    color: "from-purple-500 to-pink-600",
    duration: "5-6 soat",
    difficulty: "Intermediate",
    examWeight: "20%",
    lessons: [
      {
        id: 1,
        title: "Systemd Deep Dive",
        type: "theory",
        duration: "30 min",
        content: `
## Systemd — Modern Init System

### Key Concepts

- **Unit** — systemd boshqaradigan resurs (service, socket, mount, timer, etc.)
- **Target** — unit'lar guruhi (runlevel analogi)
- **Journal** — centralized logging

### Systemctl Commands

\`\`\`bash
# Service management
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx    # Config reload (no downtime)
systemctl status nginx

# Enable/disable (boot time)
systemctl enable nginx    # Start on boot
systemctl disable nginx
systemctl is-enabled nginx

# List services
systemctl list-units --type=service
systemctl list-units --type=service --state=running
systemctl list-unit-files --type=service

# Failed services
systemctl --failed

# Dependencies
systemctl list-dependencies nginx
\`\`\`

### Unit File Structure

\`\`\`ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target
Wants=postgresql.service

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/start.sh
ExecStop=/opt/myapp/bin/stop.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
\`\`\`

### Service Types

| Type | Description |
|------|-------------|
| simple | Default, main process = ExecStart |
| forking | Traditional daemon (forks) |
| oneshot | Short-lived tasks |
| notify | Signals systemd when ready |

### Targets (Runlevels)

\`\`\`bash
# View current target
systemctl get-default

# Change default
systemctl set-default multi-user.target

# Available targets
systemctl list-units --type=target
\`\`\`

| Target | Runlevel | Description |
|--------|----------|-------------|
| poweroff.target | 0 | Shutdown |
| rescue.target | 1 | Single user |
| multi-user.target | 3 | Multi-user, no GUI |
| graphical.target | 5 | GUI |
| reboot.target | 6 | Reboot |
        `,
        keyPoints: [
          "systemctl enable — boot'da start qiladi",
          "Unit file: /etc/systemd/system/ (custom)",
          "daemon-reload — unit file o'zgarsa",
          "journalctl -u service — service logs"
        ]
      },
      {
        id: 2,
        title: "Process Management",
        type: "theory",
        duration: "25 min",
        content: `
## Process Management

### Viewing Processes

\`\`\`bash
# ps — snapshot
ps aux                    # All processes
ps -ef                    # Full format
ps aux --sort=-%mem       # Sort by memory
ps aux --sort=-%cpu       # Sort by CPU
ps -u username            # User's processes

# top — real-time
top
htop                      # Interactive version

# Process tree
pstree
pstree -p                 # With PIDs
\`\`\`

### Signals

\`\`\`bash
# Send signals
kill PID                  # SIGTERM (15) - graceful
kill -9 PID               # SIGKILL (9) - force
kill -HUP PID             # SIGHUP (1) - reload config

# Kill by name
pkill nginx
killall nginx

# Signal list
kill -l
\`\`\`

### Common Signals

| Signal | Number | Action |
|--------|--------|--------|
| SIGTERM | 15 | Graceful shutdown |
| SIGKILL | 9 | Force kill (can't ignore) |
| SIGHUP | 1 | Reload config |
| SIGSTOP | 19 | Pause process |
| SIGCONT | 18 | Resume process |

### Background Jobs

\`\`\`bash
# Run in background
command &
nohup command &           # Survives logout

# Job control
jobs                      # List jobs
fg %1                     # Bring to foreground
bg %1                     # Send to background
Ctrl+Z                    # Suspend current job

# Disown
disown %1                 # Remove from shell's job table
\`\`\`

### Nice & Priority

\`\`\`bash
# Nice values: -20 (highest) to 19 (lowest)
nice -n 10 command        # Start with nice 10
renice -n 5 -p PID        # Change running process
renice -n -10 -p PID      # Higher priority (root only)
\`\`\`
        `,
        keyPoints: [
          "SIGTERM = graceful, SIGKILL = force",
          "nohup — process survives logout",
          "nice — CPU priority belgilash",
          "Ctrl+Z suspend, bg background'ga"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Networking Fundamentals",
    description: "IP configuration, routing, firewall, ss/netstat, DNS, troubleshooting",
    icon: "Network",
    color: "from-cyan-500 to-blue-600",
    duration: "5-6 soat",
    difficulty: "Intermediate",
    examWeight: "12%",
    lessons: [
      {
        id: 1,
        title: "IP Configuration & Tools",
        type: "theory",
        duration: "25 min",
        content: `
## Network Configuration in Linux

### Essential Commands

\`\`\`bash
# IP address ko'rish
ip addr show
ip a                     # qisqa variant

# Specific interface
ip addr show eth0

# IP qo'shish (temporary)
ip addr add 192.168.1.100/24 dev eth0

# IP o'chirish
ip addr del 192.168.1.100/24 dev eth0

# Interface up/down
ip link set eth0 up
ip link set eth0 down
\`\`\`

### Routing

\`\`\`bash
# Routing table
ip route show
ip r

# Default gateway qo'shish
ip route add default via 192.168.1.1

# Specific network route
ip route add 10.0.0.0/8 via 192.168.1.254

# Route o'chirish
ip route del 10.0.0.0/8
\`\`\`

### ss Command (netstat replacement)

\`\`\`bash
# Barcha listening portlar
ss -tuln

# TCP connections
ss -t

# Process bilan
ss -tulnp

# Specific port
ss -tuln | grep :80

# Statistics
ss -s
\`\`\`

### DNS Configuration

\`\`\`bash
# /etc/resolv.conf
nameserver 8.8.8.8
nameserver 8.8.4.4
search example.com

# DNS test
dig google.com
nslookup google.com
host google.com
\`\`\`
        `,
        keyPoints: [
          "ip addr — interface configuration",
          "ip route — routing table",
          "ss -tuln — listening ports",
          "/etc/resolv.conf — DNS settings"
        ]
      },
      {
        id: 2,
        title: "Firewall Configuration",
        type: "lab",
        duration: "35 min",
        content: `
## Firewall Lab — firewalld & iptables

### firewalld (RHEL/CentOS/Fedora)

\`\`\`bash
# Status
systemctl status firewalld
firewall-cmd --state

# Zones
firewall-cmd --get-zones
firewall-cmd --get-default-zone
firewall-cmd --get-active-zones

# Services
firewall-cmd --list-services
firewall-cmd --add-service=http --permanent
firewall-cmd --add-service=https --permanent

# Ports
firewall-cmd --add-port=8080/tcp --permanent
firewall-cmd --remove-port=8080/tcp --permanent

# Apply changes
firewall-cmd --reload
\`\`\`

### iptables (Traditional)

\`\`\`bash
# List rules
iptables -L -n -v

# Allow SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop all other incoming
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables.rules
\`\`\`
        `,
        commands: [
          { cmd: "firewall-cmd --list-all", desc: "Show all firewall rules" },
          { cmd: "ss -tuln", desc: "List listening ports" },
          { cmd: "ip route show", desc: "Show routing table" }
        ]
      },
      {
        id: 3,
        title: "Network Troubleshooting",
        type: "theory",
        duration: "20 min",
        content: `
## Network Troubleshooting

### Connectivity Tests

\`\`\`bash
# Ping
ping -c 4 google.com
ping -c 4 8.8.8.8

# Traceroute
traceroute google.com
tracepath google.com

# MTR (combined ping + traceroute)
mtr google.com
\`\`\`

### Port Testing

\`\`\`bash
# Telnet
telnet google.com 80

# Netcat
nc -zv google.com 443

# curl
curl -v http://example.com
\`\`\`

### Common Issues

| Symptom | Check | Solution |
|---------|-------|----------|
| No IP address | ip addr | DHCP or static config |
| No gateway | ip route | Add default route |
| DNS fails | /etc/resolv.conf | Add nameservers |
| Port blocked | firewall-cmd --list-all | Open port |
| Service not listening | ss -tuln | Start service |
        `,
        keyPoints: [
          "ping — basic connectivity",
          "traceroute — path to destination",
          "nc -zv — port connectivity test",
          "dig/nslookup — DNS troubleshooting"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Storage Management",
    description: "LVM, partitions, mount, fstab, swap, disk troubleshooting",
    icon: "HardDrive",
    color: "from-orange-500 to-red-600",
    duration: "5-6 soat",
    difficulty: "Advanced",
    examWeight: "13%",
    lessons: [
      {
        id: 1,
        title: "Disk Partitioning",
        type: "theory",
        duration: "25 min",
        content: `
## Disk Partitioning in Linux

### Viewing Disks

\`\`\`bash
# List block devices
lsblk
lsblk -f    # with filesystem info

# Disk info
fdisk -l
parted -l

# Disk usage
df -h
df -hT      # with filesystem type
\`\`\`

### fdisk — MBR Partitions

\`\`\`bash
fdisk /dev/sdb

# Commands:
# n - new partition
# d - delete partition
# p - print partition table
# t - change partition type
# w - write changes
# q - quit without saving
\`\`\`

### parted — GPT Partitions

\`\`\`bash
parted /dev/sdb

# Create GPT label
mklabel gpt

# Create partition
mkpart primary ext4 0% 50%
mkpart primary xfs 50% 100%

# Print
print
\`\`\`

### Filesystem Creation

\`\`\`bash
# ext4
mkfs.ext4 /dev/sdb1

# xfs
mkfs.xfs /dev/sdb2

# Check filesystem
fsck /dev/sdb1
xfs_repair /dev/sdb2
\`\`\`
        `,
        keyPoints: [
          "lsblk — disk va partition ko'rish",
          "fdisk — MBR partitions",
          "parted — GPT partitions",
          "mkfs.ext4/xfs — filesystem yaratish"
        ]
      },
      {
        id: 2,
        title: "LVM — Logical Volume Manager",
        type: "lab",
        duration: "40 min",
        content: `
## LVM Configuration Lab

### LVM Architecture

\`\`\`
Physical Volumes (PV) → Volume Groups (VG) → Logical Volumes (LV)
   /dev/sdb1        →      data_vg        →     app_lv
   /dev/sdc1        →                     →     db_lv
\`\`\`

### Creating LVM

\`\`\`bash
# 1. Physical Volumes
pvcreate /dev/sdb /dev/sdc
pvs
pvdisplay

# 2. Volume Group
vgcreate data_vg /dev/sdb /dev/sdc
vgs
vgdisplay

# 3. Logical Volumes
lvcreate -n app_lv -L 10G data_vg
lvcreate -n db_lv -l 100%FREE data_vg
lvs
lvdisplay

# 4. Filesystem
mkfs.ext4 /dev/data_vg/app_lv
mkfs.xfs /dev/data_vg/db_lv

# 5. Mount
mkdir -p /mnt/{app,db}
mount /dev/data_vg/app_lv /mnt/app
mount /dev/data_vg/db_lv /mnt/db
\`\`\`

### Extending LVM

\`\`\`bash
# Extend LV
lvextend -L +5G /dev/data_vg/app_lv

# Resize filesystem
resize2fs /dev/data_vg/app_lv  # ext4
xfs_growfs /mnt/db             # xfs (uses mount point)
\`\`\`
        `,
        commands: [
          { cmd: "pvs && vgs && lvs", desc: "Show all LVM components" },
          { cmd: "lvcreate -n test_lv -L 1G data_vg", desc: "Create 1GB logical volume" },
          { cmd: "lvextend -L +500M /dev/data_vg/test_lv", desc: "Extend by 500MB" }
        ]
      },
      {
        id: 3,
        title: "Mount & fstab",
        type: "theory",
        duration: "20 min",
        content: `
## Mounting Filesystems

### mount Command

\`\`\`bash
# Basic mount
mount /dev/sdb1 /mnt/data

# With options
mount -o ro /dev/sdb1 /mnt/data        # read-only
mount -o noexec /dev/sdb1 /mnt/data    # no execute

# Mount all from fstab
mount -a

# Unmount
umount /mnt/data
umount -l /mnt/data    # lazy unmount (busy)
\`\`\`

### /etc/fstab Format

\`\`\`
# device          mount-point    type    options        dump  pass
/dev/sda1         /              ext4    defaults       1     1
/dev/data_vg/app  /mnt/app       ext4    defaults       0     2
UUID=xxxx         /mnt/data      xfs     defaults,noatime  0  2
\`\`\`

### Finding UUID

\`\`\`bash
blkid
lsblk -f
ls -l /dev/disk/by-uuid/
\`\`\`

### Swap

\`\`\`bash
# Create swap file
dd if=/dev/zero of=/swapfile bs=1M count=1024
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# fstab entry
/swapfile  none  swap  sw  0  0

# Check swap
swapon --show
free -h
\`\`\`
        `,
        keyPoints: [
          "mount -o — mount options",
          "/etc/fstab — persistent mounts",
          "UUID — device identification",
          "swapon/swapoff — swap management"
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Package Management",
    description: "yum/dnf, apt, rpm, dpkg, repositories, dependency management",
    icon: "Package",
    color: "from-teal-500 to-green-600",
    duration: "3-4 soat",
    difficulty: "Intermediate",
    examWeight: "8%",
    lessons: [
      {
        id: 1,
        title: "RPM & YUM/DNF",
        type: "theory",
        duration: "25 min",
        content: `
## Package Management — RHEL/CentOS/Fedora

### RPM — Low Level

\`\`\`bash
# Install
rpm -ivh package.rpm

# Upgrade
rpm -Uvh package.rpm

# Remove
rpm -e package-name

# Query installed
rpm -qa | grep nginx
rpm -qi nginx          # info
rpm -ql nginx          # list files
rpm -qf /usr/bin/vim   # which package owns file

# Verify
rpm -V nginx
\`\`\`

### YUM/DNF — High Level

\`\`\`bash
# Search
yum search nginx
dnf search nginx

# Install
yum install nginx -y
dnf install nginx -y

# Remove
yum remove nginx
dnf remove nginx

# Update
yum update
dnf upgrade

# Info
yum info nginx

# List installed
yum list installed

# Clean cache
yum clean all
\`\`\`

### Repositories

\`\`\`bash
# List repos
yum repolist
yum repolist all

# Add repo
yum-config-manager --add-repo URL

# Enable/disable
yum-config-manager --enable repo-name
yum-config-manager --disable repo-name

# Repo files: /etc/yum.repos.d/
\`\`\`
        `,
        keyPoints: [
          "rpm -qa — query all packages",
          "yum/dnf — dependency resolution",
          "/etc/yum.repos.d/ — repository configs",
          "yum clean all — cache tozalash"
        ]
      },
      {
        id: 2,
        title: "APT & DPKG",
        type: "theory",
        duration: "25 min",
        content: `
## Package Management — Debian/Ubuntu

### DPKG — Low Level

\`\`\`bash
# Install
dpkg -i package.deb

# Remove
dpkg -r package-name
dpkg -P package-name    # purge (with configs)

# Query
dpkg -l | grep nginx
dpkg -L nginx           # list files
dpkg -S /usr/bin/vim    # which package owns file

# Reconfigure
dpkg-reconfigure package
\`\`\`

### APT — High Level

\`\`\`bash
# Update package list
apt update

# Upgrade packages
apt upgrade
apt full-upgrade

# Install
apt install nginx

# Remove
apt remove nginx
apt purge nginx         # with configs
apt autoremove          # unused dependencies

# Search
apt search nginx
apt show nginx

# List
apt list --installed
apt list --upgradable
\`\`\`

### Repositories

\`\`\`bash
# Sources list
/etc/apt/sources.list
/etc/apt/sources.list.d/

# Add PPA (Ubuntu)
add-apt-repository ppa:user/repo
apt update
\`\`\`
        `,
        keyPoints: [
          "apt update — package list yangilash",
          "apt upgrade — packages yangilash",
          "dpkg -l — installed packages",
          "/etc/apt/sources.list — repositories"
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Logging & Monitoring",
    description: "journald, rsyslog, log rotation, system monitoring tools",
    icon: "FileText",
    color: "from-yellow-500 to-orange-600",
    duration: "3-4 soat",
    difficulty: "Intermediate",
    examWeight: "5%",
    lessons: [
      {
        id: 1,
        title: "System Logging",
        type: "theory",
        duration: "25 min",
        content: `
## System Logging in Linux

### journalctl — systemd journal

\`\`\`bash
# All logs
journalctl

# Follow (tail -f style)
journalctl -f

# Boot logs
journalctl -b           # current boot
journalctl -b -1        # previous boot

# By unit
journalctl -u nginx
journalctl -u nginx -f

# By priority
journalctl -p err       # errors and above
journalctl -p warning

# Time range
journalctl --since "2024-01-01"
journalctl --since "1 hour ago"
journalctl --since "09:00" --until "10:00"

# Disk usage
journalctl --disk-usage
journalctl --vacuum-size=500M
\`\`\`

### Traditional Log Files

\`\`\`bash
# System logs
/var/log/messages       # RHEL/CentOS
/var/log/syslog         # Debian/Ubuntu

# Auth logs
/var/log/secure         # RHEL
/var/log/auth.log       # Debian

# Other important logs
/var/log/boot.log
/var/log/dmesg
/var/log/cron
/var/log/maillog
\`\`\`

### Log Rotation

\`\`\`bash
# Config: /etc/logrotate.conf
# Per-app: /etc/logrotate.d/

# Example config
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 nginx nginx
}

# Manual rotation
logrotate -f /etc/logrotate.d/nginx
\`\`\`
        `,
        keyPoints: [
          "journalctl -u service — service logs",
          "journalctl -f — follow mode",
          "/var/log/ — traditional logs",
          "logrotate — automatic log rotation"
        ]
      },
      {
        id: 2,
        title: "System Monitoring",
        type: "lab",
        duration: "30 min",
        content: `
## System Monitoring Tools

### CPU & Memory

\`\`\`bash
# Real-time
top
htop

# Snapshot
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# Memory
free -h
vmstat 1 5

# CPU info
lscpu
cat /proc/cpuinfo
\`\`\`

### Disk I/O

\`\`\`bash
# iostat
iostat -x 1 5

# iotop (requires package)
iotop

# Disk usage
df -h
du -sh /var/*
\`\`\`

### Network

\`\`\`bash
# Connections
ss -tuln
netstat -tuln

# Traffic
iftop
nethogs

# Bandwidth test
iperf3 -s        # server
iperf3 -c IP     # client
\`\`\`

### System Info

\`\`\`bash
uptime
uname -a
hostnamectl
timedatectl
\`\`\`
        `,
        commands: [
          { cmd: "top -bn1 | head -20", desc: "CPU/Memory snapshot" },
          { cmd: "free -h", desc: "Memory usage" },
          { cmd: "df -hT", desc: "Disk usage with filesystem type" }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Security",
    description: "SELinux, AppArmor, firewalld, iptables, SSH hardening",
    icon: "Shield",
    color: "from-red-500 to-pink-600",
    duration: "5-6 soat",
    difficulty: "Advanced",
    examWeight: "7%",
    lessons: []
  },
  {
    id: 9,
    title: "Bash Scripting",
    description: "Variables, loops, conditions, functions, automation scripts",
    icon: "Code",
    color: "from-violet-500 to-purple-600",
    duration: "4-5 soat",
    difficulty: "Intermediate",
    examWeight: "5%",
    lessons: []
  },
  {
    id: 10,
    title: "Backup & Recovery",
    description: "Backup strategies, rsync, cron jobs, disaster recovery",
    icon: "Database",
    color: "from-emerald-500 to-teal-600",
    duration: "3-4 soat",
    difficulty: "Intermediate",
    examWeight: "5%",
    lessons: []
  },
  {
    id: 11,
    title: "Containers",
    description: "Docker/Podman basics, images, containers, volumes",
    icon: "Box",
    color: "from-sky-500 to-indigo-600",
    duration: "4-5 soat",
    difficulty: "Intermediate",
    examWeight: "5%",
    lessons: []
  },
  {
    id: 12,
    title: "LFCS Exam Simulation",
    description: "Full practice exam, time-limited tasks, real exam environment",
    icon: "Award",
    color: "from-amber-500 to-yellow-600",
    duration: "2 soat",
    difficulty: "Exam",
    examWeight: "100%",
    lessons: []
  }
];

export const examDomains = [
  { name: "Essential Commands", weight: 25, modules: [1] },
  { name: "Operation of Running Systems", weight: 20, modules: [3] },
  { name: "User and Group Management", weight: 10, modules: [2] },
  { name: "Networking", weight: 12, modules: [4] },
  { name: "Service Configuration", weight: 20, modules: [3, 6, 7] },
  { name: "Storage Management", weight: 13, modules: [5] },
];
