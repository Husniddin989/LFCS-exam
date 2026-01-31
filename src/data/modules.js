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
        duration: "35 min",
        content: `
## Linux Filesystem Hierarchy Standard (FHS)

Linux'da barcha narsalar **fayl** sifatida ko'riladi — oddiy fayllar, directorylar, devices, socketlar, pipes va boshqalar. Bu Unix falsafasining asosiy prinsipidir.

### Asosiy Directorylar (Batafsil)

| Directory | Tavsif | Real Production Misollari | Mount Point? |
|-----------|--------|-------------------------|--------------|
| \`/\` | Root directory — barcha narsaning boshlanishi | Sistemaning asosi | ✅ (har doim) |
| \`/bin\` | Essential user binaries (symlink to /usr/bin) | \`ls\`, \`cp\`, \`cat\`, \`bash\`, \`grep\` | ❌ |
| \`/sbin\` | System binaries (root privileges kerak) | \`fsck\`, \`reboot\`, \`iptables\`, \`mkfs\` | ❌ |
| \`/etc\` | Configuration files | \`/etc/nginx/nginx.conf\`, \`/etc/hosts\` | ❌ |
| \`/home\` | User home directories | \`/home/admin\`, \`/home/developer\` | ✅ (odatda) |
| \`/root\` | Root user's home directory | Root'ning .bashrc, .ssh/ | ❌ |
| \`/var\` | Variable data (growing files) | Logs, databases, cache, mail spool | ✅ (tavsiya) |
| \`/tmp\` | Temporary files (reboot'da o'chadi) | Session data, temp uploads | ✅ (tmpfs) |
| \`/usr\` | User programs & read-only data | Applications, libraries, docs | ❌ |
| \`/usr/local\` | Locally installed software | Custom compiled apps | ❌ |
| \`/opt\` | Third-party/vendor software | \`/opt/google/chrome\`, \`/opt/app\` | ✅ (katta apps) |
| \`/proc\` | Process & kernel info (virtual FS) | \`/proc/cpuinfo\`, \`/proc/meminfo\` | Auto |
| \`/sys\` | System & hardware info (virtual) | \`/sys/class/net/eth0/\` | Auto |
| \`/dev\` | Device files | \`/dev/sda\`, \`/dev/null\`, \`/dev/random\` | Auto |
| \`/boot\` | Boot loader files (kernel, initramfs) | \`/boot/vmlinuz-*\`, \`/boot/grub/\` | ✅ (ayrı) |
| \`/lib\` | Essential shared libraries | \`libc.so.6\`, kernel modules | ❌ |
| \`/mnt\` | Temporary mount point | Manual mount uchun | ❌ |
| \`/media\` | Removable media | \`/media/usb\`, \`/media/cdrom\` | Auto |
| \`/srv\` | Service data | \`/srv/www\`, \`/srv/ftp\` | ✅ (data) |
| \`/run\` | Runtime data (tmpfs) | PID files, sockets | Auto |

### Production'da Eng Ko'p Ishlatiladigan Pathlar

#### Web Servers
\`\`\`bash
# Nginx
/etc/nginx/nginx.conf          # Main config
/etc/nginx/sites-available/    # Available sites
/etc/nginx/sites-enabled/      # Enabled sites (symlinks)
/var/log/nginx/access.log      # Access logs
/var/log/nginx/error.log       # Error logs
/var/www/html/                 # Default web root

# Apache
/etc/apache2/apache2.conf      # RHEL: /etc/httpd/conf/httpd.conf
/etc/apache2/sites-available/
/var/log/apache2/              # RHEL: /var/log/httpd/
\`\`\`

#### System Logs (Asosiy)
\`\`\`bash
/var/log/syslog                # Debian/Ubuntu - main system log
/var/log/messages              # RHEL/CentOS - system messages
/var/log/auth.log              # Authentication (Debian)
/var/log/secure                # Authentication (RHEL)
/var/log/kern.log              # Kernel messages
/var/log/dmesg                 # Boot messages
/var/log/cron                  # Cron job logs
/var/log/mail.log              # Mail server logs

# Application logs
/var/log/mysql/error.log
/var/log/postgresql/
/var/log/redis/redis-server.log
\`\`\`

#### Systemd & Services
\`\`\`bash
/etc/systemd/system/           # Custom unit files
/usr/lib/systemd/system/       # Package unit files
/etc/systemd/system/multi-user.target.wants/  # Enabled services

# View service logs
journalctl -u nginx.service
journalctl -u ssh.service -f   # Follow mode
\`\`\`

#### Networking
\`\`\`bash
/etc/hosts                     # Static hostname mapping
/etc/resolv.conf               # DNS servers
/etc/network/interfaces        # Debian network config
/etc/sysconfig/network-scripts/ifcfg-eth0  # RHEL
/etc/netplan/*.yaml            # Ubuntu 18.04+ (netplan)
/etc/ssh/sshd_config           # SSH server config
/etc/ssh/ssh_config            # SSH client config
\`\`\`

#### Package Management
\`\`\`bash
# Debian/Ubuntu (APT)
/etc/apt/sources.list          # Repository list
/etc/apt/sources.list.d/       # Additional repos
/var/lib/apt/lists/            # Package cache
/var/cache/apt/archives/       # Downloaded .deb files

# RHEL/CentOS (YUM/DNF)
/etc/yum.repos.d/              # Repository configs
/var/cache/yum/                # YUM cache
/var/lib/rpm/                  # RPM database
\`\`\`

#### User & Authentication
\`\`\`bash
/etc/passwd                    # User account info (NOT passwords!)
/etc/shadow                    # Actual password hashes (root only)
/etc/group                     # Group definitions
/etc/sudoers                   # Sudo permissions
/etc/sudoers.d/                # Modular sudo configs
/home/user/.ssh/authorized_keys # SSH public keys
\`\`\`

### Muhim Tushunchalar (Advanced)

#### 1. Everything is a File
\`\`\`bash
# Regular file
-rw-r--r-- 1 user user 1234 Jan 30 file.txt

# Directory (also a file!)
drwxr-xr-x 2 user user 4096 Jan 30 mydir/

# Symbolic link
lrwxrwxrwx 1 user user 10 Jan 30 link -> /path/to/file

# Block device (disk)
brw-rw---- 1 root disk 8, 0 Jan 30 /dev/sda

# Character device (terminal)
crw--w---- 1 user tty 136, 0 Jan 30 /dev/pts/0

# Named pipe (FIFO)
prw-r--r-- 1 user user 0 Jan 30 mypipe

# Socket
srwxrwxrwx 1 user user 0 Jan 30 /run/docker.sock
\`\`\`

#### 2. Absolute vs Relative Paths
\`\`\`bash
# Absolute path — har doim / dan boshlanadi
cd /home/admin/projects/app
pwd
# Output: /home/admin/projects/app

# Relative path — current directory'ga nisbatan
cd ../data              # Parent directory ichidagi data/
cd ./config            # Current directory ichidagi config/
cd ~                   # Home directory
cd -                   # Previous directory
\`\`\`

#### 3. Hidden Files
\`\`\`bash
# . bilan boshlangan fayllar "hidden"
ls -a                  # Show all (including hidden)
ls -A                  # Show all except . and ..

# Common hidden files
~/.bashrc              # Bash config (user-specific)
~/.ssh/                # SSH keys & config
~/.vimrc               # Vim editor config
~/.gitconfig           # Git global config
~/.profile             # Login shell config
\`\`\`

#### 4. Special Directories
\`\`\`bash
.                      # Current directory
..                     # Parent directory
~                      # User's home directory
-                      # Previous directory (cd -)

# Examples
cp file.txt .          # Copy to current dir
cd ..                  # Go up one level
ls ~/Documents         # List home/Documents
cd -                   # Return to previous dir
\`\`\`

### Virtual Filesystems (Advanced Troubleshooting)

#### /proc — Process & Kernel Info
\`\`\`bash
# CPU info
cat /proc/cpuinfo
grep -c processor /proc/cpuinfo  # CPU count

# Memory info
cat /proc/meminfo
free -h                          # Human-readable

# Current processes
ls -la /proc/                    # Each number = PID
cat /proc/1234/cmdline           # Process 1234 command
cat /proc/1234/status            # Process status
cat /proc/1234/limits            # Process limits

# Network
cat /proc/net/dev                # Network interfaces
cat /proc/net/tcp                # TCP connections

# System info
cat /proc/version                # Kernel version
cat /proc/uptime                 # System uptime
cat /proc/loadavg                # Load average
\`\`\`

#### /sys — Hardware & Kernel Parameters
\`\`\`bash
# Block devices
ls /sys/block/                   # sda, sdb, etc.
cat /sys/block/sda/size          # Disk size (sectors)

# Network interfaces
ls /sys/class/net/               # eth0, wlan0, etc.
cat /sys/class/net/eth0/address  # MAC address
cat /sys/class/net/eth0/operstate # up/down

# Power management
cat /sys/class/power_supply/BAT0/capacity  # Battery %
\`\`\`

### Common Production Scenarios

#### Scenario 1: Disk Full — /var Partition
\`\`\`bash
# Problem: Application can't write logs
df -h                            # Check disk usage
# Output: /var is 100% full

# Find largest directories
du -sh /var/* | sort -rh | head -10

# Solution: Clean old logs
find /var/log -name "*.log" -mtime +30 -delete
find /var/log -name "*.gz" -mtime +90 -delete

# Rotate logs immediately
logrotate -f /etc/logrotate.conf
\`\`\`

#### Scenario 2: Config File Missing
\`\`\`bash
# Problem: nginx won't start
systemctl start nginx
# Error: config file not found

# Check expected location
ls -la /etc/nginx/nginx.conf

# If missing, restore from package
apt-get install --reinstall nginx-core  # Debian
yum reinstall nginx                     # RHEL
\`\`\`

#### Scenario 3: Permission Denied
\`\`\`bash
# Problem: can't read /var/log/syslog
cat /var/log/syslog
# Permission denied

# Check ownership
ls -l /var/log/syslog
# -rw-r----- 1 syslog adm 123456 Jan 30 syslog

# Solution: add user to adm group
sudo usermod -aG adm username
# Re-login to apply
\`\`\`

### Best Practices for LFCS

1. **Memorize key paths:**
   - \`/etc/\` — configs
   - \`/var/log/\` — logs
   - \`/var/www/\` — web data
   - \`/etc/systemd/system/\` — services

2. **Use tab completion:**
   - Type \`cd /etc/net<TAB>\` → auto-completes

3. **Quick navigation:**
   - \`cd -\` — toggle between two directories
   - \`pushd /path\` and \`popd\` — directory stack

4. **Check before you delete:**
   - \`ls /path/*\` before \`rm -rf /path/*\`

> **LFCS Exam Tip:** You'll be asked "Where is the config file for X service?" — Answer is almost always \`/etc/service-name/\`. Example: Nginx → \`/etc/nginx/\`, SSH → \`/etc/ssh/\`

### Distribution Differences

| Aspect | Debian/Ubuntu | RHEL/CentOS/Alma |
|--------|---------------|------------------|
| Main log | \`/var/log/syslog\` | \`/var/log/messages\` |
| Auth log | \`/var/log/auth.log\` | \`/var/log/secure\` |
| Network config | \`/etc/network/\` or \`/etc/netplan/\` | \`/etc/sysconfig/network-scripts/\` |
| Apache config | \`/etc/apache2/\` | \`/etc/httpd/\` |
| Apache binary | \`apache2\` | \`httpd\` |

### Quick Reference Commands

\`\`\`bash
# Navigate filesystem
pwd                    # Print working directory
cd /path               # Change directory
ls -la                 # List all with details
tree /path             # Visual tree (install: apt install tree)

# Disk usage
df -h                  # Filesystem usage
du -sh /path           # Directory size
du -sh * | sort -rh    # Largest items first

# Find files
find / -name "*.conf" 2>/dev/null
locate nginx.conf      # Fast search (updatedb first)

# File types
file /path/to/file     # Determine file type
stat /path/to/file     # Detailed file info
\`\`\`
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
        duration: "40 min",
        content: `
