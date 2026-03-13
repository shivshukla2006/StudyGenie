import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { GenieMascot, type GeniePose } from '../components/GenieMascot';
import { useStore } from '../store/useStore';

export const Chat = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [mascotPose, setMascotPose] = useState<GeniePose>('default');
    
    const messages = useStore(state => state.messages);
    const addMessage = useStore(state => state.addMessage);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!message.trim() || isTyping) return;
        
        // Add user message
        addMessage({ role: 'user', content: message.trim() });
        setMessage('');
        setIsTyping(true);
        setMascotPose('thinking');
        
        // Simulate AI thinking and response
        setTimeout(() => {
            const responses = [
                "That's an interesting question! Let me break it down for you.",
                "Great question! Here's the core concept you need to know.",
                "I can certainly help with that. Let's look at it step by step.",
                "Let's explore that topic together. First, we need to understand the basics."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            addMessage({ role: 'ai', content: randomResponse });
            setIsTyping(false);
            setMascotPose('explaining');
            
            // Revert pose back to default after explaining
            setTimeout(() => {
                setMascotPose('default');
            }, 3000);

        }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-3 mb-6">
                <GenieMascot className="w-12 h-12" isThinking={isTyping} pose={mascotPose} />
                <div className="p-4 rounded-xl shadow-sm border w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Genie Tutor</h1>
                    <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Always here to help you study.</p>
                </div>
            </div>

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
                                    className={`p-3 flex flex-col gap-2 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none shadow-sm' : 'rounded-tl-none border'}`} 
                                    style={msg.role === 'user' ? { 
                                        backgroundColor: 'var(--chat-user-bg)', 
                                        color: 'var(--chat-user-text)' 
                                    } : { 
                                        backgroundColor: 'var(--chat-ai-bg)', 
                                        borderColor: 'var(--chat-ai-border)', 
                                        color: 'var(--chat-ai-text)' 
                                    }}
                                >
                                    <p>{msg.content}</p>
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
                                 <div className="p-3 flex flex-col gap-2 rounded-2xl rounded-tl-none border" style={{ backgroundColor: 'var(--chat-ai-bg)', borderColor: 'var(--chat-ai-border)', color: 'var(--chat-ai-text)' }}>
                                     <div className="flex gap-1 items-center h-5">
                                         <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                                         <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                                         <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                                     </div>
                                 </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-2 pt-2 border-t mt-auto" style={{ borderColor: 'var(--card-border)' }}>
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
            </div>
        </div>
    );
};
