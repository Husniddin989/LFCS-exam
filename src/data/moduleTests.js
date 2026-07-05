// Module final test question banks (12 questions per module).
// Shape: { [moduleId]: [{ question, options[4], correct, explanation }] }
// Modules without an entry simply don't show the test card.
export const moduleTests = {
  "1": [
    {
      "question": "RHEL/CentOS serverida SSH orqali muvaffaqiyatsiz login urinishlarini tekshirish kerak. Authentication loglari qaysi faylda joylashgan?",
      "options": [
        "/var/log/auth.log",
        "/var/log/messages",
        "/var/log/secure",
        "/var/log/lastlog"
      ],
      "correct": 2,
      "explanation": "RHEL/CentOS oilasida authentication loglari /var/log/secure faylida saqlanadi. /var/log/auth.log esa Debian/Ubuntu distributivlariga xos."
    },
    {
      "question": "Serverdagi CPU modeli va core sonini bilish kerak. Qaysi virtual fayldan bu ma'lumotni o'qiysiz?",
      "options": [
        "/proc/cpuinfo",
        "/sys/cpu/info",
        "/dev/cpuinfo",
        "/etc/cpuinfo"
      ],
      "correct": 0,
      "explanation": "/proc — kernel va processlar haqidagi virtual filesystem. cat /proc/cpuinfo CPU haqida to'liq ma'lumot beradi, core sonini esa grep -c processor /proc/cpuinfo bilan sanash mumkin."
    },
    {
      "question": "Yangi yaratilgan /etc/myapp/app.conf faylini locate app.conf topa olmayapti, lekin find topyapti. Muammoni qanday hal qilasiz?",
      "options": [
        "locate -i bilan case-insensitive qidirish",
        "Faylga read permission berish",
        "Tizimni qayta yuklash (reboot)",
        "sudo updatedb buyrug'ini ishga tushirish"
      ],
      "correct": 3,
      "explanation": "locate real-time qidirmaydi — u oldindan tayyorlangan database'dan foydalanadi. sudo updatedb bu database'ni yangilaydi va yangi fayllar ko'rina boshlaydi."
    },
    {
      "question": "app.log faylida 'OutOfMemoryError' qatorini va undan KEYINGI 10 qatorlik stack trace'ni ham ko'rish kerak. Qaysi buyruq?",
      "options": [
        "grep -B 10 \"OutOfMemoryError\" app.log",
        "grep -A 10 \"OutOfMemoryError\" app.log",
        "grep -n 10 \"OutOfMemoryError\" app.log",
        "grep -o 10 \"OutOfMemoryError\" app.log"
      ],
      "correct": 1,
      "explanation": "-A (After) flag'i topilgan qatordan keyingi N qatorni ham ko'rsatadi. -B (Before) esa oldingi qatorlarni chiqaradi — stack trace odatda xatodan keyin keladi."
    },
    {
      "question": "/mnt/backup (alohida filesystemga mount qilingan disk) dagi data.db fayliga /home/admin ichidan link yaratish kerak. Qaysi buyruq ishlaydi?",
      "options": [
        "ln -s /mnt/backup/data.db /home/admin/data.db",
        "ln /mnt/backup/data.db /home/admin/data.db",
        "cp -l /mnt/backup/data.db /home/admin/data.db",
        "ln --cross-device /mnt/backup/data.db /home/admin/data.db"
      ],
      "correct": 0,
      "explanation": "Hard link (ln, cp -l) inode raqamiga bog'lanadi va inode faqat o'z filesystemida mavjud — boshqa filesystemga o'ta olmaydi. Symbolic link (ln -s) path'ga ishora qilgani uchun filesystemlar aro bemalol ishlaydi."
    },
    {
      "question": "\"Server 20 daqiqa oldin ishlamay qoldi\" — /etc da oxirgi 30 daqiqa ichida o'zgartirilgan fayllarni topish uchun qaysi buyruq to'g'ri?",
      "options": [
        "find /etc -type f -mtime -30",
        "find /etc -type f -atime -30",
        "find /etc -type f -mmin -30",
        "find /etc -type f -mmin +30"
      ],
      "correct": 2,
      "explanation": "-mmin minutlarda o'lchaydi: -30 degani oxirgi 30 daqiqa ichida modified. -mtime -30 esa oxirgi 30 KUN degani, -mmin +30 — 30 daqiqadan ESKI fayllar."
    },
    {
      "question": "/etc/passwd faylidan faqat username va shell (1- va 7-maydonlar) ni chiqarish kerak. Qaysi buyruq to'g'ri natija beradi?",
      "options": [
        "awk '{print $1, $7}' /etc/passwd",
        "awk -F':' '{print $1, $7}' /etc/passwd",
        "cut -d',' -f1,7 /etc/passwd",
        "sed -n '1,7p' /etc/passwd"
      ],
      "correct": 1,
      "explanation": "/etc/passwd maydonlari ':' bilan ajratilgan, shuning uchun awk'ga -F':' delimiter kerak. Default holatda awk whitespace bo'yicha ajratadi va noto'g'ri natija chiqadi."
    },
    {
      "question": "app.conf faylida barcha 'http://' larni 'https://' ga almashtirish va o'zgartirishdan oldin avtomatik zaxira nusxa (app.conf.bak) qoldirish kerak. Qaysi buyruq?",
      "options": [
        "sed 's|http://|https://|g' app.conf",
        "sed -n 's|http://|https://|gp' app.conf",
        "sed --backup 's|http://|https://|g' app.conf",
        "sed -i.bak 's|http://|https://|g' app.conf"
      ],
      "correct": 3,
      "explanation": "-i faylni joyida (in-place) o'zgartiradi, .bak suffiksi esa originalni app.conf.bak sifatida saqlab qoladi. Suffikssiz oddiy sed faqat stdout'ga chiqaradi, fayl o'zgarmaydi."
    },
    {
      "question": "release.tar.gz arxivini /opt/deploy/ directorysiga ochish (extract) kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "tar -xzvf release.tar.gz -C /opt/deploy/",
        "tar -xzvf release.tar.gz > /opt/deploy/",
        "tar -czvf release.tar.gz /opt/deploy/",
        "tar -xzvf /opt/deploy/ -f release.tar.gz"
      ],
      "correct": 0,
      "explanation": "-C flag'i tar'ga extract qilinadigan manzilni ko'rsatadi. -czvf esa aksincha yangi arxiv YARATADI, > bilan redirect esa directoryga ishlamaydi."
    },
    {
      "question": "find /data -name '*.tmp' | xargs rm buyrug'i nomida bo'sh joy (space) bo'lgan fayllarda xato bermoqda. Xavfsiz yechim qaysi?",
      "options": [
        "find /data -name '*.tmp' | xargs -n1 rm",
        "find /data -name '*.tmp' -print0 | xargs -0 rm",
        "find /data -name '*.tmp' | rm -f",
        "find /data -name '*.tmp' | xargs rm -rf"
      ],
      "correct": 1,
      "explanation": "-print0 fayl nomlarini null belgisi bilan ajratib chiqaradi, xargs -0 esa aynan shu formatni o'qiydi — bo'sh joy va newline'li nomlar muammosiz o'chiriladi. rm stdin'dan fayl nomlarini o'qimaydi."
    },
    {
      "question": "deploy.sh skriptining ham stdout, ham stderr chiqishini bir vaqtda EKRANDA ko'rish va deploy.log fayliga saqlash kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "./deploy.sh > deploy.log 2>&1",
        "./deploy.sh | tee deploy.log",
        "./deploy.sh 2>&1 | tee deploy.log",
        "./deploy.sh 2> deploy.log | tee"
      ],
      "correct": 2,
      "explanation": "2>&1 stderr'ni stdout oqimiga qo'shadi, tee esa kelgan oqimni ham ekranga, ham faylga yozadi. > deploy.log 2>&1 varianti hammasini faylga yozadi, lekin ekranda hech narsa ko'rinmaydi."
    },
    {
      "question": "Backup skriptida: tar -czf backup.tar.gz /data 2>&1 | tee backup.log. Aynan tar buyrug'i muvaffaqiyatli tugaganini qanday tekshirasiz?",
      "options": [
        "echo $? — u har doim tar'ning exit code'ini ko'rsatadi",
        "echo $! qiymatini tekshirish",
        "tee muvaffaqiyatli bo'lsa, tar ham muvaffaqiyatli degani",
        "${PIPESTATUS[0]} qiymatini tekshirish"
      ],
      "correct": 3,
      "explanation": "Pipeline'da $? faqat OXIRGI buyruq (tee) ning exit code'ini qaytaradi. Bash'dagi PIPESTATUS massivi har bir buyruq natijasini saqlaydi — ${PIPESTATUS[0]} birinchi buyruq (tar) niki."
    }
  ],
  "2": [
    {
      "question": "Server'da nginx uchun interaktiv login qila olmaydigan va home directory'siz system account yaratish kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "useradd -m -s /bin/bash nginx",
        "useradd -r -s /bin/bash -m nginx",
        "useradd -r -s /sbin/nologin -M nginx",
        "usermod -L -s /bin/sh nginx"
      ],
      "correct": 2,
      "explanation": "Service account uchun -r (system account, UID < 1000), -s /sbin/nologin (interaktiv login yo'q) va -M (home directory yaratilmasin) flaglari ishlatiladi."
    },
    {
      "question": "Xavfsizlik siyosatiga ko'ra john user'ining paroli maksimal 60 kun amal qilishi kerak. Qaysi buyruq buni o'rnatadi?",
      "options": [
        "chage -M 60 john",
        "chage -m 60 john",
        "chage -W 60 john",
        "chage -I 60 john"
      ],
      "correct": 0,
      "explanation": "chage -M (katta M) parolning maksimal amal qilish muddatini kunlarda belgilaydi. Kichik -m esa minimal kunlar, -W ogohlantirish, -I inactive muddatini o'rnatadi."
    },
    {
      "question": "/etc/shadow faylida user parol hash'i $6$ bilan boshlanadi. Bu qaysi hash algoritmini bildiradi?",
      "options": [
        "MD5",
        "SHA-256",
        "SHA-512",
        "yescrypt"
      ],
      "correct": 2,
      "explanation": "$6$ prefiksi SHA-512 algoritmini bildiradi (tavsiya etilgan). $1$ = MD5, $5$ = SHA-256, $y$ = yescrypt."
    },
    {
      "question": "User shell'ida umask 027 o'rnatilgan. touch bilan yaratilgan yangi oddiy fayl qanday permission oladi?",
      "options": [
        "750 (rwxr-x---)",
        "640 (rw-r-----)",
        "644 (rw-r--r--)",
        "600 (rw-------)"
      ],
      "correct": 1,
      "explanation": "Fayl uchun default 666 dan umask 027 ayiriladi: 666 - 027 = 640 (rw-r-----). 750 esa directory uchun natija bo'lardi (777 - 027)."
    },
    {
      "question": "Directory permission'i drw-r--r-- (644). User 'ls' bilan ichidagi fayllar ro'yxatini ko'ra oladi, lekin 'cd' qilib kira olmaydi. Sababi nima?",
      "options": [
        "Read (r) permission yetarli emas",
        "Directory owner'i root",
        "Sticky bit o'rnatilgan",
        "Execute (x) permission yo'q — directory'ga kirish uchun x kerak"
      ],
      "correct": 3,
      "explanation": "Directory'da execute (x) biti access/traverse ruxsatini beradi — usiz 'cd' ishlamaydi. Read (r) faqat fayllar ro'yxatini ko'rishga imkon beradi."
    },
    {
      "question": "/shared/team directory'sining group'i developers qilingan. Endi bu directory ichida yaratiladigan har bir yangi fayl avtomatik developers group'iga tegishli bo'lishi kerak. Qaysi buyruq?",
      "options": [
        "chmod 1775 /shared/team",
        "chmod 2775 /shared/team",
        "chmod 4775 /shared/team",
        "chown -R :developers /shared/team"
      ],
      "correct": 1,
      "explanation": "2 = SGID biti. Directory'da SGID o'rnatilsa, yangi fayllar yaratuvchining primary group'i emas, directory group'ini (developers) meros qilib oladi."
    },
    {
      "question": "chmod -R a+X /data buyrug'idagi katta X kichik x dan qanday farq qiladi?",
      "options": [
        "Execute'ni faqat directory'larga va allaqachon executable fayllarga qo'shadi",
        "Execute'ni barcha fayllarga majburan qo'shadi",
        "Execute'ni faqat owner uchun qo'shadi",
        "Hech qanday farqi yo'q, ikkalasi bir xil"
      ],
      "correct": 0,
      "explanation": "Katta X recursive rejimda xavfsiz: oddiy fayllarni executable qilib yubormaydi, faqat directory'lar va allaqachon x biti bor fayllarga execute qo'shadi."
    },
    {
      "question": "report.pdf faylidagi BARCHA ACL yozuvlarini olib tashlab, faqat standart Unix permissions'ga qaytarish kerak. Qaysi buyruq?",
      "options": [
        "setfacl -x report.pdf",
        "setfacl -k report.pdf",
        "setfacl -b report.pdf",
        "getfacl -c report.pdf"
      ],
      "correct": 2,
      "explanation": "setfacl -b barcha ACL yozuvlarini o'chirib, faylni standart permissions holatiga qaytaradi. -x bitta yozuvni, -k faqat default ACL'ni olib tashlaydi."
    },
    {
      "question": "getfacl chiqishida 'user:bob:rwx' yozuvi bor, lekin bob faylga yoza olmayapti. Chiqishda 'mask::r--' ham ko'rinadi. Muammo nima?",
      "options": [
        "bob fayl owner'i emas, shuning uchun ACL ishlamaydi",
        "Mask effective permission'ni cheklayapti — setfacl -m m::rwx bilan tuzatiladi",
        "Filesystem ACL'ni qo'llab-quvvatlamaydi",
        "Default ACL o'rnatilmagan"
      ],
      "correct": 1,
      "explanation": "Effective permission = ACL yozuvi VA mask kesishmasi: rwx AND r-- = r--. Mask'ni setfacl -m m::rwx bilan kengaytirilsa, bob yoza oladi."
    },
    {
      "question": "User o'ziga sudo orqali qaysi buyruqlar ruxsat etilganini ko'rmoqchi. Qaysi buyruqni ishlatadi?",
      "options": [
        "sudo -k",
        "visudo -c",
        "sudo -v",
        "sudo -l"
      ],
      "correct": 3,
      "explanation": "sudo -l joriy user uchun ruxsat etilgan buyruqlar ro'yxatini ko'rsatadi. sudo -k timestamp'ni bekor qiladi, visudo -c esa sudoers syntax'ini tekshiradi."
    },
    {
      "question": "Admin /etc/sudoers.d/backup.conf faylini yaratdi va unga to'g'ri qoida yozdi, lekin qoida umuman ishlamayapti. Eng ehtimoliy sabab nima?",
      "options": [
        "Fayl nomida nuqta (.) bor — sudo bunday fayllarni e'tiborsiz qoldiradi",
        "sudoers.d fayllari uchun sudo service'ni restart qilish kerak",
        "Qoidada NOPASSWD tag'i yo'q",
        "/etc/sudoers.d faqat root user qoidalari uchun ishlatiladi"
      ],
      "correct": 0,
      "explanation": "sudo /etc/sudoers.d ichidagi nomida nuqta bo'lgan yoki ~ bilan tugagan fayllarni o'qimaydi. Fayl nomini 'backup' qilib o'zgartirish kerak (visudo -f /etc/sudoers.d/backup)."
    },
    {
      "question": "User john tizimga kira olmayapti. 'passwd -S john' chiqishi: 'john LK 2026-01-15 0 90 7 -1'. Muammo va yechim qaysi?",
      "options": [
        "Parol muddati tugagan — chage -d 0 john bilan tuzatiladi",
        "Shell noto'g'ri — usermod -s /bin/bash john kerak",
        "Account lock qilingan — usermod -U john bilan ochiladi",
        "Home directory yo'q — mkdir /home/john kerak"
      ],
      "correct": 2,
      "explanation": "passwd -S chiqishidagi LK holati account lock qilinganini bildiradi (hash oldiga ! qo'yilgan). usermod -U john yoki passwd -u john bilan unlock qilinadi."
    }
  ],
  "3": [
    {
      "question": "Siz /etc/systemd/system/myapp.service unit faylini tahrirladingiz. Service'ni restart qilishdan OLDIN qaysi buyruqni bajarish shart?",
      "options": [
        "systemctl reset-failed myapp",
        "systemctl reload myapp",
        "systemctl daemon-reload",
        "systemctl unmask myapp"
      ],
      "correct": 2,
      "explanation": "Unit fayllar o'zgartirilgandan keyin systemd konfiguratsiyani qayta o'qishi uchun har doim systemctl daemon-reload bajariladi. systemctl reload esa unit faylni emas, service'ning o'z konfiguratsiyasini (masalan nginx.conf) qayta yuklaydi."
    },
    {
      "question": "Server'da apache2 service'i hech qachon — hatto administrator qo'lda urinsa ham — ishga tushmasligi kerak. Qaysi buyruq buni ta'minlaydi?",
      "options": [
        "systemctl mask apache2",
        "systemctl disable apache2",
        "systemctl stop apache2",
        "systemctl disable --now apache2"
      ],
      "correct": 0,
      "explanation": "systemctl mask unit'ni /dev/null ga symlink qiladi — service'ni qo'lda ham ishga tushirib bo'lmaydi. disable esa faqat boot'dagi avtomatik startni o'chiradi, qo'lda start qilish mumkin bo'lib qolaveradi."
    },
    {
      "question": "Server kechasi kutilmaganda reboot bo'ldi. Aynan OLDINGI boot sessiyasidagi loglarni ko'rish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "journalctl -f",
        "journalctl -k",
        "dmesg",
        "journalctl -b -1"
      ],
      "correct": 3,
      "explanation": "journalctl -b -1 oldingi boot'ning loglarini ko'rsatadi (barcha boot'lar ro'yxati: journalctl --list-boots). dmesg va journalctl -k esa faqat joriy boot'ning kernel xabarlarini ko'rsatadi."
    },
    {
      "question": "nginx'ning vendor unit fayliga (/usr/lib/systemd/system/nginx.service) LimitNOFILE parametrini qo'shish kerak, lekin vendor faylni to'g'ridan-to'g'ri tahrirlash tavsiya etilmaydi. To'g'ri usul qaysi?",
      "options": [
        "vim /usr/lib/systemd/system/nginx.service bilan faylni bevosita o'zgartirish",
        "systemctl edit nginx — override.conf fayl yaratib, unga [Service] bo'limida parametrni yozish",
        "systemctl cat nginx buyrug'i bilan faylni ochib o'zgartirish",
        "Unit faylni /etc/nginx/ katalogiga nusxalash"
      ],
      "correct": 1,
      "explanation": "systemctl edit nginx /etc/systemd/system/nginx.service.d/override.conf faylini yaratadi — bu o'zgarishlar paket yangilanganda yo'qolmaydi. Vendor faylni bevosita tahrirlash paket update'da o'chib ketadi."
    },
    {
      "question": "GUI o'rnatilgan server bundan keyin doimiy ravishda faqat console (GUI'siz) rejimda boot bo'lishi kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "systemctl isolate multi-user.target",
        "systemctl get-default",
        "systemctl set-default multi-user.target",
        "systemctl set-default graphical.target"
      ],
      "correct": 2,
      "explanation": "systemctl set-default multi-user.target default target'ni doimiy o'zgartiradi — keyingi barcha boot'lar GUI'siz bo'ladi. isolate esa faqat joriy sessiyada target'ga o'tadi, reboot'dan keyin saqlanmaydi."
    },
    {
      "question": "PID 4321 bo'lgan ishlab turgan processning prioritetini pasaytirish (nice qiymatini 10 ga o'rnatish) uchun qaysi buyruq to'g'ri?",
      "options": [
        "renice -n 10 -p 4321",
        "nice -n 10 4321",
        "nice -n 10 -p 4321",
        "renice -n -10 4321"
      ],
      "correct": 0,
      "explanation": "renice ishlab turgan processning nice qiymatini o'zgartiradi: renice -n 10 -p 4321. nice esa faqat YANGI processni ma'lum prioritet bilan ishga tushirish uchun ishlatiladi; -10 esa prioritetni oshiradi (faqat root)."
    },
    {
      "question": "ps aux natijasida bir nechta process STAT ustunida 'Z' holatida ko'rinyapti va kill -9 ularga umuman ta'sir qilmayapti. Muammoni qanday hal qilish kerak?",
      "options": [
        "kill -SIGCONT bilan processlarni davom ettirish",
        "renice bilan ularning prioritetini oshirish",
        "systemctl daemon-reload bajarish",
        "ps -o ppid= -p PID bilan parent processni aniqlab, uni kill/restart qilish"
      ],
      "correct": 3,
      "explanation": "Zombie (Z) process allaqachon tugagan, faqat parent uni wait() bilan reap qilmagan — shuning uchun uni kill qilib bo'lmaydi. Parent process kill/restart qilinsa, zombie'larni init/systemd o'zi tozalaydi."
    },
    {
      "question": "SSH orqali uzoq davom etadigan skriptni ishga tushirmoqchisiz va SSH sessiya uzilib qolsa ham skript ishlashda davom etishi kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "./long-script.sh &",
        "nohup ./long-script.sh &",
        "fg ./long-script.sh",
        "nice -n 19 ./long-script.sh"
      ],
      "correct": 1,
      "explanation": "nohup processni SIGHUP signalidan himoya qiladi — SSH uzilganda ham skript ishlayveradi (output nohup.out ga yoziladi). Oddiy & bilan ishga tushirilgan job esa shell yopilganda SIGHUP olib to'xtashi mumkin."
    },
    {
      "question": "Crontab'dagi '0 3 * * 0' yozuvi qachon ishga tushadi?",
      "options": [
        "Har yakshanba soat 03:00 da",
        "Har kuni soat 03:00 da",
        "Har 3 daqiqada",
        "Oyning har 3-kunida yarim tunda"
      ],
      "correct": 0,
      "explanation": "Beshinchi maydon — hafta kuni (0 = yakshanba), birinchi maydon minut (0), ikkinchisi soat (3). Demak job har yakshanba soat 03:00 da ishga tushadi."
    },
    {
      "question": "Laptop har kuni soat 02:00 da backup qilishi kerak, lekin bu vaqtda u ko'pincha o'chiq bo'ladi. O'tkazib yuborilgan ish laptop keyingi yoqilganda ham albatta bajarilishi uchun qaysi yechim to'g'ri?",
      "options": [
        "crontab -e orqali '0 2 * * *' yozuvini qo'shish",
        "at '2:00 AM tomorrow' bilan job yaratish",
        "[Timer] bo'limida Persistent=true bo'lgan systemd timer yaratish",
        "@reboot crontab yozuvidan foydalanish"
      ],
      "correct": 2,
      "explanation": "Systemd timer'da Persistent=true o'tkazib yuborilgan ishni tizim keyingi yoqilganda avtomatik bajaradi (anacron kabi). Oddiy cron o'chiq tizimda o'tkazgan ishni qaytarmaydi, @reboot esa jadvaldan qat'i nazar har boot'da ishlaydi."
    },
    {
      "question": "SELinux yoqilgan RHEL serverida rd.break orqali root parolni tikladingiz (mount -o remount,rw /sysroot; chroot /sysroot; passwd root). Reboot'dan keyin yangi parol bilan kirish ishlashi uchun exit qilishdan OLDIN yana qaysi buyruq zarur?",
      "options": [
        "setenforce 0",
        "touch /.autorelabel",
        "restorecon /etc/passwd",
        "systemctl daemon-reload"
      ],
      "correct": 1,
      "explanation": "touch /.autorelabel keyingi boot'da butun filesystem'ning SELinux context'larini qayta belgilashga majbur qiladi. Busiz o'zgartirilgan /etc/shadow noto'g'ri context bilan qoladi va login ishlamasligi mumkin."
    },
    {
      "question": "Server boot bo'lishi juda sekinlashib ketdi. Qaysi service ishga tushishga eng ko'p vaqt sarflayotganini aniqlash uchun qaysi buyruq eng mos?",
      "options": [
        "systemctl list-units --state=running",
        "uptime",
        "journalctl -p err",
        "systemd-analyze blame"
      ],
      "correct": 3,
      "explanation": "systemd-analyze blame har bir unitning ishga tushishga sarflagan vaqtini eng sekinidan boshlab ro'yxat qiladi. Dependency zanjirini ko'rish uchun esa systemd-analyze critical-chain ishlatiladi."
    }
  ],
  "4": [
    {
      "question": "Serverda eth0 interfeysiga vaqtinchalik (reboot'gacha amal qiladigan) 192.168.1.100/24 IP manzilini qo'shish uchun qaysi buyruq to'g'ri?",
      "options": [
        "ip link add 192.168.1.100/24 dev eth0",
        "ip route add 192.168.1.100/24 dev eth0",
        "ip addr add 192.168.1.100/24 dev eth0",
        "nmcli addr add 192.168.1.100/24 eth0"
      ],
      "correct": 2,
      "explanation": "ip addr add MANZIL/PREFIX dev INTERFEYS — interfeysga IP qo'shishning zamonaviy usuli. Bu o'zgarish runtime'da amal qiladi va reboot'dan keyin yo'qoladi."
    },
    {
      "question": "DNS tekshiruvda domen nomining faqat IP manzilini (ortiqcha ma'lumotlarsiz, bitta qatorda) olish uchun qaysi buyruq eng qulay?",
      "options": [
        "dig example.com +short",
        "dig example.com +trace",
        "dig -x example.com",
        "host -a example.com"
      ],
      "correct": 0,
      "explanation": "dig +short faqat javobni (IP manzilni) chiqaradi. +trace to'liq resolution yo'lini ko'rsatadi, -x reverse lookup uchun, host -a esa barcha yozuvlarni chiqaradi."
    },
    {
      "question": "firewalld ishlayotgan serverda hozirgi default zone nomini bilish kerak. Qaysi buyruq buni bevosita ko'rsatadi?",
      "options": [
        "firewall-cmd --get-zones",
        "firewall-cmd --get-default-zone",
        "firewall-cmd --list-all-zones",
        "firewall-cmd --state"
      ],
      "correct": 1,
      "explanation": "firewall-cmd --get-default-zone default zone nomini (odatda public) qaytaradi. --get-zones barcha mavjud zone'larni sanaydi, --state esa faqat firewalld ishlayotganini ko'rsatadi."
    },
    {
      "question": "dig example.com buyrug'i javobida status: NXDOMAIN ko'rindi. Bu nimani anglatadi?",
      "options": [
        "DNS server so'rovni rad etdi (REFUSED)",
        "DNS serverda ichki xato yuz berdi",
        "DNS serverga ulanish vaqti tugadi (timeout)",
        "So'ralgan domen mavjud emas"
      ],
      "correct": 3,
      "explanation": "NXDOMAIN — so'ralgan domen DNS'da umuman mavjud emas degani. Server xatosi SERVFAIL, rad etish REFUSED, server yetib bo'lmasligi esa timeout ko'rinishida bo'ladi."
    },
    {
      "question": "Ko'p interfeysli serverda 8.8.8.8 manziliga trafik qaysi interfeys, gateway va qaysi source IP orqali chiqishini aniq bilish kerak. Qaysi buyruq buni bevosita ko'rsatadi?",
      "options": [
        "ip addr show",
        "ip route get 8.8.8.8",
        "traceroute -n 8.8.8.8",
        "ss -t dst 8.8.8.8"
      ],
      "correct": 1,
      "explanation": "ip route get 8.8.8.8 kernel'ning routing qaroriga asoslanib, aynan shu manzil uchun ishlatiladigan interfeys, gateway va src IP'ni ko'rsatadi."
    },
    {
      "question": "Admin 'ip addr add 10.0.1.20/24 dev eth0' bilan ikkinchi IP qo'shdi, lekin reboot'dan keyin u yo'qoldi. NetworkManager ishlatadigan tizimda bu IP'ni doimiy qilishning to'g'ri usuli qaysi?",
      "options": [
        "ip addr add 10.0.1.20/24 dev eth0 --permanent",
        "echo \"10.0.1.20/24\" >> /etc/resolv.conf",
        "nmcli con mod eth0 +ipv4.addresses 10.0.1.20/24 && nmcli con up eth0",
        "iptables-save > /etc/sysconfig/iptables"
      ],
      "correct": 2,
      "explanation": "ip buyrug'i faqat runtime o'zgarish qiladi va --permanent flag'i unda yo'q. NetworkManager tizimlarida doimiy sozlama nmcli con mod bilan yoziladi va nmcli con up bilan qo'llanadi."
    },
    {
      "question": "Ubuntu serverini masofadan (SSH orqali) boshqaryapsiz va netplan konfiguratsiyasini o'zgartirmoqchisiz. Yangi sozlama tasdiqlanmasa avtomatik ravishda eski holatga qaytishi uchun qaysi buyruqni ishlatgan ma'qul?",
      "options": [
        "netplan try",
        "netplan apply",
        "netplan --debug generate",
        "netplan rollback"
      ],
      "correct": 0,
      "explanation": "netplan try konfiguratsiyani vaqtincha qo'llaydi va timeout ichida tasdiqlanmasa avtomatik bekor qiladi — masofaviy serverda aloqadan uzilib qolishdan saqlaydi. netplan apply esa darhol va qaytarib bo'lmas tarzda qo'llaydi."
    },
    {
      "question": "Admin 'firewall-cmd --add-port=8080/tcp' bajardi va port ochildi. Keyin 'firewall-cmd --reload' qilgan edi — port yana yopilib qoldi. Sababi nima?",
      "options": [
        "8080-portni ochish uchun avval zone ko'rsatilishi shart edi",
        "--reload dan oldin systemctl restart firewalld bajarish kerak edi",
        "8080 port firewalld'da reserved port hisoblanadi",
        "--permanent flag'siz qoida faqat runtime'da yashaydi — --reload uni o'chirib, permanent konfiguratsiyani yuklaydi"
      ],
      "correct": 3,
      "explanation": "--permanent'siz qo'shilgan qoidalar faqat runtime konfiguratsiyada saqlanadi. firewall-cmd --reload permanent konfiguratsiyani qayta yuklaydi va runtime'dagi vaqtinchalik qoidalarni bekor qiladi."
    },
    {
      "question": "iptables'da INPUT chain oxirida 'DROP all' qoidasi bor. SSH (port 22) uchun ACCEPT qoidasini chain'ning eng boshiga (1-pozitsiyaga) joylash kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "iptables -A INPUT -p tcp --dport 22 -j ACCEPT",
        "iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT",
        "iptables -R INPUT 1 -p tcp --dport 22 -j ACCEPT",
        "iptables -D INPUT -p tcp --dport 22 -j ACCEPT"
      ],
      "correct": 1,
      "explanation": "iptables -I INPUT 1 qoidani chain'ning 1-pozitsiyasiga kiritadi, shuning uchun u DROP'dan oldin ishlaydi. -A oxiriga qo'shadi (DROP'dan keyin qolib ishlamaydi), -R mavjud qoidani almashtiradi, -D o'chiradi."
    },
    {
      "question": "Serverdan ba'zi saytlar ochiladi, ba'zilari esa 'osilib' qoladi. Tekshiruvda 'ping -M do -s 1472 host' ishlaydi, lekin 'ping -M do -s 1473 host' \"Message too long\" xatosi beradi. Bu nimadan dalolat?",
      "options": [
        "Firewall ICMP paketlarini bloklayapti",
        "DNS server noto'g'ri javob qaytaryapti",
        "Path MTU 1500 ga teng — undan katta paketlar fragmentatsiyasiz o'tmaydi (MTU muammosi)",
        "Duplex mismatch tufayli paketlar yo'qolyapti"
      ],
      "correct": 2,
      "explanation": "1472 bayt payload + 28 bayt ICMP/IP header = 1500 bayt (standart MTU). -M do fragmentatsiyani taqiqlaydi, shuning uchun 1473 baytda xato chiqishi path MTU chegarasi 1500 ekanini ko'rsatadi."
    },
    {
      "question": "nginx ishlab turibdi: 'curl http://localhost' lokalda ishlaydi, 'ss -tulnp' esa nginx 0.0.0.0:80 da tinglayotganini ko'rsatadi. Lekin tashqi klientlar ulanolmayapti. Eng ehtimoliy sabab va birinchi tekshiruv qaysi?",
      "options": [
        "Lokal firewall 80-portni bloklayapti — firewall-cmd --list-all bilan tekshirish kerak",
        "nginx faqat 127.0.0.1 da tinglayapti — listen direktivasini o'zgartirish kerak",
        "80-port boshqa servis tomonidan band — nginx'ni boshqa portga o'tkazish kerak",
        "DNS noto'g'ri sozlangan — /etc/resolv.conf ni tuzatish kerak"
      ],
      "correct": 0,
      "explanation": "Servis 0.0.0.0:80 da tinglayapti va lokalda javob beryapti — demak muammo tarmoq yo'lida, eng avvalo lokal firewall qoidalarini (firewall-cmd --list-all yoki iptables -L -n -v) tekshirish kerak. ss chiqishi 2- va 3-variantlarni istisno qiladi."
    },
    {
      "question": "Ilova serverda 8080-portda ishlaydi, lekin foydalanuvchilar standart 80-port orqali kirishi kerak. firewalld yordamida 80-portga kelgan TCP trafikni 8080-portga yo'naltirish uchun qaysi buyruq to'g'ri?",
      "options": [
        "firewall-cmd --add-port=80-8080/tcp --permanent",
        "firewall-cmd --add-masquerade --to-port=8080 --permanent",
        "firewall-cmd --add-rich-rule='forward 80 to 8080' --permanent",
        "firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080 --permanent"
      ],
      "correct": 3,
      "explanation": "Port forwarding uchun to'g'ri sintaksis: firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080 --permanent (keyin --reload). --add-port=80-8080 esa 80 dan 8080 gacha bo'lgan barcha portlarni ochib yuboradi."
    }
  ],
  "5": [
    {
      "question": "Serverga 4TB hajmli yangi disk (/dev/sdb) ulandi va uni to'liq hajmda partition qilish kerak. Qaysi partition table tanlanishi kerak va nima uchun?",
      "options": [
        "MBR — chunki barcha tizimlar bilan mos keladi",
        "GPT — chunki MBR maksimal 2TB gacha diskni qo'llab-quvvatlaydi",
        "MBR — extended partition orqali 4TB ga yetish mumkin",
        "LVM ishlatilsa MBR ham 4TB ni to'liq qo'llab-quvvatlaydi"
      ],
      "correct": 1,
      "explanation": "MBR partition table maksimal 2TB disk hajmini qo'llab-quvvatlaydi, shuning uchun 2TB dan katta disklar uchun GPT majburiy: parted /dev/sdb mklabel gpt."
    },
    {
      "question": "fdisk yordamida /dev/sdb da yangi partition yaratildi, lekin lsblk chiqishida u ko'rinmayapti. Serverni reboot qilmasdan kernel'ga partition table'ni qayta o'qitish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "partprobe /dev/sdb",
        "fsck -f /dev/sdb",
        "mkfs.ext4 /dev/sdb",
        "mount -a"
      ],
      "correct": 0,
      "explanation": "partprobe kernel'ga partition table o'zgarishlarini reboot'siz qayta o'qitadi. mount -a faqat fstab'dagi filesystemlarni mount qiladi, partition table'ga tegmaydi."
    },
    {
      "question": "Server'da 20GB hajmli XFS filesystem'li logical volume'ni 10GB ga kichraytirish (shrink) vazifasi berildi. Qaysi javob to'g'ri?",
      "options": [
        "umount qilib, resize2fs /dev/vg/lv 10G bajariladi",
        "xfs_growfs -d 10G bilan kichraytiriladi",
        "lvreduce -L 10G -r buyrug'i hammasini avtomatik bajaradi",
        "XFS shrink'ni qo'llab-quvvatlamaydi — backup olib, kichikroq filesystem yaratib, ma'lumot qaytariladi"
      ],
      "correct": 3,
      "explanation": "XFS faqat kattalashadi (grow), kichraytirishni umuman qo'llab-quvvatlamaydi. Yagona yo'l — ma'lumotni backup qilish, kichikroq LV/filesystem yaratish va ma'lumotni qaytarish; resize2fs esa faqat ext2/3/4 uchun ishlaydi."
    },
    {
      "question": "data_vg volume group'idagi barcha bo'sh joydan foydalanib yangi logical volume yaratish uchun qaysi buyruq to'g'ri?",
      "options": [
        "lvcreate -n lv_data -L 100%FREE data_vg",
        "lvcreate -n lv_data --size full data_vg",
        "lvcreate -n lv_data -l 100%FREE data_vg",
        "vgcreate -n lv_data -l 100% data_vg"
      ],
      "correct": 2,
      "explanation": "Foizli qiymatlar uchun kichik -l (extent) opsiyasi ishlatiladi: lvcreate -l 100%FREE. Katta -L esa faqat aniq o'lcham (masalan, 10G) qabul qiladi."
    },
    {
      "question": "MySQL server'da /var/lib/mysql joylashgan lv_mysql to'ldi, vg_db'da bo'sh joy qolmagan. Serverga yangi /dev/sdd diski ulandi. To'g'ri ketma-ketlik qaysi?",
      "options": [
        "vgextend vg_db /dev/sdd → pvcreate /dev/sdd → lvextend -r",
        "mkfs.ext4 /dev/sdd → mount qilish → fstab'ga qo'shish",
        "pvcreate /dev/sdd → vgextend vg_db /dev/sdd → lvextend -L +50G -r /dev/vg_db/lv_mysql",
        "lvextend -L +50G /dev/sdd → resize2fs /dev/sdd"
      ],
      "correct": 2,
      "explanation": "Avval disk PV qilinadi (pvcreate), keyin VG kengaytiriladi (vgextend), so'ng LV kattalashtiriladi; -r flag'i filesystem'ni ham avtomatik resize qiladi."
    },
    {
      "question": "Katta update'dan oldin lvcreate -s bilan app_snap snapshot'i olingan edi. Update muvaffaqiyatsiz tugadi. LV'ni snapshot olingan holatiga qaytarish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "lvconvert --merge /dev/vg_app/app_snap",
        "lvremove /dev/vg_app/app_snap",
        "lvextend -r /dev/vg_app/app_snap",
        "mount -o remount /dev/vg_app/app_snap"
      ],
      "correct": 0,
      "explanation": "lvconvert --merge snapshot'ni origin LV'ga qaytarib birlashtiradi va barcha o'zgarishlarni bekor qiladi (rollback). lvremove esa snapshot'ni o'chirib, qaytarish imkoniyatini yo'qotadi."
    },
    {
      "question": "data_vg tarkibidagi /dev/sdb diski SMART xatolar ko'rsatmoqda. VG'ga yangi /dev/sdd allaqachon qo'shilgan. Ma'lumotni yo'qotmasdan eski diskni VG'dan chiqarishning to'g'ri ketma-ketligi qaysi?",
      "options": [
        "vgreduce data_vg /dev/sdb → pvmove /dev/sdb",
        "pvmove /dev/sdb → vgreduce data_vg /dev/sdb → pvremove /dev/sdb",
        "pvremove /dev/sdb → vgreduce data_vg /dev/sdb",
        "lvremove /dev/sdb → vgremove data_vg"
      ],
      "correct": 1,
      "explanation": "Avval pvmove barcha ma'lumot extent'larini boshqa PV'larga ko'chiradi, keyin vgreduce diskni VG'dan chiqaradi va pvremove PV belgisini o'chiradi. Teskari tartib ma'lumot yo'qolishiga olib keladi."
    },
    {
      "question": "/etc/fstab dagi NFS mount server yuklanishida tarmoq hali tayyor bo'lmagani sababli xatolik bermasligi uchun qaysi mount option qo'shilishi kerak?",
      "options": [
        "noauto",
        "sync",
        "user",
        "_netdev"
      ],
      "correct": 3,
      "explanation": "_netdev opsiyasi tizimga bu filesystem tarmoqqa bog'liqligini bildiradi va mount tarmoq ko'tarilgunicha kutadi: 192.168.1.100:/exports/data /mnt/nfs nfs defaults,_netdev 0 0."
    },
    {
      "question": "umount /mnt/data buyrug'i 'target is busy' xatosini qaytarmoqda. Mount point'ni qaysi processlar band qilayotganini aniqlash uchun qaysi buyruq ishlatiladi?",
      "options": [
        "df -h /mnt/data",
        "findmnt --verify",
        "umount -f /mnt/data",
        "fuser -vm /mnt/data"
      ],
      "correct": 3,
      "explanation": "fuser -vm /mnt/data (yoki lsof /mnt/data) mount point'dan foydalanayotgan processlar ro'yxatini ko'rsatadi. umount -f esa processlarni ko'rsatmaydi va data loss xavfi bor."
    },
    {
      "question": "Serverga 2GB hajmli swap fayl qo'shishning to'g'ri ketma-ketligi qaysi?",
      "options": [
        "fallocate -l 2G /swapfile → chmod 600 /swapfile → mkswap /swapfile → swapon /swapfile",
        "fallocate -l 2G /swapfile → mkfs.ext4 /swapfile → swapon /swapfile",
        "mkswap /swapfile → fallocate -l 2G /swapfile → swapon /swapfile",
        "dd if=/dev/zero of=/swapfile → swapon /swapfile"
      ],
      "correct": 0,
      "explanation": "To'g'ri tartib: fayl yaratish (fallocate), xavfsizlik uchun chmod 600, swap sifatida formatlash (mkswap) va yoqish (swapon). mkfs.ext4 emas, aynan mkswap kerak."
    },
    {
      "question": "Software RAID massivining joriy holatini va disk almashtirilgandan keyingi rebuild jarayonini kuzatish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "cat /etc/mdadm.conf",
        "smartctl -H /dev/md0",
        "cat /proc/mdstat",
        "lsblk -f /dev/md0"
      ],
      "correct": 2,
      "explanation": "/proc/mdstat fayli RAID massivlarining jonli holatini ([UU] yoki [U_]) va rebuild progressini ko'rsatadi: watch cat /proc/mdstat. /etc/mdadm.conf esa faqat saqlangan konfiguratsiya."
    },
    {
      "question": "df -h bo'yicha diskda 40% bo'sh joy bor, lekin dastur 'No space left on device' xatosini bermoqda. Muammoning eng ehtimoliy sababi va uni tekshirish buyrug'i qaysi?",
      "options": [
        "Disk fragmentatsiyasi — e4defrag bilan tekshiriladi",
        "Inode'lar tugagan — df -i bilan tekshiriladi",
        "Filesystem read-only bo'lib qolgan — blkid bilan tekshiriladi",
        "Swap to'lgan — free -h bilan tekshiriladi"
      ],
      "correct": 1,
      "explanation": "Joy bo'lsa ham juda ko'p mayda fayllar inode'larni tugatishi mumkin — df -i buyrug'i IUse% 100% ekanini ko'rsatadi. Yechim: keraksiz mayda fayllarni topib o'chirish."
    }
  ],
  "6": [
    {
      "question": "RHEL 8 serverga yuklab olingan lokal mypkg.rpm faylini rpm -ivh mypkg.rpm bilan o'rnatmoqchisiz, lekin 'Failed dependencies' xatosi chiqdi. Dependency'larni avtomatik hal qilib o'rnatishning to'g'ri usuli qaysi?",
      "options": [
        "rpm -ivh --nodeps mypkg.rpm",
        "rpm -Uvh --force mypkg.rpm",
        "dnf install ./mypkg.rpm",
        "rpm --rebuilddb && rpm -ivh mypkg.rpm"
      ],
      "correct": 2,
      "explanation": "rpm past darajali vosita bo'lib, dependency'larni o'zi hal qilmaydi; dnf install ./mypkg.rpm esa lokal faylni kerakli dependency'larni repositorylardan tortgan holda o'rnatadi. --nodeps esa paketni buzilgan holatda qoldiradi."
    },
    {
      "question": "O'rnatilgan nginx paketi tizimga qaysi fayllarni joylashtirganini ko'rish uchun (RHEL) qaysi buyruq ishlatiladi?",
      "options": [
        "rpm -ql nginx",
        "rpm -qi nginx",
        "rpm -qc nginx",
        "rpm -qa nginx"
      ],
      "correct": 0,
      "explanation": "rpm -ql (query + list) o'rnatilgan paketga tegishli barcha fayllar ro'yxatini chiqaradi. rpm -qi umumiy ma'lumotni, rpm -qc esa faqat konfiguratsiya fayllarini ko'rsatadi."
    },
    {
      "question": "Administrator dnf orqali xato paketlar to'plamini o'rnatib qo'ydi. dnf history buyrug'ida bu tranzaksiya ID=15 ekani ko'rindi. Faqat shu tranzaksiyani bekor qilish uchun qaysi buyruq kerak?",
      "options": [
        "dnf history rollback 15",
        "dnf history undo 15",
        "dnf history redo 15",
        "dnf remove --transaction 15"
      ],
      "correct": 1,
      "explanation": "dnf history undo 15 aynan 15-tranzaksiyada bajarilgan amallarni teskarisiga qaytaradi. dnf history rollback 15 esa 15-tranzaksiyadan keyingi BARCHA tranzaksiyalarni bekor qiladi."
    },
    {
      "question": "RHEL serverda semanage buyrug'i topilmayapti va uni ta'minlaydigan paket hali o'rnatilmagan. Bu faylni qaysi paket berishini aniqlash uchun qaysi buyruq ishlaydi?",
      "options": [
        "rpm -qf /usr/sbin/semanage",
        "dnf info semanage",
        "rpm -qR semanage",
        "dnf provides */semanage"
      ],
      "correct": 3,
      "explanation": "dnf provides (yum whatprovides) repository metadata bo'yicha qidiradi, shuning uchun hali o'rnatilmagan paketlarni ham topadi. rpm -qf faqat diskda mavjud, o'rnatilgan fayllar uchun ishlaydi."
    },
    {
      "question": "rpm -V nginx buyrug'i natijasida 'S.5....T.  c /etc/nginx/nginx.conf' qatori chiqdi. Bu nimani anglatadi?",
      "options": [
        "Fayl o'chirib yuborilgan va paketni qayta o'rnatish shart",
        "Konfiguratsiya fayli o'rnatilgandan keyin o'zgartirilgan (hajmi, checksum va vaqti farq qiladi)",
        "Faylning egasi (owner) va guruhi noto'g'ri o'rnatilgan",
        "Paket GPG imzosi tekshiruvdan o'tmagan"
      ],
      "correct": 1,
      "explanation": "rpm -V chiqishida S — size, 5 — MD5 checksum, T — mTime farqini bildiradi, 'c' belgisi esa bu konfiguratsiya fayli ekanini ko'rsatadi. Demak, fayl o'rnatilgandan keyin tahrirlangan — config fayllar uchun bu odatiy holat."
    },
    {
      "question": "Internetga ulanmagan RHEL serverda o'rnatish ISO'si /mnt/cdrom ga mount qilingan. /etc/yum.repos.d/local.repo faylida baseurl qatori qanday yozilishi kerak?",
      "options": [
        "baseurl=/mnt/cdrom/BaseOS",
        "baseurl=http://localhost/mnt/cdrom/BaseOS",
        "baseurl=file:///mnt/cdrom/BaseOS",
        "baseurl=local://mnt/cdrom/BaseOS"
      ],
      "correct": 2,
      "explanation": "Lokal fayl tizimidagi repository uchun file:// protokoli ishlatiladi: baseurl=file:///mnt/cdrom/BaseOS. Oddiy yo'l yoki http://localhost bu holatda ishlamaydi."
    },
    {
      "question": "Ubuntu serverda apache2 paketini konfiguratsiya fayllari bilan birga butunlay o'chirish kerak. Qaysi buyruq buni bajaradi?",
      "options": [
        "apt purge apache2",
        "apt remove apache2",
        "apt autoclean apache2",
        "apt clean apache2"
      ],
      "correct": 0,
      "explanation": "apt purge paketni konfiguratsiya fayllari bilan birga o'chiradi; apt remove esa config fayllarni saqlab qoladi. clean/autoclean faqat yuklab olingan .deb keshini tozalaydi."
    },
    {
      "question": "Ubuntu'da katta paketni o'chirgandan so'ng 'avtomatik o'rnatilgan, lekin endi hech bir paketga kerak bo'lmagan' dependency'lar qolib ketdi. Ularni tozalash uchun qaysi buyruq?",
      "options": [
        "apt clean",
        "apt purge --all",
        "dpkg --configure -a",
        "apt autoremove"
      ],
      "correct": 3,
      "explanation": "apt autoremove avtomatik o'rnatilgan va endi hech bir paketga kerak bo'lmagan dependency'larni o'chiradi. apt clean esa faqat kesh (.deb fayllar)ni tozalaydi, paketlarni emas."
    },
    {
      "question": "Production Ubuntu serverida nginx'ning joriy versiyasi tasdiqlangan — apt upgrade paytida u yangilanib ketmasligi kerak. Qaysi buyruq buni ta'minlaydi?",
      "options": [
        "apt-mark auto nginx",
        "apt-mark hold nginx",
        "apt lock nginx",
        "dnf versionlock add nginx"
      ],
      "correct": 1,
      "explanation": "apt-mark hold paketni 'hold' holatiga o'tkazadi va apt upgrade uni yangilamaydi (tekshirish: apt-mark showhold). dnf versionlock — RHEL vositasi, 'apt lock' buyrug'i esa mavjud emas."
    },
    {
      "question": "dpkg -l | grep '^rc' buyrug'i bir nechta paketni ko'rsatdi. Bu paketlarning holati qanday?",
      "options": [
        "O'rnatilgan va to'g'ri ishlayapti",
        "Yangilanishdan hold qilingan",
        "Paket o'chirilgan, lekin konfiguratsiya fayllari tizimda qolgan",
        "Yuklab olingan, lekin hali o'rnatilmagan"
      ],
      "correct": 2,
      "explanation": "'rc' holati r (removed) va c (config-files) degani: paket dpkg -r yoki apt remove bilan o'chirilgan, ammo config fayllari qolgan. Ularni to'liq tozalash uchun dpkg -P yoki apt purge kerak."
    },
    {
      "question": "Ubuntu'da apt install jarayoni to'satdan uzilib qoldi. Endi har qanday apt buyrug'i 'E: dpkg was interrupted...' xatosini bermoqda. Birinchi navbatda qaysi buyruqni bajarish kerak?",
      "options": [
        "dpkg --configure -a",
        "apt update --fix-missing",
        "rm -rf /var/cache/apt/archives/*",
        "dpkg-reconfigure -a"
      ],
      "correct": 0,
      "explanation": "Uzilgan tranzaksiyadan keyin dpkg --configure -a ochilgan (unpacked), lekin sozlanmay qolgan barcha paketlarni konfiguratsiya qilib, dpkg holatini tiklaydi — xato xabarining o'zi ham aynan shu buyruqni ko'rsatadi."
    },
    {
      "question": "Zamonaviy Ubuntu serverga uchinchi tomon repository qo'shilmoqda. Uning GPG kalitini xavfsiz ulashning tavsiya etilgan usuli qaysi?",
      "options": [
        "apt-key add orqali kalitni global keyring'ga qo'shish",
        "Repo yozuviga gpgcheck=0 parametrini qo'shib, tekshiruvni o'chirish",
        "rpm --import bilan kalitni import qilish",
        "Kalitni gpg --dearmor bilan /usr/share/keyrings/ ga saqlab, repo yozuvida signed-by= bilan ko'rsatish"
      ],
      "correct": 3,
      "explanation": "Tavsiya etilgan usul — kalitni gpg --dearmor bilan /usr/share/keyrings/ ga joylab, sources.list yozuvida 'deb [signed-by=/usr/share/keyrings/key.gpg] ...' ko'rinishida faqat shu repoga bog'lash. apt-key eskirgan (deprecated), gpgcheck esa yum/dnf sintaksisi."
    }
  ],
  "7": [
    {
      "question": "Server'da nginx xizmati bilan muammo bor. Uning loglarini real vaqtda (yangi yozuvlar paydo bo'lishi bilan) kuzatib turish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "journalctl -u nginx -r",
        "journalctl -u nginx -n 50",
        "journalctl -u nginx -f",
        "journalctl -u nginx -o cat"
      ],
      "correct": 2,
      "explanation": "-f (follow) flagi yangi log yozuvlarini real vaqtda ko'rsatib turadi: journalctl -u nginx -f. -r teskari tartibda, -n esa faqat oxirgi N qatorni ko'rsatadi."
    },
    {
      "question": "RHEL/CentOS serverida SSH orqali muvaffaqiyatsiz login urinishlarini qaysi an'anaviy log faylidan topish mumkin?",
      "options": [
        "/var/log/secure",
        "/var/log/messages",
        "/var/log/maillog",
        "/var/log/cron"
      ],
      "correct": 0,
      "explanation": "RHEL/CentOS da autentifikatsiya (auth) loglari /var/log/secure faylida saqlanadi — 'Failed password' yozuvlari shu yerda bo'ladi. Debian/Ubuntu da esa /var/log/auth.log ishlatiladi."
    },
    {
      "question": "Server'dagi RAM va swap holatini odam o'qishi oson formatda (GB/MB) ko'rish uchun qaysi buyruq to'g'ri?",
      "options": [
        "df -h",
        "free -h",
        "du -sh /var/*",
        "lscpu"
      ],
      "correct": 1,
      "explanation": "free -h xotira (RAM va swap) holatini human-readable formatda ko'rsatadi. df -h disk bo'limlarini, du -sh katalog hajmini, lscpu esa CPU ma'lumotlarini chiqaradi."
    },
    {
      "question": "Server kechasi kutilmaganda reboot bo'ldi. Oldingi yuklanish (previous boot) davridagi loglarni ko'rish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "journalctl -b 0",
        "journalctl --list-boots",
        "journalctl -r",
        "journalctl -b -1"
      ],
      "correct": 3,
      "explanation": "journalctl -b -1 oldingi boot davridagi loglarni ko'rsatadi. -b 0 joriy boot, --list-boots esa faqat bootlar ro'yxatini chiqaradi."
    },
    {
      "question": "Joriy boot davomida faqat error va undan jiddiyroq darajadagi (err, crit, alert, emerg) xabarlarni ko'rish kerak. Qaysi buyruq to'g'ri?",
      "options": [
        "journalctl -p 4 -b",
        "journalctl -p err -b",
        "journalctl -p debug -b",
        "journalctl -k -b"
      ],
      "correct": 1,
      "explanation": "journalctl -p err (yoki -p 3) faqat 0-3 darajadagi (emerg, alert, crit, err) xabarlarni filtrlaydi, -b esa joriy boot bilan cheklaydi. -p 4 warning'larni ham qo'shib yuboradi."
    },
    {
      "question": "Disk to'lib bormoqda va journalctl --disk-usage 4GB ko'rsatmoqda. Faqat oxirgi 7 kunlik journal loglarini qoldirib, undan eskilarini o'chirish uchun qaysi buyruq?",
      "options": [
        "journalctl --vacuum-time=7d",
        "journalctl --vacuum-size=7G",
        "journalctl --verify",
        "rm -rf /var/log/journal/*"
      ],
      "correct": 0,
      "explanation": "journalctl --vacuum-time=7d 7 kundan eski journal fayllarini xavfsiz tarzda o'chiradi. --vacuum-size hajm bo'yicha tozalaydi, rm -rf esa journald ishlayotganda xavfli va noto'g'ri usul."
    },
    {
      "question": "Barcha loglarni markaziy log serveriga (logserver.example.com, port 514) TCP protokoli orqali yuborish uchun rsyslog konfiguratsiyasiga qaysi qator yoziladi?",
      "options": [
        "*.* @logserver.example.com:514",
        "*.* #logserver.example.com:514",
        "*.* @@logserver.example.com:514",
        "*.* tcp://logserver.example.com:514"
      ],
      "correct": 2,
      "explanation": "rsyslog'da @@ belgisi TCP orqali, bitta @ esa UDP orqali yuborishni bildiradi. Shuning uchun TCP uchun *.* @@logserver.example.com:514 yoziladi."
    },
    {
      "question": "Siz /etc/logrotate.d/myapp konfiguratsiyasini yozdingiz va uni loglarni haqiqatda aylantirmasdan (dry run) tekshirmoqchisiz. Qaysi buyruq to'g'ri?",
      "options": [
        "logrotate -f /etc/logrotate.d/myapp",
        "logrotate -v /etc/logrotate.d/myapp",
        "systemctl restart logrotate",
        "logrotate -d /etc/logrotate.d/myapp"
      ],
      "correct": 3,
      "explanation": "logrotate -d (debug) rejimi konfiguratsiyani tekshirib, nima qilinishini ko'rsatadi, lekin fayllarga tegmaydi. -f esa aksincha, rotatsiyani majburan bajaradi."
    },
    {
      "question": "Server sekinlashdi. Qaysi processlar eng ko'p xotira (RAM) ishlatayotganini bir martalik snapshot ko'rinishida aniqlash uchun qaysi buyruq to'g'ri?",
      "options": [
        "ps aux --sort=-%mem | head -10",
        "ps aux --sort=%mem | head -10",
        "free -h",
        "vmstat 1 5"
      ],
      "correct": 0,
      "explanation": "--sort=-%mem dagi minus belgisi kamayish tartibida saralaydi, ya'ni eng ko'p RAM ishlatayotgan processlar tepada chiqadi. Minussiz variant o'sish tartibida saralaydi, free va vmstat esa process kesimida ma'lumot bermaydi."
    },
    {
      "question": "Har reboot'dan keyin journalctl -b -1 oldingi boot loglarini topa olmayapti — journal loglari yo'qolib ketmoqda. Muammoni doimiy hal qilish uchun nima qilish kerak?",
      "options": [
        "journalctl --vacuum-time=30d buyrug'ini bajarish",
        "mkdir -p /var/log/journal yaratib, systemctl restart systemd-journald qilish",
        "/etc/rsyslog.conf faylida Storage=persistent qatorini qo'shish",
        "journalctl --verify bilan loglarni tiklash"
      ],
      "correct": 1,
      "explanation": "/var/log/journal katalogi mavjud bo'lsa, journald loglarni diskda doimiy (persistent) saqlaydi va ular reboot'dan keyin ham qoladi. Buni /etc/systemd/journald.conf da Storage=persistent bilan ham sozlash mumkin — rsyslog.conf da emas."
    },
    {
      "question": "logrotate log faylini aylantirgandan keyin ilova yangi faylga emas, eski (rotate qilingan) faylga yozishda davom etmoqda. Ilovani restart/reload qilib bo'lmaydi. Konfiguratsiyaga qaysi direktiva qo'shilishi kerak?",
      "options": [
        "delaycompress",
        "sharedscripts",
        "copytruncate",
        "notifempty"
      ],
      "correct": 2,
      "explanation": "copytruncate log faylidan nusxa olib, asl faylni bo'shatadi (truncate) — ilova ochiq file descriptor orqali o'sha faylga yozishda davom etadi va reload talab qilinmaydi."
    },
    {
      "question": "Kechasi katta Java processi kutilmaganda yo'qolib qoldi. Kernel uni xotira yetishmasligi tufayli (OOM killer) o'ldirgan deb gumon qilyapsiz. Buni qanday tekshirasiz?",
      "options": [
        "dmesg | grep -i \"out of memory\"",
        "free -h",
        "ps aux | grep java",
        "cat /var/log/lastlog"
      ],
      "correct": 0,
      "explanation": "OOM killer hodisalari kernel ring buffer'ga yoziladi — dmesg | grep -i \"out of memory\" (yoki journalctl -k) orqali topiladi. free -h faqat hozirgi holatni ko'rsatadi, o'tgan hodisani emas."
    }
  ],
  "8": [
    {
      "question": "SELinux'ni vaqtincha (reboot'gacha) permissive rejimga o'tkazish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "setenforce 0",
        "setenforce 1",
        "getenforce permissive",
        "setsebool -P permissive on"
      ],
      "correct": 0,
      "explanation": "setenforce 0 SELinux'ni vaqtincha permissive rejimga o'tkazadi — faqat log yozadi, bloklamaydi. setenforce 1 esa enforcing rejimga qaytaradi."
    },
    {
      "question": "SELinux rejimi reboot'dan keyin ham enforcing bo'lib qolishi uchun SELINUX=enforcing qatorini qaysi faylda sozlash kerak?",
      "options": [
        "/etc/security/selinux.conf",
        "/etc/default/selinux",
        "/etc/selinux/config",
        "/boot/grub2/selinux.cfg"
      ],
      "correct": 2,
      "explanation": "SELinux'ning doimiy rejimi /etc/selinux/config faylida belgilanadi. setenforce buyrug'i esa faqat vaqtinchalik o'zgarish kiritadi."
    },
    {
      "question": "/var/www/html katalogidagi fayllarning SELinux kontekstini ko'rish uchun qaysi buyruq to'g'ri?",
      "options": [
        "stat --selinux /var/www/html",
        "getfacl /var/www/html",
        "ls -la --security /var/www/html",
        "ls -Z /var/www/html"
      ],
      "correct": 3,
      "explanation": "ls -Z fayllarning SELinux kontekstini (user:role:type:level formatida) ko'rsatadi. Jarayonlar uchun esa ps auxZ ishlatiladi."
    },
    {
      "question": "Administrator setsebool httpd_can_network_connect on buyrug'ini bajardi, lekin reboot'dan keyin boolean yana off bo'lib qoldi. Muammoni qanday hal qilish kerak?",
      "options": [
        "getsebool -a bilan boolean'ni qayta yoqish",
        "setsebool -P httpd_can_network_connect on — -P flag o'zgarishni doimiy qiladi",
        "chcon -t httpd_can_network_connect on buyrug'ini ishlatish",
        "restorecon -Rv bilan boolean'ni tiklash"
      ],
      "correct": 1,
      "explanation": "-P (persistent) flag'siz setsebool o'zgarishi faqat reboot'gacha amal qiladi. setsebool -P boolean qiymatini doimiy saqlaydi."
    },
    {
      "question": "Enforcing rejimdagi serverda xizmat kutilmaganda ishlamay qoldi va SELinux bloklayotganiga shubha bor. So'nggi AVC denial'larni ko'rish uchun qaysi buyruq eng mos?",
      "options": [
        "ausearch -m avc -ts recent",
        "journalctl -u selinux --since today",
        "getsebool -a | grep denied",
        "semanage login -l"
      ],
      "correct": 0,
      "explanation": "ausearch -m avc -ts recent audit log'dan so'nggi AVC (Access Vector Cache) denial yozuvlarini chiqaradi. Shuningdek grep denied /var/log/audit/audit.log ham ishlatish mumkin."
    },
    {
      "question": "Zamonaviy va xavfsiz algoritm bilan yangi SSH kalit juftligini yaratish uchun qaysi buyruq tavsiya etiladi?",
      "options": [
        "ssh-keygen -t dsa",
        "ssh-keygen -t rsa -b 512",
        "ssh-copy-id -t ed25519",
        "ssh-keygen -t ed25519"
      ],
      "correct": 3,
      "explanation": "ed25519 — zamonaviy, tez va xavfsiz algoritm: ssh-keygen -t ed25519. dsa va 512-bit rsa eskirgan va xavfsiz emas, ssh-copy-id esa kalit yaratmaydi."
    },
    {
      "question": "Yaratilgan public key'ni masofadagi serverdagi foydalanuvchining authorized_keys fayliga avtomatik joylashtirish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "scp ~/.ssh/id_ed25519 user@server:~/.ssh/",
        "ssh-add user@server",
        "ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server",
        "ssh-keygen --upload user@server"
      ],
      "correct": 2,
      "explanation": "ssh-copy-id public key'ni serverdagi ~/.ssh/authorized_keys fayliga to'g'ri permission'lar bilan qo'shadi. Private key'ni (id_ed25519) serverga nusxalash xavfli xato hisoblanadi."
    },
    {
      "question": "Masofadagi serverda /etc/ssh/sshd_config faylini tahrirladingiz. Xato tufayli serverdan uzilib qolmaslik uchun sshd'ni restart qilishdan OLDIN qaysi buyruq bilan konfiguratsiyani tekshirish kerak?",
      "options": [
        "systemctl verify sshd",
        "sshd -t",
        "ssh -T localhost",
        "sshd --check-config"
      ],
      "correct": 1,
      "explanation": "sshd -t konfiguratsiya sintaksisini test qiladi va xato bo'lsa xabar beradi. Xatoli config bilan restart qilinsa, masofadagi serverga SSH kirish imkoni yo'qolishi mumkin."
    },
    {
      "question": "Serverga SSH orqali faqat admin va deploy foydalanuvchilari kira olishi kerak. sshd_config faylida qaysi qator to'g'ri?",
      "options": [
        "PermitUsers admin,deploy",
        "DenyUsers admin deploy",
        "AllowGroups admin deploy",
        "AllowUsers admin deploy"
      ],
      "correct": 3,
      "explanation": "AllowUsers direktivasi sanab o'tilgan foydalanuvchilarga (bo'sh joy bilan ajratiladi) SSH ruxsat beradi, qolganlarni to'sadi. AllowGroups esa foydalanuvchilar emas, guruhlar uchun ishlatiladi."
    },
    {
      "question": "Server'da 8080/tcp portni firewalld orqali doimiy ochish va o'zgarishni darhol qo'llash uchun to'g'ri ketma-ketlik qaysi?",
      "options": [
        "firewall-cmd --add-port=8080/tcp --permanent, so'ng firewall-cmd --reload",
        "firewall-cmd --add-port=8080 --now",
        "firewall-cmd --open-port=8080/tcp --save",
        "systemctl reload firewalld --port=8080"
      ],
      "correct": 0,
      "explanation": "--permanent flag o'zgarishni doimiy config'ga yozadi, lekin darhol qo'llamaydi — shuning uchun firewall-cmd --reload bilan runtime'ga yuklash kerak."
    },
    {
      "question": "Faqat 192.168.1.0/24 ichki tarmog'idan kelgan trafikka ruxsat beruvchi doimiy rich rule qo'shish uchun qaysi buyruq to'g'ri?",
      "options": [
        "firewall-cmd --add-source=192.168.1.0/24 --accept --permanent",
        "iptables --add-rich-rule='accept 192.168.1.0/24'",
        "firewall-cmd --add-rich-rule='rule family=ipv4 source address=192.168.1.0/24 accept' --permanent",
        "firewall-cmd --allow-network=192.168.1.0/24 --permanent"
      ],
      "correct": 2,
      "explanation": "Rich rule sintaksisi: rule family=ipv4 source address=<subnet> accept. Bu firewall-cmd --add-rich-rule orqali qo'shiladi va --permanent bilan doimiy saqlanadi."
    },
    {
      "question": "iptables'da INPUT chain uchun default policy'ni DROP qilib, faqat aniq ruxsat berilgan trafik o'tishini ta'minlash uchun qaysi buyruq ishlatiladi?",
      "options": [
        "iptables -A INPUT DROP",
        "iptables -P INPUT DROP",
        "iptables -D INPUT ACCEPT",
        "iptables -F INPUT --drop"
      ],
      "correct": 1,
      "explanation": "-P (policy) flag chain'ning default policy'sini belgilaydi: iptables -P INPUT DROP. -A yangi rule qo'shadi, -D rule o'chiradi, -F esa chain'ni tozalaydi."
    }
  ],
  "9": [
    {
      "question": "Bash skript birinchi qatoridagi #!/bin/bash nima vazifani bajaradi?",
      "options": [
        "Skriptni qaysi interpreter bilan ishga tushirishni belgilaydi",
        "Skriptga bajarish huquqini beradi",
        "Kommentariya — hech qanday ta'siri yo'q",
        "Skriptni root sifatida ishga tushiradi"
      ],
      "correct": 0,
      "explanation": "Shebang (#!) qatori kernel'ga skriptni qaysi interpreter (/bin/bash) bilan bajarishni aytadi. Bajarish huquqi esa chmod +x bilan alohida beriladi."
    },
    {
      "question": "Skriptda oxirgi bajarilgan buyruqning exit kodini qaysi o'zgaruvchi saqlaydi?",
      "options": [
        "$#",
        "$?",
        "$$",
        "$0"
      ],
      "correct": 1,
      "explanation": "$? — oxirgi buyruqning exit status'i (0 = muvaffaqiyat). $# — argumentlar soni, $$ — joriy shell PID, $0 — skript nomi."
    },
    {
      "question": "\"$@\" va \"$*\" o'rtasidagi farq nima?",
      "options": [
        "Farqi yo'q — ikkalasi ham bir xil ishlaydi",
        "\"$*\" har bir argumentni alohida so'z sifatida beradi",
        "\"$@\" har bir argumentni alohida quoted so'z sifatida, \"$*\" hammasini bitta satr sifatida beradi",
        "\"$@\" faqat birinchi argumentni beradi"
      ],
      "correct": 2,
      "explanation": "\"$@\" argumentlarni alohida-alohida saqlaydi (bo'shliqli argumentlar buzilmaydi), \"$*\" esa barchasini IFS bilan qo'shib bitta so'zga aylantiradi. Loop'larda deyarli har doim \"$@\" ishlatiladi."
    },
    {
      "question": "if [ -f /etc/nginx/nginx.conf ]; then ... — bu shart nimani tekshiradi?",
      "options": [
        "Fayl bo'sh emasligini",
        "Fayl bajarilishi mumkinligini",
        "Fayl yozish uchun ochiqligini",
        "Oddiy fayl sifatida mavjudligini"
      ],
      "correct": 3,
      "explanation": "-f — regular fayl mavjudligini tekshiradi. -s bo'sh emaslikni, -x bajarish huquqini, -w yozish huquqini, -d directory ekanligini tekshiradi."
    },
    {
      "question": "Production skript boshida set -euo pipefail yozishning maqsadi nima?",
      "options": [
        "Xato bo'lsa to'xtash, aniqlanmagan o'zgaruvchini xato deb hisoblash va pipe'dagi xatoni ushlash",
        "Skriptni verbose rejimda ishga tushirish",
        "Skriptni fon rejimida (background) ishga tushirish",
        "Barcha buyruqlarni sudo bilan bajarish"
      ],
      "correct": 0,
      "explanation": "set -e — xatoda darhol chiqish, -u — aniqlanmagan o'zgaruvchi ishlatilsa xato, -o pipefail — pipe ichidagi istalgan buyruq xato bersa butun pipe xato hisoblanadi. Xavfsiz skript yozishning standart boshlanishi."
    },
    {
      "question": "/var/log ichidagi barcha .log fayllar ustida sikl aylantirish uchun to'g'ri sintaksis qaysi?",
      "options": [
        "for f in ls /var/log/*.log; do echo $f; done",
        "for f in /var/log/*.log; do echo \"$f\"; done",
        "while f in /var/log/*.log; do echo \"$f\"; done",
        "loop f /var/log/*.log; echo \"$f\"; endloop"
      ],
      "correct": 1,
      "explanation": "for o'zgaruvchi in glob; do ...; done — to'g'ri shakl. ls buyrug'ini for bilan parse qilish xato amaliyot (so'z bo'linishi muammolari)."
    },
    {
      "question": "result=$(hostname) yozuvi nima qiladi?",
      "options": [
        "hostname degan matnni result'ga yozadi",
        "result faylini hostname'ga nusxalaydi",
        "hostname buyrug'ining chiqishini result o'zgaruvchisiga saqlaydi",
        "hostname o'zgaruvchisini result'ga havola qiladi"
      ],
      "correct": 2,
      "explanation": "$(...) — command substitution: buyruq bajariladi va uning stdout chiqishi o'zgaruvchiga yoziladi. Eski usul — backtick (`hostname`), lekin $() ichma-ich ishlatish uchun qulayroq."
    },
    {
      "question": "Bash funksiya ichida unga uzatilgan birinchi argumentga qanday murojaat qilinadi?",
      "options": [
        "$ARG1",
        "${FUNCNAME[1]}",
        "$0",
        "$1"
      ],
      "correct": 3,
      "explanation": "Funksiya ichida $1, $2, ... — funksiyaning o'z argumentlari (skript argumentlari emas). $0 esa hamon skript nomini ko'rsatadi."
    },
    {
      "question": "Faylni qatorma-qator xavfsiz o'qish uchun qaysi konstruksiya to'g'ri?",
      "options": [
        "while IFS= read -r line; do ...; done < file.txt",
        "for line in $(cat file.txt); do ...; done",
        "read file.txt | while line; do ...; done",
        "cat file.txt > while read line"
      ],
      "correct": 0,
      "explanation": "while IFS= read -r line — standart usul: IFS= bo'shliqlarni saqlaydi, -r backslash'larni escape qilmaydi. for + cat bo'shliqda so'zlarga bo'lib yuboradi."
    },
    {
      "question": "case \"$1\" in start) ...;; stop) ...;; *) ...;; esac — bu yerda *) nimani anglatadi?",
      "options": [
        "Barcha variantlarni bir vaqtda bajarish",
        "Hech bir pattern mos kelmaganda ishlaydigan default holat",
        "Sintaksis xatosi — case ichida * ishlatib bo'lmaydi",
        "Faqat bo'sh argument uchun ishlaydi"
      ],
      "correct": 1,
      "explanation": "* — istalgan qiymatga mos keladigan glob pattern, shuning uchun oxirida default (else kabi) sifatida ishlatiladi. Har bir shox ;; bilan tugaydi."
    },
    {
      "question": "echo ${BACKUP_DIR:-/var/backup} ifodasi nima qiladi?",
      "options": [
        "BACKUP_DIR'ga /var/backup qiymatini o'zlashtiradi",
        "BACKUP_DIR'dan /var/backup satrini o'chiradi",
        "BACKUP_DIR bo'sh yoki aniqlanmagan bo'lsa /var/backup'ni chiqaradi, lekin o'zgaruvchini o'zgartirmaydi",
        "Har doim /var/backup'ni chiqaradi"
      ],
      "correct": 2,
      "explanation": "${VAR:-default} — VAR bo'sh/aniqlanmagan bo'lsa default qiymat ishlatiladi, lekin VAR o'zgarmaydi. ${VAR:=default} esa qiymatni o'zlashtirib ham qo'yadi."
    },
    {
      "question": "Skript qanday tugashidan qat'i nazar (xato yoki muvaffaqiyat) vaqtinchalik faylni o'chirish uchun nima ishlatiladi?",
      "options": [
        "atexit rm -f \"$TMPFILE\"",
        "finally { rm -f \"$TMPFILE\" }",
        "on_exit rm -f \"$TMPFILE\"",
        "trap 'rm -f \"$TMPFILE\"' EXIT"
      ],
      "correct": 3,
      "explanation": "trap 'buyruq' EXIT — skript chiqishida (normal yoki xato) buyruqni bajaradi. Cleanup uchun standart bash mexanizmi; atexit/finally bash'da mavjud emas."
    }
  ],
  "10": [
    {
      "question": "rsync -a flag'i nimani anglatadi?",
      "options": [
        "Archive rejimi: rekursiv + permissions, ownership, timestamps, symlink'larni saqlaydi",
        "All — barcha yashirin fayllarni ham qo'shadi",
        "Append — faqat fayl oxiriga qo'shadi",
        "Auto — manzilni avtomatik aniqlaydi"
      ],
      "correct": 0,
      "explanation": "-a (archive) = -rlptgoD: rekursiv, symlink, permissions, times, group, owner, devices. Backup uchun eng ko'p ishlatiladigan flag."
    },
    {
      "question": "To'liq (full), incremental va differential backup farqi qaysi javobda to'g'ri?",
      "options": [
        "Incremental har doim to'liq nusxa oladi",
        "Incremental oxirgi istalgan backup'dan keyingi, differential oxirgi FULL backup'dan keyingi o'zgarishlarni oladi",
        "Differential eng kam joy egallaydi",
        "Full backup faqat o'zgargan fayllarni oladi"
      ],
      "correct": 1,
      "explanation": "Incremental — oxirgi backup'dan (full yoki incremental) keyingi o'zgarishlar; differential — oxirgi full'dan keyingi barcha o'zgarishlar. Restore: full + oxirgi differential YOKI full + barcha incremental'lar."
    },
    {
      "question": "tar bilan incremental backup qilish uchun qaysi option ishlatiladi?",
      "options": [
        "--incremental-mode=on",
        "--diff-backup",
        "--listed-incremental=snapshot.snar",
        "-i snapshot.file"
      ],
      "correct": 2,
      "explanation": "tar --listed-incremental=snapshot.snar -czf backup.tar.gz /data — snapshot faylda metadata saqlanadi va keyingi запускlarda faqat o'zgargan fayllar arxivlanadi."
    },
    {
      "question": "Butun diskning (masalan /dev/sda) bit-darajadagi nusxasini olish uchun qaysi buyruq ishlatiladi?",
      "options": [
        "cp /dev/sda /backup/disk.img",
        "tar -czf disk.img /dev/sda",
        "rsync -a /dev/sda disk.img",
        "dd if=/dev/sda of=/backup/disk.img bs=4M status=progress"
      ],
      "correct": 3,
      "explanation": "dd — blok darajasida (filesystem'dan qat'i nazar) nusxa oladi: bootloader, partition table, hammasi. bs=4M tezlikni oshiradi, status=progress jarayonni ko'rsatadi."
    },
    {
      "question": "rsync -a --delete /src/ /dest/ buyrug'idagi --delete nima qiladi va nimasi xavfli?",
      "options": [
        "Manbadagi (src) fayllarni ko'chirib bo'lgach o'chiradi",
        "Destination'da manbada yo'q fayllarni o'chiradi — noto'g'ri yo'l ko'rsatilsa ma'lumot yo'qoladi",
        "Faqat bo'sh directorylarni o'chiradi",
        "Hech narsa o'chirmaydi, faqat ro'yxat ko'rsatadi"
      ],
      "correct": 1,
      "explanation": "--delete destination'ni manba bilan aynan bir xil qiladi: manbada yo'q fayllar destination'dan o'chadi. Avval -n (dry-run) bilan tekshirish tavsiya etiladi."
    },
    {
      "question": "backup.tar.gz arxivini /opt/restore directorysiga ochish uchun to'g'ri buyruq qaysi?",
      "options": [
        "tar -xzf backup.tar.gz -C /opt/restore",
        "tar -czf backup.tar.gz -C /opt/restore",
        "tar -xzf backup.tar.gz > /opt/restore",
        "untar backup.tar.gz /opt/restore"
      ],
      "correct": 0,
      "explanation": "-x (extract), -z (gzip), -f (fayl), -C (chiqarishdan avval shu directoryga o'tish). -c esa yangi arxiv YARATADI — adashtirmang."
    },
    {
      "question": "Masofadagi serverga SSH orqali backup yuborish uchun qaysi rsync sintaksisi to'g'ri?",
      "options": [
        "rsync -a /data ftp://backup-server/backups/",
        "rsync -avz /data/ user@backup-server:/backups/data/",
        "rsync --ssh /data backup-server /backups",
        "scp -r rsync /data backup-server:/backups"
      ],
      "correct": 1,
      "explanation": "user@host:path sintaksisi rsync'ni avtomatik SSH orqali ishlatadi. -z tarmoqda siqishni yoqadi. rsync faqat o'zgargan bloklarni yuborgani uchun scp'dan samaraliroq."
    },
    {
      "question": "3-2-1 backup qoidasi nimani anglatadi?",
      "options": [
        "3 kunda bir, 2 soatda bir, 1 daqiqada bir backup",
        "3 ta server, 2 ta disk, 1 ta admin",
        "3 nusxa ma'lumot, 2 xil turdagi media, 1 nusxa boshqa joyda (offsite)",
        "3 ta full, 2 ta incremental, 1 ta differential"
      ],
      "correct": 2,
      "explanation": "Klassik qoida: jami 3 nusxa (1 asl + 2 backup), kamida 2 turli xil saqlash vositasida, kamida 1 nusxa jismonan boshqa joyda (masalan cloud) saqlanishi kerak."
    },
    {
      "question": "Katta arxivdan faqat bitta faylni tiklash uchun qanday buyruq ishlatiladi?",
      "options": [
        "tar -tzf backup.tar.gz etc/nginx/nginx.conf",
        "gzip -d backup.tar.gz etc/nginx/nginx.conf",
        "tar --restore-one backup.tar.gz nginx.conf",
        "tar -xzf backup.tar.gz etc/nginx/nginx.conf"
      ],
      "correct": 3,
      "explanation": "-x'dan keyin arxiv ichidagi yo'lni ko'rsatsangiz faqat o'sha fayl chiqariladi (yo'l arxivda saqlanganidek yozilishi kerak — tar -tzf bilan ko'ring). -t faqat ro'yxatni ko'rsatadi."
    },
    {
      "question": "rsync'da haqiqiy o'zgarishlarsiz nima bo'lishini oldindan ko'rish uchun qaysi flag ishlatiladi?",
      "options": [
        "-n (--dry-run)",
        "-p (--preview)",
        "-t (--test)",
        "-s (--simulate)"
      ],
      "correct": 0,
      "explanation": "rsync -avn ... — dry-run: nima ko'chirilishi/o'chirilishini ko'rsatadi, lekin hech narsa qilmaydi. Ayniqsa --delete bilan ishlashdan oldin majburiy odat."
    },
    {
      "question": "dd bilan ishlashda eng katta xavf nima?",
      "options": [
        "Juda sekin ishlashi",
        "if= va of= adashtirilsa maqsad diskdagi ma'lumot qaytarib bo'lmas darajada o'chadi",
        "Faqat root ishlatishi mumkinligi",
        "Siqishni qo'llab-quvvatlamasligi"
      ],
      "correct": 1,
      "explanation": "dd hech qanday tasdiq so'ramaydi: of= ko'rsatilgan qurilma darhol ustidan yoziladi. Shuning uchun uni hazillashib \"disk destroyer\" deb ham atashadi — har doim if/of ni ikki marta tekshiring."
    },
    {
      "question": "tar arxiv yaratishda node_modules va .cache papkalarini chiqarib tashlash uchun qaysi buyruq to'g'ri?",
      "options": [
        "tar -czf app.tar.gz --skip node_modules --skip .cache /app",
        "tar -czf app.tar.gz /app | grep -v node_modules",
        "tar -czf app.tar.gz --exclude='node_modules' --exclude='.cache' /app",
        "tar -czf app.tar.gz /app --without node_modules,.cache"
      ],
      "correct": 2,
      "explanation": "--exclude=PATTERN mos kelgan fayl/papkalarni arxivga qo'shmaydi. Bir nechta pattern uchun flag takrorlanadi. --exclude'ni arxivlanadigan yo'ldan OLDIN yozish ishonchliroq."
    }
  ],
  "11": [
    {
      "question": "docker run -d nginx buyrug'idagi -d flag'i nimani anglatadi?",
      "options": [
        "Debug rejimida ishga tushirish",
        "Downloaded — faqat lokal image ishlatish",
        "Delete — to'xtagach o'chirish",
        "Detached — konteynerni fon rejimida ishga tushirish"
      ],
      "correct": 3,
      "explanation": "-d (detached) konteynerni fonda ishga tushiradi va terminal bo'shatiladi. Fonsiz rejimda konteyner logi terminalga oqadi va Ctrl+C to'xtatadi."
    },
    {
      "question": "Image va container o'rtasidagi farq nima?",
      "options": [
        "Image — o'zgarmas shablon (read-only), container — undan yaratilgan ishlaydigan nusxa",
        "Farqi yo'q, ikkalasi bir narsa",
        "Container — shablon, image — ishlaydigan nusxa",
        "Image faqat Docker Hub'da, container faqat lokalda bo'ladi"
      ],
      "correct": 0,
      "explanation": "Image — qatlamlardan iborat read-only shablon; container — image ustiga yoziladigan qatlam qo'shilgan jonli instansiya. Bitta image'dan ko'p container yaratish mumkin."
    },
    {
      "question": "To'xtatilgan (stopped) konteynerlarni ham ko'rish uchun qaysi buyruq kerak?",
      "options": [
        "docker ps",
        "docker ps -a",
        "docker list --stopped",
        "docker images"
      ],
      "correct": 1,
      "explanation": "docker ps faqat ishlayotganlarni ko'rsatadi; -a (all) barcha holatdagi (exited, created) konteynerlarni ham chiqaradi. docker images esa image'lar ro'yxati."
    },
    {
      "question": "Ishlayotgan webapp konteyneri ichida interaktiv shell ochish uchun qaysi buyruq to'g'ri?",
      "options": [
        "docker attach webapp --shell",
        "docker run -it webapp bash",
        "docker exec -it webapp bash",
        "docker shell webapp"
      ],
      "correct": 2,
      "explanation": "docker exec -it <container> bash — mavjud konteynerda yangi process (shell) ochadi. docker run esa YANGI konteyner yaratadi — bu tez-tez adashtiriladigan farq."
    },
    {
      "question": "docker run -p 8080:80 nginx — bu yerda 8080 va 80 qaysi tomonga tegishli?",
      "options": [
        "8080 — konteyner porti, 80 — host porti",
        "Ikkalasi ham konteyner portlari",
        "8080 — tashqi DNS port, 80 — ichki DNS port",
        "8080 — host porti, 80 — konteyner porti"
      ],
      "correct": 3,
      "explanation": "Format: -p HOST:CONTAINER. Ya'ni host'ning 8080-porti konteynerning 80-portiga yo'naltiriladi — brauzerda http://server:8080 ochiladi."
    },
    {
      "question": "Konteyner o'chirilganda ham ma'lumot saqlanib qolishi uchun nima ishlatiladi?",
      "options": [
        "Volume yoki bind mount (-v /host/data:/container/data)",
        "docker save buyrug'i",
        "Konteynerni hech qachon o'chirmaslik",
        "docker commit har soatda"
      ],
      "correct": 0,
      "explanation": "Konteyner ichidagi fayl tizimi vaqtinchalik — konteyner o'chsa yo'qoladi. Doimiy data uchun volume (docker volume) yoki bind mount (-v) ishlatiladi: data host'da saqlanadi."
    },
    {
      "question": "Dockerfile'da CMD va ENTRYPOINT farqi nima?",
      "options": [
        "CMD build vaqtida, ENTRYPOINT run vaqtida bajariladi",
        "ENTRYPOINT — asosiy bajariladigan buyruq, CMD — unga default argumentlar; docker run argumentlari CMD'ni almashtiradi",
        "Farqi yo'q — ikkalasi ham bir xil",
        "CMD faqat bitta, ENTRYPOINT ko'p bo'lishi mumkin"
      ],
      "correct": 1,
      "explanation": "Ikkalasi birga ishlatilganda ENTRYPOINT o'zgarmas bajaruvchi, CMD esa almashtirilishi mumkin bo'lgan default argumentlar bo'ladi. docker run image arg1 — arg1 CMD o'rnini bosadi."
    },
    {
      "question": "Dockerfile'da COPY va ADD orasidagi farq va tavsiya qaysi javobda to'g'ri?",
      "options": [
        "ADD tezroq ishlaydi, shuning uchun har doim ADD ishlatiladi",
        "COPY URL'dan yuklay oladi, ADD esa yo'q",
        "ADD qo'shimcha URL yuklash va tar avto-ochish qila oladi; oddiy nusxalash uchun COPY tavsiya etiladi",
        "COPY faqat directorylar uchun, ADD faqat fayllar uchun"
      ],
      "correct": 2,
      "explanation": "ADD'ning \"sehrli\" xususiyatlari (URL fetch, tar extract) kutilmagan xatti-harakatga olib kelishi mumkin. Best practice: oddiy fayl nusxalash uchun doim COPY."
    },
    {
      "question": "Konteyner nega docker run'dan keyin darhol to'xtab qoladi (Exited 0)?",
      "options": [
        "Xotira yetishmagani uchun",
        "Image buzilgani uchun",
        "Port band bo'lgani uchun",
        "PID 1 bo'lgan asosiy process tugagani uchun — konteyner asosiy process yashar ekan yashaydi"
      ],
      "correct": 3,
      "explanation": "Konteyner hayoti PID 1 processga bog'langan: u tugasa (masalan, service fonga o'tib asosiy process chiqsa) konteyner to'xtaydi. Shuning uchun konteynerda processlar foreground rejimda ishga tushiriladi."
    },
    {
      "question": "docker compose (yoki docker-compose) qanday muammoni hal qiladi?",
      "options": [
        "Ko'p konteynerli ilovani (app + db + cache) bitta YAML faylda tavsiflab, bitta buyruq bilan boshqarish",
        "Image'larni siqish va hajmini kamaytirish",
        "Konteynerlarni turli serverlarga taqsimlash (orchestration cluster)",
        "Docker'ni root'siz ishlatish"
      ],
      "correct": 0,
      "explanation": "compose.yaml'da servislar, tarmoqlar, volumelar tavsiflanadi va docker compose up -d hammasini birga ko'taradi. Ko'p-serverli orchestration esa Kubernetes/Swarm vazifasi."
    },
    {
      "question": "Podman'ning Docker'dan asosiy arxitektura farqi nima?",
      "options": [
        "Podman faqat Windows'da ishlaydi",
        "Podman daemon'siz va rootless ishlay oladi — har bir konteyner oddiy user process sifatida ishlaydi",
        "Podman image'larni qo'llab-quvvatlamaydi",
        "Podman'da CLI sintaksisi butunlay boshqacha"
      ],
      "correct": 1,
      "explanation": "Docker markaziy root-daemon orqali ishlaydi; Podman esa daemon'siz, konteynerni user processi sifatida yaratadi (xavfsizroq). CLI esa deyarli bir xil — alias docker=podman ko'p ishlatiladi."
    },
    {
      "question": "Ishlayotgan konteynerning loglarini real vaqtda kuzatish uchun qaysi buyruq kerak?",
      "options": [
        "docker inspect webapp | tail",
        "docker watch webapp",
        "docker logs -f webapp",
        "tail -f /var/log/docker/webapp.log"
      ],
      "correct": 2,
      "explanation": "docker logs -f (follow) — konteynerning stdout/stderr oqimini jonli ko'rsatadi, xuddi tail -f kabi. --tail 100 bilan oxirgi 100 qatordan boshlash mumkin."
    }
  ],
  "12": [
    {
      "question": "LFCS imtihonining formati qanday?",
      "options": [
        "100 ta test savoli (multiple choice)",
        "Og'zaki suhbat + nazariy savollar",
        "Uy vazifasi sifatida loyiha topshirish",
        "Performance-based: real terminal muhitida amaliy vazifalarni bajarish"
      ],
      "correct": 3,
      "explanation": "LFCS — 2 soatlik amaliy imtihon: sizga real Linux muhiti beriladi va vazifalarni terminal buyruqlari bilan bajarasiz. Test savollari yo'q — faqat amaliyot."
    },
    {
      "question": "Imtihon vaqtida qiyin vazifaga duch kelganda eng to'g'ri strategiya qaysi?",
      "options": [
        "Belgilab qo'yib keyingisiga o'tish, oxirida qaytish — har bir vazifa mustaqil baholanadi",
        "Hal bo'lgunga qadar shu vazifada qolish",
        "Imtihonni qaytadan boshlash",
        "Barcha qiyin vazifalarni tashlab ketish"
      ],
      "correct": 0,
      "explanation": "Vazifalar mustaqil — bittasida qotib qolib boshqa oson ballarni yo'qotmang. Avval tez bajariladiganlarni yig'ib, qolgan vaqtni qiyinlariga sarflang."
    },
    {
      "question": "Imtihonda buyruq sintaksisini eslay olmasangiz, qaysi manbadan foydalanish mumkin?",
      "options": [
        "Google qidiruv",
        "man va --help sahifalari — ular imtihon muhitida ruxsat etilgan",
        "Telefondagi eslatmalar",
        "ChatGPT"
      ],
      "correct": 1,
      "explanation": "Tashqi internet ta'qiqlangan, lekin man sahifalari, --help va /usr/share/doc imtihon muhitining o'zida bor. man -k (apropos) bilan buyruqni nomidan qidirishni mashq qiling."
    },
    {
      "question": "100MB dan katta fayllarni butun tizim bo'ylab topish uchun qaysi buyruq to'g'ri?",
      "options": [
        "ls -R / | grep 100M",
        "du -sh / --min=100M",
        "find / -type f -size +100M 2>/dev/null",
        "grep -r --size=100M /"
      ],
      "correct": 2,
      "explanation": "find -size +100M — 100 megabaytdan katta fayllar. 2>/dev/null permission xatolarini yashiradi. Disk to'lganda eng ko'p ishlatiladigan diagnostika buyrug'i."
    },
    {
      "question": "Servisni ham hozir ishga tushirish, ham boot'da avtomatik yoqilishini bitta buyruq bilan qanday qilamiz?",
      "options": [
        "systemctl start nginx && reboot",
        "systemctl autostart nginx",
        "service nginx always-on",
        "systemctl enable --now nginx"
      ],
      "correct": 3,
      "explanation": "enable --now = enable (boot'da yoqish) + start (hozir ishga tushirish) bitta buyruqda. Imtihonda vaqt tejaydigan klassik trick."
    },
    {
      "question": "chmod 750 script.sh natijasida qanday huquqlar o'rnatiladi?",
      "options": [
        "owner: rwx, group: r-x, others: yo'q",
        "owner: rwx, group: rwx, others: r-x",
        "owner: r-x, group: rwx, others: ---",
        "hamma uchun rwx"
      ],
      "correct": 0,
      "explanation": "7=rwx (owner), 5=r-x (group), 0=--- (others). Oktal: r=4, w=2, x=1. Imtihonda permission savollari deyarli har doim uchraydi."
    },
    {
      "question": "LVM logical volume'ni 5GB ga kattalashtirish va ext4 filesystem'ni ham birga kengaytirish uchun eng qulay buyruq qaysi?",
      "options": [
        "lvresize --grow 5G && ext4resize",
        "lvextend -r -L +5G /dev/vg_data/lv_app",
        "vgextend -L +5G /dev/vg_data/lv_app",
        "resize2fs +5G /dev/vg_data/lv_app"
      ],
      "correct": 1,
      "explanation": "lvextend -L +5G hajmni oshiradi, -r (--resizefs) esa filesystem'ni ham avtomatik kengaytiradi (resize2fs'ni alohida chaqirish shart emas). vgextend esa VG'ga yangi disk qo'shadi."
    },
    {
      "question": "Tizimga default gateway (192.168.1.1) qo'shish uchun qaysi buyruq to'g'ri?",
      "options": [
        "ip gateway set 192.168.1.1",
        "route default=192.168.1.1",
        "ip route add default via 192.168.1.1",
        "netstat -gw 192.168.1.1"
      ],
      "correct": 2,
      "explanation": "ip route add default via <gateway> — zamonaviy iproute2 sintaksisi. Doimiy qilish uchun netplan/NetworkManager konfiguratsiyasiga yoziladi."
    },
    {
      "question": "nginx servisining faqat joriy boot'dagi loglarini ko'rish uchun qaysi buyruq kerak?",
      "options": [
        "cat /var/log/nginx/boot.log",
        "dmesg | grep nginx",
        "systemctl logs nginx --current",
        "journalctl -u nginx -b"
      ],
      "correct": 3,
      "explanation": "journalctl -u <unit> — servis loglari, -b — faqat joriy boot. -f qo'shsangiz jonli kuzatasiz, --since \"1 hour ago\" bilan vaqt filtri qo'yiladi."
    },
    {
      "question": "/etc directorysini gzip bilan siqilgan arxivga olish uchun to'g'ri buyruq qaysi?",
      "options": [
        "tar -czf /backup/etc-$(date +%F).tar.gz /etc",
        "gzip -r /etc /backup/etc.gz",
        "zip /etc > /backup/etc.tar.gz",
        "tar -xzf /backup/etc.tar.gz /etc"
      ],
      "correct": 0,
      "explanation": "-c yaratish, -z gzip, -f fayl nomi. $(date +%F) — YYYY-MM-DD ko'rinishidagi sana. -x esa arxivni OCHADI — yaratish emas."
    },
    {
      "question": "Home directory va bash shell bilan yangi user yaratishning to'g'ri buyrug'i qaysi?",
      "options": [
        "adduser --no-home -s /bin/sh devops",
        "useradd -m -s /bin/bash devops",
        "usermod -m -s /bin/bash devops",
        "newuser devops --home --bash"
      ],
      "correct": 1,
      "explanation": "-m home directory yaratadi (/home/devops), -s login shell'ni belgilaydi. usermod mavjud userni o'zgartiradi, yangisini yaratmaydi. Parol esa passwd devops bilan qo'yiladi."
    },
    {
      "question": "Ushbu kursdagi LFCS domenlari ichida eng katta vaznga ega bo'limi qaysi?",
      "options": [
        "Networking",
        "Storage Management",
        "Essential Commands (25%)",
        "Users & Groups"
      ],
      "correct": 2,
      "explanation": "Essential Commands — 25% bilan eng katta domen: fayl operatsiyalari, find, grep, tar, permissions. Imtihon tayyorgarligining poydevori shu bo'lim."
    }
  ]
};