## Find Command — Linux Admin's Best Friend

\`find\` — Linux admin'ning eng kuchli quroli. Production'da har kuni ishlatasiz: disk cleanup, security audit, file search, bulk operations.

### Asosiy Sintaksis

\`\`\`bash
find [path...] [expression]

# Expression consists of:
# - Tests: -name, -type, -size, -mtime, -perm
# - Actions: -print, -exec, -delete
# - Operators: -and, -or, -not
\`\`\`

### Part 1: Basic Tests

#### By Name
\`\`\`bash
# Exact name
find /var/log -name "syslog"

# Pattern (case-sensitive)
find / -name "*.conf" 2>/dev/null

# Case-insensitive
find /etc -iname "*.CONF"

# Regex pattern
find /etc -regex ".*/host.*"

# NOT matching pattern
find /var -not -name "*.log"
\`\`\`

#### By Type
\`\`\`bash
find /path -type f      # Regular files
find /path -type d      # Directories
find /path -type l      # Symbolic links
find /path -type s      # Sockets
find /path -type p      # Named pipes (FIFO)
find /path -type b      # Block devices
find /path -type c      # Character devices
\`\`\`

#### By Size
\`\`\`bash
# Size units: c=bytes, k=KB, M=MB, G=GB
find / -size +100M      # Larger than 100MB
find / -size -1k        # Smaller than 1KB
find / -size 50M        # Exactly 50MB (rare)

# Range
find / -size +50M -size -100M  # Between 50-100MB

# Empty files
find /tmp -type f -empty
\`\`\`

#### By Time (mtime, atime, ctime)
\`\`\`bash
# mtime — Modified time (content changed)
find /var/log -mtime -1      # Last 24 hours
find /var/log -mtime +30     # Older than 30 days
find /var/log -mtime 7       # Exactly 7 days ago

# mmin — Minutes
find /var/log -mmin -60      # Last 60 minutes
find /var/log -mmin +120     # Older than 2 hours

# atime — Access time (read)
find /home -atime +365       # Not accessed in a year

# ctime — Change time (metadata: permissions, owner)
find /etc -ctime -1          # Metadata changed last 24h

# Newer than a reference file
find /etc -newer /tmp/reference.txt
\`\`\`

#### By Permissions
\`\`\`bash
# Exact permission
find /home -perm 644         # Exactly 644
find /home -perm 0644        # Same (leading 0)

# At least these bits (-mode)
find / -perm -4000           # SUID bit set
find / -perm -2000           # SGID bit set
find / -perm -1000           # Sticky bit set

# Any of these bits (/mode)
find / -perm /u+s,g+s        # SUID OR SGID

# Readable by everyone
find / -perm -004

# Writable by group or others (security risk!)
find / -perm -022

# World-writable (danger!)
find / -perm -0002 -type f
\`\`\`

#### By Owner & Group
\`\`\`bash
# By user
find /home -user admin
find / -user 1000            # By UID

# By group
find /var -group www-data
find / -group 33             # By GID

# No owner (deleted user)
find / -nouser

# No group (deleted group)
find / -nogroup
\`\`\`

### Part 2: Real Production Scenarios

#### Scenario 1: Disk Space Emergency
\`\`\`bash
# Server alert: /var is 95% full
df -h | grep /var
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda2        20G   19G  500M  95% /var

# Find top 20 largest files in /var
find /var -type f -printf '%s %p\\n' 2>/dev/null | \\
  sort -rn | head -20 | awk '{print $1/1024/1024 " MB\\t" $2}'

# Alternative with exec
find /var -type f -size +50M -exec ls -lh {} \\; 2>/dev/null | \\
  awk '{print $5 "\\t" $9}' | sort -rh | head -20

# Find and summarize by directory
du -sh /var/* | sort -rh | head -10

# Often the culprits:
# - /var/log/ — old logs not rotated
# - /var/cache/ — package cache
# - /var/tmp/ — temp files
# - /var/lib/docker/ — Docker images/containers
\`\`\`

#### Scenario 2: Log Cleanup (Safe Production Method)
\`\`\`bash
# ⚠️ NEVER just delete running log files!
# Wrong: rm /var/log/app.log → service still has file handle open

# Method 1: Truncate (safe for running services)
find /var/log -name "*.log" -type f -size +1G -exec truncate -s 0 {} \\;

# Method 2: Cat /dev/null (same effect)
find /var/log -name "*.log" -type f -size +1G -exec sh -c '> "$1"' _ {} \\;

# Method 3: Delete old compressed logs (safe)
find /var/log -name "*.log.gz" -mtime +90 -delete
find /var/log -name "*.log.*.gz" -mtime +90 -delete

# Method 4: Archive before delete
find /var/log -name "*.log" -mtime +30 -exec tar -rvf /backup/old-logs.tar {} \\; -delete
\`\`\`

#### Scenario 3: Security Audit — Find Vulnerabilities
\`\`\`bash
# SUID/SGID files (can escalate privileges)
find / -type f \\( -perm -4000 -o -perm -2000 \\) -exec ls -ldb {} \\; 2>/dev/null

# Common legitimate SUID binaries:
# /usr/bin/passwd, /usr/bin/sudo, /usr/bin/su
# Suspicious: anything in /tmp, /home, /var

# World-writable files (anyone can modify)
find / -type f -perm -0002 ! -path "/proc/*" ! -path "/sys/*" 2>/dev/null

# World-writable directories WITHOUT sticky bit (danger!)
find / -type d -perm -0002 ! -perm -1000 2>/dev/null

# Files with no owner (orphaned)
find / -nouser -o -nogroup 2>/dev/null

# Recently modified system files (potential breach)
find /etc /bin /sbin /usr/bin -type f -mtime -2 2>/dev/null

# Check for suspicious scripts in tmp
find /tmp -type f \\( -name "*.sh" -o -name "*.py" \\) -exec ls -la {} \\;
\`\`\`

#### Scenario 4: Find Recently Changed Configs
\`\`\`bash
# Debugging: "System worked yesterday, now broken"

# Files modified in last 24 hours
find /etc -type f -mtime -1 -exec ls -lt {} + | head -20

# Files changed in last 2 hours
find /etc -type f -mmin -120 -exec ls -lt {} +

# Compare with backup
find /etc -newer /backup/snapshot.timestamp

# Who changed what (if you have audit logs)
ausearch -f /etc/nginx/nginx.conf
\`\`\`

#### Scenario 5: Find & Fix Permissions (Bulk)
\`\`\`bash
# Web root security: files 644, dirs 755
find /var/www/html -type f -exec chmod 644 {} \\;
find /var/www/html -type d -exec chmod 755 {} \\;

# Or faster with xargs:
find /var/www/html -type f -print0 | xargs -0 chmod 644
find /var/www/html -type d -print0 | xargs -0 chmod 755

# Fix ownership
find /var/www/html -exec chown www-data:www-data {} \\;

# Remove execute bit from all files (except scripts)
find /data -type f ! -name "*.sh" -exec chmod -x {} \\;
\`\`\`

#### Scenario 6: Find & Replace in Files
\`\`\`bash
# Find all PHP files with old API endpoint
find /var/www -name "*.php" -exec grep -l "old-api.com" {} \\;

# Replace in all files (BACKUP FIRST!)
find /var/www -name "*.php" -exec sed -i 's/old-api\\.com/new-api.com/g' {} \\;

# Find and count occurrences
find /var/www -name "*.php" -exec grep -o "old-api.com" {} \\; | wc -l
\`\`\`

### Part 3: Advanced Find Techniques

#### Combining Conditions (Boolean Logic)
\`\`\`bash
# AND (default, or explicit -and)
find /var/log -name "*.log" -size +100M  # Both conditions

# OR
find /var -name "*.log" -o -name "*.txt"

# NOT
find /var -not -name "*.log"
find /var ! -name "*.log"             # Same

# Complex: (A OR B) AND C
find /var \\( -name "*.log" -o -name "*.txt" \\) -size +10M

# Files modified today but NOT by root
find /etc -mtime -1 ! -user root
\`\`\`

#### Using -exec Effectively
\`\`\`bash
# {} is replaced with found filename
find /path -name "*.log" -exec echo "Found: {}" \\;

# {} can appear multiple times
find /path -name "*.conf" -exec cp {} {}.backup \\;

# -exec vs -exec {} + (batch mode - faster!)
find /path -name "*.log" -exec rm {} \\;       # Runs rm once per file
find /path -name "*.log" -exec rm {} +        # Runs rm with multiple args

# Execute shell commands
find /path -name "*.log" -exec sh -c 'echo "Processing $1"; wc -l "$1"' _ {} \\;

# Confirm before each action
find /path -name "*.log" -ok rm {} \\;         # Asks y/n for each file
\`\`\`

#### Using xargs (Better Performance)
\`\`\`bash
# Problem: filenames with spaces/newlines
find /path -name "*.log" | xargs rm            # ❌ Breaks on spaces

# Solution: -print0 and xargs -0
find /path -name "*.log" -print0 | xargs -0 rm  # ✅ Safe

# Parallel execution with xargs -P
find /var/log -name "*.log.gz" -print0 | xargs -0 -P 4 gunzip

# Process in batches
find /data -name "*.txt" -print0 | xargs -0 -n 100 tar -rvf archive.tar
\`\`\`

#### Optimizing Find Performance
\`\`\`bash
# Stop after first match
find /etc -name "passwd" -quit

# Limit depth (don't recurse too deep)
find /var -maxdepth 2 -name "*.log"
find /home -mindepth 2 -maxdepth 3 -name "*.sh"

# Exclude directories
find / -path /proc -prune -o -name "*.conf" -print
find / -path /sys -prune -o -path /proc -prune -o -name "*.log" -print

# Use -O for optimization
find -O3 / -name "*.log"  # Level 1-3
\`\`\`

### Part 4: Find vs Locate

| Aspect | find | locate |
|--------|------|--------|
| Speed | Slow (real-time) | Fast (uses DB) |
| Accuracy | Always current | Depends on updatedb |
| Permissions | Sees what you can access | Shows all (if DB built by root) |
| Disk I/O | High | Low |
| Use case | Critical/recent files | Quick lookups |

\`\`\`bash
# Locate usage
updatedb                          # Update DB (run as root)
locate nginx.conf                 # Find all paths
locate -i readme                  # Case-insensitive
locate -c "*.conf"                # Count results
locate -r '/etc/.*\\.conf$'        # Regex

# Locate DB is here:
/var/lib/mlocate/mlocate.db       # or /var/lib/plocate/plocate.db
\`\`\`

### Common Mistakes to Avoid

\`\`\`bash
# ❌ Forgetting quotes (shell expands * before find sees it)
find /var -name *.log              # Wrong
find /var -name "*.log"            # Correct

# ❌ Wrong -exec syntax (missing \\;)
find /path -exec ls {}             # Wrong
find /path -exec ls {} \\;          # Correct

# ❌ Deleting without testing first
find /var -name "*.log" -delete    # Dangerous!
# Better:
find /var -name "*.log"            # Review first
find /var -name "*.log" -delete    # Then delete

# ❌ Not handling stderr (too much noise)
find / -name "*.conf"              # Permission denied spam
find / -name "*.conf" 2>/dev/null  # Clean output

# ❌ Using rm in a pipe
find /path -name "*.log" | rm      # Doesn't work!
find /path -name "*.log" | xargs rm  # Works
\`\`\`

### LFCS Exam Tips

**Common tasks you WILL see:**

1. "Find all files larger than 100MB in /var"
   \`\`\`bash
   find /var -type f -size +100M 2>/dev/null
   \`\`\`

2. "Find and delete files older than 30 days in /tmp"
   \`\`\`bash
   find /tmp -type f -mtime +30 -delete
   \`\`\`

3. "Find all SUID files"
   \`\`\`bash
   find / -type f -perm -4000 2>/dev/null
   \`\`\`

4. "Find files changed in last 24 hours in /etc"
   \`\`\`bash
   find /etc -type f -mtime -1 2>/dev/null
   \`\`\`

5. "Find and change ownership of all files in /data"
   \`\`\`bash
   find /data -exec chown user:group {} \\;
   \`\`\`

> **Time-saving trick:** In the exam, use tab completion and history (Ctrl+R) to avoid typos!

### Quick Reference Card

\`\`\`bash
# Name
find / -name "file.txt"
find / -iname "*.conf"           # Case-insensitive

# Size
find / -size +100M               # > 100MB
find / -size -1k                 # < 1KB
find / -empty                    # Empty files/dirs

# Time
find / -mtime -1                 # Last 24h
find / -mtime +30                # >30 days ago
find / -mmin -60                 # Last hour

# Type
find / -type f                   # Files
find / -type d                   # Directories
find / -type l                   # Symlinks

# Permissions
find / -perm 644                 # Exact
find / -perm -4000               # SUID
find / -perm -0002               # World-writable

# Owner
find / -user admin
find / -group www-data
find / -nouser                   # Orphaned

# Actions
find / -name "*.log" -delete
find / -name "*.conf" -exec cat {} \\;
find / -name "*.txt" -exec rm {} +
find / -name "*.log" -print0 | xargs -0 gzip
\`\`\`
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
        title: "Grep & Text Processing — Production Mastery",
        type: "theory",
        duration: "50 min",
        content: `
