import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  console.log('====================================================');
  console.log('🚀 NAGORA DIGITAL AGENCY — AUTOMATED DATABASE SETUP');
  console.log('====================================================\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306'),
    multipleStatements: true,
  };

  let connection;

  try {
    console.log(`📡 Connecting to MySQL server at ${config.host}:${config.port} as '${config.user}'...`);
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server successfully.\n');

    // 1. Create Database if not exists
    const dbName = process.env.DB_NAME || 'nagora_db';
    console.log(`🛠️ Creating database '${dbName}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Database '${dbName}' created/verified.\n`);

    // 2. Select Database
    await connection.changeUser({ database: dbName });

    // 3. Read and execute schema.sql DDL script
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    console.log(`📄 Executing schema DDL from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Remove USE statement if present to avoid cross-db conflicts
    const cleanedSql = schemaSql.replace(/USE `nagora_db`;/g, '');
    await connection.query(cleanedSql);
    console.log('✅ All relational tables created:');
    console.log('   - users');
    console.log('   - services');
    console.log('   - portfolio_categories');
    console.log('   - portfolio');
    console.log('   - testimonials');
    console.log('   - enquiries');
    console.log('   - contacts');
    console.log('   - payment_requests');
    console.log('   - payments');
    console.log('   - payment_audit_logs\n');

    // 4. Seed Default Admin User
    console.log('🔐 Seeding Admin Account...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await connection.execute(`
      INSERT INTO users (username, password_hash, email, role)
      VALUES (?, ?, 'admin@nagoradigital.com', 'admin')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, ['admin', passwordHash]);

    console.log(`✅ Admin Account setup completed:`);
    console.log(`   Username: admin`);
    console.log(`   Password: ${adminPassword}\n`);

    // 5. Seed Services
    console.log('📦 Seeding NAGORA Services...');
    const services = [
      ['01', 'Website Development', 'website-development', 'Your Business Deserves More Than Just a Website.', 'We build fast, modern and responsive websites designed to make a strong first impression and turn visitors into customers.', JSON.stringify(['Business Websites', 'E-commerce', 'Landing Pages', 'Custom Web Applications']), 'Build My Website →'],
      ['02', 'SEO & Search Growth', 'seo', 'Be Seen Where Your Customers Are Searching.', 'We help your business improve its online visibility and reach the people actively looking for your products or services.', JSON.stringify(['Technical SEO', 'On-page SEO', 'Keyword Research', 'Local SEO']), 'Grow My Visibility →'],
      ['03', 'App Development', 'app-development', 'From Your Idea to an App People Love to Use.', 'We create intuitive, reliable applications designed around your customers and business goals.', JSON.stringify(['iOS & Android Apps', 'API Integration', 'Authentication', 'Admin Panels']), 'Build My App →'],
      ['04', 'Photography', 'photography', 'Make Your Brand Look as Good as It Really Is.', 'Professional photography that captures your products, people, events and brand with clarity.', JSON.stringify(['Product Photography', 'Brand Photography', 'Event Photography']), 'Book a Shoot →'],
      ['05', 'Videography', 'videography', 'Don\'t Just Show Your Story. Make People Feel It.', 'Professional video production designed to capture attention and communicate your story.', JSON.stringify(['Brand Films', 'Promotional Videos', 'Event Coverage']), 'Plan My Video →'],
      ['06', 'Video Editing', 'video-editing', 'Turn Raw Footage Into Something Worth Watching.', 'We transform your footage into polished, engaging videos built for your audience and platform.', JSON.stringify(['Reels', 'YouTube Videos', 'Promotional Edits']), 'Edit My Video →'],
      ['07', 'Branding', 'branding', 'Build a Brand People Remember.', 'We create consistent visual identities that help your business look professional and trustworthy.', JSON.stringify(['Logo Design', 'Brand Identity', 'Brand Guidelines']), 'Build My Brand →'],
    ];

    for (const s of services) {
      await connection.execute(`
        INSERT INTO services (number, title, slug, heading, description, features_json, cta_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE heading = VALUES(heading), description = VALUES(description);
      `, s);
    }
    console.log('✅ 7 Core Services seeded successfully.\n');

    console.log('====================================================');
    console.log('🎉 DATABASE SETUP COMPLETE! ALL TABLES & DATA READY');
    console.log('====================================================\n');

  } catch (err) {
    console.error('❌ Database Setup Error:', err.message);
    console.error('\nTips:');
    console.error('1. Make sure MySQL service is running on your machine (e.g. via XAMPP, WampServer, or MySQL Workbench).');
    console.error('2. Check database credentials in server/.env or environment variables.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
