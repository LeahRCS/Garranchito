import { useRef, useState, useCallback } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useGarranchito, ALPHABET } from '../context/GarranchitoContext';
import LetterGallery from './LetterGallery';
import { Eraser, Undo2, Save, RotateCcw, Palette, Download, Upload } from 'lucide-react';
import { exportFont, importFont } from '../utils/fontSerializer';

/**
 * Eu sou o Estúdio de Caligrafia — o coração criativo do Garranchito.
 * Aqui o usuário desenha cada letra do alfabeto, uma de cada vez,
 * usando o dedo (mobile) ou o mouse (desktop).
 *
 * Forneço um canvas quadrado e responsivo via react-sketch-canvas,
 * botões para limpar, desfazer e salvar, e uma barra de progresso
 * que mostra quantas letras já foram conquistadas.
 *
 * Quando o usuário salva uma letra, capturo a imagem do canvas em
 * Base64 (PNG transparente) e a guardo no dicionário global.
 * Depois, avanço automaticamente para a próxima letra não preenchida.
 */

const STROKE_COLORS = [
  '#1c1917', // Preto (tinta nanquim)
  '#3b82f6', // Azul (caneta Bic)
  '#ef4444', // Vermelho (caneta vermelha do professor)
  '#16a34a', // Verde
  '#8b5cf6', // Roxo
  '#f97316', // Laranja
];

