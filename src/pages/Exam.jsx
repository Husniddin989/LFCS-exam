import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Clock, AlertTriangle, Play, CheckCircle2,
  ArrowLeft, ArrowRight, Eye, EyeOff, RotateCcw, Trophy,
  Timer, Target, Zap
} from 'lucide-react';
import CodeBlock from '../components/CodeBlock/CodeBlock';

const examTasks = [
  {
    id: 1,
    domain: "Essential Commands",
    weight: "25%",
    title: "Find and Archive Files",
    description: `/home/admin/data directoryda 7 kundan eski va .log kengaytmali barcha fayllarni toping.
Ularni /backup/old-logs-$(date +%Y%m%d).tar.gz arxiviga joylashtiring.
Arxiv yaratilgandan so'ng, original fayllarni o'chiring.`,
    timeLimit: 10,
    hints: [
      "find buyrug'ini -mtime va -name bilan ishlating",
      "tar -czvf arxiv yaratish uchun",
      "find ... -delete o'chirish uchun"
    ],
    solution: `# 1. Fayllarni topish va arxivlash
find /home/admin/data -name "*.log" -type f -mtime +7 -exec tar -rvf /tmp/old-logs.tar {} \\;

# 2. Arxivni siqish
gzip /tmp/old-logs.tar
mv /tmp/old-logs.tar.gz /backup/old-logs-$(date +%Y%m%d).tar.gz

# 3. Original fayllarni o'chirish
find /home/admin/data -name "*.log" -type f -mtime +7 -delete

# Yoki bir qatorda:
find /home/admin/data -name "*.log" -mtime +7 -type f | tee /tmp/files.txt | tar -czvf /backup/old-logs-$(date +%Y%m%d).tar.gz -T - && xargs rm < /tmp/files.txt`,
    verification: "ls -la /backup/old-logs-*.tar.gz && find /home/admin/data -name '*.log' -mtime +7"
  },
  {
    id: 2,
    domain: "User Management",
    weight: "10%",
    title: "Create Users with Specific Requirements",
    description: `Quyidagi talablar bilan 'developer' guruhiga tegishli foydalanuvchi yarating:

- Username: webdev
- Primary group: developer (guruh mavjud bo'lmasa yarating)
- Secondary groups: docker, sudo
- Home directory: /home/webdev
- Shell: /bin/bash
- Password expires in 90 days
- Account expires on 2026-12-31`,
    timeLimit: 8,
    hints: [
      "groupadd bilan guruh yarating",
      "useradd -m -g -G -s bilan foydalanuvchi",
      "chage -M va -E bilan expire sozlash"
    ],
    solution: `# 1. Primary group yaratish
groupadd developer

# 2. User yaratish
useradd -m -g developer -G docker,sudo -s /bin/bash -c "Web Developer" webdev

# 3. Password o'rnatish
echo "webdev:SecurePass123" | chpasswd

# 4. Password aging (90 kun)
chage -M 90 webdev

# 5. Account expiry
chage -E 2026-12-31 webdev

# Tekshirish
id webdev
chage -l webdev`,
    verification: "id webdev && chage -l webdev"
  },
  {
    id: 3,
    domain: "Operation of Running Systems",
    weight: "20%",
    title: "Create and Enable a Systemd Service",
    description: `Quyidagi xususiyatlarga ega systemd service yarating:

- Service name: webapp
- Script location: /opt/webapp/start.sh (mavjud deb faraz qiling)
- User: webdev
- WorkingDirectory: /opt/webapp
- Service crash bo'lganda avtomatik restart qilsin (5 sekund kutib)
- Boot vaqtida avtomatik ishga tushsin
- network.target dan keyin ishga tushsin`,
    timeLimit: 12,
    hints: [
      "Unit file /etc/systemd/system/ da yaratiladi",
      "[Unit], [Service], [Install] sectionlari kerak",
      "systemctl daemon-reload kerak"
    ],
    solution: `# 1. Service file yaratish
cat << 'EOF' > /etc/systemd/system/webapp.service
[Unit]
Description=Web Application Service
After=network.target
Wants=network.target

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

# 2. Systemd reload
systemctl daemon-reload

# 3. Service enable va start
systemctl enable webapp
systemctl start webapp

# Tekshirish
systemctl status webapp`,
    verification: "systemctl status webapp && systemctl is-enabled webapp"
  },
  {
    id: 4,
    domain: "Networking",
    weight: "12%",
    title: "Configure Static IP and Firewall",
    description: `Server uchun quyidagi network konfiguratsiyani o'rnating:

1. eth0 interfeysi uchun static IP: 192.168.1.100/24
2. Gateway: 192.168.1.1
3. DNS: 8.8.8.8, 8.8.4.4
4. Firewall:
   - SSH (22), HTTP (80), HTTPS (443) portlarini oching
   - Boshqa barcha kiruvchi trafikni bloklang`,
    timeLimit: 15,
    hints: [
      "nmcli yoki ip command ishlatish mumkin",
      "firewall-cmd yoki ufw ishlatish",
      "/etc/resolv.conf DNS uchun"
    ],
    solution: `# NetworkManager bilan (RHEL/CentOS)
nmcli con mod eth0 ipv4.addresses 192.168.1.100/24
nmcli con mod eth0 ipv4.gateway 192.168.1.1
nmcli con mod eth0 ipv4.dns "8.8.8.8 8.8.4.4"
nmcli con mod eth0 ipv4.method manual
nmcli con up eth0

# Firewalld bilan
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --set-default-zone=drop
firewall-cmd --reload

# UFW bilan (Ubuntu/Debian)
# ufw default deny incoming
# ufw allow ssh
# ufw allow http
# ufw allow https
# ufw enable`,
    verification: "ip addr show eth0 && firewall-cmd --list-all"
  },
  {
    id: 5,
    domain: "Storage Management",
    weight: "13%",
    title: "LVM Configuration",
    description: `Quyidagi LVM konfiguratsiyani bajaring:

1. /dev/sdb diskdan 5GB physical volume yarating
2. 'data_vg' nomli volume group yarating
3. 'app_lv' nomli 3GB logical volume yarating
4. ext4 filesystem bilan format qiling
5. /mnt/appdata ga mount qiling
6. Reboot dan keyin ham avtomatik mount bo'lsin`,
    timeLimit: 15,
    hints: [
      "pvcreate, vgcreate, lvcreate ketma-ketligi",
      "mkfs.ext4 format uchun",
      "/etc/fstab ga yozish kerak"
    ],
    solution: `# 1. Physical Volume yaratish
pvcreate /dev/sdb

# 2. Volume Group yaratish
vgcreate data_vg /dev/sdb

# 3. Logical Volume yaratish (3GB)
lvcreate -n app_lv -L 3G data_vg

# 4. Filesystem yaratish
mkfs.ext4 /dev/data_vg/app_lv

# 5. Mount point yaratish va mount qilish
mkdir -p /mnt/appdata
mount /dev/data_vg/app_lv /mnt/appdata

# 6. /etc/fstab ga qo'shish
echo "/dev/data_vg/app_lv /mnt/appdata ext4 defaults 0 2" >> /etc/fstab

# Tekshirish
lvs
df -h /mnt/appdata`,
    verification: "lvs && df -h /mnt/appdata && grep appdata /etc/fstab"
  },
  {
    id: 6,
    domain: "Service Configuration",
    weight: "20%",
    title: "Configure Scheduled Tasks",
    description: `Quyidagi scheduled tasklar yarating:

1. Har kuni soat 02:00 da /var/log/*.log fayllarni /backup/logs/ ga arxivlaydigan cron job (root user uchun)
2. Har 15 minutda /tmp dan 1 kundan eski fayllarni o'chiradigan systemd timer
3. Server reboot bo'lganda /opt/scripts/startup.sh scriptni ishga tushiradigan cron entry`,
    timeLimit: 12,
    hints: [
      "crontab -e bilan cron job",
      "systemd timer va service pair kerak",
      "@reboot cron syntax"
    ],
    solution: `# 1. Root cron job (har kuni 02:00)
cat << 'EOF' >> /var/spool/cron/root
0 2 * * * tar -czvf /backup/logs/logs-$(date +\\%Y\\%m\\%d).tar.gz /var/log/*.log
@reboot /opt/scripts/startup.sh
EOF

# Yoki crontab -e bilan:
# crontab -e
# 0 2 * * * tar -czvf /backup/logs/logs-$(date +\\%Y\\%m\\%d).tar.gz /var/log/*.log

# 2. Systemd timer - Service file
cat << 'EOF' > /etc/systemd/system/cleanup-tmp.service
[Unit]
Description=Cleanup old temp files

[Service]
Type=oneshot
ExecStart=/usr/bin/find /tmp -type f -mtime +1 -delete
EOF

# Timer file
cat << 'EOF' > /etc/systemd/system/cleanup-tmp.timer
[Unit]
Description=Run tmp cleanup every 15 minutes

[Timer]
OnCalendar=*:0/15
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now cleanup-tmp.timer`,
    verification: "crontab -l && systemctl list-timers cleanup-tmp.timer"
  }
];

