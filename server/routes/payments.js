import express from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

const UPI_VPA = '8072443590@okbizaxis';
const PAYEE_NAME = 'NAGORA Digital Agency';

// Helper function to generate unique Payment Request Tokens & Receipt IDs
function generateRequestToken() {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `NAG-REQ-${year}-${randomHex}`;
}

function generateReceiptRef() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `NAG-PAY-${randomNum}`;
}

// ---------------------------------------------------------------------------
// 1. POST /api/payment-requests — Create/Calculate a Payment Request
// ---------------------------------------------------------------------------
const createRequestSchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  service_name: z.string().min(1, 'Service selection is required'),
  plan_type: z.enum(['Full', 'Advance_50', 'Installments_Monthly']),
  total_project_amount: z.number().positive('Project amount must be greater than 0'),
  installment_number: z.number().optional().default(1),
  total_installments: z.number().optional().default(1),
});

router.post('/payment-requests', async (req, res, next) => {
  try {
    const data = createRequestSchema.parse(req.body);
    
    // SERVER-SIDE AMOUNT CALCULATION (Cannot be altered by frontend)
    let amountDue = 0;
    if (data.plan_type === 'Full') {
      amountDue = data.total_project_amount;
    } else if (data.plan_type === 'Advance_50') {
      amountDue = Math.round(data.total_project_amount * 0.5);
    } else if (data.plan_type === 'Installments_Monthly') {
      // Advance is 50%, remaining 50% split across installments
      const remainingBalance = data.total_project_amount * 0.5;
      const totalInst = data.total_installments > 1 ? data.total_installments : 3;
      amountDue = Math.round(remainingBalance / totalInst);
    }

    const token = generateRequestToken();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const sql = `
      INSERT INTO payment_requests (
        request_token, client_name, email, phone, company,
        service_name, plan_type, total_project_amount, amount_due,
        installment_number, total_installments, due_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAYMENT_PENDING')
    `;

    try {
      await query(sql, [
        token,
        data.client_name,
        data.email,
        data.phone,
        data.company || '',
        data.service_name,
        data.plan_type,
        data.total_project_amount,
        amountDue,
        data.installment_number || 1,
        data.total_installments || 1,
        dueDate
      ]);
    } catch (dbErr) {
      console.warn('⚠️ payment_requests DB write warning:', dbErr.message);
    }

    res.status(201).json({
      success: true,
      token,
      request: {
        requestToken: token,
        clientName: data.client_name,
        email: data.email,
        phone: data.phone,
        serviceName: data.service_name,
        planType: data.plan_type,
        totalProjectAmount: data.total_project_amount,
        amountDue,
        dueDate,
        upiVpa: UPI_VPA,
        payeeName: PAYEE_NAME,
        status: 'PAYMENT_PENDING'
      }
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
    }
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 2. POST /api/payments/submit — Submit UTR for Verification
// ---------------------------------------------------------------------------
const submitUtrSchema = z.object({
  request_token: z.string().optional(),
  client_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  service_name: z.string().min(1),
  plan_type: z.enum(['Full', 'Advance_50', 'Installments_Monthly']),
  total_project_amount: z.number().positive(),
  utr_number: z.string().min(6, 'Transaction Reference / UTR must be at least 6 characters'),
  notes: z.string().optional(),
});

router.post('/payments/submit', async (req, res, next) => {
  try {
    const data = submitUtrSchema.parse(req.body);
    const cleanUtr = data.utr_number.trim();

    // DUPLICATE UTR PROTECTION: Check if UTR is already submitted/verified
    try {
      const existing = await query('SELECT id, payment_ref, status FROM payments WHERE utr_number = ?', [cleanUtr]);
      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `The UTR / Transaction Reference '${cleanUtr}' has already been submitted under Reference ${existing[0].payment_ref} (Status: ${existing[0].status}). Duplicate submissions are not allowed.`
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ Payments table lookup warning:', dbErr.message);
    }

    // SERVER-SIDE AMOUNT CALCULATION (Re-validated on server)
    let amountDue = 0;
    if (data.plan_type === 'Full') {
      amountDue = data.total_project_amount;
    } else if (data.plan_type === 'Advance_50') {
      amountDue = Math.round(data.total_project_amount * 0.5);
    } else {
      amountDue = Math.round((data.total_project_amount * 0.5) / 3);
    }

    const paymentRef = generateReceiptRef();
    const token = data.request_token || generateRequestToken();

    const sql = `
      INSERT INTO payments (
        payment_ref, request_token, client_name, email, phone, company,
        service_name, payment_type, amount, utr_number, upi_id_used,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UNDER_REVIEW', ?)
    `;

    const values = [
      paymentRef,
      token,
      data.client_name,
      data.email,
      data.phone,
      data.company || '',
      data.service_name,
      data.plan_type,
      amountDue,
      cleanUtr,
      UPI_VPA,
      data.notes || ''
    ];

    try {
      await query(sql, values);
      // Update payment_requests status if token exists
      await query(`UPDATE payment_requests SET status = 'UNDER_REVIEW' WHERE request_token = ?`, [token]);
    } catch (insertErr) {
      console.error('Database insert error:', insertErr.message);
    }

    // RETURN ACKNOWLEDGEMENT (NOT AN OFFICIAL RECEIPT UNTIL ADMIN VERIFICATION)
    const acknowledgement = {
      paymentRef,
      requestToken: token,
      clientName: data.client_name,
      email: data.email,
      phone: data.phone,
      serviceName: data.service_name,
      planType: data.plan_type,
      submittedAmount: amountDue,
      utrNumber: cleanUtr,
      upiIdUsed: UPI_VPA,
      status: 'UNDER_REVIEW',
      message: 'Payment Submission Received. Awaiting Admin Verification.',
      timestamp: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Your Transaction Reference / UTR has been submitted successfully and is currently UNDER REVIEW.',
      acknowledgement
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
    }
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 3. GET /api/payment-status/:identifier — Customer Payment Status & Ledger
// ---------------------------------------------------------------------------
router.get('/payment-status/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params; // Token OR Phone OR Receipt Ref
    const cleanId = identifier.trim();

    let txns = [];
    try {
      txns = await query(
        `SELECT * FROM payments WHERE request_token = ? OR phone = ? OR payment_ref = ? ORDER BY created_at DESC`,
        [cleanId, cleanId, cleanId]
      );
    } catch (err) {
      console.warn('Unable to query payments for status:', err.message);
    }

    if (!txns || txns.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No project payment record found matching your query. Please check your token or phone number.'
      });
    }

    const latest = txns[0];
    const totalProjectAmount = latest.payment_type === 'Full' 
      ? Number(latest.amount) 
      : (latest.payment_type === 'Advance_50' ? Number(latest.amount) * 2 : Number(latest.amount) * 6);

    const verifiedPayments = txns.filter(t => t.status === 'VERIFIED');
    const totalPaid = verifiedPayments.reduce((sum, t) => sum + Number(t.amount), 0);
    const remainingBalance = Math.max(0, totalProjectAmount - totalPaid);
    const progressPercentage = totalProjectAmount > 0 ? Math.min(100, Math.round((totalPaid / totalProjectAmount) * 100)) : 0;

    let nextDueAmount = 0;
    if (remainingBalance > 0) {
      nextDueAmount = Math.min(remainingBalance, latest.payment_type === 'Installments_Monthly' ? Math.round((totalProjectAmount * 0.5) / 3) : remainingBalance);
    }

    const paymentSchedule = [
      {
        title: 'Advance Payment (50%)',
        amount: Math.round(totalProjectAmount * 0.5),
        status: verifiedPayments.length > 0 ? 'VERIFIED' : (txns.some(t => t.status === 'UNDER_REVIEW') ? 'UNDER_REVIEW' : 'DUE'),
        date: txns[0]?.created_at || 'Pending'
      },
      {
        title: 'Installment 1 (0% Interest)',
        amount: Math.round((totalProjectAmount * 0.5) / 3),
        status: verifiedPayments.length > 1 ? 'VERIFIED' : (remainingBalance > 0 && verifiedPayments.length === 1 ? 'DUE' : 'UPCOMING'),
        date: '30 days post-advance'
      },
      {
        title: 'Installment 2 (0% Interest)',
        amount: Math.round((totalProjectAmount * 0.5) / 3),
        status: verifiedPayments.length > 2 ? 'VERIFIED' : 'UPCOMING',
        date: '60 days post-advance'
      },
      {
        title: 'Installment 3 (Final Settlement)',
        amount: Math.round((totalProjectAmount * 0.5) / 3),
        status: verifiedPayments.length > 3 ? 'VERIFIED' : 'UPCOMING',
        date: '90 days post-advance'
      }
    ];

    res.json({
      success: true,
      summary: {
        requestToken: latest.request_token,
        clientName: latest.client_name,
        email: latest.email,
        phone: latest.phone,
        company: latest.company,
        serviceName: latest.service_name,
        planType: latest.payment_type,
        totalProjectAmount,
        verifiedPaidAmount: totalPaid,
        remainingBalance,
        progressPercentage,
        nextDueAmount,
        nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isFullyPaid: remainingBalance === 0
      },
      schedule: paymentSchedule,
      transactions: txns
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 4. GET /api/payments/receipt/:paymentRef — Retrieve Official Verified Receipt
// ---------------------------------------------------------------------------
router.get('/payments/receipt/:paymentRef', async (req, res, next) => {
  try {
    const { paymentRef } = req.params;
    const records = await query('SELECT * FROM payments WHERE payment_ref = ?', [paymentRef]);
    
    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const txn = records[0];

    // RULE: Official Receipt is only issued for VERIFIED payments!
    if (txn.status !== 'VERIFIED') {
      return res.status(400).json({
        success: false,
        message: `Official Payment Receipt is only generated for VERIFIED payments. Current Status: ${txn.status}.`,
        status: txn.status
      });
    }

    res.json({
      success: true,
      receipt: {
        receiptNumber: txn.payment_ref,
        requestToken: txn.request_token,
        paymentDate: txn.verified_at || txn.created_at,
        clientName: txn.client_name,
        email: txn.email,
        phone: txn.phone,
        company: txn.company,
        serviceName: txn.service_name,
        paymentType: txn.payment_type,
        amount: Number(txn.amount),
        paymentMethod: 'UPI VPA',
        upiIdUsed: txn.upi_id_used,
        utrNumber: txn.utr_number,
        status: 'VERIFIED',
        verifiedBy: txn.verified_by || 'Admin',
        agency: PAYEE_NAME
      }
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 5. GET /api/admin/payments — Admin Payment Management Listing
// ---------------------------------------------------------------------------
router.get('/payments', authenticateAdmin, async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM payments WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (client_name LIKE ? OR email LIKE ? OR phone LIKE ? OR utr_number LIKE ? OR payment_ref LIKE ? OR request_token LIKE ?)';
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    sql += ' ORDER BY created_at DESC';

    let payments = [];
    try {
      payments = await query(sql, params);
    } catch (err) {
      console.warn('Unable to query payments table:', err.message);
      payments = [];
    }

    res.json({ success: true, count: payments.length, payments });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 6. POST /api/admin/payments/:id/verify — Admin Verification Endpoint
// ---------------------------------------------------------------------------
router.post('/admin/payments/:id/verify', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminUser = req.user?.username || 'Admin';

    const records = await query('SELECT * FROM payments WHERE id = ?', [id]);
    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const currentTxn = records[0];
    if (currentTxn.status === 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'This payment transaction has already been verified.' });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Update payment transaction status to VERIFIED
    await query(
      `UPDATE payments SET status = 'VERIFIED', verified_by = ?, verified_at = ?, notes = COALESCE(?, notes) WHERE id = ?`,
      [adminUser, now, notes || null, id]
    );

    // Update payment_requests status
    if (currentTxn.request_token) {
      await query(`UPDATE payment_requests SET status = 'VERIFIED' WHERE request_token = ?`, [currentTxn.request_token]);
    }

    // Insert Audit Log
    try {
      await query(
        `INSERT INTO payment_audit_logs (payment_ref, action, performed_by, previous_status, new_status, details) VALUES (?, ?, ?, ?, ?, ?)`,
        [currentTxn.payment_ref, 'VERIFY_PAYMENT', adminUser, currentTxn.status, 'VERIFIED', notes || 'Admin verified UTR transaction']
      );
    } catch (auditErr) {
      console.warn('Audit log write error:', auditErr.message);
    }

    res.json({
      success: true,
      message: `Payment ${currentTxn.payment_ref} verified successfully. Official receipt is now active.`,
      paymentRef: currentTxn.payment_ref
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 7. POST /api/admin/payments/:id/reject — Admin Rejection Endpoint
// ---------------------------------------------------------------------------
router.post('/admin/payments/:id/reject', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const adminUser = req.user?.username || 'Admin';

    if (!rejection_reason || rejection_reason.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required.' });
    }

    const records = await query('SELECT * FROM payments WHERE id = ?', [id]);
    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const currentTxn = records[0];

    await query(
      `UPDATE payments SET status = 'REJECTED', rejection_reason = ?, verified_by = ?, verified_at = NOW() WHERE id = ?`,
      [rejection_reason, adminUser, id]
    );

    if (currentTxn.request_token) {
      await query(`UPDATE payment_requests SET status = 'REJECTED' WHERE request_token = ?`, [currentTxn.request_token]);
    }

    // Insert Audit Log
    try {
      await query(
        `INSERT INTO payment_audit_logs (payment_ref, action, performed_by, previous_status, new_status, details) VALUES (?, ?, ?, ?, ?, ?)`,
        [currentTxn.payment_ref, 'REJECT_PAYMENT', adminUser, currentTxn.status, 'REJECTED', rejection_reason]
      );
    } catch (auditErr) {
      console.warn('Audit log write error:', auditErr.message);
    }

    res.json({
      success: true,
      message: `Payment ${currentTxn.payment_ref} rejected.`
    });
  } catch (err) {
    next(err);
  }
});

export default router;
