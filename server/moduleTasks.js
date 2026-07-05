// Practical terminal tasks per module.
// Shape: { [moduleId]: [{ id, title, description, hint, seed, solution, checks: [{name, cmd}] }] }
// Every task is container-verified: checks fail on a fresh seeded container
// and all pass after running the reference solution (see scratchpad/verify_banks.py).
export const moduleTasks = {
  "1": [
    {
      "id": 1,
      "title": "Katalog daraxtini yaratish",
      "description": "Bitta buyruq bilan /opt/proj katalogi ichida src, docs va logs kataloglarini yarating (barcha oraliq kataloglar bilan birga). So'ngra /opt/proj/docs ichida README.md nomli bo'sh fayl yarating.",
      "hint": "mkdir -p va {a,b,c} brace expansion, bo'sh fayl uchun touch.",
      "seed": "",
      "solution": "mkdir -p /opt/proj/{src,docs,logs}\ntouch /opt/proj/docs/README.md",
      "checks": [
        {
          "name": "src, docs, logs kataloglari mavjud",
          "cmd": "[ -d /opt/proj/src ] && [ -d /opt/proj/docs ] && [ -d /opt/proj/logs ]"
        },
        {
          "name": "README.md fayli yaratilgan",
          "cmd": "[ -f /opt/proj/docs/README.md ]"
        }
      ]
    },
    {
      "id": 2,
      "title": "Nusxalash va ko'chirish",
      "description": "/etc/hosts faylini /opt/files/hosts.bak nomi bilan nusxalang (katalogni ham yarating). So'ngra /opt/files/draft.txt faylini xuddi shu katalog ichida final.txt nomiga o'zgartiring (draft.txt qolmasin).",
      "hint": "cp — nusxalash, mv — ko'chirish/nomini o'zgartirish.",
      "seed": "mkdir -p /opt/files\necho 'qoralama matn' > /opt/files/draft.txt",
      "solution": "mkdir -p /opt/files\ncp /etc/hosts /opt/files/hosts.bak\nmv /opt/files/draft.txt /opt/files/final.txt",
      "checks": [
        {
          "name": "hosts.bak nusxalangan",
          "cmd": "[ -f /opt/files/hosts.bak ] && grep -q localhost /opt/files/hosts.bak"
        },
        {
          "name": "final.txt mavjud, draft.txt yo'q",
          "cmd": "[ -f /opt/files/final.txt ] && [ ! -e /opt/files/draft.txt ]"
        },
        {
          "name": "final.txt mazmuni saqlangan",
          "cmd": "grep -q 'qoralama matn' /opt/files/final.txt"
        }
      ]
    },
    {
      "id": 3,
      "title": "Ustunlarni ajratib olish",
      "description": "/opt/data/staff.csv faylida xodimlar ro'yxati bor (format: id,ism,bo'lim). Faqat ism ustunini (2-maydon) ajratib olib, /root/names.txt fayliga yozing — qatorlar tartibi o'zgarmasin, sarlavha qatori ham kirsin.",
      "hint": "cut -d',' -f2 va > bilan faylga yo'naltirish.",
      "seed": "mkdir -p /opt/data\nprintf 'id,ism,bolim\\n1,Alisher,IT\\n2,Bobur,HR\\n3,Dilnoza,IT\\n4,Erkin,Finance\\n' > /opt/data/staff.csv",
      "solution": "cut -d',' -f2 /opt/data/staff.csv > /root/names.txt",
      "checks": [
        {
          "name": "names.txt yaratilgan",
          "cmd": "[ -f /root/names.txt ]"
        },
        {
          "name": "Mazmuni to'g'ri",
          "cmd": "[ \"$(cat /root/names.txt)\" = \"$(printf 'ism\\nAlisher\\nBobur\\nDilnoza\\nErkin')\" ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Buyruq joylashuvi va fayl turi",
      "description": "which yordamida tar buyrug'ining to'liq yo'lini /root/tar-path.txt fayliga yozing. So'ngra file buyrug'i bilan /bin/bash faylining turini aniqlab, chiqishni /root/bash-type.txt fayliga saqlang.",
      "hint": "which tar > fayl va file /bin/bash > fayl.",
      "seed": "",
      "solution": "which tar > /root/tar-path.txt\nfile /bin/bash > /root/bash-type.txt",
      "checks": [
        {
          "name": "tar yo'li to'g'ri",
          "cmd": "grep -Eq '^/(usr/)?bin/tar$' /root/tar-path.txt"
        },
        {
          "name": "bash turi aniqlangan (ELF)",
          "cmd": "grep -q 'ELF' /root/bash-type.txt"
        }
      ]
    },
    {
      "id": 5,
      "title": "Soft link va hard link",
      "description": "/opt/links/data.txt fayliga /opt/links/data-soft nomli symbolic link va /opt/links/data-hard nomli hard link yarating.",
      "hint": "ln -s — symbolic, ln (flagsiz) — hard link.",
      "seed": "mkdir -p /opt/links\necho 'asosiy fayl' > /opt/links/data.txt",
      "solution": "ln -s /opt/links/data.txt /opt/links/data-soft\nln /opt/links/data.txt /opt/links/data-hard",
      "checks": [
        {
          "name": "data-soft — symbolic link",
          "cmd": "[ -L /opt/links/data-soft ] && [ \"$(readlink -f /opt/links/data-soft)\" = \"/opt/links/data.txt\" ]"
        },
        {
          "name": "data-hard — hard link (bir xil inode)",
          "cmd": "[ ! -L /opt/links/data-hard ] && [ \"$(stat -c %i /opt/links/data-hard)\" = \"$(stat -c %i /opt/links/data.txt)\" ]"
        }
      ]
    },
    {
      "id": 6,
      "title": "Log ichidan xatolarni ajratish",
      "description": "/var/applog/app.log faylidan tarkibida ERROR so'zi bor qatorlarni ajratib olib, /root/errors.txt fayliga yozing (qatorlar tartibi saqlansin).",
      "hint": "grep 'ERROR' fayl > natija.",
      "seed": "mkdir -p /var/applog\nprintf '2026-01-01 INFO Server started\\n2026-01-02 ERROR Disk full\\n2026-01-03 WARN High memory\\n2026-01-04 ERROR Connection refused\\n2026-01-05 INFO Backup done\\n' > /var/applog/app.log",
      "solution": "grep ERROR /var/applog/app.log > /root/errors.txt",
      "checks": [
        {
          "name": "errors.txt da 2 qator",
          "cmd": "[ \"$(wc -l < /root/errors.txt)\" -eq 2 ]"
        },
        {
          "name": "Ikkala ERROR qatori ham bor",
          "cmd": "grep -q 'Disk full' /root/errors.txt && grep -q 'Connection refused' /root/errors.txt"
        },
        {
          "name": "INFO/WARN qatorlari yo'q",
          "cmd": "! grep -Eq 'INFO|WARN' /root/errors.txt"
        }
      ]
    },
    {
      "id": 7,
      "title": "Saralash va yo'naltirish",
      "description": "/opt/data/numbers.txt faylidagi raqamlarni sonli (numeric) tartibda o'sish bo'yicha saralab, natijani /root/sorted.txt fayliga yozing.",
      "hint": "sort -n — sonli saralash.",
      "seed": "mkdir -p /opt/data\nprintf '42\\n7\\n100\\n3\\n55\\n' > /opt/data/numbers.txt",
      "solution": "sort -n /opt/data/numbers.txt > /root/sorted.txt",
      "checks": [
        {
          "name": "sorted.txt yaratilgan",
          "cmd": "[ -f /root/sorted.txt ]"
        },
        {
          "name": "Sonli tartibda saralangan",
          "cmd": "[ \"$(cat /root/sorted.txt)\" = \"$(printf '3\\n7\\n42\\n55\\n100')\" ]"
        }
      ]
    },
    {
      "id": 8,
      "title": "Ruxsatlarni to'g'rilash",
      "description": "/opt/secure/config.ini faylining ruxsatini aynan 640 ga o'rnating. /opt/secure/run.sh skriptiga esa hamma uchun o'qish, egasi uchun yozish va bajarish ruxsatini bering (aynan 755).",
      "hint": "chmod oktal rejimda: 640 va 755.",
      "seed": "mkdir -p /opt/secure\necho 'parol=maxfiy' > /opt/secure/config.ini\nchmod 777 /opt/secure/config.ini\nprintf '#!/bin/bash\\necho ishladi\\n' > /opt/secure/run.sh\nchmod 600 /opt/secure/run.sh",
      "solution": "chmod 640 /opt/secure/config.ini\nchmod 755 /opt/secure/run.sh",
      "checks": [
        {
          "name": "config.ini — 640",
          "cmd": "[ \"$(stat -c '%a' /opt/secure/config.ini)\" = \"640\" ]"
        },
        {
          "name": "run.sh — 755",
          "cmd": "[ \"$(stat -c '%a' /opt/secure/run.sh)\" = \"755\" ]"
        }
      ]
    },
    {
      "id": 9,
      "title": "Eski fayllarni topib o'chirish",
      "description": "/var/appdata katalogida 7 kundan eski barcha .tmp kengaytmali fayllarni toping va o'chiring. Yangi .tmp fayllar va boshqa kengaytmali fayllar saqlanib qolsin.",
      "hint": "find yo'l -name '*.tmp' -mtime +7 -delete.",
      "seed": "mkdir -p /var/appdata\nfor i in 1 2 3; do touch -d '10 days ago' /var/appdata/old$i.tmp; done\ntouch -d '10 days ago' /var/appdata/keep.dat\ntouch /var/appdata/fresh.tmp",
      "solution": "find /var/appdata -name '*.tmp' -type f -mtime +7 -delete",
      "checks": [
        {
          "name": "Eski .tmp fayllar o'chirilgan",
          "cmd": "[ -z \"$(find /var/appdata -name '*.tmp' -mtime +7 2>/dev/null)\" ]"
        },
        {
          "name": "fresh.tmp saqlangan",
          "cmd": "[ -f /var/appdata/fresh.tmp ]"
        },
        {
          "name": "keep.dat saqlangan",
          "cmd": "[ -f /var/appdata/keep.dat ]"
        }
      ]
    },
    {
      "id": 10,
      "title": "Arxivlash (tar + gzip)",
      "description": "/opt/webapp katalogini butunlay gzip bilan siqilgan /backup/webapp.tar.gz arxiviga oling (/backup katalogini ham yarating). Arxiv ichida index.html fayli bo'lishi kerak.",
      "hint": "mkdir -p /backup, so'ngra tar -czf arxiv.tar.gz katalog.",
      "seed": "mkdir -p /opt/webapp/css\necho '<h1>Salom</h1>' > /opt/webapp/index.html\necho 'body{}' > /opt/webapp/css/style.css",
      "solution": "mkdir -p /backup\ntar -czf /backup/webapp.tar.gz -C /opt webapp",
      "checks": [
        {
          "name": "Arxiv yaratilgan",
          "cmd": "[ -f /backup/webapp.tar.gz ]"
        },
        {
          "name": "gzip formatida",
          "cmd": "file /backup/webapp.tar.gz | grep -qi gzip"
        },
        {
          "name": "index.html arxiv ichida",
          "cmd": "tar -tzf /backup/webapp.tar.gz | grep -q 'index.html'"
        }
      ]
    }
  ],
  "2": [
    {
      "id": 1,
      "title": "Yangi foydalanuvchi yaratish",
      "description": "Tizimda anvar nomli foydalanuvchi yarating: home katalogi /home/anvar bo'lib, u avtomatik yaratilsin, login shell /bin/bash bo'lsin va comment (GECOS) maydoni aynan \"Anvar Karimov\" bo'lsin.",
      "hint": "useradd buyrug'ining -m, -s va -c flaglaridan foydalaning.",
      "seed": "",
      "solution": "useradd -m -s /bin/bash -c 'Anvar Karimov' anvar",
      "checks": [
        {
          "name": "Foydalanuvchi mavjud",
          "cmd": "id anvar"
        },
        {
          "name": "Home va shell to'g'ri",
          "cmd": "getent passwd anvar | grep -q ':/home/anvar:/bin/bash$'"
        },
        {
          "name": "Home katalogi yaratilgan",
          "cmd": "[ -d /home/anvar ]"
        },
        {
          "name": "Comment (GECOS) to'g'ri",
          "cmd": "[ \"$(getent passwd anvar | cut -d: -f5)\" = \"Anvar Karimov\" ]"
        }
      ]
    },
    {
      "id": 2,
      "title": "Guruh yaratish va a'zolik",
      "description": "GID raqami 3500 bo'lgan devops guruhini yarating. So'ngra sardor foydalanuvchisini devops guruhiga qo'shing — bunda u avvaldan a'zo bo'lgan testers guruhida ham QOLISHI shart (append rejimi).",
      "hint": "groupadd -g bilan GID belgilang, guruhga usermod -aG bilan qo'shing (-a flagi muhim).",
      "seed": "groupadd -f testers\nid sardor >/dev/null 2>&1 || useradd -m -s /bin/bash sardor\nusermod -aG testers sardor",
      "solution": "groupadd -g 3500 devops\nusermod -aG devops sardor",
      "checks": [
        {
          "name": "devops guruhi GID 3500",
          "cmd": "[ \"$(getent group devops | cut -d: -f3)\" = \"3500\" ]"
        },
        {
          "name": "sardor devops a'zosi",
          "cmd": "id -nG sardor | grep -qw devops"
        },
        {
          "name": "testers a'zoligi saqlangan",
          "cmd": "id -nG sardor | grep -qw devops && id -nG sardor | grep -qw testers"
        }
      ]
    },
    {
      "id": 3,
      "title": "Parol eskirish siyosati",
      "description": "laylo foydalanuvchisi uchun parol siyosatini o'rnating: parolning maksimal amal qilish muddati 90 kun, minimal muddati 7 kun, ogohlantirish 14 kun bo'lsin. Shuningdek, keyingi kirishda parolni majburiy almashtirish yoqilsin (oxirgi o'zgartirilgan sana 0 qilinsin).",
      "hint": "chage buyrug'ining -M, -m, -W va -d 0 flaglarini ishlating.",
      "seed": "id laylo >/dev/null 2>&1 || useradd -m -s /bin/bash laylo\necho 'laylo:Laylo123!' | chpasswd",
      "solution": "chage -M 90 -m 7 -W 14 -d 0 laylo",
      "checks": [
        {
          "name": "Maksimal muddat 90 kun",
          "cmd": "[ \"$(getent shadow laylo | cut -d: -f5)\" = \"90\" ]"
        },
        {
          "name": "Minimal muddat 7 kun",
          "cmd": "[ \"$(getent shadow laylo | cut -d: -f4)\" = \"7\" ]"
        },
        {
          "name": "Ogohlantirish 14 kun",
          "cmd": "[ \"$(getent shadow laylo | cut -d: -f6)\" = \"14\" ]"
        },
        {
          "name": "Majburiy parol almashtirish",
          "cmd": "[ \"$(getent shadow laylo | cut -d: -f3)\" = \"0\" ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Fayl egaligi va ruxsatlar",
      "description": "/opt/reports/salary.csv faylining egasini karim, guruhini finance qiling va ruxsatlarini aynan 640 ga o'rnating. /opt/reports/backup.sh faylini root:finance egaligida aynan 750 ruxsat bilan sozlang. Tizim bo'ylab default umask uchun /etc/profile fayliga yangi qator sifatida \"umask 027\" qo'shing.",
      "hint": "chown user:group, chmod (octal 640 va 750) hamda echo >> /etc/profile dan foydalaning.",
      "seed": "groupadd -f finance\nid karim >/dev/null 2>&1 || useradd -m -s /bin/bash karim\nmkdir -p /opt/reports\nprintf 'ism,maosh\\nkarim,5000\\n' > /opt/reports/salary.csv\nchown root:root /opt/reports/salary.csv\nchmod 666 /opt/reports/salary.csv\nprintf '#!/bin/bash\\necho \"backup boshlandi\"\\n' > /opt/reports/backup.sh\nchown root:root /opt/reports/backup.sh\nchmod 644 /opt/reports/backup.sh",
      "solution": "chown karim:finance /opt/reports/salary.csv\nchmod 640 /opt/reports/salary.csv\nchown root:finance /opt/reports/backup.sh\nchmod 750 /opt/reports/backup.sh\necho 'umask 027' >> /etc/profile",
      "checks": [
        {
          "name": "salary.csv egaligi va 640",
          "cmd": "[ \"$(stat -c '%U:%G %a' /opt/reports/salary.csv)\" = \"karim:finance 640\" ]"
        },
        {
          "name": "backup.sh egaligi va 750",
          "cmd": "[ \"$(stat -c '%U:%G %a' /opt/reports/backup.sh)\" = \"root:finance 750\" ]"
        },
        {
          "name": "umask 027 /etc/profile da",
          "cmd": "grep -Eq '^[[:space:]]*umask[[:space:]]+027([[:space:]]|$)' /etc/profile"
        }
      ]
    },
    {
      "id": 5,
      "title": "SGID va Sticky bit",
      "description": "/srv/team katalogini yarating: guruhi devteam bo'lsin, ruxsatlari aynan 2770 (SGID o'rnatilgan, others uchun kirish yo'q) bo'lsin. Shuningdek /srv/public katalogini yarating va unga aynan 1777 ruxsat bering (sticky bit bilan world-writable, /tmp kabi).",
      "hint": "chown :guruh bilan guruhni o'rnating, chmod 2770 (SGID) va chmod 1777 (sticky bit) dan foydalaning.",
      "seed": "groupadd -f devteam",
      "solution": "mkdir -p /srv/team /srv/public\nchown root:devteam /srv/team\nchmod 2770 /srv/team\nchmod 1777 /srv/public",
      "checks": [
        {
          "name": "/srv/team ruxsati 2770",
          "cmd": "[ \"$(stat -c '%a' /srv/team)\" = \"2770\" ]"
        },
        {
          "name": "/srv/team guruhi devteam",
          "cmd": "[ \"$(stat -c '%G' /srv/team)\" = \"devteam\" ]"
        },
        {
          "name": "/srv/public ruxsati 1777",
          "cmd": "[ \"$(stat -c '%a' /srv/public)\" = \"1777\" ]"
        }
      ]
    },
    {
      "id": 6,
      "title": "Hisobni qulflash va zaxira",
      "description": "hacker01 hisobi buzilgan deb topildi. Uni xavfsiz o'chirish jarayonini boshlang: hisob parolini qulflang (hash oldiga ! qo'shilsin), login shellini /usr/sbin/nologin ga o'zgartiring va /home/hacker01 katalogini /root/hacker01-backup.tar.gz nomli gzip tar arxiviga zaxiralang (arxiv ichida notes.txt fayli bo'lishi kerak).",
      "hint": "usermod -L, usermod -s /usr/sbin/nologin va tar -czf buyruqlaridan foydalaning.",
      "seed": "id hacker01 >/dev/null 2>&1 || useradd -m -s /bin/bash hacker01\necho 'hacker01:Weak123!' | chpasswd\nmkdir -p /home/hacker01\necho 'maxfiy eslatmalar' > /home/hacker01/notes.txt\nchown -R hacker01:hacker01 /home/hacker01",
      "solution": "usermod -L hacker01\nusermod -s /usr/sbin/nologin hacker01\ntar -czf /root/hacker01-backup.tar.gz -C / home/hacker01",
      "checks": [
        {
          "name": "Hisob qulflangan",
          "cmd": "getent shadow hacker01 | cut -d: -f2 | grep -q '^!'"
        },
        {
          "name": "Shell nologin",
          "cmd": "getent passwd hacker01 | grep -Eq ':/(usr/)?sbin/nologin$'"
        },
        {
          "name": "Zaxira arxivi to'g'ri",
          "cmd": "[ -f /root/hacker01-backup.tar.gz ] && tar -tzf /root/hacker01-backup.tar.gz | grep -q 'notes.txt'"
        }
      ]
    },
    {
      "id": 7,
      "title": "Ruxsatlar xavfsizlik auditi",
      "description": "/opt/audit ichidagi world-writable (others yozish huquqiga ega) ODDIY fayllarning to'liq yo'llarini, har qatorda bittadan, sort qilingan holda /root/audit.txt fayliga yozing — bu ishni ruxsatlarni tuzatishdan OLDIN bajaring. So'ngra o'sha fayllardan faqat others yozish ruxsatini olib tashlang (boshqa bitlar o'zgarmasin) va /opt/audit/bin/legacy faylidan SUID bitini olib tashlang (natijaviy ruxsat 755 bo'lsin).",
      "hint": "find /opt/audit -type f -perm -0002 bilan toping, so'ng chmod o-w va chmod u-s dan foydalaning.",
      "seed": "mkdir -p /opt/audit/logs /opt/audit/bin /opt/audit/data\nprintf 'log yozuvi\\n' > /opt/audit/logs/app.log\nchmod 666 /opt/audit/logs/app.log\nprintf '#!/bin/bash\\necho ishga tushdi\\n' > /opt/audit/bin/run.sh\nchmod 777 /opt/audit/bin/run.sh\nprintf 'hujjat\\n' > /opt/audit/data/readme.txt\nchmod 644 /opt/audit/data/readme.txt\nprintf '#!/bin/bash\\necho eski dastur\\n' > /opt/audit/bin/legacy\nchmod 4755 /opt/audit/bin/legacy\nrm -f /root/audit.txt",
      "solution": "find /opt/audit -type f -perm -0002 | sort > /root/audit.txt\nxargs -r chmod o-w < /root/audit.txt\nchmod u-s /opt/audit/bin/legacy",
      "checks": [
        {
          "name": "audit.txt ro'yxati to'g'ri",
          "cmd": "[ \"$(wc -l < /root/audit.txt)\" -eq 2 ] && grep -qx '/opt/audit/logs/app.log' /root/audit.txt && grep -qx '/opt/audit/bin/run.sh' /root/audit.txt"
        },
        {
          "name": "World-writable fayl qolmagan",
          "cmd": "[ -z \"$(find /opt/audit -type f -perm -0002)\" ]"
        },
        {
          "name": "SUID olib tashlangan (755)",
          "cmd": "[ \"$(stat -c '%a' /opt/audit/bin/legacy)\" = \"755\" ]"
        },
        {
          "name": "Faqat o-w o'zgartirilgan",
          "cmd": "[ \"$(stat -c '%a' /opt/audit/logs/app.log)\" = \"664\" ] && [ \"$(stat -c '%a' /opt/audit/bin/run.sh)\" = \"775\" ]"
        }
      ]
    },
    {
      "id": 8,
      "title": "Sudo va servis hisobi",
      "description": "operators guruhini yarating va otabek foydalanuvchisini unga qo'shing (mavjud guruhlari saqlangan holda). /etc/sudoers.d/operators faylini yarating: ichida %operators ALL=(ALL) NOPASSWD: /usr/bin/tail qoidasi bo'lsin, fayl ruxsati aynan 440 bo'lsin va sintaksisi visudo -c tekshiruvidan o'tsin. Shuningdek appsvc nomli tizim (system) servis hisobini yarating: UID 1000 dan kichik, home katalogisiz, shell /usr/sbin/nologin.",
      "hint": "groupadd, usermod -aG, sudoers.d fayli uchun visudo -c -f va chmod 440, servis hisobi uchun useradd -r -M -s dan foydalaning.",
      "seed": "id otabek >/dev/null 2>&1 || useradd -m -s /bin/bash otabek",
      "solution": "groupadd -f operators\nusermod -aG operators otabek\necho '%operators ALL=(ALL) NOPASSWD: /usr/bin/tail' > /etc/sudoers.d/operators\nchmod 440 /etc/sudoers.d/operators\nvisudo -c -f /etc/sudoers.d/operators\nuseradd -r -M -s /usr/sbin/nologin appsvc",
      "checks": [
        {
          "name": "otabek operators a'zosi",
          "cmd": "id -nG otabek | grep -qw operators"
        },
        {
          "name": "NOPASSWD qoidasi mavjud",
          "cmd": "grep -Eq '^%operators[[:space:]]+ALL=\\((ALL|ALL:ALL)\\)[[:space:]]+NOPASSWD:[[:space:]]*/usr/bin/tail' /etc/sudoers.d/operators"
        },
        {
          "name": "Sudoers sintaksisi to'g'ri",
          "cmd": "visudo -c -f /etc/sudoers.d/operators"
        },
        {
          "name": "Fayl ruxsati 440",
          "cmd": "[ \"$(stat -c '%a' /etc/sudoers.d/operators)\" = \"440\" ]"
        },
        {
          "name": "appsvc servis hisobi to'g'ri",
          "cmd": "getent passwd appsvc | grep -Eq ':/(usr/)?sbin/nologin$' && [ \"$(id -u appsvc)\" -lt 1000 ] && [ ! -d /home/appsvc ]"
        }
      ]
    }
  ],
  "3": [
    {
      "id": 1,
      "title": "Jarayonni topish va to'xtatish",
      "description": "Konteynerda /opt/proc-lab/hog.sh skripti fonda ishlab turibdi. Uning PID raqamini aniqlab, /opt/proc-lab/pid.txt fayliga yozing (faylda faqat PID raqamining o'zi bo'lsin), so'ngra jarayonni SIGTERM signali bilan to'xtating.",
      "hint": "Jarayonni pgrep -f yoki ps aux | grep bilan toping, so'ng kill buyrug'i bilan to'xtating.",
      "seed": "#!/bin/bash\nmkdir -p /opt/proc-lab\ncat > /opt/proc-lab/hog.sh <<'HOGEOF'\n#!/bin/bash\nwhile true; do sleep 1; done\nHOGEOF\nchmod +x /opt/proc-lab/hog.sh\nsetsid /opt/proc-lab/hog.sh </dev/null >/dev/null 2>&1 &\nsleep 1",
      "solution": "#!/bin/bash\npgrep -f \"proc-lab/[h]og.sh\" | head -1 > /opt/proc-lab/pid.txt\npkill -TERM -f \"proc-lab/[h]og.sh\" 2>/dev/null || true\nsleep 2",
      "checks": [
        {
          "name": "PID fayli yozilgan",
          "cmd": "grep -Eq '^[0-9]+$' /opt/proc-lab/pid.txt"
        },
        {
          "name": "Jarayon to'xtatilgan",
          "cmd": "! pgrep -f \"proc-lab/[h]og.sh\" >/dev/null"
        }
      ]
    },
    {
      "id": 2,
      "title": "GRUB sozlamalarini o'zgartirish",
      "description": "/etc/default/grub faylida GRUB_TIMEOUT qiymatini 10 ga, GRUB_DEFAULT qiymatini saved ga o'zgartiring. Qatorlar aynan GRUB_TIMEOUT=10 va GRUB_DEFAULT=saved ko'rinishida bo'lishi kerak (real serverda bundan keyin update-grub ishga tushiriladi).",
      "hint": "sed -i yoki vim bilan /etc/default/grub faylidagi ikkita qatorni tahrirlang.",
      "seed": "#!/bin/bash\nmkdir -p /etc/default\ncat > /etc/default/grub <<'EOF'\nGRUB_DEFAULT=0\nGRUB_TIMEOUT=5\nGRUB_DISTRIBUTOR=Ubuntu\nGRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash\"\nGRUB_CMDLINE_LINUX=\"\"\nEOF",
      "solution": "#!/bin/bash\nsed -i 's/^GRUB_TIMEOUT=.*/GRUB_TIMEOUT=10/' /etc/default/grub\nsed -i 's/^GRUB_DEFAULT=.*/GRUB_DEFAULT=saved/' /etc/default/grub",
      "checks": [
        {
          "name": "GRUB_TIMEOUT=10",
          "cmd": "grep -Fxq 'GRUB_TIMEOUT=10' /etc/default/grub"
        },
        {
          "name": "GRUB_DEFAULT=saved",
          "cmd": "grep -Fxq 'GRUB_DEFAULT=saved' /etc/default/grub"
        }
      ]
    },
    {
      "id": 3,
      "title": "Past prioritetli fon jarayoni",
      "description": "/opt/nice-lab/worker.sh skriptini nice qiymati 10 bilan fon rejimida (background) ishga tushiring. Jarayon ishlab turishi va uning NI (nice) qiymati aynan 10 bo'lishi kerak.",
      "hint": "nice -n 10 bilan ishga tushirib, buyruq oxiriga & belgisini qo'ying.",
      "seed": "#!/bin/bash\nmkdir -p /opt/nice-lab\ncat > /opt/nice-lab/worker.sh <<'EOF'\n#!/bin/bash\nwhile true; do sleep 30; done\nEOF\nchmod +x /opt/nice-lab/worker.sh",
      "solution": "#!/bin/bash\nsetsid nice -n 10 /opt/nice-lab/worker.sh </dev/null >/dev/null 2>&1 &\nsleep 1",
      "checks": [
        {
          "name": "Jarayon ishlab turibdi",
          "cmd": "pgrep -f \"nice-lab/[w]orker.sh\" >/dev/null"
        },
        {
          "name": "Nice qiymati 10",
          "cmd": "p=$(pgrep -f \"nice-lab/[w]orker.sh\" | head -1); [ -n \"$p\" ] && [ \"$(ps -o ni= -p \"$p\" | tr -d ' ')\" = \"10\" ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Cron orqali rejalashtirish",
      "description": "root foydalanuvchining crontab'iga har 15 daqiqada /opt/cron-lab/backup.sh skriptini ishga tushiradigan yozuv qo'shing. Yozuv aynan quyidagicha bo'lsin: */15 * * * * /opt/cron-lab/backup.sh",
      "hint": "crontab -e bilan tahrirlang yoki (crontab -l; echo '...') | crontab - usulidan foydalaning.",
      "seed": "#!/bin/bash\nmkdir -p /opt/cron-lab\ncat > /opt/cron-lab/backup.sh <<'EOF'\n#!/bin/bash\necho \"$(date): backup done\" >> /var/log/cron-lab-backup.log\nEOF\nchmod +x /opt/cron-lab/backup.sh",
      "solution": "#!/bin/bash\n(crontab -l 2>/dev/null; echo '*/15 * * * * /opt/cron-lab/backup.sh') | crontab -",
      "checks": [
        {
          "name": "Crontab mavjud",
          "cmd": "crontab -l >/dev/null 2>&1"
        },
        {
          "name": "Har 15 daqiqalik yozuv to'g'ri",
          "cmd": "crontab -l 2>/dev/null | grep -Eq '^\\*/15[[:space:]]+\\*[[:space:]]+\\*[[:space:]]+\\*[[:space:]]+\\*[[:space:]]+/opt/cron-lab/backup\\.sh[[:space:]]*$'"
        }
      ]
    },
    {
      "id": 5,
      "title": "Systemd service yaratish",
      "description": "/etc/systemd/system/monitor.service unit faylini yarating: [Unit] bo'limida Description=System Monitor, [Service] bo'limida ExecStart=/opt/svc-lab/monitor.sh va Restart=on-failure, [Install] bo'limida WantedBy=multi-user.target qatorlari bo'lsin.",
      "hint": "Unit fayl uch bo'limdan iborat bo'ladi: [Unit], [Service] va [Install].",
      "seed": "#!/bin/bash\nmkdir -p /opt/svc-lab\ncat > /opt/svc-lab/monitor.sh <<'EOF'\n#!/bin/bash\nwhile true; do\n  echo \"$(date): load $(cat /proc/loadavg)\" >> /var/log/svc-monitor.log\n  sleep 60\ndone\nEOF\nchmod +x /opt/svc-lab/monitor.sh",
      "solution": "#!/bin/bash\ncat > /etc/systemd/system/monitor.service <<'EOF'\n[Unit]\nDescription=System Monitor\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/opt/svc-lab/monitor.sh\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target\nEOF",
      "checks": [
        {
          "name": "Unit fayl mavjud",
          "cmd": "test -f /etc/systemd/system/monitor.service"
        },
        {
          "name": "Description to'g'ri",
          "cmd": "grep -Fxq 'Description=System Monitor' /etc/systemd/system/monitor.service"
        },
        {
          "name": "ExecStart to'g'ri",
          "cmd": "grep -Fxq 'ExecStart=/opt/svc-lab/monitor.sh' /etc/systemd/system/monitor.service"
        },
        {
          "name": "Restart=on-failure",
          "cmd": "grep -Fxq 'Restart=on-failure' /etc/systemd/system/monitor.service"
        },
        {
          "name": "WantedBy to'g'ri",
          "cmd": "grep -Fxq 'WantedBy=multi-user.target' /etc/systemd/system/monitor.service"
        }
      ]
    },
    {
      "id": 6,
      "title": "Service'ni qo'lda enable qilish",
      "description": "/etc/systemd/system/webjob.service uniti allaqachon mavjud. Uni multi-user.target uchun 'enable' qiling: /etc/systemd/system/multi-user.target.wants/webjob.service nomli symlink yarating va u aynan /etc/systemd/system/webjob.service fayliga ishora qilsin (systemctl enable aynan shu ishni bajaradi).",
      "hint": "ln -s buyrug'i bilan multi-user.target.wants katalogida symlink yarating.",
      "seed": "#!/bin/bash\nmkdir -p /etc/systemd/system/multi-user.target.wants\ncat > /etc/systemd/system/webjob.service <<'EOF'\n[Unit]\nDescription=Web Job Service\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/bin/sleep infinity\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target\nEOF\nrm -f /etc/systemd/system/multi-user.target.wants/webjob.service",
      "solution": "#!/bin/bash\nmkdir -p /etc/systemd/system/multi-user.target.wants\nln -sf /etc/systemd/system/webjob.service /etc/systemd/system/multi-user.target.wants/webjob.service",
      "checks": [
        {
          "name": "Symlink yaratilgan",
          "cmd": "test -L /etc/systemd/system/multi-user.target.wants/webjob.service"
        },
        {
          "name": "Symlink manzili to'g'ri",
          "cmd": "[ \"$(readlink /etc/systemd/system/multi-user.target.wants/webjob.service)\" = \"/etc/systemd/system/webjob.service\" ]"
        }
      ]
    },
    {
      "id": 7,
      "title": "Override drop-in yaratish",
      "description": "nodeapp.service unitining asl faylini (/etc/systemd/system/nodeapp.service) o'zgartirmasdan, /etc/systemd/system/nodeapp.service.d/override.conf faylini yarating. Unda [Service] bo'limi ostida Restart=always va RestartSec=5 qatorlari bo'lsin. Asl fayldagi Restart=no qatori o'z joyida qolishi shart.",
      "hint": "mkdir -p bilan nodeapp.service.d katalogini yarating — systemctl edit aynan shu override.conf faylini yaratadi.",
      "seed": "#!/bin/bash\ncat > /etc/systemd/system/nodeapp.service <<'EOF'\n[Unit]\nDescription=Node App\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/bin/env sleep infinity\nRestart=no\n\n[Install]\nWantedBy=multi-user.target\nEOF\nrm -rf /etc/systemd/system/nodeapp.service.d",
      "solution": "#!/bin/bash\nmkdir -p /etc/systemd/system/nodeapp.service.d\ncat > /etc/systemd/system/nodeapp.service.d/override.conf <<'EOF'\n[Service]\nRestart=always\nRestartSec=5\nEOF",
      "checks": [
        {
          "name": "override.conf mavjud",
          "cmd": "test -f /etc/systemd/system/nodeapp.service.d/override.conf"
        },
        {
          "name": "[Service] bo'limi bor",
          "cmd": "grep -Fxq '[Service]' /etc/systemd/system/nodeapp.service.d/override.conf"
        },
        {
          "name": "Restart=always",
          "cmd": "grep -Fxq 'Restart=always' /etc/systemd/system/nodeapp.service.d/override.conf"
        },
        {
          "name": "RestartSec=5",
          "cmd": "grep -Fxq 'RestartSec=5' /etc/systemd/system/nodeapp.service.d/override.conf"
        },
        {
          "name": "Asl fayl o'zgarmagan",
          "cmd": "grep -Fxq 'Restart=no' /etc/systemd/system/nodeapp.service && grep -Fxq 'Restart=always' /etc/systemd/system/nodeapp.service.d/override.conf"
        }
      ]
    },
    {
      "id": 8,
      "title": "Systemd timer juftligi",
      "description": "Har kuni soat 02:00 da /opt/timer-lab/backup.sh ni ishga tushiradigan systemd timer yarating: 1) /etc/systemd/system/backup.service faylida Type=oneshot va ExecStart=/opt/timer-lab/backup.sh bo'lsin; 2) /etc/systemd/system/backup.timer faylida [Timer] bo'limi ostida OnCalendar=*-*-* 02:00:00 va Persistent=true, [Install] bo'limida WantedBy=timers.target bo'lsin; 3) timerni 'enable' qiling: /etc/systemd/system/timers.target.wants/backup.timer symlinkini /etc/systemd/system/backup.timer ga yarating.",
      "hint": "Timer .service va .timer juftligidan iborat; enable qilish = timers.target.wants katalogida symlink yaratish.",
      "seed": "#!/bin/bash\nmkdir -p /opt/timer-lab /etc/systemd/system/timers.target.wants\ncat > /opt/timer-lab/backup.sh <<'EOF'\n#!/bin/bash\ntar czf /opt/timer-lab/backup-$(date +%F).tar.gz /etc/hosts 2>/dev/null\necho \"$(date): timer backup done\" >> /var/log/timer-lab.log\nEOF\nchmod +x /opt/timer-lab/backup.sh\nrm -f /etc/systemd/system/timers.target.wants/backup.timer",
      "solution": "#!/bin/bash\ncat > /etc/systemd/system/backup.service <<'EOF'\n[Unit]\nDescription=Daily Backup Service\n\n[Service]\nType=oneshot\nExecStart=/opt/timer-lab/backup.sh\nEOF\ncat > /etc/systemd/system/backup.timer <<'EOF'\n[Unit]\nDescription=Daily Backup Timer\n\n[Timer]\nOnCalendar=*-*-* 02:00:00\nPersistent=true\n\n[Install]\nWantedBy=timers.target\nEOF\nmkdir -p /etc/systemd/system/timers.target.wants\nln -sf /etc/systemd/system/backup.timer /etc/systemd/system/timers.target.wants/backup.timer",
      "checks": [
        {
          "name": "Type=oneshot",
          "cmd": "grep -Fxq 'Type=oneshot' /etc/systemd/system/backup.service"
        },
        {
          "name": "ExecStart to'g'ri",
          "cmd": "grep -Fxq 'ExecStart=/opt/timer-lab/backup.sh' /etc/systemd/system/backup.service"
        },
        {
          "name": "OnCalendar to'g'ri",
          "cmd": "grep -Fxq 'OnCalendar=*-*-* 02:00:00' /etc/systemd/system/backup.timer"
        },
        {
          "name": "Timer sozlamalari to'g'ri",
          "cmd": "grep -Fxq 'Persistent=true' /etc/systemd/system/backup.timer && grep -Fxq 'WantedBy=timers.target' /etc/systemd/system/backup.timer"
        },
        {
          "name": "Timer enable qilingan",
          "cmd": "[ \"$(readlink /etc/systemd/system/timers.target.wants/backup.timer)\" = \"/etc/systemd/system/backup.timer\" ]"
        }
      ]
    }
  ],
  "4": [
    {
      "id": 1,
      "title": "Dummy interfeys va IP",
      "description": "dummy0 nomli dummy interfeys yarating, unga 10.10.10.5/24 IP manzilini bering va interfeysni UP holatga keltiring.",
      "hint": "ip link add ... type dummy, ip addr add, ip link set ... up.",
      "seed": "",
      "solution": "ip link add dummy0 type dummy\nip addr add 10.10.10.5/24 dev dummy0\nip link set dummy0 up",
      "checks": [
        {
          "name": "dummy0 mavjud",
          "cmd": "ip link show dummy0 >/dev/null 2>&1"
        },
        {
          "name": "IP 10.10.10.5/24 berilgan",
          "cmd": "ip addr show dummy0 | grep -q '10.10.10.5/24'"
        },
        {
          "name": "Interfeys UP",
          "cmd": "ip link show dummy0 | grep -q UP"
        }
      ]
    },
    {
      "id": 2,
      "title": "Statik hostname yozuvi",
      "description": "/etc/hosts fayliga yangi qator qo'shing: 192.168.50.10 manzili appserver.local nomiga bog'lansin. getent hosts appserver.local ishlashi kerak.",
      "hint": "echo 'IP nom' >> /etc/hosts.",
      "seed": "",
      "solution": "echo '192.168.50.10 appserver.local' >> /etc/hosts",
      "checks": [
        {
          "name": "/etc/hosts da yozuv bor",
          "cmd": "grep -Eq '^192\\.168\\.50\\.10[[:space:]]+appserver\\.local' /etc/hosts"
        },
        {
          "name": "getent orqali topiladi",
          "cmd": "getent hosts appserver.local | grep -q 192.168.50.10"
        }
      ]
    },
    {
      "id": 3,
      "title": "DNS server qo'shish",
      "description": "/etc/resolv.conf fayliga 1.1.1.1 DNS serverini nameserver yozuvi sifatida qo'shing (mavjud yozuvlar o'chmasin).",
      "hint": "echo 'nameserver 1.1.1.1' >> /etc/resolv.conf.",
      "seed": "",
      "solution": "echo 'nameserver 1.1.1.1' >> /etc/resolv.conf",
      "checks": [
        {
          "name": "nameserver 1.1.1.1 yozilgan",
          "cmd": "grep -Eq '^nameserver[[:space:]]+1\\.1\\.1\\.1' /etc/resolv.conf"
        }
      ]
    },
    {
      "id": 4,
      "title": "Statik route qo'shish",
      "description": "dummy1 interfeysini yarating, unga 10.20.0.2/24 manzilini berib UP qiling. So'ngra 172.16.0.0/16 tarmog'iga 10.20.0.1 gateway orqali statik route qo'shing.",
      "hint": "ip route add TARMOQ via GATEWAY (avval interfeys tayyor bo'lsin).",
      "seed": "",
      "solution": "ip link add dummy1 type dummy\nip addr add 10.20.0.2/24 dev dummy1\nip link set dummy1 up\nip route add 172.16.0.0/16 via 10.20.0.1",
      "checks": [
        {
          "name": "dummy1 UP va IP bor",
          "cmd": "ip addr show dummy1 | grep -q '10.20.0.2/24'"
        },
        {
          "name": "172.16.0.0/16 route mavjud",
          "cmd": "ip route | grep -q '172.16.0.0/16 via 10.20.0.1'"
        }
      ]
    },
    {
      "id": 5,
      "title": "Netplan konfiguratsiyasi",
      "description": "/etc/netplan/01-static.yaml faylini yarating. Unda eth0 interfeysi uchun statik 192.168.100.50/24 manzili, 192.168.100.1 default gateway va 8.8.8.8 DNS server ko'rsatilgan bo'lsin (netplan YAML formatida: addresses, routes yoki gateway4, nameservers).",
      "hint": "network: ethernets: eth0: addresses: [...] strukturasi; fayl /etc/netplan/ ichida.",
      "seed": "mkdir -p /etc/netplan",
      "solution": "mkdir -p /etc/netplan\ncat > /etc/netplan/01-static.yaml <<'EOF'\nnetwork:\n  version: 2\n  ethernets:\n    eth0:\n      addresses:\n        - 192.168.100.50/24\n      routes:\n        - to: default\n          via: 192.168.100.1\n      nameservers:\n        addresses:\n          - 8.8.8.8\nEOF",
      "checks": [
        {
          "name": "Fayl yaratilgan",
          "cmd": "[ -f /etc/netplan/01-static.yaml ]"
        },
        {
          "name": "Statik IP yozilgan",
          "cmd": "grep -q '192.168.100.50/24' /etc/netplan/01-static.yaml"
        },
        {
          "name": "Gateway ko'rsatilgan",
          "cmd": "grep -q '192.168.100.1' /etc/netplan/01-static.yaml"
        },
        {
          "name": "DNS ko'rsatilgan",
          "cmd": "grep -q '8.8.8.8' /etc/netplan/01-static.yaml"
        }
      ]
    },
    {
      "id": 6,
      "title": "Firewall qoidalar skripti",
      "description": "/root/firewall.sh nomli bajariladigan skript yarating. Unda iptables qoidalari bo'lsin: 22 (SSH) va 443 (HTTPS) portlarga TCP ruxsat (ACCEPT), INPUT chain uchun esa default DROP policy.",
      "hint": "iptables -A INPUT -p tcp --dport N -j ACCEPT va iptables -P INPUT DROP; chmod +x unutmang.",
      "seed": "",
      "solution": "cat > /root/firewall.sh <<'EOF'\n#!/bin/bash\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\niptables -P INPUT DROP\nEOF\nchmod +x /root/firewall.sh",
      "checks": [
        {
          "name": "Skript mavjud va bajariladigan",
          "cmd": "[ -x /root/firewall.sh ]"
        },
        {
          "name": "22 va 443 ACCEPT qoidalari",
          "cmd": "grep -Eq 'dport (22|ssh).*ACCEPT' /root/firewall.sh && grep -Eq 'dport (443|https).*ACCEPT' /root/firewall.sh"
        },
        {
          "name": "Default DROP policy",
          "cmd": "grep -Eq '(-P|--policy)[[:space:]]+INPUT[[:space:]]+DROP' /root/firewall.sh"
        }
      ]
    },
    {
      "id": 7,
      "title": "Tarmoq diagnostikasi hisoboti",
      "description": "Barcha interfeyslarning IP manzillarini (ip addr chiqishini) /root/net-report.txt fayliga yozing, so'ngra routing jadvalini (ip route chiqishini) xuddi shu faylga QO'SHIMCHA qilib yozing (mavjud mazmun o'chmasin).",
      "hint": "Birinchi buyruq > bilan, ikkinchisi >> bilan yo'naltiriladi.",
      "seed": "",
      "solution": "ip addr > /root/net-report.txt\nip route >> /root/net-report.txt",
      "checks": [
        {
          "name": "Interfeys ma'lumotlari bor",
          "cmd": "grep -q 'lo:' /root/net-report.txt || grep -q 'eth0' /root/net-report.txt"
        },
        {
          "name": "Routing jadvali ham bor",
          "cmd": "grep -Eq '(default|scope link|proto)' /root/net-report.txt"
        }
      ]
    }
  ],
  "5": [
    {
      "id": 1,
      "title": "Disk image yaratish",
      "description": "/root/disk1.img nomli aynan 200MB hajmli bo'sh disk image fayl yarating (dd yoki truncate bilan).",
      "hint": "truncate -s 200M yoki dd if=/dev/zero bs=1M count=200.",
      "seed": "",
      "solution": "truncate -s 200M /root/disk1.img",
      "checks": [
        {
          "name": "Fayl mavjud",
          "cmd": "[ -f /root/disk1.img ]"
        },
        {
          "name": "Hajmi aynan 200MB",
          "cmd": "[ \"$(stat -c %s /root/disk1.img)\" = \"209715200\" ]"
        }
      ]
    },
    {
      "id": 2,
      "title": "ext4 filesystem yaratish",
      "description": "/root/disk2.img (tayyor 100MB image) faylini ext4 filesystem bilan format qiling.",
      "hint": "mkfs.ext4 oddiy fayl ustida ham ishlaydi.",
      "seed": "truncate -s 100M /root/disk2.img",
      "solution": "mkfs.ext4 -q /root/disk2.img",
      "checks": [
        {
          "name": "ext4 formatida",
          "cmd": "blkid -o value -s TYPE /root/disk2.img | grep -q ext4"
        }
      ]
    },
    {
      "id": 3,
      "title": "Filesystem label qo'yish",
      "description": "/root/disk3.img (tayyor, ext4 bilan formatlangan) filesystem'iga DATA nomli label qo'ying.",
      "hint": "e2label qurilma LABEL yoki tune2fs -L.",
      "seed": "truncate -s 60M /root/disk3.img\nmkfs.ext4 -q /root/disk3.img",
      "solution": "e2label /root/disk3.img DATA",
      "checks": [
        {
          "name": "Label DATA o'rnatilgan",
          "cmd": "[ \"$(blkid -o value -s LABEL /root/disk3.img)\" = \"DATA\" ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Doimiy mount (fstab)",
      "description": "/mnt/data1 mount point katalogini yarating va /etc/fstab ga yozuv qo'shing: /root/disk2.img loop option bilan /mnt/data1 ga ext4 sifatida mount bo'lsin (dump=0, pass=2).",
      "hint": "fstab format: <device> <mountpoint> <fstype> <options> <dump> <pass>.",
      "seed": "",
      "solution": "mkdir -p /mnt/data1\necho '/root/disk2.img /mnt/data1 ext4 loop,defaults 0 2' >> /etc/fstab",
      "checks": [
        {
          "name": "/mnt/data1 mavjud",
          "cmd": "[ -d /mnt/data1 ]"
        },
        {
          "name": "fstab yozuvi to'g'ri",
          "cmd": "grep -E '^/root/disk2\\.img[[:space:]]+/mnt/data1[[:space:]]+ext4' /etc/fstab | grep -q loop"
        }
      ]
    },
    {
      "id": 5,
      "title": "Swap fayl tayyorlash",
      "description": "/root/swapfile nomli 100MB fayl yarating, ruxsatini 600 qiling va uni mkswap bilan swap sifatida formatlang. /etc/fstab ga ham yozing: /root/swapfile none swap sw 0 0.",
      "hint": "dd → chmod 600 → mkswap → fstab qatori.",
      "seed": "",
      "solution": "dd if=/dev/zero of=/root/swapfile bs=1M count=100 2>/dev/null\nchmod 600 /root/swapfile\nmkswap /root/swapfile\necho '/root/swapfile none swap sw 0 0' >> /etc/fstab",
      "checks": [
        {
          "name": "Fayl 100MB va 600 ruxsatli",
          "cmd": "[ \"$(stat -c '%s %a' /root/swapfile)\" = \"104857600 600\" ]"
        },
        {
          "name": "Swap formatida",
          "cmd": "blkid -o value -s TYPE /root/swapfile | grep -q swap"
        },
        {
          "name": "fstab yozuvi bor",
          "cmd": "grep -Eq '^/root/swapfile[[:space:]]+none[[:space:]]+swap' /etc/fstab"
        }
      ]
    },
    {
      "id": 6,
      "title": "Disk sarfini tahlil qilish",
      "description": "/opt/bigdata ichida uchta katalog bor. du yordamida eng ko'p joy egallagan katalogning NOMINI (faqat nomi, masalan: videos) /root/biggest.txt fayliga yozing.",
      "hint": "du -s /opt/bigdata/* | sort -n — eng kattasi oxirida.",
      "seed": "mkdir -p /opt/bigdata/videos /opt/bigdata/photos /opt/bigdata/docs\ndd if=/dev/zero of=/opt/bigdata/videos/movie.bin bs=1M count=8 2>/dev/null\ndd if=/dev/zero of=/opt/bigdata/photos/album.bin bs=1M count=3 2>/dev/null\ndd if=/dev/zero of=/opt/bigdata/docs/report.bin bs=1M count=1 2>/dev/null",
      "solution": "echo videos > /root/biggest.txt",
      "checks": [
        {
          "name": "Javob to'g'ri: videos",
          "cmd": "grep -qx 'videos' /root/biggest.txt"
        }
      ]
    },
    {
      "id": 7,
      "title": "Katta fayllarni topish",
      "description": "/opt/bigdata ichidan hajmi 2MB dan katta bo'lgan fayllarning to'liq yo'llarini topib, sort qilingan holda /root/bigfiles.txt fayliga yozing.",
      "hint": "find yo'l -type f -size +2M, natijani sort orqali faylga.",
      "seed": "",
      "solution": "find /opt/bigdata -type f -size +2M | sort > /root/bigfiles.txt",
      "checks": [
        {
          "name": "Ikkita fayl topilgan",
          "cmd": "[ \"$(wc -l < /root/bigfiles.txt)\" -eq 2 ]"
        },
        {
          "name": "movie.bin va album.bin ro'yxatda",
          "cmd": "grep -q 'movie.bin' /root/bigfiles.txt && grep -q 'album.bin' /root/bigfiles.txt"
        }
      ]
    },
    {
      "id": 8,
      "title": "tmpfs mount sozlash",
      "description": "/mnt/cache katalogini yarating va /etc/fstab ga tmpfs yozuvini qo'shing: tmpfs /mnt/cache tmpfs size=64m 0 0 (RAM-disk, hajmi 64MB).",
      "hint": "fstab qatori: tmpfs <mountpoint> tmpfs size=64m 0 0.",
      "seed": "",
      "solution": "mkdir -p /mnt/cache\necho 'tmpfs /mnt/cache tmpfs size=64m 0 0' >> /etc/fstab",
      "checks": [
        {
          "name": "/mnt/cache mavjud",
          "cmd": "[ -d /mnt/cache ]"
        },
        {
          "name": "fstab da tmpfs yozuvi",
          "cmd": "grep -E '^tmpfs[[:space:]]+/mnt/cache[[:space:]]+tmpfs' /etc/fstab | grep -q 'size=64m'"
        }
      ]
    }
  ],
  "6": [
    {
      "id": 1,
      "title": "Paket versiyasini aniqlash",
      "description": "dpkg yordamida tizimda o'rnatilgan tar paketining versiyasini aniqlab, FAQAT versiya satrini /root/tar-version.txt fayliga yozing.",
      "hint": "dpkg-query -W -f='${Version}' tar yoki dpkg -l tar chiqishidan oling.",
      "seed": "",
      "solution": "dpkg-query -W -f='${Version}' tar > /root/tar-version.txt",
      "checks": [
        {
          "name": "Versiya to'g'ri yozilgan",
          "cmd": "[ \"$(tr -d '[:space:]' < /root/tar-version.txt)\" = \"$(dpkg-query -W -f='${Version}' tar)\" ]"
        }
      ]
    },
    {
      "id": 2,
      "title": "Fayl qaysi paketdan?",
      "description": "/usr/bin/ls fayli qaysi paketga tegishli ekanini dpkg bilan aniqlang va FAQAT paket nomini /root/ls-package.txt fayliga yozing.",
      "hint": "dpkg -S /usr/bin/ls — chiqishning boshida paket nomi bo'ladi.",
      "seed": "",
      "solution": "echo coreutils > /root/ls-package.txt",
      "checks": [
        {
          "name": "Javob: coreutils",
          "cmd": "grep -qx 'coreutils' /root/ls-package.txt"
        }
      ]
    },
    {
      "id": 3,
      "title": "Paket fayllar ro'yxati",
      "description": "bash paketi o'rnatgan barcha fayllar ro'yxatini dpkg bilan olib, /root/bash-files.txt fayliga yozing.",
      "hint": "dpkg -L paket_nomi.",
      "seed": "",
      "solution": "dpkg -L bash > /root/bash-files.txt",
      "checks": [
        {
          "name": "Ro'yxatda /bin/bash bor",
          "cmd": "grep -q '/bin/bash' /root/bash-files.txt"
        },
        {
          "name": "Ro'yxat to'liq (10+ qator)",
          "cmd": "[ \"$(wc -l < /root/bash-files.txt)\" -ge 10 ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "APT repository qo'shish",
      "description": "/etc/apt/sources.list.d/backports.list faylini yarating va unga jammy-backports repository qatorini yozing: deb http://archive.ubuntu.com/ubuntu jammy-backports main universe",
      "hint": "echo bilan faylga yozing — sources.list.d ichidagi har bir .list fayl alohida repo.",
      "seed": "",
      "solution": "echo 'deb http://archive.ubuntu.com/ubuntu jammy-backports main universe' > /etc/apt/sources.list.d/backports.list",
      "checks": [
        {
          "name": "Fayl yaratilgan",
          "cmd": "[ -f /etc/apt/sources.list.d/backports.list ]"
        },
        {
          "name": "Repo qatori to'g'ri",
          "cmd": "grep -Eq '^deb[[:space:]]+http://archive\\.ubuntu\\.com/ubuntu[[:space:]]+jammy-backports[[:space:]]+main[[:space:]]+universe' /etc/apt/sources.list.d/backports.list"
        }
      ]
    },
    {
      "id": 5,
      "title": "Paketni hold qilish",
      "description": "tar paketini apt-mark yordamida hold holatiga o'tkazing — shunda apt upgrade uni yangilamaydi.",
      "hint": "apt-mark hold paket_nomi.",
      "seed": "",
      "solution": "apt-mark hold tar",
      "checks": [
        {
          "name": "tar hold holatida",
          "cmd": "dpkg --get-selections tar | grep -q hold"
        }
      ]
    }
  ],
  "7": [
    {
      "id": 1,
      "title": "Hujum manbalarini aniqlash",
      "description": "/var/log/auth.log faylida muvaffaqiyatsiz SSH login urinishlari bor. 'Failed password' qatorlaridagi IP manzillarni ajratib olib, takrorlarsiz (unique) va sort qilingan holda /root/attackers.txt fayliga yozing.",
      "hint": "grep + awk/grep -oE '([0-9]{1,3}\\.){3}[0-9]{1,3}' + sort -u.",
      "seed": "mkdir -p /var/log\ncat > /var/log/auth.log <<'EOF'\nJan 5 10:01:02 srv sshd[100]: Failed password for root from 203.0.113.5 port 4321 ssh2\nJan 5 10:01:05 srv sshd[101]: Accepted password for admin from 10.0.0.2 port 5000 ssh2\nJan 5 10:02:11 srv sshd[102]: Failed password for admin from 198.51.100.7 port 4400 ssh2\nJan 5 10:03:30 srv sshd[103]: Failed password for root from 203.0.113.5 port 4500 ssh2\nJan 5 10:04:00 srv sshd[104]: Failed password for user from 192.0.2.99 port 4600 ssh2\nEOF",
      "solution": "grep 'Failed password' /var/log/auth.log | grep -oE '([0-9]{1,3}\\.){3}[0-9]{1,3}' | sort -u > /root/attackers.txt",
      "checks": [
        {
          "name": "3 ta unique IP",
          "cmd": "[ \"$(wc -l < /root/attackers.txt)\" -eq 3 ]"
        },
        {
          "name": "IP'lar to'g'ri",
          "cmd": "grep -q '203.0.113.5' /root/attackers.txt && grep -q '198.51.100.7' /root/attackers.txt && grep -q '192.0.2.99' /root/attackers.txt"
        },
        {
          "name": "Muvaffaqiyatli login IP kirmagan",
          "cmd": "! grep -q '10.0.0.2' /root/attackers.txt"
        }
      ]
    },
    {
      "id": 2,
      "title": "Logrotate sozlash",
      "description": "/etc/logrotate.d/myapp konfiguratsiya faylini yarating: /var/log/myapp/*.log fayllari kunlik (daily) aylantirilsin, 7 ta nusxa saqlansin (rotate 7), siqilsin (compress) va fayl bo'lmasa xato bermasin (missingok).",
      "hint": "logrotate.d formatı: yo'l { direktivalar }.",
      "seed": "mkdir -p /var/log/myapp\ntouch /var/log/myapp/app.log",
      "solution": "cat > /etc/logrotate.d/myapp <<'EOF'\n/var/log/myapp/*.log {\n    daily\n    rotate 7\n    compress\n    missingok\n}\nEOF",
      "checks": [
        {
          "name": "Fayl yaratilgan va yo'l to'g'ri",
          "cmd": "grep -q '/var/log/myapp/\\*.log' /etc/logrotate.d/myapp"
        },
        {
          "name": "daily va rotate 7",
          "cmd": "grep -q 'daily' /etc/logrotate.d/myapp && grep -Eq 'rotate[[:space:]]+7' /etc/logrotate.d/myapp"
        },
        {
          "name": "compress va missingok",
          "cmd": "grep -q 'compress' /etc/logrotate.d/myapp && grep -q 'missingok' /etc/logrotate.d/myapp"
        },
        {
          "name": "Sintaksis to'g'ri (logrotate -d)",
          "cmd": "logrotate -d /etc/logrotate.d/myapp >/dev/null 2>&1"
        }
      ]
    },
    {
      "id": 3,
      "title": "Rsyslog qoidasi",
      "description": "/etc/rsyslog.d/50-myapp.conf faylini yarating: local1 facility'ning barcha darajadagi (local1.*) xabarlari /var/log/myapp-syslog.log fayliga yozilsin.",
      "hint": "Rsyslog qoida formati: facility.priority <tab> action(fayl yo'li).",
      "seed": "mkdir -p /etc/rsyslog.d",
      "solution": "echo 'local1.* /var/log/myapp-syslog.log' > /etc/rsyslog.d/50-myapp.conf",
      "checks": [
        {
          "name": "Qoida fayli yaratilgan",
          "cmd": "[ -f /etc/rsyslog.d/50-myapp.conf ]"
        },
        {
          "name": "local1.* → myapp-syslog.log",
          "cmd": "grep -Eq '^local1\\.\\*[[:space:]]+-?/var/log/myapp-syslog\\.log' /etc/rsyslog.d/50-myapp.conf"
        }
      ]
    },
    {
      "id": 4,
      "title": "Katta logni xavfsiz tozalash",
      "description": "/var/log/big.log fayli diskni to'ldirmoqda. Uni O'CHIRMASDAN (fayl va uning inode'i saqlanib qolsin) mazmunini bo'shating — hajmi 0 bo'lsin.",
      "hint": "truncate -s 0 fayl yoki > fayl — rm ishlatmang!",
      "seed": "dd if=/dev/zero of=/var/log/big.log bs=1M count=5 2>/dev/null",
      "solution": "truncate -s 0 /var/log/big.log",
      "checks": [
        {
          "name": "Fayl hali ham mavjud",
          "cmd": "[ -f /var/log/big.log ]"
        },
        {
          "name": "Hajmi 0 bayt",
          "cmd": "[ \"$(stat -c %s /var/log/big.log)\" = \"0\" ]"
        }
      ]
    },
    {
      "id": 5,
      "title": "Tizim holati hisoboti",
      "description": "Bitta /root/sysreport.txt fayliga ketma-ket yozing: uptime chiqishi (load average bilan) va free -m chiqishi (xotira MB da). Ikkala buyruq natijasi ham faylda bo'lishi shart.",
      "hint": "Birinchisi > bilan, ikkinchisi >> bilan.",
      "seed": "",
      "solution": "uptime > /root/sysreport.txt\nfree -m >> /root/sysreport.txt",
      "checks": [
        {
          "name": "Load average ma'lumoti bor",
          "cmd": "grep -q 'load average' /root/sysreport.txt"
        },
        {
          "name": "Xotira ma'lumoti bor",
          "cmd": "grep -qi 'mem' /root/sysreport.txt"
        }
      ]
    }
  ],
  "8": [
    {
      "id": 1,
      "title": "SSH hardening konfiguratsiyasi",
      "description": "/etc/ssh/sshd_config.d/hardening.conf faylini yarating va unda uchta sozlamani yozing: PermitRootLogin no, PasswordAuthentication no va Port 2222.",
      "hint": "sshd_config.d ichidagi .conf fayllar asosiy konfigga qo'shiladi — har sozlama alohida qatorda.",
      "seed": "mkdir -p /etc/ssh/sshd_config.d",
      "solution": "cat > /etc/ssh/sshd_config.d/hardening.conf <<'EOF'\nPermitRootLogin no\nPasswordAuthentication no\nPort 2222\nEOF",
      "checks": [
        {
          "name": "Root login taqiqlangan",
          "cmd": "grep -Eq '^PermitRootLogin[[:space:]]+no' /etc/ssh/sshd_config.d/hardening.conf"
        },
        {
          "name": "Parolli kirish o'chirilgan",
          "cmd": "grep -Eq '^PasswordAuthentication[[:space:]]+no' /etc/ssh/sshd_config.d/hardening.conf"
        },
        {
          "name": "Port 2222",
          "cmd": "grep -Eq '^Port[[:space:]]+2222' /etc/ssh/sshd_config.d/hardening.conf"
        }
      ]
    },
    {
      "id": 2,
      "title": "Sudoers drop-in qoidasi",
      "description": "auditors guruhini yarating va /etc/sudoers.d/auditors faylini yozing: %auditors guruhi parolsiz (NOPASSWD) faqat /usr/bin/less buyrug'ini sudo bilan ishga tushira olsin. Fayl sintaksisi visudo -c dan o'tishi shart.",
      "hint": "Qator: %auditors ALL=(ALL) NOPASSWD: /usr/bin/less — faylga 440 ruxsat bering.",
      "seed": "",
      "solution": "groupadd -f auditors\necho '%auditors ALL=(ALL) NOPASSWD: /usr/bin/less' > /etc/sudoers.d/auditors\nchmod 440 /etc/sudoers.d/auditors",
      "checks": [
        {
          "name": "auditors guruhi mavjud",
          "cmd": "getent group auditors >/dev/null"
        },
        {
          "name": "Sudoers qoidasi to'g'ri",
          "cmd": "grep -Eq '^%auditors[[:space:]]+ALL=\\(ALL\\)[[:space:]]+NOPASSWD:[[:space:]]+/usr/bin/less' /etc/sudoers.d/auditors"
        },
        {
          "name": "Sintaksis valid (visudo -c)",
          "cmd": "visudo -cf /etc/sudoers.d/auditors >/dev/null 2>&1"
        }
      ]
    },
    {
      "id": 3,
      "title": "Parol siyosati (login.defs)",
      "description": "/etc/login.defs faylida PASS_MAX_DAYS qiymatini 60 ga o'zgartiring (yangi yaratiladigan userlar uchun parolning maksimal amal qilish muddati).",
      "hint": "sed -i yoki faylni tahrirlab, PASS_MAX_DAYS qatorini toping.",
      "seed": "",
      "solution": "sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS\\t60/' /etc/login.defs",
      "checks": [
        {
          "name": "PASS_MAX_DAYS 60 ga o'rnatilgan",
          "cmd": "grep -Eq '^PASS_MAX_DAYS[[:space:]]+60$' /etc/login.defs"
        },
        {
          "name": "Eski 99999 qiymati qolmagan",
          "cmd": "! grep -Eq '^PASS_MAX_DAYS[[:space:]]+99999' /etc/login.defs"
        }
      ]
    },
    {
      "id": 4,
      "title": "SUID audit",
      "description": "Butun tizim bo'ylab SUID biti o'rnatilgan fayllarni toping va to'liq yo'llarini sort qilingan holda /root/suid.txt fayliga yozing (permission denied xatolarini yashiring).",
      "hint": "find / -perm -4000 -type f 2>/dev/null.",
      "seed": "",
      "solution": "find / -perm -4000 -type f 2>/dev/null | sort > /root/suid.txt",
      "checks": [
        {
          "name": "Ro'yxatda passwd bor",
          "cmd": "grep -q '/passwd' /root/suid.txt"
        },
        {
          "name": "Ro'yxatda sudo bor",
          "cmd": "grep -q '/sudo' /root/suid.txt"
        }
      ]
    },
    {
      "id": 5,
      "title": "Resurs limitlari",
      "description": "/etc/security/limits.d/devops.conf faylini yarating: devops guruhi uchun ochiq fayllar soni (nofile) yumshoq va qattiq limiti 4096 bo'lsin. Qator: @devops - nofile 4096",
      "hint": "@guruh belgisi guruhga tegishli limitni bildiradi; '-' soft+hard birga.",
      "seed": "mkdir -p /etc/security/limits.d",
      "solution": "echo '@devops - nofile 4096' > /etc/security/limits.d/devops.conf",
      "checks": [
        {
          "name": "Fayl yaratilgan",
          "cmd": "[ -f /etc/security/limits.d/devops.conf ]"
        },
        {
          "name": "Limit qoidasi to'g'ri",
          "cmd": "grep -Eq '^@devops[[:space:]]+-[[:space:]]+nofile[[:space:]]+4096' /etc/security/limits.d/devops.conf"
        }
      ]
    }
  ],
  "9": [
    {
      "id": 1,
      "title": "Birinchi skript",
      "description": "/root/scripts/hello.sh skriptini yarating: birinchi qatori bash shebang bo'lsin, ishga tushirilganda aynan \"Salom LFCS\" matnini chiqarsin. Skript bajariladigan bo'lishi shart.",
      "hint": "#!/bin/bash + echo, so'ngra chmod +x.",
      "seed": "mkdir -p /root/scripts",
      "solution": "mkdir -p /root/scripts\nprintf '#!/bin/bash\\necho \"Salom LFCS\"\\n' > /root/scripts/hello.sh\nchmod +x /root/scripts/hello.sh",
      "checks": [
        {
          "name": "Skript bajariladigan",
          "cmd": "[ -x /root/scripts/hello.sh ]"
        },
        {
          "name": "Shebang bilan boshlanadi",
          "cmd": "head -1 /root/scripts/hello.sh | grep -q '^#!'"
        },
        {
          "name": "Chiqishi to'g'ri",
          "cmd": "[ \"$(/root/scripts/hello.sh)\" = \"Salom LFCS\" ]"
        }
      ]
    },
    {
      "id": 2,
      "title": "Argument bilan ishlash",
      "description": "/root/scripts/greet.sh skriptini yarating: birinchi argument sifatida ism qabul qilib, aynan \"Salom, ISM!\" formatida chiqarsin. Masalan: ./greet.sh Ali → Salom, Ali!",
      "hint": "Skript ichida $1 — birinchi argument.",
      "seed": "mkdir -p /root/scripts",
      "solution": "printf '#!/bin/bash\\necho \"Salom, $1!\"\\n' > /root/scripts/greet.sh\nchmod +x /root/scripts/greet.sh",
      "checks": [
        {
          "name": "Skript bajariladigan",
          "cmd": "[ -x /root/scripts/greet.sh ]"
        },
        {
          "name": "Ali uchun to'g'ri javob",
          "cmd": "[ \"$(/root/scripts/greet.sh Ali)\" = \"Salom, Ali!\" ]"
        },
        {
          "name": "Boshqa ism uchun ham ishlaydi",
          "cmd": "[ \"$(/root/scripts/greet.sh Zilola)\" = \"Salom, Zilola!\" ]"
        }
      ]
    },
    {
      "id": 3,
      "title": "Shartli tekshiruv skripti",
      "description": "/root/scripts/checkfile.sh skriptini yarating: birinchi argumentdagi yo'l mavjud FAYL bo'lsa \"BOR\" chiqarib 0 exit kodi bilan tugasin; aks holda \"YO'Q\" chiqarib 1 exit kodi bilan tugasin.",
      "hint": "if [ -f \"$1\" ]; then ... else ... fi va exit kodlari.",
      "seed": "mkdir -p /root/scripts",
      "solution": "cat > /root/scripts/checkfile.sh <<'EOF'\n#!/bin/bash\nif [ -f \"$1\" ]; then\n  echo \"BOR\"\n  exit 0\nelse\n  echo \"YO'Q\"\n  exit 1\nfi\nEOF\nchmod +x /root/scripts/checkfile.sh",
      "checks": [
        {
          "name": "Mavjud fayl uchun BOR va exit 0",
          "cmd": "out=$(/root/scripts/checkfile.sh /etc/hosts); rc=$?; [ \"$out\" = \"BOR\" ] && [ $rc -eq 0 ]"
        },
        {
          "name": "Yo'q fayl uchun YO'Q va exit 1",
          "cmd": "out=$(/root/scripts/checkfile.sh /yoq/fayl/123); rc=$?; [ \"$out\" = \"YO'Q\" ] && [ $rc -eq 1 ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Sikl bilan sanash",
      "description": "/root/scripts/count.sh skriptini yarating: 1 dan 5 gacha raqamlarni har birini alohida qatorda chiqarsin (for yoki while sikl bilan, seq/echo hardcode emas — lekin tekshiruv faqat natijaga qaraydi).",
      "hint": "for i in {1..5}; do echo $i; done.",
      "seed": "mkdir -p /root/scripts",
      "solution": "cat > /root/scripts/count.sh <<'EOF'\n#!/bin/bash\nfor i in {1..5}; do\n  echo $i\ndone\nEOF\nchmod +x /root/scripts/count.sh",
      "checks": [
        {
          "name": "Skript bajariladigan",
          "cmd": "[ -x /root/scripts/count.sh ]"
        },
        {
          "name": "Chiqish: 1..5 alohida qatorlarda",
          "cmd": "[ \"$(/root/scripts/count.sh)\" = \"$(printf '1\\n2\\n3\\n4\\n5')\" ]"
        }
      ]
    },
    {
      "id": 5,
      "title": "Xatoni to'g'ri qaytarish",
      "description": "/root/scripts/safe-copy.sh skriptini yarating: ikki argument oladi (manba va maqsad). Manba fayl mavjud bo'lmasa stderr'ga \"XATO: fayl topilmadi\" yozib 2 exit kodi bilan tugasin. Mavjud bo'lsa nusxalab 0 bilan tugasin.",
      "hint": "echo '...' >&2 — stderr'ga yozish; exit 2.",
      "seed": "mkdir -p /root/scripts\necho 'test data' > /root/scripts/source.txt",
      "solution": "cat > /root/scripts/safe-copy.sh <<'EOF'\n#!/bin/bash\nif [ ! -f \"$1\" ]; then\n  echo \"XATO: fayl topilmadi\" >&2\n  exit 2\nfi\ncp \"$1\" \"$2\"\nEOF\nchmod +x /root/scripts/safe-copy.sh",
      "checks": [
        {
          "name": "Muvaffaqiyatli nusxa (exit 0)",
          "cmd": "/root/scripts/safe-copy.sh /root/scripts/source.txt /tmp/copied.txt && [ -f /tmp/copied.txt ]"
        },
        {
          "name": "Yo'q fayl uchun exit 2",
          "cmd": "/root/scripts/safe-copy.sh /yoq/fayl /tmp/x 2>/dev/null; [ $? -eq 2 ]"
        },
        {
          "name": "Xato stderr'ga yoziladi",
          "cmd": "/root/scripts/safe-copy.sh /yoq/fayl /tmp/x 2>&1 >/dev/null | grep -q 'XATO: fayl topilmadi'"
        }
      ]
    },
    {
      "id": 6,
      "title": "Skriptni cron'ga ulash",
      "description": "/root/scripts/diskcheck.sh skriptini yarating (df -h chiqishini /var/log/diskcheck.log ga qo'shib boradi, >> bilan) va root crontab'iga qo'shing: har kuni soat 06:30 da ishga tushsin.",
      "hint": "Cron format: 30 6 * * * /yo'l/skript; (crontab -l; echo '...') | crontab -.",
      "seed": "mkdir -p /root/scripts",
      "solution": "cat > /root/scripts/diskcheck.sh <<'EOF'\n#!/bin/bash\ndf -h >> /var/log/diskcheck.log\nEOF\nchmod +x /root/scripts/diskcheck.sh\n(crontab -l 2>/dev/null; echo '30 6 * * * /root/scripts/diskcheck.sh') | crontab -",
      "checks": [
        {
          "name": "Skript bajariladigan va df ishlatadi",
          "cmd": "[ -x /root/scripts/diskcheck.sh ] && grep -q 'df' /root/scripts/diskcheck.sh"
        },
        {
          "name": "Crontab: har kuni 06:30",
          "cmd": "crontab -l | grep -Eq '^30[[:space:]]+6[[:space:]]+\\*[[:space:]]+\\*[[:space:]]+\\*.*diskcheck\\.sh'"
        }
      ]
    }
  ],
  "10": [
    {
      "id": 1,
      "title": "To'liq backup olish",
      "description": "/srv/website katalogini gzip bilan siqilgan /backup/website-full.tar.gz arxiviga oling (/backup katalogini yarating). Arxiv ichida index.html saqlanishi kerak.",
      "hint": "mkdir -p /backup && tar -czf ...",
      "seed": "mkdir -p /srv/website/assets\necho '<html>site</html>' > /srv/website/index.html\necho 'img-data' > /srv/website/assets/logo.png",
      "solution": "mkdir -p /backup\ntar -czf /backup/website-full.tar.gz -C /srv website",
      "checks": [
        {
          "name": "Arxiv mavjud va gzip",
          "cmd": "[ -f /backup/website-full.tar.gz ] && file /backup/website-full.tar.gz | grep -qi gzip"
        },
        {
          "name": "index.html arxivda",
          "cmd": "tar -tzf /backup/website-full.tar.gz | grep -q 'index.html'"
        }
      ]
    },
    {
      "id": 2,
      "title": "Arxivdan tanlab tiklash",
      "description": "/backup/site-old.tar.gz arxivida bir nechta fayl bor. Undan FAQAT config/app.conf faylini /srv/restore katalogiga tiklang (boshqa fayllar tiklanmasin). Natija: /srv/restore/config/app.conf mavjud, /srv/restore/index.html mavjud emas.",
      "hint": "tar -xzf arxiv -C maqsad ichki/yo'l — yo'lni arxivda saqlanganidek yozing (tar -tzf bilan ko'ring).",
      "seed": "mkdir -p /tmp/site-src/config\necho 'port=8080' > /tmp/site-src/config/app.conf\necho '<html>old</html>' > /tmp/site-src/index.html\nmkdir -p /backup\ntar -czf /backup/site-old.tar.gz -C /tmp/site-src .\nrm -rf /tmp/site-src",
      "solution": "mkdir -p /srv/restore\ntar -xzf /backup/site-old.tar.gz -C /srv/restore ./config/app.conf",
      "checks": [
        {
          "name": "app.conf tiklangan",
          "cmd": "[ -f /srv/restore/config/app.conf ] && grep -q 'port=8080' /srv/restore/config/app.conf"
        },
        {
          "name": "index.html tiklanmagan",
          "cmd": "[ ! -e /srv/restore/index.html ]"
        }
      ]
    },
    {
      "id": 3,
      "title": "Rsync bilan mirror",
      "description": "/srv/website katalogini /mnt/mirror ga rsync bilan sinxronlang: archive rejimida va --delete bilan (mirror'da manbada yo'q fayllar o'chsin). /mnt/mirror/stale.txt fayli sinxronlashdan keyin yo'qolishi kerak. Diqqat: manba yo'lini /srv/website/ (oxirida /) deb yozing — shunda mirror ildizi to'g'ri bo'ladi.",
      "hint": "rsync -a --delete /srv/website/ /mnt/mirror/",
      "seed": "mkdir -p /srv/website\nmkdir -p /mnt/mirror\necho 'eski fayl' > /mnt/mirror/stale.txt",
      "solution": "rsync -a --delete /srv/website/ /mnt/mirror/",
      "checks": [
        {
          "name": "index.html mirror'da",
          "cmd": "[ -f /mnt/mirror/index.html ]"
        },
        {
          "name": "stale.txt o'chirilgan",
          "cmd": "[ ! -e /mnt/mirror/stale.txt ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Incremental backup (tar)",
      "description": "/srv/appdata uchun incremental backup tizimi tuzing: (1) --listed-incremental=/backup/appdata.snar bilan to'liq backup /backup/appdata-full.tar.gz ga oling; (2) so'ngra /srv/appdata/new-report.txt nomli yangi fayl yarating; (3) o'sha snar fayli bilan ikkinchi (incremental) backup /backup/appdata-inc1.tar.gz ga oling. Incremental arxivda new-report.txt bo'lishi kerak.",
      "hint": "Ikkala tar ham --listed-incremental=/backup/appdata.snar bilan ishlaydi — snapshot fayl farqni kuzatadi.",
      "seed": "mkdir -p /srv/appdata\necho 'malumot-1' > /srv/appdata/data1.txt\necho 'malumot-2' > /srv/appdata/data2.txt\nmkdir -p /backup",
      "solution": "tar --listed-incremental=/backup/appdata.snar -czf /backup/appdata-full.tar.gz -C /srv appdata\necho 'yangi hisobot' > /srv/appdata/new-report.txt\ntar --listed-incremental=/backup/appdata.snar -czf /backup/appdata-inc1.tar.gz -C /srv appdata",
      "checks": [
        {
          "name": "Full backup va snar mavjud",
          "cmd": "[ -f /backup/appdata-full.tar.gz ] && [ -f /backup/appdata.snar ]"
        },
        {
          "name": "Full arxivda data1.txt bor",
          "cmd": "tar -tzf /backup/appdata-full.tar.gz | grep -q 'data1.txt'"
        },
        {
          "name": "Incremental'da new-report.txt bor",
          "cmd": "tar -tzf /backup/appdata-inc1.tar.gz | grep -q 'new-report.txt'"
        },
        {
          "name": "Incremental'da eski data1.txt YO'Q",
          "cmd": "! tar -tzf /backup/appdata-inc1.tar.gz | grep -q 'data1.txt'"
        }
      ]
    },
    {
      "id": 5,
      "title": "Disk image nusxasi va tekshiruv",
      "description": "/root/part.img faylining aynan bir xil nusxasini dd bilan /backup/part-copy.img ga oling. So'ngra asl faylning md5 hash'ini /root/part.md5 fayliga yozing (md5sum chiqishi formatida). Nusxa asl bilan bit darajasida bir xil bo'lishi shart.",
      "hint": "dd if=... of=..., md5sum fayl > hash-fayl, solishtirish: cmp.",
      "seed": "dd if=/dev/urandom of=/root/part.img bs=1M count=4 2>/dev/null\nmkdir -p /backup",
      "solution": "dd if=/root/part.img of=/backup/part-copy.img bs=1M 2>/dev/null\nmd5sum /root/part.img > /root/part.md5",
      "checks": [
        {
          "name": "Nusxa mavjud va bir xil",
          "cmd": "cmp -s /root/part.img /backup/part-copy.img"
        },
        {
          "name": "MD5 fayl to'g'ri",
          "cmd": "md5sum -c /root/part.md5 >/dev/null 2>&1"
        }
      ]
    }
  ],
  "11": [
    {
      "id": 1,
      "title": "Dockerfile yozish",
      "description": "/opt/webapp/Dockerfile yarating: nginx:alpine image'idan boshlansin (FROM), html katalogini /usr/share/nginx/html ga nusxalasin (COPY) va 80-portni e'lon qilsin (EXPOSE).",
      "hint": "Uch qator: FROM, COPY, EXPOSE.",
      "seed": "mkdir -p /opt/webapp/html\necho '<h1>App</h1>' > /opt/webapp/html/index.html",
      "solution": "cat > /opt/webapp/Dockerfile <<'EOF'\nFROM nginx:alpine\nCOPY html /usr/share/nginx/html\nEXPOSE 80\nEOF",
      "checks": [
        {
          "name": "FROM nginx:alpine",
          "cmd": "grep -Eq '^FROM[[:space:]]+nginx:alpine' /opt/webapp/Dockerfile"
        },
        {
          "name": "COPY html → nginx html",
          "cmd": "grep -Eq '^COPY[[:space:]]+html[[:space:]]+/usr/share/nginx/html' /opt/webapp/Dockerfile"
        },
        {
          "name": "EXPOSE 80",
          "cmd": "grep -Eq '^EXPOSE[[:space:]]+80' /opt/webapp/Dockerfile"
        }
      ]
    },
    {
      "id": 2,
      "title": ".dockerignore sozlash",
      "description": "/opt/webapp/.dockerignore faylini yarating: node_modules, .git kataloglari va barcha .log fayllar (*.log) image build kontekstiga kirmasin — har biri alohida qatorda.",
      "hint": "Har pattern yangi qatorda, xuddi .gitignore kabi.",
      "seed": "mkdir -p /opt/webapp",
      "solution": "printf 'node_modules\\n.git\\n*.log\\n' > /opt/webapp/.dockerignore",
      "checks": [
        {
          "name": "node_modules ignore qilingan",
          "cmd": "grep -qx 'node_modules' /opt/webapp/.dockerignore"
        },
        {
          "name": ".git ignore qilingan",
          "cmd": "grep -qx '.git' /opt/webapp/.dockerignore"
        },
        {
          "name": "*.log ignore qilingan",
          "cmd": "grep -qx '\\*.log' /opt/webapp/.dockerignore"
        }
      ]
    },
    {
      "id": 3,
      "title": "Docker Compose fayli",
      "description": "/opt/webapp/compose.yaml yarating, ikkita service bo'lsin: (1) web — nginx:alpine image, host 8080 → container 80 port mapping; (2) db — postgres:16 image, POSTGRES_PASSWORD=secret123 environment o'zgaruvchisi bilan.",
      "hint": "services: → web: image/ports, db: image/environment. YAML indentatsiyaga ehtiyot bo'ling.",
      "seed": "mkdir -p /opt/webapp",
      "solution": "cat > /opt/webapp/compose.yaml <<'EOF'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - \"8080:80\"\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: secret123\nEOF",
      "checks": [
        {
          "name": "web service (nginx:alpine)",
          "cmd": "grep -q 'nginx:alpine' /opt/webapp/compose.yaml"
        },
        {
          "name": "Port mapping 8080:80",
          "cmd": "grep -q '8080:80' /opt/webapp/compose.yaml"
        },
        {
          "name": "db service (postgres:16)",
          "cmd": "grep -q 'postgres:16' /opt/webapp/compose.yaml"
        },
        {
          "name": "POSTGRES_PASSWORD berilgan",
          "cmd": "grep -q 'POSTGRES_PASSWORD' /opt/webapp/compose.yaml && grep -q 'secret123' /opt/webapp/compose.yaml"
        }
      ]
    },
    {
      "id": 4,
      "title": "Container ishga tushirish buyrug'i",
      "description": "/root/run-container.sh bajariladigan skript yarating. Ichida bitta docker run buyrug'i bo'lsin: fon rejimida (-d), konteyner nomi web (--name web), host 8080 → container 80 (-p 8080:80), /srv/html katalogi /usr/share/nginx/html ga volume sifatida ulangan (-v), nginx image'idan.",
      "hint": "docker run -d --name web -p 8080:80 -v /srv/html:/usr/share/nginx/html nginx",
      "seed": "",
      "solution": "cat > /root/run-container.sh <<'EOF'\n#!/bin/bash\ndocker run -d --name web -p 8080:80 -v /srv/html:/usr/share/nginx/html nginx\nEOF\nchmod +x /root/run-container.sh",
      "checks": [
        {
          "name": "Skript bajariladigan",
          "cmd": "[ -x /root/run-container.sh ]"
        },
        {
          "name": "Detached va nom to'g'ri",
          "cmd": "grep -q -- '-d' /root/run-container.sh && grep -q -- '--name web' /root/run-container.sh"
        },
        {
          "name": "Port va volume mapping",
          "cmd": "grep -q -- '-p 8080:80' /root/run-container.sh && grep -q -- '-v /srv/html:/usr/share/nginx/html' /root/run-container.sh"
        }
      ]
    }
  ],
  "12": [
    {
      "id": 1,
      "title": "User va guruh (aralash)",
      "description": "ops guruhini yarating. deploy nomli user yarating: home katalogi bilan, /bin/bash shell, ops qo'shimcha guruhida va hisobi 2027-01-01 da tugaydigan qilib.",
      "hint": "groupadd + useradd -m -s -G + chage -E (yoki useradd -e).",
      "seed": "",
      "solution": "groupadd -f ops\nuseradd -m -s /bin/bash -G ops -e 2027-01-01 deploy",
      "checks": [
        {
          "name": "deploy useri bash bilan",
          "cmd": "getent passwd deploy | grep -q ':/bin/bash$'"
        },
        {
          "name": "ops guruhida",
          "cmd": "id -nG deploy | grep -qw ops"
        },
        {
          "name": "Hisob muddati 2027-01-01",
          "cmd": "chage -l deploy | grep -q 'Jan 01, 2027'"
        }
      ]
    },
    {
      "id": 2,
      "title": "Konfiglarni yig'ish (find + tar)",
      "description": "/var/appconf katalogidan barcha .conf fayllarni topib, ularni /backup/configs.tar.gz arxiviga oling (/backup ni yarating). Arxivda kamida server.conf va db.conf bo'lishi kerak, .txt fayllar kirmasin.",
      "hint": "find ... -name '*.conf' | tar -czf ... -T - (ro'yxatdan o'qish).",
      "seed": "mkdir -p /var/appconf/sub\necho 'port 80' > /var/appconf/server.conf\necho 'db=pg' > /var/appconf/sub/db.conf\necho 'eslatma' > /var/appconf/notes.txt",
      "solution": "mkdir -p /backup\nfind /var/appconf -name '*.conf' -type f | tar -czf /backup/configs.tar.gz -T -",
      "checks": [
        {
          "name": "Arxivda server.conf va db.conf",
          "cmd": "tar -tzf /backup/configs.tar.gz | grep -q 'server.conf' && tar -tzf /backup/configs.tar.gz | grep -q 'db.conf'"
        },
        {
          "name": ".txt fayllar kirmagan",
          "cmd": "! tar -tzf /backup/configs.tar.gz | grep -q 'notes.txt'"
        }
      ]
    },
    {
      "id": 3,
      "title": "Systemd service unit",
      "description": "/etc/systemd/system/monitor.service unit faylini yarating: /opt/monitor.sh ni ishga tushirsin (ExecStart), har doim qayta ishga tushsin (Restart=always), multi-user.target uchun enable qilinsin (WantedBy + wants katalogida symlink). Eslatma: konteynerda systemctl ishlamaydi — symlink'ni qo'lda yarating.",
      "hint": "[Unit]/[Service]/[Install] bo'limlari; ln -s bilan multi-user.target.wants ichiga.",
      "seed": "printf '#!/bin/bash\\nwhile true; do sleep 60; done\\n' > /opt/monitor.sh\nchmod +x /opt/monitor.sh",
      "solution": "cat > /etc/systemd/system/monitor.service <<'EOF'\n[Unit]\nDescription=Monitoring service\n\n[Service]\nExecStart=/opt/monitor.sh\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\nEOF\nmkdir -p /etc/systemd/system/multi-user.target.wants\nln -sf /etc/systemd/system/monitor.service /etc/systemd/system/multi-user.target.wants/monitor.service",
      "checks": [
        {
          "name": "ExecStart to'g'ri",
          "cmd": "grep -Eq '^ExecStart=/opt/monitor\\.sh' /etc/systemd/system/monitor.service"
        },
        {
          "name": "Restart=always",
          "cmd": "grep -Eq '^Restart=always' /etc/systemd/system/monitor.service"
        },
        {
          "name": "Enable symlink mavjud",
          "cmd": "[ -L /etc/systemd/system/multi-user.target.wants/monitor.service ]"
        }
      ]
    },
    {
      "id": 4,
      "title": "Tarmoq sozlash (aralash)",
      "description": "dummy2 interfeysini yarating, 192.168.77.10/24 manzil berib UP qiling. /etc/hosts ga 192.168.77.10 monitor.local yozuvini qo'shing.",
      "hint": "ip link add + ip addr add + ip link set up + echo >> /etc/hosts.",
      "seed": "",
      "solution": "ip link add dummy2 type dummy\nip addr add 192.168.77.10/24 dev dummy2\nip link set dummy2 up\necho '192.168.77.10 monitor.local' >> /etc/hosts",
      "checks": [
        {
          "name": "dummy2 UP va IP to'g'ri",
          "cmd": "ip addr show dummy2 | grep -q '192.168.77.10/24' && ip link show dummy2 | grep -q UP"
        },
        {
          "name": "hosts yozuvi bor",
          "cmd": "getent hosts monitor.local | grep -q '192.168.77.10'"
        }
      ]
    },
    {
      "id": 5,
      "title": "Storage sozlash (aralash)",
      "description": "/root/vol.img nomli 150MB image yarating, ext4 bilan formatlang, /mnt/vol mount point oching va /etc/fstab ga loop option bilan yozuv qo'shing.",
      "hint": "truncate/dd → mkfs.ext4 → mkdir → fstab qatori.",
      "seed": "",
      "solution": "truncate -s 150M /root/vol.img\nmkfs.ext4 -q /root/vol.img\nmkdir -p /mnt/vol\necho '/root/vol.img /mnt/vol ext4 loop,defaults 0 2' >> /etc/fstab",
      "checks": [
        {
          "name": "Image 150MB va ext4",
          "cmd": "[ \"$(stat -c %s /root/vol.img)\" = \"157286400\" ] && blkid -o value -s TYPE /root/vol.img | grep -q ext4"
        },
        {
          "name": "Mount point va fstab",
          "cmd": "[ -d /mnt/vol ] && grep -E '^/root/vol\\.img[[:space:]]+/mnt/vol[[:space:]]+ext4' /etc/fstab | grep -q loop"
        }
      ]
    },
    {
      "id": 6,
      "title": "Rejalashtirilgan monitoring (cron)",
      "description": "Root crontab'iga yozuv qo'shing: /opt/monitor.sh har 10 daqiqada ishga tushsin (*/10 sintaksisi bilan).",
      "hint": "*/10 * * * * /opt/monitor.sh.",
      "seed": "printf '#!/bin/bash\\necho tekshirildi\\n' > /opt/monitor.sh\nchmod +x /opt/monitor.sh",
      "solution": "(crontab -l 2>/dev/null; echo '*/10 * * * * /opt/monitor.sh') | crontab -",
      "checks": [
        {
          "name": "Crontab: har 10 daqiqada monitor.sh",
          "cmd": "crontab -l | grep -Eq '^\\*/10[[:space:]]+\\*[[:space:]]+\\*[[:space:]]+\\*[[:space:]]+\\*.*monitor\\.sh'"
        }
      ]
    }
  ]
};

export function getModuleTasks(moduleId) {
  return moduleTasks[Number(moduleId)] || null;
}

export function getModuleTask(moduleId, taskId) {
  const tasks = getModuleTasks(moduleId);
  return tasks?.find((t) => t.id === Number(taskId)) || null;
}

// Combined seed for a module session: every task's fixtures, in order.
export function moduleSeedScript(moduleId) {
  const tasks = getModuleTasks(moduleId);
  if (!tasks) return '';
  return tasks
    .map((t) => t.seed)
    .filter(Boolean)
    .join('\n');
}
