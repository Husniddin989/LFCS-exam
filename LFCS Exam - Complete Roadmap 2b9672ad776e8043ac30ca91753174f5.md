# LFCS Exam - Complete Roadmap

Rasmiy LFCS exam structure asosida detailed roadmap:

---

## 📊 Exam Structure (100 ball)

```bash
Essential Commands:        25% (25 ball)
Operation of Running Sys:  20% (20 ball)
User and Group Management: 10% (10 ball) ⭐
Networking:               12% (12 ball)
Service Configuration:     20% (20 ball)
Storage Management:        13% (13 ball)
─────────────────────────────────────
Total:                    100% (100 ball)
Passing Score:             66%
```

---

## 🗓️ 4-Haftalik Intensive Roadmap

### **Week 1: Foundation (Essential Commands 25% + User Management 10%)**

- **Day 1-2: Essential Commands - File Operations**
    
    ```bash
    ⏰ Vaqt: 3 soat/kun
    
    📚 Topics:
    - File navigation: cd, ls, pwd
    - File operations: cp, mv, rm, mkdir, touch
    - File viewing: cat, less, more, head, tail
    - File searching: find, locate, which, whereis
    
    🎯 Practice Tasks:
    1. Find all .conf files in /etc
       find /etc -name "*.conf" -type f
    
    2. Copy directory structure
       cp -r /source /destination
    
    3. Find files larger than 100MB
       find / -type f -size +100M
    
    4. Search text in files
       grep -r "error" /var/log/
    
    ✅ Must Know Commands:
    - find (90% kerak!)
    - grep/egrep
    - tar (create, extract, compress)
    - File redirection (>, >>, <, |)
    ```
    
- **Day 3-4: Essential Commands - Text Processing**
    
    ```bash
    ⏰ Vaqt: 3 soat/kun
    
    📚 Topics:
    - Text editors: vi/vim, nano
    - Text processing: sed, awk, cut, sort, uniq
    - File comparison: diff, cmp
    - Archives: tar, gzip, bzip2, xz
    
    🎯 Practice Tasks:
    1. Extract specific column from file
       cat /etc/passwd | cut -d: -f1,6
    
    2. Sort and remove duplicates
       sort file.txt | uniq
    
    3. Replace text in file
       sed -i 's/old/new/g' file.txt
    
    4. Create compressed archive
       tar -czf backup.tar.gz /data
    
    ✅ Must Know:
    - vim (basic operations)
    - sed (find/replace)
    - tar -czf, tar -xzf
    - grep with regex
    ```
    
- **Day 5-6: User and Group Management (10%)**
    
    ```bash
    ⏰ Vaqt: 4 soat/kun
    
    📚 Topics:
    - User operations: useradd, usermod, userdel
    - Group operations: groupadd, groupmod, groupdel
    - Password management: passwd, chage
    - Sudo configuration: visudo, /etc/sudoers
    
    🎯 Practice Tasks:
    1. Create user with specific requirements
       useradd -m -d /home/john -s /bin/bash -G wheel john
       passwd john
       chage -M 90 john
    
    2. Setup sudo for specific commands
       john ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
    
    3. Lock/unlock user
       usermod -L john
       usermod -U john
    
    4. Add user to multiple groups
       usermod -aG docker,developers john
    
    ✅ Must Master:
    - useradd + all options
    - usermod -aG (add to group)
    - passwd, chage
    - visudo (sudo configuration)
    
    ```
    
- **Day 7: File Permissions & ACL**
    
    ```bash
    ⏰ Vaqt: 4 soat/kun
    
    📚 Topics:
    - Basic permissions: chmod, chown, chgrp
    - Special permissions: SUID, SGID, Sticky bit
    - ACL: setfacl, getfacl
    - umask
    
    🎯 Practice Tasks:
    1. Set permissions numerically
       chmod 755 /usr/local/bin/script.sh
       chmod 644 /etc/myapp/config.conf
    
    2. Special permissions
       chmod 4755 /usr/bin/sudo  # SUID
       chmod 2775 /shared/data   # SGID
       chmod 1777 /tmp           # Sticky bit
    
    3. ACL setup
       setfacl -m u:john:rwx /data
       setfacl -d -m u:john:rwx /data  # default
    
    4. Verify permissions
       ls -l
       getfacl /data
    
    ✅ Must Master:
    - chmod (numeric: 755, 644, 777)
    - chown user:group
    - Special bits: 4755, 2775, 1777
    - setfacl, getfacl
    ```
    

