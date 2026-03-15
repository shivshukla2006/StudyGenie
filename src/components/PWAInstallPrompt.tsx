import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            console.log('PWA: beforeinstallprompt event fired!');
            e.preventDefault();
            setDeferredPrompt(e);
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler as any);
        return () => window.removeEventListener('beforeinstallprompt', handler as any);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-500 max-w-sm">
            <Card className="p-5 border-blue-500/20 shadow-2xl relative bg-gradient-to-br from-[var(--card-bg)] to-blue-500/5 backdrop-blur-md">
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <X size={16} />
                </button>
                
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                        <Download size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] text-sm">Install StudyGenie</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Access your study guides offline easily with the Genie!</p>
                    </div>
                </div>

                <div className="mt-4">
                    <Button variant="primary" className="w-full h-10 text-sm font-bold" onClick={handleInstall}>
                        Install App
                    </Button>
                </div>
            </Card>
        </div>
    );
};
