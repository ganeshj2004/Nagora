import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const port = parseInt(process.env.DB_PORT || '3306');
const dbName = process.env.DB_NAME || 'nagora_db';

async function setupDatabase() {
  console.log('🚀 Starting NAGORA MySQL Database Setup via Node...');
  console.log(`📡 Connecting to MySQL server at ${host}:${port} as user "${user}"...`);

  let connection;
  try {
    // 1. Initial Connection without database specified
    connection = await mysql.createConnection({ host, user, password, port, multipleStatements: true });
    console.log('✅ Connection established with MySQL Server!');

    // 2. Create Database
    console.log(`🔨 Creating database "${dbName}" if it does not exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`✅ Using database "${dbName}".`);

    // 3. Create Tables
    console.log('📋 Creating database tables...');

    // Table: Users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`username\` VARCHAR(50) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL UNIQUE,
        \`role\` VARCHAR(20) DEFAULT 'admin',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: Services
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`number\` VARCHAR(10) NOT NULL,
        \`title\` VARCHAR(100) NOT NULL,
        \`slug\` VARCHAR(100) NOT NULL UNIQUE,
        \`heading\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`features_json\` JSON,
        \`cta_text\` VARCHAR(100),
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: Portfolio Categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`portfolio_categories\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(50) NOT NULL UNIQUE,
        \`slug\` VARCHAR(50) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: Portfolio
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`portfolio\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(150) NOT NULL,
        \`category\` VARCHAR(50) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`full_description\` TEXT,
        \`image_url\` VARCHAR(255) NOT NULL,
        \`tags_json\` JSON,
        \`client\` VARCHAR(100),
        \`year\` VARCHAR(10),
        \`result\` VARCHAR(255),
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_category\` (\`category\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: Testimonials
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`testimonials\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`company\` VARCHAR(100) NOT NULL,
        \`service\` VARCHAR(100) NOT NULL,
        \`review\` TEXT NOT NULL,
        \`avatar_url\` VARCHAR(255),
        \`rating\` TINYINT DEFAULT 5,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: Enquiries
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`enquiries\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`phone\` VARCHAR(30) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL,
        \`company\` VARCHAR(100),
        \`service\` VARCHAR(100) NOT NULL,
        \`budget\` VARCHAR(100) NOT NULL,
        \`message\` TEXT NOT NULL,
        \`status\` ENUM('New', 'Contacted', 'In Discussion', 'Converted', 'Closed') DEFAULT 'New',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_status\` (\`status\`),
        INDEX \`idx_created\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: Contacts
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`contacts\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL,
        \`phone\` VARCHAR(30),
        \`message\` TEXT NOT NULL,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ All relational tables created successfully!');

    // 4. Seed Admin Account
    console.log('🔑 Seeding admin user account...');
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.trim() === '') {
      throw new Error('ADMIN_PASSWORD environment variable is required to run database setup. Set ADMIN_PASSWORD in environment.');
    }
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await connection.query(`
      INSERT INTO \`users\` (username, password_hash, email, role)
      VALUES ('admin', ?, 'admin@nagoradigital.com', 'admin')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
    `, [passwordHash]);
    console.log('✅ Admin user created! (Username: admin | Password: [SET FROM ADMIN_PASSWORD ENV VARIABLE])');

    // 5. Seed Portfolio Categories
    console.log('🏷️  Seeding portfolio categories...');
    const categories = ['Websites', 'Apps', 'SEO', 'Photography', 'Videography', 'Editing', 'Branding'];
    for (const cat of categories) {
      await connection.query(`
        INSERT INTO \`portfolio_categories\` (name, slug)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name);
      `, [cat, cat.toLowerCase()]);
    }
    console.log('✅ Portfolio categories seeded.');

    // 6. Seed Sample Portfolio Items
    console.log('🖼️  Seeding initial portfolio showcase items...');
    const sampleProjects = [
      {
        title: 'Aura Luxury Real Estate Platform',
        category: 'Websites',
        description: 'Ultra-fast web platform with interactive virtual property views, high conversion landing flows, and custom CRM integration.',
        full_description: 'Designed and engineered an exclusive luxury property discovery platform.',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        tags_json: JSON.stringify(['React', 'MUI', 'SEO Optimized', 'Real Estate']),
        client: 'Aura Properties Ltd.',
        year: '2026',
        result: '+210% Inquiries generated in 60 days',
      },
      {
        title: 'Apex Fit Mobile Companion App',
        category: 'Apps',
        description: 'Cross-platform mobile application providing customized workout tracking, live trainer chats, and biometric statistics.',
        full_description: 'Full end-to-end mobile application architecture including real-time sync and push notifications.',
        image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        tags_json: JSON.stringify(['iOS & Android', 'Node.js API', 'Authentication']),
        client: 'Apex Global Fitness',
        year: '2025',
        result: '4.9 Star Rating & 50,000+ Downloads',
      },
      {
        title: 'Kinetic E-Commerce SEO Scale',
        category: 'SEO',
        description: 'Complete technical SEO overhaul and content ranking campaign for an international fashion brand.',
        full_description: 'Resolved crawl errors, optimized core web vitals, and implemented high-conversion structured data.',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        tags_json: JSON.stringify(['Technical SEO', 'Keyword Strategy', 'Local SEO']),
        client: 'Kinetic Apparel',
        year: '2026',
        result: '#1 Rank for 45 High-Intent Keywords',
      },
    ];

    for (const item of sampleProjects) {
      await connection.query(`
        INSERT INTO \`portfolio\` (title, category, description, full_description, image_url, tags_json, client, year, result)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [item.title, item.category, item.description, item.full_description, item.image_url, item.tags_json, item.client, item.year, item.result]);
    }
    console.log('✅ Portfolio showcase items seeded.');

    console.log('--------------------------------------------------');
    console.log('🎉 NAGORA DATABASE SETUP COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');

  } catch (err) {
    console.error('❌ Database Setup Failed!');
    console.error(err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