**Week 2: System Operations (20%) + Networking (12%)**

- **Day 8-9: Operation of Running Systems - Processes**
    
    ```bash
    ⏰ Vaqt: 3 soat/kun
    
    📚 Topics:
    - Process management: ps, top, htop, kill, killall
    - Job control: jobs, fg, bg, nohup, &
    - System monitoring: uptime, free, df, du
    - Log viewing: journalctl, /var/log/
    
    🎯 Practice Tasks:
    1. Find and kill process
       ps aux | grep nginx
       kill -9 PID
       killall nginx
    
    2. Run background job
       nohup long-running-command &
       jobs
       bg %1
    
    3. Monitor system resources
       top
       free -h
       df -h
       du -sh /var/*
    
    4. View logs
       journalctl -u nginx -f
       tail -f /var/log/syslog
    
    ✅ Must Know:
    - ps aux, ps -ef
    - kill, killall
    - top, htop
    - journalctl
    ```
    
- **Day 10-11: Operation of Running Systems - Boot & Kernel**
    
    ⏰ Vaqt: 3 soat/kun
    
    📚 Topics:
    
    - Boot process: GRUB, systemd targets
    - Kernel parameters: /proc, /sys, sysctl
    - System boot targets: multi-user, graphical
    - Kernel modules: lsmod, modprobe
    
    🎯 Practice Tasks:
    
    1. Change boot target
    systemctl get-default
    systemctl set-default multi-user.target
    2. Modify kernel parameters
    sysctl -w net.ipv4.ip_forward=1
    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
    3. Load kernel module
    lsmod | grep module_name
    modprobe module_name
    4. View boot messages
    dmesg | less
    journalctl -b
    
    ✅ Must Know:
    
    - systemctl (targets)
    - sysctl
    - GRUB basics
    - dmesg, journalctl -b
