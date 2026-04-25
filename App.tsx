
import { useState, useRef, useEffect, FC } from 'react';
import { 
  Send, 
  Settings as SettingsIcon, 
  Users, 
  MessageSquare, 
  Gavel, 
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  AlertTriangle,
  Lock,
  Globe,
  CircleCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DEFAULT_COUNCIL, DEFAULT_CHAIRMAN, USAGE_LIMITS, PRICING } from './constants';
import { CouncilResponse, PeerReview, WorkflowStage, SessionState, AppConfig, ModelProvider, AppView } from './types';
import { UnifiedCouncilService } from './services/councilService';
import { SettingsModal } from './components/SettingsModal';
import { CouncilCard } from './components/CouncilCard';
import { PaywallModal } from './components/PaywallModal';
import { PricingPage } from './components/PricingPage';
import { AccountPage } from './components/AccountPage';
import { CookbookPage } from './components/CookbookPage';
import { FAQPage } from './components/FAQPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { DebateRoom } from './components/DebateRoom';
import { NodesPage } from './components/NodesPage';
import { ApiKeysPage } from './components/ApiKeysPage';
import { 
  Menu,
  X as CloseIcon,
  LayoutDashboard,
  Coins,
  BookOpen,
  HelpCircle,
  Mail,
  Zap as ZapIcon,
  Sun,
  Moon,
  Plus,
  History,
  Settings2,
  Swords,
  FileEdit,
  MoreHorizontal,
  CreditCard,
  Cpu,
  Key,
  ChevronDown,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { LoginPage } from './components/LoginPage';
import { Session } from '@supabase/supabase-js';
import { ScrambleText } from './components/ScrambleText';

import { WelcomePopup } from './components/WelcomePopup';
import { CookieBanner } from './components/CookieBanner';
import { OnboardingCard } from './components/OnboardingCard';


const FadingPlaceholder: FC<{ isFocused: boolean }> = ({ isFocused }: { isFocused: boolean }) => {
  const examples = [
    "Moet ik Rust of Go leren voor backend development?",
    "Is het beter om een huis te kopen of te huren?",
    "Wat zijn de voor- en nadelen van een vierdaagse werkweek?",
    "Is thuiswerken beter voor productiviteit dan op kantoor?",
    "Welke programmeertaal kies ik voor mijn volgende project?",
    "Wat is het sterkste argument voor een basisinkomen?"
  ];
  
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isFocused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % examples.length);
        setFade(true);
      }, 500); // Wait for fade out before changing text
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, [isFocused, examples.length]);

  if (isFocused) return null;

  return (
    <span className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {examples[index]}
    </span>
  );
};

const CyberLogo: FC<{ isAnimated?: boolean }> = () => {
  return (
    <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
      <Shield className="text-white dark:text-zinc-900 w-3.5 h-3.5" />
    </div>
  );
};
  
