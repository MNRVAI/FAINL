import { useState, useEffect, useRef, FC } from 'react';
import {
  X, Settings2, Shield, Loader2, ChevronDown,
  CheckCircle, AlertCircle, RefreshCw, Download, Upload,
  HelpCircle, Lock, Server, Eye, EyeOff, ExternalLink,
  Info, Plus, Trash2, Key, Database, LayoutDashboard, Cpu
} from 'lucide-react';
import { AppConfig, CouncilMember, ModelProvider, SessionState } from '../types';
import { DEFAULT_COUNCIL, PRESETS } from '../constants';
import { NODE_ROLE_PRESETS, API_KEY_FIELDS, UI_LABELS, PROVIDER_AVATARS, SETTINGS_TABS } from '../config/uiConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  history?: SessionState[];
  onImportHistory?: (history: SessionState[]) => void;
  onVerifyKey?: (provider: ModelProvider, key: string) => Promise<boolean>;
}

type Tab = 'overview' | 'members' | 'keys' | 'storage';
const TABS = SETTINGS_TABS as unknown as { id: Tab; label: string; icon: FC<any>; desc: string }[];

/* ── Kleine hulpcomponenten ─────────────────────────────────────── */
const SField: FC<{ label: string; hint?: string; children: React.ReactNode; span2?: boolean }> = ({ label, hint, children, span2 }) => (
  <div className={span2 ? 'sm-col-2' : ''}>
    <label className="sf-label">
      {label}
      {hint && (
        <span className="sf-hint-wrap" title={hint}>
          <HelpCircle className="sf-hint-icon" aria-hidden="true" />
        </span>
      )}
    </label>
    {children}
  </div>
);

