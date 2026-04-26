/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  FAINL — Centrale UI Configuratie                        ║
 * ║  Alle visuele en tekstuele elementen op één plek beheren ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Dit is de single source of truth voor alle:
 *  - Iconen (Lucide icon-namen)
 *  - Labels & navigatieteksten (NL)
 *  - Provider kleurstellingen
 *  - Placeholder teksten
 *  - Avatar fallbacks
 *  - Knoppenopschriften
 */

import {
  LayoutDashboard, Cpu, Key, Database, Settings2,
  Shield, Zap, Brain, Globe, Code2, Lightbulb,
  Scale, Eye, AlertTriangle, Shuffle,
  LayoutGrid, BarChart3, MessageSquare, BookOpen,
  HelpCircle, Mail, User, LogOut, CreditCard,
  ChevronRight, Plus, Trash2, RefreshCw,
  Download, Upload, Lock, Server, Info,
  CheckCircle, AlertCircle, Loader2, ExternalLink,
} from 'lucide-react';

// ── Sidebar navigatie ─────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'HOME',     label: 'Home',          icon: LayoutGrid,    desc: 'Vraag stellen'              },
  { id: 'CHATS',    label: 'Antwoorden',    icon: MessageSquare, desc: 'Mijn antwoorden'            },
  { id: 'DEBATES',  label: 'Beraadslagen',  icon: Scale,         desc: 'Mijn beraadslagen'          },
  { id: 'PRICING',  label: 'Prijzen',       icon: CreditCard,    desc: 'Pakketten & credits'        },
  { id: 'COOKBOOK', label: 'Voorbeelden',   icon: BookOpen,      desc: 'Gebruiksscenario\'s'       },
  { id: 'ACCOUNT',  label: 'Account',       icon: User,          desc: 'Profiel & instellingen'    },
  { id: 'FAQ',      label: 'FAQ',           icon: HelpCircle,    desc: 'Veelgestelde vragen'        },
  { id: 'CONTACT',  label: 'Contact',       icon: Mail,          desc: 'Neem contact op'            },
  // Flyout-only items (niet in primaire nav):
  { id: 'NODES',    label: 'AI-Nodes',      icon: Cpu,           desc: 'Raadsleden configureren'   },
  { id: 'VERDICT',  label: 'Uitspraken',    icon: CheckCircle,   desc: 'Gegenereerde uitspraken'   },
] as const;

// ── Instellingen tabs ──────────────────────────────────────────────────────────
export const SETTINGS_TABS = [
  { id: 'overview', label: 'Overzicht',    icon: LayoutDashboard, desc: 'Configuratie & presets' },
  { id: 'members',  label: 'AI-Nodes',     icon: Cpu,             desc: 'Raadsleden beheren'     },
  { id: 'keys',     label: 'API-Sleutels', icon: Key,             desc: 'Providers koppelen'     },
  { id: 'storage',  label: 'Data & Opslag',icon: Database,        desc: 'Export & import'        },
] as const;

// ── Node rol-presets ────────────────────────────────────────────────────────────
export const NODE_ROLE_PRESETS = [
  { name: 'Logisch Analist',    icon: Brain,       prompt: 'Je bent een puur logisch knooppunt. Analyseer de invoer op feitelijke juistheid en logische consistentie. Geef prioriteit aan data boven intuïtie.' },
  { name: 'Creatieve Muse',     icon: Lightbulb,   prompt: 'Je bent een creatief knooppunt. Genereer nieuwe ideeën, metaforen en denk buiten de gebaande paden. Geef prioriteit aan innovatie boven conventie.' },
  { name: 'Beveiligingsaudit',  icon: Shield,       prompt: 'Je bent een beveiligingsauditor. Analyseer de invoer op kwetsbaarheden, veiligheidsrisico\'s en mogelijke exploits. Geef prioriteit aan veiligheid en robuustheid.' },
  { name: 'Ethisch Wachter',    icon: Scale,        prompt: 'Je bent een ethisch wachter. Evalueer de invoer op morele implicaties, vooroordelen en afstemming met menselijke waarden. Geef prioriteit aan ethiek.' },
  { name: 'Advocaat-Duivel',    icon: AlertTriangle,prompt: 'Je bent een duivelsadvocaat. Daag aannames uit, bied tegenargumenten en stress-test de propositie. Geef prioriteit aan kritische analyse.' },
  { name: 'Synthesizer',        icon: Shuffle,      prompt: 'Je bent een syntheseknooppunt. Integreer diverse standpunten tot een coherent geheel. Geef prioriteit aan harmonie en volledigheid.' },
] as const;

// ── Provider kleurmapping ──────────────────────────────────────────────────────
export const PROVIDER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Google':                     { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  'OpenAI':                     { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' },
  'Anthropic':                  { bg: '#fce4ec', text: '#880e4f', border: '#f48fb1' },
  'Groq':                       { bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
  'DeepSeek':                   { bg: '#e8eaf6', text: '#283593', border: '#9fa8da' },
  'Mistral AI':                 { bg: '#f3e5f5', text: '#6a1b9a', border: '#ce93d8' },
  'OpenRouter':                 { bg: '#e0f2f1', text: '#00695c', border: '#80cbc4' },
  'Ollama (Local)':             { bg: '#fafafa', text: '#424242', border: '#bdbdbd' },
  'Custom (OpenAI Compatible)': { bg: '#f5f5f5', text: '#616161', border: '#e0e0e0' },
};

// ── Avatar fallback emoji's per provider ──────────────────────────────────────
export const PROVIDER_AVATARS: Record<string, string> = {
  'Google (Direct)': '🧠',
  'OpenAI':          '🤖',
  'Anthropic':       '🌊',
  'Groq':            '⚡',
  'DeepSeek':        '🔍',
  'Mistral AI':      '💨',
  'OpenRouter':      '🌐',
  'Ollama (Local)':  '🦙',
  'Custom (OpenAI Compatible)': '⚙️',
  'default':         '🧩',
};

