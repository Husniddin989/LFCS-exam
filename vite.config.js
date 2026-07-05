import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /v86-cdn/* to copy.sh (BIOS + some assets) and /v86-img/* to
// i.copy.sh (large kernel images). i.copy.sh is a Bunny CDN with
// hotlink protection so we forge a copy.sh Referer.
const v86Proxy = {
  // LFCS lab backend (Docker sessions + terminal WS + verify)
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    ws: true,
  },
  '/v86-cdn': {
    target: 'https://copy.sh',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/v86-cdn/, '/v86'),
  },
  '/v86-img': {
    target: 'https://i.copy.sh',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/v86-img/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.setHeader('Referer', 'https://copy.sh/v86/');
        proxyReq.setHeader('Origin', 'https://copy.sh');
      });
    },
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: v86Proxy,
  },
  preview: {
    proxy: v86Proxy,
  },
  optimizeDeps: {
    exclude: ['v86'],
  },
})
