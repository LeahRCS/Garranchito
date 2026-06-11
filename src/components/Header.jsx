import { useState, useCallback, useRef } from 'react';
import { useGarranchito } from '../context/GarranchitoContext';
import { Sun, Moon } from 'lucide-react';
import { playQuack } from '../utils/quackSynth';

/**
 * Eu sou o cabeçalho do Garranchito — a primeira coisa que o usuário vê.
 * Exibo o nome da aplicação com aquela tipografia de "escrito à mão",
 * uma descrição curta e o botão para alternar entre tema claro e escuro.
 *
 * Minha vibe é "quem fez isso estava se divertindo" — o título tem um
 * leve angle/rotação que dá aquele ar descontraído e caótico-amigável.
 *
 * O patinho tem um segredo: se você clicar nele, TALVEZ ele faça "Quack!".
 * Mas não toda vez — ele é imprevisível. Às vezes é no primeiro clique,
 * às vezes só depois de 15 tentativas. Caótico-amigável, como tudo aqui. 🦆
 */

/**
 * Eu sou as possíveis reações do pato quando ele resolve falar.
 * Nem sempre ele diz "Quack!" — às vezes ele é mais criativo.
 */
const QUACK_MESSAGES = [
  'Quack!',
  'Quack!!',
  'QUAAACK!',
  'quack?',
  'Quack! 🦆',
  '...quack.',
  'QUACK QUACK!',
  'quaaack~',
  'Q u a c k !',
  '*quack*',
];

export default function Header() {
  const { theme, toggleTheme } = useGarranchito();
  const [quackMessage, setQuackMessage] = useState(null);
  const quackTimeoutRef = useRef(null);

  /**
   * Eu decido aleatoriamente se o pato vai fazer "Quack!" ou não.
   * A chance é de ~18% por clique, então estatisticamente leva
   * entre 1 e 10+ cliques — totalmente imprevisível e nunca repetitivo.
   */
  const handleDuckClick = useCallback(() => {
    const chance = Math.random();

    if (chance < 0.18) {
      // O pato decidiu falar!
      const msgIndex = Math.floor(Math.random() * QUACK_MESSAGES.length);
      const msg = QUACK_MESSAGES[msgIndex];
      setQuackMessage(msg);

      // Toco o som correspondente à mensagem escolhida 🔊
      playQuack(msgIndex);

      // Limpo qualquer timeout anterior para não sobrepor
      if (quackTimeoutRef.current) clearTimeout(quackTimeoutRef.current);

      // O balão some depois de 1.5s
      quackTimeoutRef.current = setTimeout(() => {
        setQuackMessage(null);
      }, 1500);
    }
  }, []);

  return (
    <header className="w-full py-5 px-4 flex items-center justify-between max-w-4xl mx-auto">
      {/* ─── Logo e Título ─── */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={handleDuckClick}
            className="text-3xl sm:text-4xl wiggle-hover select-none bg-transparent border-none cursor-pointer p-0 leading-none"
            style={{ transform: 'rotate(-3deg)' }}
            aria-label="Clique no pato — talvez ele faça Quack!"
            title="🦆?"
            id="duck-button"
          >
            🦆
          </button>

          {/* ─── Balão de fala do pato ─── */}
          {quackMessage && (
            <div
              key={quackMessage + Date.now()}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-xl text-sm font-bold pointer-events-none"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--accent-primary)',
                border: '2px solid var(--accent-primary)',
                fontFamily: 'var(--font-handwriting)',
                fontSize: '1rem',
                boxShadow: 'var(--shadow-md)',
                animation: 'quackBubble 1.5s ease-out forwards',
              }}
            >
              {quackMessage}
              {/* Setinha do balão */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRight: '2px solid var(--accent-primary)',
                  borderBottom: '2px solid var(--accent-primary)',
                }}
              />
            </div>
          )}
        </div>
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold leading-none"
            style={{
              fontFamily: 'var(--font-handwriting)',
              color: 'var(--text-primary)',
              transform: 'rotate(-1deg)',
            }}
          >
            Garranchito
          </h1>
          <p
            className="text-xs sm:text-sm mt-0.5"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            máquina de datilografia com problemas de caligrafia
          </p>
        </div>
      </div>

      {/* ─── Botão de Tema ─── */}
      <button
        onClick={toggleTheme}
        className="btn-icon wiggle-hover"
        aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
        title={`Modo ${theme === 'light' ? 'escuro' : 'claro'}`}
        id="theme-toggle"
      >
        {theme === 'light' ? (
          <Moon size={20} />
        ) : (
          <Sun size={20} style={{ color: '#fbbf24' }} />
        )}
      </button>
    </header>
  );
}
