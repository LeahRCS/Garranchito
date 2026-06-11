import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Eu configuro o Vite para expor a aplicação na rede local automaticamente.
 * Isso permite que o usuário teste o app via smartphone pelo IP local,
 * essencial para testar a experiência de desenho com o dedo na tela.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
});
