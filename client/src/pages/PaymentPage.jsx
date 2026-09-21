import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  Clock, 
  ArrowRight,
  Smartphone,
  ExternalLink,
  Lock,
  Search,
  FolderCheck,
  AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // URL query params parse
  const searchParams = new URLSearchParams(location.search);
  const initialProjectId = searchParams.get('projectId') || '';
  const initialPaymentId = searchParams.get('paymentId') || '';

  // Form Entry State
  const [projectIdInput, setProjectIdInput] = useState(initialProjectId);
  const [paymentIdInput, setPaymentIdInput] = useState(initialPaymentId);

  // Authoritative State from Server
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  // UTR Submission state
  const [utrNumber, setUtrNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ackData, setAckData] = useState(null);
  const [showAckModal, setShowAckModal] = useState(false);

  // Auto-verify if query params present
  useEffect(() => {
    if (initialProjectId) {
      verifyProjectEntry(initialProjectId, initialPaymentId);
    }
  }, [initialProjectId, initialPaymentId]);

  const verifyProjectEntry = async (projId, payId) => {
    if (!projId || !projId.trim()) return;
    setIsVerifying(true);
    setVerifyError('');

    try {
      const res = await axios.post('/api/payment/verify-entry', {
        project_id: projId.trim(),
        payment_id: payId ? payId.trim() : undefined
      });

      if (res.data && res.data.success) {
        setVerifiedData(res.data);
      } else {
        setVerifyError(res.data?.message || 'Invalid Project ID or Payment ID.');
      }
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Unable to verify Project Confirmation details.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    verifyProjectEntry(projectIdInput, paymentIdInput);
  };

  const handleCopyUpi = () => {
    const vpa = verifiedData?.payment?.upiVpa || '8072443590@okbizaxis';
    navigator.clipboard.writeText(vpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 6) {
      setSubmitError('Please enter a valid Transaction Reference / UTR Number (minimum 6 digits).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        project_id: verifiedData.project.projectId,
        payment_id: verifiedData.payment.paymentId,
        utr_number: utrNumber.trim(),
        notes
      };

      const res = await axios.post('/api/payment/submit-utr', payload);
      if (res.data && res.data.success) {
        setAckData(res.data.acknowledgement);
        setShowAckModal(true);
      } else {
        setSubmitError(res.data?.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Unable to submit UTR reference.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const upiVpa = verifiedData?.payment?.upiVpa || '8072443590@okbizaxis';
  const payeeName = verifiedData?.payment?.payeeName || 'NAGORA Digital Agency';
  const amountDue = verifiedData?.payment?.amountDue || 0;
  const paymentId = verifiedData?.payment?.paymentId || '';
  const milestoneTitle = verifiedData?.payment?.milestoneTitle || 'Digital Agency Services';

  // Dynamic UPI Intent string
  const upiIntentUrl = `upi://pay?pa=${upiVpa}&pn=${encodeURIComponent(payeeName)}&am=${amountDue}&tn=${encodeURIComponent(`NAGORA ${paymentId}`)}&cu=INR`;
  
  // Dynamic QR Code image URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiIntentUrl)}`;

  return (
    <Box sx={{ backgroundColor: '#060B1E', color: '#FFFFFF', minHeight: '100vh', pb: 12, pt: 3 }}>
      <Helmet>
        <title>Fast UPI Payments & Project Confirmation | NAGORA Digital Agency</title>
        <meta name="description" content="Securely pay digital agency project invoices or installments via official UPI VPA." />
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
        <Container maxWidth="lg">
          <Chip
            icon={<ShieldCheck size={16} color="#34D399" />}
            label="🔒 100% SECURE AGENCY PAYMENTS"
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
            Project Confirmation & <span style={{ color: '#D4AF37' }}>UPI Payments</span>
          </Typography>
          <Typography sx={{ color: '#94A3B8', maxWidth: 680, mx: 'auto', fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Enter your Project ID and Payment ID to verify your project invoice and transfer funds via UPI VPA <strong style={{ color: '#FFF' }}>{upiVpa}</strong>.
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/payment-status"
              variant="outlined"
              size="small"
              startIcon={<Search size={16} />}
              sx={{
                borderColor: 'rgba(212, 175, 55, 0.4)',
                color: '#D4AF37',
                fontWeight: 700,
                borderRadius: '50px',
                px: 2.5,
                '&:hover': { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.08)' }
              }}
            >
              Check My Project Payment Ledger
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {!verifiedData ? (
          /* STEP 1: VERIFY PROJECT ID & PAYMENT ID ENTRY FORM */
          <Paper
            elevation={0}
            sx={{
              maxHeight: 600,
              maxWidth: 580,
              mx: 'auto',
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center'
            }}
          >
            <FolderCheck size={44} color="#7C3AED" style={{ marginBottom: 12 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF', mb: 1 }}>
              Enter Project Confirmation Details
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
              Please enter the Project ID and Payment ID provided in your project confirmation message.
            </Typography>

            {verifyError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
                {verifyError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleManualVerify} sx={{ textAlign: 'left' }}>
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', mb: 0.8 }}>
                  Project ID *
                </Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="e.g. NAG-PROJ-2026-A1B2C3"
                  value={projectIdInput}
                  onChange={(e) => setProjectIdInput(e.target.value)}
                  InputProps={{
                    style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', fontFamily: 'monospace', fontWeight: 800 }
                  }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', mb: 0.8 }}>
                  Payment ID (Optional)
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. NAG-PAY-2026-A1B2C3-01"
                  value={paymentIdInput}
                  onChange={(e) => setPaymentIdInput(e.target.value)}
                  InputProps={{
                    style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', fontFamily: 'monospace', fontWeight: 800 }
                  }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isVerifying}
                endIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                sx={{
                  py: 1.5,
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  backgroundColor: '#7C3AED',
                  '&:hover': { backgroundColor: '#6D28D9' }
                }}
              >
                {isVerifying ? 'Verifying Details...' : 'Verify & Continue to Payment'}
              </Button>
            </Box>
          </Paper>
        ) : (
          /* STEP 2: VERIFIED PROJECT DETAILS & UPI PAYMENT INTERFACE */
          <Grid container spacing={4}>
            {/* Left Column: Authoritative Project Summary */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: '24px',
                  background: '#0F172A',
                  border: '1px solid rgba(255,255,255,0.15)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard size={22} color="#7C3AED" /> Confirmed Project Details
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setVerifiedData(null)}
                    sx={{ color: '#94A3B8', fontSize: '0.75rem' }}
                  >
                    Change ID
                  </Button>
                </Box>

                <Stack spacing={2.5}>
                  <Box sx={{ p: 2.5, borderRadius: '16px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                          PROJECT ID
                        </Typography>
                        <Typography sx={{ fontWeight: 900, color: '#7C3AED', fontSize: '1rem', fontFamily: 'monospace' }}>
                          {verifiedData.project.projectId}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                          PAYMENT ID
                        </Typography>
                        <Typography sx={{ fontWeight: 900, color: '#FFF', fontSize: '1rem', fontFamily: 'monospace' }}>
                          {verifiedData.payment.paymentId}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>Client Name:</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#FFF' }}>{verifiedData.project.clientName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>Service Package:</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#38BDF8' }}>{verifiedData.project.serviceName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>Payment Plan:</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#C084FC' }}>{verifiedData.project.planType.replace('_', ' ')}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>Milestone Item:</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#D4AF37' }}>{verifiedData.payment.milestoneTitle}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>Due Date:</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#FFF' }}>{verifiedData.payment.dueDate}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Rejection Warning if applicable */}
                  {verifiedData.payment.status === 'REJECTED' && (
                    <Alert severity="error" sx={{ borderRadius: '12px' }}>
                      <strong>Previous UTR Submission Rejected:</strong> {verifiedData.payment.rejectionReason}
                      <br />
                      Please transfer the exact amount and submit the corrected UTR number below.
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Right Column: UPI Payment & UTR Submission */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: '24px',
                  background: '#0B132B',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <QrCode size={22} color="#D4AF37" /> Transfer via UPI & Submit UTR
                </Typography>

                {/* Amount Due Display */}
                <Box sx={{ my: 2, p: 2, borderRadius: '16px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Exact Amount Payable Now
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#D4AF37', my: 0.5 }}>
                    ₹{amountDue.toLocaleString('en-IN')}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                    Payee: <strong style={{ color: '#FFF' }}>{payeeName}</strong>
                  </Typography>
                </Box>

                {/* Dynamic QR Code */}
                <Box sx={{ position: 'relative', display: 'inline-block', my: 1.5 }}>
                  <Box
                    component="img"
                    src={qrImageUrl}
                    alt="UPI QR Code"
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: '16px',
                      p: 1.5,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                  />
                </Box>

                {/* UPI VPA Copy Box */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    maxWidth: 380,
                    mx: 'auto',
                    mb: 2.5
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                      UPI VPA ID
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#FFF' }}>
                      {upiVpa}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleCopyUpi}
                    startIcon={copiedUpi ? <Check size={16} /> : <Copy size={16} />}
                    sx={{
                      backgroundColor: copiedUpi ? '#34D399' : '#7C3AED',
                      color: '#FFF',
                      fontWeight: 800,
                      px: 2
                    }}
                  >
                    {copiedUpi ? 'Copied!' : 'Copy UPI'}
                  </Button>
                </Box>

                {/* Mobile Intent Launcher */}
                <Button
                  component="a"
                  href={upiIntentUrl}
                  target="_blank"
                  variant="outlined"
                  size="small"
                  startIcon={<Smartphone size={16} />}
                  sx={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, mb: 3 }}
                >
                  Pay via Mobile UPI App (GPay / PhonePe / Paytm)
                </Button>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 3 }} />

                {/* UTR Submission Form */}
                <Box component="form" onSubmit={handleSubmitUtr} sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFF', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle2 size={18} color="#34D399" /> Submit UTR Number
                  </Typography>

                  {submitError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                      {submitError}
                    </Alert>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', mb: 0.8 }}>
                      12-Digit Transaction Reference / UTR *
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 425890123456"
                      InputProps={{
                        style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.05)', fontWeight: 800, borderRadius: '12px', fontFamily: 'monospace' }
                      }}
                      sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.5)' } }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                    sx={{
                      py: 1.6,
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                      color: '#0A1128',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 100%)',
                      }
                    }}
                  >
                    {isSubmitting ? 'Submitting UTR...' : 'Submit Payment Reference'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* ACKNOWLEDGEMENT MODAL */}
      <Dialog
        open={showAckModal}
        onClose={() => setShowAckModal(false)}
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
          <Chip label="UTR SUBMITTED — UNDER REVIEW" color="warning" size="small" sx={{ mb: 1, fontWeight: 800 }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#D4AF37' }}>
            Payment Submission Received
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {ackData && (
            <Stack spacing={2} sx={{ py: 1 }}>
              <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '0.82rem' }}>
                Your UTR reference has been logged. Our accounts team will verify the transaction. Official verified receipts are issued upon approval.
              </Alert>

              <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Amount Submitted</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', my: 0.5 }}>
                  ₹{Number(ackData.amount).toLocaleString('en-IN')}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Project ID</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#7C3AED', fontFamily: 'monospace' }}>{ackData.projectId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Payment ID</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#FFF', fontFamily: 'monospace' }}>{ackData.paymentId}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Submitted UTR</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#FFF', fontFamily: 'monospace' }}>{ackData.utrNumber}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => {
              setShowAckModal(false);
              navigate(`/payment-status?projectId=${ackData?.projectId || ''}&paymentId=${ackData?.paymentId || ''}`);
            }}
            variant="contained"
            fullWidth
            startIcon={<Search size={18} />}
            sx={{ backgroundColor: '#7C3AED', color: '#FFF', fontWeight: 800, py: 1.2 }}
          >
            View Live Status & Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
