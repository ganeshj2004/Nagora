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
  Tabs, 
  Tab, 
  MenuItem, 
  Chip, 
  Stack, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider
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
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const UPI_VPA = '8072443590@okbizaxis';
const PAYEE_NAME = 'NAGORA Digital Agency';

const PACKAGES_LIST = [
  { name: 'Starter Business Web', price: 30000 },
  { name: 'Growth E-Commerce / Custom Site', price: 60000 },
  { name: 'Enterprise Web / Mobile App', price: 120000 },
  { name: 'SEO & Search Growth', price: 45000 },
  { name: 'App Development', price: 90000 },
  { name: 'Video Production & Editing', price: 50000 },
  { name: 'Branding & Visual Identity', price: 35000 },
  { name: 'Custom Agency Project', price: 60000 }
];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state || {};

  // Plan Mode: 0 = Full Payment, 1 = 50% Advance, 2 = Monthly Installment Plan
  const [planIndex, setPlanIndex] = useState(initialState.mode !== undefined ? initialState.mode : 1);
  
  // Client details
  const [clientName, setClientName] = useState(initialState.clientName || '');
  const [email, setEmail] = useState(initialState.email || '');
  const [phone, setPhone] = useState(initialState.phone || '');
  const [company, setCompany] = useState(initialState.company || '');
  const [serviceName, setServiceName] = useState(initialState.serviceName || PACKAGES_LIST[1].name);
  
  // Financial calculation (Server-driven / preset)
  const [totalProjectAmount, setTotalProjectAmount] = useState(initialState.totalPrice || PACKAGES_LIST[1].price);

  // UTR submission state
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ackData, setAckData] = useState(null);
  const [showAckModal, setShowAckModal] = useState(false);

  // Update total budget if service dropdown changes
  const handleServiceChange = (selectedName) => {
    setServiceName(selectedName);
    const found = PACKAGES_LIST.find(p => p.name === selectedName);
    if (found) {
      setTotalProjectAmount(found.price);
    }
  };

  // Derive plan type string and calculated amount due
  let planTypeKey = 'Advance_50';
  let calculatedAmountDue = 0;
  let planDescription = '';

  if (planIndex === 0) {
    planTypeKey = 'Full';
    calculatedAmountDue = Number(totalProjectAmount) || 0;
    planDescription = `100% Full Payment for ${serviceName}`;
  } else if (planIndex === 1) {
    planTypeKey = 'Advance_50';
    calculatedAmountDue = Math.round((Number(totalProjectAmount) || 0) * 0.5);
    const remaining = (Number(totalProjectAmount) || 0) - calculatedAmountDue;
    planDescription = `50% Payment to Start ${serviceName} (Remaining ₹${remaining.toLocaleString()} in easy monthly parts)`;
  } else {
    planTypeKey = 'Installments_Monthly';
    const remainingBalance = (Number(totalProjectAmount) || 0) * 0.5;
    calculatedAmountDue = Math.round(remainingBalance / 3);
    planDescription = `Easy Monthly Payment for ${serviceName} (Part 1 of 3)`;
  }

  // Dynamic UPI Intent string
  const upiIntentUrl = `upi://pay?pa=${UPI_VPA}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${calculatedAmountDue}&tn=${encodeURIComponent(planDescription)}&cu=INR`;
  
  // Dynamic QR Code image URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_VPA);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 6) {
      setSubmitError('Please enter a valid Transaction Reference / UTR Number (minimum 6 digits).');
      return;
    }
    if (!clientName || !email || !phone) {
      setSubmitError('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      client_name: clientName,
      email,
      phone,
      company,
      service_name: serviceName,
      plan_type: planTypeKey,
      total_project_amount: Number(totalProjectAmount),
      utr_number: utrNumber.trim(),
      notes: planDescription
    };

    try {
      const res = await axios.post('/api/payments/submit', payload);
      if (res.data && res.data.success) {
        setAckData(res.data.acknowledgement);
        setShowAckModal(true);
      } else {
        setSubmitError(res.data?.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to submit payment. Please verify your UTR and network connection.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#060B1E', color: '#FFFFFF', minHeight: '100vh', pb: 12, pt: 3 }}>
      <Helmet>
        <title>Agency Billing & Payment Portal | NAGORA Digital Agency</title>
        <meta name="description" content="Securely pay project invoices or 50% advance payments via UPI VPA 8072443590@okbizaxis." />
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
        <Container maxWidth="lg">
          <Chip
            icon={<ShieldCheck size={16} color="#34D399" />}
            label="🔒 100% SECURE PAYMENTS"
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
            Easy & Fast <span style={{ color: '#D4AF37' }}>UPI Payments</span>
          </Typography>
          <Typography sx={{ color: '#94A3B8', maxWidth: 680, mx: 'auto', fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Pay full project price or pay 50% now to start your project directly via UPI VPA <strong style={{ color: '#FFF' }}>{UPI_VPA}</strong>. Zero extra charges.
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
              Check My Payment Status
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Payment Plan Selector Tabs */}
        <Paper
          elevation={0}
          sx={{
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            p: 1,
            mb: 5
          }}
        >
          <Tabs
            value={planIndex}
            onChange={(e, val) => setPlanIndex(val)}
            variant="fullWidth"
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#D4AF37',
                height: 3,
                borderRadius: '3px'
              },
              '& .MuiTab-root': {
                fontWeight: 800,
                fontSize: { xs: '0.82rem', md: '0.95rem' },
                color: '#94A3B8',
                py: 2,
                '&.Mui-selected': {
                  color: '#FFFFFF',
                }
              }
            }}
          >
            <Tab icon={<Zap size={18} color="#38BDF8" />} iconPosition="start" label="🚀 Pay Full Amount" />
            <Tab icon={<Sparkles size={18} color="#D4AF37" />} iconPosition="start" label="⚡ Pay 50% Now to Start" />
            <Tab icon={<Clock size={18} color="#C084FC" />} iconPosition="start" label="🔄 Pay Monthly Parts" />
          </Tabs>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column: Form & Project Calculation */}
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
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard size={22} color="#7C3AED" /> Client & Service Details
              </Typography>

              <Stack spacing={2.5}>
                {/* Full Name */}
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', mb: 0.8 }}>
                    Full Name *
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    InputProps={{
                      style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px' }
                    }}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', mb: 0.8 }}>
                      Email Address *
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@company.com"
                      InputProps={{
                        style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px' }
                      }}
                      sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', mb: 0.8 }}>
                      Phone / WhatsApp *
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      InputProps={{
                        style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px' }
                      }}
                      sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                </Grid>

                {/* Service Selection */}
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', mb: 0.8 }}>
                    Select Service Package *
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={serviceName}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    InputProps={{
                      style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px' }
                    }}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                  >
                    {PACKAGES_LIST.map((pkg) => (
                      <MenuItem key={pkg.name} value={pkg.name} style={{ color: '#000' }}>
                        {pkg.name} (₹{pkg.price.toLocaleString()})
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Total Project Amount (Read only display) */}
                <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Project Investment:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF', mt: 0.3 }}>
                    ₹{Number(totalProjectAmount).toLocaleString()}
                  </Typography>
                </Box>

                {/* Plan Breakdown Card */}
                {planIndex === 1 && (
                  <Box sx={{ p: 2.5, borderRadius: '16px', background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.35)' }}>
                    <Typography sx={{ fontWeight: 800, color: '#D4AF37', mb: 1, fontSize: '0.9rem' }}>
                      50% Flexible Advance Breakdown
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.85rem', mb: 1 }}>
                      <span style={{ color: '#94A3B8' }}>Upfront Advance (50%):</span>
                      <strong style={{ color: '#34D399', fontSize: '1.1rem' }}>
                        ₹{Math.round(totalProjectAmount * 0.5).toLocaleString()}
                      </strong>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.85rem' }}>
                      <span style={{ color: '#94A3B8' }}>Pay Later in Easy Parts (3 Months):</span>
                      <strong style={{ color: '#C084FC' }}>
                        ₹{Math.round((totalProjectAmount * 0.5) / 3).toLocaleString()}/mo
                      </strong>
                    </Stack>
                  </Box>
                )}

                {planIndex === 2 && (
                  <Box sx={{ p: 2.5, borderRadius: '16px', background: 'rgba(192, 132, 252, 0.12)', border: '1px solid rgba(192, 132, 252, 0.35)' }}>
                    <Typography sx={{ fontWeight: 800, color: '#C084FC', mb: 1, fontSize: '0.9rem' }}>
                      Easy Monthly Payment Breakdown
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.85rem', mb: 1 }}>
                      <span style={{ color: '#94A3B8' }}>Monthly Payment Amount:</span>
                      <strong style={{ color: '#D4AF37', fontSize: '1.1rem' }}>
                        ₹{Math.round((totalProjectAmount * 0.5) / 3).toLocaleString()}
                      </strong>
                    </Stack>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      * Split into 3 simple monthly payments with zero extra charges.
                    </Typography>
                  </Box>
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
                <QrCode size={22} color="#D4AF37" /> Step-by-Step UPI Payment
              </Typography>

              {/* Exact Amount Due Box */}
              <Box sx={{ my: 2, p: 2, borderRadius: '16px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Amount Payable Now ({planTypeKey.replace('_', ' ')})
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#D4AF37', my: 0.5 }}>
                  ₹{calculatedAmountDue.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                  Payee: <strong style={{ color: '#FFF' }}>{PAYEE_NAME}</strong>
                </Typography>
              </Box>

              {/* Dynamic QR Code Display */}
              <Box sx={{ position: 'relative', display: 'inline-block', my: 2 }}>
                <Box
                  component="img"
                  src={qrImageUrl}
                  alt="UPI QR Code"
                  sx={{
                    width: 210,
                    height: 210,
                    borderRadius: '16px',
                    p: 1.5,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                />
              </Box>

              {/* UPI ID Quick Copy Box */}
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
                    {UPI_VPA}
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
                    textTransform: 'none',
                    px: 2
                  }}
                >
                  {copiedUpi ? 'Copied!' : 'Copy UPI'}
                </Button>
              </Box>

              {/* Mobile App Launcher Links */}
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 3.5 }}>
                <Button
                  component="a"
                  href={upiIntentUrl}
                  target="_blank"
                  variant="outlined"
                  size="small"
                  startIcon={<Smartphone size={16} />}
                  sx={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  Pay via Mobile UPI App (GPay / PhonePe / Paytm / BHIM)
                </Button>
              </Stack>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 3 }} />

              {/* UTR Submission Section */}
              <Box component="form" onSubmit={handleSubmitPayment} sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFF', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={18} color="#34D399" /> Already Transferred? Enter UTR
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mb: 2 }}>
                  Paste the 12-digit UPI Transaction Reference / UTR Number from your payment app receipt below.
                </Typography>

                {submitError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                    {submitError}
                  </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', mb: 0.8 }}>
                    UPI Transaction Reference / UTR *
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 425890123456"
                    InputProps={{
                      style: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.05)', fontWeight: 800, borderRadius: '12px' }
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
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 100%)',
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting Reference...' : 'Submit Payment Reference'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Payment Submission Acknowledgement Modal */}
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
          <Chip label="PAYMENT SUBMITTED — UNDER REVIEW" color="warning" size="small" sx={{ mb: 1, fontWeight: 800 }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#D4AF37' }}>
            Submission Acknowledgement
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            NAGORA Digital Agency Billing Desk
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {ackData && (
            <Stack spacing={2} sx={{ py: 1 }}>
              <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '0.82rem' }}>
                Your UTR reference has been logged. Our accounts team will verify the transaction against bank records. Official verified receipts are issued upon confirmation.
              </Alert>

              <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Payment Ref</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#FFF' }}>{ackData.paymentRef}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tracking Token</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.8rem' }}>{ackData.requestToken}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Client Name</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#FFF' }}>{ackData.clientName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Submitted UTR</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#D4AF37' }}>{ackData.utrNumber}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 2, borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Amount Transferred</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37', my: 0.5 }}>
                  ₹{Number(ackData.submittedAmount).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                  Service: {ackData.serviceName} ({ackData.planType.replace('_', ' ')})
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              setShowAckModal(false);
              navigate(`/payment-status/${ackData?.requestToken || ''}`);
            }}
            variant="contained"
            fullWidth
            startIcon={<Search size={18} />}
            sx={{ backgroundColor: '#7C3AED', color: '#FFF', fontWeight: 800, py: 1.2 }}
          >
            Track Payment Status & View Ledger
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