## Grep & Text Processing — Log Analysis Essentials

Production'da log analysis — kundalik ish. Har kuni: "Why is the server slow?", "Who accessed this?", "When did this error start?". Javob: \`grep\`, \`awk\`, \`sed\`, \`cut\`, \`sort\`, \`uniq\`.

### Part 1: Grep — Pattern Matching Master

#### Basic Grep
\`\`\`bash
# Simple search
grep "error" /var/log/syslog

# Case-insensitive (90% of the time you want this)
grep -i "error" /var/log/syslog

# Whole word only (avoid partial matches)
grep -w "error" /var/log/syslog     # Matches "error", not "errorHandler"

# Line numbers (debugging)
grep -n "failed login" /var/log/auth.log

# Count matches
grep -c "ERROR" /var/log/app.log

# Show only matching part
grep -o "ERROR" /var/log/app.log | wc -l

# Recursive search in directory
grep -r "TODO" /var/www/
grep -r "password" /etc/ 2>/dev/null

# Recursive with specific file types
grep -r --include="*.php" "mysql_connect" /var/www/

# Exclude directories
grep -r --exclude-dir={.git,node_modules} "API_KEY" /var/www/
\`\`\`

#### Context (See Surrounding Lines)
\`\`\`bash
# Context is CRITICAL for understanding errors

# 3 lines after each match
grep -A 3 "Exception" app.log

# 2 lines before each match
grep -B 2 "FATAL" app.log

# 2 before, 3 after (or -C 2 for 2 both sides)
grep -A 3 -B 2 "error" app.log

# Example: Find error with stacktrace
grep -A 20 "NullPointerException" catalina.out
\`\`\`

#### Inverse Match (Show What DOESN'T Match)
\`\`\`bash
# Remove INFO/DEBUG noise
grep -v "INFO" /var/log/app.log
grep -v -e "INFO" -e "DEBUG" /var/log/app.log

# Multiple excludes
grep -v "INFO" app.log | grep -v "DEBUG"

# Show all except comments
grep -v "^#" /etc/nginx/nginx.conf

# Show only errors (exclude INFO, DEBUG, WARN)
grep -v -E "INFO|DEBUG|WARN" app.log
\`\`\`

#### Files & Filenames
\`\`\`bash
# Show only filenames (not content)
grep -l "error" /var/log/*.log       # Files WITH match
grep -L "success" /var/log/*.log     # Files WITHOUT match

# Show filename with each match
grep -H "error" /var/log/*.log

# Suppress filename (useful with single file)
grep -h "error" /var/log/syslog
\`\`\`

### Part 2: Regex — Extended Grep

\`\`\`bash
# Basic regex (BRE) vs Extended regex (ERE)
grep "error\\|warning" file.log      # BRE (need escaping)
grep -E "error|warning" file.log     # ERE (easier)
egrep "error|warning" file.log       # Same as grep -E
\`\`\`

#### Common Regex Patterns
\`\`\`bash
# IP addresses
grep -E "([0-9]{1,3}\\.){3}[0-9]{1,3}" access.log
grep -oE "([0-9]{1,3}\\.){3}[0-9]{1,3}" access.log  # Only IPs

# Email addresses
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" file.txt

# URLs
grep -E "https?://[a-zA-Z0-9./?=_%:-]*" file.txt

# Credit card (simple - NOT for real validation!)
grep -E "[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}" file.txt

# MAC addresses
grep -E "([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}" file.txt

# Dates (YYYY-MM-DD)
grep -E "[0-9]{4}-[0-9]{2}-[0-9]{2}" file.txt

# Phone numbers (US format)
grep -E "\\(?[0-9]{3}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}" file.txt
\`\`\`

#### Regex Anchors & Boundaries
\`\`\`bash
# Start of line
grep "^error" file.log               # Lines starting with "error"
grep "^$" file.txt                   # Empty lines
grep "^#" config.conf                # Comment lines

# End of line
grep "failed$" file.log              # Lines ending with "failed"

# Whole line
grep "^ERROR: Database connection failed$" log.txt

# Word boundary
grep -w "cat" file.txt               # Matches "cat", not "catalog"
grep "\\bcat\\b" file.txt             # Same with BRE
\`\`\`

#### Character Classes
\`\`\`bash
# Any digit
grep "[0-9]" file.txt
grep "[[:digit:]]" file.txt

# Any letter
grep "[a-zA-Z]" file.txt
grep "[[:alpha:]]" file.txt

# Alphanumeric
grep "[[:alnum:]]" file.txt

# Whitespace
grep "[[:space:]]" file.txt

# Negation
grep "[^0-9]" file.txt               # NOT a digit
\`\`\`

### Part 3: Real Production Scenarios

#### Scenario 1: Web Server Attack Detection
\`\`\`bash
# Find SQL injection attempts
grep -i "union.*select\\|drop.*table\\|/etc/passwd" /var/log/nginx/access.log

# Find XSS attempts
grep -i "<script" /var/log/nginx/access.log

# Find admin panel brute force
grep "POST /admin/login" /var/log/nginx/access.log | \\
  awk '{print $1}' | sort | uniq -c | sort -rn

# Suspicious user agents
grep -i "bot\\|scanner\\|crawler\\|spider" access.log | grep -v -i "googlebot"

# Find 404 errors (might be probing for vulnerabilities)
grep '" 404 ' /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn
\`\`\`

#### Scenario 2: Application Error Analysis
\`\`\`bash
# Count errors by type
grep -oE "(NullPointerException|SQLException|IOException)" app.log | \\
  sort | uniq -c | sort -rn

# Find when errors started
grep "Exception" app.log | head -1

# Error frequency over time
grep "ERROR" app.log | awk '{print $1, $2}' | cut -d: -f1 | uniq -c

# Find specific user's errors
grep "userId=12345" app.log | grep "ERROR"

# Errors with stack traces (with context)
grep -A 50 "Exception" app.log > /tmp/exceptions.txt
\`\`\`

#### Scenario 3: Performance Issues
\`\`\`bash
# Find slow queries (>1000ms)
grep "Query took" /var/log/mysql/slow.log | \\
  awk -F'took ' '{print $2}' | awk '{if($1>1000) print}' | wc -l

# Find high memory usage events
grep -i "out of memory\\|oom" /var/log/syslog

# Find disk full warnings
grep -i "no space left\\|disk full" /var/log/syslog

# Find segfaults (crashes)
grep "segfault" /var/log/syslog
\`\`\`

### Part 4: Awk — The Ultimate Text Processor

#### Awk Basics
\`\`\`bash
# Print specific columns
awk '{print $1}' file.txt            # 1st column
awk '{print $1, $3}' file.txt        # 1st and 3rd
awk '{print $NF}' file.txt           # Last column
awk '{print $(NF-1)}' file.txt       # Second-to-last

# Default delimiter is whitespace; change with -F
awk -F':' '{print $1}' /etc/passwd   # Username
awk -F',' '{print $2}' data.csv      # 2nd column of CSV
\`\`\`

#### Awk Conditionals & Filters
\`\`\`bash
# Print lines where column 3 > 100
awk '$3 > 100' data.txt

# HTTP 500 errors from access log
awk '$9 == 500' /var/log/nginx/access.log

# Multiple conditions (AND)
awk '$9 >= 400 && $10 > 0' access.log

# OR condition
awk '$9 == 404 || $9 == 500' access.log

# Pattern matching
awk '/error/ {print $0}' file.log    # Like grep "error"
awk '$1 ~ /^192\\.168/ {print $1}' access.log  # Regex match
\`\`\`

#### Awk Aggregation & Math
\`\`\`bash
# Sum column
awk '{sum += $3} END {print sum}' data.txt

# Average
awk '{sum += $3; count++} END {print sum/count}' data.txt

# Count rows
awk 'END {print NR}' file.txt        # Same as wc -l

# Find max value
awk 'max < $3 {max = $3} END {print max}' data.txt

# Total bytes transferred (from access log)
awk '{sum += $10} END {print sum/1024/1024 " MB"}' access.log
\`\`\`

#### Real Awk Examples
\`\`\`bash
# Top 10 IPs by request count
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Top requested URLs
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -10

# HTTP status code distribution
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# Response time analysis (if logged)
awk '{print $NF}' access.log | awk '{sum+=$1; count++} END {print "Avg:", sum/count "ms"}'

# Bandwidth by IP
awk '{ip[$1]+=$10} END {for (i in ip) print i, ip[i]/1024/1024 "MB"}' access.log | sort -k2 -rn

# Requests per hour
awk '{print $4}' access.log | cut -d: -f2 | sort | uniq -c

# Time range filter
awk -F'[: \\[]' '$5>=10 && $5<=14 {print $0}' access.log  # Between 10:00-14:00
\`\`\`

### Part 5: Sed — Stream Editor

#### Basic Sed Replacements
\`\`\`bash
# Replace first occurrence on each line
sed 's/old/new/' file.txt

# Replace ALL occurrences (global)
sed 's/old/new/g' file.txt

# Case-insensitive replace
sed 's/old/new/gi' file.txt

# In-place edit (DANGEROUS - backup first!)
sed -i 's/old/new/g' file.txt

# In-place with backup
sed -i.bak 's/old/new/g' file.txt    # Creates file.txt.bak
\`\`\`

#### Sed Line Operations
\`\`\`bash
# Delete lines
sed '/pattern/d' file.txt            # Delete matching lines
sed '1d' file.txt                    # Delete 1st line
sed '$d' file.txt                    # Delete last line
sed '1,5d' file.txt                  # Delete lines 1-5

# Print specific lines
sed -n '10p' file.txt                # Print line 10
sed -n '10,20p' file.txt             # Print lines 10-20
sed -n '/error/p' file.txt           # Print matching lines (like grep)

# Insert/Append
sed '5i\\This is inserted' file.txt   # Insert before line 5
sed '5a\\This is appended' file.txt   # Append after line 5
\`\`\`

#### Real Sed Use Cases
\`\`\`bash
# Remove comments and empty lines
sed -e 's/#.*//' -e '/^$/d' config.conf

# Extract IP from config
sed -n 's/.*IP=\\([0-9.]*\\).*/\\1/p' config.txt

# Change config value
sed -i 's/^port=.*/port=8080/' config.conf

# Add line after match
sed '/^\\[database\\]/a host=localhost' config.ini

# Multiple replacements
sed -e 's/foo/bar/g' -e 's/hello/world/g' file.txt
\`\`\`

### Part 6: Cut, Sort, Uniq Pipeline

#### Cut — Column Extraction
\`\`\`bash
# Cut by delimiter
cut -d':' -f1 /etc/passwd            # Usernames
cut -d':' -f1,7 /etc/passwd          # Username & shell
cut -d',' -f2-5 data.csv             # Columns 2-5

# Cut by character position
cut -c1-10 file.txt                  # First 10 chars
\`\`\`

#### Sort — Ordering
\`\`\`bash
# Alphabetical sort
sort file.txt

# Reverse sort
sort -r file.txt

# Numeric sort (IMPORTANT!)
sort -n numbers.txt                  # 1, 2, 10, 20 (correct)
# Without -n: 1, 10, 2, 20 (wrong!)

# Sort by column
sort -k2 file.txt                    # 2nd column
sort -k2,2 file.txt                  # Only 2nd column (faster)

# Numeric + reverse
sort -rn numbers.txt

# Human-readable sizes
du -h /var/* | sort -rh              # Sorts 1K, 1M, 1G correctly

# Sort CSV by column
sort -t',' -k3 -rn data.csv          # 3rd column, numeric, reverse

# Unique while sorting
sort -u file.txt                     # Same as sort | uniq
\`\`\`

#### Uniq — Remove Duplicates
\`\`\`bash
# Remove adjacent duplicates (MUST sort first!)
sort file.txt | uniq

# Count occurrences
sort file.txt | uniq -c

# Sort by frequency
sort file.txt | uniq -c | sort -rn

# Show only duplicates
sort file.txt | uniq -d

# Show only unique (no duplicates)
sort file.txt | uniq -u
\`\`\`

### Part 7: Production Pipeline Examples

#### Example 1: Top Talkers (Most Active IPs)
\`\`\`bash
awk '{print $1}' /var/log/nginx/access.log | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  head -20 | \\
  awk '{print $2 "\\t" $1 " requests"}'
\`\`\`

#### Example 2: Error Rate Over Time
\`\`\`bash
grep "ERROR" /var/log/app.log | \\
  awk '{print $1, $2}' | \\
  cut -d: -f1-2 | \\
  sort | \\
  uniq -c | \\
  awk '{print $2, $3 "\\t" $1 " errors"}'
\`\`\`

#### Example 3: Find Slow Endpoints
\`\`\`bash
# Access log format: ... "GET /api/users" ... response_time
awk '{print $7, $NF}' access.log | \\
  awk '{total[$1]+=$2; count[$1]++} END {for (url in total) print url, total[url]/count[url]}' | \\
  sort -k2 -rn | \\
  head -10
\`\`\`

#### Example 4: Failed SSH Login Attempts
\`\`\`bash
grep "Failed password" /var/log/auth.log | \\
  awk '{print $(NF-3)}' | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  awk '$1 >= 5 {print $2 "\\t" $1 " failed attempts - BLOCK!"}'
\`\`\`

### Quick Reference Card

\`\`\`bash
# Grep
grep -i "pattern" file               # Case-insensitive
grep -r "pattern" /path              # Recursive
grep -v "pattern" file               # Inverse (NOT)
grep -E "p1|p2" file                 # Regex OR
grep -A 5 "pattern" file             # 5 lines After
grep -B 3 "pattern" file             # 3 lines Before

# Awk
awk '{print $1, $3}' file            # Columns 1 & 3
awk -F':' '{print $1}' file          # Custom delimiter
awk '$3 > 100' file                  # Filter by condition
awk '{sum+=$1} END {print sum}' file # Sum column

# Sed
sed 's/old/new/g' file               # Replace all
sed -i 's/old/new/g' file            # In-place edit
sed '/pattern/d' file                # Delete matching lines
sed -n '10,20p' file                 # Print lines 10-20

# Sort, Uniq
sort -rn file                        # Reverse numeric sort
sort file | uniq -c | sort -rn       # Frequency count

# Pipeline
... | sort | uniq -c | sort -rn | head -10
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
    lessons: [
      {
        id: 1,
        title: "SELinux Fundamentals",
        type: "theory",
        duration: "30 min",
        content: `
