import { useState, useEffect } from 'react';
import { GarranchitoProvider, useGarranchito } from './context/GarranchitoContext';
import CanvasStudio from './components/CanvasStudio';
import TypewriterSection from './components/TypewriterSection';
import Header from './components/Header';
import Toast from './components/Toast';

/**
 * Eu sou o componente raiz do Garranchito — o maestro que orquestra
 * as duas seções principais (Estúdio de Caligrafia e Máquina de Escrever)
 * e controla a navegação por abas entre elas.
 *
 * Envolvo tudo no GarranchitoProvider para que todos os filhos
 * tenham acesso ao dicionário de letras e ao controle de tema.
 */

function AppContent() {
  /**
   * Eu controlo qual aba está ativa: 'studio' ou 'typewriter'.
   * Começo no estúdio porque o usuário precisa desenhar antes de escrever.
   */
  const [activeTab, setActiveTab] = useState('studio');
  const { theme, completedCount, totalLetters } = useGarranchito();

  /**
   * Eu aplico o atributo data-theme no <html> para que as variáveis
   * CSS do tema se propaguem por toda a aplicação.
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Eu monto as notificações (toasts) para feedback visual do usuário.
   */
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      {/* ─── Tabs de Navegação ─── */}
      <div className="w-full max-w-4xl mx-auto px-4">
        <nav className="flex gap-1" role="tablist" aria-label="Seções do Garranchito">
          <button
            role="tab"
            id="tab-studio"
            aria-selected={activeTab === 'studio'}
            aria-controls="panel-studio"
            className={`tab-btn flex items-center gap-2 ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <span className="text-lg">✏️</span>
            <span className="hidden sm:inline">1. Estúdio de Caligrafia</span>
            <span className="sm:hidden">Estúdio</span>
          </button>
          <button
            role="tab"
            id="tab-typewriter"
            aria-selected={activeTab === 'typewriter'}
            aria-controls="panel-typewriter"
            className={`tab-btn flex items-center gap-2 ${activeTab === 'typewriter' ? 'active' : ''}`}
            onClick={() => setActiveTab('typewriter')}
          >
            <span className="text-lg">🖨️</span>
            <span className="hidden sm:inline">2. Máquina de Escrever</span>
            <span className="sm:hidden">Máquina</span>
            {completedCount > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: completedCount === totalLetters ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                {completedCount}/{totalLetters}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* ─── Painel de Conteúdo ─── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-8">
        <div
          className="card p-4 sm:p-6 lg:p-8"
          style={{ borderTopLeftRadius: activeTab === 'studio' ? 0 : undefined }}
        >
          {activeTab === 'studio' ? (
            <div role="tabpanel" id="panel-studio" aria-labelledby="tab-studio" className="animate-in">
              <CanvasStudio onToast={addToast} />
            </div>
          ) : (
            <div role="tabpanel" id="panel-typewriter" aria-labelledby="tab-typewriter" className="animate-in">
              <TypewriterSection onToast={addToast} />
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer com assinatura ─── */}
      <footer className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem' }}>
          feito com 🦆 garranchos e muito carinho
        </p>
      </footer>

      {/* ─── Toasts ─── */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </div>
  );
}

/**
 * Eu sou o App "de fachada" — simplesmente envolvo o conteúdo real
 * com o GarranchitoProvider para fornecer o estado global.
 */
export default function App() {
  return (
    <GarranchitoProvider>
      <AppContent />
    </GarranchitoProvider>
  );
}
