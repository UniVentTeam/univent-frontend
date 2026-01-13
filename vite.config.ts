import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), basicSsl()],
  server: {
    // 3. Foarte important pentru mobil:
    host: true, // Permite accesul din rețea (0.0.0.0)
    port: 5173, // Poți alege ce port vrei
  },
});
