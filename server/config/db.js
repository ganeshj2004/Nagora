import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let useFallback = false;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nagora_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// In-Memory Data Store Fallback for zero-friction local testing
const inMemoryStore = {
  enquiries: [
    {
      id: 1,
      name: 'Rahul Sharma',
      phone: '+91 98765 11223',
      email: 'rahul@auraproperties.com',
      company: 'Aura Real Estate',
      service: 'Website Development',
      budget: '₹1,50,000 - ₹3,50,000',
      message: 'We want a modern high-speed property listing website with virtual tour integration.',
      status: 'New',
      created_at: new Date().toISOString(),
    },
  ],
  services: [],
  portfolio: [],
  testimonials: [],
};

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.log('MySQL pool init notice: Using in-memory provider fallback until MySQL connection established.');
  useFallback = true;
}

export async function query(sql, params) {
  if (pool && !useFallback) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.warn('MySQL Query fallback activated:', err.message);
      useFallback = true;
    }
  }
  
  // Return fallback response for queries
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

export default pool;
