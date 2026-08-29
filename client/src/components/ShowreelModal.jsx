import React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import { X } from 'lucide-react';

export default function ShowreelModal({ open, onClose, videoUrl }) {
  const defaultVideo = ""; // Example video embed stream placeholder

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0A1128',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
          NAGORA Creative Showreel 2026
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#FFFFFF', '&:hover': { color: '#7C3AED' } }}>
          <X size={24} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, position: 'relative', pt: '56.25%', backgroundColor: '#000000' }}>
        {open && (
          <iframe
            src={videoUrl || defaultVideo}
            title="NAGORA Showreel"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
