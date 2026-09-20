import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Slider, 
  Button, 
  Chip, 
  Paper,
  Stack
} from '@mui/material';
import { 
  Calculator, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Percent,
  Sparkles,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';

const PROJECT_PRESETS = [
  {
    name: 'Starter Business Web',
    basePrice: 30000,
    deliverables: ['Responsive 5-Page Site', 'Fast Load Speed', 'Basic SEO Setup', 'Contact Form & WhatsApp Integration'],
    idealFor: 'Small businesses & personal brands'
  },
  {
    name: 'Growth E-Commerce / Custom Site',
    basePrice: 60000,
    deliverables: ['Custom React/Node Architecture', 'Payment Gateway Integration', 'Advanced SEO & Analytics', 'Admin Management Panel'],
    idealFor: 'Growing brands & online stores'
  },
  {
    name: 'Enterprise Web / Mobile App',
    basePrice: 120000,
    deliverables: ['Full Stack Web + Mobile App', 'Custom Database & Backend API', 'High Scale Cloud Infrastructure', 'Priority 12-Month Support'],
    idealFor: 'Startups & enterprise platforms'
  }
];

export default function EmiCalculatorSection() {
  const navigate = useNavigate();
  const [projectIndex, setProjectIndex] = useState(1);
  const [customPrice, setCustomPrice] = useState(60000);
  const [tenure, setTenure] = useState(6); // 3, 6, or 12 months

  const activePreset = PROJECT_PRESETS[projectIndex];
  const totalPrice = customPrice;
  const upfrontPay = Math.round(totalPrice * 0.5);
  const remainingPay = totalPrice - upfrontPay;
  const monthlyEmi = Math.round(remainingPay / tenure);

  const handlePresetSelect = (idx) => {
    setProjectIndex(idx);
    setCustomPrice(PROJECT_PRESETS[idx].basePrice);
  };

  const handleSliderChange = (event, newValue) => {
    setCustomPrice(newValue);
  };

  const handleApplyEmi = () => {
    navigate('/payment', {
      state: {
        mode: 1, // 50% EMI Down Payment mode
        serviceName: activePreset ? activePreset.name : 'Custom Agency Project',
        totalPrice: totalPrice,
        tenure: tenure,
        monthlyEmi: monthlyEmi,
        subject: `50% Flexi-Pay: ${activePreset ? activePreset.name : 'Custom Project'} (₹${totalPrice.toLocaleString()})`,
      }
    });
  };

  return (
    <Box
      id="emi-calculator"
      sx={{
        py: { xs: 9, md: 14 },
        background: 'linear-gradient(180deg, #0A1128 0%, #060B1E 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative ambient glowing circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Heading */}
        <SectionHeading
          pill="PAY HALF NOW • PAY HALF LATER"
          title={
            <span>
              Start Your Project Today.{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Pay 50% Later.
              </span>
            </span>
          }
          subtitle="Split your project cost into easy monthly parts with zero extra charges. Pay 50% now to launch, and pay the rest in simple monthly steps as your business grows."
          lightMode={false}
        />

        {/* USP Highlight Badges */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
          {[
            { icon: <Percent size={18} color="#D4AF37" />, title: '0% Extra Fee', desc: 'No interest or hidden charges' },
            { icon: <Zap size={18} color="#38BDF8" />, title: 'Pay 50% to Start', desc: 'Instant project launch' },
            { icon: <ShieldCheck size={18} color="#C084FC" />, title: 'Direct & Simple', desc: 'No bank checks or loan papers' },
            { icon: <CreditCard size={18} color="#34D399" />, title: 'Easy UPI Payment', desc: 'Pay with GPay, PhonePe, Paytm' },
          ].map((feature, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ mb: 1, p: 1, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)' }}>
                  {feature.icon}
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.85rem', md: '0.95rem' }, color: '#FFFFFF' }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', mt: 0.3 }}>
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Interactive EMI Calculator Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: '20px', md: '28px' },
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            p: { xs: 3, sm: 4, md: 6 },
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)'
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Column: Preset selection & price slider */}
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculator size={22} color="#D4AF37" /> 1. Pick Your Package
              </Typography>

              {/* Package Presets */}
              <Grid container spacing={1.5} sx={{ mb: 4 }}>
                {PROJECT_PRESETS.map((preset, idx) => {
                  const isSelected = projectIndex === idx;
                  return (
                    <Grid item xs={12} sm={4} key={idx}>
                      <Box
                        onClick={() => handlePresetSelect(idx)}
                        sx={{
                          p: 2,
                          borderRadius: '14px',
                          cursor: 'pointer',
                          background: isSelected 
                            ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(212, 175, 55, 0.15) 100%)' 
                            : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected 
                            ? '2px solid #7C3AED' 
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          '&:hover': {
                            borderColor: '#D4AF37',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: isSelected ? '#D4AF37' : '#FFFFFF', mb: 0.5 }}>
                          {preset.name}
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                          ₹{preset.basePrice.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Custom Budget Slider */}
              <Box sx={{ mb: 4, px: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                    Or Customize Project Budget:
                  </Typography>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, color: '#7C3AED' }}>
                    ₹{customPrice.toLocaleString()}
                  </Typography>
                </Box>
                <Slider
                  value={customPrice}
                  min={20000}
                  max={250000}
                  step={5000}
                  onChange={handleSliderChange}
                  sx={{
                    color: '#7C3AED',
                    height: 8,
                    '& .MuiSlider-thumb': {
                      width: 22,
                      height: 22,
                      backgroundColor: '#D4AF37',
                      border: '3px solid #0A1128',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(212, 175, 55, 0.16)'
                      }
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255,255,255,0.15)'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, fontSize: '0.75rem' }}>
                  <span>₹20,000 (Starter)</span>
                  <span>₹2,50,000 (Custom Build)</span>
                </Box>
              </Box>

              {/* Tenure Selection */}
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                  2. Choose Easy Payment Months:
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {[3, 6, 9, 12].map((m) => (
                    <Button
                      key={m}
                      variant={tenure === m ? 'contained' : 'outlined'}
                      onClick={() => setTenure(m)}
                      sx={{
                        borderRadius: '50px',
                        px: { xs: 2, sm: 3 },
                        py: 0.8,
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        backgroundColor: tenure === m ? '#7C3AED' : 'transparent',
                        borderColor: tenure === m ? '#7C3AED' : 'rgba(255,255,255,0.2)',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: tenure === m ? '#6D28D9' : 'rgba(255,255,255,0.08)'
                        }
                      }}
                    >
                      {m} Months
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Deliverable Highlights */}
              {activePreset && (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>
                    What You Get Included:
                  </Typography>
                  <Grid container spacing={1}>
                    {activePreset.deliverables.map((item, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle2 size={16} color="#34D399" />
                          <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
                            {item}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>

            {/* Right Column: Live EMI Output Card */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, #121A3D 0%, #0A1029 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  p: { xs: 3, sm: 4 },
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Floating Tag */}
                <Chip
                  icon={<Sparkles size={14} color="#0A1128" />}
                  label="POPULAR CHOICE"
                  size="small"
                  sx={{
                    backgroundColor: '#D4AF37',
                    color: '#0A1128',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    position: 'absolute',
                    top: 16,
                    right: 16,
                  }}
                />

                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
                  Simple Payment Breakdown
                </Typography>

                {/* Upfront 50% Display */}
                <Box sx={{ mb: 3, p: 2, borderRadius: '16px', background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    1️⃣ Pay Now to Start (50%)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', mt: 0.5 }}>
                    ₹{upfrontPay.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#C084FC', mt: 0.5 }}>
                    ⚡ Pay this to immediately start work on your project
                  </Typography>
                </Box>

                {/* Monthly Installment Display */}
                <Box sx={{ mb: 4, p: 2.5, borderRadius: '16px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700 }}>
                    2️⃣ Pay Later in Easy Parts ({tenure} Months)
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#D4AF37', mt: 0.5, lineHeight: 1.1 }}>
                    ₹{monthlyEmi.toLocaleString()} <Typography component="span" sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>/ month</Typography>
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', mt: 1 }}>
                    🔄 Pay in simple monthly parts via UPI with 0% extra fee!
                  </Typography>
                </Box>

                {/* Total Summary */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 3.5, opacity: 0.8, fontSize: '0.85rem' }}>
                  <span>Total Project Price:</span>
                  <strong style={{ color: '#fff' }}>₹{totalPrice.toLocaleString()}</strong>
                </Box>

                {/* Apply Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleApplyEmi}
                  endIcon={<ArrowRight size={20} />}
                  sx={{
                    py: 1.8,
                    borderRadius: '14px',
                    fontWeight: 900,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                    color: '#0A1128',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 30px rgba(212, 175, 55, 0.4)'
                    }
                  }}
                >
                  Start Project with 50% Payment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
