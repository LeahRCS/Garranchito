import { useState, useMemo } from 'react';
import { useGarranchito } from '../context/GarranchitoContext';
import { pdf } from '@react-pdf/renderer';
import GarranchoPdfDocument from './PdfDocument';
import { FileDown, Type, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Eu sou a Máquina de Escrever — a segunda metade do Garranchito.
 * Aqui o usuário digita o texto que quer ver transformado em
 * "escrita manual digital" e gera um PDF usando suas próprias letras.
 *
 * Minha textarea tem linhas de caderno (via CSS background), e o botão
 * de gerar PDF é GRANDE e GLORIOSO — porque esse é o momento climático
 * de toda a experiência: ver seus garranchos virar um documento "sério".
 *
 * A lógica de geração usa @react-pdf/renderer para criar o documento
 * e o método pdf().toBlob() para baixar o arquivo no navegador.
 */
export default function TypewriterSection({ onToast }) {
  const { letters, completedCount, totalLetters } = useGarranchito();
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Eu calculo quais letras do texto digitado estão disponíveis
   * (foram desenhadas) e quais estão faltando, para dar feedback
   * visual ao usuário antes de gerar o PDF.
   */
  const textAnalysis = useMemo(() => {
    if (!text.trim()) return { unique: [], missing: [], available: [], coverage: 0 };

    const uniqueChars = [...new Set(
      text.toLowerCase().replace(/[^a-z]/g, '').split('')
    )];
    const missing = uniqueChars.filter(c => !letters[c]);
    const available = uniqueChars.filter(c => letters[c]);
    const coverage = uniqueChars.length > 0
      ? available.length / uniqueChars.length
      : 0;

    return { unique: uniqueChars, missing, available, coverage };
  }, [text, letters]);

  /**
   * Eu sou a função que faz a mágica acontecer: gero o PDF!
   *
   * Uso o @react-pdf/renderer para criar um Document com as imagens
   * das letras desenhadas pelo usuário. Cada caractere do texto
   * vira uma <Image> no PDF, e espaços viram <View>s vazios.
   *
   * O truque é usar pdf().toBlob() para gerar o arquivo em memória
   * e depois criar um link de download automático.
   */
  const handleGeneratePdf = async () => {
    if (!text.trim()) {
      onToast?.('Digite algo primeiro! 📝', 'info');
      return;
    }

    if (completedCount === 0) {
      onToast?.('Desenhe pelo menos algumas letras primeiro! ✏️', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await pdf(
        <GarranchoPdfDocument text={text} letters={letters} />
      ).toBlob();

      // Crio um link de download e clico nele programaticamente
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `garranchito-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onToast?.('PDF gerado com sucesso! 🎉📄', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      onToast?.('Erro ao gerar o PDF 😢 Tente novamente.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const hasText = text.trim().length > 0;
  const hasLetters = completedCount > 0;

  return (
    <div className="space-y-6">
      {/* ─── Cabeçalho da seção ─── */}
      <div className="text-center space-y-2">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-handwriting)', color: 'var(--text-primary)' }}
        >
          ⌨️ Máquina de Escrever
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Digite seu texto e transforme-o em um documento com seus garranchos!
        </p>
      </div>

      {/* ─── Status das letras ─── */}
      <div
        className="flex items-center gap-2 p-3 rounded-xl text-sm"
        style={{
          backgroundColor: completedCount === totalLetters
            ? 'rgba(102, 187, 106, 0.1)'
            : 'rgba(255, 138, 101, 0.1)',
          border: `1px solid ${completedCount === totalLetters
            ? 'rgba(102, 187, 106, 0.3)'
            : 'rgba(255, 138, 101, 0.3)'}`,
          color: 'var(--text-secondary)',
        }}
      >
        {completedCount === totalLetters ? (
          <>
            <Sparkles size={16} style={{ color: 'var(--accent-secondary)' }} />
            <span>Alfabeto completo! Todas as {totalLetters} letras foram desenhadas. 🎊</span>
          </>
        ) : (
          <>
            <AlertCircle size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>
              {completedCount} de {totalLetters} letras desenhadas.
              {completedCount === 0
                ? ' Volte ao Estúdio para desenhar suas letras!'
                : ' Letras faltantes serão substituídas por ▫ no PDF.'}
            </span>
          </>
        )}
      </div>

      {/* ─── Textarea para digitação ─── */}
      <div className="space-y-2">
        <label
          htmlFor="typewriter-input"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Type size={16} />
          Seu texto:
        </label>
        <textarea
          id="typewriter-input"
          className="typewriter-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite aqui o texto que você quer transformar em garranchos... Pode ser uma carta, uma mensagem especial, um bilhete engraçado ou até uma declaração de amor escrita com a caligrafia de um médico 🦆"
          maxLength={2000}
        />
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{text.length}/2000 caracteres</span>
          {hasText && textAnalysis.missing.length > 0 && (
            <span>
              Letras faltando: {textAnalysis.missing.map(c => c.toUpperCase()).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* ─── Preview das letras usadas ─── */}
      {hasText && (
        <div className="animate-in space-y-2">
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Preview das letras:
          </p>
          <div
            className="flex flex-wrap gap-1 p-3 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            {text.toLowerCase().slice(0, 80).split('').map((char, i) => {
              if (char === ' ') {
                return <div key={i} style={{ width: '12px' }} />;
              }
              if (char === '\n') {
                return <div key={i} style={{ width: '100%', height: '4px' }} />;
              }
              if (letters[char]) {
                return (
                  <img
                    key={i}
                    src={letters[char]}
                    alt={char}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                  />
                );
              }
              if (/[a-z]/.test(char)) {
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'var(--bg-hover)',
                      borderRadius: '4px',
                      fontSize: '0.6rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {char}
                  </div>
                );
              }
              // Caracteres especiais (pontuação, números) — quadrado cinza
              return (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'var(--border-subtle)',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {char}
                </div>
              );
            })}
            {text.length > 80 && (
              <span className="text-xs self-end" style={{ color: 'var(--text-muted)' }}>
                ...e mais {text.length - 80} caracteres
              </span>
            )}
          </div>
        </div>
      )}

      {/* ─── BOTÃO GLORIOSO DE GERAR PDF ─── */}
      <div className="pt-4">
        <button
          onClick={handleGeneratePdf}
          disabled={isGenerating || !hasText || !hasLetters}
          className="w-full py-5 px-8 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: isGenerating
              ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
              : 'linear-gradient(135deg, #ff7043, #f4511e, #e64a19)',
            boxShadow: isGenerating || !hasText || !hasLetters
              ? 'none'
              : '0 8px 32px rgba(244, 81, 30, 0.35), 0 4px 12px rgba(244, 81, 30, 0.2)',
            transform: isGenerating ? 'none' : undefined,
            fontFamily: 'var(--font-ui)',
          }}
          onMouseEnter={(e) => {
            if (!isGenerating && hasText && hasLetters) {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(244, 81, 30, 0.45), 0 6px 16px rgba(244, 81, 30, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
          }}
          id="btn-generate-pdf"
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>Forjando seus garranchos...</span>
            </>
          ) : (
            <>
              <FileDown size={24} />
              <span>Gerar PDF com Meus Garranchos</span>
              <span className="text-2xl">🦆</span>
            </>
          )}
        </button>

        {!hasLetters && hasText && (
          <p className="text-center text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            ☝️ Volte ao <strong>Estúdio de Caligrafia</strong> e desenhe suas letras primeiro!
          </p>
        )}
      </div>
    </div>
  );
}
