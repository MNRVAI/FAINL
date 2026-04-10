
import { useState, useEffect, FC } from 'react';
import {
  X, Key, Plus, Trash2, Zap, Settings, Shield, Loader2,
  CheckCircle, AlertCircle, RefreshCw, Database, Download, Upload,
  Wand2, HelpCircle, ChevronDown
} from 'lucide-react';
import { AppConfig, CouncilMember, ModelProvider, SessionState } from '../types';
import { DEFAULT_COUNCIL, PRESETS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  history?: SessionState[];
  onImportHistory?: (history: SessionState[]) => void;
  onVerifyKey?: (provider: ModelProvider, key: string) => Promise<boolean>;
}

const IDENTITY_PRESETS = [
  { name: "Logic Node", prompt: "You are a purely logical node. Analyze the input for factual accuracy and logical consistency. Prioritize data over intuition." },
  { name: "Creative Muse", prompt: "You are a creative node. Generate novel ideas, metaphors, and think outside the box. Prioritize innovation over convention." },
  { name: "Security Auditor", prompt: "You are a security auditor. Analyze the input for vulnerabilities, safety risks, and potential exploits. Prioritize safety and robustness." },
  { name: "Ethical Guardian", prompt: "You are an ethical guardian. Evaluate the input for moral implications, bias, and alignment with human values. Prioritize ethics." },
  { name: "Devil's Advocate", prompt: "You are a devil's advocate. Challenge assumptions, offer counter-arguments, and stress-test the proposition. Prioritize critical analysis." },
  { name: "Synthesizer", prompt: "You are a synthesis node. Integrate diverse viewpoints into a cohesive whole. Prioritize harmony and completeness." },
];

