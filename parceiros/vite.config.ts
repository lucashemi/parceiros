import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Direção - Parceiros",
        short_name: "Parceiros",
        description: "Sistema de Parceiros da Direção Marcas e Patentes",
        theme_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
            {
                src: "/images/favicon.png",
                sizes: "64x64 32x32 24x24 16x16",
                type: "image/png"
            },
            {
                src: "/images/icon-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/images/icon-512x512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
      }
    }),
    basicSsl()
  ],
  server: {
    https: true,
    host: true,
    port: 3002,
     watch: {
       usePolling: true
     }
  }
})
