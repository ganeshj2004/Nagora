import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Select, 
  MenuItem, 
  Button, 
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  Snackbar
} from '@mui/material';
import { 
  LogOut, 
  RefreshCw, 
  Inbox, 
  CheckCircle, 
  CreditCard, 
  Search, 
  Check, 
  X, 
  Eye, 
  Plus, 
  Copy, 
  ExternalLink, 
  FolderCheck,
  Send,
  Calendar,
  AlertCircle,
  MessageSquare,
  Mail,
  Clock,
  Printer
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const statusOptions = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
const serviceList = [
  'Website Development',
  'SEO & Search Growth',
  'App Development',
  'Photography',
  'Videography',
  'Video Editing',
  'Branding & Visual Identity'
];

const REJECTION_REASONS_LIST = [
  'Invalid UTR',
  'Transaction Not Found',
  'Incorrect Amount',
  'Duplicate Transaction',
  'Other'
];

// Helper: Phone Normalization for WhatsApp (Section 6)
function normalizePhoneForWhatsApp(phoneStr) {
  if (!phoneStr) return '';
  let cleaned = String(phoneStr).replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

// Helper: Dynamic Payment URL (Section 28)
function getPublicPaymentUrl() {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/payment`;
  }
  return 'http://localhost:3000/payment';
}

// Helper: Date Formatter
function formatNiceDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Authoritative Payment Action & State Evaluator (Section 9, 10, 22, 29)
// ---------------------------------------------------------------------------
function getPaymentCardState(payment) {
  const utr = payment?.utrNumber || payment?.utr_number || '';
  const hasUtr = Boolean(utr && String(utr).trim() !== '');
  const status = payment?.status || 'CREATED';

  const isVerified = status === 'VERIFIED' || status === 'PAID';
  const isRefunded = status === 'REFUNDED';
  const isUnderReview = (status === 'UTR_SUBMITTED' || status === 'UNDER_REVIEW') && hasUtr;
  const isRejected = status === 'REJECTED';

  // 1. WhatsApp & Email Reminders:
  // Show for: CREATED, PAYMENT_PENDING, DUE, DUE_SOON, OVERDUE, REJECTED
  // HIDE for: VERIFIED, PAID, REFUNDED, UTR_SUBMITTED, UNDER_REVIEW
  const showReminders = !isVerified && !isRefunded && !isUnderReview;

  // 2. Admin Review Actions (Verify UTR & Reject):
  // MUST ONLY APPEAR if customer has ACTUALLY submitted a UTR (hasUtr is TRUE) AND status is UTR_SUBMITTED / UNDER_REVIEW!
  const showAdminReviewActions = hasUtr && isUnderReview;

  // 3. Receipt Action:
  const showReceipt = isVerified && Boolean(payment?.receiptNumber || payment?.receipt_number);

  return {
    utr,
    hasUtr,
    status,
    isVerified,
    isRefunded,
    isUnderReview,
    isRejected,
    showReminders,
    showAdminReviewActions,
    showReceipt
  };
}

// ---------------------------------------------------------------------------
// Communication Generators
// ---------------------------------------------------------------------------

// 1. Payment Schedule Card Reminder — WhatsApp Concise Template (Section 8, 12, 16)
function generatePaymentReminderWhatsApp(project, payment) {
  const clientName = project.clientName || 'Valued Client';
  const serviceName = project.serviceName || 'Digital Agency Services';
  const projectId = project.projectId;
  const paymentId = payment.paymentId;
  const amountStr = Number(payment.amount).toLocaleString('en-IN');
  const dueDateStr = formatNiceDate(payment.dueDate);
  const paymentUrl = getPublicPaymentUrl();
  const status = payment.status;

  if (status === 'REJECTED') {
    return (
      `Hello ${clientName},\n\n` +
      `Payment verification requires attention for NAGORA Digital Agency.\n\n` +
      `Project:\n${serviceName}\n\n` +
      `Project ID:\n${projectId}\n\n` +
      `Payment ID:\n${paymentId}\n\n` +
      `Amount Due:\n₹${amountStr}\n\n` +
      `Your submitted payment could not be verified. Please review your transaction details on our payment page:\n${paymentUrl}\n\n` +
      `Thank you,\nNAGORA Digital Agency`
    );
  }

  if (status === 'OVERDUE') {
    return (
      `Hello ${clientName},\n\n` +
      `Friendly payment reminder from NAGORA Digital Agency.\n\n` +
      `Project:\n${serviceName}\n\n` +
      `Project ID:\n${projectId}\n\n` +
      `Payment ID:\n${paymentId}\n\n` +
      `Our records show that the project payment of ₹${amountStr} was due on ${dueDateStr}.\n\n` +
      `Pay securely:\n${paymentUrl}\n\n` +
      `Please complete the payment at your convenience.\n\n` +
      `Thank you,\nNAGORA Digital Agency`
    );
  }

  if (status === 'CREATED' || status === 'UPCOMING') {
    return (
      `Hello ${clientName},\n\n` +
      `Upcoming payment reminder from NAGORA Digital Agency.\n\n` +
      `Project:\n${serviceName}\n\n` +
      `Project ID:\n${projectId}\n\n` +
      `Payment ID:\n${paymentId}\n\n` +
      `Amount Due:\n₹${amountStr}\n\n` +
      `Due Date:\n${dueDateStr}\n\n` +
      `Pay securely:\n${paymentUrl}\n\n` +
      `Enter your Project ID and Payment ID to continue.\n\n` +
      `Thank you,\nNAGORA Digital Agency`
    );
  }

  // Default: PAYMENT_PENDING / DUE
  return (
    `Hello ${clientName},\n\n` +
    `Friendly payment reminder from NAGORA Digital Agency.\n\n` +
    `Project:\n${serviceName}\n\n` +
    `Project ID:\n${projectId}\n\n` +
    `Payment ID:\n${paymentId}\n\n` +
    `Amount Due:\n₹${amountStr}\n\n` +
    `Due Date:\n${dueDateStr}\n\n` +
    `Pay securely:\n${paymentUrl}\n\n` +
    `Enter your Project ID and Payment ID to continue.\n\n` +
    `Thank you,\nNAGORA Digital Agency`
  );
}

// 2. Payment Schedule Card Reminder — Email Template (Section 10, 11, 12, 16)
function generatePaymentReminderEmail(project, payment) {
  const clientName = project.clientName || 'Valued Client';
  const serviceName = project.serviceName || 'Digital Agency Services';
  const projectId = project.projectId;
  const paymentId = payment.paymentId;
  const amountStr = Number(payment.amount).toLocaleString('en-IN');
  const dueDateStr = formatNiceDate(payment.dueDate);
  const paymentUrl = getPublicPaymentUrl();
  const status = payment.status;

  let subject = `Payment Reminder — ${serviceName} — ${projectId}`;
  if (status === 'OVERDUE') {
    subject = `Payment Overdue — ${serviceName} — ${projectId}`;
  } else if (status === 'CREATED' || status === 'UPCOMING') {
    subject = `Upcoming Payment Reminder — ${serviceName} — ${projectId}`;
  } else if (status === 'REJECTED') {
    subject = `Payment Verification Requires Attention — ${serviceName} — ${projectId}`;
  }

  let body = '';
  if (status === 'REJECTED') {
    body =
      `Hello ${clientName},\n\n` +
      `Your submitted payment for NAGORA Digital Agency could not be verified.\n\n` +
      `Project Details:\n` +
      `Project: ${serviceName}\n` +
      `Project ID: ${projectId}\n` +
      `Payment ID: ${paymentId}\n` +
      `Amount Due: ₹${amountStr}\n\n` +
      `Please review your transaction details and re-submit your UTR reference on our payment page:\n` +
      `${paymentUrl}\n\n` +
      `If you need assistance, please contact NAGORA Digital Agency.\n\n` +
      `Thank you for choosing NAGORA Digital Agency.\n\n` +
      `Regards,\n` +
      `NAGORA Digital Agency`;
  } else if (status === 'OVERDUE') {
    body =
      `Hello ${clientName},\n\n` +
      `This is a friendly payment reminder from NAGORA Digital Agency.\n\n` +
      `Our records show that the project payment of ₹${amountStr} was due on ${dueDateStr}.\n\n` +
      `Project Details:\n` +
      `Project: ${serviceName}\n` +
      `Project ID: ${projectId}\n` +
      `Payment ID: ${paymentId}\n` +
      `Amount Due: ₹${amountStr}\n` +
      `Due Date: ${dueDateStr}\n\n` +
      `To complete your payment at your convenience, please visit:\n` +
      `${paymentUrl}\n\n` +
      `Enter your Project ID and Payment ID to complete the payment securely.\n\n` +
      `If you have already completed this payment, please disregard this reminder.\n\n` +
      `Thank you for choosing NAGORA Digital Agency.\n\n` +
      `Regards,\n` +
      `NAGORA Digital Agency`;
  } else {
    body =
      `Hello ${clientName},\n\n` +
      `This is a friendly payment reminder from NAGORA Digital Agency.\n\n` +
      `Your project payment details are below:\n\n` +
      `Project:\n${serviceName}\n\n` +
      `Project ID:\n${projectId}\n\n` +
      `Payment ID:\n${paymentId}\n\n` +
      `Amount Due:\n₹${amountStr}\n\n` +
      `Due Date:\n${dueDateStr}\n\n` +
      `To complete your payment, please visit:\n${paymentUrl}\n\n` +
      `Enter your Project ID and Payment ID to view your payment details and complete the payment securely.\n\n` +
      `If you have already completed this payment, please disregard this reminder.\n\n` +
      `Thank you for choosing NAGORA Digital Agency.\n\n` +
      `Regards,\n` +
      `NAGORA Digital Agency`;
  }

  return { subject, body };
}

// 3. Project Creation Success — WhatsApp Message (Section 17, 19, 20, 21)
function generateProjectCreationWhatsApp(data) {
  const project = data.project || {};
  const firstPayment = (data.schedule && data.schedule[0]) || {};
  const clientName = project.clientName || 'Valued Client';
  const serviceName = project.serviceName || 'Digital Agency Services';
  const projectId = data.projectId || project.projectId;
  const firstPaymentId = firstPayment.paymentId || (data.schedule && data.schedule[0]?.paymentId);
  const totalAmount = project.totalAmount || 0;
  const amountDueNow = firstPayment.amount || 0;
  const planType = project.planType || 'Full';
  const totalInstallments = project.totalInstallments || 1;
  const paymentUrl = getPublicPaymentUrl();

  let planDescription = 'Full Payment';
  if (planType === 'Advance_50') {
    planDescription = '50% Advance + Final Settlement';
  } else if (planType === 'Installments_Monthly') {
    planDescription = `50% Advance + ${totalInstallments} Monthly Installments`;
  }

  return (
    `Hello ${clientName},\n\n` +
    `Congratulations! Your ${serviceName} project with NAGORA Digital Agency has been successfully confirmed.\n\n` +
    `Project Details:\n\n` +
    `Project ID:\n${projectId}\n\n` +
    `Payment ID:\n${firstPaymentId}\n\n` +
    `Total Project Amount:\n₹${totalAmount.toLocaleString('en-IN')}\n\n` +
    `Payment Plan:\n${planDescription}\n\n` +
    `Payment Due Now:\n₹${amountDueNow.toLocaleString('en-IN')}\n\n` +
    `You can complete your payment securely through our payment page:\n${paymentUrl}\n\n` +
    `Please enter your Project ID and Payment ID to view your payment details and complete the payment.\n\n` +
    `Thank you for choosing NAGORA Digital Agency.\n\n` +
    `Regards,\nNAGORA Digital Agency`
  );
}

// 4. Project Creation Success — Email Template (Section 18, 19, 20, 21)
function generateProjectCreationEmail(data) {
  const project = data.project || {};
  const firstPayment = (data.schedule && data.schedule[0]) || {};
  const clientName = project.clientName || 'Valued Client';
  const serviceName = project.serviceName || 'Digital Agency Services';
  const projectId = data.projectId || project.projectId;
  const firstPaymentId = firstPayment.paymentId || (data.schedule && data.schedule[0]?.paymentId);
  const totalAmount = project.totalAmount || 0;
  const amountDueNow = firstPayment.amount || 0;
  const planType = project.planType || 'Full';
  const totalInstallments = project.totalInstallments || 1;
  const paymentUrl = getPublicPaymentUrl();

  let planDescription = 'Full Payment';
  if (planType === 'Advance_50') {
    planDescription = '50% Advance + Final Settlement';
  } else if (planType === 'Installments_Monthly') {
    planDescription = `50% Advance + ${totalInstallments} Monthly Installments`;
  }

  const subject = `Project Confirmed — ${serviceName} — NAGORA Digital Agency`;
  const body =
    `Hello ${clientName},\n\n` +
    `Congratulations!\n\n` +
    `Your ${serviceName} project with NAGORA Digital Agency has been successfully confirmed.\n\n` +
    `Project Details:\n\n` +
    `Project ID:\n${projectId}\n\n` +
    `Payment ID:\n${firstPaymentId}\n\n` +
    `Total Project Amount:\n₹${totalAmount.toLocaleString('en-IN')}\n\n` +
    `Payment Plan:\n${planDescription}\n\n` +
    `Payment Due Now:\n₹${amountDueNow.toLocaleString('en-IN')}\n\n` +
    `You can complete your payment securely through our payment page:\n${paymentUrl}\n\n` +
    `Please enter your Project ID and Payment ID to view your payment details and complete the payment.\n\n` +
    `Thank you for choosing NAGORA Digital Agency.\n\n` +
    `Regards,\nNAGORA Digital Agency`;

  return { subject, body };
}

export default function AdminDashboard() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State Management
  const [enquiries, setEnquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = Projects, 1 = Enquiries, 2 = Transactions
  const [searchQuery, setSearchQuery] = useState('');

  // Create Project Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    client_name: '',
    phone: '',
    email: '',
    company: '',
    service_name: 'Website Development',
    total_amount: '',
    plan_type: 'Full',
    total_installments: 3
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createdSuccessData, setCreatedSuccessData] = useState(null);

  // Project Detail & Payment Verification Modals State
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);
  const [selectedPaymentItem, setSelectedPaymentItem] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  
  // Rejection Dialog Form State (Section 20)
  const [rejectionReasonCategory, setRejectionReasonCategory] = useState('Invalid UTR');
  const [rejectionNotes, setRejectionNotes] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');
  const [copiedText, setCopiedText] = useState('');

  // Notification Toast / Feedback State (Section 27)
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Fetch Data
  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setEnquiries(res.data.data || res.data.enquiries || []);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/admin/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setPayments(res.data.payments || []);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchProjects(), fetchEnquiries(), fetchPayments()]);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      refreshData();
    }
  }, [token, navigate]);

  // Communication Actions (WhatsApp / Email Reminders)
  const handleOpenWhatsApp = (phoneStr, messageText, projectId, paymentId) => {
    if (!phoneStr) {
      setSnackbarMsg('No phone number registered for client.');
      setShowSnackbar(true);
      return;
    }

    const normalizedPhone = normalizePhoneForWhatsApp(phoneStr);
    const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(messageText)}`;

    setSnackbarMsg('Opening WhatsApp...');
    setShowSnackbar(true);

    window.open(url, '_blank', 'noopener,noreferrer');

    if (token && projectId) {
      axios.post(
        '/api/admin/log-communication',
        { project_id: projectId, payment_id: paymentId, channel: 'whatsapp' },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch((err) => console.warn('Communication log error:', err.message));
    }
  };

  const handleOpenEmail = (emailStr, subject, bodyText, projectId, paymentId) => {
    if (!emailStr) {
      setSnackbarMsg('No email address registered for client.');
      setShowSnackbar(true);
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(emailStr)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    setSnackbarMsg('Opening email client...');
    setShowSnackbar(true);

    window.location.href = mailtoUrl;

    if (token && projectId) {
      axios.post(
        '/api/admin/log-communication',
        { project_id: projectId, payment_id: paymentId, channel: 'email' },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch((err) => console.warn('Communication log error:', err.message));
    }
  };

  // Actions
  const handleStatusChange = async (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    try {
      await axios.patch(
        `/api/admin/enquiries/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
      fetchEnquiries();
    }
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    if (!createForm.client_name || !createForm.email || !createForm.phone || !createForm.total_amount) {
      setCreateError('Please fill in all required fields.');
      setCreateLoading(false);
      return;
    }

    try {
      const payload = {
        client_name: createForm.client_name,
        email: createForm.email,
        phone: createForm.phone,
        company: createForm.company,
        service_name: createForm.service_name,
        total_amount: Number(createForm.total_amount),
        plan_type: createForm.plan_type,
        total_installments: Number(createForm.total_installments)
      };

      const res = await axios.post('/api/admin/projects', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.success) {
        setCreatedSuccessData(res.data);
        fetchProjects();
      } else {
        setCreateError(res.data?.message || 'Failed to create project confirmation.');
      }
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Error creating project confirmation.');
    } finally {
      setCreateLoading(false);
    }
  };

  const openProjectDetail = async (projectId) => {
    setProjectDetailLoading(true);
    try {
      const res = await axios.get(`/api/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setSelectedProject(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch project detail:', err);
    } finally {
      setProjectDetailLoading(false);
    }
  };

  // Section 19: Verify UTR Handler
  const handleVerifySubmit = async () => {
    if (!selectedPaymentItem) return;

    // Client/Backend Rule: Cannot verify without a submitted UTR
    const utr = selectedPaymentItem.utrNumber || selectedPaymentItem.utr_number || '';
    if (!utr || String(utr).trim() === '') {
      setActionFeedback('Cannot verify payment because no UTR has been submitted by the client.');
      return;
    }

    setActionLoading(true);
    setActionFeedback('');

    try {
      const res = await axios.post(
        `/api/admin/project-payments/${selectedPaymentItem.paymentId}/verify`,
        { notes: verifyNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.success) {
        setShowVerifyModal(false);
        setSelectedPaymentItem(null);
        setVerifyNotes('');
        setSnackbarMsg('Payment verified successfully! Official receipt generated.');
        setShowSnackbar(true);
        refreshData();
        if (selectedProject) {
          openProjectDetail(selectedProject.project.projectId);
        }
      } else {
        setActionFeedback(res.data?.message || 'Verification failed');
      }
    } catch (err) {
      setActionFeedback(err.response?.data?.message || 'Verification request failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Section 20: Reject UTR Handler
  const handleRejectSubmit = async () => {
    if (!selectedPaymentItem) return;

    // Client/Backend Rule: Cannot reject without a submitted UTR
    const utr = selectedPaymentItem.utrNumber || selectedPaymentItem.utr_number || '';
    if (!utr || String(utr).trim() === '') {
      setActionFeedback('Cannot reject payment because no UTR has been submitted by the client.');
      return;
    }

    const fullReason = rejectionNotes ? `${rejectionReasonCategory}: ${rejectionNotes.trim()}` : rejectionReasonCategory;

    setActionLoading(true);
    setActionFeedback('');

    try {
      const res = await axios.post(
        `/api/admin/project-payments/${selectedPaymentItem.paymentId}/reject`,
        { rejection_reason: fullReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.success) {
        setShowRejectModal(false);
        setSelectedPaymentItem(null);
        setRejectionReasonCategory('Invalid UTR');
        setRejectionNotes('');
        setSnackbarMsg('Payment UTR rejected. Client can now re-submit transaction details.');
        setShowSnackbar(true);
        refreshData();
        if (selectedProject) {
          openProjectDetail(selectedProject.project.projectId);
        }
      } else {
        setActionFeedback(res.data?.message || 'Rejection failed');
      }
    } catch (err) {
      setActionFeedback(err.response?.data?.message || 'Rejection request failed');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 3000);
  };

  // Helper Badge Colors & Status Badges (Section 18)
  const getProjectStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return { bg: '#EFF6FF', text: '#2563EB', label: '⚡ ACTIVE' };
      case 'COMPLETED': return { bg: '#DCFCE7', text: '#15803D', label: '✓ COMPLETED' };
      case 'CANCELLED': return { bg: '#FEE2E2', text: '#B91C1C', label: '✕ CANCELLED' };
      default: return { bg: '#F1F5F9', text: '#64748B', label: status };
    }
  };

  const getPaymentStatusBadge = (status, hasUtr) => {
    switch (status) {
      case 'VERIFIED':
      case 'PAID':
        return { bg: '#DCFCE7', text: '#15803D', label: '✓ VERIFIED' };
      case 'UTR_SUBMITTED':
      case 'UNDER_REVIEW':
        return { bg: '#FEF3C7', text: '#B45309', label: '⏳ UNDER REVIEW' };
      case 'PAYMENT_PENDING':
        return { bg: '#EFF6FF', text: '#2563EB', label: '🔹 PENDING PAYMENT' };
      case 'DUE':
      case 'DUE_SOON':
        return { bg: '#FEF3C7', text: '#D97706', label: '⚠️ PAYMENT DUE' };
      case 'OVERDUE':
        return { bg: '#FEE2E2', text: '#DC2626', label: '🚨 OVERDUE' };
      case 'REJECTED':
        return { bg: '#FEE2E2', text: '#B91C1C', label: '✕ PAYMENT REJECTED' };
      case 'REFUNDED':
        return { bg: '#F1F5F9', text: '#475569', label: 'REFUNDED' };
      default:
        return { bg: '#F1F5F9', text: '#64748B', label: status };
    }
  };

  const filteredProjects = projects.filter(p =>
    (p.clientName && p.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.projectId && p.projectId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.phone && p.phone.includes(searchQuery)) ||
    (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.serviceName && p.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalProjectRevenue = projects.reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);

  return (
    <Box sx={{ py: 6, backgroundColor: '#F8FAFC', minHeight: '90vh' }}>
      <Helmet>
        <title>Admin Dashboard | NAGORA Digital Agency</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Container maxWidth="lg">
        {/* Top Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A1128' }}>
              NAGORA Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Project Confirmations, Installment Schedules, WhatsApp & Email Reminders, UPI Verification Engine.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCreatedSuccessData(null);
                setCreateError('');
                setShowCreateModal(true);
              }}
              startIcon={<Plus size={18} />}
              sx={{ fontWeight: 800, backgroundColor: '#7C3AED', '&:hover': { backgroundColor: '#6D28D9' } }}
            >
              New Project Confirmation
            </Button>
            <Button
              variant="outlined"
              onClick={refreshData}
              disabled={refreshing}
              startIcon={<RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />}
              sx={{ fontWeight: 700 }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button
              variant="outlined"
              onClick={logout}
              startIcon={<LogOut size={18} />}
              sx={{ borderColor: '#DC2626', color: '#DC2626', fontWeight: 700 }}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        {/* Tab Switcher */}
        <Paper sx={{ mb: 4, borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              '& .MuiTab-root': { fontWeight: 800, fontSize: '0.95rem', py: 2 }
            }}
          >
            <Tab icon={<FolderCheck size={18} />} iconPosition="start" label={`Project Confirmations (${projects.length})`} />
            <Tab icon={<Inbox size={18} />} iconPosition="start" label={`Enquiries & Leads (${enquiries.length})`} />
            <Tab icon={<CreditCard size={18} />} iconPosition="start" label={`General Transactions (${payments.length})`} />
          </Tabs>
        </Paper>

        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>VERIFIED COLLECTIONS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#16A34A', mt: 0.5 }}>
                ₹{totalProjectRevenue.toLocaleString('en-IN')}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 700 }}>TOTAL PROJECTS</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0A1128', mt: 0.5 }}>
                {projects.length}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 700 }}>ACTIVE ENQUIRIES</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5 }}>
                {enquiries.filter(e => e.status === 'New' || e.status === 'In Discussion').length}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700 }}>SERVER UPI VPA</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0A1128', mt: 0.8 }}>
                8072443590@okbizaxis
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tab 0: Project Confirmations */}
        {activeTab === 0 && (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128' }}>
                Confirmed Client Projects & Installment Timelines
              </Typography>
              <TextField
                size="small"
                placeholder="Search Project ID, Client, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment>
                }}
                sx={{ width: { xs: '100%', sm: 280 } }}
              />
            </Box>

            {loading ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <CircularProgress size={36} sx={{ color: '#7C3AED' }} />
                <Typography variant="body2" sx={{ color: '#64748B', mt: 2 }}>
                  Loading project records...
                </Typography>
              </Box>
            ) : filteredProjects.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <FolderCheck size={48} color="#94A3B8" />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mt: 2 }}>
                  No project confirmations found
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, mb: 3 }}>
                  Click "New Project Confirmation" to generate a client project confirmation with auto-calculated installment schedule.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowCreateModal(true)}
                  startIcon={<Plus size={18} />}
                  sx={{ fontWeight: 800, backgroundColor: '#7C3AED' }}
                >
                  Create First Project Confirmation
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Project ID & Date</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Client Details</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Service & Plan</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Financial Progress</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Status & Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredProjects.map((p) => {
                      const badge = getProjectStatusBadge(p.status);
                      const progressPct = p.totalAmount > 0 ? Math.min(100, Math.round((p.paidAmount / p.totalAmount) * 100)) : 0;
                      const formattedDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A';

                      return (
                        <TableRow key={p.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                              {p.projectId}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {formattedDate}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128' }}>
                              {p.clientName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                              {p.phone} • {p.email}
                            </Typography>
                            {p.company && (
                              <Typography variant="caption" sx={{ color: '#7C3AED', display: 'block', fontWeight: 600 }}>
                                {p.company}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <Chip label={p.serviceName} size="small" color="primary" sx={{ fontWeight: 700, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 600 }}>
                              {p.planType.replace('_', ' ')} {p.planType === 'Installments_Monthly' ? `(${p.totalInstallments} EMIs)` : ''}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ width: 220 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#16A34A' }}>
                                ₹{p.paidAmount.toLocaleString('en-IN')}
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B' }}>
                                / ₹{p.totalAmount.toLocaleString('en-IN')}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={progressPct} 
                              sx={{ height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { backgroundColor: progressPct === 100 ? '#16A34A' : '#7C3AED' } }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mt: 0.5 }}>
                              {progressPct}% Paid ({p.verifiedMilestones}/{p.totalMilestones} Milestones)
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip 
                                label={badge.label} 
                                size="small" 
                                sx={{ backgroundColor: badge.bg, color: badge.text, fontWeight: 800 }} 
                              />
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => openProjectDetail(p.projectId)}
                                startIcon={<Eye size={14} />}
                                sx={{ fontWeight: 800, fontSize: '0.75rem', backgroundColor: '#0A1128', '&:hover': { backgroundColor: '#1E293B' } }}
                              >
                                Timeline
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* Tab 1: Enquiries */}
        {activeTab === 1 && (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128' }}>
                Customer Submissions & Enquiries
              </Typography>
            </Box>

            {enquiries.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Inbox size={48} color="#94A3B8" />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mt: 2 }}>
                  No enquiries in database yet
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>ID & Date</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Client Details</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Service & Budget</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Message Brief</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Status Management</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {enquiries.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>#{row.id}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128' }}>{row.name}</Typography>
                          <Typography variant="body2" sx={{ color: '#7C3AED', fontSize: '0.85rem' }}>{row.email}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            {row.phone} {row.company ? `• ${row.company}` : ''}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip label={row.service} size="small" color="primary" sx={{ fontWeight: 700, mb: 0.5 }} />
                          <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 600 }}>
                            {row.budget}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem' }}>
                            {row.message}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Select
                            size="small"
                            value={row.status || 'New'}
                            onChange={(e) => handleStatusChange(row.id, e.target.value)}
                            sx={{ borderRadius: 2, fontWeight: 800, fontSize: '0.85rem' }}
                          >
                            {statusOptions.map((st) => (
                              <MenuItem key={st} value={st}>{st}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* Tab 2: Legacy General Transactions */}
        {activeTab === 2 && (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128' }}>
                General Transaction Records
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Ref</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>UTR</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status & Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((p) => {
                    const hasUtr = Boolean(p.utr_number && String(p.utr_number).trim() !== '');
                    const isUnderReview = p.status === 'UNDER_REVIEW' && hasUtr;
                    return (
                      <TableRow key={p.id}>
                        <TableCell sx={{ fontWeight: 800, color: '#7C3AED' }}>{p.payment_ref}</TableCell>
                        <TableCell>{p.client_name} ({p.phone})</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>₹{Number(p.amount).toLocaleString()}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{p.utr_number || 'N/A'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={p.status} size="small" color={p.status === 'VERIFIED' ? 'success' : 'warning'} sx={{ fontWeight: 800 }} />
                            {isUnderReview && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<Check size={14} />}
                                  onClick={() => {
                                    setSelectedPaymentItem({ paymentId: p.payment_ref, utrNumber: p.utr_number, milestoneTitle: p.service_name, amount: p.amount });
                                    setShowVerifyModal(true);
                                  }}
                                  sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                                >
                                  Verify UTR
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<X size={14} />}
                                  onClick={() => {
                                    setSelectedPaymentItem({ paymentId: p.payment_ref, utrNumber: p.utr_number, milestoneTitle: p.service_name, amount: p.amount });
                                    setShowRejectModal(true);
                                  }}
                                  sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      {/* CREATE PROJECT MODAL */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.25rem', borderBottom: '1px solid #E2E8F0' }}>
          ➕ Create New Project Confirmation
        </DialogTitle>
        <DialogContent dividers>
          {createdSuccessData ? (
            <Stack spacing={3} sx={{ py: 2 }}>
              <Alert severity="success" sx={{ borderRadius: 3 }}>
                <strong>✓ Project Successfully Confirmed!</strong> Share the project confirmation & payment details directly with your client via WhatsApp or Email.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>PROJECT ID</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#7C3AED', fontFamily: 'monospace' }}>
                      {createdSuccessData.projectId}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>FIRST PAYMENT ID</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0A1128', fontFamily: 'monospace' }}>
                      {createdSuccessData.schedule && createdSuccessData.schedule[0]?.paymentId}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Direct Communication Buttons for Project Creation (Section 15, 17, 18) */}
              <Box sx={{ p: 2.5, borderRadius: 3, backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128', mb: 1.5 }}>
                  Send Confirmation to Client ({createdSuccessData.project?.clientName})
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<MessageSquare size={18} />}
                    onClick={() => {
                      const waText = generateProjectCreationWhatsApp(createdSuccessData);
                      handleOpenWhatsApp(
                        createdSuccessData.project?.phone || createForm.phone,
                        waText,
                        createdSuccessData.projectId,
                        createdSuccessData.schedule && createdSuccessData.schedule[0]?.paymentId
                      );
                    }}
                    sx={{
                      backgroundColor: '#16A34A',
                      color: '#FFF',
                      fontWeight: 800,
                      py: 1.2,
                      px: 3,
                      '&:hover': { backgroundColor: '#15803D' }
                    }}
                  >
                    🟢 WhatsApp Client
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Mail size={18} />}
                    onClick={() => {
                      const emailData = generateProjectCreationEmail(createdSuccessData);
                      handleOpenEmail(
                        createdSuccessData.project?.email || createForm.email,
                        emailData.subject,
                        emailData.body,
                        createdSuccessData.projectId,
                        createdSuccessData.schedule && createdSuccessData.schedule[0]?.paymentId
                      );
                    }}
                    sx={{
                      backgroundColor: '#7C3AED',
                      color: '#FFF',
                      fontWeight: 800,
                      py: 1.2,
                      px: 3,
                      '&:hover': { backgroundColor: '#6D28D9' }
                    }}
                  >
                    ✉ Email Client
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Copy size={16} />}
                    onClick={() => copyToClipboard(generateProjectCreationWhatsApp(createdSuccessData), 'creation_text')}
                    sx={{ fontWeight: 800 }}
                  >
                    {copiedText === 'creation_text' ? 'Copied!' : 'Copy Text'}
                  </Button>
                </Stack>

                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.82rem', whiteSpace: 'pre-wrap', color: '#334155', backgroundColor: '#FFFFFF', p: 2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  {generateProjectCreationWhatsApp(createdSuccessData)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ExternalLink size={16} />}
                  onClick={() => window.open(createdSuccessData.paymentLink, '_blank')}
                  sx={{ fontWeight: 800 }}
                >
                  Test Payment Link
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreatedSuccessData(null);
                  }}
                  sx={{ fontWeight: 800, backgroundColor: '#0A1128', '&:hover': { backgroundColor: '#1E293B' } }}
                >
                  Done
                </Button>
              </Box>
            </Stack>
          ) : (
            <Box component="form" onSubmit={handleCreateProjectSubmit} sx={{ pt: 1 }}>
              {createError && <Alert severity="error" sx={{ mb: 3 }}>{createError}</Alert>}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Client Full Name *"
                    fullWidth
                    required
                    value={createForm.client_name}
                    onChange={(e) => setCreateForm({ ...createForm, client_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Client Phone Number *"
                    fullWidth
                    required
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Client Email *"
                    type="email"
                    fullWidth
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name (Optional)"
                    fullWidth
                    value={createForm.company}
                    onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Service Package *"
                    select
                    fullWidth
                    required
                    value={createForm.service_name}
                    onChange={(e) => setCreateForm({ ...createForm, service_name: e.target.value })}
                  >
                    {serviceList.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Project Amount (₹) *"
                    type="number"
                    fullWidth
                    required
                    value={createForm.total_amount}
                    onChange={(e) => setCreateForm({ ...createForm, total_amount: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Payment Plan Type *"
                    select
                    fullWidth
                    required
                    value={createForm.plan_type}
                    onChange={(e) => setCreateForm({ ...createForm, plan_type: e.target.value })}
                  >
                    <MenuItem value="Full">100% Full Payment</MenuItem>
                    <MenuItem value="Advance_50">50% Advance & 50% Final Settlement</MenuItem>
                    <MenuItem value="Installments_Monthly">50% Advance + 0% Interest Monthly EMIs</MenuItem>
                  </TextField>
                </Grid>
                {createForm.plan_type === 'Installments_Monthly' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Number of Monthly EMIs *"
                      select
                      fullWidth
                      value={createForm.total_installments}
                      onChange={(e) => setCreateForm({ ...createForm, total_installments: Number(e.target.value) })}
                    >
                      <MenuItem value={3}>3 Monthly Installments</MenuItem>
                      <MenuItem value={6}>6 Monthly Installments</MenuItem>
                      <MenuItem value={9}>9 Monthly Installments</MenuItem>
                      <MenuItem value={12}>12 Monthly Installments</MenuItem>
                    </TextField>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        {!createdSuccessData && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateProjectSubmit}
              disabled={createLoading}
              sx={{ fontWeight: 800, backgroundColor: '#7C3AED', '&:hover': { backgroundColor: '#6D28D9' } }}
            >
              {createLoading ? 'Generating...' : 'Confirm & Generate Project'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* PROJECT DETAIL & SCHEDULE TIMELINE MODAL */}
      <Dialog open={!!selectedProject} onClose={() => setSelectedProject(null)} maxWidth="md" fullWidth>
        {selectedProject && (
          <>
            <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#7C3AED', fontFamily: 'monospace' }}>
                  {selectedProject.project.projectId}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Client: {selectedProject.project.clientName} ({selectedProject.project.phone} • {selectedProject.project.email})
                </Typography>
              </Box>
              <Chip label={selectedProject.project.status} color="primary" sx={{ fontWeight: 800 }} />
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Total Amount</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>₹{selectedProject.project.totalAmount.toLocaleString('en-IN')}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#16A34A' }}>Paid Amount</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#16A34A' }}>₹{selectedProject.project.paidAmount.toLocaleString('en-IN')}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#DC2626' }}>Balance Due</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#DC2626' }}>₹{selectedProject.project.remainingBalance.toLocaleString('en-IN')}</Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: '#0A1128' }}>
                Payment Schedule & Verification Timeline
              </Typography>

              <Stack spacing={2}>
                {selectedProject.payments.map((p) => {
                  // Evaluate Authoritative Payment Card Action Matrix (Section 9, 22)
                  const cardState = getPaymentCardState(p);
                  const badge = getPaymentStatusBadge(p.status, cardState.hasUtr);

                  return (
                    <Paper 
                      key={p.paymentId} 
                      sx={{ 
                        p: 2.5, 
                        borderRadius: 3, 
                        border: '1px solid #E2E8F0', 
                        backgroundColor: cardState.isVerified ? '#F0FDF4' : (cardState.isUnderReview ? '#FFFBEB' : '#FFFFFF') 
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
                        <Box sx={{ flex: 1, minWidth: 240 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128' }}>
                            {p.milestoneTitle}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7C3AED', fontFamily: 'monospace', fontWeight: 800, display: 'block', mt: 0.3 }}>
                            Payment ID: {p.paymentId}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            Due Date: {formatNiceDate(p.dueDate)}
                          </Typography>

                          {/* Display UTR if submitted */}
                          {cardState.hasUtr && (
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#B45309', display: 'block', mt: 0.5 }}>
                              Submitted UTR: {cardState.utr}
                            </Typography>
                          )}

                          {cardState.showReceipt && (
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#16A34A', display: 'block' }}>
                              Receipt #: {p.receiptNumber || p.receipt_number}
                            </Typography>
                          )}

                          {cardState.isRejected && p.rejectionReason && (
                            <Typography variant="caption" sx={{ color: '#DC2626', display: 'block', mt: 0.5, fontWeight: 700 }}>
                              Rejection Reason: {p.rejectionReason}
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0A1128', mb: 0.5 }}>
                            ₹{Number(p.amount).toLocaleString('en-IN')}
                          </Typography>

                          <Chip label={badge.label} size="small" sx={{ backgroundColor: badge.bg, color: badge.text, fontWeight: 800, mb: 1, display: 'inline-flex' }} />

                          {/* AUTHORITATIVE ACTION BUTTON ROW (Section 1, 2, 5, 6, 7, 8, 9, 22) */}
                          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                            
                            {/* RULE 1: SHOW WHATSAPP & EMAIL REMINDERS ONLY WHEN UNPAID & NO UTR IS UNDER REVIEW */}
                            {cardState.showReminders && (
                              <>
                                <Tooltip title="Send WhatsApp Reminder">
                                  <IconButton
                                    size="small"
                                    aria-label="Send WhatsApp payment reminder"
                                    onClick={() => {
                                      const waMsg = generatePaymentReminderWhatsApp(selectedProject.project, p);
                                      handleOpenWhatsApp(
                                        selectedProject.project.phone,
                                        waMsg,
                                        selectedProject.project.projectId,
                                        p.paymentId
                                      );
                                    }}
                                    sx={{
                                      color: '#16A34A',
                                      backgroundColor: '#DCFCE7',
                                      border: '1px solid #86EFAC',
                                      width: 36,
                                      height: 36,
                                      '&:hover': { backgroundColor: '#BBF7D0' }
                                    }}
                                  >
                                    <MessageSquare size={18} />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Send Email Reminder">
                                  <IconButton
                                    size="small"
                                    aria-label="Send email payment reminder"
                                    onClick={() => {
                                      const emailData = generatePaymentReminderEmail(selectedProject.project, p);
                                      handleOpenEmail(
                                        selectedProject.project.email,
                                        emailData.subject,
                                        emailData.body,
                                        selectedProject.project.projectId,
                                        p.paymentId
                                      );
                                    }}
                                    sx={{
                                      color: '#7C3AED',
                                      backgroundColor: '#F3E8FF',
                                      border: '1px solid #D8B4FE',
                                      width: 36,
                                      height: 36,
                                      '&:hover': { backgroundColor: '#E9D5FF' }
                                    }}
                                  >
                                    <Mail size={18} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            {/* RULE 2: SHOW VERIFY UTR & REJECT ONLY AFTER CLIENT HAS SUBMITTED A UTR (hasUtr is TRUE) AND STATUS IS UTR_SUBMITTED / UNDER_REVIEW */}
                            {cardState.showAdminReviewActions && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<Check size={14} />}
                                  onClick={() => {
                                    setSelectedPaymentItem(p);
                                    setShowVerifyModal(true);
                                  }}
                                  sx={{ fontWeight: 800, fontSize: '0.75rem', px: 1.5 }}
                                >
                                  Verify UTR
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<X size={14} />}
                                  onClick={() => {
                                    setSelectedPaymentItem(p);
                                    setShowRejectModal(true);
                                  }}
                                  sx={{ fontWeight: 800, fontSize: '0.75rem', px: 1.5 }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                          </Stack>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedProject(null)} sx={{ fontWeight: 700 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* VERIFY UTR DIALOG (Section 19, 21) */}
      <Dialog open={showVerifyModal} onClose={() => setShowVerifyModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm UPI Transaction Verification</DialogTitle>
        <DialogContent dividers>
          {selectedPaymentItem && (
            <Stack spacing={2}>
              {actionFeedback && <Alert severity="error">{actionFeedback}</Alert>}
              
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Have you verified this transaction in your bank account / UPI statement and confirmed that payment was received?
              </Alert>

              <Paper sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Payment ID: <strong>{selectedPaymentItem.paymentId}</strong></Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Milestone: <strong>{selectedPaymentItem.milestoneTitle}</strong></Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Expected Amount: <strong>₹{Number(selectedPaymentItem.amount).toLocaleString('en-IN')}</strong></Typography>
                <Typography variant="caption" sx={{ color: '#B45309', fontFamily: 'monospace', fontWeight: 800, display: 'block', mt: 0.5 }}>
                  Submitted UTR: <strong>{selectedPaymentItem.utrNumber || selectedPaymentItem.utr_number}</strong>
                </Typography>
              </Paper>

              <TextField
                label="Admin Verification Notes (Optional)"
                fullWidth
                multiline
                rows={2}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Bank statement verified on date..."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowVerifyModal(false)} disabled={actionLoading}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleVerifySubmit} 
            disabled={actionLoading} 
            sx={{ fontWeight: 800 }}
          >
            {actionLoading ? 'Verifying...' : 'Confirm Verification & Issue Receipt'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* REJECT UTR DIALOG (Section 20, 21) */}
      <Dialog open={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#DC2626' }}>Reject UTR Submission</DialogTitle>
        <DialogContent dividers>
          {selectedPaymentItem && (
            <Stack spacing={2}>
              {actionFeedback && <Alert severity="error">{actionFeedback}</Alert>}

              <Paper sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: 2, border: '1px solid #FCA5A5' }}>
                <Typography variant="caption" sx={{ color: '#991B1B', display: 'block' }}>Payment ID: <strong>{selectedPaymentItem.paymentId}</strong></Typography>
                <Typography variant="caption" sx={{ color: '#991B1B', display: 'block' }}>Submitted UTR: <strong style={{ fontFamily: 'monospace' }}>{selectedPaymentItem.utrNumber || selectedPaymentItem.utr_number}</strong></Typography>
                <Typography variant="caption" sx={{ color: '#991B1B', display: 'block' }}>Amount: <strong>₹{Number(selectedPaymentItem.amount).toLocaleString('en-IN')}</strong></Typography>
              </Paper>

              <TextField
                label="Rejection Reason *"
                select
                fullWidth
                required
                value={rejectionReasonCategory}
                onChange={(e) => setRejectionReasonCategory(e.target.value)}
              >
                {REJECTION_REASONS_LIST.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Additional Notes (Optional)"
                fullWidth
                multiline
                rows={2}
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Details regarding transaction discrepancy..."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowRejectModal(false)} disabled={actionLoading}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleRejectSubmit} 
            disabled={actionLoading} 
            sx={{ fontWeight: 800 }}
          >
            {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FEEDBACK TOAST / SNACKBAR */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
}