const App: FC = () => {
  // Initialization with Persistent Config
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('fainl_config_v2');
    return saved ? JSON.parse(saved) : {
      googleKey: '',
      openRouterKey: '',
      openaiKey: '',
      anthropicKey: '',
      deepseekKey: '',
      groqKey: '',
      mistralKey: '',
      customKey: '',
      mimoKey: '',
      devstralKey: '',
      katKey: '',
      olmoKey: '',
      nemotronKey: '',
      gemmaKey: '',
      glmKey: '',
      activeCouncil: DEFAULT_COUNCIL,
      chairmanId: DEFAULT_CHAIRMAN.id,
      turnsUsed: 0,
      creditsRemaining: 0,
      isLifetime: false,
    };
  });

  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fainl_theme') === 'dark' || 
        (!localStorage.getItem('fainl_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    localStorage.getItem('fainl_sidebar_collapsed') === 'true'
  );

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('fainl_sidebar_collapsed', String(next));
      return next;
    });
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggleSection = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('fainl_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView(AppView.HOME);
  };

  const [history, setHistory] = useState<SessionState[]>(() => {
    const saved = localStorage.getItem('fainl_history');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migrate: Ensure all sessions have an ID
      const migrated = parsed.map((s: any) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
        isArchived: !!s.isArchived
      }));
      return migrated;
    } catch (e) {
      return [];
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isDebateOpen, setIsDebateOpen] = useState(false);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  // ── Cookie consent ──────────────────────────────────────────────
  const [cookieConsent, setCookieConsent] = useState<{
    given: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }>(() => {
    const saved = localStorage.getItem('fainl_cookie_consent');
    if (saved) {
      try { return { given: true, ...JSON.parse(saved) }; } catch { /* fallthrough */ }
    }
    return { given: false, functional: false, analytics: false, marketing: false };
  });

  const saveConsent = (functional: boolean, analytics: boolean, marketing: boolean) => {
    const data = { functional, analytics, marketing };
    localStorage.setItem('fainl_cookie_consent', JSON.stringify(data));
    setCookieConsent({ given: true, ...data });
  };

  // ── Onboarding (shown after 2nd completed query) ─────────────────
  const [queryCount, setQueryCount] = useState(
    () => parseInt(localStorage.getItem('fainl_query_count') || '0', 10)
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  
  const [session, setSession] = useState<SessionState>({
    id: crypto.randomUUID(),
    stage: WorkflowStage.IDLE,
    query: '',
    councilResponses: [],
    debateMessages: [],
    reviews: [],
    synthesis: ''
  });


  const councilService = useRef(new UnifiedCouncilService(config));

  useEffect(() => {
    councilService.current = new UnifiedCouncilService(config);
    localStorage.setItem('fainl_config_v2', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('fainl_history', JSON.stringify(history));
  }, [history]);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const MAX_CHARS = 4000;

  const handleStart = async () => {
    if (!input.trim()) return;

    // Usage check
    const hasOwnKeys = config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey;
    const canUseCredits = hasOwnKeys && config.creditsRemaining > 0;
    const hasTurnsRemaining = config.turnsUsed < config.totalTurnsAllowed;
    const isAllowed = config.isLifetime || hasTurnsRemaining || canUseCredits;

    if (!isAllowed) {
      setIsPaywallOpen(true);
      return;
    }

    // Detect active nodes
    const readyMembers = councilService.current.getReadyMembers(config.activeCouncil);
    
    // Ensure we meet the minimum requirement for consensus logic
    if (readyMembers.length < 2) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: "Insufficient active nodes for consensus protocol. Minimum 2 nodes required."
      }));
      return;
    }

    setSession({
      id: crypto.randomUUID(),
      stage: WorkflowStage.PROCESSING_COUNCIL,
      query: input,
      councilResponses: [],
      debateMessages: [],
      reviews: [],
      synthesis: ''
    });

    // Increment query counter — show onboarding after 2nd query
    setQueryCount(prev => {
      const next = prev + 1;
      localStorage.setItem('fainl_query_count', String(next));
      if (next === 2 && localStorage.getItem('fainl_onboarding_seen') !== '1') {
        setTimeout(() => setIsOnboardingOpen(true), 1800);
      }
      return next;
    });

    try {
      // 1. Council Analysis Phase
      const responses = await councilService.current.getCouncilResponses(input, readyMembers);
      
      // Council done � stage stays at PROCESSING_COUNCIL until user opens debate
      setSession((prev: SessionState) => ({
        ...prev,
        councilResponses: responses,
        stage: WorkflowStage.COMPLETED,
        debateMessages: []
      }));

    } catch (err: any) {
      console.error(err);
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Autonomous consensus protocol interrupted."
      }));
    }
  };



  const handleEndDebate = async (debateMessages: import('./types').DebateMessage[]) => {
    setIsDebateOpen(false);

    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages,
      stage: WorkflowStage.SYNTHESIZING,
      synthesis: ''
    }));

    const readyMembers = councilService.current.getReadyMembers(config.activeCouncil);

    try {
      const synthesis = await councilService.current.synthesizeStream(
        session.query, 
        session.councilResponses, 
        [], // Skip peer reviews for now
        session.debateMessages,
        readyMembers,
        DEFAULT_CHAIRMAN,
        (chunk) => {
          setSession((prev: SessionState) => ({
            ...prev,
            synthesis: (prev.synthesis || '') + chunk
          }));
        }
      );

      setSession((prev: SessionState) => {
        const completedSession = { ...prev, synthesis, stage: WorkflowStage.COMPLETED };
        setHistory((h: SessionState[]) => [completedSession, ...h]);
        
        // Update Usage Tracking
        setConfig((current: AppConfig) => {
          const hasOwnKeys = current.googleKey || current.openaiKey || current.anthropicKey || current.groqKey || current.deepseekKey;
          if (hasOwnKeys && current.creditsRemaining > 0) {
            return {
              ...current,
              creditsRemaining: current.creditsRemaining - USAGE_LIMITS.CREDITS_PER_TURN
            };
          } else {
            return {
              ...current,
              turnsUsed: current.turnsUsed + 1
            };
          }
        });

        return completedSession;
      });
    } catch (err: any) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Synthesis failed."
      }));
    }
  };

  const handleAddDebateMessage = (msg: import('./types').DebateMessage) => {
    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages: [...prev.debateMessages, msg]
    }));
  };

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handlePurchase = async (type: 'turns' | 'credits', count: number | typeof Infinity) => {
    setIsPaymentLoading(true);
    try {
      const pkg = type === 'turns' 
        ? PRICING.TURNS.find(p => p.count === count)
        : PRICING.CREDITS.find(p => p.count === count);
      
      if (!pkg) throw new Error("Invalid package");

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: pkg.price,
          description: `FAINL Access: ${pkg.label}`,
          redirectUrl: `${window.location.origin}${window.location.pathname}?payment_confirm=true&type=${type}&count=${count}`,
          metadata: {
            type,
            count: count === Infinity ? 'infinity' : count,
            userId: authSession?.user?.id || 'anonymous'
          }
        }
      });

      if (error) throw error;
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      console.error("Payment initialization failed:", err);
      // Fallback to mock behavior if function is not deployed yet or fails
      // This allows the UI to still "work" during testing
      setTimeout(() => {
        if (type === 'turns') {
          setConfig(prev => ({
            ...prev,
            isLifetime: count === Infinity ? true : prev.isLifetime,
            totalTurnsAllowed: count === Infinity ? prev.totalTurnsAllowed : prev.totalTurnsAllowed + count
          }));
        } else {
          setConfig(prev => ({
            ...prev,
            creditsRemaining: prev.creditsRemaining + (count as number)
          }));
        }
        setIsPaywallOpen(false);
        setIsPaymentLoading(false);
        handleStart();
      }, 1000);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_confirm') === 'true') {
      const type = params.get('type');
      const countStr = params.get('count');
      const count = countStr === 'infinity' ? Infinity : parseInt(countStr || '0', 10);

      if (type === 'turns') {
        setConfig(prev => ({
          ...prev,
          isLifetime: count === Infinity ? true : prev.isLifetime,
          totalTurnsAllowed: count === Infinity ? prev.totalTurnsAllowed : prev.totalTurnsAllowed + count
        }));
      } else if (type === 'credits') {
        setConfig(prev => ({
          ...prev,
          creditsRemaining: prev.creditsRemaining + (count as number)
        }));
      }

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Primary sidebar navigation
  const SidebarPrimary = [
    { id: AppView.CHATS,   label: 'Mijn Gesprekken', icon: History },
    { id: AppView.NODES,   label: 'Mijn AI-Nodes',   icon: Cpu },
    { id: AppView.DEBATES, label: 'Debatkamer',       icon: Swords },
    { id: AppView.VERDICT, label: 'Uitspraak Editor', icon: FileEdit },
  ];

  // Flyout menu items (user avatar button)
  const FlyoutItems = [
    { id: AppView.PRICING,  label: 'Prijzen',          icon: CreditCard },
    { id: AppView.NODES,    label: 'Nodes aanmaken',   icon: Cpu },
    { id: AppView.COOKBOOK, label: 'Inspiratie',         icon: BookOpen },
    { divider: true },
    { id: AppView.FAQ,      label: 'FAQ',              icon: HelpCircle },
    { id: AppView.CONTACT,  label: 'Contact',          icon: Mail },
    { divider: true },
    { id: AppView.APIKEYS,  label: 'API Sleutels',     icon: Key },
    { id: 'signout' as AppView, label: 'Uitloggen',    icon: LogOut, action: handleLogout, hidden: !authSession },
  ];

  // Mobile nav keeps the most-used items
  const NavLinks = [
    { id: AppView.HOME,    label: 'Chat',     icon: ZapIcon },
    { id: AppView.CHATS,   label: 'Gesprekken', icon: History },
    { id: AppView.NODES,   label: 'Nodes',    icon: Cpu },
    { id: AppView.PRICING, label: 'Prijzen',  icon: CreditCard },
    { id: AppView.FAQ,     label: 'FAQ',      icon: HelpCircle },
  ];

  const renderStageIndicator = () => {
    const stages = [
      { id: WorkflowStage.PROCESSING_COUNCIL, label: "Gathering perspectives", icon: Users },
      { id: WorkflowStage.DEBATE, label: "Live debate", icon: MessageSquare },
      { id: WorkflowStage.SYNTHESIZING, label: "Writing verdict", icon: Gavel },
    ];
    if (session.stage === WorkflowStage.IDLE || session.stage === WorkflowStage.ERROR) return null;
    return (
      <div className="flex justify-center mb-6 md:mb-10 w-full">
        <div className="inline-flex items-center gap-1 glass-card card-shadow px-2 py-1.5 rounded-full">
          {stages.map((s, idx) => {
            const isActive = session.stage === s.id;
            const isCompleted = [WorkflowStage.COMPLETED, ...stages.slice(idx + 1).map(st => st.id)].includes(session.stage);
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'text-zinc-400 dark:text-zinc-600'
                }`}>
                  <s.icon className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline whitespace-nowrap">{s.label}</span>
                </div>
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-zinc-200 dark:text-zinc-700 mx-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell">

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════ */}
      <aside className={`sidebar${isSidebarCollapsed ? ' collapsed' : ''}`}>

        {/* ── Toggle button ────────────────────────────────── */}
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Sidebar uitklappen' : 'Sidebar inklappen'}
          aria-label={isSidebarCollapsed ? 'Sidebar uitklappen' : 'Sidebar inklappen'}
        >
          <ChevronLeft />
        </button>

        {/* ── Logo ──────────────────────────────────────────── */}
        <button
          className="sidebar-logo sidebar-logo-border"
          onClick={() => setCurrentView(AppView.HOME)}
          title="FAINL — Home"
        >
          <span className="sidebar-logo-mark">
            <Shield className="sidebar-logo-icon" />
          </span>
          <span className="sidebar-logo-text">FAINL</span>
        </button>

        {/* ── Nieuwe chat ───────────────────────────────────── */}
        <button
          className="btn-new-chat"
          onClick={() => {
            setCurrentView(AppView.HOME);
            setSession(prev => ({ ...prev, stage: WorkflowStage.IDLE, query: '', councilResponses: [], synthesis: '' }));
            setInput('');
          }}
        >
          <Plus />
          Nieuwe chat
        </button>

        {/* ── Primary nav ───────────────────────────────────── */}
        <nav className="sidebar-nav sidebar-nav-primary">
          {SidebarPrimary.map(link => (
            <div key={link.id} className="sidebar-tooltip-wrap">
              <button
                className={`sidebar-link ${currentView === link.id ? 'active' : ''}`}
                onClick={() => setCurrentView(link.id)}
                title={link.label}
              >
                <link.icon />
                <span>{link.label}</span>
              </button>
              <span className="sidebar-tooltip">{link.label}</span>
            </div>
          ))}
        </nav>

        {/* ── Recent chats ──────────────────────────────────── */}
        {history.length > 0 && (
          <div className="sidebar-section sidebar-section-scrollable">
            <p className="sidebar-section-label">Recente chats</p>
            {history.slice(0, 12).map(h => (
              <button
                key={h.id}
                className="sidebar-history-item"
                onClick={() => {
                  setSession(h);
                  setCurrentView(AppView.HOME);
                }}
                title={h.query}
              >
                <MessageSquare />
                <span className="sidebar-history-label">{h.query || 'Naamloos'}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Footer: user row + flyout ───────────────────────── */}
        <div className="sidebar-footer">

          {/* Dark / light toggle */}
          <div className="sidebar-tooltip-wrap">
            <button
              className="flyout-btn flyout-btn-spread"
              onClick={() => setIsDarkMode(d => !d)}
              title={isDarkMode ? 'Schakel naar licht' : 'Schakel naar donker'}
            >
              <span className="flyout-btn-icon-row">
                {isDarkMode ? <Sun className="flyout-theme-icon" /> : <Moon className="flyout-theme-icon" />}
                <span>{isDarkMode ? 'Lichte modus' : 'Donkere modus'}</span>
              </span>
            </button>
            <span className="sidebar-tooltip">{isDarkMode ? 'Lichte modus' : 'Donkere modus'}</span>
          </div>

          {/* User row / flyout trigger */}
          <div className="flyout-trigger">
            <button
              className="flyout-btn flyout-btn-user"
              onClick={() => setIsFlyoutOpen(o => !o)}
            >
              {/* Avatar */}
              <span className="user-avatar">
                {authSession?.user?.email?.charAt(0).toUpperCase() ?? 'G'}
              </span>
              <span className="user-name-wrap">
                <span className="user-display-name">
                  {authSession?.user?.user_metadata?.full_name
                    || authSession?.user?.email?.split('@')[0]
                    || 'Gast'}
                </span>
                <span className="user-subtitle">Mijn account</span>
              </span>
              <MoreHorizontal className="flyout-more-icon" />
            </button>


            {/* Flyout panel */}
            {isFlyoutOpen && (
              <>
                <div className="flyout-backdrop" onClick={() => setIsFlyoutOpen(false)} />
                <div className="flyout-menu">
                  {FlyoutItems.map((item: any, i) => {
                    if (item.divider) return <div key={i} className="flyout-divider" />;
                    if (item.hidden) return null;
                    return (
                      <button
                        key={item.id}
                        className="flyout-item"
                        onClick={() => {
                          setIsFlyoutOpen(false);
                          if (item.action) { item.action(); }
                          else setCurrentView(item.id);
                        }}
                      >
                        <item.icon />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </div>
      </aside>

      {/* ══ MAIN CANVAS ══════════════════════════════════════════════════ */}
      <div className={`main-canvas${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>

        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <span className="mobile-topbar-brand">FAINL</span>
          <button onClick={() => setIsSettingsOpen(true)} title="API-sleutels instellen" className="mobile-topbar-btn">
            <Lock style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* ── HOME VIEW ──────────────────────────────────────────────── */}
        {currentView === AppView.HOME && (
          <>
            {renderStageIndicator()}

            {/* ERROR */}
            {session.stage === WorkflowStage.ERROR && (
              <div className="error-center">
                <div className="error-card animate-up">
                  <div className="error-icon-circle">
                    <AlertTriangle className="error-icon" />
                  </div>
                  <h3 className="error-title">Er ging iets mis</h3>
                  <p className="error-message">{session.error}</p>
                  <div className="error-actions">
                    <button className="btn-send" onClick={() => setIsSettingsOpen(true)}>Sleutels instellen</button>
                    <button className="btn-ghost" onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE })}>Opnieuw</button>
                  </div>
                </div>
              </div>
            )}

            {/* IDLE — Hero */}
            {session.stage === WorkflowStage.IDLE && (
              <div className="hero-center animate-up">
                <h1 className="hero-heading">{(() => { const h = new Date().getHours(); const g = h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond'; const name = authSession?.user?.user_metadata?.name?.split(' ')[0] || authSession?.user?.user_metadata?.full_name?.split(' ')[0]; return name ? `${g}, ${name}.` : `${g}.`; })()}</h1>
                <p className="hero-sub">Stel je vraag — zeven AI-modellen debatteren en leveren één gefundeerde conclusie. Niet één mening, maar een echt antwoord.</p>

                {/* Input */}
                <div className="chat-input-wrap chat-input-full">
                  <div className="chat-input-pos">
                    {!input && !isInputFocused && (
                      <div className="placeholder-fade">
                        <FadingPlaceholder isFocused={isInputFocused} />
                      </div>
                    )}
                    <textarea
                      className="chat-textarea"
                      value={input}
                      onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      aria-label="Stel je vraag"
                    />
                  </div>
                  <div className="chat-input-bar">
                    <span className={`chat-counter ${input.length >= MAX_CHARS ? 'warn' : ''}`}>
                      {input.length > 0 ? `${input.length} / ${MAX_CHARS}` : ''}
                    </span>
                    <button
                      className="btn-send"
                      onClick={config.googleKey ? handleStart : () => setIsSettingsOpen(true)}
                      disabled={config.googleKey ? !input.trim() : false}
                    >
                      <Send className="send-icon" />
                      Vraag stellen
                    </button>
                  </div>
                </div>




              </div>
            )}


            {/* ACTIVE SESSION */}
            {session.stage !== WorkflowStage.IDLE && session.stage !== WorkflowStage.ERROR && (
              <div className="session-wrap animate-up">

                {/* Query */}
                <div className="query-card card-shadow">
                  <p className="query-label">Analyseren</p>
                  <p className="query-text">"{session.query}"</p>
                </div>

                {/* Verdict Panel */}
                {(session.stage === WorkflowStage.SYNTHESIZING || session.stage === WorkflowStage.COMPLETED) && (
                  <div className="verdict-panel card-shadow">
                    <div className="verdict-header">
                      <div className="verdict-icon-circle">
                        <Gavel className="verdict-icon" />
                      </div>
                      <div className="verdict-header-text">
                        <h3 className="verdict-title">Eindoordeel van de Raad</h3>
                        <p className="verdict-sub">Samengesteld uit {config.activeCouncil.length} perspectieven</p>
                      </div>
                      {session.stage === WorkflowStage.SYNTHESIZING && (
                        <span className="badge">
                          <Sparkles className="verdict-sparkle-icon" />
                          Samenvatten…
                        </span>
                      )}
                    </div>
                    <div className="verdict-body">
                      {session.synthesis ? (
                        <p className="verdict-synthesis">
                          {session.synthesis}
                          {session.stage === WorkflowStage.SYNTHESIZING && <span className="cursor" />}
                        </p>
                      ) : (
                        <div className="skeleton-row">
                          <div className="skeleton skeleton-90" />
                          <div className="skeleton skeleton-75" />
                          <div className="skeleton skeleton-83" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Council grid */}
                <div className="council-grid">
                  {session.councilResponses.map((resp, i) => {
                    const member = config.activeCouncil.find(m => m.id === resp.memberId);
                    if (!member) return null;
                    return (
                      <CouncilCard
                        key={resp.memberId}
                        member={member}
                        response={resp}
                        index={i}
                        isLoading={false}
                        isExpanded={false}
                        onToggle={() => {}}
                      />
                    );
                  })}
                </div>

                {/* New question button */}
                {session.stage === WorkflowStage.COMPLETED && (
                  <div className="new-question-wrap">
                    <button
                      className="btn-send"
                      onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE, query: '', councilResponses: [], synthesis: '' })}
                    >
                      Nieuwe vraag stellen
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── ALL PAGES ────────────────────────────────────────────────── */}
        {currentView !== AppView.HOME && (
          <div className="all-pages-wrap">
            {currentView === AppView.PRICING && (
              <PricingPage
                hasOwnKeys={!!(config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey)}
                onPurchaseTurns={(c) => handlePurchase('turns', c)}
                onPurchaseCredits={(c) => handlePurchase('credits', c)}
              />
            )}
            {(currentView === AppView.CHATS || currentView === AppView.ACCOUNT) && (
              <AccountPage
                config={config}
                history={history}
                onLoadSession={(s) => { setSession(s); setCurrentView(AppView.HOME); }}
                onDeleteSessions={(ids) => setHistory(h => h.filter(s => !ids.includes(s.id)))}
                onArchiveSessions={(ids) => setHistory(h => h.map(s => ids.includes(s.id) ? { ...s, isArchived: true } : s))}
              />
            )}
            {currentView === AppView.NODES && (
              <NodesPage onOpenSettings={() => setIsSettingsOpen(true)} />
            )}
            {currentView === AppView.DEBATES && (
              <div className="page-container animate-fade-in-up">
                <div className="page-header">
                  <div className="page-badge"><Swords className="w-3.5 h-3.5" />Debatkamer</div>
                  <h1 className="page-title">Debatkamer</h1>
                  <p className="page-sub">Start een nieuwe sessie om de AI-raad in debat te zien gaan. De debatkamer opent automatisch na het stellen van een vraag.</p>
                </div>
                {history.filter(s => s.debateMessages && s.debateMessages.length > 0).length === 0 ? (
                  <div className="page-cta">
                    <Swords className="w-8 h-8 mx-auto mb-3 debate-empty-icon" />
                    <h2 className="page-cta-title">Nog geen debatten</h2>
                    <p className="page-cta-text">Stel een vraag op het startscherm om een debat te starten tussen jouw AI-raadsleden.</p>
                    <button className="btn-primary debate-cta-btn" onClick={() => setCurrentView(AppView.HOME)}>
                      Naar de chat
                    </button>
                  </div>
                ) : (
                  <div className="nodes-grid">
                    {history.filter(s => s.debateMessages && s.debateMessages.length > 0).map(s => (
                      <button key={s.id} className="node-tile debate-tile-btn" onClick={() => { setSession(s); setCurrentView(AppView.HOME); }}>
                        <div className="node-tile-name">{s.query}</div>
                        <div className="node-tile-desc">{s.debateMessages.length} berichten · {new Date().toLocaleDateString('nl-NL')}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {currentView === AppView.VERDICT && (
              <AccountPage
                config={config}
                history={history.filter(s => !!s.synthesis)}
                onLoadSession={(s) => { setSession(s); setCurrentView(AppView.HOME); }}
                onDeleteSessions={(ids) => setHistory(h => h.filter(s => !ids.includes(s.id)))}
                onArchiveSessions={(ids) => setHistory(h => h.map(s => ids.includes(s.id) ? { ...s, isArchived: true } : s))}
              />
            )}
            {currentView === AppView.COOKBOOK && (
              <CookbookPage onSelectMission={(q) => { setInput(q); setCurrentView(AppView.HOME); }} />
            )}
            {currentView === AppView.FAQ && <FAQPage />}
            {currentView === AppView.CONTACT && <ContactPage />}
            {currentView === AppView.PRIVACY && <PrivacyPolicyPage />}
            {currentView === AppView.TERMS && <TermsOfServicePage />}
            {currentView === AppView.APIKEYS && (
              <ApiKeysPage
                config={config}
                onSave={(partial) => setConfig(prev => ({ ...prev, ...partial }))}
              />
            )}
          </div>
        )}


      </div>{/* end main-canvas */}

      {/* ══ MOBILE BOTTOM NAV ════════════════════════════════════════════ */}
      <nav className="mobile-nav">
        {NavLinks.slice(0, 5).map(link => (
          <button
            key={link.id}
            className={`mobile-nav-item ${currentView === link.id ? 'active' : ''}`}
            onClick={() => setCurrentView(link.id)}
          >
            <link.icon />
            {link.label}
          </button>
        ))}
      </nav>

      {/* ══ MODALS ═══════════════════════════════════════════════════════ */}
      <PaywallModal
        isOpen={isPaywallOpen}
        hasOwnKeys={!!(config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey)}
        isLoading={isPaymentLoading}
        onPurchaseTurns={(count: number | typeof Infinity) => handlePurchase('turns', count)}
        onPurchaseCredits={(count: number) => handlePurchase('credits', count)}
        onClose={() => setIsPaywallOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={setConfig}
        history={history}
        onImportHistory={setHistory}
        onVerifyKey={(provider: ModelProvider, key: string) => councilService.current.verifyProviderKey(provider, key)}
      />
      {/* ══ COOKIE BANNER ══════════════════════════════════════════════════ */}
      {!cookieConsent.given && (
        <CookieBanner
          onAcceptAll={c => saveConsent(c.functional, c.analytics, c.marketing)}
          onRejectAll={c => saveConsent(c.functional, false, false)}
          onSavePreferences={c => saveConsent(c.functional, c.analytics, c.marketing)}
        />
      )}

      {/* ══ ONBOARDING CARD (after 2nd query) ══════════════════════════════ */}
      {isOnboardingOpen && cookieConsent.given && (
        <OnboardingCard
          onDismiss={() => {
            localStorage.setItem('fainl_onboarding_seen', '1');
            setIsOnboardingOpen(false);
          }}
          onNavigate={view => {
            setCurrentView(view as AppView);
            localStorage.setItem('fainl_onboarding_seen', '1');
            setIsOnboardingOpen(false);
          }}
        />
      )}
    </div>
  );
};
export default App;
