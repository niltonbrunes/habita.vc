'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (running in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed before
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 10 seconds of use
      setTimeout(() => setIsVisible(true), 10000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom animate-in slide-in-from-bottom duration-300">
      <div className="m-3 md:m-4 bg-heading text-white rounded-2xl shadow-2xl border border-surface/10 overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-blue-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-primary/30">
            <Smartphone size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-white leading-tight">Instalar HabitaVC CRM</p>
            <p className="text-xs text-white/60 font-medium mt-0.5 leading-tight">
              Adicione à tela inicial para acesso rápido sem o navegador.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-primary hover:bg-blue-primary/90 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-primary/20"
            >
              <Download size={14} />
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-surface/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
