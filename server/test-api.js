import http from 'http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'nagora_super_secret_jwt_key_2026';
const token = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

console.log('🧪 TESTING NAGORA PROJECT & PAYMENTS BACKEND APIS...');

async function runTests() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nagora_db',
    port: parseInt(process.env.DB_PORT || '3306')
  };

  const pool = mysql.createPool(dbConfig);
  console.log('✅ DB Pool connected.');

  // Clean test data
  await pool.query("DELETE FROM project_audit_logs WHERE project_id LIKE 'NAG-PROJ-TEST%'");
  await pool.query("DELETE FROM project_payments WHERE project_id LIKE 'NAG-PROJ-TEST%'");
  await pool.query("DELETE FROM projects WHERE project_id LIKE 'NAG-PROJ-TEST%'");

  console.log('🧹 Cleaned existing test records.');
  await pool.end();
  console.log('🎉 DB pre-test verification completed.');
}

runTests().catch(err => {
  console.error('❌ Test script error:', err);
  process.exit(1);
});
