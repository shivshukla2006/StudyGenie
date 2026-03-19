import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Mic, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { GenieMascot, type GeniePose } from '../components/GenieMascot';
import { useStore } from '../store/useStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Chat = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [mascotPose, setMascotPose] = useState<GeniePose>('default');

    const messages = useStore(state => state.messages);
    const addMessage = useStore(state => state.addMessage);
    const clearMessages = useStore(state => state.clearMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    useEffect(() => {
        return () => {
            clearMessages();
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech error", event.error);
                setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    }
                }
                if (finalTranscript) {
                    setMessage(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
                }
            };

            recognitionRef.current = recognition;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        if (isCameraOpen && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = s;
                    }
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    alert("Could not access camera.");
                    setIsCameraOpen(false);
                });
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOpen]);

    const handleSend = async () => {
        if (!message.trim() || isTyping) return;

        const userMsg = message.trim();
        addMessage({ role: 'user', content: userMsg });
        setMessage('');
        setIsTyping(true);
        setMascotPose('thinking');

        try {
            // Get all messages from store for context
            const allMessages = useStore.getState().messages;

            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: allMessages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) throw new Error('Failed to reach Genie');

            const data = await response.json();

            addMessage({ role: 'ai', content: data.response });
            setMascotPose('explaining');

            setTimeout(() => setMascotPose('default'), 3000);
        } catch (err: any) {
            console.error('Chat Error:', err);
            addMessage({
                role: 'ai',
                content: "I'm having a little trouble connecting to my magical powers right now. Please make sure the backend is running! ✨"
            });
            setMascotPose('default');
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-3 mb-6">
                <GenieMascot className="w-12 h-12" isThinking={isTyping} pose={mascotPose} />
                <div className="p-4 rounded-xl shadow-sm border w-full max-w-md flex items-center justify-between" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Genie Tutor</h1>
                        <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Always here to help you study.</p>
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-xl opacity-60 hover:opacity-100 transition-opacity"
                        onClick={() => setShowClearConfirm(true)}
                        title="Clear Conversation"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Clear Magic? ✨</h3>
                        <p className="text-[var(--text-secondary)] mb-6">This will erase all messages in this conversation. Are you sure?</p>
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                className="flex-1 rounded-xl"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                Wait, No!
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 border-none text-white"
                                onClick={() => {
                                    clearMessages();
                                    setShowClearConfirm(false);
                                }}
                            >
                                Yes, Clear
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col rounded-2xl border p-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                                    {msg.role === 'ai' ? (
                                        <Bot size={16} style={{ color: 'var(--btn-primary)' }} />
                                    ) : (
                                        <User size={16} style={{ color: 'var(--btn-primary)' }} />
                                    )}
                                </div>
                                <div
                                    className={`p-3 flex flex-col rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none shadow-sm' : 'rounded-tl-none border'}`}
                                    style={msg.role === 'user' ? {
                                        backgroundColor: 'var(--chat-user-bg)',
                                        color: 'var(--chat-user-text)'
                                    } : {
                                        backgroundColor: 'var(--chat-ai-bg)',
                                        borderColor: 'var(--chat-ai-border)',
                                        color: 'var(--chat-ai-text)'
                                    }}
                                >
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                                            li: ({node, ...props}) => <li className="text-sm" {...props} />,
                                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-3 mb-1" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                                            table: ({node, ...props}) => <div className="overflow-x-auto my-2 rounded-lg border border-[var(--chat-ai-border)]"><table className="border-collapse w-full text-xs" {...props} /></div>,
                                            th: ({node, ...props}) => <th className="border-b border-[var(--chat-ai-border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-left font-semibold" {...props} />,
                                            td: ({node, ...props}) => <td className="border-b border-[var(--chat-ai-border)] last:border-b-0 px-2 py-1.5" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-bold text-[var(--btn-primary)]" {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-start gap-2 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                                    <Bot size={16} style={{ color: 'var(--btn-primary)' }} />
                                </div>
                                <div className="p-3 px-4 flex flex-col gap-2 rounded-2xl rounded-tl-none border bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-400 relative overflow-hidden">
                                    <div className="flex items-center gap-2 relative z-10">
                                        <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Genie is thinking</span>
                                        <div className="flex gap-1 items-center h-4 ml-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce shadow-[0_0_8px_rgba(168,85,247,0.8)]" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce shadow-[0_0_8px_rgba(34,211,238,0.8)]" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-2 pt-2 border-t mt-auto" style={{ borderColor: 'var(--card-border)' }}>
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="shrink-0 rounded-xl" 
                        onClick={() => setIsCameraOpen(true)}
                    >
                        <Camera size={18} />
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className={`shrink-0 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30' : ''}`} 
                        onClick={handleVoiceInput}
                    >
                        <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                    </Button>
                    <Input
                        placeholder="Ask the Genie anything..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />
                    <Button variant="primary" size="icon" className="shrink-0 rounded-xl" onClick={handleSend} disabled={isTyping || !message.trim()}>
                        <Send size={18} />
                    </Button>
                </div>

                {/* Camera Overlay */}
                <AnimatePresence>
                    {isCameraOpen && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-50 flex flex-col"
                        >
                            <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 w-full z-10">
                                <h2 className="text-white font-bold">Scan Question</h2>
                                <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 border-transparent" onClick={() => setIsCameraOpen(false)}>
                                    <X size={20} className="text-white" />
                                </Button>
                            </div>

                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center bg-blue-500/5">
                                    <div className="text-white/60 text-xs text-center px-4">Align question here</div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 w-full flex justify-center">
                                <Button variant="glow" className="h-16 w-16 rounded-full p-0 flex items-center justify-center" onClick={() => {
                                    alert("Analysis feature coming soon!");
                                    setIsCameraOpen(false);
                                }}>
                                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                        <Camera size={24} className="text-blue-600" />
                                    </div>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
