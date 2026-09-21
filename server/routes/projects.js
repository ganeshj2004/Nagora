import express from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

const getUpiVpa = () => process.env.UPI_VPA || '8072443590@okbizaxis';
const getPayeeName = () => process.env.PAYEE_NAME || 'NAGORA Digital Agency';
const getAppUrl = () => process.env.APP_URL || 'http://localhost:3000';

// Helper Generators
function generateProjectId() {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NAG-PROJ-${year}-${randomHex}`;
}

function generatePaymentId(projectId, index) {
  const suffix = String(index).padStart(2, '0');
  return `NAG-PAY-${projectId.replace('NAG-PROJ-', '')}-${suffix}`;
}

function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NAG-REC-${year}-${randomHex}`;
}

// ---------------------------------------------------------------------------
// 1. POST /api/admin/projects — Create Project & Payment Schedule (Admin Only)
// ---------------------------------------------------------------------------
const createProjectSchema = z.object({
  client_name: z.string().min(2, 'Client name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  service_name: z.string().min(1, 'Service selection is required'),
  total_amount: z.number().positive('Total project amount must be greater than 0'),
  plan_type: z.enum(['Full', 'Advance_50', 'Installments_Monthly']),
  total_installments: z.number().optional().default(1),
});

router.post('/admin/projects', authenticateAdmin, async (req, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);
    const adminUser = req.user?.username || 'Admin';

    const projectId = generateProjectId();
    const totalAmount = data.total_amount;
    const planType = data.plan_type;
    let totalInstallmentsCount = 1;

    if (planType === 'Installments_Monthly') {
      totalInstallmentsCount = data.total_installments && data.total_installments >= 1 ? data.total_installments : 3;
    }

    // Build Math Schedule (Authoritative Server-Side Calculation)
    const scheduleItems = [];
    const today = new Date();

    const addDays = (dateObj, days) => {
      const result = new Date(dateObj);
      result.setDate(result.getDate() + days);
      return result.toISOString().split('T')[0];
    };

    if (planType === 'Full') {
      scheduleItems.push({
        installment_number: 1,
        milestone_title: 'Full Payment (100%)',
        amount: totalAmount,
        due_date: addDays(today, 7),
        status: 'PAYMENT_PENDING'
      });
    } else if (planType === 'Advance_50') {
      const advanceAmount = Math.round(totalAmount * 0.5);
      const finalAmount = totalAmount - advanceAmount;

      scheduleItems.push({
        installment_number: 1,
        milestone_title: 'Advance Payment (50%)',
        amount: advanceAmount,
        due_date: addDays(today, 7),
        status: 'PAYMENT_PENDING'
      });
      scheduleItems.push({
        installment_number: 2,
        milestone_title: 'Final Settlement (50%)',
        amount: finalAmount,
        due_date: addDays(today, 30),
        status: 'CREATED'
      });
    } else if (planType === 'Installments_Monthly') {
      // 50% Advance + N Monthly EMIs
      const advanceAmount = Math.round(totalAmount * 0.5);
      const remainingBalance = totalAmount - advanceAmount;

      scheduleItems.push({
        installment_number: 1,
        milestone_title: 'Advance Payment (50%)',
        amount: advanceAmount,
        due_date: addDays(today, 7),
        status: 'PAYMENT_PENDING'
      });

      const numEmi = totalInstallmentsCount;
      const baseEmi = Math.floor(remainingBalance / numEmi);
      const remainder = remainingBalance - (baseEmi * numEmi);

      for (let i = 1; i <= numEmi; i++) {
        // Add remainder to the final EMI to ensure sum mathematically equals total balance
        const emiAmount = (i === numEmi) ? (baseEmi + remainder) : baseEmi;
        scheduleItems.push({
          installment_number: i + 1,
          milestone_title: `Installment ${i} of ${numEmi} (0% Interest)`,
          amount: emiAmount,
          due_date: addDays(today, i * 30),
          status: 'CREATED'
        });
      }
    }

    // DB Operations: Insert Project
    const projectSql = `
      INSERT INTO projects (
        project_id, client_name, phone, email, company,
        service_name, total_amount, plan_type, total_installments,
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
    `;

    await query(projectSql, [
      projectId,
      data.client_name,
      data.phone,
      data.email,
      data.company || '',
      data.service_name,
      totalAmount,
      planType,
      planType === 'Installments_Monthly' ? totalInstallmentsCount : (planType === 'Advance_50' ? 2 : 1),
      adminUser
    ]);

    // Insert Schedule Items
    const createdPayments = [];
    for (let idx = 0; idx < scheduleItems.length; idx++) {
      const item = scheduleItems[idx];
      const paymentId = generatePaymentId(projectId, idx + 1);

      const paySql = `
        INSERT INTO project_payments (
          payment_id, project_id, installment_number, milestone_title,
          amount, due_date, status, upi_id_used
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await query(paySql, [
        paymentId,
        projectId,
        item.installment_number,
        item.milestone_title,
        item.amount,
        item.due_date,
        item.status,
        getUpiVpa()
      ]);

      createdPayments.push({
        paymentId,
        installmentNumber: item.installment_number,
        milestoneTitle: item.milestone_title,
        amount: item.amount,
        dueDate: item.due_date,
        status: item.status
      });
    }

    // Insert Audit Log
    try {
      await query(
        `INSERT INTO project_audit_logs (project_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
        [projectId, 'CREATE_PROJECT', adminUser, `Created project for ${data.client_name} (${planType} plan, Total: ₹${totalAmount})`]
      );
    } catch (auditErr) {
      console.warn('⚠️ Project audit log error:', auditErr.message);
    }

    const initialPayment = createdPayments[0];
    const paymentLink = `${getAppUrl()}/payment?projectId=${projectId}&paymentId=${initialPayment.paymentId}`;

    const clientNotificationText = 
      `📌 *NAGORA Digital Agency — Project Confirmation*\n\n` +
      `Hello ${data.client_name},\n` +
      `Your project for *${data.service_name}* has been confirmed!\n\n` +
      `🆔 *Project ID:* ${projectId}\n` +
      `💳 *Payment ID:* ${initialPayment.paymentId}\n` +
      `💰 *Total Project Amount:* ₹${totalAmount.toLocaleString('en-IN')}\n` +
      `💵 *Current Amount Due (${initialPayment.milestoneTitle}):* ₹${initialPayment.amount.toLocaleString('en-IN')}\n` +
      `📅 *Due Date:* ${initialPayment.dueDate}\n\n` +
      `🔗 *Pay via UPI Direct Link:* ${paymentLink}\n\n` +
      `Thank you for choosing NAGORA Digital Agency!`;

    res.status(201).json({
      success: true,
      message: 'Project confirmation created successfully with payment schedule.',
      projectId,
      paymentLink,
      clientNotificationText,
      project: {
        projectId,
        clientName: data.client_name,
        phone: data.phone,
        email: data.email,
        company: data.company || '',
        serviceName: data.service_name,
        totalAmount,
        planType,
        totalInstallments: totalInstallmentsCount,
        status: 'ACTIVE',
        createdBy: adminUser,
        createdAt: new Date().toISOString()
      },
      schedule: createdPayments
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
    }
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 2. GET /api/admin/projects — Admin Project Listing
// ---------------------------------------------------------------------------
router.get('/admin/projects', authenticateAdmin, async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let sql = `
      SELECT p.*,
        COALESCE(SUM(CASE WHEN pp.status = 'VERIFIED' THEN pp.amount ELSE 0 END), 0) as paid_amount,
        COUNT(pp.id) as total_milestones,
        SUM(CASE WHEN pp.status = 'VERIFIED' THEN 1 ELSE 0 END) as verified_milestones
      FROM projects p
      LEFT JOIN project_payments pp ON p.project_id = pp.project_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (p.client_name LIKE ? OR p.email LIKE ? OR p.phone LIKE ? OR p.project_id LIKE ? OR p.service_name LIKE ? OR p.company LIKE ?)';
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    sql += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const projects = await query(sql, params);

    res.json({
      success: true,
      count: projects.length,
      projects: projects.map(p => ({
        id: p.id,
        projectId: p.project_id,
        clientName: p.client_name,
        phone: p.phone,
        email: p.email,
        company: p.company,
        serviceName: p.service_name,
        totalAmount: Number(p.total_amount),
        paidAmount: Number(p.paid_amount),
        remainingBalance: Math.max(0, Number(p.total_amount) - Number(p.paid_amount)),
        planType: p.plan_type,
        totalInstallments: p.total_installments,
        totalMilestones: p.total_milestones,
        verifiedMilestones: p.verified_milestones,
        status: p.status,
        createdBy: p.created_by,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }))
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 3. GET /api/admin/projects/:projectId — Single Project & Schedule Detail
// ---------------------------------------------------------------------------
router.get('/admin/projects/:projectId', authenticateAdmin, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const projRows = await query(`SELECT * FROM projects WHERE project_id = ?`, [projectId]);
    if (!projRows || projRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const proj = projRows[0];
    const payments = await query(
      `SELECT * FROM project_payments WHERE project_id = ? ORDER BY installment_number ASC`,
      [projectId]
    );

    const logs = await query(
      `SELECT * FROM project_audit_logs WHERE project_id = ? ORDER BY created_at DESC`,
      [projectId]
    );

    const totalPaid = payments
      .filter(p => p.status === 'VERIFIED')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    res.json({
      success: true,
      project: {
        id: proj.id,
        projectId: proj.project_id,
        clientName: proj.client_name,
        phone: proj.phone,
        email: proj.email,
        company: proj.company,
        serviceName: proj.service_name,
        totalAmount: Number(proj.total_amount),
        paidAmount: totalPaid,
        remainingBalance: Math.max(0, Number(proj.total_amount) - totalPaid),
        planType: proj.plan_type,
        totalInstallments: proj.total_installments,
        status: proj.status,
        createdBy: proj.created_by,
        createdAt: proj.created_at
      },
      payments: payments.map(p => ({
        id: p.id,
        paymentId: p.payment_id,
        projectId: p.project_id,
        installmentNumber: p.installment_number,
        milestoneTitle: p.milestone_title,
        amount: Number(p.amount),
        dueDate: p.due_date,
        status: p.status,
        utrNumber: p.utr_number,
        upiIdUsed: p.upi_id_used,
        verifiedBy: p.verified_by,
        verifiedAt: p.verified_at,
        rejectionReason: p.rejection_reason,
        receiptNumber: p.receipt_number,
        notes: p.notes,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      })),
      auditLogs: logs
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 4. POST /api/payment/verify-entry — Customer Entry Verification
// ---------------------------------------------------------------------------
const verifyEntrySchema = z.object({
  project_id: z.string().min(1, 'Project ID is required'),
  payment_id: z.string().optional(),
});

router.post('/payment/verify-entry', async (req, res, next) => {
  try {
    const { project_id, payment_id } = verifyEntrySchema.parse(req.body);
    const cleanProjId = project_id.trim();
    const cleanPayId = payment_id ? payment_id.trim() : null;

    const projRows = await query(`SELECT * FROM projects WHERE project_id = ?`, [cleanProjId]);
    if (!projRows || projRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Project ID '${cleanProjId}' was not found. Please check your Project Confirmation details.`
      });
    }

    const proj = projRows[0];
    let payRows = [];

    if (cleanPayId) {
      payRows = await query(
        `SELECT * FROM project_payments WHERE project_id = ? AND payment_id = ?`,
        [cleanProjId, cleanPayId]
      );
      if (!payRows || payRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Payment ID '${cleanPayId}' does not belong to Project '${cleanProjId}'.`
        });
      }
    } else {
      // Find current pending or active payment
      payRows = await query(
        `SELECT * FROM project_payments WHERE project_id = ? AND status IN ('PAYMENT_PENDING', 'UTR_SUBMITTED', 'UNDER_REVIEW', 'REJECTED') ORDER BY installment_number ASC LIMIT 1`,
        [cleanProjId]
      );
      if (!payRows || payRows.length === 0) {
        // Fallback to first payment if all completed or created
        payRows = await query(
          `SELECT * FROM project_payments WHERE project_id = ? ORDER BY installment_number ASC LIMIT 1`,
          [cleanProjId]
        );
      }
    }

    const currentPayment = payRows[0];

    res.json({
      success: true,
      project: {
        projectId: proj.project_id,
        clientName: proj.client_name,
        email: proj.email,
        phone: proj.phone,
        company: proj.company,
        serviceName: proj.service_name,
        totalAmount: Number(proj.total_amount),
        planType: proj.plan_type,
        status: proj.status
      },
      payment: {
        paymentId: currentPayment.payment_id,
        installmentNumber: currentPayment.installment_number,
        milestoneTitle: currentPayment.milestone_title,
        amountDue: Number(currentPayment.amount),
        dueDate: currentPayment.due_date,
        status: currentPayment.status,
        utrNumber: currentPayment.utr_number,
        rejectionReason: currentPayment.rejection_reason,
        receiptNumber: currentPayment.receipt_number,
        notes: currentPayment.notes,
        upiVpa: getUpiVpa(),
        payeeName: getPayeeName()
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
// 5. POST /api/payment/submit-utr — Customer Submits UTR Number
// ---------------------------------------------------------------------------
const submitUtrSchema = z.object({
  project_id: z.string().min(1, 'Project ID is required'),
  payment_id: z.string().min(1, 'Payment ID is required'),
  utr_number: z.string().min(6, 'UTR / Transaction Reference must be at least 6 characters'),
  notes: z.string().optional(),
});

router.post('/payment/submit-utr', async (req, res, next) => {
  try {
    const data = submitUtrSchema.parse(req.body);
    const cleanProjId = data.project_id.trim();
    const cleanPayId = data.payment_id.trim();
    const cleanUtr = data.utr_number.trim();

    // Verify Project & Payment existence
    const payRows = await query(
      `SELECT * FROM project_payments WHERE project_id = ? AND payment_id = ?`,
      [cleanProjId, cleanPayId]
    );

    if (!payRows || payRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Specified Payment ID '${cleanPayId}' was not found for Project '${cleanProjId}'.`
      });
    }

    const currentPay = payRows[0];

    // DUPLICATE UTR CHECK: Only block if UTR is already in status VERIFIED or UNDER_REVIEW/UTR_SUBMITTED
    const dupCheck = await query(
      `SELECT id, payment_id, project_id, status FROM project_payments WHERE utr_number = ? AND status IN ('VERIFIED', 'UNDER_REVIEW', 'UTR_SUBMITTED') AND payment_id != ?`,
      [cleanUtr, cleanPayId]
    );

    if (dupCheck && dupCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The Transaction Reference / UTR '${cleanUtr}' has already been submitted for Payment ID ${dupCheck[0].payment_id} (Status: ${dupCheck[0].status}). Duplicate submissions are not allowed.`
      });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Update payment record
    await query(
      `UPDATE project_payments SET status = 'UTR_SUBMITTED', utr_number = ?, notes = ?, updated_at = ? WHERE payment_id = ?`,
      [cleanUtr, data.notes || '', now, cleanPayId]
    );

    // Audit Log
    try {
      await query(
        `INSERT INTO project_audit_logs (project_id, payment_id, action, performed_by, previous_status, new_status, details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cleanProjId, cleanPayId, 'SUBMIT_UTR', 'Client', currentPay.status, 'UTR_SUBMITTED', `Client submitted UTR: ${cleanUtr}`]
      );
    } catch (auditErr) {
      console.warn('⚠️ Audit log write warning:', auditErr.message);
    }

    res.json({
      success: true,
      message: 'Your Transaction Reference / UTR has been submitted successfully and is currently UNDER REVIEW by our accounts team.',
      acknowledgement: {
        projectId: cleanProjId,
        paymentId: cleanPayId,
        milestoneTitle: currentPay.milestone_title,
        amount: Number(currentPay.amount),
        utrNumber: cleanUtr,
        upiIdUsed: getUpiVpa(),
        status: 'UTR_SUBMITTED',
        message: 'Awaiting Admin Verification',
        submittedAt: now
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
// 6. GET /api/payment/status — Customer Status & Ledger Query
// ---------------------------------------------------------------------------
router.get('/payment/status', async (req, res, next) => {
  try {
    const { projectId, paymentId, query: searchId } = req.query;
    const cleanProjId = (projectId || searchId || '').trim();
    const cleanPayId = (paymentId || '').trim();

    if (!cleanProjId) {
      return res.status(400).json({ success: false, message: 'Project ID or Search Identifier is required.' });
    }

    // Lookup project by project_id OR phone
    let projRows = await query(`SELECT * FROM projects WHERE project_id = ? OR phone = ? OR email = ?`, [cleanProjId, cleanProjId, cleanProjId]);

    if (!projRows || projRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No project record found for '${cleanProjId}'. Please verify your Project ID or Phone number.`
      });
    }

    const proj = projRows[0];
    const targetProjId = proj.project_id;

    const payments = await query(
      `SELECT * FROM project_payments WHERE project_id = ? ORDER BY installment_number ASC`,
      [targetProjId]
    );

    const verifiedPayments = payments.filter(p => p.status === 'VERIFIED');
    const totalPaid = verifiedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalAmount = Number(proj.total_amount);
    const remainingBalance = Math.max(0, totalAmount - totalPaid);
    const progressPercentage = totalAmount > 0 ? Math.min(100, Math.round((totalPaid / totalAmount) * 100)) : 0;

    // Determine target payment item
    let selectedPayment = null;
    if (cleanPayId) {
      selectedPayment = payments.find(p => p.payment_id === cleanPayId);
    }
    if (!selectedPayment) {
      selectedPayment = payments.find(p => ['PAYMENT_PENDING', 'UTR_SUBMITTED', 'UNDER_REVIEW', 'REJECTED'].includes(p.status)) || payments[0];
    }

    res.json({
      success: true,
      summary: {
        projectId: proj.project_id,
        clientName: proj.client_name,
        email: proj.email,
        phone: proj.phone,
        company: proj.company,
        serviceName: proj.service_name,
        planType: proj.plan_type,
        totalProjectAmount: totalAmount,
        verifiedPaidAmount: totalPaid,
        remainingBalance,
        progressPercentage,
        projectStatus: proj.status,
        isFullyPaid: remainingBalance === 0
      },
      currentPayment: selectedPayment ? {
        paymentId: selectedPayment.payment_id,
        installmentNumber: selectedPayment.installment_number,
        milestoneTitle: selectedPayment.milestone_title,
        amount: Number(selectedPayment.amount),
        dueDate: selectedPayment.due_date,
        status: selectedPayment.status,
        utrNumber: selectedPayment.utr_number,
        rejectionReason: selectedPayment.rejection_reason,
        receiptNumber: selectedPayment.receipt_number,
        upiVpa: getUpiVpa(),
        payeeName: getPayeeName()
      } : null,
      schedule: payments.map(p => ({
        paymentId: p.payment_id,
        installmentNumber: p.installment_number,
        milestoneTitle: p.milestone_title,
        amount: Number(p.amount),
        dueDate: p.due_date,
        status: p.status,
        utrNumber: p.utr_number,
        receiptNumber: p.receipt_number,
        verifiedAt: p.verified_at
      }))
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 7. GET /api/payment/receipt/:paymentId — Official Verified Receipt
// ---------------------------------------------------------------------------
router.get('/payment/receipt/:paymentId', async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const cleanPayId = paymentId.trim();

    const payRows = await query(`SELECT * FROM project_payments WHERE payment_id = ? OR receipt_number = ?`, [cleanPayId, cleanPayId]);

    if (!payRows || payRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const payItem = payRows[0];

    // STRICT SPECIFICATION REQUIREMENT: Receipts only generated for VERIFIED status
    if (payItem.status !== 'VERIFIED') {
      return res.status(400).json({
        success: false,
        message: `Official Payment Receipts can only be generated for VERIFIED payments. Current status: ${payItem.status}.`,
        status: payItem.status
      });
    }

    const projRows = await query(`SELECT * FROM projects WHERE project_id = ?`, [payItem.project_id]);
    const proj = projRows[0] || {};

    res.json({
      success: true,
      receipt: {
        receiptNumber: payItem.receipt_number || generateReceiptNumber(),
        paymentId: payItem.payment_id,
        projectId: payItem.project_id,
        clientName: proj.client_name || 'Valued Client',
        email: proj.email || '',
        phone: proj.phone || '',
        company: proj.company || '',
        serviceName: proj.service_name || 'Digital Services',
        milestoneTitle: payItem.milestone_title,
        amountPaid: Number(payItem.amount),
        utrNumber: payItem.utr_number,
        upiIdUsed: payItem.upi_id_used || getUpiVpa(),
        paymentDate: payItem.verified_at || payItem.updated_at || payItem.created_at,
        verifiedBy: payItem.verified_by || 'Admin',
        agency: getPayeeName(),
        notes: payItem.notes || ''
      }
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 8. POST /api/admin/project-payments/:paymentId/verify — Admin Verification
// ---------------------------------------------------------------------------
router.post('/admin/project-payments/:paymentId/verify', authenticateAdmin, async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { notes } = req.body;
    const adminUser = req.user?.username || 'Admin';

    const payRows = await query(`SELECT * FROM project_payments WHERE payment_id = ?`, [paymentId]);
    if (!payRows || payRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment transaction record not found.' });
    }

    const currentPay = payRows[0];
    if (currentPay.status === 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'This payment milestone has already been verified.' });
    }

    // MANDATORY WORKFLOW RULE: UTR must exist in database before admin can verify
    if (!currentPay.utr_number || currentPay.utr_number.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Cannot verify payment because no UTR has been submitted by the client.'
      });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const receiptNum = currentPay.receipt_number || generateReceiptNumber();

    // 1. Mark current payment as VERIFIED
    await query(
      `UPDATE project_payments SET status = 'VERIFIED', receipt_number = ?, verified_by = ?, verified_at = ?, notes = COALESCE(?, notes) WHERE payment_id = ?`,
      [receiptNum, adminUser, now, notes || null, paymentId]
    );

    // 2. Activate next pending installment if any exist in 'CREATED' status
    const nextPending = await query(
      `SELECT * FROM project_payments WHERE project_id = ? AND installment_number > ? AND status = 'CREATED' ORDER BY installment_number ASC LIMIT 1`,
      [currentPay.project_id, currentPay.installment_number]
    );

    if (nextPending && nextPending.length > 0) {
      await query(
        `UPDATE project_payments SET status = 'PAYMENT_PENDING' WHERE payment_id = ?`,
        [nextPending[0].payment_id]
      );
    }

    // 3. Check if all project payments are now VERIFIED -> mark project COMPLETED
    const remainingUnverified = await query(
      `SELECT id FROM project_payments WHERE project_id = ? AND status != 'VERIFIED'`,
      [currentPay.project_id]
    );

    if (!remainingUnverified || remainingUnverified.length === 0) {
      await query(`UPDATE projects SET status = 'COMPLETED' WHERE project_id = ?`, [currentPay.project_id]);
    }

    // 4. Log audit record
    try {
      await query(
        `INSERT INTO project_audit_logs (project_id, payment_id, action, performed_by, previous_status, new_status, details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [currentPay.project_id, paymentId, 'VERIFY_PAYMENT', adminUser, currentPay.status, 'VERIFIED', `Verified UTR ${currentPay.utr_number || 'N/A'}, Issued Receipt ${receiptNum}`]
      );
    } catch (auditErr) {
      console.warn('⚠️ Audit log write warning:', auditErr.message);
    }

    res.json({
      success: true,
      message: `Payment ${paymentId} verified successfully. Official receipt ${receiptNum} issued.`,
      receiptNumber: receiptNum,
      paymentId
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 9. POST /api/admin/project-payments/:paymentId/reject — Admin Rejection
// ---------------------------------------------------------------------------
router.post('/admin/project-payments/:paymentId/reject', authenticateAdmin, async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { rejection_reason } = req.body;
    const adminUser = req.user?.username || 'Admin';

    if (!rejection_reason || rejection_reason.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required.' });
    }

    const payRows = await query(`SELECT * FROM project_payments WHERE payment_id = ?`, [paymentId]);
    if (!payRows || payRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment transaction record not found.' });
    }

    const currentPay = payRows[0];

    // MANDATORY WORKFLOW RULE: UTR must exist in database before admin can reject
    if (!currentPay.utr_number || currentPay.utr_number.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject payment because no UTR has been submitted by the client.'
      });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      `UPDATE project_payments SET status = 'REJECTED', rejection_reason = ?, verified_by = ?, verified_at = ? WHERE payment_id = ?`,
      [rejection_reason, adminUser, now, paymentId]
    );

    // Log audit record
    try {
      await query(
        `INSERT INTO project_audit_logs (project_id, payment_id, action, performed_by, previous_status, new_status, details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [currentPay.project_id, paymentId, 'REJECT_PAYMENT', adminUser, currentPay.status, 'REJECTED', rejection_reason]
      );
    } catch (auditErr) {
      console.warn('⚠️ Audit log write warning:', auditErr.message);
    }

    res.json({
      success: true,
      message: `Payment ${paymentId} rejected. Client can re-submit transaction details.`
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 10. POST /api/admin/log-communication — Audit Log Reminder Action
// ---------------------------------------------------------------------------
router.post('/admin/log-communication', authenticateAdmin, async (req, res, next) => {
  try {
    const { project_id, payment_id, channel } = req.body;
    const adminUser = req.user?.username || 'Admin';

    if (project_id && channel) {
      try {
        await query(
          `INSERT INTO project_audit_logs (project_id, payment_id, action, performed_by, details) VALUES (?, ?, ?, ?, ?)`,
          [project_id, payment_id || null, `COMMUNICATION_${channel.toUpperCase()}`, adminUser, `Admin opened ${channel.toUpperCase()} communication link`]
        );
      } catch (dbErr) {
        console.warn('⚠️ Audit log write warning:', dbErr.message);
      }
    }
    res.json({ success: true, message: 'Communication action logged.' });
  } catch (err) {
    next(err);
  }
});

export default router;
