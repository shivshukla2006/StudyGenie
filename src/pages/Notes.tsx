import { FileText, Sparkles, Brain, List, Send, Loader2, Save, Trash2, CheckCircle, Upload, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ProcessedData {
    summary: string;
    flashcards: Array<{ question: string; answer: string }>;
    concepts: string[];
}

export const Notes = () => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ProcessedData | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'concepts'>('summary');
    const [isSaved, setIsSaved] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const saveNote = useStore(state => state.saveNote);
    const deleteNote = useStore(state => state.deleteNote);
    const savedNotes = useStore(state => state.savedNotes);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setIsProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user.id);
            
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            
            // 2. Add Row from Frontend where auth token matches RLS
            const { data: docData, error: docError } = await supabase.from("documents").insert({
                user_id: user.id,
                name: file.name,
                file_url: data.url,
                file_type: file.name.split('.').pop() || 'bin',
                size_bytes: file.size
            }).select();

            if (docError) throw docError;
            const document_id = docData?.[0]?.id;

            // 2.5 Trigger Embeddings creation if text exists
            if (document_id && data.text_content) {
                try {
                    await fetch('http://localhost:8000/embed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            document_id: document_id,
                            content: data.text_content
                        })
                    });
                } catch (embedErr) {
                    console.error('Embedding triggers failed:', embedErr);
                }
            }

            // 3. Render AI Processed result if available
            if (data.processed) {
                if (data.processed.error) {
                    alert(`Upload success ✨, but AI: ${data.processed.error}`);
                } else {
                    setResult(data.processed);
                    alert(`File uploaded and processed successfully: ${data.name}`);
                }
            } else {
                alert(`File uploaded successfully: ${data.name}`);
            }

            setFile(null);
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Upload failed. Please try again!');
        } finally {
            setIsUploading(false);
            setIsProcessing(false);
        }
    };

    const handleProcess = async () => {
        if (!input.trim()) return;
        setIsProcessing(true);
        setIsSaved(false);
        try {
            const response = await fetch('http://localhost:8000/process-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: input })
            });

            if (!response.ok) throw new Error('Processing failed');
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Note Error:', error);
            alert('The Genie is struggling to read this. Please try again!');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        
        const title = input.slice(0, 30) + (input.length > 30 ? '...' : '');
        await saveNote({
            title,
            summary: result.summary,
            flashcards: result.flashcards,
            concepts: result.concepts
        });
        setIsSaved(true);
    };

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl shadow-sm border flex justify-between items-center bg-[var(--card-bg)] border-[var(--card-border)] overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Smart Notes</h1>
                    <p className="text-[var(--text-secondary)] font-medium mt-1">Paste your study material and let the Genie extract the essentials.</p>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="p-4 flex flex-col h-full border-blue-500/10 min-h-[500px]">
                        <div className="flex items-center gap-2 mb-4 text-blue-500 font-bold text-sm uppercase tracking-wider">
                            <FileText size={18} />
                            <span>Input Content</span>
                        </div>
                        {/* Dropzone */}
                        <div className="mb-4">
                            {!file ? (
                                <label className="border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/5 hover:bg-white/10">
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.doc,.docx" />
                                    <Upload size={24} className="text-blue-400" />
                                    <span className="text-sm font-bold text-white">Upload File</span>
                                    <span className="text-xs text-blue-200/60">PDF, TXT, or DOC (Max 10MB)</span>
                                </label>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm">
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} className="text-blue-400" />
                                        <span className="font-bold text-white truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="glow" className="h-8 text-xs px-3" onClick={handleUpload} disabled={isUploading}>
                                            {isUploading ? <Loader2 size={14} className="animate-spin" /> : 'Upload'}
                                        </Button>
                                        <button onClick={() => setFile(null)} className="text-white/40 hover:text-white"><X size={16} /></button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <TextArea 
                            placeholder="Paste your lecture notes, article text, or study material here..."
                            className="flex-1 min-h-[350px] bg-white/5 border-none resize-none focus:ring-1 focus:ring-blue-500/30 p-4 rounded-xl text-sm leading-relaxed"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="mt-4 flex gap-2">
                            <Button 
                                variant="glow" 
                                className="flex-1 h-12" 
                                onClick={handleProcess}
                                disabled={isProcessing || !input.trim()}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Process Notes
                                    </>
                                )}
                            </Button>
                            {result && !isSaved && (
                                <Button 
                                    variant="secondary" 
                                    className="px-4 border-white/5" 
                                    onClick={handleSave}
                                >
                                    <Save size={18} />
                                </Button>
                            )}
                            {isSaved && (
                                <Button 
                                    variant="secondary" 
                                    className="px-4 border-green-500/30 text-green-500 bg-green-500/5" 
                                    disabled
                                >
                                    <CheckCircle size={18} />
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Output Section */}
                <div className="lg:col-span-8">
                    {result ? (
                        <div className="space-y-4 h-full flex flex-col">
                            {/* Tabs */}
                            <div className="flex p-1 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm self-center">
                                {[
                                    { id: 'summary' as const, label: 'Summary', icon: FileText },
                                    { id: 'flashcards' as const, label: 'Flashcards', icon: Brain },
                                    { id: 'concepts' as const, label: 'Concepts', icon: List },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                            activeTab === tab.id 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                                        }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <Card className="flex-1 p-8 border-white/5 min-h-[450px]">
                                {activeTab === 'summary' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <h2 className="text-2xl font-black text-[var(--text-primary)]">Key Summary</h2>
                                        <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                                            {result.summary}
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'flashcards' && (
                                    <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
                                        {result.flashcards.map((card, i) => (
                                            <div key={i} className="group h-48 [perspective:1000px] cursor-pointer">
                                                <div className="relative h-full w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl shadow-blue-500/5">
                                                    {/* Front */}
                                                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-white/5 border border-white/10 rounded-2xl [backface-visibility:hidden]">
                                                        <p className="font-bold text-[var(--text-primary)] text-sm">{card.question}</p>
                                                    </div>
                                                    {/* Back */}
                                                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-blue-600 border border-blue-500 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                                        <p className="font-bold text-white text-sm">{card.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'concepts' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                                        <h2 className="text-2xl font-black text-[var(--text-primary)]">Core Concepts</h2>
                                        <div className="grid gap-3">
                                            {result.concepts.map((concept: any, i) => (
                                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
                                                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm flex-shrink-0">{i + 1}</span>
                                                    <div>
                                                        {typeof concept === 'string' ? (
                                                            <span className="font-bold text-[var(--text-primary)]">{concept}</span>
                                                        ) : (
                                                            <>
                                                                <span className="font-bold text-[var(--text-primary)] block">{concept.term}</span>
                                                                <span className="text-sm text-[var(--text-secondary)] mt-1 block">{concept.definition}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-white/10 [background:transparent] opacity-50 space-y-4 h-[500px]">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                                <Send size={40} className="text-[var(--text-secondary)]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Ready for Magic?</h3>
                                <p className="text-sm text-[var(--text-secondary)] max-w-sm mt-2">
                                    Paste your notes on the left and click process. The Genie will analyze the context and provide structured study materials.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Saved Notes History Section */}
            {savedNotes.length > 0 && (
                <div className="mt-12 space-y-4">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Save size={20} className="text-blue-500" />
                        Recently Processed
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {savedNotes.map((note) => (
                            <Card key={note.id} className="p-4 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col h-full border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <button 
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (note.id) deleteNote(note.id);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-sm text-[var(--text-primary)] line-clamp-2 flex-1">{note.title}</h3>
                                <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60">
                                    <span>{note.flashcards.length} Cards</span>
                                    <span>{new Date(note.created_at || '').toLocaleDateString()}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
