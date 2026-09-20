import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { LogOut, RefreshCw, Inbox, CheckCircle, Clock, CreditCard, Search, ShieldCheck, Check, X, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const initialEnquiries = [
  {
    id: 1,
    name: 'Rahul Sharma',
    phone: '+91 98765 11223',
    email: 'rahul@auraproperties.com',
    company: 'Aura Real Estate',
    service: 'Website Development',
    budget: '₹1,50,000 - ₹3,50,000',
    message: 'We want a modern high-speed property listing website with virtual tour integration.',
    status: 'New',
    created_at: '2026-08-21 14:30',
  },
  {
    id: 2,
    name: 'Pooja Verma',
    phone: '+91 98112 44556',
    email: 'pooja@kinetical.com',
    company: 'Kinetic Fashion',
    service: 'SEO & Search Growth',
    budget: '₹50,000 - ₹1,50,000',
    message: 'Looking for technical SEO fixes and Google keyword ranking improvement.',
    status: 'Contacted',
    created_at: '2026-08-20 11:15',
  },
  {
    id: 3,
    name: 'Amit Patel',
    phone: '+91 97223 88990',
    email: 'amit@solstice.in',
    company: 'Solstice Studios',
    service: 'Videography',
    budget: '₹3,50,000+',
    message: 'Need a 4K brand film shot on location across 3 cities.',
    status: 'In Discussion',
    created_at: '2026-08-19 09:45',
  },
];

const initialPayments = [
  {
    id: 101,
    payment_ref: 'NAG-PAY-882194',
    request_token: 'NAG-REQ-2026-A1B2',
    client_name: 'Rahul Sharma',
    email: 'rahul@auraproperties.com',
    phone: '+91 98765 11223',
    company: 'Aura Real Estate',
    service_name: 'Growth E-Commerce / Custom Site',
    payment_type: 'Advance_50',
    amount: 30000,
    utr_number: '425890123456',
    upi_id_used: '8072443590@okbizaxis',
    status: 'VERIFIED',
    verified_by: 'Admin',
    created_at: '2026-08-21 15:45',
  },
  {
    id: 102,
    payment_ref: 'NAG-PAY-491028',
    request_token: 'NAG-REQ-2026-C3D4',
    client_name: 'Pooja Verma',
    email: 'pooja@kinetical.com',
    phone: '+91 98112 44556',
    company: 'Kinetic Fashion',
    service_name: 'SEO & Search Growth',
    payment_type: 'Full',
    amount: 45000,
    utr_number: '425891998877',
    upi_id_used: '8072443590@okbizaxis',
    status: 'UNDER_REVIEW',
    created_at: '2026-08-22 10:20',
  }
];

const statusOptions = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];

