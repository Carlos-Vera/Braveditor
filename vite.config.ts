import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Content Security Policy - Protege contra XSS y ataques de inyección
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self';",
      // Previene ataques de MIME type confusion
      'X-Content-Type-Options': 'nosniff',
      // Previene clickjacking
      'X-Frame-Options': 'DENY',
      // Activa protección XSS del navegador
      'X-XSS-Protection': '1; mode=block',
      // Política de referrer para privacidad
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Previene que el navegador adivine el tipo MIME
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  },
  preview: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  }
})
