
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
  Moon
} from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { LoginPage } from './components/LoginPage';
import { Session } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { ScrambleText } from './components/ScrambleText';
import { WelcomePopup } from './components/WelcomePopup';


const FadingPlaceholder: FC<{ isFocused: boolean }> = ({ isFocused }: { isFocused: boolean }) => {
  const examples = [
    "Should I learn Rust or Go for backend development?",
    "Is it better to buy or rent a house in 2026?",
    "What are the pros and cons of a four-day work week?",
    "Is remote work better for productivity than in-office?",
    "Should I use TypeScript or JavaScript for my next project?",
    "What is the strongest argument for universal basic income?"
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
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    const seen = localStorage.getItem('fainl_visited');
    if (!seen) {
      // Delay popup slightly so page loads first
      setTimeout(() => {}, 0);
      return true;
    }
    return false;
  });
  
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

    try {
      // 1. Council Analysis Phase
      const responses = await councilService.current.getCouncilResponses(input, readyMembers);
      
      // Council done — stage stays at PROCESSING_COUNCIL until user opens debate
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

  const NavLinks = [
    { id: AppView.HOME, label: 'Home', icon: ZapIcon },
    { id: AppView.PRICING, label: 'Pricing', icon: Coins },
    { id: AppView.ACCOUNT, label: 'History', icon: LayoutDashboard },
    { id: AppView.COOKBOOK, label: 'Examples', icon: BookOpen },
    { id: AppView.FAQ, label: 'FAQ', icon: HelpCircle },
    { id: AppView.CONTACT, label: 'Contact', icon: Mail },
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
    <div className={`min-h-screen text-zinc-900 dark:text-zinc-100 flex flex-col overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-grid-dark' : 'bg-grid-light'} bg-white dark:bg-[#0a0a0a]`}>
      {/* -- Header -- */}
      <header className="border-b border-black/[0.05] dark:border-white/[0.05] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 md:h-13 flex items-center justify-between gap-4">

          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentView(AppView.HOME)}
              className="flex items-center gap-2 group shrink-0"
            >
              <CyberLogo />
              <span className="text-sm font-bold tracking-tight hidden sm:block text-zinc-900 dark:text-white">
                FAINL
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0">
              {NavLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`relative px-3 py-1.5 text-xs font-medium transition-all rounded-lg ${
                    currentView === link.id
                      ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-white/8'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-xs font-medium"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">API Keys</span>
            </button>

            {authSession && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-xs font-medium"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto pb-safe">
        {currentView === AppView.HOME ? (
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 flex flex-col items-center justify-center min-h-[calc(100dvh-48px-60px)] lg:min-h-[calc(100dvh-52px)]">
            {renderStageIndicator()}

            {/* -- Error State -- */}
            {session.stage === WorkflowStage.ERROR && (
              <div className="w-full max-w-md glass-card card-shadow rounded-2xl p-6 md:p-10 text-center animate-fade-in-up">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Something went wrong</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed text-sm">{session.error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="btn-violet px-4 py-2 rounded-xl font-medium text-sm"
                  >
                    Configure Keys
                  </button>
                  <button
                    onClick={() => setSession({ ...session, stage: WorkflowStage.IDLE })}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* -- IDLE: Hero + Input -- */}
            {session.stage === WorkflowStage.IDLE ? (
              <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center pb-20 px-0 animate-fade-in-up">

                {/* Compact heading */}
                <div className="mb-5">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-200 leading-snug mb-1.5">
                    Get a balanced answer from multiple AI models
                  </h1>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    The council deliberates, debates, and delivers one authoritative verdict.
                  </p>
                </div>

                {/* -- The INPUT — ChatGPT/Claude style -- */}
                <div className="w-full">
                  <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-200 focus-within:border-zinc-300 dark:focus-within:border-zinc-700 focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.04)] dark:focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.6)]">

                    {/* Textarea */}
                    <div className="relative w-full min-h-[88px] sm:min-h-[100px] md:min-h-[112px] p-4 md:p-5">
                      {!input && !isInputFocused && (
                        <div className="absolute top-4 left-4 md:top-5 md:left-5 pointer-events-none text-sm text-zinc-400 dark:text-zinc-500">
                          <FadingPlaceholder isFocused={isInputFocused} />
                        </div>
                      )}
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        aria-label="Enter your question"
                        placeholder=""
                        className="w-full bg-transparent border-none p-0 text-sm md:text-base text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:ring-0 resize-none absolute inset-4 md:inset-5 font-normal leading-relaxed"
                      />
                    </div>

                    {/* Bottom action bar */}
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5 border-t border-zinc-100 dark:border-zinc-800">
                      <span className={`text-[10px] font-medium tabular-nums ${input.length >= MAX_CHARS ? 'text-red-500' : 'text-zinc-300 dark:text-zinc-600'}`}>
                        {input.length > 0 ? `${input.length} / ${MAX_CHARS}` : ''}
                      </span>

                      {!config.googleKey ? (
                        <button
                          onClick={() => setIsSettingsOpen(true)}
                          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                          <ZapIcon className="w-3 h-3" />
                          Connect API key ?
                        </button>
                      ) : (
                        <button
                          onClick={handleStart}
                          disabled={!input.trim()}
                          title="Ask the Council"
                          aria-label="Ask the Council"
                          className="btn-violet flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Ask the Council</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Model chips */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    {['Gemini', 'GPT-4', 'Claude', 'Grok', 'Llama', 'Mistral', 'DeepSeek'].map(model => (
                      <span
                        key={model}
                        className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.07] text-[10px] font-medium text-zinc-400 dark:text-zinc-600"
                      >
                        {model}
                      </span>
                    ))}
                  </div>

                  {/* Trust line */}
                  <p className="mt-2.5 text-[10px] text-zinc-400 dark:text-zinc-600">
                    Keys stored locally · Free with your own API key
                  </p>
                </div>
              </div>

            ) : session.stage !== WorkflowStage.ERROR && (
              /* -- Active Session -- */
              <div className="animate-fade-in-up space-y-5 md:space-y-8 w-full pb-8 md:pb-16">

                {/* Active Query Context */}
                <div className="glass-card card-shadow rounded-xl p-4 md:p-6 text-center">
                  <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Analyzing</p>
                  <p className="text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-100 font-medium leading-snug">
                    "{session.query}"
                  </p>
                </div>

                {/* Synthesis Panel */}
                {(session.stage === WorkflowStage.SYNTHESIZING || session.stage === WorkflowStage.COMPLETED) && (
                  <div className="w-full glass-card card-shadow rounded-2xl overflow-hidden">
                    {/* Panel header */}
                    <div className="bg-zinc-900 dark:bg-zinc-800 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2.5 flex-1">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <Gavel className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm leading-tight">Final Verdict</h3>
                          <p className="text-[10px] text-white/50 mt-0.5">Synthesized from all council perspectives</p>
                        </div>
                      </div>
                      {session.stage === WorkflowStage.SYNTHESIZING && (
                        <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-white/80 text-[10px] font-medium animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          Synthesizing...
                        </div>
                      )}
                    </div>

                    {/* Panel body */}
                    <div className="p-5 md:p-8 prose prose-sm md:prose-base max-w-none dark:prose-invert prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 leading-relaxed">
                      {session.synthesis ? (
                        <ReactMarkdown>{session.synthesis}</ReactMarkdown>
                      ) : (
                        <div className="h-32 md:h-48 flex flex-col items-center justify-center gap-4 text-zinc-300 dark:text-zinc-600">
                          <Loader2 className="animate-spin w-6 h-6 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">Merging perspectives...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Council Grid */}
                <div>
                  <h2 className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">AI Council Perspectives</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {config.activeCouncil.map(member => {
                      const response = session.councilResponses.find(r => r.memberId === member.id);
                      const isLoading = session.stage === WorkflowStage.PROCESSING_COUNCIL && !response;
                      return (
                        <CouncilCard
                          key={member.id}
                          member={member}
                          response={response}
                          isLoading={isLoading}
                          isExpanded={false}
                          onToggle={() => {}}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Debate CTA */}
                {session.councilResponses.length > 0 && session.stage !== WorkflowStage.PROCESSING_COUNCIL && session.stage !== WorkflowStage.SYNTHESIZING && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
                    <button
                      onClick={() => setIsDebateOpen(true)}
                      className="btn-violet group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open Debate Room
                      {session.debateMessages.length > 0 && (
                        <span className="bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full text-[10px]">
                          {session.debateMessages.length}
                        </span>
                      )}
                    </button>
                    {session.synthesis && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                        <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Debate completed
                      </span>
                    )}
                  </div>
                )}

                {/* New Mission CTA */}
                {session.stage === WorkflowStage.COMPLETED && session.councilResponses.length > 0 && (
                  <div className="flex justify-center pt-6 pb-10 md:pb-16">
                    <button
                      onClick={() => setSession({ id: crypto.randomUUID(), stage: WorkflowStage.IDLE, query: '', synthesis: '', councilResponses: [], reviews: [], debateMessages: [] })}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Ask Another Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

      {/* -- Debate Room Overlay -- */}
      <DebateRoom
        isOpen={isDebateOpen}
        session={session}
        config={config}
        councilService={councilService.current}
        onClose={() => setIsDebateOpen(false)}
        onEndDebate={handleEndDebate}
        onAddDebateMessage={handleAddDebateMessage}
      />

        {/* New Pages */}
        {currentView === AppView.PRICING && (
            <PricingPage 
                hasOwnKeys={!!(config.googleKey || config.openaiKey || config.anthropicKey || config.groqKey || config.deepseekKey)}
                onPurchaseTurns={(count: number | typeof Infinity) => handlePurchase('turns', count)}
                onPurchaseCredits={(count: number) => handlePurchase('credits', count)}
            />
        )}
        {currentView === AppView.ACCOUNT && (
            !authSession ? (
                <LoginPage onLoginSuccess={() => setCurrentView(AppView.ACCOUNT)} />
            ) : (
                <AccountPage 
                    config={config}
                    history={history}
                    onLoadSession={(sess: SessionState) => {
                        setSession(sess);
                        setCurrentView(AppView.HOME);
                    }}
                    onDeleteSessions={(ids: string[]) => {
                        setHistory(prev => prev.filter(s => !ids.includes(s.id)));
                    }}
                    onArchiveSessions={(ids: string[]) => {
                        setHistory(prev => prev.map(s => ids.includes(s.id) ? { ...s, isArchived: !s.isArchived } : s));
                    }}
                />
            )
        )}
        {currentView === AppView.COOKBOOK && (
            <CookbookPage 
                onSelectMission={(q: string) => {
                    setInput(q);
                    setCurrentView(AppView.HOME);
                }}
            />
        )}
        {currentView === AppView.FAQ && <FAQPage />}
        {currentView === AppView.CONTACT && <ContactPage />}
        {currentView === AppView.PRIVACY && <PrivacyPolicyPage />}
        {currentView === AppView.TERMS && <TermsOfServicePage />}
      </main>

      {/* -- Footer -- */}
      <footer className="hidden lg:block border-t border-zinc-100 dark:border-white/[0.05] py-6 bg-white/60 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CyberLogo isAnimated={false} />
            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-600">FAINL</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView(AppView.PRIVACY)}
              className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => setCurrentView(AppView.TERMS)}
              className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Terms
            </button>
            <span className="text-[11px] text-zinc-300 dark:text-zinc-700">© 2026 FAINL</span>
          </div>
        </div>
      </footer>

      {/* -- Mobile Bottom Navigation -- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-black/[0.05] dark:border-white/[0.05]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around px-2 pt-1 pb-1.5">
          {NavLinks.slice(0, 5).map(link => (
            <button
              key={link.id}
              onClick={() => { setCurrentView(link.id); setIsMenuOpen(false); }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-[48px] relative ${
                currentView === link.id
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <link.icon className={`w-4.5 h-4.5 transition-transform duration-200 ${currentView === link.id ? 'scale-110' : ''}`} />
              <span className="text-[9px] font-medium">
                {link.label}
              </span>
              {currentView === link.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
          ))}
        </div>
      </nav>

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
      {isWelcomeOpen && (
        <WelcomePopup onClose={() => {
          localStorage.setItem('fainl_visited', '1');
          setIsWelcomeOpen(false);
        }} />
      )}
    </div>
  );
};
export default App;