export default function AdminDashboard() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [payments, setPayments] = useState(initialPayments);
  const [activeTab, setActiveTab] = useState(0); // 0 = Enquiries, 1 = Payments & Installment Billing
  const [searchQuery, setSearchQuery] = useState('');

  // Verification & Rejection Modal State
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      axios.get('/api/payments', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data && res.data.payments && res.data.payments.length > 0) {
            setPayments(res.data.payments);
          }
        })
        .catch(() => {});
    }
  }, [token, navigate]);

  const handleStatusChange = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    axios.patch(`/api/admin/enquiries/${id}`, { status: newStatus }).catch((err) => console.log(err));
  };

  const handleVerifySubmit = async () => {
    if (!selectedTxn) return;
    setActionLoading(true);
    setActionFeedback('');

    try {
      const res = await axios.post(`/api/admin/payments/${selectedTxn.id}/verify`, { notes: verifyNotes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setPayments(prev => prev.map(p => p.id === selectedTxn.id ? { ...p, status: 'VERIFIED', verified_by: 'Admin' } : p));
        setShowVerifyModal(false);
        setSelectedTxn(null);
      }
    } catch (err) {
      // Local state fallback for demonstration
      setPayments(prev => prev.map(p => p.id === selectedTxn.id ? { ...p, status: 'VERIFIED', verified_by: 'Admin' } : p));
      setShowVerifyModal(false);
      setSelectedTxn(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedTxn || !rejectionReason.trim()) {
      setActionFeedback('Rejection reason is required.');
      return;
    }
    setActionLoading(true);

    try {
      await axios.post(`/api/admin/payments/${selectedTxn.id}/reject`, { rejection_reason: rejectionReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(prev => prev.map(p => p.id === selectedTxn.id ? { ...p, status: 'REJECTED', rejection_reason: rejectionReason } : p));
      setShowRejectModal(false);
      setSelectedTxn(null);
    } catch (err) {
      setPayments(prev => prev.map(p => p.id === selectedTxn.id ? { ...p, status: 'REJECTED', rejection_reason: rejectionReason } : p));
      setShowRejectModal(false);
      setSelectedTxn(null);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return { bg: '#EFF6FF', text: '#2563EB' };
      case 'Contacted': return { bg: '#FEF3C7', text: '#D97706' };
      case 'In Discussion': return { bg: '#F3E8FF', text: '#7C3AED' };
      case 'Converted': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'Closed': return { bg: '#F1F5F9', text: '#64748B' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED': return { bg: '#DCFCE7', text: '#15803D', label: '✓ VERIFIED' };
      case 'UNDER_REVIEW': return { bg: '#FEF3C7', text: '#B45309', label: '⏳ UNDER REVIEW' };
      case 'REJECTED': return { bg: '#FEE2E2', text: '#B91C1C', label: '✕ REJECTED' };
      default: return { bg: '#F1F5F9', text: '#64748B', label: status };
    }
  };

  const filteredPayments = payments.filter(p => 
    p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.utr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.payment_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  const totalVerifiedRevenue = payments
    .filter(p => p.status === 'VERIFIED')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Box sx={{ py: 6, backgroundColor: '#F8FAFC', minHeight: '90vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A1128' }}>
              NAGORA Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Verify customer UPI transaction UTRs, manage 0% interest payment plans, and monitor project billing.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={logout}
            startIcon={<LogOut size={18} />}
            sx={{ borderColor: '#DC2626', color: '#DC2626', fontWeight: 700 }}
          >
            Logout
          </Button>
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
            <Tab icon={<Inbox size={18} />} iconPosition="start" label={`Leads & Enquiries (${enquiries.length})`} />
            <Tab icon={<CreditCard size={18} />} iconPosition="start" label={`Agency Billing & Verifications (${payments.length})`} />
          </Tabs>
        </Paper>

        {/* Metric Cards */}
        {activeTab === 0 ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>TOTAL ENQUIRIES</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0A1128', mt: 0.5 }}>{enquiries.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 700 }}>NEW LEADS</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5 }}>
                  {enquiries.filter(e => e.status === 'New').length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 700 }}>IN DISCUSSION</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#7C3AED', mt: 0.5 }}>
                  {enquiries.filter(e => e.status === 'In Discussion').length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>CONVERTED CLIENTS</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#16A34A', mt: 0.5 }}>
                  {enquiries.filter(e => e.status === 'Converted').length}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>VERIFIED COLLECTIONS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#16A34A', mt: 0.5 }}>
                  ₹{totalVerifiedRevenue.toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700 }}>PENDING VERIFICATIONS</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#D97706', mt: 0.5 }}>
                  {payments.filter(p => p.status === 'UNDER_REVIEW').length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 700 }}>50% ADVANCE PLANS</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#7C3AED', mt: 0.5 }}>
                  {payments.filter(p => p.payment_type === 'Advance_50').length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 700 }}>ACTIVE VPA</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0A1128', mt: 0.8 }}>
                  8072443590@okbizaxis
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab 0: Enquiries */}
        {activeTab === 0 && (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128' }}>
                Customer Submissions & Enquiries
              </Typography>
            </Box>

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
                  {enquiries.map((row) => {
                    const style = getStatusColor(row.status);
                    return (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>#{row.id}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>{row.created_at}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128' }}>{row.name}</Typography>
                          <Typography variant="body2" sx={{ color: '#7C3AED', fontSize: '0.85rem' }}>{row.email}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>{row.phone} • {row.company}</Typography>
                        </TableCell>

                        <TableCell>
                          <Chip label={row.service} size="small" color="primary" sx={{ fontWeight: 700, mb: 0.5 }} />
                          <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 600 }}>
                            {row.budget}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.5 }}>
                            {row.message}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Select
                            size="small"
                            value={row.status}
                            onChange={(e) => handleStatusChange(row.id, e.target.value)}
                            sx={{
                              backgroundColor: style.bg,
                              color: style.text,
                              fontWeight: 800,
                              borderRadius: 2,
                              fontSize: '0.85rem',
                              '& .MuiSelect-select': { py: 0.8 },
                            }}
                          >
                            {statusOptions.map((st) => (
                              <MenuItem key={st} value={st}>
                                {st}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Tab 1: Payments & Billing Ledger */}
        {activeTab === 1 && (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128' }}>
                UPI Payment Requests & Verification Table
              </Typography>
              <TextField
                size="small"
                placeholder="Search UTR, Client, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment>
                }}
                sx={{ width: { xs: '100%', sm: 260 } }}
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Payment Ref & Date</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Client Details</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Plan & Amount</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Submitted UTR</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0A1128' }}>Status & Verification Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredPayments.map((p) => {
                    const badge = getPaymentStatusBadge(p.status);
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#7C3AED' }}>{p.payment_ref}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>{p.created_at}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128' }}>{p.client_name}</Typography>
                          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>{p.phone} • {p.email}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0A1128' }}>
                            ₹{Number(p.amount).toLocaleString()}
                          </Typography>
                          <Chip 
                            label={p.payment_type.replace('_', ' ')} 
                            size="small" 
                            sx={{ 
                              fontWeight: 800, 
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(124, 58, 237, 0.1)',
                              color: '#7C3AED'
                            }} 
                          />
                        </TableCell>

                        <TableCell>
                          <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#F1F5F9', display: 'inline-block' }}>
                            <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                              {p.utr_number}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip 
                              label={badge.label} 
                              size="small" 
                              sx={{ backgroundColor: badge.bg, color: badge.text, fontWeight: 800 }} 
                            />

                            {p.status === 'UNDER_REVIEW' && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setSelectedTxn(p);
                                    setShowVerifyModal(true);
                                  }}
                                  startIcon={<Check size={14} />}
                                  sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                                >
                                  Verify
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => {
                                    setSelectedTxn(p);
                                    setShowRejectModal(true);
                                  }}
                                  startIcon={<X size={14} />}
                                  sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {p.status === 'VERIFIED' && (
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => navigate(`/payment-status/${p.payment_ref}`)}
                                startIcon={<Eye size={14} />}
                                sx={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 700 }}
                              >
                                View Ledger
                              </Button>
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

      {/* Admin Verification Confirmation Modal */}
      <Dialog open={showVerifyModal} onClose={() => setShowVerifyModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm Bank Verification</DialogTitle>
        <DialogContent dividers>
          {selectedTxn && (
            <Stack spacing={2}>
              <Alert severity="info">
                You are confirming that ₹{Number(selectedTxn.amount).toLocaleString()} from {selectedTxn.client_name} under UTR <strong>{selectedTxn.utr_number}</strong> has been credited to bank VPA <strong>8072443590@okbizaxis</strong>.
              </Alert>

              <TextField
                label="Admin Verification Notes (Optional)"
                fullWidth
                multiline
                rows={2}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="e.g. Bank statement credited on 17 Sep 2026."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowVerifyModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleVerifySubmit} disabled={actionLoading} sx={{ fontWeight: 800 }}>
            {actionLoading ? 'Verifying...' : 'Approve & Issue Official Receipt'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Rejection Modal */}
      <Dialog open={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#DC2626' }}>Reject UTR Submission</DialogTitle>
        <DialogContent dividers>
          {selectedTxn && (
            <Stack spacing={2}>
              {actionFeedback && <Alert severity="error">{actionFeedback}</Alert>}

              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Please provide a clear rejection reason for client {selectedTxn.client_name} (UTR: {selectedTxn.utr_number}):
              </Typography>

              <TextField
                label="Rejection Reason *"
                fullWidth
                multiline
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR reference not found in bank statement or amount mismatched."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowRejectModal(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRejectSubmit} disabled={actionLoading} sx={{ fontWeight: 800 }}>
            {actionLoading ? 'Rejecting...' : 'Reject UTR Reference'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