- **Day 12-13: Networking (12%)**
    
    ⏰ Vaqt: 4 soat/kun
    
    📚 Topics:
    
    - Network interfaces: ip, ifconfig, nmcli
    - Network configuration: /etc/network/, NetworkManager
    - DNS: /etc/resolv.conf, /etc/hosts
    - Firewall: firewalld, iptables, ufw
    - Network testing: ping, traceroute, netstat, ss
    
    🎯 Practice Tasks:
    
    1. Configure static IP (Ubuntu)
        
        # /etc/netplan/01-netcfg.yaml
        
        network:
        version: 2
        ethernets:
        eth0:
        addresses: [192.168.1.100/24]
        gateway4: 192.168.1.1
        nameservers:
        addresses: [8.8.8.8]
        
        netplan apply
        
    2. Configure static IP (RHEL/CentOS)
    nmcli con mod eth0 ipv4.addresses 192.168.1.100/24
    nmcli con mod eth0 ipv4.gateway 192.168.1.1
    nmcli con mod eth0 ipv4.dns "8.8.8.8"
    nmcli con mod eth0 ipv4.method manual
    nmcli con up eth0
    3. Firewall rules
        
        # firewalld (RHEL)
        
        firewall-cmd --permanent --add-port=80/tcp
        firewall-cmd --permanent --add-service=http
        firewall-cmd --reload
        
        # ufw (Ubuntu)
        
        ufw allow 80/tcp
        ufw enable
        
    4. Network diagnostics
    ip addr show
    ip route show
    ss -tulpn
    ping -c 4 [google.com](http://google.com/)
    traceroute [google.com](http://google.com/)
    
    ✅ Must Master:
    
    - ip addr, ip route
    - nmcli (RHEL) or netplan (Ubuntu)
    - firewall-cmd or ufw
    - ss, netstat
- **Day 14: Networking - Advanced**
    
    ```bash
    ⏰ Vaqt: 3 soat/kun
    
    📚 Topics:
    - Routing: ip route
    - Hostname: hostnamectl
    - Network bonding/teaming (basic)
    - SSH configuration
    
    🎯 Practice Tasks:
    1. Set hostname
       hostnamectl set-hostname server1.example.com
    
    2. Add static route
       ip route add 10.0.0.0/24 via 192.168.1.1
       # Permanent (RHEL):
       echo "10.0.0.0/24 via 192.168.1.1" >> /etc/sysconfig/network-scripts/route-eth0
    
    3. SSH hardening
       # /etc/ssh/sshd_config
       PermitRootLogin no
       PasswordAuthentication no
       Port 2222
       systemctl restart sshd
    
    4. Test connectivity
       telnet 192.168.1.100 80
       nc -zv 192.168.1.100 80
    
    ✅ Must Know:
    - hostnamectl
    - ip route add
    - SSH config basics
    - Port testing
    ```
    

**Week 3: Services (20%) + Storage (13%)**

- **Day 15-16: Service Configuration - Systemd**
    
    ```bash
    ⏰ Vaqt: 4 soat/kun
    
    📚 Topics:
    - systemd basics: systemctl
    - Service management: start, stop, restart, enable
    - Creating systemd units
    - Timers (systemd cron alternative)
    
    🎯 Practice Tasks:
    1. Service operations
       systemctl start nginx
       systemctl enable nginx
       systemctl status nginx
       systemctl restart nginx
       systemctl disable nginx
    
    2. Create custom service
       # /etc/systemd/system/myapp.service
       [Unit]
       Description=My Application
       After=network.target
       
       [Service]
       Type=simple
       User=myapp
       ExecStart=/usr/local/bin/myapp
       Restart=always
       
       [Install]
       WantedBy=multi-user.target
       
       systemctl daemon-reload
       systemctl enable myapp
       systemctl start myapp
    
    3. Create systemd timer
       # /etc/systemd/system/backup.timer
       [Unit]
       Description=Backup Timer
       
       [Timer]
       OnCalendar=daily
       Persistent=true
       
       [Install]
       WantedBy=timers.target
    
    4. View logs
       journalctl -u nginx
       journalctl -u nginx --since today
       journalctl -u nginx -f
    
    ✅ Must Master:
    - systemctl (all subcommands)
    - Creating .service files
    - journalctl
    - systemd timers basics
    ```
    
- **Day 17-18: Service Configuration - Web & Database**
    
    ```bash
    ⏰ Vaqt: 4 soat/kun
    
    📚 Topics:
    - HTTP: Apache, Nginx
    - Database: MariaDB/MySQL basics
    - Cron jobs
    - Time synchronization: chrony/NTP
    
    🎯 Practice Tasks:
    1. Configure Nginx virtual host
       # /etc/nginx/sites-available/example.com
       server {
           listen 80;
           server_name example.com;
           root /var/www/example.com;
           index index.html;
       }
       ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
       nginx -t
       systemctl reload nginx
    
    2. Setup cron job
       crontab -e
       0 2 * * * /usr/local/bin/backup.sh
       
       # System-wide cron
       echo "0 3 * * * root /usr/local/bin/cleanup.sh" >> /etc/cron.d/cleanup
    
    3. Configure NTP/Chrony
       # /etc/chrony/chrony.conf
       server 0.pool.ntp.org iburst
       timedatectl set-ntp true
       chronyc sources
    
    4. MariaDB basics
       mysql -u root -p
       CREATE DATABASE mydb;
       CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'password';
       GRANT ALL ON mydb.* TO 'myuser'@'localhost';
       FLUSH PRIVILEGES;
    
    ✅ Must Know:
    - Nginx/Apache basic config
    - crontab syntax
    - chrony/NTP
    - MySQL basic commands
    ```
    
- **Day 19-20: Storage Management - Partitions & LVM0**
    
    ```bash
    ⏰ Vaqt: 4 soat/kun
    
    📚 Topics:
    - Disk partitioning: fdisk, parted, gdisk
    - Filesystems: mkfs, mount, /etc/fstab
    - LVM: pvcreate, vgcreate, lvcreate
    - Swap management
    
    🎯 Practice Tasks:
    1. Create partition and filesystem
       fdisk /dev/sdb
       # n (new), p (primary), w (write)
       mkfs.ext4 /dev/sdb1
       mkdir /mnt/data
       mount /dev/sdb1 /mnt/data
       
       # Permanent mount
       echo "/dev/sdb1 /mnt/data ext4 defaults 0 0" >> /etc/fstab
    
    2. LVM setup
       # Create physical volume
       pvcreate /dev/sdb
       
       # Create volume group
       vgcreate vg_data /dev/sdb
       
       # Create logical volume
       lvcreate -L 10G -n lv_data vg_data
       
       # Format and mount
       mkfs.ext4 /dev/vg_data/lv_data
       mount /dev/vg_data/lv_data /data
    
    3. Extend LVM
       lvextend -L +5G /dev/vg_data/lv_data
       resize2fs /dev/vg_data/lv_data
    
    4. Swap configuration
       mkswap /dev/sdb2
       swapon /dev/sdb2
       echo "/dev/sdb2 none swap defaults 0 0" >> /etc/fstab
    
    ✅ Must Master:
    - fdisk/parted
    - mkfs (ext4, xfs)
    - LVM complete workflow
    - /etc/fstab syntax
    ```
    
- **Day 21: Storage Management - Advanced**
    
    ```bash
    ⏰ Vaqt: 3 soat/kun
    
    📚 Topics:
    - RAID basics
    - NFS client/server
    - File compression
    - Disk quotas
    
    🎯 Practice Tasks:
    1. NFS server setup
       # Server
       apt install nfs-kernel-server
       echo "/share 192.168.1.0/24(rw,sync,no_subtree_check)" >> /etc/exports
       exportfs -a
       systemctl restart nfs-server
       
       # Client
       mount 192.168.1.10:/share /mnt/nfs
       echo "192.168.1.10:/share /mnt/nfs nfs defaults 0 0" >> /etc/fstab
    
    2. Disk quota
       # Enable quota
       quotacheck -cum /home
       quotaon /home
       
       # Set quota
       edquota -u john
    
    3. File compression
       tar -czf archive.tar.gz /data
       tar -xzf archive.tar.gz
    
    ✅ Must Know:
    - NFS mount
    - Basic RAID concepts
    - tar with compression
    ```
    

**Week 4: Review & Practice Exams**

- **Day 22-23: Mock Exam 1 & Review**
    
    ```bash
    ⏰ Vaqt: 5 soat/kun
    
    🎯 Full Mock Exam (2 hours):
    Simulate real exam:
    - 24 tasks
    - 2 hours time limit
    - No Google, only man pages
    
    Review wrong answers:
    - Identify weak areas
    - Practice those topics again
    - Make notes of common mistakes
    ```
    
- **Day 24-25: Mock Exam 2 & Weak Areas**
    
    ```bash
    ⏰ Vaqt: 5 soat/kun
    
    🎯 Second Mock Exam
    Focus on:
    - Time management
    - Verification of answers
    - Command accuracy
    
    Deep dive into weak areas identified
    ```
    
- **Day 26-27: Mock Exam 3 & Speed Practice**
    
    ```bash
    ⏰ Vaqt: 5 soat/kun
    
    🎯 Third Mock Exam
    Goals:
    - Complete in 90 minutes
    - 80%+ score
    - Zero verification errors
    
    Speed practice on common tasks:
    - User creation: < 2 min
    - Permission fix: < 1 min
    - Service config: < 3 min
    ```
    
- **Day 28: Final Review**
    
    ```bash
    ⏰ Vaqt: 4 soat
    
    📝 Review Checklist:
    ✅ All commands memorized
    ✅ Common scenarios practiced
    ✅ Verification steps remembered
    ✅ Man page navigation quick
    
    🧘 Mental preparation:
    - Read exam tips
    - Relax, sleep well
    - Confidence building
    ```
    
- **📚 Daily Practice Routine**

```bash
Morning (1 hour):
- Man pages o'qish (3-5 commands)
- Flashcard review
- Previous day recap

Afternoon (2-3 hours):
- New topics learning
- Hands-on practice
- Lab exercises

Evening (1 hour):
- Quiz/MCQ
- Command practice (speed)
- Note-taking
```

**🛠️ Practice Environment Setup**

**Option 1: VirtualBox (Recommended)**

```bash
1. Install VirtualBox
2. Create 2 VMs:
   - VM1: Ubuntu 22.04 LTS
   - VM2: RHEL 9 / Rocky Linux 9
3. Snapshot before practice
4. Practice, break, restore snapshot
```

**Option 2: Docker**

```bash
# Quick test environment
docker run -it --rm ubuntu:22.04 /bin/bash
docker run -it --rm rockylinux:9 /bin/bash
```

**Option 3: Cloud (Free Tier)**

```bash
- AWS EC2 Free Tier
- Google Cloud Free Tier
- Azure Free Tier
```

---

## 📊 Progress Tracking

### **Weekly Goals:**
| Week | Focus | Target Score |
|------|-------|-------------|
| Week 1 | Essential Commands + Users | 60% |
| Week 2 | System Ops + Networking | 70% |
| Week 3 | Services + Storage | 75% |
| Week 4 | Mock Exams | 80%+ |

### **Daily Checklist:**
```
□ New commands practiced: ___ /10
□ Lab exercises completed: ___ /5
□ Mock questions solved: ___ /20
□ Man pages read: ___ /3
□ Notes updated: Yes/No
```

---

## 🎯 Exam Day Strategy

### **Before Exam:**
```
✅ Read all questions first (5 min)
✅ Prioritize easy tasks
✅ Skip difficult, return later
✅ ALWAYS verify your answers
```

### **Time Management:**
```
- Easy tasks (50%): 45 min
- Medium tasks (30%): 45 min
- Hard tasks (20%): 30 min
- Verification: 20 min
```

**Verification Commands:**

```bash
# User created?
id username

# Service running?
systemctl status servicename

# File permission correct?
ls -l filename

# Mount successful?
df -h | grep mountpoint

# Firewall rule added?
firewall-cmd --list-all
```

## 📖 Resources

### **Official:**

- Linux Foundation LFCS page
- Man pages (exam'da available!)

### **Practice:**

- KodeKloud LFCS course
- Acloud.guru LFCS
- Udemy: Mumshad Mannambeth

### **Free:**

- Linux Journey
- OverTheWire (command practice)
- HackerRank Linux Shell

**💪 Final Tips**

```bash
Success Formula:
  Practice: 70%
  Theory: 20%
  Mock Exams: 10%
  
Key to Success:
  - Hands-on > Reading
  - Speed matters
  - Verify everything
  - Man pages are your friend
  - Stay calm under pressure

Common Mistakes to Avoid:
  - Not verifying answers
  - Spending too much time on one task
  - Forgetting sudo
  - Typos in commands
  - Not reading questions carefully
```

---

## ✅ Exam Ready Checklist
```
□ Can create users in < 2 min
□ Can configure permissions in < 1 min
□ Can setup systemd service in < 5 min
□ Can configure network in < 5 min
□ Can setup LVM in < 10 min
□ Can troubleshoot services quickly
□ Know 50+ essential commands by heart
□ Can navigate man pages efficiently
□ Completed 3+ full mock exams
□ Scored 75%+ consistently
```