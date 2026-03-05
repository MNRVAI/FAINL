
import { useState, useEffect, FC } from 'react';
import { 
  X, Save, Key, Plus, Trash2, Zap, Settings, Shield, Loader2, 
  CheckCircle, AlertCircle, RefreshCw, Database, Download, Upload, Lock,
  Wand2, HelpCircle, Image as ImageIcon, ChevronDown
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
      name: "Agent Node",
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
    a.download = `fainl-vault-${new Date().toISOString().split('T')[0]}.json`;
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
            alert('Vault import failed: Invalid format.');
        }
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl md:rounded-[2rem] w-full max-w-5xl h-[85vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 md:px-8 md:py-5 border-b-4 border-black/10 dark:border-white/10 bg-transparent">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="bg-black dark:bg-white p-2 md:p-2.5 rounded-xl shadow-lg">
               <Shield className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-black" />
             </div>
             <div>
               <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter leading-none text-black dark:text-white">Control Center</h2>
               <p className="text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.25em] mt-1">FAINL Protocol Architecture</p>
             </div>
          </div>
          <button onClick={onClose} title="Close settings" aria-label="Close settings" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-black dark:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'Protocol Settings' },
            { id: 'members', label: 'Council Nodes' },
            { id: 'keys', label: 'Neural Credentials' },
            { id: 'storage', label: 'Data Vault' }
          ].map((tab) => (
             <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-4 py-3 md:px-6 md:py-3.5 font-black text-[9px] whitespace-nowrap transition-all uppercase tracking-[0.25em] flex-1 ${activeTab === tab.id ? 'bg-white dark:bg-zinc-900 text-black dark:text-white border-b-4 border-black dark:border-white -mb-0.5 shadow-[inset_0_4px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_4px_0_rgba(255,255,255,0.05)]' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border-b-4 border-transparent'}`}
           >
             {tab.label}
           </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-50 dark:bg-zinc-950">
          {activeTab === 'overview' && (
            <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white">
                <h3 className="text-base md:text-lg font-black mb-2 md:mb-4 uppercase tracking-tighter border-b-2 border-black/5 dark:border-white/5 pb-3 text-black dark:text-white">Standard Consensus Architecture</h3>
                <p className="text-xs text-black/60 dark:text-white/60 font-medium leading-relaxed mb-3 md:mb-5">
                  FAINL uses a multi-node consensus protocol to validate intelligence directives. By default, three secure neural nodes are active using the standard encrypted link.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/5 dark:bg-white/5 p-3 md:p-4 rounded-lg border border-black/10 dark:border-white/10 gap-3">
                   <div className="flex items-center gap-3">
                     <Zap className="w-4 h-4 text-black dark:text-white" />
                     <span className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-black dark:text-white">Protocol Status: High Integrity</span>
                   </div>
                   <div className="px-3 py-1 bg-green-500 text-white font-black text-[8px] uppercase tracking-widest rounded-full">Active</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {PRESETS.map((preset, idx) => (
                  <button 
                    key={idx}
                    onClick={() => loadPreset(preset)}
                    className="text-left p-4 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-xl hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] dark:hover:shadow-[6px_6px_0px_1px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black uppercase tracking-widest text-xs group-hover:underline text-black dark:text-white">{preset.name}</span>
                      <Settings className="w-4 h-4 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[10px] text-black/50 dark:text-white/50 font-bold leading-relaxed">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto text-center">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white">
                <Database className="w-10 h-10 md:w-14 md:h-14 text-black dark:text-white mb-4 md:mb-5 mx-auto" />
                <h3 className="text-lg md:text-2xl font-black uppercase mb-2 tracking-tighter text-black dark:text-white">Data Vault</h3>
                <p className="max-w-xl mx-auto text-xs text-black/50 dark:text-white/50 font-bold mb-5 md:mb-8 leading-relaxed tracking-[0.08em]">
                  Export or import your local mission configurations, active node setups, and credentials as an encrypted JSON vault.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto">
                  <button onClick={handleExport} className="w-full py-3 md:py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                    <Download className="w-4 h-4" /> Download Vault
                  </button>
                  <label className="w-full py-3 md:py-4 bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-xl font-black uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all cursor-pointer text-black dark:text-white">
                    <Upload className="w-4 h-4" />
                    <span>Restore Vault</span>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-4 md:space-y-5 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-xl md:rounded-2xl border-2 border-black/10 dark:border-white/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_0px_1px_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-black/10 dark:border-white/10 pb-3 text-black dark:text-white">
                  <Key className="w-5 h-5 text-black dark:text-white" />
                  <h3 className="font-black text-base md:text-lg uppercase tracking-tighter text-black dark:text-white">Identity Credentials</h3>
                </div>
                
                <p className="text-[9px] md:text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-4 leading-loose">
                  Primary Node (Google) is automatically linked. To expand the council with more advanced nodes, provide additional API credentials below.
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Primary Neural Link (Google Gemini)", key: 'googleKey', provider: ModelProvider.GOOGLE, url: "https://aistudio.google.com/app/apikey", desc: "Powers the main consensus engine. Required for baseline operation." },
                    { label: "High-Speed Logic (Groq)", key: 'groqKey', provider: ModelProvider.GROQ, url: "https://console.groq.com/keys", desc: "Instant response times. Excellent for fast-paced debate turns." },
                    { label: "Reasoning Deep-Link (DeepSeek)", key: 'deepseekKey', provider: ModelProvider.DEEPSEEK, url: "https://platform.deepseek.com/api_keys", desc: "Superior for complex mathematical and logical synthesis." },
                    { label: "Advanced Semantic Link (Anthropic)", key: 'anthropicKey', provider: ModelProvider.ANTHROPIC, url: "https://console.anthropic.com/settings/keys", desc: "Highest conceptual integrity for ethical and nuanced prompts." },
                    { label: "Standard General Link (OpenAI)", key: 'openaiKey', provider: ModelProvider.OPENAI, url: "https://platform.openai.com/api-keys", desc: "High reliability and broad logic coverage." },
                    { label: "Universal Routing (OpenRouter)", key: 'openRouterKey', provider: ModelProvider.OPENROUTER, url: "https://openrouter.ai/keys", desc: "Access to 100+ specialized models via a single protocol." }
                  ].map((field) => {
                    const value = (tempConfig as any)[field.key] || '';
                    const isValid = validateApiKey(value, field.key);
                    const isVerifying = verifyingKey === field.key;
                    const verifyStatus = verificationResults[field.key];
                    
                    return (
                      <div key={field.key} className="p-3 md:p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border-2 border-black/5 dark:border-white/5 flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                           <div>
                              <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-black/80 dark:text-white/80 mb-1">{field.label}</label>
                              <p className="text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">{field.desc}</p>
                           </div>
                           <a href={field.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-black dark:text-white hover:opacity-50 transition-opacity whitespace-nowrap bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                             Get Key <Download className="w-2.5 h-2.5 rotate-[270deg]" />
                           </a>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <input
                              type="password"
                              value={value}
                              onChange={(e) => handleKeyChange(field.key as keyof AppConfig, e.target.value)}
                              placeholder="••••••••••••••••••••••••"
                              className={`w-full bg-white dark:bg-zinc-900 border-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none transition-all text-black dark:text-white ${verifyStatus === 'success' || isValid === true ? 'border-green-500' : verifyStatus === 'error' || isValid === false ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {verifyStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {verifyStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                              {(!verifyStatus && isValid === true) && <CheckCircle className="w-4 h-4 text-green-500/30" />}
                              {(!verifyStatus && isValid === false) && <AlertCircle className="w-4 h-4 text-red-500/30" />}
                            </div>
                          </div>
                          <button 
                            onClick={() => testKey(field.provider, field.key)}
                            disabled={!value || isVerifying}
                            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-[0.25em] transition-all flex items-center justify-center min-w-[100px] ${isVerifying ? 'bg-zinc-100 dark:bg-zinc-800 text-black/20 dark:text-white/20' : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg'}`}
                          >
                            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6 md:space-y-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black/10 dark:border-white/10 pb-4 md:pb-6 gap-4">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-black dark:text-white">Council Nodes</h3>
                <button onClick={addMember} className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-[9px] uppercase tracking-[0.25em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Initialize Node
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:gap-10">
                {tempConfig.activeCouncil.map((member: CouncilMember, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border-2 border-black/10 dark:border-white/10 flex flex-col gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[2px_2px_0px_1px_rgba(255,255,255,0.05)] relative text-black dark:text-white">
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
                      
                      {/* Avatar Section */}
                      <div className="flex flex-row md:flex-col items-center gap-4 w-full md:w-auto">
                        <div className={`w-16 h-16 rounded-xl border-2 border-black dark:border-white/20 ${member.color} overflow-hidden bg-zinc-50 dark:bg-zinc-800 shadow-inner shrink-0 relative group/avatar`}>
                           <img src={member.avatar} alt="Avatar" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer p-2 bg-white rounded-full hover:scale-110 transition-transform" title="Upload Image">
                                <Upload className="w-4 h-4 text-black" />
                                 <input type="file" aria-label="Upload avatar image" className="hidden" accept="image/*" onChange={(e) => handleAvatarUpload(idx, e)} />
                              </label>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <button onClick={() => regenerateAvatar(idx)} className="text-[9px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 w-full">
                            <RefreshCw className="w-3 h-3" />
                            Random
                          </button>
                          <button className="text-[9px] font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 w-full opacity-50 cursor-not-allowed" title="AI Generation coming soon">
                            <Wand2 className="w-3 h-3" />
                            Generate
                          </button>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full">
                        <div>
                          <label htmlFor={`member-name-${idx}`} className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 block">Neural Identity</label>
                          <div className="relative">
                            <input 
                              id={`member-name-${idx}`} 
                              placeholder="Member Name" 
                              value={member.name} 
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)} 
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest text-black dark:text-white pr-7 outline-none focus:bg-white dark:focus:bg-zinc-700 transition-all" 
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                               <select 
                                 onChange={(e) => handleIdentityPreset(idx, e.target.value)}
                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                 title="Select identity preset"
                                 aria-label="Select identity preset"
                                 value=""
                               >
                                 <option value="" disabled>Select Preset</option>
                                 {IDENTITY_PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                               </select>
                               <ChevronDown className="w-4 h-4 text-black/30 dark:text-white/30 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`member-provider-${idx}`} className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            Logic Provider
                            <div className="group/provider-tip relative">
                              <HelpCircle className="w-3 h-3 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-[9px] rounded hidden group-hover/provider-tip:block z-10 normal-case tracking-normal font-medium">
                                Select the underlying AI model architecture. Different providers offer varying levels of reasoning capability and speed.
                              </div>
                            </div>
                          </label>
                          <select id={`member-provider-${idx}`} title="Select Provider" value={member.provider} onChange={(e) => handleMemberChange(idx, 'provider', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest cursor-pointer text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-700 transition-all">
                            {Object.values(ModelProvider).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <label htmlFor={`member-url-${idx}`} className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            Custom Endpoint (Base URL)
                            <div className="group/endpoint-tip relative">
                              <HelpCircle className="w-3 h-3 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black text-white text-[9px] rounded hidden group-hover/endpoint-tip:block z-10 normal-case tracking-normal font-medium">
                                Optional: Override the default API endpoint. Beneficial for using local models (e.g., Ollama) or proxies to route requests through specific gateways for privacy or caching.
                              </div>
                            </div>
                          </label>
                          <input 
                            id={`member-url-${idx}`}
                            value={member.baseUrl || ''} 
                            onChange={(e) => handleMemberChange(idx, 'baseUrl', e.target.value)} 
                            placeholder="e.g., http://localhost:11434/v1"
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-mono font-bold text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-700 transition-all" 
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <div className="flex justify-between items-center mb-2">
                            <label htmlFor={`member-prompt-${idx}`} className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] block">System Directive Instruction</label>
                            <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                              <Wand2 className="w-3 h-3" /> Enhance with AI
                            </button>
                          </div>
                          <textarea id={`member-prompt-${idx}`} placeholder="System prompt..." value={member.systemPrompt || ''} onChange={(e) => handleMemberChange(idx, 'systemPrompt', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-black/10 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-medium min-h-[80px] font-serif text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-700 transition-all resize-none block" />
                        </div>
                      </div>
                      <button onClick={() => removeMember(idx)} title="Remove Council Member" aria-label="Remove Council Member" className="p-2 text-black/10 dark:text-white/10 hover:text-black dark:hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 md:px-8 md:py-4 border-t-4 border-black/10 dark:border-white/10 bg-transparent flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={onClose} className="flex-1 md:flex-none px-5 py-2.5 md:px-8 md:py-3 font-black text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-all rounded-xl hover:bg-black/5 dark:hover:bg-white/5">Cancel</button>
            <button 
              onClick={() => { onSave(tempConfig); onClose(); }}
              className="flex-1 md:flex-none px-5 py-2.5 md:px-8 md:py-3 bg-black dark:bg-white text-white dark:text-black font-black text-[9px] uppercase tracking-[0.3em] rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Update Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
