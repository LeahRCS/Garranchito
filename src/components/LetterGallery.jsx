import { useGarranchito, ALPHABET } from '../context/GarranchitoContext';
import { RotateCcw } from 'lucide-react';

/**
 * Eu sou a Galeria de Garranchos — um grid bonito e responsivo que
 * mostra todas as 26 letras do alfabeto. As que já foram desenhadas
 * aparecem com sua imagem capturada, e as pendentes mostram a letra
 * em cinza claro esperando ser conquistada.
 *
 * O usuário pode clicar em qualquer letra para navegar até ela no
 * canvas, e em letras já salvas, um botão de "redesenhar" aparece
 * no hover para permitir correções.
 *
 * O visual é como um tabuleiro de figurinhas colecionáveis —
 * cada letra preenchida é uma pequena vitória!
 */
export default function LetterGallery({ onLetterClick, onRedraw }) {
  const { letters, currentLetterIndex } = useGarranchito();

  return (
    <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-1.5 sm:gap-2">
      {ALPHABET.map((letter, index) => {
        const isFilled = !!letters[letter];
        const isCurrent = index === currentLetterIndex;

        return (
          <div
            key={letter}
            className={`letter-tile group relative cursor-pointer ${
              isFilled ? 'filled' : ''
            } ${isCurrent ? 'current' : ''}`}
            onClick={() => onLetterClick(index)}
            title={
              isFilled
                ? `Letra ${letter.toUpperCase()} — clique para editar`
                : `Letra ${letter.toUpperCase()} — clique para desenhar`
            }
            role="button"
            aria-label={`Letra ${letter.toUpperCase()}${isFilled ? ' (salva)' : isCurrent ? ' (atual)' : ''}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onLetterClick(index);
              }
            }}
          >
            {isFilled ? (
              <>
                <img
                  src={letters[letter]}
                  alt={`Letra ${letter.toUpperCase()} desenhada`}
                  className="w-full h-full object-contain p-0.5"
                  draggable={false}
                />
                {/* Botão de redesenhar no hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRedraw(letter, index);
                  }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  aria-label={`Redesenhar letra ${letter.toUpperCase()}`}
                  title="Redesenhar"
                >
                  <RotateCcw size={16} className="text-white" />
                </button>
              </>
            ) : (
              <span
                className="text-sm sm:text-base font-bold select-none"
                style={{
                  color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-handwriting)',
                  fontSize: isCurrent ? '1.2rem' : undefined,
                }}
              >
                {letter.toUpperCase()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
