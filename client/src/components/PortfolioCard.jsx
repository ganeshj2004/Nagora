import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import { Card, CardMedia, Box, Typography, Chip } from '@mui/material';
import { ExternalLink, Play, Clapperboard, Image, Globe, Smartphone, Palette, Camera, Video, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_META = {
  'Video Editing': { label: 'Video Editing', Icon: Clapperboard, color: '#EF4444' },
  'Photo Editing': { label: 'Photo Editing', Icon: Image,       color: '#3B82F6' },
  'Photography':   { label: 'Photography',   Icon: Camera,      color: '#10B981' },
  'Videography':   { label: 'Videography',   Icon: Video,       color: '#F59E0B' },
  'Websites':      { label: 'Web Development', Icon: Globe,    color: '#8B5CF6' },
  'Apps':          { label: 'App Design',    Icon: Smartphone, color: '#EC4899' },
  'Branding':      { label: 'Branding',      Icon: Palette,    color: '#6366F1' },
};

function PortfolioCard({ project, onSelect, index = 0 }) {
  const isVideo   = project.isVideo || Boolean(project.videoUrl);
  const isWebsite = project.category === 'Websites' || project.category === 'Apps';
  const videoRef  = useRef(null);
  const cardRef   = useRef(null);
  const [inView, setInView]         = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const meta = CATEGORY_META[project.category] || { label: project.category || 'Design', Icon: Image, color: '#8B5CF6' };
  const { label, Icon, color } = meta;

  // Extract clean domain for browser header bar
  const domainName = React.useMemo(() => {
    if (!project.liveUrl) return 'nagora.digital';
    try {
      return new URL(project.liveUrl).hostname.replace(/^www\./, '');
    } catch (e) {
      return project.liveUrl.replace(/^https?:\/\//, '').split('/')[0];
    }
  }, [project.liveUrl]);

  // ── Intersection Observer: lazy-load video ──────────────────────────────────
  useEffect(() => {
    if (!isVideo) return;
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [isVideo]);

  // ── Seek first frame once metadata loaded ───────────────────────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !inView) return;
    const handleMeta = () => { vid.currentTime = 0.5; setVideoReady(true); };
    vid.addEventListener('loadedmetadata', handleMeta);
    if (vid.readyState >= 1) handleMeta();
    return () => vid.removeEventListener('loadedmetadata', handleMeta);
  }, [inView]);

  // ── Hover play/pause (video cards only) ────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!videoReady) { vid.currentTime = 0.5; }
    vid.play().catch(() => {});
  }, [videoReady]);

  const handleMouseLeave = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    vid.currentTime = 0.5;
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. WEBSITE CARDS: Browser frame + Preview + Title/Description/Tags + "See Website →"
  // ─────────────────────────────────────────────────────────────────────────────
  if (isWebsite) {
    return (
      <Card
        ref={cardRef}
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
        sx={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0B0F19',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          willChange: 'transform, box-shadow, border-color',
          transition: 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.28s ease, border-color 0.25s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 40px -10px rgba(124, 58, 237, 0.35)',
            borderColor: 'rgba(124, 58, 237, 0.6)',
            '& .pf-thumb-img': { transform: 'scale(1.04)' },
            '& .pf-cta-btn': { backgroundColor: '#7C3AED', color: '#FFFFFF' },
            '& .pf-cta-arrow': { transform: 'translateX(4px)' },
            '& .pf-overlay': { opacity: 1 },
          },
        }}
        onClick={() => onSelect && onSelect(project)}
      >
        {/* Top Browser Bar */}
        <Box
          sx={{
            height: '34px',
            backgroundColor: '#1E293B',
            px: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            zIndex: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#27C93F' }} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              px: 1.2,
              py: 0.3,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              maxWidth: '60%',
            }}
          >
            <Lock size={9} color="#10B981" />
            <Typography
              noWrap
              sx={{ color: '#94A3B8', fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 500 }}
            >
              https://{domainName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box
              sx={{
                width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            <Typography sx={{ color: '#10B981', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>
              LIVE
            </Typography>
          </Box>
        </Box>

        {/* Thumbnail Preview Area */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '210px',
            backgroundColor: '#070A12',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {project.image && (
            <CardMedia
              className="pf-thumb-img"
              component="img"
              image={project.image}
              alt={project.title || label}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (project.liveUrl && !e.target.dataset.fallback) {
                  e.target.dataset.fallback = 'true';
                  e.target.src = `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(project.liveUrl)}?w=1200&h=800`;
                }
              }}
              sx={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                zIndex: 1,
                transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          )}

          {/* Hover overlay */}
          <Box
            className="pf-overlay"
            sx={{
              position: 'absolute', inset: 0, zIndex: 3,
              background: 'linear-gradient(180deg, rgba(11,15,25,0.2) 0%, rgba(11,15,25,0.85) 100%)',
              opacity: 0,
              transition: 'opacity 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.8rem',
                px: 2.2,
                py: 0.8,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                boxShadow: '0 0 20px rgba(124,58,237,0.6)',
              }}
            >
              <Globe size={14} />
              View Live Site
              <ArrowRight size={14} />
            </Box>
          </Box>
        </Box>

        {/* Bottom Content Body Panel for Website */}
        <Box
          sx={{
            p: 2.2,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'space-between',
            gap: 1.2,
            backgroundColor: '#0B0F19',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.1,
                py: 0.3,
                borderRadius: '6px',
                backgroundColor: `${color}18`,
                border: `1px solid ${color}35`,
              }}
            >
              <Icon size={11} color={color} />
              <Typography
                sx={{
                  color: color,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </Typography>
            </Box>

            {project.year && (
              <Typography sx={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600 }}>
                {project.year}
              </Typography>
            )}
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: '#F8FAFC',
              fontWeight: 800,
              fontSize: '1rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#94A3B8',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.4em',
            }}
          >
            {project.description || project.result}
          </Typography>

          {project.tags && project.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 0.4 }}>
              {project.tags.slice(0, 3).map((tag, i) => (
                <Chip
                  key={i}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#CBD5E1',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    height: '22px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                />
              ))}
            </Box>
          )}

          <Box
            className="pf-cta-btn"
            sx={{
              mt: 0.8,
              py: 0.9,
              px: 1.8,
              borderRadius: '10px',
              backgroundColor: 'rgba(124, 58, 237, 0.10)',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              color: '#A78BFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.8,
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.02em',
              transition: 'all 0.22s ease',
            }}
          >
            <span>See Website</span>
            <ArrowRight
              className="pf-cta-arrow"
              size={14}
              style={{ transition: 'transform 0.22s ease' }}
            />
          </Box>
        </Box>
      </Card>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. NON-WEBSITE CARDS (Photo Editing, Video Editing, Photography, Videography, Branding):
  //    Clean, pure image/video showcase card. NO extra text panels or descriptions below.
  //    ONLY shows category name badge ("Video Editing", "Photo Editing", "Photography").
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Card
      ref={cardRef}
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      onMouseEnter={isVideo ? handleMouseEnter : undefined}
      onMouseLeave={isVideo ? handleMouseLeave : undefined}
      sx={{
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid transparent',
        backgroundColor: '#090D1F',
        cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(10,17,40,0.10)',
        willChange: 'transform, box-shadow',
        transition: 'transform 0.28s cubic-bezier(0.25,1,0.5,1), box-shadow 0.28s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 18px 40px -8px rgba(124,58,237,0.28)',
          borderColor: '#7C3AED',
          '& .pf-overlay': { opacity: 1 },
          '& .pf-label': { transform: 'translateY(0)', opacity: 1 },
          '& .pf-static-label': { opacity: 0 },
        },
      }}
      onClick={() => onSelect && onSelect(project)}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: project.aspectRatio === 'poster' ? '140%' : '125%',
          backgroundColor: '#090D1F',
        }}
      >
        {/* Blurred ambient background */}
        {project.image && (
          <Box
            sx={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${project.image})`,
              backgroundSize: 'cover', backgroundPosition: 'top center',
              filter: 'blur(20px) brightness(0.32)',
              transform: 'scale(1.18)',
            }}
          />
        )}

        {/* VIDEO — lazy-loaded */}
        {isVideo && (
          <Box
            ref={videoRef}
            component="video"
            src={inView ? project.videoUrl : undefined}
            preload={inView ? 'metadata' : 'none'}
            muted
            loop
            playsInline
            sx={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              zIndex: 1,
            }}
          />
        )}

        {/* STATIC IMAGE */}
        {!isVideo && project.image && (
          <CardMedia
            component="img"
            image={project.image}
            alt={label}
            loading="lazy"
            decoding="async"
            sx={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: project.aspectRatio === 'poster' ? 'contain' : 'cover',
              objectPosition: 'center',
              zIndex: 1,
              transition: 'transform 0.45s cubic-bezier(0.25,1,0.5,1)',
            }}
          />
        )}

        {/* Hover overlay — ONLY category label + icon (Video Editing, Photo Editing, Photography, etc.) */}
        <Box
          className="pf-overlay"
          sx={{
            position: 'absolute', inset: 0, zIndex: 4,
            background: 'linear-gradient(180deg, rgba(10,17,40,0.1) 0%, rgba(10,17,40,0.85) 100%)',
            opacity: 0,
            transition: 'opacity 0.22s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 50, height: 50,
              borderRadius: '50%',
              backgroundColor: isVideo ? '#EF4444' : '#7C3AED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 8px rgba(124,58,237,0.2)',
            }}
          >
            {isVideo ? <Play size={20} fill="#fff" color="#fff" /> : <Icon size={20} color="#fff" />}
          </Box>

          <Box
            className="pf-label"
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.8,
              transform: 'translateY(10px)', opacity: 0,
              transition: 'transform 0.26s ease 0.04s, opacity 0.26s ease 0.04s',
            }}
          >
            <Typography
              sx={{
                color: '#fff', fontWeight: 800,
                fontSize: '0.85rem', letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>

        {/* Always-visible subtle static badge (Category name: Video Editing, Photo Editing, Photography, etc.) */}
        <Box
          className="pf-static-label"
          sx={{
            position: 'absolute', bottom: 12, left: 12, zIndex: 3,
            display: 'flex', alignItems: 'center', gap: 0.6,
            backgroundColor: 'rgba(10,17,40,0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            px: 1.4, py: 0.5,
            transition: 'opacity 0.2s ease',
          }}
        >
          {isVideo ? <Play size={10} fill="#EF4444" color="#EF4444" /> : <Icon size={10} color="rgba(255,255,255,0.85)" />}
          <Typography sx={{ color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default memo(PortfolioCard);