export default function CanvasStudio({ onToast }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const {
    letters,
    currentLetterIndex,
    currentLetter,
    saveLetter,
    goToLetter,
    removeLetter,
    loadFont,
    progress,
    completedCount,
    totalLetters,
    theme,
  } = useGarranchito();

  const [strokeColor, setStrokeColor] = useState(STROKE_COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Eu limpo completamente o canvas, apagando todos os traços.
   * Como se passasse um apagador mágico no quadro branco.
   */
  const handleClear = useCallback(() => {
    canvasRef.current?.clearCanvas();
  }, []);

  /**
   * Eu desfaço o último traço desenhado — porque errar é humano,
   * mas desfazer é divino (especialmente quando se trata de caligrafia).
   */
  const handleUndo = useCallback(() => {
    canvasRef.current?.undo();
  }, []);

  /**
   * Eu capturo a arte-final do canvas como uma imagem PNG transparente
   * em Base64, salvo no dicionário global e avanço para a próxima letra.
   * Também limpo o canvas para preparar o terreno para o próximo garrancho.
   */
  const handleSave = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsSaving(true);
    try {
      const imageData = await canvasRef.current.exportImage('png');
      saveLetter(currentLetter, imageData);
      canvasRef.current.clearCanvas();
      onToast?.(`Letra "${currentLetter.toUpperCase()}" salva! 🎨`, 'success');
    } catch (error) {
      console.error('Erro ao salvar letra:', error);
      onToast?.('Ops! Erro ao salvar a letra 😅', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [currentLetter, saveLetter, onToast]);

  /**
   * Eu lido com o clique em uma letra na galeria — se a letra já foi
   * desenhada, navego até ela para o usuário redesenhar. Se não, apenas
   * mudo o foco para que o usuário possa desenhá-la.
   */
  const handleLetterClick = useCallback((index) => {
    goToLetter(index);
    canvasRef.current?.clearCanvas();
  }, [goToLetter]);

  /**
   * Eu permito redesenhar uma letra que já foi salva.
   * Primeiro removo a letra antiga, depois limpo o canvas.
   */
  const handleRedraw = useCallback((letter, index) => {
    removeLetter(letter);
    goToLetter(index);
    canvasRef.current?.clearCanvas();
    onToast?.(`Letra "${letter.toUpperCase()}" removida. Desenhe de novo! ✏️`, 'info');
  }, [removeLetter, goToLetter, onToast]);

  /**
   * Eu exporto todas as letras desenhadas como um arquivo .garrancho
   * para que o usuário possa salvar sua fonte e usá-la depois.
   */
  const handleSaveFont = useCallback(() => {
    if (completedCount === 0) return;

    try {
      const { blob, filename } = exportFont(letters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onToast?.(`Fonte salva com ${completedCount} letras! 💾🦆`, 'success');
    } catch (error) {
      console.error('Erro ao salvar fonte:', error);
      onToast?.('Erro ao salvar a fonte 😢', 'error');
    }
  }, [letters, completedCount, onToast]);

  /**
   * Eu leio o arquivo .garrancho selecionado pelo usuário,
   * valido o conteúdo, e carrego as letras no dicionário global.
   * Se já existem letras desenhadas, peço confirmação antes.
   */
  const handleLoadFont = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reseto o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = '';

    try {
      const { letters: importedLetters, count } = await importFont(file);

      // Se já tem letras, peço confirmação
      if (completedCount > 0) {
        const confirmed = window.confirm(
          `Você já tem ${completedCount} letra(s) desenhada(s). ` +
          `Carregar esta fonte vai substituir tudo pelas ${count} letras do arquivo. ` +
          `Deseja continuar?`
        );
        if (!confirmed) return;
      }

      loadFont(importedLetters);
      canvasRef.current?.clearCanvas();
      onToast?.(`Fonte carregada! ${count} letras importadas 📂`, 'success');
    } catch (error) {
      console.error('Erro ao carregar fonte:', error);
      onToast?.(error.message || 'Erro ao carregar a fonte 😢', 'error');
    }
  }, [completedCount, loadFont, onToast]);

  return (
    <div className="space-y-6">
      {/* ─── Progresso ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>
            Progresso: <strong>{completedCount}</strong> de <strong>{totalLetters}</strong> letras
          </span>
          <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem' }}>
            {completedCount === totalLetters
              ? '🎉 Alfabeto completo!'
              : `${Math.round(progress * 100)}%`}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* ─── Área de Desenho Principal ─── */}
      <div className="flex flex-col items-center gap-4">
        {/* Indicador da letra atual */}
        <div className="text-center">
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            Agora desenhe a letra:
          </p>
          <div
            className="animate-pop"
            key={currentLetter}
            style={{
              fontFamily: 'var(--font-handwriting)',
              fontSize: '4rem',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              lineHeight: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {currentLetter.toUpperCase()}
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}
          >
            (minúscula: {currentLetter})
          </p>
        </div>

        {/* Canvas para desenho */}
        <div className="w-full max-w-sm mx-auto">
          <div className="canvas-wrapper aspect-square">
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              canvasColor="transparent"
              style={{
                border: 'none',
                borderRadius: '14px',
              }}
              width="100%"
              height="100%"
            />
          </div>
        </div>

        {/* ─── Controles do Canvas ─── */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-sm">
          {/* Cor do traço */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="btn-icon"
              aria-label="Escolher cor do traço"
              title="Cor do traço"
              id="color-picker-toggle"
            >
              <Palette size={18} />
              <span
                className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: strokeColor }}
              />
            </button>
            {showColorPicker && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 rounded-xl z-10"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {STROKE_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setStrokeColor(color);
                      setShowColorPicker(false);
                    }}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: color === strokeColor ? 'var(--accent-primary)' : 'transparent',
                    }}
                    aria-label={`Cor ${color}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Espessura do traço */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Traço:</span>
            <input
              type="range"
              min="2"
              max="12"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-16 accent-orange-400"
              aria-label="Espessura do traço"
              id="stroke-width-slider"
            />
            <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {strokeWidth}px
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              className="btn-secondary flex items-center gap-1.5"
              aria-label="Desfazer último traço"
              title="Desfazer"
              id="btn-undo"
            >
              <Undo2 size={16} />
              <span className="hidden sm:inline">Desfazer</span>
            </button>

            <button
              onClick={handleClear}
              className="btn-secondary flex items-center gap-1.5"
              aria-label="Limpar todo o canvas"
              title="Limpar"
              id="btn-clear"
            >
              <Eraser size={16} />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
            id="btn-save-letter"
          >
            <Save size={18} />
            <span>Salvar Letra</span>
          </button>
        </div>
      </div>

      {/* ─── Galeria de Letras ─── */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-handwriting)', color: 'var(--text-primary)' }}
          >
            📋 Galeria de Garranchos
          </h2>
          {completedCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--bg-hover)',
                color: 'var(--text-secondary)',
              }}
            >
              {completedCount} salva{completedCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* ─── Botões Salvar/Carregar Fonte ─── */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleSaveFont}
              disabled={completedCount === 0}
              className="btn-secondary flex items-center gap-1.5 text-xs"
              aria-label="Salvar fonte como arquivo"
              title="Salvar todos os garranchos como arquivo .garrancho"
              id="btn-save-font"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Salvar Fonte</span>
              <span className="sm:hidden">Salvar</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex items-center gap-1.5 text-xs"
              aria-label="Carregar fonte de um arquivo"
              title="Carregar garranchos de um arquivo .garrancho"
              id="btn-load-font"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Carregar Fonte</span>
              <span className="sm:hidden">Carregar</span>
            </button>

            {/* Input oculto para seleção de arquivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".garrancho,.json"
              onChange={handleLoadFont}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        </div>
        <LetterGallery
          onLetterClick={handleLetterClick}
          onRedraw={handleRedraw}
        />
      </div>
    </div>
  );
}
