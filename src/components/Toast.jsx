import { Check, AlertTriangle, Info } from 'lucide-react';

/**
 * Eu sou uma notificação toast — aquele feedback visual que aparece
 * no canto da tela por alguns segundos para informar o usuário sobre
 * ações como "Letra salva!" ou "Algo deu errado".
 *
 * Entro deslizando da direita e saio suavemente.
 * Meu visual muda conforme o tipo: sucesso (verde), erro (vermelho), info (azul).
 */
export default function Toast({ message, type = 'success' }) {
  const styles = {
    success: {
      bg: 'var(--accent-secondary)',
      icon: <Check size={16} />,
    },
    error: {
      bg: 'var(--color-danger-500)',
      icon: <AlertTriangle size={16} />,
    },
    info: {
      bg: 'var(--color-sky-400)',
      icon: <Info size={16} />,
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className="toast flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium"
      style={{ backgroundColor: style.bg, minWidth: '200px' }}
      role="alert"
    >
      {style.icon}
      <span>{message}</span>
    </div>
  );
}