## SELinux — Security Enhanced Linux

### Modes

\`\`\`bash
# Check status
getenforce
sestatus

# Modes:
# - Enforcing: blocks and logs
# - Permissive: logs only
# - Disabled: completely off

# Temporary change
setenforce 0    # permissive
setenforce 1    # enforcing

# Permanent: /etc/selinux/config
SELINUX=enforcing
\`\`\`

### Contexts

\`\`\`bash
# View context
ls -Z /var/www/html
ps auxZ | grep httpd

# Context format: user:role:type:level
# system_u:object_r:httpd_sys_content_t:s0

# Change context
chcon -t httpd_sys_content_t /var/www/html/index.html

# Restore default
restorecon -Rv /var/www/html
\`\`\`

### Booleans

\`\`\`bash
# List booleans
getsebool -a | grep httpd

# Set boolean (temporary)
setsebool httpd_can_network_connect on

# Set boolean (persistent)
setsebool -P httpd_can_network_connect on
\`\`\`

### Troubleshooting

\`\`\`bash
# View denials
ausearch -m avc -ts recent
grep denied /var/log/audit/audit.log

# Generate policy
audit2why < /var/log/audit/audit.log
\`\`\`
        `,
        keyPoints: [
          "getenforce/setenforce — status va mode",
          "chcon — context o'zgartirish",
          "restorecon — default context",
          "setsebool -P — persistent boolean"
        ]
      },
      {
        id: 2,
        title: "SSH Hardening",
        type: "lab",
        duration: "35 min",
        content: `
## SSH Security Configuration

### /etc/ssh/sshd_config

\`\`\`bash
# Disable root login
PermitRootLogin no

# Disable password auth
PasswordAuthentication no
PubkeyAuthentication yes

# Limit users
AllowUsers admin deploy
AllowGroups sshusers

# Change port
Port 2222

# Idle timeout
ClientAliveInterval 300
ClientAliveCountMax 2
\`\`\`

### SSH Keys

\`\`\`bash
# Generate key
ssh-keygen -t ed25519 -C "user@example.com"

# Copy to server
ssh-copy-id user@server

# Permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
\`\`\`

### Apply changes
\`\`\`bash
systemctl restart sshd
\`\`\`
        `,
        commands: [
          { cmd: "ssh-keygen -t ed25519", desc: "Generate SSH key" },
          { cmd: "ssh-copy-id user@server", desc: "Copy key to server" },
          { cmd: "systemctl restart sshd", desc: "Restart SSH" }
        ]
      }
    ]
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
    lessons: [
      {
        id: 1,
        title: "Bash Basics",
        type: "theory",
        duration: "25 min",
        content: `
## Bash Scripting Fundamentals

### Script Structure

\`\`\`bash
#!/bin/bash
# Script description

# Variables
NAME="World"
echo "Hello, $NAME!"

# Command substitution
DATE=$(date +%Y-%m-%d)
FILES=\`ls -la\`

# Arguments
echo "Script: $0"
echo "First arg: $1"
echo "All args: $@"
echo "Arg count: $#"
\`\`\`

### Conditions

\`\`\`bash
# if-else
if [ -f "/etc/passwd" ]; then
    echo "File exists"
elif [ -d "/etc" ]; then
    echo "Directory exists"
else
    echo "Not found"
fi

# Numeric comparison
if [ $NUM -eq 10 ]; then echo "Equal"; fi
if [ $NUM -gt 5 ]; then echo "Greater"; fi
if [ $NUM -lt 20 ]; then echo "Less"; fi

# String comparison
if [ "$STR" = "hello" ]; then echo "Match"; fi
if [ -z "$STR" ]; then echo "Empty"; fi
if [ -n "$STR" ]; then echo "Not empty"; fi
\`\`\`

### Loops

\`\`\`bash
# For loop
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

for file in /etc/*.conf; do
    echo "Config: $file"
done

# While loop
count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    ((count++))
done

# Read file line by line
while read line; do
    echo "$line"
done < /etc/passwd
\`\`\`
        `,
        keyPoints: [
          "#!/bin/bash — shebang",
          "$1, $2, $@ — script arguments",
          "[ -f file ] — file exists check",
          "for/while — loops"
        ]
      },
      {
        id: 2,
        title: "Practical Scripts",
        type: "lab",
        duration: "40 min",
        content: `
## Real-World Scripts

### Backup Script

\`\`\`bash
#!/bin/bash
# Backup script

BACKUP_DIR="/backup"
SOURCE="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)
ARCHIVE="$BACKUP_DIR/web_backup_$DATE.tar.gz"

# Create backup
tar -czvf "$ARCHIVE" "$SOURCE"

# Keep only last 7 backups
find "$BACKUP_DIR" -name "web_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $ARCHIVE"
\`\`\`

### Log Monitor Script

\`\`\`bash
#!/bin/bash
# Monitor log for errors

LOG_FILE="/var/log/syslog"
ALERT_EMAIL="admin@example.com"

tail -F "$LOG_FILE" | while read line; do
    if echo "$line" | grep -qi "error"; then
        echo "$line" | mail -s "Error Alert" "$ALERT_EMAIL"
    fi
done
\`\`\`

### System Health Check

\`\`\`bash
#!/bin/bash

echo "=== System Health Check ==="
echo "Date: $(date)"
echo ""
echo "=== Disk Usage ==="
df -h | grep -E '^/dev'
echo ""
echo "=== Memory ==="
free -h
echo ""
echo "=== Load Average ==="
uptime
echo ""
echo "=== Top 5 CPU Processes ==="
ps aux --sort=-%cpu | head -6
\`\`\`
        `,
        commands: [
          { cmd: "chmod +x script.sh", desc: "Make script executable" },
          { cmd: "./script.sh arg1 arg2", desc: "Run script with args" },
          { cmd: "bash -x script.sh", desc: "Debug mode" }
        ]
      }
    ]
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
    lessons: [
      {
        id: 1,
        title: "Backup Strategies",
        type: "theory",
        duration: "25 min",
        content: `
## Backup Strategies

### Backup Types

| Type | Description | Use Case |
|------|-------------|----------|
| Full | Complete copy | Weekly |
| Incremental | Changes since last backup | Daily |
| Differential | Changes since last full | Daily |

### rsync — Efficient Copying

\`\`\`bash
# Basic sync
rsync -av /source/ /destination/

# Remote sync
rsync -avz /local/ user@server:/remote/

# With delete (mirror)
rsync -av --delete /source/ /destination/

# Exclude patterns
rsync -av --exclude='*.log' --exclude='cache/' /source/ /dest/

# Dry run
rsync -avn /source/ /destination/
\`\`\`

### tar — Archive Backup

\`\`\`bash
# Create backup
tar -czvf backup.tar.gz /data

# Incremental backup
tar -czvf backup.tar.gz --newer-mtime="2024-01-01" /data

# Restore
tar -xzvf backup.tar.gz -C /restore/
\`\`\`

### Cron Backup Jobs

\`\`\`bash
# /etc/crontab
# Daily backup at 2 AM
0 2 * * * root /usr/local/bin/backup.sh

# Weekly full backup on Sunday
0 3 * * 0 root /usr/local/bin/full-backup.sh
\`\`\`
        `,
        keyPoints: [
          "rsync -av — archive mode with verbose",
          "--delete — mirror source to destination",
          "tar -czvf — create gzipped archive",
          "cron — scheduled backups"
        ]
      },
      {
        id: 2,
        title: "Recovery Procedures",
        type: "lab",
        duration: "30 min",
        content: `
## System Recovery

### Bootloader Recovery (GRUB)

\`\`\`bash
# Boot from live CD, then:
mount /dev/sda1 /mnt
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
chroot /mnt

# Reinstall GRUB
grub2-install /dev/sda
grub2-mkconfig -o /boot/grub2/grub.cfg
\`\`\`

### Rescue Mode

\`\`\`bash
# Boot to rescue mode
systemctl rescue

# Or from GRUB:
# Add 'single' or 'init=/bin/bash' to kernel line
\`\`\`

### Password Recovery

\`\`\`bash
# Boot to single user mode
# Mount filesystem read-write
mount -o remount,rw /

# Change password
passwd root

# Reboot
reboot
\`\`\`
        `,
        commands: [
          { cmd: "rsync -avz /data/ /backup/", desc: "Sync data to backup" },
          { cmd: "tar -xzvf backup.tar.gz -C /restore/", desc: "Restore from archive" }
        ]
      }
    ]
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
    lessons: [
      {
        id: 1,
        title: "Container Basics",
        type: "theory",
        duration: "30 min",
        content: `
## Containers — Docker/Podman

### Basic Commands

\`\`\`bash
# Run container
docker run hello-world
docker run -d -p 80:80 nginx
docker run -it ubuntu bash

# List containers
docker ps           # running
docker ps -a        # all

# Stop/Start/Remove
docker stop container_id
docker start container_id
docker rm container_id

# Logs
docker logs container_id
docker logs -f container_id
\`\`\`

### Images

\`\`\`bash
# List images
docker images

# Pull image
docker pull nginx:latest

# Build image
docker build -t myapp:1.0 .

# Remove image
docker rmi image_id
\`\`\`

### Volumes

\`\`\`bash
# Create volume
docker volume create mydata

# Mount volume
docker run -v mydata:/data nginx

# Bind mount
docker run -v /host/path:/container/path nginx

# List volumes
docker volume ls
\`\`\`

### Podman (Docker alternative)

\`\`\`bash
# Same commands as Docker
podman run -d nginx
podman ps
podman images

# Rootless containers
podman run --user 1000 nginx
\`\`\`
        `,
        keyPoints: [
          "docker run -d — detached mode",
          "-p host:container — port mapping",
          "-v host:container — volume mount",
          "podman — rootless alternative"
        ]
      },
      {
        id: 2,
        title: "Dockerfile & Compose",
        type: "lab",
        duration: "35 min",
        content: `
## Building Custom Images

### Dockerfile

\`\`\`dockerfile
FROM ubuntu:22.04

# Metadata
LABEL maintainer="admin@example.com"

# Install packages
RUN apt-get update && apt-get install -y \\
    nginx \\
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY index.html /var/www/html/

# Expose port
EXPOSE 80

# Start command
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### Build & Run

\`\`\`bash
# Build
docker build -t mywebapp:1.0 .

# Run
docker run -d -p 8080:80 mywebapp:1.0
\`\`\`

### Docker Compose

\`\`\`yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./html:/var/www/html
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
\`\`\`

### Compose Commands

\`\`\`bash
docker compose up -d
docker compose down
docker compose logs
docker compose ps
\`\`\`
        `,
        commands: [
          { cmd: "docker build -t myapp .", desc: "Build image" },
          { cmd: "docker compose up -d", desc: "Start compose stack" },
          { cmd: "docker compose logs -f", desc: "Follow logs" }
        ]
      }
    ]
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
    lessons: [
      {
        id: 1,
        title: "Exam Overview",
        type: "theory",
        duration: "15 min",
        content: `
## LFCS Exam Information

### Exam Format

| Aspect | Detail |
|--------|--------|
| Duration | 2 hours |
| Questions | 20-25 performance-based tasks |
| Passing Score | 66% |
| Environment | Command line only |
| Resources | man pages allowed |

### Exam Domains

| Domain | Weight |
|--------|--------|
| Essential Commands | 25% |
| Operation of Running Systems | 20% |
| User and Group Management | 10% |
| Networking | 12% |
| Service Configuration | 20% |
| Storage Management | 13% |

### Tips

- **Read carefully** — har bir task to'liq o'qing
- **man pages** — buyruqlar uchun man ishlatish mumkin
- **Time management** — 2 soat, ~5 min per task
- **Verify** — har bir task bajarilganini tekshiring
- **Don't panic** — bilmaganingizni o'tkazib keting
        `,
        keyPoints: [
          "2 soat, 20-25 task",
          "66% passing score",
          "man pages ruxsat etilgan",
          "Performance-based (real terminal)"
        ]
      },
      {
        id: 2,
        title: "Start Practice Exam",
        type: "exam",
        duration: "120 min",
        content: `
## Practice Exam

Exam sahifasiga o'tish uchun sidebar'dagi **LFCS Exam** tugmasini bosing.

Practice exam xususiyatlari:
- Real LFCS formatidagi tasklar
- 2 soatlik timer
- Hints va solutions
- Progress tracking
        `,
        tasks: []
      }
    ]
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
