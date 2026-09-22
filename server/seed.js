import bcrypt from 'bcryptjs';
import { query } from './config/db.js';

async function seed() {
  console.log('🌱 Starting NAGORA Database Seed...');
  try {
    // Seed Admin User
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.trim() === '') {
      throw new Error('ADMIN_PASSWORD environment variable is required to run seed script. Set ADMIN_PASSWORD in environment.');
    }
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await query(`
      INSERT INTO users (username, password_hash, email, role)
      VALUES (?, ?, ?, 'admin')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, ['admin', passwordHash, 'admin@nagoradigital.com']);

    console.log('✅ Admin user created (username: admin, pass: [SET FROM ADMIN_PASSWORD ENV VARIABLE])');
    console.log('🎉 Seed Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Failed:', err);
    process.exit(1);
  }
}

seed();
