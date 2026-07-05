// LFCS exam task bank: 3 variants per domain, one picked at random per exam.
// Fixture paths are unique across the whole bank so the verification harness
// can seed all tasks into one container without collisions.
// Every task is container-verified: checks fail on a fresh seeded container
// and all pass after the reference solution.

export const DOMAINS = [
  { key: 'essential', label: 'Essential Commands', weight: 25 },
  { key: 'users', label: 'User Management', weight: 10 },
  { key: 'systems', label: 'Operation of Running Systems', weight: 20 },
  { key: 'networking', label: 'Networking', weight: 12 },
  { key: 'storage', label: 'Storage Management', weight: 13 },
  { key: 'services', label: 'Service Configuration', weight: 20 },
];

export const examTaskBank = [
  // ---------------- Essential Commands (25%) ----------------
  {
    id: 11,
    domain: 'essential',
    title: 'Find and Archive Files',
    timeLimit: 10,
    description: `/home/admin/data directoryda 7 kundan eski .log kengaytmali barcha fayllarni toping.
Ularni /backup/old-logs-$(date +%Y%m%d).tar.gz arxiviga joylashtiring.
Arxiv yaratilgandan so'ng, o'sha eski .log fayllarni o'chiring.
Yangi fayllar va boshqa kengaytmali fayllar saqlanib qolsin.`,
    hints: [
      "find buyrug'ini -mtime +7 va -name bilan ishlating",
      "tar -czf arxiv yaratish uchun (fayllar ro'yxatini -T - bilan bering)",
      "find ... -delete o'chirish uchun",
    ],
    solution: `cd /home/admin/data
find . -name "*.log" -type f -mtime +7 | tar -czf /backup/old-logs-$(date +%Y%m%d).tar.gz -T -
find /home/admin/data -name "*.log" -type f -mtime +7 -delete`,
    verification: "ls -la /backup/old-logs-*.tar.gz && find /home/admin/data -name '*.log' -mtime +7",
    seed: `mkdir -p /home/admin/data /backup
for i in 1 2 3 4 5; do touch -d "10 days ago" "/home/admin/data/app$i.log"; done
touch -d "10 days ago" /home/admin/data/notes.txt
touch /home/admin/data/current.log`,
    checks: [
      { name: 'Arxiv yaratilgan: /backup/old-logs-*.tar.gz', cmd: `ls /backup/old-logs-*.tar.gz >/dev/null 2>&1` },
      { name: 'Arxiv ichida .log fayllar bor', cmd: `tar -tzf $(ls /backup/old-logs-*.tar.gz | head -1) | grep -q '\\.log'` },
      { name: "7 kundan eski .log fayllar o'chirilgan", cmd: `[ -z "$(find /home/admin/data -name '*.log' -mtime +7 2>/dev/null)" ]` },
      { name: 'Yangi fayllar saqlanib qolgan', cmd: `[ -f /home/admin/data/current.log ] && [ -f /home/admin/data/notes.txt ]` },
    ],
  },
  {
    id: 12,
    domain: 'essential',
    title: 'Log Analysis and Report',
    timeLimit: 10,
    description: `/var/webproxy/access.log faylini tahlil qiling va /root/report katalogida hisobot tayyorlang:

1. Status kodi 404 bo'lgan qatorlarni /root/report/404.txt fayliga yozing
2. Logdagi BARCHA unique IP manzillarni sort qilingan holda /root/report/ips.txt ga yozing
3. Log faylning gzip nusxasini /root/report/access.log.gz sifatida yarating —
   ASL FAYL o'z joyida qolsin`,
    hints: [
      "404 oxirgi ustunda: grep ' 404$'",
      "IP: grep -oE yoki awk '{print $1}' + sort -u",
      'Asl faylni saqlab siqish: gzip -c fayl > nusxa.gz',
    ],
    solution: `mkdir -p /root/report
grep ' 404$' /var/webproxy/access.log > /root/report/404.txt
awk '{print $1}' /var/webproxy/access.log | sort -u > /root/report/ips.txt
gzip -c /var/webproxy/access.log > /root/report/access.log.gz`,
    verification: 'wc -l /root/report/404.txt /root/report/ips.txt && gzip -t /root/report/access.log.gz',
    seed: `mkdir -p /var/webproxy
cat > /var/webproxy/access.log <<'SEEDEOF'
203.0.113.5 - - "GET /index.html" 200
198.51.100.7 - - "GET /admin" 404
203.0.113.5 - - "GET /login" 200
192.0.2.10 - - "GET /old-page" 404
198.51.100.7 - - "GET /api" 500
SEEDEOF`,
    checks: [
      { name: '404.txt: 2 ta qator, to\'g\'ri sahifalar', cmd: `[ "$(wc -l < /root/report/404.txt)" -eq 2 ] && grep -q '/admin' /root/report/404.txt && grep -q '/old-page' /root/report/404.txt` },
      { name: 'ips.txt: 3 ta unique IP sort qilingan', cmd: `[ "$(cat /root/report/ips.txt)" = "$(printf '192.0.2.10\\n198.51.100.7\\n203.0.113.5')" ]` },
      { name: 'gzip nusxa yaroqli', cmd: `gzip -t /root/report/access.log.gz 2>/dev/null` },
      { name: 'Asl log fayl joyida', cmd: `[ -f /var/webproxy/access.log ] && grep -q 'index.html' /var/webproxy/access.log` },
    ],
  },
  {
    id: 13,
    domain: 'essential',
    title: 'File Sorting and Permission Fix',
    timeLimit: 10,
    description: `/srv/incoming katalogiga aralash fayllar kelib tushgan. Tartibga keltiring:

1. Barcha .sh fayllarga bajarish huquqini qo'shing (mavjud ruxsatlar buzilmasin, +x)
2. Barcha .conf fayllarni /etc/appconfigs/ katalogiga KO'CHIRING (katalogni yarating)
3. /srv/incoming ichidagi bo'sh (0 bayt) fayllarni toping va o'chiring`,
    hints: [
      "chmod +x yoki find -name '*.sh' -exec chmod +x {} +",
      'mv bilan ko\'chirish (nusxa emas)',
      'find /srv/incoming -type f -empty -delete',
    ],
    solution: `find /srv/incoming -name '*.sh' -type f -exec chmod +x {} +
mkdir -p /etc/appconfigs
mv /srv/incoming/*.conf /etc/appconfigs/
find /srv/incoming -type f -empty -delete`,
    verification: 'ls -la /srv/incoming /etc/appconfigs',
    seed: `mkdir -p /srv/incoming
printf '#!/bin/bash\\necho deploy\\n' > /srv/incoming/deploy.sh
chmod 644 /srv/incoming/deploy.sh
printf '#!/bin/bash\\necho init\\n' > /srv/incoming/init.sh
chmod 600 /srv/incoming/init.sh
echo 'port=80' > /srv/incoming/app.conf
echo 'db=pg' > /srv/incoming/db.conf
touch /srv/incoming/empty1.dat /srv/incoming/empty2.dat
echo 'eslatma' > /srv/incoming/notes.txt`,
    checks: [
      { name: '.sh fayllar bajariladigan', cmd: `[ -x /srv/incoming/deploy.sh ] && [ -x /srv/incoming/init.sh ]` },
      { name: '.conf fayllar /etc/appconfigs ga ko\'chirilgan', cmd: `[ -f /etc/appconfigs/app.conf ] && [ -f /etc/appconfigs/db.conf ] && [ ! -e /srv/incoming/app.conf ]` },
      { name: "Bo'sh fayllar o'chirilgan", cmd: `[ ! -e /srv/incoming/empty1.dat ] && [ ! -e /srv/incoming/empty2.dat ]` },
      { name: 'notes.txt saqlangan', cmd: `[ -f /srv/incoming/notes.txt ]` },
    ],
  },

  // ---------------- User Management (10%) ----------------
  {
    id: 21,
    domain: 'users',
    title: 'Create Users with Specific Requirements',
    timeLimit: 8,
    description: `Quyidagi talablar bilan foydalanuvchi yarating:

- Username: webdev
- Primary group: developer (guruh mavjud bo'lmasa yarating)
- Secondary groups: docker, sudo
- Home directory: /home/webdev
- Shell: /bin/bash
- Password expires in 90 days
- Account expires on 2026-12-31`,
    hints: [
      'groupadd bilan guruh yarating',
      'useradd -m -g -G -s bilan foydalanuvchi',
      'chage -M va -E bilan expire sozlash',
    ],
    solution: `groupadd developer
useradd -m -g developer -G docker,sudo -s /bin/bash webdev
chage -M 90 webdev
chage -E 2026-12-31 webdev`,
    verification: 'id webdev && chage -l webdev',
    seed: `getent group docker >/dev/null || groupadd docker`,
    checks: [
      { name: 'webdev useri mavjud', cmd: `id webdev >/dev/null 2>&1` },
      { name: 'Primary group: developer', cmd: `[ "$(id -gn webdev)" = "developer" ]` },
      { name: 'Secondary groups: docker va sudo', cmd: `id -nG webdev | grep -qw docker && id -nG webdev | grep -qw sudo` },
      { name: 'Home va shell to\'g\'ri', cmd: `[ -d /home/webdev ] && [ "$(getent passwd webdev | cut -d: -f7)" = "/bin/bash" ]` },
      { name: 'Password max age: 90 kun', cmd: `[ "$(chage -l webdev 2>/dev/null | awk -F': *' '/Maximum number/ {print $2}')" = "90" ]` },
      { name: 'Account expiry: 2026-12-31', cmd: `chage -l webdev | grep -q 'Dec 31, 2026'` },
    ],
  },
  {
    id: 22,
    domain: 'users',
    title: 'Group Policy and Skeleton Files',
    timeLimit: 8,
    description: `Yangi jamoa uchun muhit tayyorlang:

1. qa-team guruhini GID 4200 bilan yarating
2. /etc/skel/.welcome faylini yarating, mazmuni: Xush kelibsiz!
3. tester1 userini yarating: primary guruhi qa-team, home directory bilan (-m),
   shell /bin/bash — home'ida .welcome fayli avtomatik paydo bo'lishi kerak (skel orqali)
4. tester1 hisobiga 2026-12-31 tugash muddatini qo'ying`,
    hints: [
      'groupadd -g 4200 qa-team',
      "Avval skel faylini yozing, KEYIN userni yarating — useradd -m skel'dan nusxalaydi",
      'chage -E yoki useradd -e bilan expiry',
    ],
    solution: `groupadd -g 4200 qa-team
echo 'Xush kelibsiz!' > /etc/skel/.welcome
useradd -m -g qa-team -s /bin/bash tester1
chage -E 2026-12-31 tester1`,
    verification: 'id tester1 && cat /home/tester1/.welcome && chage -l tester1',
    seed: '',
    checks: [
      { name: 'qa-team guruhi GID 4200', cmd: `[ "$(getent group qa-team | cut -d: -f3)" = "4200" ]` },
      { name: 'tester1 primary guruhi qa-team', cmd: `[ "$(id -gn tester1 2>/dev/null)" = "qa-team" ]` },
      { name: "Home'da .welcome bor (skel'dan)", cmd: `grep -q 'Xush kelibsiz!' /home/tester1/.welcome` },
      { name: 'Hisob muddati 2026-12-31', cmd: `chage -l tester1 | grep -q 'Dec 31, 2026'` },
    ],
  },
  {
    id: 23,
    domain: 'users',
    title: 'Account Security Audit',
    timeLimit: 8,
    description: `Xavfsizlik auditi o'tkazing:

1. svc-old hisobining parolini qulflang (shadow'da hash oldiga ! qo'shilsin)
2. svc-old login shellini /usr/sbin/nologin ga o'zgartiring
3. UID >= 1000 bo'lgan oddiy userlar ro'yxatini (faqat usernamelar, har qatorda bittadan,
   sort qilingan) /root/users-audit.txt fayliga yozing`,
    hints: [
      'usermod -L qulflaydi, usermod -s shellni o\'zgartiradi',
      "awk -F: '$3>=1000 && $3<65000 {print $1}' /etc/passwd | sort",
    ],
    solution: `usermod -L svc-old
usermod -s /usr/sbin/nologin svc-old
awk -F: '$3>=1000 && $3<65000 {print $1}' /etc/passwd | sort > /root/users-audit.txt`,
    verification: 'getent shadow svc-old | cut -d: -f2 | head -c1 && cat /root/users-audit.txt',
    seed: `id svc-old >/dev/null 2>&1 || useradd -m -s /bin/bash svc-old
echo 'svc-old:OldPass123' | chpasswd
id svc-app >/dev/null 2>&1 || useradd -m -s /bin/bash svc-app`,
    checks: [
      { name: 'svc-old paroli qulflangan', cmd: `getent shadow svc-old | cut -d: -f2 | grep -q '^!'` },
      { name: 'svc-old shelli nologin', cmd: `getent passwd svc-old | grep -Eq ':/(usr/)?sbin/nologin$'` },
      { name: 'Audit faylida svc-old va svc-app bor', cmd: `grep -qx 'svc-old' /root/users-audit.txt && grep -qx 'svc-app' /root/users-audit.txt` },
      { name: 'Audit faylida root yo\'q', cmd: `! grep -qx 'root' /root/users-audit.txt` },
    ],
  },

  // ---------------- Operation of Running Systems (20%) ----------------
  {
    id: 31,
    domain: 'systems',
    title: 'Create and Enable a Systemd Service',
    timeLimit: 12,
    description: `Quyidagi xususiyatlarga ega systemd service unit yarating:

- Service name: webapp
- Script: /opt/webapp/start.sh (tayyor)
- User: webdev bo'lishi shart emas — root ham bo'ladi, lekin unit faylda User= ko'rsating (webdev)
- WorkingDirectory: /opt/webapp
- Crash bo'lganda avtomatik restart (5 sekund kutib)
- Boot vaqtida avtomatik ishga tushsin (multi-user.target)
- network.target dan keyin ishga tushsin

Eslatma: bu lab konteynerida systemd PID 1 emas, shuning uchun
"systemctl enable" ishlamaydi — enable holatini qo'lda symlink
bilan yarating (real imtihonda systemctl enable ishlatiladi).`,
    hints: [
      'Unit file /etc/systemd/system/webapp.service da yaratiladi',
      '[Unit], [Service], [Install] sectionlari kerak',
      'Enable = /etc/systemd/system/multi-user.target.wants/ ichida symlink',
    ],
    solution: `cat > /etc/systemd/system/webapp.service <<'EOF'
[Unit]
Description=Web Application Service
After=network.target

[Service]
Type=simple
User=webdev
WorkingDirectory=/opt/webapp
ExecStart=/opt/webapp/start.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
mkdir -p /etc/systemd/system/multi-user.target.wants
ln -s /etc/systemd/system/webapp.service /etc/systemd/system/multi-user.target.wants/webapp.service`,
    verification: 'cat /etc/systemd/system/webapp.service && ls -l /etc/systemd/system/multi-user.target.wants/',
    seed: `mkdir -p /opt/webapp
printf '#!/bin/bash\\nexec sleep infinity\\n' > /opt/webapp/start.sh
chmod +x /opt/webapp/start.sh`,
    checks: [
      { name: 'Unit file mavjud', cmd: `[ -f /etc/systemd/system/webapp.service ]` },
      { name: 'ExecStart va WorkingDirectory', cmd: `grep -Eq '^\\s*ExecStart=/opt/webapp/start.sh' /etc/systemd/system/webapp.service && grep -Eq '^\\s*WorkingDirectory=/opt/webapp' /etc/systemd/system/webapp.service` },
      { name: 'User=webdev', cmd: `grep -Eq '^\\s*User=webdev' /etc/systemd/system/webapp.service` },
      { name: 'Restart=on-failure, RestartSec=5', cmd: `grep -Eq '^\\s*Restart=on-failure' /etc/systemd/system/webapp.service && grep -Eq '^\\s*RestartSec=5' /etc/systemd/system/webapp.service` },
      { name: 'After=network.target', cmd: `grep -Eq '^\\s*After=.*network.target' /etc/systemd/system/webapp.service` },
      { name: 'WantedBy + enable symlink', cmd: `grep -Eq '^\\s*WantedBy=multi-user.target' /etc/systemd/system/webapp.service && [ -L /etc/systemd/system/multi-user.target.wants/webapp.service ]` },
    ],
  },
  {
    id: 32,
    domain: 'systems',
    title: 'Systemd Drop-in Override',
    timeLimit: 12,
    description: `legacyapp.service unit fayli mavjud, lekin uni to'g'ridan-to'g'ri tahrirlash mumkin emas
(paket yangilanishida qayta yoziladi). Drop-in override yarating:

- /etc/systemd/system/legacyapp.service.d/override.conf faylida
- [Service] bo'limida: Restart=on-failure, RestartSec=10 va MemoryMax=256M
- ASL unit fayl o'zgarmasin

(Real serverda buni systemctl edit legacyapp qiladi — konteynerda faylni qo'lda yarating.)`,
    hints: [
      'Katalog nomi: <unit>.service.d, fayl: override.conf',
      "Drop-in ham [Service] section header'idan boshlanadi",
    ],
    solution: `mkdir -p /etc/systemd/system/legacyapp.service.d
cat > /etc/systemd/system/legacyapp.service.d/override.conf <<'EOF'
[Service]
Restart=on-failure
RestartSec=10
MemoryMax=256M
EOF`,
    verification: 'cat /etc/systemd/system/legacyapp.service.d/override.conf',
    seed: `cat > /etc/systemd/system/legacyapp.service <<'SEEDEOF'
[Unit]
Description=Legacy Application

[Service]
Type=simple
ExecStart=/usr/bin/sleep infinity
Restart=no

[Install]
WantedBy=multi-user.target
SEEDEOF`,
    checks: [
      { name: 'override.conf yaratilgan', cmd: `[ -f /etc/systemd/system/legacyapp.service.d/override.conf ]` },
      { name: '[Service] section bor', cmd: `grep -q '^\\[Service\\]' /etc/systemd/system/legacyapp.service.d/override.conf` },
      { name: 'Restart=on-failure va RestartSec=10', cmd: `grep -Eq '^Restart=on-failure' /etc/systemd/system/legacyapp.service.d/override.conf && grep -Eq '^RestartSec=10' /etc/systemd/system/legacyapp.service.d/override.conf` },
      { name: 'MemoryMax=256M', cmd: `grep -Eq '^MemoryMax=256M' /etc/systemd/system/legacyapp.service.d/override.conf` },
      { name: 'Asl unit fayl o\'zgarmagan', cmd: `grep -Eq '^Restart=no' /etc/systemd/system/legacyapp.service` },
    ],
  },
  {
    id: 33,
    domain: 'systems',
    title: 'Process Management',
    timeLimit: 12,
    description: `Konteynerda /opt/procs/spinner.sh jarayoni resurs yeb yotibdi:

1. spinner.sh jarayonini SIGKILL bilan majburiy to'xtating
2. /opt/procs/batch.sh skriptini nice qiymati 10 bilan FONDA ishga tushiring —
   u tekshiruv vaqtida ham ishlab turishi kerak (nohup/setsid bilan ajratib qo'ying)
3. Ishga tushirgan jarayon PID'ini /opt/procs/batch.pid fayliga yozing`,
    hints: [
      "pkill -9 -f yoki kill -9 PID",
      'nice -n 10 setsid /opt/procs/batch.sh </dev/null >/dev/null 2>&1 &',
      "echo $! > pid-fayl — oxirgi fon jarayon PID'i",
    ],
    solution: `pkill -9 -f "procs/[s]pinner" 2>/dev/null || true
sleep 1
setsid nice -n 10 /opt/procs/batch.sh </dev/null >/dev/null 2>&1 &
echo $! > /opt/procs/batch.pid
sleep 1`,
    verification: 'cat /opt/procs/batch.pid && ps -o pid,ni,cmd -p $(cat /opt/procs/batch.pid)',
    seed: `mkdir -p /opt/procs
cat > /opt/procs/spinner.sh <<'SEEDEOF'
#!/bin/bash
while true; do sleep 1; done
SEEDEOF
chmod +x /opt/procs/spinner.sh
cat > /opt/procs/batch.sh <<'SEEDEOF'
#!/bin/bash
while true; do sleep 5; done
SEEDEOF
chmod +x /opt/procs/batch.sh
setsid /opt/procs/spinner.sh </dev/null >/dev/null 2>&1 &
sleep 1`,
    checks: [
      { name: "spinner to'xtatilgan", cmd: `! pgrep -f "procs/[s]pinner" >/dev/null` },
      { name: 'batch ishlab turibdi', cmd: `pgrep -f "procs/[b]atch" >/dev/null` },
      { name: 'PID fayli to\'g\'ri jarayonga ishora qiladi', cmd: `[ -f /opt/procs/batch.pid ] && kill -0 "$(cat /opt/procs/batch.pid)" 2>/dev/null` },
      { name: 'Nice qiymati 10', cmd: `[ "$(ps -o ni= -p $(cat /opt/procs/batch.pid) | tr -d ' ')" = "10" ]` },
    ],
  },

  // ---------------- Networking (12%) ----------------
  {
    id: 41,
    domain: 'networking',
    title: 'Configure Network Interface and Firewall Rules',
    timeLimit: 12,
    description: `Quyidagi network konfiguratsiyani bajaring:

1. dummy0 nomli dummy interfeys yarating
2. Unga static IP bering: 192.168.1.100/24
3. Interfeysni UP holatga keltiring
4. DNS server qo'shing: 8.8.8.8 (/etc/resolv.conf)
5. /root/firewall.sh script yarating (bajariladigan) — unda iptables qoidalari:
   - 22 (SSH), 80 (HTTP), 443 (HTTPS) portlarga ruxsat
   - INPUT chain uchun default DROP policy`,
    hints: [
      'ip link add ... type dummy',
      'ip addr add va ip link set ... up',
      'iptables -A INPUT -p tcp --dport N -j ACCEPT va -P INPUT DROP',
    ],
    solution: `ip link add dummy0 type dummy
ip addr add 192.168.1.100/24 dev dummy0
ip link set dummy0 up
echo "nameserver 8.8.8.8" >> /etc/resolv.conf
cat > /root/firewall.sh <<'EOF'
#!/bin/bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -P INPUT DROP
EOF
chmod +x /root/firewall.sh`,
    verification: 'ip addr show dummy0 && cat /root/firewall.sh',
    seed: '',
    checks: [
      { name: 'dummy0 yaratilgan va UP', cmd: `ip link show dummy0 2>/dev/null | grep -q UP` },
      { name: 'IP 192.168.1.100/24', cmd: `ip addr show dummy0 | grep -q '192.168.1.100/24'` },
      { name: 'DNS 8.8.8.8 resolv.conf da', cmd: `grep -q 'nameserver 8.8.8.8' /etc/resolv.conf` },
      { name: 'firewall.sh bajariladigan', cmd: `[ -x /root/firewall.sh ]` },
      { name: '22/80/443 ACCEPT qoidalari', cmd: `grep -Eq 'dport (22|ssh)' /root/firewall.sh && grep -Eq 'dport (80|http)' /root/firewall.sh && grep -Eq 'dport (443|https)' /root/firewall.sh` },
      { name: 'Default DROP policy', cmd: `grep -Eq '(-P|--policy)\\s+INPUT\\s+DROP' /root/firewall.sh` },
    ],
  },
  {
    id: 42,
    domain: 'networking',
    title: 'Hosts, DNS and Interface Info',
    timeLimit: 10,
    description: `Quyidagi tarmoq sozlamalarini bajaring:

1. dummy3 interfeysini yarating, 172.31.5.1/30 manzil bering va UP qiling
2. /etc/hosts ga yozuv qo'shing: 10.50.0.20 db.internal
3. /etc/resolv.conf ga nameserver 9.9.9.9 qo'shing
4. lo (loopback) interfeysining MTU qiymatini aniqlab, FAQAT raqamni
   /root/lo-mtu.txt fayliga yozing`,
    hints: [
      'ip link add / ip addr add / ip link set up',
      "MTU: ip link show lo chiqishida mtu NNNN ko'rinadi",
    ],
    solution: `ip link add dummy3 type dummy
ip addr add 172.31.5.1/30 dev dummy3
ip link set dummy3 up
echo '10.50.0.20 db.internal' >> /etc/hosts
echo 'nameserver 9.9.9.9' >> /etc/resolv.conf
ip link show lo | grep -oE 'mtu [0-9]+' | awk '{print $2}' > /root/lo-mtu.txt`,
    verification: 'ip addr show dummy3 && getent hosts db.internal && cat /root/lo-mtu.txt',
    seed: '',
    checks: [
      { name: 'dummy3 UP va 172.31.5.1/30', cmd: `ip addr show dummy3 2>/dev/null | grep -q '172.31.5.1/30' && ip link show dummy3 | grep -q UP` },
      { name: 'db.internal hosts yozuvi', cmd: `getent hosts db.internal | grep -q '10.50.0.20'` },
      { name: 'nameserver 9.9.9.9', cmd: `grep -Eq '^nameserver[[:space:]]+9\\.9\\.9\\.9' /etc/resolv.conf` },
      { name: 'lo MTU to\'g\'ri yozilgan', cmd: `[ "$(tr -d '[:space:]' < /root/lo-mtu.txt)" = "$(ip link show lo | grep -oE 'mtu [0-9]+' | awk '{print $2}')" ]` },
    ],
  },
  {
    id: 43,
    domain: 'networking',
    title: 'Multiple IPs and Static Route',
    timeLimit: 10,
    description: `Murakkab interfeys konfiguratsiyasi:

1. dummy4 interfeysini yarating va UP qiling
2. Unga IKKITA IP manzil bering: 192.168.200.1/24 va 192.168.201.1/24
3. 10.99.0.0/16 tarmog'iga 192.168.200.254 gateway orqali statik route qo'shing
4. Routing jadvalini (ip route chiqishini) /root/net43.txt fayliga saqlang`,
    hints: [
      'ip addr add ikki marta chaqiriladi — bitta interfeysga bir nechta IP bo\'ladi',
      'ip route add TARMOQ via GATEWAY',
    ],
    solution: `ip link add dummy4 type dummy
ip link set dummy4 up
ip addr add 192.168.200.1/24 dev dummy4
ip addr add 192.168.201.1/24 dev dummy4
ip route add 10.99.0.0/16 via 192.168.200.254
ip route > /root/net43.txt`,
    verification: 'ip addr show dummy4 && ip route && cat /root/net43.txt',
    seed: '',
    checks: [
      { name: 'dummy4 da ikkala IP bor', cmd: `ip addr show dummy4 2>/dev/null | grep -q '192.168.200.1/24' && ip addr show dummy4 | grep -q '192.168.201.1/24'` },
      { name: '10.99.0.0/16 route mavjud', cmd: `ip route | grep -q '10.99.0.0/16 via 192.168.200.254'` },
      { name: 'net43.txt da route saqlangan', cmd: `grep -q '10.99.0.0/16' /root/net43.txt` },
    ],
  },

  // ---------------- Storage Management (13%) ----------------
  {
    id: 51,
    domain: 'storage',
    title: 'Filesystem Image and Persistent Mount',
    timeLimit: 12,
    description: `Quyidagi storage konfiguratsiyani bajaring:

1. /root/disk.img nomli 100MB disk image yarating
2. Uni ext4 filesystem bilan format qiling
3. /mnt/appdata mount point yarating
4. /etc/fstab ga yozing: reboot dan keyin ham loop orqali
   /mnt/appdata ga mount bo'lsin (loop option bilan)

Eslatma: real imtihonda bu LVM (pvcreate/vgcreate/lvcreate) bilan
bajariladi — bu lab konteynerida blok qurilmalar yo'qligi uchun
disk image ishlatamiz. Mantiq bir xil: format → mount point → fstab.`,
    hints: [
      'dd if=/dev/zero of=... bs=1M count=100 yoki truncate -s 100M',
      'mkfs.ext4 fayl ustida ham ishlaydi',
      'fstab: <image> <mountpoint> ext4 loop,defaults 0 2',
    ],
    solution: `dd if=/dev/zero of=/root/disk.img bs=1M count=100 2>/dev/null
mkfs.ext4 -q /root/disk.img
mkdir -p /mnt/appdata
echo "/root/disk.img /mnt/appdata ext4 loop,defaults 0 2" >> /etc/fstab`,
    verification: 'blkid /root/disk.img && grep appdata /etc/fstab',
    seed: '',
    checks: [
      { name: 'disk.img 100MB atrofida', cmd: `[ -f /root/disk.img ] && [ "$(stat -c%s /root/disk.img)" -ge 94371840 ]` },
      { name: 'ext4 formatida', cmd: `blkid -o value -s TYPE /root/disk.img 2>/dev/null | grep -q ext4` },
      { name: '/mnt/appdata mavjud', cmd: `[ -d /mnt/appdata ]` },
      { name: 'fstab: loop va ext4 bilan', cmd: `grep '/mnt/appdata' /etc/fstab | grep -q loop && grep '/mnt/appdata' /etc/fstab | grep -q ext4` },
    ],
  },
  {
    id: 52,
    domain: 'storage',
    title: 'Swap File Setup',
    timeLimit: 10,
    description: `Serverga qo'shimcha swap kerak:

1. /root/swap2.img nomli aynan 128MB fayl yarating
2. Ruxsatini 600 ga o'rnating (xavfsizlik talabi)
3. mkswap bilan swap formatiga keltiring
4. /etc/fstab ga yozing: /root/swap2.img none swap sw 0 0`,
    hints: [
      'dd if=/dev/zero of=... bs=1M count=128',
      'chmod 600 — swap fayl faqat root o\'qishi kerak',
      'mkswap fayl',
    ],
    solution: `dd if=/dev/zero of=/root/swap2.img bs=1M count=128 2>/dev/null
chmod 600 /root/swap2.img
mkswap /root/swap2.img
echo '/root/swap2.img none swap sw 0 0' >> /etc/fstab`,
    verification: 'ls -l /root/swap2.img && blkid /root/swap2.img && grep swap2 /etc/fstab',
    seed: '',
    checks: [
      { name: 'Fayl 128MB va 600 ruxsatli', cmd: `[ "$(stat -c '%s %a' /root/swap2.img)" = "134217728 600" ]` },
      { name: 'Swap formatida', cmd: `blkid -o value -s TYPE /root/swap2.img | grep -q swap` },
      { name: 'fstab yozuvi to\'g\'ri', cmd: `grep -Eq '^/root/swap2\\.img[[:space:]]+none[[:space:]]+swap' /etc/fstab` },
    ],
  },
  {
    id: 53,
    domain: 'storage',
    title: 'Labeled Filesystem and Disk Analysis',
    timeLimit: 12,
    description: `Quyidagi storage vazifalarini bajaring:

1. /root/vol53.img nomli 80MB image yarating va ext4 bilan formatlang
2. Filesystem'ga BACKUP53 nomli label qo'ying
3. /mnt/backup53 mount point yarating va /etc/fstab ga LABEL orqali yozing:
   LABEL=BACKUP53 /mnt/backup53 ext4 loop,defaults 0 2
4. /var/store katalogidan 5MB dan katta fayllarni topib, to'liq yo'llarini
   /root/big53.txt ga yozing`,
    hints: [
      'mkfs.ext4 -L LABEL yoki keyin e2label',
      'fstab da qurilma o\'rniga LABEL=NOM yozish mumkin',
      'find -size +5M',
    ],
    solution: `truncate -s 80M /root/vol53.img
mkfs.ext4 -q -L BACKUP53 /root/vol53.img
mkdir -p /mnt/backup53
echo 'LABEL=BACKUP53 /mnt/backup53 ext4 loop,defaults 0 2' >> /etc/fstab
find /var/store -type f -size +5M > /root/big53.txt`,
    verification: 'blkid /root/vol53.img && grep BACKUP53 /etc/fstab && cat /root/big53.txt',
    seed: `mkdir -p /var/store/media /var/store/docs
dd if=/dev/zero of=/var/store/media/video.raw bs=1M count=8 2>/dev/null
dd if=/dev/zero of=/var/store/docs/small.pdf bs=1M count=2 2>/dev/null`,
    checks: [
      { name: 'vol53.img ext4 va label BACKUP53', cmd: `[ "$(blkid -o value -s LABEL /root/vol53.img 2>/dev/null)" = "BACKUP53" ]` },
      { name: 'fstab: LABEL=BACKUP53 yozuvi', cmd: `grep -Eq '^LABEL=BACKUP53[[:space:]]+/mnt/backup53[[:space:]]+ext4' /etc/fstab && grep 'BACKUP53' /etc/fstab | grep -q loop` },
      { name: '/mnt/backup53 mavjud', cmd: `[ -d /mnt/backup53 ]` },
      { name: 'big53.txt: faqat video.raw', cmd: `grep -q 'video.raw' /root/big53.txt && ! grep -q 'small.pdf' /root/big53.txt` },
    ],
  },

  // ---------------- Service Configuration (20%) ----------------
  {
    id: 61,
    domain: 'services',
    title: 'Configure Scheduled Tasks',
    timeLimit: 12,
    description: `Quyidagi scheduled tasklar yarating:

1. Root crontab: har kuni soat 02:00 da /var/log/*.log fayllarni
   /backup/logs/ ga arxivlaydigan cron job
2. Root crontab: reboot bo'lganda /opt/scripts/startup.sh ishga tushsin
3. Systemd timer: har 15 minutda /tmp dan 1 kundan eski fayllarni
   o'chiradigan cleanup-tmp.service + cleanup-tmp.timer pair`,
    hints: [
      "crontab -e yoki (crontab -l; echo '...') | crontab -",
      '@reboot cron syntax',
      'Timer: OnCalendar=*:0/15 va WantedBy=timers.target',
    ],
    solution: `(crontab -l 2>/dev/null; \\
 echo '0 2 * * * tar -czf /backup/logs/logs-$(date +\\%Y\\%m\\%d).tar.gz /var/log/*.log'; \\
 echo '@reboot /opt/scripts/startup.sh') | crontab -
cat > /etc/systemd/system/cleanup-tmp.service <<'EOF'
[Unit]
Description=Cleanup old temp files

[Service]
Type=oneshot
ExecStart=/usr/bin/find /tmp -type f -mtime +1 -delete
EOF
cat > /etc/systemd/system/cleanup-tmp.timer <<'EOF'
[Unit]
Description=Run tmp cleanup every 15 minutes

[Timer]
OnCalendar=*:0/15
Persistent=true

[Install]
WantedBy=timers.target
EOF`,
    verification: 'crontab -l && cat /etc/systemd/system/cleanup-tmp.timer',
    seed: `mkdir -p /backup/logs /opt/scripts
printf '#!/bin/bash\\necho "startup done" >> /var/log/startup.log\\n' > /opt/scripts/startup.sh
chmod +x /opt/scripts/startup.sh`,
    checks: [
      { name: 'Crontab: 02:00 backup job', cmd: `crontab -l 2>/dev/null | grep -E '^0 2 \\* \\* \\*' | grep -q tar` },
      { name: 'Job /backup/logs ga yozadi', cmd: `crontab -l 2>/dev/null | grep '0 2' | grep -q '/backup/logs'` },
      { name: '@reboot startup.sh', cmd: `crontab -l 2>/dev/null | grep -q '@reboot /opt/scripts/startup.sh'` },
      { name: 'cleanup-tmp.service to\'g\'ri', cmd: `[ -f /etc/systemd/system/cleanup-tmp.service ] && grep -q 'find /tmp' /etc/systemd/system/cleanup-tmp.service` },
      { name: 'Timer: har 15 minut + timers.target', cmd: `grep -Eq 'OnCalendar=.*(0/15|:00/15)' /etc/systemd/system/cleanup-tmp.timer && grep -q 'WantedBy=timers.target' /etc/systemd/system/cleanup-tmp.timer` },
    ],
  },
  {
    id: 62,
    domain: 'services',
    title: 'Log Rotation and Syslog Rule',
    timeLimit: 12,
    description: `appsvc xizmati uchun log boshqaruvini sozlang:

1. /etc/logrotate.d/appsvc konfiguratsiyasini yarating:
   /var/log/appsvc/*.log fayllari haftalik (weekly) aylantirilsin,
   4 nusxa saqlansin (rotate 4), siqilsin (compress) va
   bo'sh fayllar aylantirilmasin (notifempty)
2. /etc/rsyslog.d/60-appsvc.conf faylini yarating:
   local2 facility'ning barcha xabarlari /var/log/appsvc/syslog.log ga yozilsin`,
    hints: [
      'logrotate.d format: /yo\'l/*.log { direktivalar }',
      'rsyslog qoida: local2.* /var/log/appsvc/syslog.log',
    ],
    solution: `cat > /etc/logrotate.d/appsvc <<'EOF'
/var/log/appsvc/*.log {
    weekly
    rotate 4
    compress
    notifempty
}
EOF
echo 'local2.* /var/log/appsvc/syslog.log' > /etc/rsyslog.d/60-appsvc.conf`,
    verification: 'cat /etc/logrotate.d/appsvc && cat /etc/rsyslog.d/60-appsvc.conf',
    seed: `mkdir -p /var/log/appsvc /etc/rsyslog.d
touch /var/log/appsvc/app.log`,
    checks: [
      { name: 'Logrotate: yo\'l va weekly', cmd: `grep -q '/var/log/appsvc/\\*.log' /etc/logrotate.d/appsvc && grep -q 'weekly' /etc/logrotate.d/appsvc` },
      { name: 'rotate 4, compress, notifempty', cmd: `grep -Eq 'rotate[[:space:]]+4' /etc/logrotate.d/appsvc && grep -q 'compress' /etc/logrotate.d/appsvc && grep -q 'notifempty' /etc/logrotate.d/appsvc` },
      { name: 'Logrotate sintaksisi to\'g\'ri', cmd: `logrotate -d /etc/logrotate.d/appsvc >/dev/null 2>&1` },
      { name: 'Rsyslog qoidasi to\'g\'ri', cmd: `grep -Eq '^local2\\.\\*[[:space:]]+-?/var/log/appsvc/syslog\\.log' /etc/rsyslog.d/60-appsvc.conf` },
    ],
  },
  {
    id: 63,
    domain: 'services',
    title: 'SSH Hardening and Sudo Rule',
    timeLimit: 12,
    description: `Server xavfsizligini kuchaytiring:

1. /etc/ssh/sshd_config.d/exam.conf faylini yarating, unda:
   PermitRootLogin no, MaxAuthTries 3, X11Forwarding no
2. sysops63 guruhini yarating
3. /etc/sudoers.d/sysops63 faylini yozing: %sysops63 guruhi parolsiz (NOPASSWD)
   faqat /usr/bin/systemctl ni ishga tushira olsin.
   Fayl visudo -c tekshiruvidan o'tishi shart (ruxsat 440 qiling)`,
    hints: [
      'sshd_config.d ichidagi .conf fayllar avtomatik o\'qiladi',
      '%guruh ALL=(ALL) NOPASSWD: /yo\'l/buyruq',
      'visudo -cf fayl — sintaksis tekshiradi',
    ],
    solution: `mkdir -p /etc/ssh/sshd_config.d
cat > /etc/ssh/sshd_config.d/exam.conf <<'EOF'
PermitRootLogin no
MaxAuthTries 3
X11Forwarding no
EOF
groupadd -f sysops63
echo '%sysops63 ALL=(ALL) NOPASSWD: /usr/bin/systemctl' > /etc/sudoers.d/sysops63
chmod 440 /etc/sudoers.d/sysops63`,
    verification: 'cat /etc/ssh/sshd_config.d/exam.conf && visudo -cf /etc/sudoers.d/sysops63',
    seed: `mkdir -p /etc/ssh/sshd_config.d`,
    checks: [
      { name: 'SSH: PermitRootLogin no', cmd: `grep -Eq '^PermitRootLogin[[:space:]]+no' /etc/ssh/sshd_config.d/exam.conf` },
      { name: 'SSH: MaxAuthTries 3 va X11Forwarding no', cmd: `grep -Eq '^MaxAuthTries[[:space:]]+3' /etc/ssh/sshd_config.d/exam.conf && grep -Eq '^X11Forwarding[[:space:]]+no' /etc/ssh/sshd_config.d/exam.conf` },
      { name: 'sysops63 guruhi mavjud', cmd: `getent group sysops63 >/dev/null` },
      { name: 'Sudoers qoidasi va sintaksis', cmd: `grep -Eq '^%sysops63[[:space:]]+ALL=\\(ALL\\)[[:space:]]+NOPASSWD:[[:space:]]+/usr/bin/systemctl' /etc/sudoers.d/sysops63 && visudo -cf /etc/sudoers.d/sysops63 >/dev/null 2>&1` },
    ],
  },
];

const domainByKey = Object.fromEntries(DOMAINS.map((d) => [d.key, d]));

export function getExamTask(id) {
  return examTaskBank.find((t) => t.id === Number(id)) || null;
}

// One random task per domain, in canonical domain order.
export function pickExamTasks(rand = Math.random) {
  return DOMAINS.map((d) => {
    const variants = examTaskBank.filter((t) => t.domain === d.key);
    return variants[Math.floor(rand() * variants.length)];
  });
}

// Client-safe view: no check commands.
export function toClientTask(t) {
  const d = domainByKey[t.domain];
  return {
    id: t.id,
    domain: d.label,
    weight: `${d.weight}%`,
    weightValue: d.weight,
    title: t.title,
    description: t.description,
    timeLimit: t.timeLimit,
    hints: t.hints,
    solution: t.solution,
    verification: t.verification,
    checkCount: t.checks.length,
  };
}

export function combinedSeed(tasks) {
  return tasks.map((t) => t.seed).filter(Boolean).join('\n');
}

export function domainWeight(domainKey) {
  return domainByKey[domainKey]?.weight ?? 0;
}
