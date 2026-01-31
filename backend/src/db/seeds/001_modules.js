/**
 * Seed file for LFCS modules and lessons
 * This seeds the database with content from the original modules.js
 */

export async function seed(knex) {
  // Clear existing data
  await knex('activity_log').del();
  await knex('user_stats').del();
  await knex('user_lab_progress').del();
  await knex('user_quiz_results').del();
  await knex('user_lesson_progress').del();
  await knex('exam_tasks').del();
  await knex('quiz_questions').del();
  await knex('lab_commands').del();
  await knex('lesson_content').del();
  await knex('lessons').del();
  await knex('exam_domain_modules').del();
  await knex('exam_domains').del();
  await knex('modules').del();

  // Seed exam domains
  await knex('exam_domains').insert([
    { id: 1, name: 'Essential Commands', weight: 25, sort_order: 0 },
    { id: 2, name: 'Operation of Running Systems', weight: 20, sort_order: 1 },
    { id: 3, name: 'User and Group Management', weight: 10, sort_order: 2 },
    { id: 4, name: 'Networking', weight: 12, sort_order: 3 },
    { id: 5, name: 'Service Configuration', weight: 20, sort_order: 4 },
    { id: 6, name: 'Storage Management', weight: 13, sort_order: 5 }
  ]);

  // Seed modules
  await knex('modules').insert([
    { id: 1, title: 'Essential Commands & Filesystem', description: 'Linux fayl tizimi, asosiy buyruqlar, find, grep, text processing', icon: 'Terminal', color: 'from-green-500 to-emerald-600', duration: '4-5 soat', difficulty: 'Beginner', exam_weight: '25%', sort_order: 1 },
    { id: 2, title: 'Users, Groups & Permissions', description: 'User management, groups, file permissions, ACL, sudo configuration', icon: 'Users', color: 'from-blue-500 to-indigo-600', duration: '4-5 soat', difficulty: 'Intermediate', exam_weight: '10%', sort_order: 2 },
    { id: 3, title: 'Process & Service Management', description: 'systemd, services, boot process, cron, process management', icon: 'Cpu', color: 'from-purple-500 to-pink-600', duration: '5-6 soat', difficulty: 'Intermediate', exam_weight: '20%', sort_order: 3 },
    { id: 4, title: 'Networking Fundamentals', description: 'IP configuration, routing, firewall, ss/netstat, DNS, troubleshooting', icon: 'Network', color: 'from-cyan-500 to-blue-600', duration: '5-6 soat', difficulty: 'Intermediate', exam_weight: '12%', sort_order: 4 },
    { id: 5, title: 'Storage Management', description: 'LVM, partitions, mount, fstab, swap, disk troubleshooting', icon: 'HardDrive', color: 'from-orange-500 to-red-600', duration: '5-6 soat', difficulty: 'Advanced', exam_weight: '13%', sort_order: 5 },
    { id: 6, title: 'Package Management', description: 'yum/dnf, apt, rpm, dpkg, repositories, dependency management', icon: 'Package', color: 'from-teal-500 to-green-600', duration: '3-4 soat', difficulty: 'Intermediate', exam_weight: '8%', sort_order: 6 },
    { id: 7, title: 'Logging & Monitoring', description: 'journald, rsyslog, log rotation, system monitoring tools', icon: 'FileText', color: 'from-yellow-500 to-orange-600', duration: '3-4 soat', difficulty: 'Intermediate', exam_weight: '5%', sort_order: 7 },
    { id: 8, title: 'Security', description: 'SELinux, AppArmor, firewalld, iptables, SSH hardening', icon: 'Shield', color: 'from-red-500 to-pink-600', duration: '5-6 soat', difficulty: 'Advanced', exam_weight: '7%', sort_order: 8 },
    { id: 9, title: 'Bash Scripting', description: 'Variables, loops, conditions, functions, automation scripts', icon: 'Code', color: 'from-violet-500 to-purple-600', duration: '4-5 soat', difficulty: 'Intermediate', exam_weight: '5%', sort_order: 9 },
    { id: 10, title: 'Backup & Recovery', description: 'Backup strategies, rsync, cron jobs, disaster recovery', icon: 'Database', color: 'from-emerald-500 to-teal-600', duration: '3-4 soat', difficulty: 'Intermediate', exam_weight: '5%', sort_order: 10 },
    { id: 11, title: 'Containers', description: 'Docker/Podman basics, images, containers, volumes', icon: 'Box', color: 'from-sky-500 to-indigo-600', duration: '4-5 soat', difficulty: 'Intermediate', exam_weight: '5%', sort_order: 11 },
    { id: 12, title: 'LFCS Exam Simulation', description: 'Full practice exam, time-limited tasks, real exam environment', icon: 'Award', color: 'from-amber-500 to-yellow-600', duration: '2 soat', difficulty: 'Exam', exam_weight: '100%', sort_order: 12 }
  ]);

  // Link exam domains to modules
  await knex('exam_domain_modules').insert([
    { exam_domain_id: 1, module_id: 1 },
    { exam_domain_id: 2, module_id: 3 },
    { exam_domain_id: 3, module_id: 2 },
    { exam_domain_id: 4, module_id: 4 },
    { exam_domain_id: 5, module_id: 3 },
    { exam_domain_id: 5, module_id: 6 },
    { exam_domain_id: 5, module_id: 7 },
    { exam_domain_id: 6, module_id: 5 }
  ]);

  console.log('Modules and exam domains seeded successfully');
}