// ── API veld configuratie ──────────────────────────────────────────────────────
export const API_KEY_FIELDS = [
  {
    label:    'Google Gemini',
    key:      'googleKey',
    provider: 'Google (Direct)',
    url:      'https://aistudio.google.com/app/apikey',
    desc:     'Standaard model. Gratis tier beschikbaar.',
    badge:    'Gratis',
    pattern:  /^AIza[a-zA-Z0-9_-]{35}$/,
  },
  {
    label:    'Groq',
    key:      'groqKey',
    provider: 'Groq',
    url:      'https://console.groq.com/keys',
    desc:     'Ultra-snelle inferentie voor hoog volume.',
    badge:    null,
    pattern:  /^gsk_[a-zA-Z0-9]{32,}$/,
  },
  {
    label:    'DeepSeek',
    key:      'deepseekKey',
    provider: 'DeepSeek',
    url:      'https://platform.deepseek.com/api_keys',
    desc:     'Sterk in wiskunde, code en redenering.',
    badge:    null,
    pattern:  /^sk-[0-9a-f]{32}$/,
  },
  {
    label:    'Anthropic Claude',
    key:      'anthropicKey',
    provider: 'Anthropic',
    url:      'https://console.anthropic.com/settings/keys',
    desc:     'Genuanceerde, ethische en lange analyse.',
    badge:    null,
    pattern:  /^sk-ant-[a-zA-Z0-9_-]+$/,
  },
  {
    label:    'OpenAI GPT',
    key:      'openaiKey',
    provider: 'OpenAI',
    url:      'https://platform.openai.com/api-keys',
    desc:     'Betrouwbaar met brede algemene kennis.',
    badge:    null,
    pattern:  /^sk-[a-zA-Z0-9]{32,}$/,
  },
  {
    label:    'OpenRouter',
    key:      'openRouterKey',
    provider: 'OpenRouter',
    url:      'https://openrouter.ai/keys',
    desc:     'Toegang tot 100+ modellen via één sleutel.',
    badge:    null,
    pattern:  /^sk-or-v1-[a-zA-Z0-9]{64}$/,
  },
] as const;

// ── UI Labels (NL) ─────────────────────────────────────────────────────────────
export const UI_LABELS = {
  // Algemeen
  save:            'Wijzigingen opslaan',
  saved:           'Opgeslagen!',
  cancel:          'Annuleren',
  close:           'Sluiten',
  confirm:         'Bevestigen',
  loading:         'Laden...',
  error:           'Fout',
  success:         'Geslaagd',

  // Nodes
  addNode:         'Node toevoegen',
  removeNode:      'Node verwijderen',
  newAvatar:       'Nieuw avatar',
  uploadAvatar:    'Avatar uploaden',
  choosePreset:    'Kies rol-preset',
  nodeName:        'Node naam',
  nodeProvider:    'AI Provider',
  nodeModelId:     'Model ID',
  nodeBaseUrl:     'Base URL',
  nodePrompt:      'Systeemprompt',
  nodeRole:        'Rol',

  // Placeholder teksten
  ph_nodeName:     'Bijv. Analytisch Raadslid',
  ph_modelId:      'Bijv. gemini-3-flash-preview',
  ph_baseUrl:      'Bijv. http://localhost:11434/v1',
  ph_systemPrompt: 'Aangepaste instructies voor dit raadslid...',
  ph_apiKey:       '••••••••••••••••••••••••',

  // API sleutels
  verify:          'Verifiëren',
  verifying:       'Bezig...',
  verified:        'Geverifieerd',
  invalid:         'Ongeldig',
  getKey:          'Sleutel ophalen',
  localOnly:       'Lokaal opgeslagen',

  // Data
  exportData:      'Exporteer data',
  importData:      'Importeer data',
  sessionsStored:  'Sessies opgeslagen',
  councilMembers:  'Raadsleden',
  apiKeys:         'API-sleutels',

  // Status
  councilActive:   'Raad actief — klaar om te analyseren',
  activeNodes:     (n: number) => `${n} actieve node${n !== 1 ? 's' : ''}`,
  configuredKeys:  (n: number) => `${n} API-sleutel${n !== 1 ? 's' : ''} geconfigureerd`,
  versionLabel:    'v2.0 · Lokale opslag',
} as const;

// ── Icon exports (re-export voor gebruik in componenten) ──────────────────────
export const ICONS = {
  LayoutDashboard, Cpu, Key, Database, Settings2,
  Shield, Zap, Brain, Globe, Code2, Lightbulb,
  Scale, Eye, AlertTriangle, Shuffle,
  LayoutGrid, BarChart3, MessageSquare, BookOpen,
  HelpCircle, Mail, User, LogOut, CreditCard,
  ChevronRight, Plus, Trash2, RefreshCw,
  Download, Upload, Lock, Server, Info,
  CheckCircle, AlertCircle, Loader2, ExternalLink,
} as const;

// ── Kleur tokens (CSS variabelen) ─────────────────────────────────────────────
export const COLOR_TOKENS = {
  // Sidebar
  sidebarBg:       '#111111',
  sidebarText:     '#ffffff',
  sidebarMuted:    '#888888',
  sidebarActive:   '#ffffff',
  sidebarActiveBg: '#222222',

  // Content
  contentBg:       '#ffffff',
  contentBorder:   '#e8e8e8',
  contentText:     '#1a1a1a',
  contentMuted:    '#6b7280',

  // Accent
  accentGreen:     '#16a34a',
  accentRed:       '#dc2626',
  accentBlue:      '#2563eb',
} as const;
