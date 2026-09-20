import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { X, ExternalLink, ArrowRight, Play, Download, Maximize2, Globe, Lock, Sparkles } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import PortfolioCard from '../components/PortfolioCard';

// ── Microlink screenshot helper (waits for JS/CSS animations & DOM load) ─────
const thumb = (url) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;

export const initialPortfolioItems = [
  // ─── PHOTO EDITING ──────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'Guest Speaker Mr. Gopinath Event Launch Poster',
    category: 'Photo Editing',
    description: 'High-impact invitation poster featuring TV & Media Fame Mr. Gopinath ("எண்ணம் போல் வாழ்க்கை") for Crescent Institute.',
    image: '/portfolio/gopinath_event_poster.jpg',
    aspectRatio: 'poster',
    tags: ['Event Poster', 'Tamil Typography', 'Photo Retouching', 'Poster Design'],
    client: 'BSA Crescent Institute & KBA Mens Hostel',
    year: '2024',
    result: '1,500+ Auditorium Attendees & Viral Social Reach',
    fullDescription: 'Professional event invitation graphic poster engineered for BSA Crescent Institute of Science & Technology and KBA Mens Hostel featuring Guest Speaker Mr. Gopinath (Media Fame). Features custom Tamil typography ("எண்ணம் போல் வாழ்க்கை") and crisp portrait lighting retouching.',
  },
  {
    id: 2,
    title: '"Escape From Reality" Sci-Fi Concept Artwork',
    category: 'Photo Editing',
    description: 'Atmospheric post-apocalyptic photo composition featuring glowing green energy portal FX and cinematic lighting.',
    image: '/portfolio/escape_from_reality_poster.jpg',
    aspectRatio: 'poster',
    tags: ['Sci-Fi Composite', 'Photoshop Art', 'Neon FX', 'Color Grading'],
    client: 'Visual Concept Art (ITZ_ME_AFSS..)',
    year: '2025',
    result: 'Featured Digital Art Composition Showcase',
    fullDescription: 'Dark futuristic graphic manipulation combining urban ruin environments, glowing green dimensional portal effects, custom sci-fi typography layout, and dramatic atmospheric color grading.',
  },
  {
    id: 3,
    title: 'Emirates Boeing 777-300ER Commercial Poster',
    category: 'Photo Editing',
    description: 'Multi-layered commercial aviation poster with bold typography and detailed aircraft specifications.',
    image: '/portfolio/emirates_boeing_777_poster.jpg',
    aspectRatio: 'poster',
    tags: ['Aviation Poster', 'Brand Composite', 'Multi-Layer Cutout', 'Graphic Design'],
    client: 'Aviation Series (AFSS / Emirates Showcase)',
    year: '2025',
    result: 'High-Resolution Print & Commercial Digital Showcase',
    fullDescription: 'Multi-layered commercial aviation graphic poster incorporating the Emirates Boeing 777-300ER across dynamic flight and taxi angles, bold brand typography, and precise aircraft technical specification callouts.',
  },
  {
    id: 4,
    title: '"ARMADHAM 2K24" Crescent Cultural Key Visual',
    category: 'Photo Editing',
    description: 'Vibrant cultural festival poster with custom 3D texturing, tropical elements, and festive boat artwork.',
    image: '/portfolio/armadham_2k24_poster.jpg',
    aspectRatio: 'poster',
    tags: ['Festival Poster', '3D Typography', 'Festive Vector Art', 'Key Visual'],
    client: 'Crescent Institute of Science & Technology',
    year: '2024',
    result: 'Official Event Key Visual & Campus Promotion',
    fullDescription: 'Vibrant, high-energy festival key visual poster created for ARMADHAM 2K24. Blends custom 3D texturing, tropical palm elements, detailed vector boat artwork, and festive golden sparkle effects.',
  },
  {
    id: 5,
    title: 'Bell 206A Jetranger Vintage Aviation Graphic Design',
    category: 'Photo Editing',
    description: 'Retro aviation graphic poster design featuring duo-tone lighting, halftone textures, and aircraft history.',
    image: '/portfolio/bell_helicopter_poster.jpg',
    aspectRatio: 'poster',
    tags: ['Retro Design', 'Halftone FX', 'Vintage Aviation', 'Graphic Editing'],
    client: 'Vintage Aircraft Series (AFSS)',
    year: '2025',
    result: 'Featured Retro Graphic Poster Retouch',
    fullDescription: 'Retro-inspired aviation poster design featuring the Bell 206A Jetranger helicopter. Utilizes classic halftone textures, high-contrast blue dynamic lighting, and historic aircraft timeline metadata.',
  },

  // ─── VIDEO EDITING ──────────────────────────────────────────────────────────
  {
    id: 6,
    title: 'Creative Reel — Video Editing Showcase',
    category: 'Video Editing',
    isVideo: true,
    videoUrl: '/portfolio/project 1.mp4',
    description: 'High-energy promotional reel with fast cuts, colour grading, and dynamic motion graphics.',
    tags: ['Video Editing', 'Motion Graphics', 'Colour Grading', 'Reels'],
    client: 'NAGORA Digital Agency',
    year: '2025',
    result: 'Viral Reel Showcase',
    fullDescription: 'Fast-paced creative reel produced and edited by NAGORA — showcasing cinematic transitions, colour grading, and kinetic motion design. Click play to watch.',
  },
  {
    id: 9,
    title: 'Creative Reel 2 — Video Editing Showcase',
    category: 'Video Editing',
    isVideo: true,
    videoUrl: '/portfolio/project 2.mp4',
    description: 'High-energy promotional reel with fast cuts, colour grading, and dynamic motion graphics.',
    tags: ['Video Editing', 'Motion Graphics', 'Colour Grading', 'Reels'],
    client: 'NAGORA Digital Agency',
    year: '2025',
    result: 'Viral Reel Showcase',
    fullDescription: 'Fast-paced creative reel produced and edited by NAGORA — showcasing cinematic transitions, colour grading, and kinetic motion design. Click play to watch.',
  },
  {
    id: 10,
    title: 'Creative Reel 3 — Video Editing Showcase',
    category: 'Video Editing',
    isVideo: true,
    videoUrl: '/portfolio/project 3.mp4',
    description: 'High-energy promotional reel with fast cuts, colour grading, and dynamic motion graphics.',
    tags: ['Video Editing', 'Motion Graphics', 'Colour Grading', 'Reels'],
    client: 'NAGORA Digital Agency',
    year: '2025',
    result: 'Viral Reel Showcase',
    fullDescription: 'Fast-paced creative reel produced and edited by NAGORA — showcasing cinematic transitions, colour grading, and kinetic motion design. Click play to watch.',
  },
  {
    id: 11,
    title: 'Creative Reel 4 — Video Editing Showcase',
    category: 'Video Editing',
    isVideo: true,
    videoUrl: '/portfolio/project 4.mp4',
    description: 'High-energy promotional reel with fast cuts, colour grading, and dynamic motion graphics.',
    tags: ['Video Editing', 'Motion Graphics', 'Colour Grading', 'Reels'],
    client: 'NAGORA Digital Agency',
    year: '2025',
    result: 'Viral Reel Showcase',
    fullDescription: 'Fast-paced creative reel produced and edited by NAGORA — showcasing cinematic transitions, colour grading, and kinetic motion design. Click play to watch.',
  },

  // ─── PHOTOGRAPHY ────────────────────────────────────────────────────────────
  { id: 20, category: 'Photography', image: '/portfolio/photography_1.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 21, category: 'Photography', image: '/portfolio/photography_2.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 22, category: 'Photography', image: '/portfolio/photography_3.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 23, category: 'Photography', image: '/portfolio/photography_4.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 24, category: 'Photography', image: '/portfolio/photography_5.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 25, category: 'Photography', image: '/portfolio/photography_6.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 26, category: 'Photography', image: '/portfolio/photography_7.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 27, category: 'Photography', image: '/portfolio/photography_8.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 28, category: 'Photography', image: '/portfolio/photography_9.jpg',  aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 29, category: 'Photography', image: '/portfolio/photography_10.jpg', aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 40, category: 'Photography', image: '/portfolio/photography_11.jpg', aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 41, category: 'Photography', image: '/portfolio/photography_12.jpg', aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 42, category: 'Photography', image: '/portfolio/photography_13.jpg', aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 43, category: 'Photography', image: '/portfolio/photography_14.jpg', aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 44, category: 'Photography', image: '/portfolio/photography_15.jpg', aspectRatio: 'landscape', tags: ['Photography'] },
  { id: 45, category: 'Photography', image: '/portfolio/photography_16.jpg', aspectRatio: 'landscape', tags: ['Photography'] },

  // ─── VIDEOGRAPHY ────────────────────────────────────────────────────────────
  { id: 30, category: 'Videography', isVideo: true, videoUrl: '/portfolio/videography_1.mp4', tags: ['Videography'] },
  { id: 31, category: 'Videography', isVideo: true, videoUrl: '/portfolio/videography_2.mp4', tags: ['Videography'] },
  { id: 32, category: 'Videography', isVideo: true, videoUrl: '/portfolio/videography_3.mp4', tags: ['Videography'] },

  // ─── WEBSITES ───────────────────────────────────────────────────────────────
  {
    id: 101,
    title: 'Sri Decoration — Event Decor Booking Platform',
    category: 'Websites',
    description: 'Elegant booking website for a premium event decoration business with service galleries and enquiry flows.',
    image: '/portfolio/websites/sridecoration.jpg',
    liveUrl: 'https://sridecoration.netlify.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Netlify', 'Event Booking', 'UI/UX', 'Responsive'],
    client: 'Sri Decoration',
    year: '2025',
    result: 'Streamlined enquiries & 3× more bookings online',
    fullDescription: 'A professionally designed event decoration showcase site built to convert visitors into clients. Features a stunning service gallery, package details, and a smooth contact/booking flow — hosted on Netlify with fast global delivery.',
  },
  {
    id: 102,
    title: 'AquaCraft — E-Commerce Store',
    category: 'Websites',
    description: 'Full-featured online store for aquarium products with product listings, cart, and checkout.',
    image: '/portfolio/websites/aquacraft.jpg',
    liveUrl: 'https://ecommerce-aquacraft.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'E-Commerce', 'Vercel', 'Shopping Cart', 'Product Listings'],
    client: 'AquaCraft',
    year: '2025',
    result: 'Complete e-commerce experience from browse to checkout',
    fullDescription: 'A modern e-commerce platform for aquarium hobbyists — featuring categorised product listings, cart management, order flow, and a clean mobile-first UI. Built on React and deployed on Vercel for zero-downtime performance.',
  },
  {
    id: 103,
    title: 'Unique Creative Portfolio',
    category: 'Websites',
    description: 'A bold, interactive personal portfolio site designed to stand out and attract creative clients.',
    image: '/portfolio/websites/uniqueportfolio.jpg',
    liveUrl: 'https://someuniqueportfolio.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['Portfolio', 'React', 'Animations', 'Vercel', 'Creative Design'],
    client: 'Independent Creative',
    year: '2025',
    result: 'Unique visual identity that drives inbound project leads',
    fullDescription: 'A visually distinctive personal portfolio with smooth scroll animations, custom typography, and a dark aesthetic. Purpose-built to make a lasting impression on recruiters and potential clients.',
  },
  {
    id: 104,
    title: 'Crescent Techno Club — Student Tech Hub',
    category: 'Websites',
    description: 'Official website for the Crescent Institute technology club showcasing events, team, and initiatives.',
    image: '/portfolio/websites/crestechnoclub.jpg',
    liveUrl: 'https://cres-techno-club.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Club Website', 'Events', 'Vercel', 'Student Community'],
    client: 'Crescent Techno Club',
    year: '2024',
    result: 'Central hub for 500+ student tech community members',
    fullDescription: 'Designed and built the official web presence for Crescent Institute\'s Technology Club. Features event listings, team profiles, achievement highlights, and a responsive design that works seamlessly for students on any device.',
  },
  {
    id: 105,
    title: 'F1 Interactive Fan Experience',
    category: 'Websites',
    description: 'High-octane Formula 1 themed interactive web experience with race data, driver stats, and dynamic visuals.',
    image: '/portfolio/websites/f1demo.jpg',
    liveUrl: 'https://f1-demo-jet.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'F1 Data', 'Interactive', 'Animations', 'Vercel'],
    client: 'F1 Fan Project',
    year: '2025',
    result: 'Immersive data-driven experience for motorsport fans',
    fullDescription: 'An adrenaline-fuelled F1 fan experience web app featuring driver statistics, race calendar visualisation, and cinematic transition animations. Built to demonstrate advanced React data rendering and motion design capabilities.',
  },
  {
    id: 106,
    title: 'DefinitelySafe TM — Trust & Security Platform',
    category: 'Websites',
    description: 'Clean, professional trust-signal website for a digital security and compliance brand.',
    image: '/portfolio/websites/definitelysafe.jpg',
    liveUrl: 'https://definitely-safe-tm.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Security', 'Branding', 'Landing Page', 'Vercel'],
    client: 'DefinitelySafe TM',
    year: '2025',
    result: 'Professional brand presence that instils immediate trust',
    fullDescription: 'A polished brand landing page for a cybersecurity and digital trust company. Features clear service breakdowns, trust-indicator sections, and a conversion-focused layout designed to move leads from curiosity to contact.',
  },
  {
    id: 107,
    title: 'Crave — Food Delivery Landing Page',
    category: 'Websites',
    description: 'Mouth-watering food delivery landing page with appetising visuals, category browsing, and CTA flows.',
    image: '/portfolio/websites/cravefood.jpg',
    liveUrl: 'https://crave-snowy.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Food & Beverage', 'Landing Page', 'Vercel', 'UI/UX'],
    client: 'Crave Food',
    year: '2025',
    result: 'Appetite-driven design that maximises app download CTR',
    fullDescription: 'A vibrant, visually rich food delivery landing page crafted to stimulate appetite and drive conversions. High-quality food imagery, smooth scroll sections, and compelling CTAs guide users toward ordering. Optimised for mobile-first delivery app promotion.',
  },
  {
    id: 108,
    title: 'Miaksa — Fashion & Lifestyle Brand',
    category: 'Websites',
    description: 'Sleek fashion brand website with editorial lookbooks, product showcases, and minimalist aesthetics.',
    image: '/portfolio/websites/miaksafashion.jpg',
    liveUrl: 'https://miaksaaa.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Fashion', 'E-Commerce', 'Editorial Design', 'Vercel'],
    client: 'Miaksa Brand',
    year: '2025',
    result: 'Premium editorial feel that elevates brand perception',
    fullDescription: 'An editorial-grade fashion brand website featuring curated lookbook sections, product spotlights, and a minimalist high-fashion aesthetic. Designed to position the brand as a premium lifestyle label with sophisticated visual storytelling.',
  },
  {
    id: 109,
    title: 'AFS GPT — Custom AI Chat Interface',
    category: 'Websites',
    description: 'Custom-built AI chat interface with a modern UI, streaming responses, and personalised branding.',
    image: '/portfolio/websites/afsgpt.jpg',
    liveUrl: 'https://afs-gpt.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'AI / GPT', 'Chat UI', 'Vercel', 'API Integration'],
    client: 'AFS GPT Project',
    year: '2025',
    result: 'Fully functional custom GPT interface with branded UX',
    fullDescription: 'A branded AI assistant interface built on top of GPT APIs, featuring a sleek dark-mode chat UI, streaming response rendering, conversation history, and a custom persona. Demonstrates full-stack AI product design and integration capabilities.',
  },
  {
    id: 110,
    title: 'DeadlineOS — Productivity Task Manager',
    category: 'Websites',
    description: 'OS-inspired productivity app with task boards, deadline tracking, and a slick dark UI.',
    image: '/portfolio/websites/deadlineos.jpg',
    liveUrl: 'https://deadline-os.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Productivity App', 'Dark UI', 'Task Management', 'Vercel'],
    client: 'DeadlineOS Project',
    year: '2025',
    result: 'Intuitive task management experience with OS-inspired UX',
    fullDescription: 'A feature-rich productivity web application with an operating-system-inspired interface. Includes task creation, deadline counters, priority colour-coding, and a dark-mode design that makes staying organised feel premium and efficient.',
  },
  {
    id: 111,
    title: 'HackP — UI/UX Hackathon Platform',
    category: 'Websites',
    description: 'Dynamic hackathon event website with registration, schedule, and team-showcase features.',
    image: '/portfolio/websites/hackp.jpg',
    liveUrl: 'https://hackp-uiux.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'Hackathon', 'Event Platform', 'UI/UX', 'Vercel'],
    client: 'HackP Event',
    year: '2025',
    result: 'Drove 200+ hackathon registrations via engaging design',
    fullDescription: 'A purpose-built hackathon event platform featuring a high-energy landing page, real-time schedule display, team registration flows, and sponsor showcase sections. Designed to generate excitement and maximise participant sign-ups.',
  },
  {
    id: 112,
    title: 'NanoIT Technology — IT Services Company',
    category: 'Websites',
    description: 'Corporate IT services website with service pages, client portfolio, and professional brand identity.',
    image: '/portfolio/websites/nanoit.jpg',
    liveUrl: 'https://www.nanoitechnology.com/',
    aspectRatio: 'landscape',
    tags: ['Corporate', 'IT Services', 'SEO', 'Custom Domain', 'Business Website'],
    client: 'NanoIT Technology',
    year: '2024',
    result: 'Established credible online presence for IT consulting firm',
    fullDescription: 'A full corporate website for an IT services and consulting company. Includes detailed service breakdowns, case study previews, a team page, and a contact/enquiry system — all optimised for SEO and hosted on a custom domain.',
  },
  {
    id: 113,
    title: 'GitSubway — Git Visual Learning Tool',
    category: 'Websites',
    description: 'Interactive Git learning platform with visual branch maps and beginner-friendly command explanations.',
    image: '/portfolio/websites/gitsubway.jpg',
    liveUrl: 'https://git-subway.vercel.app/',
    aspectRatio: 'landscape',
    tags: ['React', 'EdTech', 'Git Visualiser', 'Interactive', 'Vercel'],
    client: 'GitSubway Project',
    year: '2025',
    result: 'Makes Git intuitive for thousands of new developers',
    fullDescription: 'An educational web tool that visualises Git concepts using a subway-map metaphor. Beginners can explore branches, merges, and commits interactively — turning one of programming\'s most feared tools into a visual, approachable experience.',
  },
];


