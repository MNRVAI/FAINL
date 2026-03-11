
import { useState, useRef, useEffect, FC, lazy, Suspense } from 'react';
import {
  Send,
  Users,
  MessageSquare,
  Gavel,
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  AlertTriangle,
  Globe,
  CircleCheck,
  Eye,
  Swords,
  PenLine,
  CheckCircle2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  DEFAULT_COUNCIL,
  DEFAULT_CHAIRMAN,
  USAGE_LIMITS,
  PRICING,
} from "./constants";
import {
  CouncilResponse,
  PeerReview,
  WorkflowStage,
  SessionState,
  AppConfig,
  ModelProvider,
  AppView,
} from "./types";
import { UnifiedCouncilService } from "./services/councilService";
import { CouncilCard } from "./components/CouncilCard";
import { PaywallModal } from "./components/PaywallModal";
const PricingPage = lazy(() => import("./components/PricingPage").then(m => ({ default: m.PricingPage })));
const AccountPage = lazy(() => import("./components/AccountPage").then(m => ({ default: m.AccountPage })));
const CookbookPage = lazy(() => import("./components/CookbookPage").then(m => ({ default: m.CookbookPage })));
const FAQPage = lazy(() => import("./components/FAQPage").then(m => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import("./components/ContactPage").then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import("./components/PrivacyPolicyPage").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import("./components/TermsOfServicePage").then(m => ({ default: m.TermsOfServicePage })));
const DebateRoom = lazy(() => import("./components/DebateRoom").then(m => ({ default: m.DebateRoom })));
const ComparePage = lazy(() => import("./components/ComparePage").then(m => ({ default: m.ComparePage })));
const BestAIToolPage = lazy(() => import("./components/BestAIToolPage").then(m => ({ default: m.BestAIToolPage })));
const UseCaseLegalPage = lazy(() => import("./components/UseCaseLegalPage").then(m => ({ default: m.UseCaseLegalPage })));
const UseCaseMarketingPage = lazy(() => import("./components/UseCaseMarketingPage").then(m => ({ default: m.UseCaseMarketingPage })));
import {
  Menu,
  X as CloseIcon,
  LayoutDashboard,
  Coins,
  BookOpen,
  HelpCircle,
  Mail,
  Zap as ZapIcon,
} from "lucide-react";
import { supabase } from "./services/supabaseClient";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SEO } from "./components/SEO";
const LoginPage = lazy(() => import("./components/LoginPage").then(m => ({ default: m.LoginPage })));
const QuestionPage = lazy(() => import("./components/QuestionPage").then(m => ({ default: m.QuestionPage })));
import { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { CookieConsent } from "./components/CookieConsent";
import { AdRewardModal } from "./components/AdRewardModal";
const LandingPage = lazy(() => import("./components/LandingPage").then(m => ({ default: m.LandingPage })));
import { useLanguage } from "./contexts/LanguageContext";


const FadingPlaceholder: FC<{ isFocused: boolean; examples: string[] }> = ({ isFocused, examples }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isFocused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % examples.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [isFocused, examples.length]);

  if (isFocused) return null;

  return (
    <span className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {examples[index]}
    </span>
  );
};

const AnimatedSendIcon: FC = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
      const nextDelay = Math.random() * 4000 + 2000;
      setTimeout(triggerGlitch, nextDelay);
    };
    const timer = setTimeout(triggerGlitch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <Send className={`w-6 h-6 md:w-10 md:h-10 transition-transform duration-100 ${glitch ? 'translate-x-0.5 -translate-y-0.5 opacity-80' : ''}`} />
      {glitch && (
        <Send className="w-6 h-6 md:w-10 md:h-10 absolute top-0 left-0 text-red-500 opacity-50 -translate-x-0.5 translate-y-0.5 mix-blend-screen" />
      )}
    </div>
  );
};

const LogoSwitch: FC = () => (
  <video
    src="/FAINLANI.mp4"
    autoPlay
    muted
    loop
    playsInline
    aria-label="FAINL logo animatie"
    className="h-14 sm:h-16 md:h-20 w-auto max-w-[180px] sm:max-w-[240px] object-contain"
  />
);

