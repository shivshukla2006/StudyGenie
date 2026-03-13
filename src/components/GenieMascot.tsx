import React, { type FC } from 'react';
import { motion } from 'framer-motion';

export type GeniePose = 'default' | 'thinking' | 'explaining' | 'celebration' | 'listening' | 'button';

interface GenieMascotProps {
    className?: string;
    isThinking?: boolean;
    pose?: GeniePose;
}

export const GenieMascot: FC<GenieMascotProps> = ({ className = '', isThinking = false, pose = 'default' }) => {
    const activePose = pose !== 'default' ? pose : (isThinking ? 'thinking' : 'default');

    // Circular Button variant
    if (activePose === 'button') {
        return (
            <motion.button
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className={`flex items-center justify-center rounded-full relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-[var(--mascot-bg)]/50 ${className}`}
                style={{
                    backgroundColor: 'var(--mascot-bg)',
                    width: '60px', height: '60px', maxWidth: '100%', maxHeight: '100%',
                    boxShadow: '0 0 var(--mascot-blur) var(--mascot-glow), 0 0 calc(var(--mascot-blur) * 2) var(--mascot-glow)',
                    border: 'none',
                    transition: 'box-shadow 0.3s ease, background-color 0.3s ease'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA] to-[#3B82F6] opacity-50" />
                <svg viewBox="0 0 32 32" className="w-10 h-10 relative z-10">
                    <ellipse cx="11" cy="14" rx="2.5" ry="4" fill="white" />
                    <ellipse cx="21" cy="14" rx="2.5" ry="4" fill="white" />
                    <circle cx="11.5" cy="13" r="1.5" fill="#1E3A8A" />
                    <circle cx="21.5" cy="13" r="1.5" fill="#1E3A8A" />
                    <path d="M11 20 Q16 24 21 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
            </motion.button>
        );
    }

    // Dynamic state for Mascot variants
    let headRotation = 0;
    let mouthPath = "M 10 21 Q 16 26 22 21";
    let eyeLeft = <ellipse cx="11" cy="14" rx="3.5" ry="5" fill="white" />;
    let eyeRight = <ellipse cx="21" cy="14" rx="3.5" ry="5" fill="white" />;
    let leftPupil: React.ReactNode = <circle cx="12" cy="13" r="1.5" fill="#1E3A8A" />;
    let rightPupil: React.ReactNode = <circle cx="22" cy="13" r="1.5" fill="#1E3A8A" />;
    let hands: React.ReactNode = null;
    let sparks: React.ReactNode = null;
    let floatAnim = { y: [-6, 6, -6] };
    let floatDur = 4;

    switch (activePose) {
        case 'thinking':
            headRotation = -8;
            mouthPath = "M 12 22 Q 14 23 16 22"; // Small pondering mouth
            eyeLeft = <ellipse cx="12" cy="12" rx="3.5" ry="5" fill="white" />;
            eyeRight = <ellipse cx="22" cy="12" rx="3.5" ry="5" fill="white" />;
            leftPupil = <circle cx="13" cy="10" r="1.5" fill="#1E3A8A" />; // Looking up
            rightPupil = <circle cx="23" cy="10" r="1.5" fill="#1E3A8A" />;
            hands = (
                <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 2, repeat: Infinity }}>
                    {/* Hand on chin */}
                    <circle cx="10" cy="27" r="4.5" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />
                    <circle cx="10" cy="27" r="2.5" fill="#3B82F6" stroke="none" opacity="0.6" />
                </motion.g>
            );
            break;
        case 'explaining':
            mouthPath = "M 10 20 Q 16 26 22 20";
            hands = (
                <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    {/* Pointing hand */}
                    <rect x="25" y="8" width="5" height="10" rx="2.5" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />
                    <circle cx="27.5" cy="18" r="4.5" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />
                </motion.g>
            );
            break;
        case 'celebration':
            floatAnim = { y: [-10, 0, -10] };
            floatDur = 0.6; // Bouncing faster
            mouthPath = "M 9 20 Q 16 28 23 20 Z"; // Open happy mouth
            eyeLeft = <path d="M 8 15 Q 11 11 14 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
            eyeRight = <path d="M 18 15 Q 21 11 24 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
            leftPupil = null;
            rightPupil = null;
            hands = (
                <>
                    <motion.g animate={{ y: [-5, 5, -5] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <circle cx="1" cy="12" r="4" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />
                    </motion.g>
                    <motion.g animate={{ y: [5, -5, 5] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <circle cx="31" cy="10" r="4" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />
                    </motion.g>
                </>
            );
            sparks = (
                <motion.div animate={{ rotate: 90, scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 text-[#60A5FA] text-xl drop-shadow-md">✦</div>
                    <div className="absolute top-4 right-0 text-[#60A5FA] text-2xl drop-shadow-md">✦</div>
                    <div className="absolute bottom-4 left-2 text-[#60A5FA] text-lg drop-shadow-md">✦</div>
                </motion.div>
            );
            break;
        case 'listening':
            headRotation = 12; // Head tilted
            mouthPath = "M 15 22 A 1.5 1.5 0 1 1 17 22 A 1.5 1.5 0 1 1 15 22"; // Small O shape
            eyeLeft = <ellipse cx="10" cy="15" rx="3.5" ry="5" fill="white" />;
            eyeRight = <ellipse cx="20" cy="15" rx="3.5" ry="5" fill="white" />;
            leftPupil = <circle cx="11" cy="15" r="1.5" fill="#1E3A8A" />;
            rightPupil = <circle cx="21" cy="15" r="1.5" fill="#1E3A8A" />;
            break;
        case 'default':
        default:
            break;
    }

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {sparks}
            <motion.div
                animate={floatAnim}
                transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.35)] dark:drop-shadow-[0_0_24px_rgba(59,130,246,0.45)]"
            >
                <svg viewBox="-5 -5 42 46" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60A5FA" />
                            <stop offset="30%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#2563EB" />
                        </linearGradient>
                    </defs>

                    {/* Tail */}
                    <motion.g animate={{ skewX: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} transform="translate(16, 29)">
                        <path d="M -6 0 C -10 6, 8 10, 3 14 C -2 16, -6 13, -4 10" fill="#1E3A8A" opacity="0.6" />
                        <path d="M -3 0 C -6 4, 5 8, 1 11" fill="#3B82F6" opacity="0.9" style={{ filter: 'blur(1px)' }} />
                    </motion.g>

                    {/* Head / Body */}
                    <motion.g style={{ originX: '16px', originY: '16px' }} animate={{ rotate: headRotation }}>
                        {/* Main body shape */}
                        <path d="M 4 14 C 4 2, 28 2, 28 14 C 28 26, 20 32, 16 32 C 12 32, 4 26, 4 14 Z" fill="url(#bodyGrad)" stroke="#1E3A8A" strokeWidth="1.5" />

                        {/* Inner highlight for soft 3D look */}
                        <path d="M 6 12 C 6 4, 26 4, 26 12 C 26 22, 18 28, 16 28 C 14 28, 6 22, 6 12 Z" fill="#60A5FA" opacity="0.3" />

                        {/* Eyes */}
                        {eyeLeft}
                        {eyeRight}
                        {leftPupil}
                        {rightPupil}

                        {/* Mouth */}
                        {(activePose !== 'listening' && activePose !== 'celebration') && <path d={mouthPath} stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />}
                        {activePose === 'celebration' && <path d={mouthPath} fill="white" />}
                        {activePose === 'listening' && <path d={mouthPath} fill="white" />}
                    </motion.g>

                    {/* Hands */}
                    {hands}
                </svg>
            </motion.div>
        </div>
    );
};
