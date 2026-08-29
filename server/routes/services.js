import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/services
router.get('/services', async (req, res, next) => {
  try {
    const services = await query('SELECT * FROM services ORDER BY number ASC', []);
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
});

export default router;
