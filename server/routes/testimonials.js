import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/testimonials
router.get('/testimonials', async (req, res, next) => {
  try {
    const reviews = await query('SELECT * FROM testimonials ORDER BY id DESC', []);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
});

export default router;
