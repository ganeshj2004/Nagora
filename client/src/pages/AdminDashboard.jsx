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
  Tab
} from '@mui/material';
import { LogOut, RefreshCw, Inbox, CheckCircle, Clock } from 'lucide-react';
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

const statusOptions = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];

export default function AdminDashboard() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const handleStatusChange = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    // Also send backend PATCH API call
    axios.patch(`/api/admin/enquiries/${id}`, { status: newStatus }).catch((err) => console.log(err));
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
              Manage customer enquiries, update sales statuses, and monitor service leads.
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

        {/* Metric Cards */}
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

        {/* Main Table */}
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Box sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      </Container>
    </Box>
  );
}
