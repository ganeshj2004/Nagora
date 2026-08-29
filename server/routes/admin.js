import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nagora_super_secret_jwt_key_2026';

// POST /api/admin/login
router.post('/admin/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Default admin credential fallback check
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ success: true, token, user: { username: 'admin', role: 'admin' } });
    }

    // Database lookup
    const users = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/enquiries (Protected)
router.get('/admin/enquiries', authenticateAdmin, async (req, res, next) => {
  try {
    const enquiries = await query('SELECT * FROM enquiries ORDER BY id DESC', []);
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/enquiries/:id (Protected)
router.patch('/admin/enquiries/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    await query('UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Enquiry #${id} status updated to ${status}.` });
  } catch (err) {
    next(err);
  }
});

export default router;
