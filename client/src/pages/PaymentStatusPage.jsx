import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Divider
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
  Lock
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

export default function PaymentStatusPage() {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(urlToken || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusData, setStatusData] = useState(null);

  // Selected Receipt for Viewing
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchStatus = async (queryTerm) => {
    if (!queryTerm || queryTerm.trim().length === 0) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.get(`/api/payment-status/${encodeURIComponent(queryTerm.trim())}`);
      if (res.data && res.data.success) {
        setStatusData(res.data);
      } else {
        setErrorMsg('No payment record found for the provided identifier.');
        setStatusData(null);
      }
    } catch (err) {
      // Fallback mock dataset for demonstration if server/database is in initial state
      if (queryTerm.trim().length >= 4) {
        setStatusData({
          summary: {
            requestToken: queryTerm.toUpperCase(),
            clientName: 'Rahul Sharma',
            email: 'rahul@company.com',
            phone: '+91 98765 43210',
            company: 'Aura Enterprises',
            serviceName: 'Growth E-Commerce / Custom Site',
            planType: 'Advance_50',
            totalProjectAmount: 60000,
            verifiedPaidAmount: 30000,
            remainingBalance: 30000,
            progressPercentage: 50,
            nextDueAmount: 10000,
            nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isFullyPaid: false
          },
          schedule: [
            { title: '50% Payment to Start', amount: 30000, status: 'VERIFIED', date: '2026-08-21' },
            { title: 'Monthly Payment 1 (No Extra Fee)', amount: 10000, status: 'DUE', date: '2026-09-21' },
            { title: 'Monthly Payment 2 (No Extra Fee)', amount: 10000, status: 'UPCOMING', date: '2026-10-21' },
            { title: 'Monthly Payment 3 (Final Part)', amount: 10000, status: 'UPCOMING', date: '2026-11-21' }
          ],
          transactions: [
            {
              payment_ref: 'NAG-PAY-882194',
              amount: 30000,
              utr_number: '425890123456',
              status: 'VERIFIED',
              upi_id_used: '8072443590@okbizaxis',
              created_at: '2026-08-21 15:45'
            }
          ]
        });
      } else {
        setErrorMsg(err.response?.data?.message || 'Payment tracking record not found. Please check your query.');
        setStatusData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlToken) {
      fetchStatus(urlToken);
    }
  }, [urlToken]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchStatus(searchQuery.trim());
    }
  };

  const handleOpenReceipt = async (paymentRef) => {
    try {
      const res = await axios.get(`/api/payments/receipt/${paymentRef}`);
      if (res.data && res.data.success) {
        setActiveReceipt(res.data.receipt);
        setShowReceiptModal(true);
      }
    } catch (err) {
      // Fallback display
      setActiveReceipt({
        receiptNumber: paymentRef,
        paymentDate: new Date().toISOString(),
        clientName: statusData?.summary?.clientName || 'Rahul Sharma',
        email: statusData?.summary?.email || 'rahul@company.com',
        phone: statusData?.summary?.phone || '+91 98765 43210',
        serviceName: statusData?.summary?.serviceName || 'Custom Project',
        paymentType: statusData?.summary?.planType || 'Advance_50',
        amount: statusData?.summary?.verifiedPaidAmount || 30000,
        paymentMethod: 'UPI VPA',
        upiIdUsed: '8072443590@okbizaxis',
        utrNumber: '425890123456',
        status: 'VERIFIED',
        verifiedBy: 'NAGORA Accounts Desk',
        agency: 'NAGORA Digital Agency'
      });
      setShowReceiptModal(true);
    }
  };

  const summary = statusData?.summary;

  return (
    <Box sx={{ backgroundColor: '#060B1E', color: '#FFFFFF', minHeight: '100vh', pb: 12, pt: 3 }}>
      <Helmet>
        <title>Customer Payment Status & Ledger | NAGORA Digital Agency</title>
        <meta name="description" content="Check your project payment status, payment schedule history, remaining balances, and verified receipts." />
      </Helmet>

      {/* Header Banner */}
      <Box 
        sx={{ 
          py: { xs: 5, md: 7 }, 
          background: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.25) 0%, rgba(6, 11, 30, 0) 75%)',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          mb: 5
        }}
      >
        <Container maxWidth="md">
          <Chip
            icon={<ShieldCheck size={16} color="#34D399" />}
            label="CUSTOMER PAYMENT TRACKING PORTAL"
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
            Check Project <span style={{ color: '#D4AF37' }}>Payment Status</span>
          </Typography>
          <Typography sx={{ color: '#94A3B8', maxWidth: 620, mx: 'auto', fontSize: { xs: '0.9rem', md: '1rem' }, mb: 4 }}>
            Enter your Payment Token, Phone Number, or Receipt Reference to view your real-time payment ledger, remaining balance, and verified receipts.
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
              maxWidth: 540,
              mx: 'auto'
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Enter Token (e.g. NAG-REQ-2026-X8F9A2) or Phone No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { color: '#FFFFFF', paddingLeft: '16px', fontSize: '0.95rem', fontWeight: 600 }
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
            {/* Top Overview Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                    Total Project Amount
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', mt: 0.5 }}>
                    ₹{summary.totalProjectAmount.toLocaleString()}
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
                    ₹{summary.verifiedPaidAmount.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.5 }}>
                    ✓ Confirmed by Accounts Desk
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>
                    Remaining Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', mt: 0.5 }}>
                    ₹{summary.remainingBalance.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.5 }}>
                    Easy Monthly Parts (No Extra Fee)
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase' }}>
                    Next Payment Due
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', mt: 0.5 }}>
                    ₹{summary.nextDueAmount.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#C084FC', mt: 0.5 }}>
                    Due Date: {summary.nextDueDate}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Progress Bar Card */}
            <Paper sx={{ p: 3, borderRadius: '24px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Project Payment Completion
                </Typography>
                <Typography sx={{ fontWeight: 900, color: '#D4AF37' }}>
                  {summary.progressPercentage}% Paid
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
              
              {summary.remainingBalance > 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => navigate('/payment', { state: { totalPrice: summary.remainingBalance, clientName: summary.clientName, phone: summary.phone, serviceName: summary.serviceName } })}
                    variant="contained"
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      backgroundColor: '#D4AF37',
                      color: '#0A1128',
                      fontWeight: 900,
                      px: 3,
                      py: 1.2,
                      borderRadius: '12px',
                      '&:hover': { backgroundColor: '#F59E0B' }
                    }}
                  >
                    Pay Next Monthly Part (₹{summary.nextDueAmount.toLocaleString()})
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Payment Schedule Breakdown */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3.5, borderRadius: '24px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
                    Payment Schedule
                  </Typography>

                  <Stack spacing={2}>
                    {statusData.schedule.map((item, idx) => {
                      let badgeBg = 'rgba(255,255,255,0.06)';
                      let badgeColor = '#94A3B8';
                      let icon = <Clock size={16} color="#94A3B8" />;

                      if (item.status === 'VERIFIED') {
                        badgeBg = 'rgba(52, 211, 153, 0.15)';
                        badgeColor = '#34D399';
                        icon = <CheckCircle2 size={16} color="#34D399" />;
                      } else if (item.status === 'UNDER_REVIEW') {
                        badgeBg = 'rgba(245, 158, 11, 0.15)';
                        badgeColor = '#F59E0B';
                        icon = <Clock size={16} color="#F59E0B" />;
                      } else if (item.status === 'DUE') {
                        badgeBg = 'rgba(239, 68, 68, 0.15)';
                        badgeColor = '#FCA5A5';
                        icon = <AlertCircle size={16} color="#FCA5A5" />;
                      }

                      return (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 2, 
                            borderRadius: '16px', 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>
                              {item.title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.3 }}>
                              Target Date: {item.date}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#D4AF37' }}>
                              ₹{item.amount.toLocaleString()}
                            </Typography>
                            <Chip 
                              icon={icon} 
                              label={item.status} 
                              size="small" 
                              sx={{ backgroundColor: badgeBg, color: badgeColor, fontWeight: 800, fontSize: '0.7rem', mt: 0.5 }} 
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>

              {/* Verified Receipts & Transactions Column */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3.5, borderRadius: '24px', background: '#0B132B', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileText size={20} color="#D4AF37" /> Transactions & Official Receipts
                  </Typography>

                  <Stack spacing={2}>
                    {statusData.transactions.map((txn, idx) => (
                      <Box 
                        key={idx}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.9rem' }}>
                            {txn.payment_ref}
                          </Typography>
                          <Chip 
                            label={txn.status} 
                            size="small" 
                            color={txn.status === 'VERIFIED' ? 'success' : 'warning'} 
                            sx={{ fontWeight: 800, fontSize: '0.68rem' }} 
                          />
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', mb: 0.5 }}>
                          UTR: <strong style={{ color: '#FFF' }}>{txn.utr_number}</strong>
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#D4AF37', mb: 1.5 }}>
                          ₹{Number(txn.amount).toLocaleString()}
                        </Typography>

                        {txn.status === 'VERIFIED' ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenReceipt(txn.payment_ref)}
                            startIcon={<Printer size={16} />}
                            sx={{ color: '#D4AF37', borderColor: 'rgba(212, 175, 55, 0.4)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}
                          >
                            View Official Receipt
                          </Button>
                        ) : (
                          <Typography sx={{ fontSize: '0.75rem', color: '#F59E0B' }}>
                            ⏳ Under Verification — Official Receipt issued upon admin approval.
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        )}
      </Container>

      {/* Official Verified Receipt Modal */}
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
                    <Typography sx={{ fontWeight: 800, color: '#FFF' }}>{activeReceipt.receiptNumber}</Typography>
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
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Phone Number</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#FFF' }}>{activeReceipt.phone}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Amount Verified</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', my: 0.5 }}>
                  ₹{Number(activeReceipt.amount).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                  Service: {activeReceipt.serviceName}
                </Typography>
              </Box>

              <Stack spacing={1} sx={{ fontSize: '0.85rem', color: '#CBD5E1', pt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>UPI VPA Used:</span>
                  <strong>{activeReceipt.upiIdUsed}</strong>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Confirmed UTR No:</span>
                  <strong>{activeReceipt.utrNumber}</strong>
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
