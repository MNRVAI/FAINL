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
      setErrorMessage(err.message || 'Bericht verzenden mislukt. Probeer het opnieuw.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <MessageSquare className="w-3.5 h-3.5" />
          Contact
        </div>
        <h1 className="page-title">Neem Contact Op</h1>
        <p className="page-sub">
          Heb je een vraag, feedback of partnerschap­voorstel? We horen graag van je.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Reactietijd', value: '≤12u', icon: Clock },
          { label: 'Privacy', value: '100%', icon: Shield },
          { label: 'Echt persoon', value: '✓', icon: Mail },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon"><Icon className="w-4 h-4" /></div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              icon: Clock,
              title: 'Snelle reactie',
              desc: 'We reageren doorgaans binnen 12 uur op werkdagen.',
            },
            {
              icon: Shield,
              title: 'Privacy voorop',
              desc: 'Je bericht wordt veilig verzonden en nooit gedeeld.',
            },
            {
              icon: Mail,
              title: 'Directe lijn',
              desc: 'Je bereikt een echte persoon — geen geautomatiseerde bot.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="key-card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
              <div className="stat-icon" style={{ flexShrink: 0, margin: 0 }}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="key-card" style={{ gap: 20 }}>
          <div className="key-card-header">
            <span className="key-label">
              <Send className="w-4 h-4 inline mr-1.5" style={{ verticalAlign: -3 }} />
              Stuur een bericht
            </span>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSubmit}>
            <div>
              <label className="key-label" style={{ marginBottom: 6, display: 'block' }}>Jouw naam</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan de Vries"
                disabled={status !== 'idle'}
                className="key-input"
              />
            </div>

            <div>
              <label className="key-label" style={{ marginBottom: 6, display: 'block' }}>Bericht</label>
              <textarea
                required
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="Schrijf je bericht hier..."
                disabled={status !== 'idle'}
                rows={5}
                className="key-input"
                style={{ resize: 'none', height: 'auto' }}
              />
            </div>

            {status === 'error' && (
              <div className="info-banner" style={{ borderColor: '#ef444466' }}>
                <p style={{ color: '#ef4444' }}>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status !== 'idle' || !name || !payload}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px 20px',
                fontSize: 14,
                background: status === 'success' ? '#22c55e' : undefined,
                opacity: (status !== 'idle' || !name || !payload) ? 0.5 : 1,
                cursor: (status !== 'idle' || !name || !payload) ? 'not-allowed' : 'pointer',
              }}
            >
              {status === 'idle' && <><Send className="w-4 h-4" /> Bericht versturen</>}
              {status === 'transmitting' && <><Loader2 className="w-4 h-4 animate-spin" /> Versturen...</>}
              {status === 'success' && <><CheckCircle2 className="w-4 h-4" /> Bericht verstuurd!</>}
              {status === 'error' && <><Send className="w-4 h-4" /> Opnieuw proberen</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
