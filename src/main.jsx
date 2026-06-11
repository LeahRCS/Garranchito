import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/**
 * Eu sou o ponto de entrada da aplicação Garranchito.
 * Monto o componente raiz com StrictMode para capturar
 * potenciais problemas durante o desenvolvimento.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
