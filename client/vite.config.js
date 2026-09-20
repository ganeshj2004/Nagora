import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Target modern browsers — smaller, faster bundles
    target: 'esnext',

    // Raise chunk warning threshold slightly (MUI is large)
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Split vendor libs into separate cached chunks
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui':      ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-motion':   ['framer-motion'],
          'vendor-icons':    ['lucide-react'],
        },
      },
    },

    // Enable CSS code splitting so each page only loads its own CSS
    cssCodeSplit: true,

    // Report which chunks are built
    reportCompressedSize: false,
  },

  // Pre-bundle large deps for faster cold dev-server start
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      'framer-motion',
      'lucide-react',
    ],
  },
});
