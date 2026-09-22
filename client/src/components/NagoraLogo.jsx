import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NagoraLogo({ height = 45, showTagline = false, lightMode = true, showText = true }) {
  const textColor = lightMode ? '#0F172A' : '#FFFFFF';
  const subtitleColor = lightMode ? '#7C3AED' : '#D4AF37';

  return (
    <Box 
      sx={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 1.5,
        cursor: 'pointer',
        userSelect: 'none' 
      }}
    >
      <img
        src="/logo.png"
        alt="NAGORA Logo"
        style={{
          height: height,
          width: 'auto',
          maxHeight: height,
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />

      {(showText || showTagline) && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {showText && (
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Cinzel", "Plus Jakarta Sans", serif',
                fontWeight: 800,
                fontSize: `${height * 0.45}px`,
                letterSpacing: '0.08em',
                color: textColor,
                lineHeight: 1,
              }}
            >
              NAGORA
            </Typography>
          )}
          {showTagline && (
            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                fontSize: `${Math.max(9, height * 0.2)}px`,
                letterSpacing: '0.12em',
                color: subtitleColor,
                mt: 0.3,
              }}
            >
              GROWING YOUR PROFIT, TOGETHER
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
