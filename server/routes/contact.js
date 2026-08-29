import express from 'express';
import { z } from 'zod';
import { query } from '../config/db.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const enquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().min(10),
});

// POST /api/enquiries
router.post('/enquiries', contactRateLimiter, async (req, res, next) => {
  try {
    const validatedData = enquirySchema.parse(req.body);

    const sql = `
      INSERT INTO enquiries (name, phone, email, company, service, budget, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'New')
    `;

    const result = await query(sql, [
      validatedData.name,
      validatedData.phone,
      validatedData.email,
      validatedData.company || '',
      validatedData.service,
      validatedData.budget,
      validatedData.message,
    ]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received successfully.',
      enquiryId: result.insertId || Date.now(),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        errors: err.errors,
      });
    }
    next(err);
  }
});

// POST /api/contact
router.post('/contact', contactRateLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const sql = `INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    await query(sql, [name, email, phone || '', message]);

    res.status(201).json({ success: true, message: 'Contact message received.' });
  } catch (err) {
    next(err);
  }
});

export default router;