function ExamTask({ task, index, isActive }) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div className={`bg-slate-800/50 border rounded-xl overflow-hidden transition-all ${
      isActive ? 'border-amber-500/50' : 'border-slate-700'
    }`}>
      {/* Task Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold text-white">{task.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="px-2 py-0.5 bg-slate-700 rounded">{task.domain}</span>
                <span>Weight: {task.weight}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {task.timeLimit} min
                </span>
              </div>
            </div>
          </div>
          {completed && (
            <CheckCircle2 size={24} className="text-green-400" />
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="p-4">
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
          <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
            {task.description}
          </pre>
        </div>

        {/* Hints */}
        <div className="mb-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <Zap size={16} />
            {showHints ? 'Hintlarni yashirish' : `Hintlar ko'rish (${task.hints.length})`}
          </button>
          {showHints && (
            <ul className="mt-2 space-y-1 pl-6">
              {task.hints.map((hint, idx) => (
                <li key={idx} className="text-sm text-slate-400 list-disc">{hint}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Solution */}
        <div>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
          >
            {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSolution ? 'Yechimni yashirish' : 'Yechimni ko\'rish'}
          </button>
          {showSolution && (
            <div className="mt-3">
              <CodeBlock code={task.solution} language="bash" title="Solution" />
              <p className="mt-2 text-xs text-slate-500">
                <strong>Verification:</strong> <code className="text-green-400">{task.verification}</code>
              </p>
            </div>
          )}
        </div>

        {/* Mark Complete */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={() => setCompleted(!completed)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              completed
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {completed ? 'Tugallandi ✓' : 'Tugallangan deb belgilash'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Exam() {
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // 2 hours in seconds
  const [currentTask, setCurrentTask] = useState(0);

  useEffect(() => {
    if (!examStarted) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!examStarted) {
    return (
      <div className="p-6 max-w-4xl mx-auto fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        {/* Exam Info Card */}
        <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
              <Award size={32} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">LFCS Practice Exam</h1>
              <p className="text-slate-400">Linux Foundation Certified System Administrator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={16} />
                <span className="text-sm">Vaqt</span>
              </div>
              <div className="text-2xl font-bold text-white">2 soat</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Target size={16} />
                <span className="text-sm">Tasklar</span>
              </div>
              <div className="text-2xl font-bold text-white">{examTasks.length} ta</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Trophy size={16} />
                <span className="text-sm">O'tish bali</span>
              </div>
              <div className="text-2xl font-bold text-white">66%</div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-red-400 mb-1">Muhim!</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Bu practice exam - real LFCS imtihonini simulatsiya qiladi</li>
                  <li>• Vaqt chegarasi bor - timer boshlangandan keyin to'xtamaydi</li>
                  <li>• Har bir taskni real serverda bajarishga harakat qiling</li>
                  <li>• Yechimlarni faqat o'zingiz sinab ko'rgandan keyin ko'ring</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Domains */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Exam Domains</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { name: "Essential Commands", weight: "25%" },
                { name: "Running Systems", weight: "20%" },
                { name: "User Management", weight: "10%" },
                { name: "Networking", weight: "12%" },
                { name: "Service Config", weight: "20%" },
                { name: "Storage", weight: "13%" },
              ].map((domain, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded px-3 py-2 text-sm">
                  <span className="text-slate-300">{domain.name}</span>
                  <span className="text-amber-400 ml-2">{domain.weight}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setExamStarted(true)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Play size={20} />
            Imtihonni boshlash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto fade-in">
      {/* Exam Header - Fixed */}
      <div className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-sm -mx-6 px-6 py-4 mb-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Award size={24} className="text-amber-400" />
            <div>
              <h1 className="font-bold text-white">LFCS Practice Exam</h1>
              <p className="text-xs text-slate-400">Task {currentTask + 1} / {examTasks.length}</p>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeRemaining < 600 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'
          }`}>
            <Timer size={18} />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all"
            style={{ width: `${((currentTask + 1) / examTasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-6">
        {examTasks.map((task, idx) => (
          <ExamTask
            key={task.id}
            task={task}
            index={idx}
            isActive={idx === currentTask}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={() => setCurrentTask(Math.max(0, currentTask - 1))}
          disabled={currentTask === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Oldingi task
        </button>

        <button
          onClick={() => {
            setExamStarted(false);
            setTimeRemaining(120 * 60);
            setCurrentTask(0);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
        >
          <RotateCcw size={18} />
          Qayta boshlash
        </button>

        <button
          onClick={() => setCurrentTask(Math.min(examTasks.length - 1, currentTask + 1))}
          disabled={currentTask === examTasks.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-lg disabled:opacity-50"
        >
          Keyingi task
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
