import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This injects the environment variable from the build system (Docker) into the code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});