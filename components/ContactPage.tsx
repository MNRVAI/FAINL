
import { FC, useState } from 'react';
import { 
  Globe, 
  Github, 
  Terminal,
  Send,
  MessageSquare,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { ScrambleText } from './ScrambleText';
import { supabase } from '../services/supabaseClient';

export const ContactPage: FC = () => {
    const [name, setName] = useState('');
    const [payload, setPayload] = useState('');
    const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !payload || status !== 'idle') return;

        setStatus('transmitting');
        setErrorMessage('');

        try {
            const { data, error } = await supabase.functions.invoke('send-contact-email', {
                body: { name, payload }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);
            
            setStatus('success');
            
            // Reset after success
            setTimeout(() => {
                setName('');
                setPayload('');
                setStatus('idle');
            }, 3000);
        } catch (err: any) {
            console.error('Transmission failed:', err);
            setErrorMessage(err.message || 'Transmission handshaking failed.');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-12 md:gap-24">
                <div className="lg:w-1/2 space-y-8 md:space-y-12">
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-white">
                        <ScrambleText text="Reach The Core" />
                    </h1>
                    <p className="text-sm md:text-lg font-bold text-black/50 dark:text-white/50 uppercase tracking-[0.2em] leading-relaxed">
                        Direct encrypted link to the FAINL maintenance architecture. Our autonomous protocol ensures high-integrity deliberation for every transmission received. Initiate contact to sync with the core.
                    </p>
                    
                    <div className="p-8 bg-black/5 dark:bg-white/5 border-4 border-black/10 dark:border-white/5 rounded-[2rem] space-y-6">
                        <div className="flex items-center gap-4 text-black dark:text-white opacity-40">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Response Time: \u003c 12H</span>
                        </div>
                        <div className="flex items-center gap-4 text-black dark:text-white opacity-40">
                            <Globe className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Node Uptime: 99.9%</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-4 mb-10 text-black dark:text-white">
                            <Terminal className="w-6 h-6 md:w-8 md:h-8" />
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Transmission</h3>
                        </div>
                        
                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em]">Source Identity</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="NODE_NAME"
                                    disabled={status !== 'idle'}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-4 border-black dark:border-white/10 p-5 md:p-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] focus:bg-white dark:focus:bg-zinc-700 transition-all outline-none text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em]">Communication Payload</label>
                                <textarea 
                                    required
                                    value={payload}
                                    onChange={(e) => setPayload(e.target.value)}
                                    placeholder="ENTER DIRECTIVE..."
                                    disabled={status !== 'idle'}
                                    rows={5}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-4 border-black dark:border-white/10 p-5 md:p-6 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] focus:bg-white dark:focus:bg-zinc-700 transition-all outline-none resize-none text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 disabled:opacity-50"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={status !== 'idle' || !name || !payload}
                                className={`w-full py-6 md:py-8 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all shadow-xl flex items-center justify-center gap-4 ${
                                    status === 'success' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98]'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {status === 'idle' && (
                                    <>
                                        <Send className="w-5 h-5 md:w-6 md:h-6" />
                                        Initiate Transfer
                                    </>
                                )}
                                {status === 'transmitting' && (
                                    <>
                                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                        Transmitting...
                                    </>
                                )}
                                {status === 'success' && (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                                        Transfer Complete
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="mt-20 md:mt-32 border-t-4 border-black dark:border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex gap-8">
                    <Github className="w-6 h-6 md:w-8 md:h-8 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                    <Globe className="w-6 h-6 md:w-8 md:h-8 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                </div>
                <p className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.4em] text-center">\u00A9 2026 FAINL PROTOCOL \u2022 ALL RIGHTS RESERVED</p>
            </div>
        </div>
    );
};