const CyberLogo: FC<{ isAnimated?: boolean }> = ({ isAnimated = true }) => {
  return (
    <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center group overflow-visible">
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500 animate-pulse-glow" />
      {isAnimated && (
        <>
          <div className="absolute inset-x-0.5 inset-y-0.5 border border-white/20 rounded-full animate-orbit pointer-events-none" />
          <div className="absolute inset-x-2 inset-y-2 border border-white/10 dark:border-white/5 rounded-full animate-reverse-orbit pointer-events-none" />
        </>
      )}
      <div className="relative w-8 h-8 md:w-10 md:h-10 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-white/50 transition-all duration-500 overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_60%)] opacity-50 group-hover:opacity-80 transition-opacity" />
        <Shield className="text-white dark:text-white w-4 h-4 md:w-5 md:h-5 relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>
    </div>
  );
};

// Shown after Stripe redirects back. Reads ?payment_confirm=true&type=credits&count=X
// which must be configured as the success URL in each Stripe Payment Link dashboard.
const PaymentSuccessPage: FC = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const count = params.get('count') || '?';
  const type = params.get('type');
  const isConfirmed = params.get('payment_confirm') === 'true';

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0_0_black]">
        <div className="w-16 h-16 bg-[#FDC700] border-4 border-black flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-3 text-black">
          {isConfirmed ? 'Betaling Bevestigd' : 'Bedankt!'}
        </h1>
        <p className="font-bold text-black mb-2">
          {isConfirmed && type === 'credits'
            ? `${count} credits zijn toegevoegd aan jouw account.`
            : isConfirmed && type === 'lifetime'
            ? 'Onbeperkte toegang geactiveerd.'
            : 'Je betaling is verwerkt. Ga terug naar het dashboard om je credits te bekijken.'}
        </p>
        <p className="text-sm font-black uppercase tracking-widest text-black/40 mb-8">
          Credits worden opgeslagen in jouw browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all"
          >
            Naar Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('/mission')}
            className="px-8 py-4 bg-[#FDC700] border-2 border-black text-black font-black text-sm uppercase tracking-widest hover:shadow-[4px_4px_0_0_black] transition-all"
          >
            Nieuwe Missie
          </button>
        </div>
      </div>
    </div>
  );
};

