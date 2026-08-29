import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NagoraLogo({ height = 45, showTagline = false, lightMode = true }) {
  const subtitleColor = lightMode ? '#581C87' : '#D4AF37';

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
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />

      {showTagline && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.5rem',
              letterSpacing: '0.12em',
              color: subtitleColor,
              mt: 0.2,
            }}
          >
            GROWING YOUR PROFIT, TOGETHER
          </Typography>
        </Box>
      )}
    </Box>
  );
}
