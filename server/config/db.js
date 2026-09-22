import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let useFallback = false;

// Standard DB_* environment variables take priority over provider-specific variables
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10);
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || 'root';
const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.MYSQLPASSWORD || '');
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'nagora_db';
const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = dbUrl
  ? dbUrl
  : {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 10000, // 10 second timeout
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };

// In-Memory Data Store Fallback for local development/testing ONLY
const inMemoryStore = {
  enquiries: [],
  services: [],
  portfolio: [],
  testimonials: [],
  payments: [],
};

try {
  pool = mysql.createPool(poolConfig);
} catch (err) {
  if (isProduction) {
    console.error('❌ [FATAL] Failed to initialize production MySQL connection pool:', err.message);
    throw err;
  } else {
    console.warn('⚠️ MySQL pool init notice: Using in-memory provider fallback for local development.');
    useFallback = true;
  }
}

export async function query(sql, params) {
  if (pool && !useFallback) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      if (isProduction) {
        // In production: NEVER silently swallow errors or fall back to mock data
        console.error('❌ [DB ERROR] MySQL Query failed in production:', err.message);
        throw new Error('Database operation failed. Real persistent database access is required.');
      } else {
        console.warn('⚠️ MySQL Query fallback activated in development mode:', err.message);
        useFallback = true;
      }
    }
  }

  // PRODUCTION SAFETY RULE: Mock in-memory storage is strictly prohibited in production mode
  if (isProduction) {
    throw new Error('Database connection unavailable. In-memory data fallback is prohibited in production.');
  }

  // Development-only fallback response when MySQL is not running locally
  if (sql.includes('enquiries') && sql.includes('INSERT')) {
    const newId = inMemoryStore.enquiries.length + 1;
    const record = { id: newId, ...params, status: 'New', created_at: new Date().toISOString() };
    inMemoryStore.enquiries.unshift(record);
    return { insertId: newId };
  }

  if (sql.includes('enquiries') && sql.includes('SELECT')) {
    return inMemoryStore.enquiries;
  }

  return [];
}

// Graceful process shutdown handler for database connection pool
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Draining and closing MySQL connection pool...`);
  if (pool) {
    try {
      await pool.end();
      console.log('✅ MySQL connection pool successfully closed.');
    } catch (err) {
      console.error('⚠️ Error closing MySQL connection pool:', err.message);
    }
  }
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default pool;