const App: FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const defaultConfig = {
    // API keys for proxied providers are stored server-side (Supabase Secrets).
    // Only user-configured local providers (Ollama, Custom) need keys here.
    googleKey:    '',
    openRouterKey: '',
    openaiKey:    '',
    anthropicKey: '',
    deepseekKey:  '',
    groqKey:      '',
    mistralKey:   '',
    customKey: '',
    mimoKey: '',
    devstralKey: '',
    katKey: '',
    olmoKey: '',
    nemotronKey: '',
    gemmaKey: '',
    glmKey: '',
    // App settings
    activeCouncil: DEFAULT_COUNCIL,
    customNodes: [] as any[],
    chairmanId: DEFAULT_CHAIRMAN.id,
    modelCount: 3 as 3 | 5,
    turnsUsed: 0,
    creditsRemaining: 0,
    isLifetime: false,
    totalTurnsAllowed: 2,
    hasWatchedAd: false,
  };

  const normalizeConfig = (raw: any) => {
    const merged = { ...defaultConfig, ...(raw || {}) };
    return {
      ...merged,
      activeCouncil: (() => {
        if (!Array.isArray(merged.activeCouncil) || merged.activeCouncil.length === 0) return DEFAULT_COUNCIL;
        // Migrate: update modelId for any member whose ID matches a DEFAULT_COUNCIL member
        const defaultById = Object.fromEntries(DEFAULT_COUNCIL.map(m => [m.id, m]));
        return merged.activeCouncil.map((m: any) => defaultById[m.id] ? { ...m, modelId: defaultById[m.id].modelId, provider: defaultById[m.id].provider } : m);
      })(),
      customNodes: Array.isArray(merged.customNodes) ? merged.customNodes : [],
      modelCount: merged.modelCount === 5 ? 5 : 3,
      turnsUsed: Number.isFinite(merged.turnsUsed) ? merged.turnsUsed : 0,
      creditsRemaining: Number.isFinite(merged.creditsRemaining) ? merged.creditsRemaining : 0,
      totalTurnsAllowed: Number.isFinite(merged.totalTurnsAllowed) ? merged.totalTurnsAllowed : 2,
      isLifetime: !!merged.isLifetime,
      hasWatchedAd: !!merged.hasWatchedAd,
    };
  };

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem("fainl_config_v2");
    if (!saved) return normalizeConfig(null) as AppConfig;
    try {
      return normalizeConfig(JSON.parse(saved)) as AppConfig;
    } catch {
      return normalizeConfig(null) as AppConfig;
    }
  });

  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const pendingQueryRef = useRef<string>('');
  const [authSession, setAuthSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const [history, setHistory] = useState<SessionState[]>(() => {
    const saved = localStorage.getItem('fainl_history');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((s: any) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
        isArchived: !!s.isArchived
      }));
    } catch (e) {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isDebateOpen, setIsDebateOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const toggleCard = (memberId: string) => setExpandedCards(prev => {
    const next = new Set(prev);
    if (next.has(memberId)) next.delete(memberId); else next.add(memberId);
    return next;
  });
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(() => {
    return !localStorage.getItem('fainl_visited');
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'banner' | 'form' | 'submitting' | 'success'>('banner');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterState('submitting');
    try {
      await supabase.from('newsletter_subscribers').insert({
        email: newsletterEmail.trim().toLowerCase(),
        promo_code: 'promo_1T9tKD2Z8WgVHOZM0xJIa5Py',
        source: 'announcement_banner',
      });
    } catch (_) { /* table may not exist yet, still show success */ }
    setNewsletterState('success');
    localStorage.setItem('fainl_visited', '1');
  };

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

  const startSession = async (queryInput: string) => {
    const allMembers = config.activeCouncil;
    const readyMembers = councilService.current.getReadyMembers(allMembers);
    const membersToUse = readyMembers.length > 0 ? readyMembers : allMembers;

    if (membersToUse.length < 1) {
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: "Geen nodes gevonden. Voeg minimaal één node toe aan je raad.",
      }));
      return;
    }

    setConfig((current: AppConfig) => {
      if (current.creditsRemaining > 0) {
        return { ...current, creditsRemaining: current.creditsRemaining - USAGE_LIMITS.CREDITS_PER_TURN };
      } else {
        return { ...current, turnsUsed: current.turnsUsed + 1 };
      }
    });

    setSession({
      id: crypto.randomUUID(),
      stage: WorkflowStage.PROCESSING_COUNCIL,
      query: queryInput,
      councilResponses: [],
      debateMessages: [],
      reviews: [],
      synthesis: ''
    });

    try {
      const responses = await councilService.current.getCouncilResponses(queryInput, membersToUse);

      // Stop at DEBATE stage — user chooses: Live Debate or direct Chairman's Verdict
      setSession((prev: SessionState) => ({
        ...prev,
        councilResponses: responses,
        stage: WorkflowStage.DEBATE,
        synthesis: '',
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

  const handleStart = async () => {
    if (!input.trim()) return;

    const hasCredits = config.creditsRemaining > 0;
    const hasTurnsRemaining = config.turnsUsed < config.totalTurnsAllowed;
    const isAllowed = config.isLifetime || hasTurnsRemaining || hasCredits;

    if (!isAllowed) {
      setIsPaywallOpen(true);
      return;
    }

    // 2e gratis sessie vereist het bekijken van een advertentie
    if (config.turnsUsed === 1 && !config.hasWatchedAd && !config.isLifetime && !hasCredits) {
      pendingQueryRef.current = input;
      setIsAdOpen(true);
      return;
    }

    await startSession(input);
  };

  const handleAdReward = () => {
    setConfig((prev: AppConfig) => {
      const updated = { ...prev, hasWatchedAd: true };
      localStorage.setItem('fainl_config_v2', JSON.stringify(updated));
      return updated;
    });
    setIsAdOpen(false);
    startSession(pendingQueryRef.current);
  };

  // Single synthesis entry point — used by both "Get Verdict" and "After Debate"
  const runSynthesis = async (query: string, responses: CouncilResponse[], debateMsgs: import('./types').DebateMessage[]) => {
    const readyForSynth = councilService.current.getReadyMembers(config.activeCouncil);
    const membersForSynth = readyForSynth.length > 0 ? readyForSynth : config.activeCouncil;
    setSession((prev: SessionState) => ({ ...prev, stage: WorkflowStage.SYNTHESIZING, synthesis: '' }));
    try {
      const synthesis = await councilService.current.synthesizeStream(
        query,
        responses,
        [],
        debateMsgs,
        membersForSynth,
        DEFAULT_CHAIRMAN,
        (chunk) => {
          setSession((prev: SessionState) => ({
            ...prev,
            synthesis: (prev.synthesis || '') + chunk
          }));
        }
      );
      setSession((prev: SessionState) => {
        const completedSession = { ...prev, synthesis, stage: WorkflowStage.COMPLETED, timestamp: Date.now() };
        setHistory((h: SessionState[]) => [completedSession, ...h]);
        return completedSession;
      });
    } catch (err: any) {
      console.error(err);
      setSession((prev: SessionState) => ({
        ...prev,
        stage: WorkflowStage.ERROR,
        error: err.message || "Synthesis failed."
      }));
    }
  };

  const handleEndDebate = async (debateMessages: import('./types').DebateMessage[]) => {
    setIsDebateOpen(false);
    setSession((prev: SessionState) => ({ ...prev, debateMessages }));
    await runSynthesis(session.query, session.councilResponses, debateMessages);
  };

  const handleAddDebateMessage = (msg: import('./types').DebateMessage) => {
    setSession((prev: SessionState) => ({
      ...prev,
      debateMessages: [...prev.debateMessages, msg]
    }));
  };

  const handlePurchaseTurns = (count: number) => {
    const creditPkg = PRICING.CREDITS.find(p => p.count === count);
    const subPkg = PRICING.SUBSCRIPTIONS.find(p => p.count === count || p.creditsPerMonth === count);
    const pkg = creditPkg || subPkg;
    if (!pkg?.stripeUrl) {
      alert("Deze betaallink is nog niet actief.");
      return;
    }
    // Stripe Payment Links do not support ?success_url= overrides.
    // Configure each Payment Link's success URL in the Stripe Dashboard to:
    //   https://fainl.com/?payment_confirm=true&type=credits&count=X
    // where X is the number of credits for that product.
    window.location.href = pkg.stripeUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_confirm') === 'true') {
      const type = params.get('type');
      const countStr = params.get('count');
      const count = countStr === 'infinity' ? Infinity : parseInt(countStr || '0', 10);

      if (type === 'lifetime') {
        setConfig(prev => ({ ...prev, isLifetime: true }));
      } else if (type === 'credits' || type === 'turns') {
        // Both credits and subscription purchases add to creditsRemaining
        setConfig(prev => ({
          ...prev,
          creditsRemaining: prev.creditsRemaining + (isFinite(count as number) ? (count as number) : 0),
          isLifetime: count === Infinity ? true : prev.isLifetime,
        }));
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const NavLinks = [
    { id: "/", label: "Protocols", icon: ZapIcon },
    { id: "/tokens", label: "Credits", icon: Coins },
    { id: "/dashboard", label: "My FAINLS", icon: LayoutDashboard },
    { id: "/cookbook", label: "Kookboek", icon: BookOpen },
    { id: "/faq", label: "FAQ", icon: HelpCircle },
    { id: "/contact", label: "Contact", icon: Mail },
  ];

  const renderStageIndicator = () => {
    const stages = [
      { id: WorkflowStage.PROCESSING_COUNCIL, label: "Neural Deliberation", icon: Users },
      { id: WorkflowStage.DEBATE, label: "Live Debate", icon: MessageSquare },
      { id: WorkflowStage.SYNTHESIZING, label: "Verdict Synthesis", icon: Gavel },
    ];
    if (session.stage === WorkflowStage.IDLE || session.stage === WorkflowStage.ERROR) return null;
    return (
      <div className="flex justify-center mb-8 md:mb-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/20 dark:bg-white/5 p-2.5 rounded-3xl sm:rounded-full border border-black/10 dark:border-white/10 backdrop-blur-sm w-full sm:w-auto overflow-x-auto">
          {stages.map((s, idx) => {
            const isActive = session.stage === s.id;
            const isCompleted = [WorkflowStage.COMPLETED, ...stages.slice(idx + 1).map(st => st.id)].includes(session.stage);
            return (
              <div key={s.id} className="flex items-center gap-3 w-full sm:w-auto">
                <div className={`flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-sm font-black tracking-[0.2em] uppercase transition-all border-2 w-full sm:w-auto justify-center sm:justify-start ${isActive ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]' : isCompleted ? 'bg-white dark:bg-zinc-800 text-black dark:text-white border-black dark:border-white/20' : 'text-black/20 dark:text-white/20 border-transparent'}`}>
                  <s.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="whitespace-nowrap">{s.label}</span>
                </div>
                {idx < stages.length - 1 && <ArrowRight className="hidden sm:block w-4 h-4 text-black/10 dark:text-white/10" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden transition-colors duration-300">
      <header className="border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 grid grid-cols-3 items-center">
          {/* Left: logo */}
          <div className="flex items-center">
            <button type="button" onClick={() => navigate("/")} aria-label="FAINL — naar startpagina" className="flex items-center group">
              <LogoSwitch />
            </button>
          </div>

          {/* Center: nav links */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NavLinks.map(link => (
              <button
                type="button"
                key={link.id}
                onClick={() => navigate(link.id)}
                className={`px-4 py-2.5 font-black text-sm uppercase tracking-widest transition-all rounded-lg ${location.pathname === link.id ? 'bg-black text-white' : 'text-black/60 hover:text-black hover:bg-black/5'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
          {/* placeholder for centering on mobile */}
          <div className="lg:hidden" />

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg active:scale-95 transition-all"
            >
              {isMenuOpen ? <CloseIcon /> : <Menu />}
            </button>

            {authSession && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-200"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b-4 border-black dark:border-zinc-700 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {NavLinks.map(link => (
              <button
                type="button"
                key={link.id}
                onClick={() => { navigate(link.id); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 font-black text-sm md:text-base uppercase tracking-[0.15em] rounded-xl transition-all ${location.pathname === link.id ? 'bg-black text-white' : 'bg-zinc-50 text-black/60'}`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </button>
            ))}
            {authSession && (
              <button
                type="button"
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-4 p-4 font-black text-sm uppercase tracking-[0.15em] rounded-xl transition-all bg-red-50 text-red-600 border border-red-200 mt-4"
              >
                <LogOut className="w-5 h-5" />
                {t.nav.signOut}
              </button>
            )}
          </div>
        )}
      </header>

      {isAnnouncementVisible && newsletterState !== 'success' && (
        <div className="w-full bg-black text-white px-4 py-2.5 relative">
          {newsletterState === 'banner' && (
            <div className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest">
              <span className="text-yellow-400">★</span>
              <span>15% korting op je eerste aankoop</span>
              <span className="text-white/40 hidden sm:inline">—</span>
              <button
                type="button"
                onClick={() => setNewsletterState('form')}
                className="underline hover:text-yellow-400 transition-colors hidden sm:inline"
              >
                Aanmelden voor nieuwsbrief
              </button>
            </div>
          )}
          {(newsletterState === 'form' || newsletterState === 'submitting') && (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-yellow-400 text-sm font-black uppercase tracking-widest whitespace-nowrap">★ 15% korting</span>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="jouw@email.nl"
                className="bg-white/10 border border-white/30 text-white placeholder-white/40 text-sm px-3 py-1.5 outline-none focus:border-yellow-400 transition-colors w-48"
              />
              <button
                type="submit"
                disabled={newsletterState === 'submitting'}
                className="bg-yellow-400 text-black text-sm font-black uppercase tracking-widest px-3 py-1.5 hover:bg-yellow-300 transition-colors disabled:opacity-60"
              >
                {newsletterState === 'submitting' ? '...' : 'Aanmelden'}
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('fainl_visited', '1');
              setIsAnnouncementVisible(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
            aria-label="Sluit aankondiging"
          >
            ✕
          </button>
        </div>
      )}
      {newsletterState === 'success' && (
        <div className="w-full bg-yellow-400 text-black px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest relative">
          <span>✓ Aangemeld!</span>
          <span className="text-black/60">Jouw kortingscode:</span>
          <span className="bg-black text-yellow-400 px-2 py-0.5 font-mono tracking-normal select-all">promo_1T9tKD2Z8WgVHOZM0xJIa5Py</span>
          <button
            type="button"
            onClick={() => setIsAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/50 hover:text-black transition-colors"
            aria-label="Sluit"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 w-full mx-auto">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[40vh]"><div className="w-6 h-6 border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white rounded-full animate-spin" /></div>}>
        <Routes>
          {/* Home / Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Mission / Chat Area */}
          <Route
            path="/mission"
            element={
              <>
                <SEO
                  title="Start AI Consensus Sessie — Stel jouw vraag"
                  description="Stel jouw vraag aan meerdere AI-modellen tegelijk. Gemini, GPT-4 en Claude analyseren parallel, debatteren live en geven één gewogen eindoordeel."
                  canonical="/mission"
                  keywords="AI vraag stellen, meerdere AI modellen, AI consensus sessie"
                />
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
                  {renderStageIndicator()}
                  {session.stage === WorkflowStage.ERROR && (
                    <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 p-6 md:p-12 rounded-xl text-center animate-fade-in-up">
                      <AlertTriangle className="w-12 h-12 md:w-20 md:h-20 text-black dark:text-white mb-6 md:mb-8 mx-auto" />
                      <h3 className="text-xl md:text-3xl font-black uppercase mb-3 md:mb-4 tracking-tighter">
                        Protocol Halt
                      </h3>
                      <p className="text-black/50 dark:text-white/50 font-bold mb-6 md:mb-10 leading-relaxed text-sm md:text-lg">
                        {session.error}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSession({
                              ...session,
                              stage: WorkflowStage.IDLE,
                            })
                          }
                          className="px-6 py-3 md:px-10 md:py-5 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 font-black rounded uppercase tracking-[0.2em] text-sm md:text-sm transition-all text-black dark:text-white"
                        >
                          Recalibrate
                        </button>
                      </div>
                    </div>
                  )}

                  {session.stage === WorkflowStage.IDLE ? (
                    <div className="w-full relative">
                      <div className="relative bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 rounded-xl p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] focus-within:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] md:focus-within:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:md:focus-within:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="relative w-full min-h-[200px] md:min-h-[350px]">
                          {!input && !isInputFocused && (
                            <div className="absolute top-0 left-0 pointer-events-none text-xl sm:text-2xl md:text-4xl font-black text-black/20 dark:text-white/20 font-serif italic">
                              <FadingPlaceholder isFocused={isInputFocused} examples={[
                                "Moet ik van baan wisselen?",
                                "Is kernenergie de oplossing?",
                                "Welke markt moet ik betreden in 2026?",
                                "Wat zijn de ethische implicaties van AGI?",
                                "Is een vegan dieet gezonder?",
                              ]} />
                            </div>
                          )}
                          <textarea
                            value={input}
                            onChange={(e) =>
                              setInput(e.target.value.slice(0, MAX_CHARS))
                            }
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            aria-label="Enter your mission or directive"
                            placeholder="Stel je vraag..."
                            className="w-full h-full bg-transparent border-none p-0 text-xl sm:text-2xl md:text-4xl font-black text-black dark:text-white placeholder-transparent focus:ring-0 transition-all resize-none font-serif italic absolute top-0 left-0"
                          />
                        </div>
                        <div className="absolute bottom-4 left-4 md:bottom-12 md:left-12 pointer-events-none">
                          <span
                            className={`text-sm md:text-sm font-black uppercase tracking-widest ${input.length >= MAX_CHARS ? "text-red-500" : "text-black/40 dark:text-white/40"}`}
                          >
                            {input.length} / {MAX_CHARS}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleStart}
                          disabled={!input.trim()}
                          title="Send mission"
                          className="absolute bottom-4 right-4 md:bottom-12 md:right-12 p-4 md:p-8 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-20 disabled:grayscale text-white dark:text-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg overflow-hidden"
                        >
                          <AnimatedSendIcon />
                        </button>
                      </div>
                      <p className="mt-4 md:mt-8 text-sm md:text-sm font-black text-black/20 dark:text-white/20 uppercase tracking-[0.2em] block text-center">
                        Versleutelde sessie. Data wordt alleen lokaal
                        opgeslagen.
                      </p>
                    </div>
                  ) : (
                    session.stage !== WorkflowStage.ERROR && (
                      <div className="animate-fade-in-up space-y-8 md:space-y-16 w-full pb-12">
                        <div className="bg-white/40 dark:bg-zinc-900/40 border-2 border-black/5 dark:border-white/5 rounded-xl p-6 md:p-12 text-center backdrop-blur-sm">
                          <span className="text-sm md:text-sm font-black text-black/20 dark:text-white/20 uppercase tracking-[0.3em] mb-4 block border-b border-black/5 pb-2 mx-auto w-fit italic">
                            Deliberation Protocol Active
                          </span>
                          <p className="text-2xl sm:text-3xl md:text-5xl text-black dark:text-white font-serif italic font-medium tracking-tight leading-tight">
                            "{session.query}"
                          </p>
                        </div>

                        {(session.stage === WorkflowStage.SYNTHESIZING ||
                          session.stage === WorkflowStage.COMPLETED) && (
                          <div className="w-full bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
                            <div className="bg-black dark:bg-white text-white dark:text-black p-4 md:p-8 flex items-center gap-4 border-b-2">
                              <Gavel className="w-6 h-6 md:w-8 md:h-8" />
                              <h3 className="font-black text-lg md:text-2xl uppercase tracking-widest">
                                Chairman's Verdict
                              </h3>
                            </div>
                            <div className="p-6 md:p-16 prose prose-base md:prose-2xl max-w-none bg-white dark:bg-zinc-900 leading-relaxed">
                              {session.synthesis ? (
                                <ReactMarkdown>
                                  {session.synthesis}
                                </ReactMarkdown>
                              ) : (
                                <div className="h-40 flex flex-col items-center justify-center gap-4">
                                  <Loader2 className="animate-spin w-10 h-10" />
                                  <span className="font-black text-center uppercase tracking-widest">
                                    Merging Neural Logic States
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {config.activeCouncil.map((member) => (
                            <CouncilCard
                              key={member.id}
                              member={member}
                              response={session.councilResponses.find(
                                (r) => r.memberId === member.id,
                              )}
                              isLoading={
                                session.stage ===
                                  WorkflowStage.PROCESSING_COUNCIL &&
                                !session.councilResponses.find(
                                  (r) => r.memberId === member.id,
                                )
                              }
                              isExpanded={expandedCards.has(member.id)}
                              onToggle={() => toggleCard(member.id)}
                            />
                          ))}
                        </div>

                        {/* Debate or Verdict choice — shown after all nodes have responded */}
                        {session.stage === WorkflowStage.DEBATE && (
                          <div className="w-full bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 p-8 md:p-10 animate-in fade-in duration-500">
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-2 text-center">
                              Alle nodes hebben geanalyseerd
                            </p>
                            <p className="text-center text-sm font-bold text-black/60 dark:text-white/60 mb-8">
                              Wil je de AI's tegen elkaar laten debatteren, of direct het eindoordeel?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <button
                                type="button"
                                onClick={() => setIsDebateOpen(true)}
                                className="flex items-center justify-center gap-3 px-8 py-4 border-4 border-black dark:border-white bg-white dark:bg-zinc-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white font-black text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0_0_black] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] hover:shadow-none"
                              >
                                <Swords className="w-4 h-4" />
                                Live Debat Starten
                              </button>
                              <button
                                type="button"
                                onClick={() => runSynthesis(session.query, session.councilResponses, [])}
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]"
                              >
                                <Gavel className="w-4 h-4" />
                                Chairman's Verdict
                              </button>
                            </div>
                          </div>
                        )}

                        {session.stage === WorkflowStage.COMPLETED && (
                          <div className="flex justify-center pt-12">
                            <button
                              type="button"
                              onClick={() => {
                                setSession({
                                  id: crypto.randomUUID(),
                                  stage: WorkflowStage.IDLE,
                                  query: '',
                                  councilResponses: [],
                                  debateMessages: [],
                                  reviews: [],
                                  synthesis: ''
                                });
                                setInput('');
                              }}
                              className="px-10 py-6 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xl hover:scale-105 transition-all shadow-xl uppercase"
                            >
                              Initialize New Mission
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </>
            }
          />

          {/* Pricing / Tokens */}
          <Route
            path="/tokens"
            element={
              <>
                <SEO
                  title="Credits & Abonnementen"
                  description="Kies het pakket dat bij je past. Credits voor incidentele vragen of een maandelijks abonnement voor onbeperkte toegang."
                  canonical="/tokens"
                />
                <PricingPage
                  hasOwnKeys={Object.values(ModelProvider).some((p) =>
                    councilService.current.isProviderReady(p),
                  )}
                  onPurchaseTurns={(count: number | typeof Infinity) =>
                    handlePurchaseTurns(count as number)
                  }
                  onPurchaseCredits={(count: number) =>
                    handlePurchaseTurns(count)
                  }
                />
              </>
            }
          />

          {/* Kookboek */}
          <Route
            path="/cookbook"
            element={
              <CookbookPage
                onSelectMission={(query) => {
                  setInput(query);
                  navigate('/mission');
                }}
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AccountPage
                config={config}
                onUpdateConfig={(c) => setConfig(c)}
                history={history}
                onLoadSession={(s) => { setSession(s); navigate('/mission'); }}
                onDeleteSessions={(ids) => setHistory(h => h.filter(s => !ids.includes(s.id)))}
                onArchiveSessions={(ids) => setHistory(h => h.map(s => ids.includes(s.id) ? { ...s, isArchived: true } : s))}
              />
            }
          />

          {/* FAQ */}
          <Route path="/faq" element={<FAQPage />} />

          {/* Contact */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage onLoginSuccess={() => navigate('/')} />} />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* Payment Success — Stripe redirects here after checkout */}
          <Route
            path="/payment-success"
            element={<PaymentSuccessPage />}
          />

          {/* Vergelijkingspagina's */}
          <Route path="/vergelijk/chatgpt-vs-gemini-vs-claude" element={<ComparePage />} />
          <Route path="/vergelijk/beste-ai-tool-nederland" element={<BestAIToolPage />} />

          {/* Use-case pagina's */}
          <Route path="/gebruik/juridisch-advies-ai" element={<UseCaseLegalPage />} />
          <Route path="/gebruik/marketing-strategie-ai" element={<UseCaseMarketingPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>

      <footer className="border-t border-black/5 py-8 md:py-12 text-center">
        <span className="text-sm font-black uppercase tracking-widest text-black/30">{t.common.madeBy} MNRV</span>
      </footer>

      <PaywallModal
        isOpen={isPaywallOpen}
        hasOwnKeys={config.creditsRemaining > 0}
        onPurchaseTurns={handlePurchaseTurns}
        onClose={() => setIsPaywallOpen(false)}
      />


      <AdRewardModal
        isOpen={isAdOpen}
        onRewardEarned={handleAdReward}
        onDismiss={() => setIsAdOpen(false)}
      />

      <DebateRoom
        isOpen={isDebateOpen}
        session={session}
        config={config}
        councilService={councilService.current}
        onClose={() => setIsDebateOpen(false)}
        onEndDebate={handleEndDebate}
        onAddDebateMessage={handleAddDebateMessage}
      />

      <CookieConsent />
    </div>
  );
};

export default App;