export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  history = [],
  onImportHistory,
  onVerifyKey
}) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'members' | 'overview' | 'storage'>('overview');
  const [tempConfig, setTempConfig] = useState<AppConfig>(() => JSON.parse(JSON.stringify(config)));
  const [verifyingKey, setVerifyingKey] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<Record<string, 'success' | 'error' | null>>({});

  useEffect(() => {
    if (isOpen) {
      setTempConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleMemberChange = (index: number, field: keyof CouncilMember, value: any) => {
    const newMembers = [...tempConfig.activeCouncil];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTempConfig({ ...tempConfig, activeCouncil: newMembers });
  };

  const regenerateAvatar = (index: number) => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    handleMemberChange(index, 'avatar', newAvatarUrl);
  };

  const handleAvatarUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleMemberChange(index, 'avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentityPreset = (index: number, presetName: string) => {
    const preset = IDENTITY_PRESETS.find(p => p.name === presetName);
    if (preset) {
      handleMemberChange(index, 'name', preset.name);
      handleMemberChange(index, 'systemPrompt', preset.prompt);
    }
  };

  const removeMember = (index: number) => {
    const newMembers = tempConfig.activeCouncil.filter((_, i) => i !== index);
    setTempConfig({ ...tempConfig, activeCouncil: newMembers });
  };

  const addMember = () => {
    const newMember: CouncilMember = {
      ...DEFAULT_COUNCIL[0],
      id: `node-${Date.now()}`,
      name: "New Member",
      role: 'MEMBER',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
    };
    setTempConfig({ ...tempConfig, activeCouncil: [...tempConfig.activeCouncil, newMember] });
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setTempConfig({
      ...tempConfig,
      activeCouncil: preset.members as CouncilMember[],
      chairmanId: preset.chairman.id
    });
  };

  const handleKeyChange = (key: keyof AppConfig, value: string) => {
    setTempConfig({ ...tempConfig, [key]: value });
  };

  const handleExport = () => {
    const data = { config: tempConfig, history, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fainl-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.config) setTempConfig(data.config);
        if (data.history && onImportHistory) onImportHistory(data.history);
      } catch(err) {
        alert('Import failed: invalid file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const testKey = async (provider: ModelProvider, configKey: string) => {
    if (!onVerifyKey) return;
    const value = (tempConfig as any)[configKey];
    if (!value) return;

    setVerifyingKey(configKey);
    const result = await onVerifyKey(provider, value);
    setVerificationResults(prev => ({ ...prev, [configKey]: result ? 'success' : 'error' }));
    setVerifyingKey(null);
  };

  const validateApiKey = (key: string, providerKey: string) => {
    if (!key) return null;

    const patterns: Record<string, RegExp> = {
      googleKey: /^AIza[a-zA-Z0-9_-]{35}$/,
      openaiKey: /^sk-[a-zA-Z0-9]{32,}$/,
      anthropicKey: /^sk-ant-[a-zA-Z0-9_-]+$/,
      groqKey: /^gsk_[a-zA-Z0-9]{32,}$/,
      deepseekKey: /^sk-[0-9a-f]{32}$/,
      openRouterKey: /^sk-or-v1-[a-zA-Z0-9]{64}$/
    };

    if (patterns[providerKey]) {
      return patterns[providerKey].test(key);
    }

    return key.length > 20;
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Council Members' },
    { id: 'keys', label: 'API Keys' },
    { id: 'storage', label: 'Data & Storage' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 md:p-8">
      <div className="glass-card card-shadow rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent shrink-0" />

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 md:px-7 md:py-5 border-b border-zinc-100 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/15">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">Settings</h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Configure your council and API keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close settings"
            aria-label="Close settings"
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-100 dark:border-white/[0.06] overflow-x-auto hide-scrollbar shrink-0 px-5 md:px-7 gap-1 pt-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-zinc-800 dark:text-zinc-200 border-zinc-800 bg-zinc-100 dark:bg-zinc-1000/10'
                  : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 bg-zinc-50/50 dark:bg-black/20">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5 max-w-5xl mx-auto">
              <div className="glass-card card-shadow rounded-2xl p-5 md:p-7">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent rounded-t-2xl" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Default Configuration</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
                  FAINL runs your question through multiple AI models simultaneously and synthesizes one authoritative answer. By default, three council members are active using the Google Gemini free tier — no API key required to get started.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 gap-3">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Council active — ready to analyze</span>
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-500 text-white font-semibold text-[10px] rounded-full">Active</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(preset)}
                    className="group text-left glass-card card-shadow hover:card-shadow-hover p-4 rounded-xl transition-all hover:scale-[1.01] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-800 dark:group-hover:text-zinc-500 transition-colors">
                        {preset.name}
                      </span>
                      <Settings className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-700 transition-colors" />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DATA & STORAGE TAB */}
          {activeTab === 'storage' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="glass-card card-shadow rounded-2xl p-7 md:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Export & Import</h3>
                <p className="max-w-md mx-auto text-sm text-zinc-500 dark:text-zinc-400 mb-7 leading-relaxed">
                  Export your settings, council configuration, and session history as a JSON file. Import a previous export to restore everything.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
                  <button
                    onClick={handleExport}
                    className="btn-violet w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  <label className="w-full py-3 glass-card card-shadow rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:card-shadow-hover transition-all text-zinc-700 dark:text-zinc-300">
                    <Upload className="w-4 h-4" />
                    Import Data
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'keys' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="glass-card card-shadow rounded-2xl p-5 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
                <div className="flex items-center gap-2.5 mb-2">
                  <Key className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">API Keys</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                  Google Gemini is set up by default. Add more API keys to expand your council with additional AI models. Keys are stored only in your browser — we never see them.
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Google Gemini", key: 'googleKey', provider: ModelProvider.GOOGLE, url: "https://aistudio.google.com/app/apikey", desc: "Default model. Free tier available — great to get started." },
                    { label: "Groq", key: 'groqKey', provider: ModelProvider.GROQ, url: "https://console.groq.com/keys", desc: "Ultra-fast inference. Great for snappy, high-volume sessions." },
                    { label: "DeepSeek", key: 'deepseekKey', provider: ModelProvider.DEEPSEEK, url: "https://platform.deepseek.com/api_keys", desc: "Strong at math, coding, and complex logical reasoning." },
                    { label: "Anthropic Claude", key: 'anthropicKey', provider: ModelProvider.ANTHROPIC, url: "https://console.anthropic.com/settings/keys", desc: "Best for nuanced, ethical, and long-form analysis." },
                    { label: "OpenAI GPT", key: 'openaiKey', provider: ModelProvider.OPENAI, url: "https://platform.openai.com/api-keys", desc: "Highly reliable with broad general knowledge coverage." },
                    { label: "OpenRouter", key: 'openRouterKey', provider: ModelProvider.OPENROUTER, url: "https://openrouter.ai/keys", desc: "Access 100+ specialized models through a single key." }
                  ].map((field) => {
                    const value = (tempConfig as any)[field.key] || '';
                    const isValid = validateApiKey(value, field.key);
                    const isVerifying = verifyingKey === field.key;
                    const verifyStatus = verificationResults[field.key];

                    return (
                      <div key={field.key} className="p-4 bg-zinc-50 dark:bg-white/[0.03] rounded-xl border border-zinc-100 dark:border-white/[0.06] flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">{field.label}</label>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{field.desc}</p>
                          </div>
                          <a
                            href={field.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:underline whitespace-nowrap"
                          >
                            Get key →
                          </a>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <input
                              type="password"
                              value={value}
                              onChange={(e) => handleKeyChange(field.key as keyof AppConfig, e.target.value)}
                              placeholder="••••••••••••••••••••••••"
                              className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all text-zinc-900 dark:text-zinc-100 ${
                                verifyStatus === 'success' || isValid === true
                                  ? 'border-emerald-400/60'
                                  : verifyStatus === 'error' || isValid === false
                                  ? 'border-red-400/60'
                                  : 'border-zinc-200 dark:border-white/10'
                              }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {verifyStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                              {verifyStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                              {(!verifyStatus && isValid === true) && <CheckCircle className="w-4 h-4 text-emerald-500/40" />}
                              {(!verifyStatus && isValid === false) && <AlertCircle className="w-4 h-4 text-red-500/40" />}
                            </div>
                          </div>
                          <button
                            onClick={() => testKey(field.provider, field.key)}
                            disabled={!value || isVerifying}
                            className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center min-w-[80px] bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* COUNCIL MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Council Members</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Customize each AI member's name, provider, and behavior.</p>
                </div>
                <button
                  onClick={addMember}
                  className="btn-violet w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {tempConfig.activeCouncil.map((member: CouncilMember, idx: number) => (
                  <div key={idx} className="glass-card card-shadow rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
                    <div className="flex flex-col md:flex-row items-start gap-5">

                      {/* Avatar Section */}
                      <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto shrink-0">
                        <div className={`w-14 h-14 rounded-xl border border-zinc-200 dark:border-white/10 ${member.color} overflow-hidden bg-zinc-50 dark:bg-zinc-800 relative group/avatar`}>
                          <img src={member.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer p-1.5 bg-white rounded-lg hover:scale-110 transition-transform" title="Upload image">
                              <Upload className="w-3.5 h-3.5 text-black" />
                              <input type="file" aria-label="Upload avatar image" className="hidden" accept="image/*" onChange={(e) => handleAvatarUpload(idx, e)} />
                            </label>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full md:w-20">
                          <button
                            onClick={() => regenerateAvatar(idx)}
                            className="text-xs font-medium bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 px-2 py-1.5 rounded-lg hover:border-zinc-300/40 hover:text-zinc-800 dark:hover:text-zinc-500 transition-all flex items-center justify-center gap-1.5 w-full"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Random
                          </button>
                          <button
                            className="text-xs font-medium bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600 px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 w-full opacity-40 cursor-not-allowed"
                            title="AI generation coming soon"
                            disabled
                          >
                            <Wand2 className="w-3 h-3" />
                            Generate
                          </button>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div>
                          <label htmlFor={`member-name-${idx}`} className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block">Name</label>
                          <div className="relative">
                            <input
                              id={`member-name-${idx}`}
                              placeholder="Member name"
                              value={member.name}
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all pr-8"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <select
                                onChange={(e) => handleIdentityPreset(idx, e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Select role preset"
                                aria-label="Select role preset"
                                value=""
                              >
                                <option value="" disabled>Select preset</option>
                                {IDENTITY_PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`member-provider-${idx}`} className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                            AI Provider
                            <div className="group/tip relative">
                              <HelpCircle className="w-3 h-3 cursor-help text-zinc-400" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-zinc-900 text-white text-[11px] rounded-xl hidden group-hover/tip:block z-10 normal-case font-normal leading-relaxed shadow-xl">
                                Select which AI model powers this council member. Different providers offer varying reasoning styles and speeds.
                              </div>
                            </div>
                          </label>
                          <select
                            id={`member-provider-${idx}`}
                            title="Select provider"
                            value={member.provider}
                            onChange={(e) => handleMemberChange(idx, 'provider', e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                          >
                            {Object.values(ModelProvider).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                          <label htmlFor={`member-url-${idx}`} className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                            Custom Endpoint (Base URL)
                            <div className="group/etip relative">
                              <HelpCircle className="w-3 h-3 cursor-help text-zinc-400" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-zinc-900 text-white text-[11px] rounded-xl hidden group-hover/etip:block z-10 normal-case font-normal leading-relaxed shadow-xl">
                                Optional: override the default API endpoint. Useful for local models (e.g., Ollama) or custom proxies.
                              </div>
                            </div>
                          </label>
                          <input
                            id={`member-url-${idx}`}
                            value={member.baseUrl || ''}
                            onChange={(e) => handleMemberChange(idx, 'baseUrl', e.target.value)}
                            placeholder="e.g., http://localhost:11434/v1"
                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                          <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor={`member-prompt-${idx}`} className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">System Prompt</label>
                            <button className="flex items-center gap-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:underline opacity-50 cursor-not-allowed" disabled>
                              <Wand2 className="w-3 h-3" /> Enhance with AI
                            </button>
                          </div>
                          <textarea
                            id={`member-prompt-${idx}`}
                            placeholder="Custom instructions for this council member..."
                            value={member.systemPrompt || ''}
                            onChange={(e) => handleMemberChange(idx, 'systemPrompt', e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all resize-none min-h-[80px]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => removeMember(idx)}
                        title="Remove member"
                        aria-label="Remove council member"
                        className="p-2 text-zinc-300 dark:text-zinc-700 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 md:px-7 border-t border-zinc-100 dark:border-white/[0.06] flex flex-col-reverse sm:flex-row justify-end gap-3 items-center shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(tempConfig); onClose(); }}
            className="btn-violet w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
