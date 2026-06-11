import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Eu sou o cérebro do Garranchito — o contexto global que guarda
 * todas as letras desenhadas pelo usuário, o tema atual, e as
 * funções para manipular tudo isso. Sou o fio condutor que conecta
 * o Estúdio de Caligrafia à Máquina de Escrever.
 *
 * O dicionário de letras é um objeto simples: { a: 'data:image/png;base64,...', b: '...' }
 * Cada chave é uma letra minúscula (a-z), e o valor é a imagem em Base64.
 */

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

const GarranchitoContext = createContext(null);

export function GarranchitoProvider({ children }) {
  /**
   * Eu guardo o dicionário de letras desenhadas.
   * Começa vazio e vai sendo preenchido conforme o usuário desenha.
   */
  const [letters, setLetters] = useState({});

  /**
   * Eu controlo qual letra o usuário está desenhando no momento.
   * Começo na primeira letra que ainda não foi desenhada.
   */
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  /**
   * Eu controlo o tema da aplicação: 'light' ou 'dark'.
   * Começo claro porque o Garranchito tem cara de caderno de rascunhos.
   */
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('garranchito-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  /**
   * Eu alterno entre tema claro e escuro, salvando a preferência
   * no localStorage para persistir entre recarregamentos.
   */
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('garranchito-theme', next);
      return next;
    });
  }, []);

  /**
   * Eu salvo a imagem de uma letra no dicionário e avanço
   * automaticamente para a próxima letra não preenchida.
   */
  const saveLetter = useCallback((letter, imageData) => {
    setLetters(prev => ({ ...prev, [letter]: imageData }));

    // Encontro a próxima letra que ainda não foi desenhada
    setCurrentLetterIndex(prevIndex => {
      const nextIndex = ALPHABET.findIndex(
        (l, i) => i > prevIndex && !letters[l]
      );
      // Se não encontrou nenhuma depois, procura do início
      if (nextIndex === -1) {
        const fromStart = ALPHABET.findIndex(l => !letters[l] && l !== letter);
        return fromStart === -1 ? prevIndex : fromStart;
      }
      return nextIndex;
    });
  }, [letters]);

  /**
   * Eu permito que o usuário volte a editar uma letra específica
   * clicando nela na galeria.
   */
  const goToLetter = useCallback((index) => {
    setCurrentLetterIndex(index);
  }, []);

  /**
   * Eu removo uma letra do dicionário, permitindo que o
   * usuário a redesenhe.
   */
  const removeLetter = useCallback((letter) => {
    setLetters(prev => {
      const next = { ...prev };
      delete next[letter];
      return next;
    });
  }, []);

  /**
   * Eu carrego uma fonte inteira de uma vez — substituindo
   * todas as letras atuais pelas importadas de um arquivo .garrancho.
   * Também reseto o índice para a primeira letra não preenchida.
   */
  const loadFont = useCallback((newLetters) => {
    setLetters(newLetters);
    const firstEmpty = ALPHABET.findIndex(l => !newLetters[l]);
    setCurrentLetterIndex(firstEmpty === -1 ? 0 : firstEmpty);
  }, []);

  /**
   * Eu limpo todas as letras de uma vez — um reset completo
   * do dicionário. Útil para começar do zero.
   */
  const clearAllLetters = useCallback(() => {
    setLetters({});
    setCurrentLetterIndex(0);
  }, []);

  /**
   * Eu calculo o progresso: quantas letras já foram desenhadas
   * dividido pelo total do alfabeto.
   */
  const progress = Object.keys(letters).length / ALPHABET.length;
  const completedCount = Object.keys(letters).length;

  const value = {
    letters,
    currentLetterIndex,
    currentLetter: ALPHABET[currentLetterIndex],
    theme,
    toggleTheme,
    saveLetter,
    goToLetter,
    removeLetter,
    loadFont,
    clearAllLetters,
    progress,
    completedCount,
    alphabet: ALPHABET,
    totalLetters: ALPHABET.length,
  };

  return (
    <GarranchitoContext.Provider value={value}>
      {children}
    </GarranchitoContext.Provider>
  );
}

/**
 * Eu sou o hook que qualquer componente usa para acessar
 * o estado global do Garranchito. Se alguém me chamar fora
 * do Provider, eu grito (com um erro educado).
 */
export function useGarranchito() {
  const context = useContext(GarranchitoContext);
  if (!context) {
    throw new Error(
      '🦆 useGarranchito precisa estar dentro do <GarranchitoProvider>! ' +
      'Envolva seu componente com o Provider, por favor.'
    );
  }
  return context;
}

export { ALPHABET };