const categories = ['All', 'Websites', 'Apps', 'Photo Editing', 'Video Editing', 'Photography', 'Videography', 'Branding'];

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts = { All: initialPortfolioItems.length };
    initialPortfolioItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(
    () =>
      selectedCategory === 'All'
        ? initialPortfolioItems
        : initialPortfolioItems.filter(
            (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
          ),
    [selectedCategory]
  );

  return (
    <Box id="portfolio" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <SectionHeading
          pill="🌐 PRODUCTION WEBSITES & DIGITAL SHOWCASE"
          title={"See Our Live Website Projects &\nHigh-Impact Creative Work"}
          subtitle="Explore 13+ live client websites, custom AI chat interfaces, video editing reels, and original brand graphic poster designs."
        />

        {/* Category Tabs Filter with Badges */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
          <Tabs
            value={selectedCategory}
            onChange={(e, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              maxWidth: '100%',
              '& .MuiTabs-indicator': {
                backgroundColor: '#7C3AED',
                height: 3,
                borderRadius: 2,
              },
              '& .MuiTabs-scrollButtons': {
                color: '#7C3AED',
              },
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Tab
                  key={cat}
                  label={cat}
                  value={cat}
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.82rem', md: '0.92rem' },
                    color: isSelected ? '#7C3AED' : '#475569',
                    px: { xs: 1.5, md: 2.5 },
                    py: 1.2,
                    textTransform: 'none',
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Featured Live Websites Callout Banner (only when Websites tab is selected) */}
        {selectedCategory === 'Websites' && (
          <Box
            sx={{
              borderRadius: '16px',
              p: { xs: 2.5, md: 3 },
              mb: 5,
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              boxShadow: '0 12px 35px -8px rgba(124, 58, 237, 0.25)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(124,58,237,0.5)',
                  flexShrink: 0,
                }}
              >
                <Globe size={24} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.25 }}>
                  See All Live Production Website Projects Below
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.86rem', mt: 0.4 }}>
                  Every project card features full live URLs, mobile-responsive layouts, and interactive case study modals.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', flexShrink: 0 }}>
              <Chip
                icon={<Lock size={12} color="#10B981" />}
                label="13 Live Production Sites"
                sx={{
                  backgroundColor: 'rgba(16,185,129,0.12)',
                  color: '#10B981',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(16,185,129,0.3)',
                }}
              />
              <Chip
                icon={<Sparkles size={12} color="#A78BFA" />}
                label="100% Responsive Fit"
                sx={{
                  backgroundColor: 'rgba(124,58,237,0.18)',
                  color: '#A78BFA',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(124,58,237,0.35)',
                }}
              />
            </Box>
          </Box>
        )}

        {/* Portfolio Grid — responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
        <Grid container spacing={{ xs: 2.5, sm: 3 }}>
          {filteredItems.map((project, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={project.id}
              sx={{ display: 'flex' }}
            >
              <PortfolioCard project={project} onSelect={setSelectedProject} index={idx} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Project Lightbox / Video Modal ── */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            overflow: 'hidden',
            backgroundColor: '#0A1128',
            m: isMobile ? 0 : 2,
            // ── Allow the whole modal to scroll if content exceeds viewport ──
            maxHeight: isMobile ? '100vh' : '90vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {selectedProject && (() => {
          const isWebsite = selectedProject.category === 'Websites' || selectedProject.category === 'Apps';
          const isMediaOnly = ['Photo Editing', 'Video Editing', 'Photography', 'Videography'].includes(selectedProject.category);
          const isVideo = selectedProject.isVideo || Boolean(selectedProject.videoUrl);

          return (
            // ── Scrollable wrapper so bottom content is never hidden ──
            <Box sx={{ position: 'relative', overflowY: 'auto', flexGrow: 1,
              // Smooth scrollbar styling
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(124,58,237,0.45)', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb:hover': { background: '#7C3AED' },
            }}>
              {/* Close Button */}
              <IconButton
                onClick={() => setSelectedProject(null)}
                sx={{
                  position: 'absolute', top: 12, right: 12, zIndex: 10,
                  backgroundColor: 'rgba(10,17,40,0.75)', color: '#fff',
                  '&:hover': { backgroundColor: '#7C3AED' },
                }}
              >
                <X size={20} />
              </IconButton>

              {/* ── WEBSITE / APP: Browser-chrome screenshot + detail panel ── */}
              {isWebsite && (
                <>
                  {/* Browser Chrome Mock */}
                  <Box
                    sx={{
                      backgroundColor: '#1E293B',
                      px: 2,
                      pt: 1.5,
                      pb: 0,
                    }}
                  >
                    {/* Browser top bar */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {/* Traffic lights */}
                      {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => (
                        <Box
                          key={i}
                          sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c, flexShrink: 0 }}
                        />
                      ))}
                      {/* URL bar */}
                      <Box
                        sx={{
                          flex: 1,
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          ml: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Globe size={11} color="#64748B" />
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: '0.7rem',
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {selectedProject.liveUrl}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Screenshot Container with Centered Hover Button Overlay */}
                    <Box
                      sx={{
                        position: 'relative',
                        height: { xs: 200, sm: 280, md: 340 },
                        overflow: 'hidden',
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: '#0F172A',
                        cursor: selectedProject.liveUrl ? 'pointer' : 'default',
                        '&:hover .modal-hover-overlay': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top',
                          display: 'block',
                        }}
                      />

                      {/* Centered Hover Overlay with "View Live Site" & "Build Similar" Buttons Side-by-Side */}
                      <Box
                        className="modal-hover-overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(15, 23, 42, 0.7)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1.5,
                          flexWrap: 'wrap',
                          px: 2,
                          opacity: 0,
                          transition: 'opacity 0.25s ease',
                        }}
                      >
                        {selectedProject.liveUrl && (
                          <Button
                            component="a"
                            href={selectedProject.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            startIcon={<Globe size={16} />}
                            endIcon={<ExternalLink size={15} />}
                            sx={{
                              backgroundColor: '#7C3AED',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: { xs: '0.82rem', md: '0.9rem' },
                              px: { xs: 2.5, md: 3 },
                              py: 1.1,
                              borderRadius: '30px',
                              textTransform: 'none',
                              boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
                              '&:hover': {
                                backgroundColor: '#6D28D9',
                                transform: 'scale(1.04)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            View Live Site
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          onClick={() => { setSelectedProject(null); window.location.href = '/contact'; }}
                          endIcon={<ArrowRight size={16} />}
                          sx={{
                            borderColor: 'rgba(255, 255, 255, 0.7)',
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            backdropFilter: 'blur(6px)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: { xs: '0.82rem', md: '0.9rem' },
                            px: { xs: 2.5, md: 3 },
                            py: 1.1,
                            borderRadius: '30px',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#FFFFFF',
                              color: '#0A1128',
                              borderColor: '#FFFFFF',
                              transform: 'scale(1.04)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Build Similar
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Detail Panel — no bottom buttons */}
                  <DialogContent sx={{ p: { xs: 2.5, md: 3.5 }, backgroundColor: '#fff', overflow: 'visible' }}>
                    {/* Chips row */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip label={selectedProject.category} color="secondary" size="small" sx={{ fontWeight: 800 }} />
                      {selectedProject.client && (
                        <Chip label={`Client: ${selectedProject.client}`} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                      )}
                      {selectedProject.year && (
                        <Chip label={selectedProject.year} variant="outlined" size="small" />
                      )}
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#0A1128', mb: 1.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                      {selectedProject.title}
                    </Typography>

                    {selectedProject.result && (
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: 'rgba(124,58,237,0.07)',
                          borderRadius: 3,
                          border: '1px solid rgba(124,58,237,0.2)',
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ color: '#7C3AED', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                          OUTCOME
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0A1128', fontWeight: 700, mt: 0.4 }}>
                          {selectedProject.result}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.75, mb: 2.5 }}>
                      {selectedProject.fullDescription || selectedProject.description}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(selectedProject.tags || []).map((t, i) => (
                        <Chip key={i} label={t} sx={{ backgroundColor: '#F1F5F9', color: '#334155', fontWeight: 600 }} />
                      ))}
                    </Box>
                  </DialogContent>
                </>
              )}

              {/* ── VIDEO Media ── */}
              {!isWebsite && isVideo && (
                <>
                  <Box sx={{ backgroundColor: '#000', textAlign: 'center' }}>
                    <video
                      controls
                      autoPlay
                      src={selectedProject.videoUrl}
                      style={{ width: '100%', maxHeight: '520px', objectFit: 'contain', display: 'block' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                  {/* Minimal footer strip */}
                  <Box
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                      gap: 1.5, px: 2.5, py: 1.5,
                      backgroundColor: '#0A1128',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => { setSelectedProject(null); window.location.href = '/contact'; }}
                      endIcon={<ArrowRight size={16} />}
                      size="small"
                      sx={{
                        backgroundColor: '#7C3AED', color: '#fff', fontWeight: 700,
                        px: 2.5, borderRadius: '10px', textTransform: 'none',
                        '&:hover': { backgroundColor: '#6D28D9' }
                      }}
                    >
                      Work With Us
                    </Button>
                  </Box>
                </>
              )}

              {/* ── IMAGE Media (Photo Editing / Photography) ── */}
              {!isWebsite && !isVideo && selectedProject.image && (
                <>
                  <Box
                    sx={{
                      backgroundColor: '#0F172A',
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      maxHeight: '560px', overflow: 'hidden',
                      p: selectedProject.aspectRatio === 'poster' ? 2 : 0,
                      position: 'relative',
                    }}
                  >
                    {/* Blurred ambient bg */}
                    <Box
                      sx={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${selectedProject.image})`,
                        backgroundSize: 'cover',
                        filter: 'blur(22px) brightness(0.35)',
                      }}
                    />
                    <Box
                      component="img"
                      src={selectedProject.image}
                      alt={selectedProject.title || 'Portfolio Image'}
                      sx={{
                        maxWidth: '100%', maxHeight: '520px',
                        objectFit: 'contain', zIndex: 2,
                        borderRadius: selectedProject.aspectRatio === 'poster' ? 2 : 0,
                        boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
                      }}
                    />
                    {/* Full-size link */}
                    <Button
                      component="a"
                      href={selectedProject.image}
                      target="_blank"
                      rel="noreferrer"
                      size="small"
                      startIcon={<Maximize2 size={13} />}
                      sx={{
                        position: 'absolute', bottom: 12, right: 12, zIndex: 5,
                        backgroundColor: 'rgba(10,17,40,0.75)', backdropFilter: 'blur(6px)',
                        color: '#fff', fontSize: '0.74rem', fontWeight: 700,
                        textTransform: 'none', borderRadius: '8px', px: 1.5, py: 0.5,
                        border: '1px solid rgba(255,255,255,0.15)',
                        '&:hover': { backgroundColor: '#7C3AED' },
                      }}
                    >
                      Full Size
                    </Button>
                  </Box>
                  {/* Media-only footer strip */}
                  {isMediaOnly && (
                    <Box
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                        gap: 1.5, px: 2.5, py: 1.5,
                        backgroundColor: '#0A1128',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => { setSelectedProject(null); window.location.href = '/contact'; }}
                        endIcon={<ArrowRight size={16} />}
                        size="small"
                        sx={{
                          backgroundColor: '#7C3AED', color: '#fff', fontWeight: 700,
                          px: 2.5, borderRadius: '10px', textTransform: 'none',
                          '&:hover': { backgroundColor: '#6D28D9' }
                        }}
                      >
                        Work With Us
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          );
        })()}
      </Dialog>
    </Box>
  );
}
