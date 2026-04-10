import { FC, useState } from 'react';
import { Send, MessageSquare, Loader2, CheckCircle2, Mail, Clock, Shield } from 'lucide-react';
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
        body: { name, payload },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setStatus('success');

      setTimeout(() => {
        setName('');
        setPayload('');
        setStatus('idle');
      }, 3000);
    } catch (err: any) {
      console.error('Contact form failed:', err);
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-fade-in-up">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-1000/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          Contact
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
          Get in Touch
        </h1>
        <p className="max-w-sm mx-auto text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
          Have a question, feedback, or partnership inquiry? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">

        {/* Left: Info cards */}
        <div className="lg:col-span-2 space-y-3">
          {[
            { icon: Clock, title: 'Response Time', desc: 'We typically respond within 12 hours.' },
            { icon: Shield, title: 'Privacy First', desc: 'Your message is sent securely and never shared.' },
            { icon: Mail, title: 'Direct Line', desc: 'Reach a real person — not an automated bot.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card card-shadow rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">{title}</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3">
          <div className="glass-card card-shadow rounded-2xl p-5 md:p-7">
            {/* Top accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-500/15 to-transparent mb-5" />

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  disabled={status !== 'idle'}
                  className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Write your message here..."
                  disabled={status !== 'idle'}
                  rows={5}
                  className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all resize-none disabled:opacity-50"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status !== 'idle' || !name || !payload}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 ${
                  status === 'success'
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'btn-violet disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none'
                }`}
              >
                {status === 'idle' && (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
                {status === 'transmitting' && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Message sent!
                  </>
                )}
                {status === 'error' && (
                  <>
                    <Send className="w-4 h-4" />
                    Try again
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
