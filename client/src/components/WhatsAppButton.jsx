import React from 'react';
import { Box, Tooltip, Zoom } from '@mui/material';
import { motion } from 'framer-motion';

export default function WhatsAppButton({ phoneNumber = '918072443590', message = 'Hi NAGORA, I would like to enquire about your website & digital agency services!' }) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Tooltip title="Quick Chat on WhatsApp" placement="right" TransitionComponent={Zoom} arrow>
      <Box
        component={motion.a}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 28 },
          left: { xs: 20, md: 28 },
          zIndex: 1200,
          width: { xs: 44, md: 48 },
          height: { xs: 44, md: 48 },
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'box-shadow 0.25s ease',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(37, 211, 102, 0.65)',
            backgroundColor: '#20BA5A',
          },
        }}
      >
        {/* WhatsApp SVG Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '60%', height: '60%' }}
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 2.15.678 4.14 1.836 5.772L2.5 21.5l3.856-1.306A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-8 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8a7.95 7.95 0 01-4.298-1.246l-.308-.184-2.286.775.786-2.21-.202-.321A7.953 7.953 0 014 12z"
            fill="currentColor"
          />
        </svg>

        {/* Small notification dot */}
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#FF3B30',
            border: '2px solid #FFFFFF',
          }}
        />
      </Box>
    </Tooltip>
  );
}
