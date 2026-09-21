import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Chip, 
  Stack, 
  LinearProgress, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard,
  FileText,
  Lock,
  RotateCcw
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

export default function PaymentStatusPage() {
  const { token: urlToken } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const paramProjectId = searchParams.get('projectId') || urlToken || '';
  const paramPaymentId = searchParams.get('paymentId') || '';

  const [searchQuery, setSearchQuery] = useState(paramProjectId);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusData, setStatusData] = useState(null);

  // Selected Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);

  const fetchStatus = async (projId, payId) => {
    const q = projId || searchQuery;
    if (!q || !q.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.get('/api/payment/status', {
        params: { projectId: q.trim(), paymentId: payId ? payId.trim() : undefined }
      });

      if (res.data && res.data.success) {
        setStatusData(res.data);
      } else {
        setErrorMsg('No project payment record found for the provided identifier.');
        setStatusData(null);
      }
    } catch (err) {
      // Fallback try legacy endpoint if necessary
      try {
        const legacyRes = await axios.get(`/api/payment-status/${encodeURIComponent(q.trim())}`);
        if (legacyRes.data && legacyRes.data.success) {
          setStatusData(legacyRes.data);
          setLoading(false);
          return;
        }
      } catch (legErr) {
        // Ignore fallback error
      }
      setErrorMsg(err.response?.data?.message || 'No project payment record found. Please verify your Project ID or Phone Number.');
      setStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramProjectId) {
      fetchStatus(paramProjectId, paramPaymentId);
    }
  }, [paramProjectId, paramPaymentId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchStatus(searchQuery.trim(), '');
    }
  };

  const handleOpenReceipt = async (paymentId) => {
    setReceiptLoading(true);
    try {
      const res = await axios.get(`/api/payment/receipt/${paymentId}`);
      if (res.data && res.data.success) {
        setActiveReceipt(res.data.receipt);
        setShowReceiptModal(true);
      } else {
        alert(res.data?.message || 'Official receipt is only available for VERIFIED payments.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to fetch official receipt.');
    } finally {
      setReceiptLoading(false);
    }
  };

  const summary = statusData?.summary;
  const currentPay = statusData?.currentPayment;
  const schedule = statusData?.schedule || [];

  return (
    <Box sx={{ backgroundColor: '#060B1E', color: '#FFFFFF', minHeight: '100vh', pb: 12, pt: 3 }}>
      <Helmet>
        <title>Customer Payment Status & Ledger | NAGORA Digital Agency</title>
        <meta name="description" content="Check your project payment status, payment schedule history, remaining balances, and verified receipts." />
      </Helmet>

      {/* Header Banner */}
      <Box 
        sx={{ 
          py: { xs: 5, md: 6 }, 
          background: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.25) 0%, rgba(6, 11, 30, 0) 75%)',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          mb: 5
        }}
      >
        <Container maxWidth="md">
          <Chip
            icon={<ShieldCheck size={16} color="#34D399" />}
            label="CUSTOMER PAYMENT TRACKING ENGINE"
            sx={{
              backgroundColor: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              color: '#34D399',
              fontWeight: 800,
              fontSize: '0.75rem',
              mb: 2
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.8rem' }, color: '#FFFFFF', mb: 1.5 }}>
            Check Project <span style={{ color: '#D4AF37' }}>Payment Ledger</span>
          </Typography>
          <Typography sx={{ color: '#94A3B8', maxWidth: 620, mx: 'auto', fontSize: { xs: '0.9rem', md: '1rem' }, mb: 4 }}>
            Enter your Project ID, Payment ID, or Phone Number to view your real-time payment schedule, remaining balance, and official verified receipts.
          </Typography>

          {/* Search Form */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            elevation={0}
            sx={{
              p: 0.8,
              borderRadius: '50px',
              background: '#0F172A',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 560,
              mx: 'auto'
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Enter Project ID (e.g. NAG-PROJ-2026-A1B2C3) or Phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { color: '#FFFFFF', paddingLeft: '20px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'monospace' }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Search size={18} />}
              sx={{
                borderRadius: '50px',
                px: 3,
                py: 1.2,
                fontWeight: 800,
                backgroundColor: '#7C3AED',
                color: '#FFF',
                '&:hover': { backgroundColor: '#6D28D9' }
              }}
            >
              Track
            </Button>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {errorMsg}
          </Alert>
        )}

        {summary && (
          <Stack spacing={4}>
            {/* Top Metric Overview */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                    Total Project Amount
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', mt: 0.5 }}>
                    ₹{summary.totalProjectAmount.toLocaleString('en-IN')}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.5 }}>
                    {summary.serviceName}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>
                    Verified Paid Amount
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#34D399', mt: 0.5 }}>
                    ₹{summary.verifiedPaidAmount.toLocaleString('en-IN')}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.5 }}>
                    ✓ Admin Confirmed
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>
                    Remaining Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', mt: 0.5 }}>
                    ₹{summary.remainingBalance.toLocaleString('en-IN')}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.5 }}>
                    Plan: {summary.planType.replace('_', ' ')}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase' }}>
                    Project Status
                  </Typography>
                  <Chip
                    label={summary.projectStatus}
                    color={summary.projectStatus === 'COMPLETED' ? 'success' : 'primary'}
                    sx={{ fontWeight: 900, mt: 1, fontSize: '0.85rem' }}
                  />
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.8 }}>
                    Client: {summary.clientName}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Financial Progress Bar */}
            <Paper sx={{ p: 3, borderRadius: '24px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Financial Settlement Progress
                </Typography>
                <Typography sx={{ fontWeight: 900, color: '#D4AF37' }}>
                  {summary.progressPercentage}% Complete
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={summary.progressPercentage} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6, 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #7C3AED 0%, #D4AF37 100%)',
                    borderRadius: 6
                  }
                }} 
              />
            </Paper>

            {/* Payment Milestone Timeline */}
            <Paper sx={{ p: 4, borderRadius: '24px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={22} color="#D4AF37" /> Milestone Payment Schedule & Status
              </Typography>

              <Stack spacing={2.5}>
                {schedule.map((item) => {
                  let badgeBg = 'rgba(255,255,255,0.06)';
                  let badgeColor = '#94A3B8';
                  let icon = <Clock size={16} color="#94A3B8" />;

                  if (item.status === 'VERIFIED') {
                    badgeBg = 'rgba(52, 211, 153, 0.15)';
                    badgeColor = '#34D399';
                    icon = <CheckCircle2 size={16} color="#34D399" />;
                  } else if (item.status === 'UTR_SUBMITTED' || item.status === 'UNDER_REVIEW') {
                    badgeBg = 'rgba(245, 158, 11, 0.15)';
                    badgeColor = '#F59E0B';
                    icon = <Clock size={16} color="#F59E0B" />;
                  } else if (item.status === 'REJECTED') {
                    badgeBg = 'rgba(239, 68, 68, 0.15)';
                    badgeColor = '#FCA5A5';
                    icon = <AlertCircle size={16} color="#FCA5A5" />;
                  } else if (item.status === 'PAYMENT_PENDING') {
                    badgeBg = 'rgba(59, 130, 246, 0.15)';
                    badgeColor = '#60A5FA';
                  }

                  return (
                    <Paper
                      key={item.paymentId}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        background: item.status === 'VERIFIED' ? 'rgba(52, 211, 153, 0.05)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                            {item.milestoneTitle}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7C3AED', fontFamily: 'monospace', fontWeight: 800, display: 'block', mt: 0.3 }}>
                            Payment ID: {item.paymentId}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
                            Due Date: {item.dueDate}
                          </Typography>
                          {item.utrNumber && (
                            <Typography variant="caption" sx={{ color: '#FFF', fontFamily: 'monospace', fontWeight: 700, display: 'block', mt: 0.5 }}>
                              Submitted UTR: {item.utrNumber}
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: '#D4AF37' }}>
                            ₹{item.amount.toLocaleString('en-IN')}
                          </Typography>
                          <Chip 
                            icon={icon} 
                            label={item.status.replace('_', ' ')} 
                            size="small" 
                            sx={{ backgroundColor: badgeBg, color: badgeColor, fontWeight: 800, mt: 0.5, display: 'inline-flex' }} 
                          />

                          <Box sx={{ mt: 1.5 }}>
                            {item.status === 'VERIFIED' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleOpenReceipt(item.paymentId)}
                                startIcon={<Printer size={16} />}
                                sx={{ backgroundColor: '#16A34A', color: '#FFF', fontWeight: 800, fontSize: '0.75rem', '&:hover': { backgroundColor: '#15803D' } }}
                              >
                                View Official Receipt
                              </Button>
                            )}

                            {(item.status === 'PAYMENT_PENDING' || item.status === 'REJECTED') && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => navigate(`/payment?projectId=${summary.projectId}&paymentId=${item.paymentId}`)}
                                endIcon={<ArrowRight size={14} />}
                                sx={{ backgroundColor: '#7C3AED', color: '#FFF', fontWeight: 800, fontSize: '0.75rem', '&:hover': { backgroundColor: '#6D28D9' } }}
                              >
                                {item.status === 'REJECTED' ? 'Re-submit UTR' : 'Pay Milestone Now'}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Container>

      {/* OFFICIAL RECEIPT MODAL */}
      <Dialog
        open={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Chip label="OFFICIAL VERIFIED PAYMENT RECEIPT" color="success" size="small" sx={{ mb: 1, fontWeight: 800 }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#D4AF37' }}>
            NAGORA Digital Agency
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Official Payment Confirmation
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {activeReceipt && (
            <Stack spacing={2} sx={{ py: 1 }}>
              <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Receipt Number</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#FFF', fontFamily: 'monospace' }}>{activeReceipt.receiptNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verification Status</Typography>
                    <Chip label="VERIFIED" size="small" color="success" sx={{ fontWeight: 800 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Client Name</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#FFF' }}>{activeReceipt.clientName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Project ID</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#7C3AED', fontFamily: 'monospace' }}>{activeReceipt.projectId}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Verified Amount Paid</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', my: 0.5 }}>
                  ₹{Number(activeReceipt.amountPaid).toLocaleString('en-IN')}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                  Milestone: {activeReceipt.milestoneTitle}
                </Typography>
              </Box>

              <Stack spacing={1} sx={{ fontSize: '0.85rem', color: '#CBD5E1', pt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>UPI VPA Used:</span>
                  <strong>{activeReceipt.upiIdUsed}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Confirmed UTR No:</span>
                  <strong style={{ fontFamily: 'monospace' }}>{activeReceipt.utrNumber}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verified By:</span>
                  <span>{activeReceipt.verifiedBy}</span>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Date & Time:</span>
                  <span>{new Date(activeReceipt.paymentDate).toLocaleString()}</span>
                </Box>
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
          <Button
            onClick={() => window.print()}
            startIcon={<Printer size={18} />}
            sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
            variant="outlined"
          >
            Print Receipt
          </Button>
          <Button
            onClick={() => setShowReceiptModal(false)}
            variant="contained"
            sx={{ backgroundColor: '#7C3AED', color: '#FFF', fontWeight: 800 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
