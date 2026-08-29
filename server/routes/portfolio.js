import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/portfolio
router.get('/portfolio', async (req, res, next) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM portfolio ORDER BY id DESC';
    let params = [];

    if (category && category !== 'All') {
      sql = 'SELECT * FROM portfolio WHERE category = ? ORDER BY id DESC';
      params = [category];
    }

    const items = await query(sql, params);
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
});

export default router;
