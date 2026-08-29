import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Card, CardContent, Button, GlobalStyles } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import PreFooterCTA from '../sections/PreFooterCTA';

/* ─── Team Data (ordered by role seniority) ────────────────────────────── */
const TEAM = [
  {
    name: 'N. Mohamed Imran',
    role: 'Founder & Chief Executive Officer',
    photo: '/team/imran.jpg',
    badge: 'Leadership',
    accent: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
    badgeBg: 'rgba(212,175,55,0.12)',
    badgeColor: '#B8860B',
  },
  {
    name: 'Ganesh J',
    role: 'Web Development Lead',
    photo: '/team/ganesh.jpg',
    badge: 'Engineering',
    accent: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    badgeBg: 'rgba(124,58,237,0.10)',
    badgeColor: '#7C3AED',
  },
  {
    name: 'N. Mohamed Abdul Kalam',
    role: 'Full Stack Developer',
    photo: '/team/kalam.png',
    badge: 'Engineering',
    accent: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    badgeBg: 'rgba(124,58,237,0.10)',
    badgeColor: '#7C3AED',
  },
  {
    name: 'Mohamed Najmi',
    role: 'Full Stack Developer',
    photo: '/team/najmi.jpg',
    badge: 'Engineering',
    accent: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    badgeBg: 'rgba(124,58,237,0.10)',
    badgeColor: '#7C3AED',
  },
  {
    name: 'Mohamed Sajith S',
    role: 'UI / UX Designer',
    photo: '/team/sajith.jpg',
    badge: 'Design',
    accent: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    badgeBg: 'rgba(14,165,233,0.10)',
    badgeColor: '#0369A1',
  },
  {
    name: 'Aman Yusuf Syed M',
    role: 'Website Developer',
    photo: '/team/aman.png',
    badge: 'Development',
    accent: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    badgeBg: 'rgba(14,165,233,0.10)',
    badgeColor: '#0369A1',
  },
  {
    name: 'Irfan Barith N',
    role: 'Cold Caller',
    photo: '/team/irfan.jpg',
    badge: 'Business Dev',
    accent: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    badgeBg: 'rgba(16,185,129,0.10)',
    badgeColor: '#065F46',
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <Box>
      <Helmet>
        <title>About NAGORA — Digital Growth & Creative Studio</title>
        <meta name="description" content="Learn more about NAGORA Digital Agency, our philosophy, technology stack, and creative production capabilities." />
      </Helmet>

      {/* Hero Banner */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0A1128', color: '#FFFFFF', position: 'relative' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: '0.15em' }}>
            ABOUT NAGORA DIGITAL AGENCY
          </Typography>
          <Typography variant="h1" sx={{ color: '#FFFFFF', fontWeight: 800, mt: 1, mb: 3, maxWidth: 800 }}>
            Bringing Technology, Creativity & Strategy Together.
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: 700 }}>
            NAGORA was founded on a simple principle: businesses don't just need a website or a video clip. They need a growth engine that combines software engineering and visual identity to turn visitors into loyal customers.
          </Typography>
        </Container>
      </Box>

      {/* Philosophy BUILD GROW SHOW */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <SectionHeading
            pill="OUR BRAND PHILOSOPHY"
            title="BUILD. GROW. SHOW."
            subtitle="The three pillars that guide every client project we craft at NAGORA."
          />

          <Grid container spacing={4}>
            {[
              {
                pillar: 'BUILD',
                title: 'Websites & Apps',
                description: 'We code fast, high-conversion web applications, custom e-commerce stores, and native mobile apps optimized for flawless performance across all screen sizes.',
                color: '#7C3AED',
              },
              {
                pillar: 'GROW',
                title: 'SEO & Search Reach',
                description: 'We optimize technical SEO architecture, execute strategic keyword research, and elevate your business ranking to where your high-intent customers are active.',
                color: '#D4AF37',
              },
              {
                pillar: 'SHOW',
                title: 'Photo, Video & Branding',
                description: 'We shoot commercial product photography, film 4K brand documentaries, edit viral social reels, and build memorable brand identity systems that command respect.',
                color: '#7C3AED',
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.pillar}>
                <Card sx={{ height: '100%', p: 2, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                  <CardContent>
                    <Typography variant="h3" sx={{ color: item.color, fontWeight: 900, mb: 1 }}>
                      {item.pillar}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1128', mb: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Core Values */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="NAGORA Studio Collaboration"
                sx={{ width: '100%', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ color: '#0A1128', fontWeight: 800, mb: 3 }}>
                Why Companies Choose NAGORA
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, mb: 4 }}>
                We eliminate the pain of dealing with fragmented freelancers or rigid agencies. Our full-stack engineering and creative studio teams collaborate seamlessly to bring your digital vision to life on time and within budget.
              </Typography>

              <Grid container spacing={2}>
                {[
                  '100% Custom Code & Design',
                  'Zero Swallowed Exceptions or Clutter',
                  'Mobile & Speed First Focus',
                  'Transparent Weekly Progress Updates',
                  'Complete Post-Launch Support',
                  'Scalable Relational Backend Architecture',
                ].map((val, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircle size={18} color="#7C3AED" />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0A1128' }}>
                        {val}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── MEET THE TEAM ─────────────────────────────────────────────── */}
      <GlobalStyles styles={`
        @keyframes teamFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerBadge {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .team-card {
          animation: teamFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }
        .team-card:hover .team-photo-wrap img {
          transform: scale(1.07);
        }
        .team-card:hover .team-accent-bar {
          width: 100% !important;
        }
        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 60px -12px rgba(10,17,40,0.18) !important;
        }
        .team-photo-wrap img {
          transition: transform 0.55s cubic-bezier(0.25,1,0.5,1);
        }
        .team-accent-bar {
          transition: width 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .team-initials {
          background: linear-gradient(135deg, #7C3AED 0%, #A855F7 60%, #D4AF37 100%);
          background-size: 200% auto;
          animation: shimmerBadge 3s linear infinite;
        }
      `} />

      <Box sx={{ py: { xs: 10, md: 14 }, background: 'linear-gradient(180deg, #0A1128 0%, #0F1A3E 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: '-120px', left: '-120px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-100px', right: '-100px', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

          {/* Section heading */}
          <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 10 } }}>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                px: 2.5, py: 0.7,
                borderRadius: '50px',
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.30)',
                color: '#D4AF37',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                mb: 2.5,
              }}
            >
              The People Behind NAGORA
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Meet Our&nbsp;
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Dream Team
              </Box>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255,255,255,0.55)',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.65,
              }}
            >
              Passionate builders, designers, and strategists united by one mission — to create digital experiences that drive real growth.
            </Typography>
          </Box>

          {/* Team Grid */}
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {TEAM.map((member, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={member.name}>
                <Box
                  className="team-card"
                  sx={{
                    animationDelay: `${idx * 0.10}s`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(12px)',
                    transition: 'transform 0.40s cubic-bezier(0.22,1,0.36,1), box-shadow 0.40s ease',
                    cursor: 'default',
                    position: 'relative',
                  }}
                >
                  {/* Accent gradient bar (grows on hover) */}
                  <Box
                    className="team-accent-bar"
                    sx={{
                      position: 'absolute',
                      top: 0, left: 0,
                      height: '3px',
                      width: '40%',
                      background: member.accent,
                      zIndex: 10,
                    }}
                  />

                  {/* Photo area — face + shoulder crop */}
                  <Box
                    className="team-photo-wrap"
                    sx={{
                      width: '100%',
                      height: { xs: 260, sm: 280, md: 300 },
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'linear-gradient(145deg, #1A2456 0%, #0D1635 100%)',
                    }}
                  >
                    {member.photo ? (
                      <Box
                        component="img"
                        src={member.photo}
                        alt={member.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block',
                        }}
                      />
                    ) : (
                      /* Placeholder initials avatar */
                      <Box
                        className="team-initials"
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                          {member.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          Photo Coming Soon
                        </Typography>
                      </Box>
                    )}

                    {/* Gradient overlay at bottom of photo */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(10,17,40,0.85) 0%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Role badge floating on photo */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12, left: 14,
                        px: 1.5, py: 0.4,
                        borderRadius: '50px',
                        background: member.badgeBg,
                        border: `1px solid ${member.badgeColor}55`,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: member.badgeColor === '#B8860B' ? '#D4AF37' : member.badgeColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {member.badge}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Text content */}
                  <Box sx={{ px: 2.5, py: 2.5 }}>
                    <Typography
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '1rem',
                        lineHeight: 1.25,
                        mb: 0.6,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.50)',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {member.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>

      <PreFooterCTA />
    </Box>
  );
}
