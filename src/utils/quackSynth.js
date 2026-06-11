/**
 * Eu sou o QuackSynth — um sintetizador de grasnados de pato usando
 * a Web Audio API. Gero sons de "quack" inteiramente via código,
 * sem nenhum arquivo de áudio externo. Cada quack é único!
 *
 * A física de um quack de pato é basicamente um oscilador com
 * modulação rápida de frequência (pitch bend pra baixo) passando
 * por um filtro passa-banda pra soar "nasalado". Adiciono um pouco
 * de ruído pra dar textura e vida ao som.
 *
 * Cada variante de quack tem parâmetros diferentes:
 * pitch, duração, intensidade, curva de frequência — o que faz
 * cada "Quack!" soar genuinamente diferente.
 */

let audioContext = null;

/**
 * Eu inicializo (ou reutilizo) o AudioContext do navegador.
 * Preciso ser chamado após interação do usuário (clique)
 * por causa das políticas de autoplay dos browsers.
 */
function getAudioContext() {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Eu crio um único "quack" com os parâmetros fornecidos.
 * É basicamente um oscilador de onda quadrada/sawtooth com
 * pitch bend descendente rápido, passando por um filtro
 * passa-banda pra soar nasalado como um pato de verdade.
 *
 * @param {AudioContext} ctx - O contexto de áudio
 * @param {number} startTime - Quando o quack começa (em segundos do ctx)
 * @param {object} params - Parâmetros do quack
 */
function createSingleQuack(ctx, startTime, params = {}) {
  const {
    startFreq = 800,    // Frequência inicial (Hz) — o "ataque" do quack
    endFreq = 300,      // Frequência final (Hz) — onde o quack "morre"
    duration = 0.15,    // Duração total em segundos
    volume = 0.25,      // Volume (0-1)
    filterFreq = 1800,  // Frequência do filtro nasalado
    filterQ = 5,        // Ressonância do filtro (quanto maior, mais nasalado)
    waveType = 'sawtooth', // Tipo de onda
  } = params;

  // Oscilador principal — o "corpo" do quack
  const osc = ctx.createOscillator();
  osc.type = waveType;
  osc.frequency.setValueAtTime(startFreq, startTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration * 0.7);
  osc.frequency.exponentialRampToValueAtTime(endFreq * 0.8, startTime + duration);

  // Filtro passa-banda — faz soar "nasalado" como um pato
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(filterFreq, startTime);
  bandpass.Q.setValueAtTime(filterQ, startTime);

  // Envelope de volume — ataque rápido, decaimento natural
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01); // Ataque brusco
  gainNode.gain.setValueAtTime(volume, startTime + duration * 0.3);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  // Conecto tudo: oscilador → filtro → ganho → saída
  osc.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/**
 * Eu sou o dicionário de variantes de quack — cada uma com
 * personalidade sonora própria, casando com as mensagens de texto.
 * 
 * As chaves correspondem aos índices das QUACK_MESSAGES no Header.
 */
const QUACK_VARIANTS = {
  // 'Quack!' — quack padrão, simpático
  standard: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 780, endFreq: 340, duration: 0.16,
      volume: 0.22, filterFreq: 1600, filterQ: 5,
    });
  },

  // 'Quack!!' — quack enfático, mais alto e agudo
  emphatic: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 950, endFreq: 380, duration: 0.18,
      volume: 0.3, filterFreq: 2000, filterQ: 6,
    });
  },

  // 'QUAAACK!' — quack gritado, longo e dramático
  screaming: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 1100, endFreq: 300, duration: 0.35,
      volume: 0.35, filterFreq: 2200, filterQ: 4,
    });
    // Segundo harmônico pra dar drama
    createSingleQuack(ctx, time + 0.02, {
      startFreq: 1400, endFreq: 500, duration: 0.28,
      volume: 0.12, filterFreq: 2500, filterQ: 3, waveType: 'square',
    });
  },

  // 'quack?' — quack tímido, pitch sobe no final (pergunta)
  questioning: (ctx, time) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, time);
    osc.frequency.linearRampToValueAtTime(420, time + 0.08);
    osc.frequency.linearRampToValueAtTime(700, time + 0.15); // Sobe no final = pergunta

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1400;
    bandpass.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.01);
    gain.gain.setValueAtTime(0.15, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.22);
  },

  // 'Quack! 🦆' — quack feliz com eco
  happy: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 850, endFreq: 400, duration: 0.14,
      volume: 0.25, filterFreq: 1800, filterQ: 5,
    });
    // Pequeno eco
    createSingleQuack(ctx, time + 0.18, {
      startFreq: 750, endFreq: 380, duration: 0.1,
      volume: 0.1, filterFreq: 1500, filterQ: 4,
    });
  },

  // '...quack.' — quack hesitante, baixinho
  mumbled: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 450, endFreq: 250, duration: 0.12,
      volume: 0.1, filterFreq: 1000, filterQ: 3,
    });
  },

  // 'QUACK QUACK!' — quack duplo!
  double: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 880, endFreq: 350, duration: 0.13,
      volume: 0.28, filterFreq: 1900, filterQ: 5,
    });
    createSingleQuack(ctx, time + 0.2, {
      startFreq: 920, endFreq: 370, duration: 0.15,
      volume: 0.3, filterFreq: 2000, filterQ: 5,
    });
  },

  // 'quaaack~' — quack lento e preguiçoso
  lazy: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 600, endFreq: 220, duration: 0.3,
      volume: 0.18, filterFreq: 1200, filterQ: 4,
    });
  },

  // 'Q u a c k !' — quack pausado/robótico
  staccato: (ctx, time) => {
    const freqs = [700, 650, 600, 550, 500];
    freqs.forEach((freq, i) => {
      createSingleQuack(ctx, time + i * 0.08, {
        startFreq: freq, endFreq: freq * 0.7, duration: 0.05,
        volume: 0.15, filterFreq: 1600, filterQ: 6, waveType: 'square',
      });
    });
  },

  // '*quack*' — quack sussurrado/abafado
  whispered: (ctx, time) => {
    createSingleQuack(ctx, time, {
      startFreq: 520, endFreq: 280, duration: 0.13,
      volume: 0.08, filterFreq: 900, filterQ: 2, waveType: 'triangle',
    });
  },
};

/**
 * Eu sou a lista ordenada de variantes, casando 1:1 com as
 * QUACK_MESSAGES do Header.jsx.
 */
const VARIANT_ORDER = [
  'standard',    // 'Quack!'
  'emphatic',    // 'Quack!!'
  'screaming',   // 'QUAAACK!'
  'questioning', // 'quack?'
  'happy',       // 'Quack! 🦆'
  'mumbled',     // '...quack.'
  'double',      // 'QUACK QUACK!'
  'lazy',        // 'quaaack~'
  'staccato',    // 'Q u a c k !'
  'whispered',   // '*quack*'
];

/**
 * Eu toco o som de quack correspondente ao índice da mensagem.
 * Sou chamado pelo Header quando o pato decide falar.
 *
 * @param {number} messageIndex - O índice da mensagem escolhida
 */
export function playQuack(messageIndex) {
  try {
    const ctx = getAudioContext();
    const variantName = VARIANT_ORDER[messageIndex] || 'standard';
    const variant = QUACK_VARIANTS[variantName];
    if (variant) {
      variant(ctx, ctx.currentTime);
    }
  } catch (err) {
    // Se o áudio falhar por qualquer motivo, não quebramos nada.
    // O pato simplesmente fica mudo — e tudo bem, ele é tímido.
    console.warn('🦆 O pato tentou fazer quack mas o áudio falhou:', err);
  }
}
