// Fallback exam tasks for manual mode (backend/Docker unavailable).
// Mirrors the server bank's "core" variant of each domain — descriptions only,
// verification happens by self-assessment.
export const fallbackExamTasks = [
  {
    id: 11,
    domain: 'Essential Commands',
    weight: '25%',
    weightValue: 25,
    title: 'Find and Archive Files',
    timeLimit: 10,
    description: `/home/admin/data directoryda 7 kundan eski .log kengaytmali barcha fayllarni toping.
Ularni /backup/old-logs-$(date +%Y%m%d).tar.gz arxiviga joylashtiring.
Arxiv yaratilgandan so'ng, o'sha eski .log fayllarni o'chiring.
Yangi fayllar va boshqa kengaytmali fayllar saqlanib qolsin.`,
    hints: [
      "find buyrug'ini -mtime +7 va -name bilan ishlating",
      'tar -czf arxiv yaratish uchun',
      "find ... -delete o'chirish uchun",
    ],
    solution: `cd /home/admin/data
find . -name "*.log" -type f -mtime +7 | tar -czf /backup/old-logs-$(date +%Y%m%d).tar.gz -T -
find /home/admin/data -name "*.log" -type f -mtime +7 -delete`,
    verification: "ls -la /backup/old-logs-*.tar.gz && find /home/admin/data -name '*.log' -mtime +7",
  },
  {
    id: 21,
    domain: 'User Management',
    weight: '10%',
    weightValue: 10,
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
  },
  {
    id: 31,
    domain: 'Operation of Running Systems',
    weight: '20%',
    weightValue: 20,
    title: 'Create and Enable a Systemd Service',
    timeLimit: 12,
    description: `Quyidagi xususiyatlarga ega systemd service unit yarating:

- Service name: webapp
- Script: /opt/webapp/start.sh
- User: webdev
- WorkingDirectory: /opt/webapp
- Crash bo'lganda avtomatik restart (5 sekund kutib)
- Boot vaqtida avtomatik ishga tushsin (multi-user.target)
- network.target dan keyin ishga tushsin`,
    hints: [
      'Unit file /etc/systemd/system/webapp.service da yaratiladi',
      '[Unit], [Service], [Install] sectionlari kerak',
      'systemctl daemon-reload && systemctl enable --now webapp',
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
systemctl daemon-reload
systemctl enable --now webapp`,
    verification: 'systemctl status webapp && systemctl is-enabled webapp',
  },
  {
    id: 41,
    domain: 'Networking',
    weight: '12%',
    weightValue: 12,
    title: 'Configure Network Interface and Firewall Rules',
    timeLimit: 12,
    description: `Quyidagi network konfiguratsiyani bajaring:

1. dummy0 nomli dummy interfeys yarating
2. Unga static IP bering: 192.168.1.100/24
3. Interfeysni UP holatga keltiring
4. DNS server qo'shing: 8.8.8.8 (/etc/resolv.conf)
5. /root/firewall.sh script yarating — 22/80/443 portlarga ruxsat, default DROP`,
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
  },
  {
    id: 51,
    domain: 'Storage Management',
    weight: '13%',
    weightValue: 13,
    title: 'Filesystem Image and Persistent Mount',
    timeLimit: 12,
    description: `Quyidagi storage konfiguratsiyani bajaring:

1. /root/disk.img nomli 100MB disk image yarating
2. Uni ext4 filesystem bilan format qiling
3. /mnt/appdata mount point yarating
4. /etc/fstab ga loop option bilan yozing`,
    hints: [
      'dd if=/dev/zero of=... bs=1M count=100',
      'mkfs.ext4 fayl ustida ham ishlaydi',
      'fstab: <image> <mountpoint> ext4 loop,defaults 0 2',
    ],
    solution: `dd if=/dev/zero of=/root/disk.img bs=1M count=100
mkfs.ext4 /root/disk.img
mkdir -p /mnt/appdata
echo "/root/disk.img /mnt/appdata ext4 loop,defaults 0 2" >> /etc/fstab`,
    verification: 'blkid /root/disk.img && grep appdata /etc/fstab',
  },
  {
    id: 61,
    domain: 'Service Configuration',
    weight: '20%',
    weightValue: 20,
    title: 'Configure Scheduled Tasks',
    timeLimit: 12,
    description: `Quyidagi scheduled tasklar yarating:

1. Root crontab: har kuni 02:00 da /var/log/*.log fayllarni /backup/logs/ ga arxivlash
2. Root crontab: @reboot /opt/scripts/startup.sh
3. Systemd timer: har 15 minutda /tmp tozalash (cleanup-tmp.service + .timer)`,
    hints: [
      "(crontab -l; echo '...') | crontab -",
      '@reboot cron syntax',
      'Timer: OnCalendar=*:0/15 va WantedBy=timers.target',
    ],
    solution: `(crontab -l 2>/dev/null; \\
 echo '0 2 * * * tar -czf /backup/logs/logs-$(date +\\%Y\\%m\\%d).tar.gz /var/log/*.log'; \\
 echo '@reboot /opt/scripts/startup.sh') | crontab -
# cleanup-tmp.service va cleanup-tmp.timer fayllarini /etc/systemd/system/ da yarating`,
    verification: 'crontab -l && cat /etc/systemd/system/cleanup-tmp.timer',
  },
];
