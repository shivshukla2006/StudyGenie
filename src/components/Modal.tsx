import { useEffect, type FC, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative z-50 w-full max-w-lg rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-white/20 text-white"
                    >
                        {title && (
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        {!title && (
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}

                        <div className="mt-2">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
