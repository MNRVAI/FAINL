import { FC, useState } from 'react';
import { Key, Eye, EyeOff, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { AppConfig } from '../types';

interface ApiKeysPageProps {
  config: AppConfig;
  onSave: (partial: Partial<AppConfig>) => void;
}

const PROVIDERS = [
  { key: 'googleKey' as keyof AppConfig, label: 'Google Gemini', url: 'https://aistudio.google.com/app/apikey', placeholder: 'AIza...' },
  { key: 'openaiKey' as keyof AppConfig, label: 'OpenAI', url: 'https://platform.openai.com/api-keys', placeholder: 'sk-...' },
  { key: 'anthropicKey' as keyof AppConfig, label: 'Anthropic Claude', url: 'https://console.anthropic.com/settings/keys', placeholder: 'sk-ant-...' },
  { key: 'groqKey' as keyof AppConfig, label: 'Groq', url: 'https://console.groq.com/keys', placeholder: 'gsk_...' },
  { key: 'deepseekKey' as keyof AppConfig, label: 'DeepSeek', url: 'https://platform.deepseek.com/api_keys', placeholder: 'sk-...' },
  { key: 'mistralKey' as keyof AppConfig, label: 'Mistral AI', url: 'https://console.mistral.ai/api-keys/', placeholder: 'xxx...' },
  { key: 'openRouterKey' as keyof AppConfig, label: 'OpenRouter', url: 'https://openrouter.ai/keys', placeholder: 'sk-or-...' },
];

export const ApiKeysPage: FC<ApiKeysPageProps> = ({ config, onSave }) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(PROVIDERS.map(p => [p.key, (config[p.key] as string) ?? '']))
  );
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(values as Partial<AppConfig>);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasAnyKey = PROVIDERS.some(p => values[p.key]?.trim());

  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <Key className="w-3.5 h-3.5" />
          API Sleutels
        </div>
        <h1 className="page-title">API Sleutels</h1>
        <p className="page-sub">Verbind FAINL met jouw eigen AI-provider accounts. Sleutels worden alleen lokaal opgeslagen — nooit op onze servers.</p>
      </div>

      {/* Security note */}
      <div className="info-banner">
        <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--ink-3)' }} />
        <p>Jouw sleutels verlaten <strong>nooit</strong> jouw browser. Ze worden versleuteld opgeslagen in <code>localStorage</code>.</p>
      </div>

      {/* Keys form */}
      <div className="keys-grid">
        {PROVIDERS.map(({ key, label, url, placeholder }) => {
          const val = values[key] ?? '';
          const isSet = val.trim().length > 0;
          const show = visible[key];
          return (
            <div key={key} className="key-card">
              <div className="key-card-header">
                <div>
                  <span className="key-label">{label}</span>
                  {isSet && (
                    <span className="key-badge-set">
                      <Check className="w-3 h-3" /> Ingesteld
                    </span>
                  )}
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="key-docs-link" title="Sleutel aanmaken">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="key-input-wrap">
                <input
                  type={show ? 'text' : 'password'}
                  className="key-input"
                  placeholder={placeholder}
                  value={val}
                  onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  className="key-eye-btn"
                  onClick={() => setVisible(v => ({ ...v, [key]: !v[key] }))}
                  type="button"
                  title={show ? 'Verbergen' : 'Tonen'}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          className={saved ? 'btn-success' : 'btn-primary'}
          onClick={handleSave}
          style={{ minWidth: 140 }}
        >
          {saved ? <><Check className="w-4 h-4" /> Opgeslagen!</> : 'Sleutels opslaan'}
        </button>
      </div>

      {/* CTA when no keys */}
      {!hasAnyKey && (
        <div className="page-cta" style={{ marginTop: 32 }}>
          <Key className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ink-3)' }} />
          <h2 className="page-cta-title">Nog geen sleutels?</h2>
          <p className="page-cta-text">
            Start met Google Gemini — die biedt een <strong>gratis tier</strong> die je meteen kunt gebruiken zonder betaalgegevens.
          </p>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
            className="btn-primary" style={{ margin: '12px auto 0', display: 'inline-flex', textDecoration: 'none' }}>
            Google AI Studio openen <ExternalLink className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      )}
    </div>
  );
};