/* ── Hoofd component ─────────────────────────────────────────────── */
export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen, onClose, config, onSave, history = [], onImportHistory, onVerifyKey
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [tempConfig, setTempConfig] = useState<AppConfig>(() => JSON.parse(JSON.stringify(config)));
  const [verifyingKey, setVerifyingKey] = useState<string | null>(null);
  const [verifyResults, setVerifyResults] = useState<Record<string, 'ok' | 'err' | null>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [saveFlash, setSaveFlash] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTempConfig(JSON.parse(JSON.stringify(config)));
  }, [isOpen, config]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ── handlers ── */
  const upd = (patch: Partial<AppConfig>) => setTempConfig(p => ({ ...p, ...patch }));
  const updMember = (i: number, field: keyof CouncilMember, val: any) => {
    const m = [...tempConfig.activeCouncil];
    m[i] = { ...m[i], [field]: val };
    upd({ activeCouncil: m });
  };
  const regenAvatar = (i: number) =>
    updMember(i, 'avatar', `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).slice(2)}`);
  const uploadAvatar = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onloadend = () => updMember(i, 'avatar', r.result as string);
    r.readAsDataURL(f);
  };
  const applyPreset = (i: number, name: string) => {
    const p = NODE_ROLE_PRESETS.find(x => x.name === name); if (!p) return;
    // Update both fields atomically to avoid stale-state overwrite
    const m = [...tempConfig.activeCouncil];
    m[i] = { ...m[i], name: p.name, systemPrompt: p.prompt };
    upd({ activeCouncil: m });
  };
  const addMember = () => {
    const m: CouncilMember = {
      ...DEFAULT_COUNCIL[0],
      id: `node-${Date.now()}`,
      name: 'Nieuw Raadslid',
      role: 'MEMBER',
      avatar: PROVIDER_AVATARS['default'],
      systemPrompt: '',
    };
    upd({ activeCouncil: [...tempConfig.activeCouncil, m] });
  };
  const removeMember = (i: number) => upd({ activeCouncil: tempConfig.activeCouncil.filter((_, j) => j !== i) });

  const testKey = async (provider: ModelProvider, cfgKey: string) => {
    if (!onVerifyKey) return;
    const val = (tempConfig as any)[cfgKey]; if (!val) return;
    setVerifyingKey(cfgKey);
    const ok = await onVerifyKey(provider, val);
    setVerifyResults(p => ({ ...p, [cfgKey]: ok ? 'ok' : 'err' }));
    setVerifyingKey(null);
  };

  const validateFormat = (key: string, cfgKey: string): boolean | null => {
    if (!key) return null;
    const pats: Record<string, RegExp> = {
      googleKey: /^AIza[a-zA-Z0-9_-]{35}$/,
      openaiKey: /^sk-[a-zA-Z0-9]{32,}$/,
      anthropicKey: /^sk-ant-[a-zA-Z0-9_-]+$/,
      groqKey: /^gsk_[a-zA-Z0-9]{32,}$/,
      deepseekKey: /^sk-[0-9a-f]{32}$/,
      openRouterKey: /^sk-or-v1-[a-zA-Z0-9]{64}$/,
    };
    return pats[cfgKey] ? pats[cfgKey].test(key) : key.length > 20;
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ config: tempConfig, history, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `fainl-export-${new Date().toISOString().split('T')[0]}.json` });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target?.result as string);
        if (d.config) setTempConfig(d.config);
        if (d.history && onImportHistory) onImportHistory(d.history);
      } catch { alert('Import mislukt: ongeldig bestandsformaat.'); }
    };
    r.readAsText(f); e.target.value = '';
  };

  const handleSave = () => {
    onSave(tempConfig);
    setSaveFlash(true);
    setTimeout(() => { setSaveFlash(false); onClose(); }, 600);
  };

  const activeCount = tempConfig.activeCouncil.length;
  const keyCount = API_KEY_FIELDS.filter(f => !!(tempConfig as any)[f.key]).length;

  /* ── Tab panels ── */
  const renderOverview = () => (
    <div className="sm-panel">
      {/* Status banner */}
      <div className="sm-status-banner">
        <div className="sm-status-left">
          <span className="sm-status-dot" aria-hidden="true" />
          <div>
            <p className="sm-status-title">Raad actief — klaar om te analyseren</p>
            <p className="sm-status-sub">{activeCount} actieve node{activeCount !== 1 ? 's' : ''} · {keyCount} API-sleutel{keyCount !== 1 ? 's' : ''} geconfigureerd</p>
          </div>
        </div>
        <span className="sm-badge-green">Actief</span>
      </div>

      {/* Info block */}
      <div className="sm-info-block">
        <Info className="sm-info-icon" aria-hidden="true" />
        <p className="sm-info-text">
          FAINL verwerkt je vraag via meerdere AI-modellen tegelijkertijd en synthetiseert één gezaghebbend antwoord.
          Standaard zijn drie raadsleden actief op de Google Gemini gratis tier — geen API-sleutel vereist.
        </p>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="sm-panel">
      {/* Snelle configuraties */}
      <div className="sm-section-title">Snelle configuraties</div>
      <div className="sm-preset-grid" style={{marginBottom: 8}}>
        {PRESETS.map((preset, i) => (
          <button
            key={i}
            className="sm-preset-card"
            onClick={() => setTempConfig(p => ({ ...p, activeCouncil: preset.members as CouncilMember[], chairmanId: preset.chairman.id }))}
            title={`Laad: ${preset.name}`}
          >
            <div className="sm-preset-header">
              <span className="sm-preset-name">{preset.name}</span>
              <Settings2 className="sm-preset-icon" aria-hidden="true" />
            </div>
            <p className="sm-preset-desc">{preset.description}</p>
          </button>
        ))}
      </div>

      <div className="sm-panel-hdr">
        <div>
          <h3 className="sm-panel-title">Actieve nodes</h3>
          <p className="sm-panel-sub">Pas naam, provider en gedrag aan per raadslid.</p>
        </div>
        <button className="sm-btn-primary" onClick={addMember} type="button">
          <Plus className="sm-btn-icon" aria-hidden="true" /> {UI_LABELS.addNode}
        </button>
      </div>

      <div className="sm-member-list">
        {tempConfig.activeCouncil.map((member, idx) => (
          <div key={idx} className="sm-member-card">
            {/* Avatar col */}
            <div className="sm-avatar-col">
              <div className="sm-avatar-wrap">
                {/* Handle both emoji strings and URL-based avatars */}
                {member.avatar?.startsWith('http') || member.avatar?.startsWith('data:')
                  ? <img src={member.avatar} alt={`Avatar van ${member.name}`} className="sm-avatar-img" />
                  : <span className="sm-avatar-emoji" aria-label={`Avatar van ${member.name}`}>{member.avatar}</span>
                }
                <label className="sm-avatar-upload" title="Avatar uploaden">
                  <Upload className="sm-avatar-upload-icon" aria-hidden="true" />
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e => uploadAvatar(idx, e)} aria-label="Avatar afbeelding uploaden" />
                </label>
              </div>
              <button className="sm-btn-ghost sm-btn-xs" onClick={() => regenAvatar(idx)} title="Willekeurige avatar">
                <RefreshCw className="sm-btn-icon-xs" aria-hidden="true" /> Nieuw
              </button>
            </div>

            {/* Fields */}
            <div className="sm-member-fields">
              {/* Naam + preset */}
              <div>
                <label className="sf-label">{UI_LABELS.nodeName}</label>
                <input
                  id={`mn-${idx}`}
                  value={member.name}
                  onChange={e => updMember(idx, 'name', e.target.value)}
                  placeholder={UI_LABELS.ph_nodeName}
                  className="sm-input"
                />
              </div>

              {/* Rol preset selector */}
              <div>
                <label className="sf-label">{UI_LABELS.choosePreset}</label>
                <select
                  className="sm-select"
                  defaultValue=""
                  onChange={e => { applyPreset(idx, e.target.value); (e.target as HTMLSelectElement).value = ''; }}
                  aria-label={UI_LABELS.choosePreset}
                >
                  <option value="" disabled>{UI_LABELS.choosePreset}</option>
                  {NODE_ROLE_PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              {/* Provider */}
              <div>
                <label className="sf-label">{UI_LABELS.nodeProvider}</label>
                <select
                  id={`mp-${idx}`}
                  value={member.provider}
                  onChange={e => updMember(idx, 'provider', e.target.value as ModelProvider)}
                  className="sm-select"
                  title={UI_LABELS.nodeProvider}
                >
                  {Object.values(ModelProvider).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Model ID */}
              <div>
                <label className="sf-label">{UI_LABELS.nodeModelId}</label>
                <input
                  id={`mid-${idx}`}
                  value={member.modelId || ''}
                  onChange={e => updMember(idx, 'modelId', e.target.value)}
                  placeholder={UI_LABELS.ph_modelId}
                  className="sm-input sm-mono"
                />
              </div>

              {/* Base URL */}
              <div style={{gridColumn:'1 / -1'}}>
                <label className="sf-label">
                  {UI_LABELS.nodeBaseUrl}
                  <HelpCircle className="sf-hint-icon" aria-label="Overschrijf de standaard API-endpoint. Handig voor lokale modellen of proxies." />
                </label>
                <input
                  id={`mu-${idx}`}
                  value={member.baseUrl || ''}
                  onChange={e => updMember(idx, 'baseUrl', e.target.value)}
                  placeholder={UI_LABELS.ph_baseUrl}
                  className="sm-input sm-mono"
                />
              </div>

              {/* Systeemprompt */}
              <div style={{gridColumn:'1 / -1'}}>
                <label className="sf-label">{UI_LABELS.nodePrompt}</label>
                <textarea
                  id={`msp-${idx}`}
                  value={member.systemPrompt || ''}
                  onChange={e => updMember(idx, 'systemPrompt', e.target.value)}
                  placeholder={UI_LABELS.ph_systemPrompt}
                  className="sm-textarea"
                />
              </div>
            </div>

            {/* Remove */}
            <button onClick={() => removeMember(idx)} className="sm-remove-btn" title="Node verwijderen" aria-label="Node verwijderen">
              <Trash2 className="sm-remove-icon" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKeys = () => (
    <div className="sm-panel">
      <div className="sm-panel-hdr">
        <div>
          <h3 className="sm-panel-title">API-Sleutels</h3>
          <p className="sm-panel-sub">Sleutels worden uitsluitend lokaal in je browser opgeslagen — wij zien ze nooit.</p>
        </div>
        <div className="sm-security-badge">
          <Lock className="sm-security-icon" aria-hidden="true" /> Lokaal opgeslagen
        </div>
      </div>

      <div className="sm-keys-list">
        {API_KEY_FIELDS.map(field => {
          const val = (tempConfig as any)[field.key] || '';
          const fmt = validateFormat(val, field.key);
          const verStatus = verifyResults[field.key];
          const isVerifying = verifyingKey === field.key;
          const isVis = visibleKeys[field.key];
          const hasVal = val.length > 0;

          return (
            <div key={field.key} className={`sm-key-row ${hasVal ? 'sm-key-row--filled' : ''}`}>
              <div className="sm-key-meta">
                <div className="sm-key-header">
                  <span className="sm-key-label">{field.label}</span>
                  {field.badge && <span className="sm-key-badge">{field.badge}</span>}
                  {verStatus === 'ok'  && <span className="sm-key-badge sm-key-badge--ok">Geverifieerd</span>}
                  {verStatus === 'err' && <span className="sm-key-badge sm-key-badge--err">Ongeldig</span>}
                </div>
                <p className="sm-key-desc">{field.desc}</p>
              </div>

              <div className="sm-key-input-row">
                <div className="sm-key-input-wrap">
                  <input
                    type={isVis ? 'text' : 'password'}
                    value={val}
                    onChange={e => upd({ [field.key]: e.target.value } as any)}
                    placeholder="••••••••••••••••••••••••"
                    className={`sm-key-input ${verStatus === 'ok' || fmt === true ? 'sm-key-input--ok' : verStatus === 'err' || fmt === false ? 'sm-key-input--err' : ''}`}
                    aria-label={`${field.label} API-sleutel`}
                  />
                  <div className="sm-key-icons">
                    {verStatus === 'ok'  && <CheckCircle className="sm-key-icon-ok"  aria-hidden="true" />}
                    {verStatus === 'err' && <AlertCircle className="sm-key-icon-err" aria-hidden="true" />}
                    <button className="sm-key-vis-btn" onClick={() => setVisibleKeys(p => ({ ...p, [field.key]: !p[field.key] }))} aria-label={isVis ? 'Sleutel verbergen' : 'Sleutel tonen'} title={isVis ? 'Verbergen' : 'Tonen'}>
                      {isVis ? <EyeOff className="sm-key-vis-icon" aria-hidden="true" /> : <Eye className="sm-key-vis-icon" aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                <div className="sm-key-actions">
                  <button onClick={() => testKey(field.provider as unknown as ModelProvider, field.key)} disabled={!val || isVerifying} className="sm-btn-outline sm-btn-sm" aria-label={`${field.label} sleutel verifiëren`}>
                    {isVerifying ? <Loader2 className="sm-spin" aria-hidden="true" /> : 'Verifiëren'}
                  </button>
                  <a href={field.url} target="_blank" rel="noopener noreferrer" className="sm-btn-ghost sm-btn-sm" title={`${field.label} sleutel ophalen`} aria-label={`${field.label} API-sleutel ophalen`}>
                    Sleutel <ExternalLink className="sm-ext-icon" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="sm-panel sm-panel--center">
      <div className="sm-storage-icon-wrap">
        <Database className="sm-storage-icon" aria-hidden="true" />
      </div>
      <h3 className="sm-storage-title">Export &amp; Import</h3>
      <p className="sm-storage-desc">
        Exporteer je instellingen, raadsconfiguratie en sessiegeschiedenis als JSON-bestand.
        Importeer een eerdere export om alles te herstellen.
      </p>

      <div className="sm-storage-stats">
        <div className="sm-stat">
          <span className="sm-stat-val">{history.length}</span>
          <span className="sm-stat-lbl">Sessies opgeslagen</span>
        </div>
        <div className="sm-stat">
          <span className="sm-stat-val">{tempConfig.activeCouncil.length}</span>
          <span className="sm-stat-lbl">Raadsleden</span>
        </div>
        <div className="sm-stat">
          <span className="sm-stat-val">{keyCount}</span>
          <span className="sm-stat-lbl">API-sleutels</span>
        </div>
      </div>

      <div className="sm-storage-actions">
        <button onClick={handleExport} className="sm-btn-primary">
          <Download className="sm-btn-icon" aria-hidden="true" /> Exporteer data
        </button>
        <label className="sm-btn-outline sm-btn-upload">
          <Upload className="sm-btn-icon" aria-hidden="true" /> Importeer data
          <input type="file" accept=".json" onChange={handleImport} style={{display:'none'}} aria-label="Databestand importeren" />
        </label>
      </div>

      <div className="sm-storage-note">
        <Shield className="sm-note-icon" aria-hidden="true" />
        Alle data wordt verwerkt in je browser. Er wordt niets naar onze servers gestuurd.
      </div>
    </div>
  );

  /* ── Render ── */
  return (
    <div className="sm-overlay" role="dialog" aria-modal="true" aria-labelledby="sm-title">
      <div className="sm-backdrop" ref={backdropRef} onClick={e => { if (e.target === backdropRef.current) onClose(); }} />

      <div className="sm-shell">
        {/* Sidebar */}
        <aside className="sm-sidebar" aria-label="Instellingen navigatie">
          <div className="sm-sidebar-brand">
            <div className="sm-sidebar-logo">
              <Settings2 className="sm-sidebar-logo-icon" aria-hidden="true" />
            </div>
            <div>
              <p className="sm-sidebar-brand-name">Instellingen</p>
              <p className="sm-sidebar-brand-sub">FAINL configuratie</p>
            </div>
          </div>

          <nav className="sm-sidebar-nav" aria-label="Instellingen secties">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`sm-nav-item ${activeTab === tab.id ? 'sm-nav-item--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon className="sm-nav-icon" aria-hidden="true" />
                  <div className="sm-nav-text">
                    <span className="sm-nav-label">{tab.label}</span>
                    <span className="sm-nav-desc">{tab.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="sm-sidebar-footer">
            <Server className="sm-sidebar-footer-icon" aria-hidden="true" />
            <span>v2.0 · Lokale opslag</span>
          </div>
        </aside>

        {/* Main content */}
        <div className="sm-main">
          {/* Top bar */}
          <div className="sm-topbar">
            <div>
              <h2 id="sm-title" className="sm-topbar-title">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="sm-topbar-sub">
                {TABS.find(t => t.id === activeTab)?.desc}
              </p>
            </div>
            <button className="sm-close-btn" onClick={onClose} aria-label="Instellingen sluiten" title="Sluiten">
              <X aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="sm-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'members'  && renderMembers()}
            {activeTab === 'keys'     && renderKeys()}
            {activeTab === 'storage'  && renderStorage()}
          </div>

          {/* Footer */}
          <div className="sm-footer">
            <button className="sm-btn-ghost" onClick={onClose}>Annuleren</button>
            <button className={`sm-btn-primary ${saveFlash ? 'sm-btn-primary--saved' : ''}`} onClick={handleSave}>
              {saveFlash ? <><CheckCircle className="sm-btn-icon" aria-hidden="true" /> Opgeslagen!</> : 'Wijzigingen opslaan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
