
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
const AiTermsPage = lazy(() => import("./components/AiTermsPage").then(m => ({ default: m.AiTermsPage })));
const CookieDeclarationPage = lazy(() => import("./components/CookieDeclarationPage").then(m => ({ default: m.CookieDeclarationPage })));
import { DebateRoom } from "./components/DebateRoom";
import { CompositionStage } from "./components/CompositionStage";
import { ComparePage } from "./components/ComparePage";
const BestAIToolPage = lazy(() => import("./components/BestAIToolPage").then(m => ({ default: m.BestAIToolPage })));
const UseCaseLegalPage = lazy(() => import("./components/UseCaseLegalPage").then(m => ({ default: m.UseCaseLegalPage })));
const UseCaseMarketingPage = lazy(() => import("./components/UseCaseMarketingPage").then(m => ({ default: m.UseCaseMarketingPage })));
const UseCaseHRPage = lazy(() => import("./components/UseCaseHRPage").then(m => ({ default: m.UseCaseHRPage })));
const UseCaseFinancePage = lazy(() => import("./components/UseCaseFinancePage").then(m => ({ default: m.UseCaseFinancePage })));
const CompareVsChatGPTPage = lazy(() => import("./components/CompareVsChatGPTPage").then(m => ({ default: m.CompareVsChatGPTPage })));
const CompareMultiModelPage = lazy(() => import("./components/CompareMultiModelPage").then(m => ({ default: m.CompareMultiModelPage })));
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
  Link,
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
      <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0_0_var(--color-accent)]">
        <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-white" />
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
        <p className="text-base font-black uppercase tracking-widest text-black mb-8">
          Credits worden opgeslagen in jouw browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-black text-white font-black text-base uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-black transition-all"
          >
            Naar Mijn FAINL's
        </button>
        <button
          type="button"
          onClick={() => navigate('/mission')}
          className="px-8 py-4 bg-black border-2 border-black text-white font-black text-base uppercase tracking-widest hover:shadow-[4px_4px_0_0_black] transition-all"
        >
          Nieuwe vraag stellen
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [showOutofCreditsUpsell, setShowOutofCreditsUpsell] = useState(false);
  const pendingQueryRef = useRef<string>('');
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ credits_remaining: number; total_turns_used: number; is_lifetime: boolean; has_watched_ad: boolean } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
      fetchProfile(session?.user?.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      fetchProfile(session?.user?.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId?: string) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
    if (error) {
      // If no profile exists yet, create one
      if (error.code === 'PGRST116') {
         const { data: newProfile } = await supabase.from('user_profiles').insert({
           id: userId,
           credits_remaining: 0,
           total_turns_used: 0,
           is_lifetime: false,
           has_watched_ad: false
         }).select().single();
         if (newProfile) setProfile(newProfile);
      }
    } else if (data) {
      setProfile(data);
    }
  };

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
  const verdictRef = useRef<HTMLDivElement>(null);
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
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: newsletterEmail.trim().toLowerCase(),
        promo_code: 'promo_1T9tKD2Z8WgVHOZM0xJIa5Py',
        source: 'announcement_banner',
      });
      
      if (error) {
        if (error.code === '23505') {
          setNewsletterState('success');
        } else {
          alert(`Fout bij aanmelden: ${error.message}`);
          setNewsletterState('banner');
        }
        return;
      }
      
      setNewsletterState('success');
      localStorage.setItem('fainl_visited', '1');
    } catch (err: any) {
      alert(`Er ging iets mis: ${err.message}`);
      setNewsletterState('banner');
    }
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

    // Deduct credit Server-Side first if logged in
    if (authSession?.user && profile) {
      if (profile.credits_remaining > 0) {
        const { error } = await supabase.from('user_profiles').update({
          credits_remaining: profile.credits_remaining - USAGE_LIMITS.CREDITS_PER_TURN
        }).eq('id', authSession.user.id);
        if (!error) setProfile(p => p ? { ...p, credits_remaining: p.credits_remaining - USAGE_LIMITS.CREDITS_PER_TURN } : null);
      } else {
        const { error } = await supabase.from('user_profiles').update({
          total_turns_used: profile.total_turns_used + 1
        }).eq('id', authSession.user.id);
        if (!error) setProfile(p => p ? { ...p, total_turns_used: p.total_turns_used + 1 } : null);
      }
    } else {
      // Fallback local storage for backward compat edge cases, though handleStart blocks it.
      setConfig((current: AppConfig) => {
        if (current.creditsRemaining > 0) {
          return { ...current, creditsRemaining: current.creditsRemaining - USAGE_LIMITS.CREDITS_PER_TURN };
        } else {
          return { ...current, turnsUsed: current.turnsUsed + 1 };
        }
      });
    }

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

    if (!authSession) {
       // Force login to start session to prevent incognito abuse
       setIsPaywallOpen(true);
       return;
    }

    const currentCredits = profile ? profile.credits_remaining : config.creditsRemaining;
    const currentTurns = profile ? profile.total_turns_used : config.turnsUsed;
    const isLifetime = profile ? profile.is_lifetime : config.isLifetime;
    const hasWatchedAd = profile ? profile.has_watched_ad : config.hasWatchedAd;

    const hasCredits = currentCredits > 0;
    const hasTurnsRemaining = currentTurns < config.totalTurnsAllowed;
    const isAllowed = isLifetime || hasTurnsRemaining || hasCredits;

    if (!isAllowed) {
      setIsPaywallOpen(true);
      return;
    }

    // 2e gratis sessie vereist het bekijken van een advertentie
    if (currentTurns === 1 && !hasWatchedAd && !isLifetime && !hasCredits) {
      pendingQueryRef.current = input;
      setIsAdOpen(true);
      return;
    }

    await startSession(input);
  };

  const handleAdReward = async () => {
    if (authSession?.user) {
      await supabase.from('user_profiles').update({ has_watched_ad: true }).eq('id', authSession.user.id);
      setProfile(p => p ? { ...p, has_watched_ad: true } : null);
    } else {
      setConfig((prev: AppConfig) => {
        const updated = { ...prev, hasWatchedAd: true };
        localStorage.setItem('fainl_config_v2', JSON.stringify(updated));
        return updated;
      });
    }
    setIsAdOpen(false);
    startSession(pendingQueryRef.current);
  };

  const handleCompose = async (composedText: string) => {
    setSession((prev: SessionState) => ({ 
      ...prev, 
      userComposedResponse: composedText,
      stage: WorkflowStage.SYNTHESIZING 
    }));
    await runSynthesis(session.query, session.councilResponses, session.debateMessages, composedText);
  };

  // Single synthesis entry point — used by both "Get Verdict" and "After Debate"
  const runSynthesis = async (query: string, responses: CouncilResponse[], debateMsgs: import('./types').DebateMessage[], userComposed?: string) => {
    const readyForSynth = councilService.current.getReadyMembers(config.activeCouncil);
    const membersForSynth = readyForSynth.length > 0 ? readyForSynth : config.activeCouncil;
    setSession((prev: SessionState) => ({ ...prev, stage: WorkflowStage.SYNTHESIZING, synthesis: '' }));
    // Scroll verdict into view after a short tick so the DOM has updated
    setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
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
        },
        userComposed
      );
      setSession((prev: SessionState) => {
        const completedSession = { ...prev, synthesis, stage: WorkflowStage.COMPLETED, timestamp: Date.now() };
        setHistory((h: SessionState[]) => [completedSession, ...h]);
        return completedSession;
      });
      
      // Trigger Upsell if that was the last credit (and not on lifetime)
      const isNowZero = profile ? profile.credits_remaining === 0 : config.creditsRemaining === 0;
      const wasLifetime = profile ? profile.is_lifetime : config.isLifetime;
      const wasGreaterThanZeroBefore = profile ? (profile.credits_remaining + USAGE_LIMITS.CREDITS_PER_TURN > 0) : (config.creditsRemaining + USAGE_LIMITS.CREDITS_PER_TURN > 0);

      if (isNowZero && !wasLifetime && wasGreaterThanZeroBefore /* meaning it was > 0 before startSession */) {
          setTimeout(() => setShowOutofCreditsUpsell(true), 3000);
      }

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
    setSession((prev: SessionState) => ({ ...prev, debateMessages, stage: WorkflowStage.COMPOSITION }));
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
    { id: "/",          label: "Home",               img: "/icons-navbar/home-icons.png" },
    { id: "/tokens",    label: "Credits",             img: "/icons-navbar/Euro-icon.png" },
    { id: "/dashboard", label: "Mijn FAINL's",        img: "/icons-navbar/settings-icon.png" },
    { id: "/cookbook",  label: "Voorbeeldvragen",     img: "/icons-navbar/question-icon.png" },
    { id: "/faq",       label: "FAQ",                 img: "/icons-navbar/faq-icon.png" },
    { id: "/contact",   label: "Contact",             img: "/icons-navbar/contact-icon.png" },
  ];


  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col font-sans selection:bg-[var(--color-accent)] selection:text-black overflow-x-hidden transition-colors duration-300">
      <header className="border-b border-black/10 dark:border-[var(--color-accent)] bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <button type="button" onClick={() => navigate("/")} aria-label="FAINL — naar startpagina" className="flex items-center group">
            <LogoSwitch />
          </button>

          {/* Hamburger — always visible */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu openen"
            className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Sidebar overlay ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-72 sm:w-80 h-full bg-white dark:bg-black border-l-4 border-black flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 dark:border-white/10">
              <button type="button" onClick={() => { navigate('/'); setIsMenuOpen(false); }} aria-label="Home" className="flex items-center group">
                <LogoSwitch />
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Menu sluiten"
                className="p-2 rounded-lg text-black dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
              {NavLinks.map(link => {
                const isActive = location.pathname === link.id;
                return (
                  <button
                    type="button"
                    key={link.id}
                    onClick={() => { navigate(link.id); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-none font-black text-lg md:text-xl uppercase tracking-widest transition-all ${
                      isActive
                        ? 'bg-black text-white shadow-[4px_4px_0px_0px_var(--color-accent)]'
                        : 'text-black dark:text-white/60 hover:bg-[var(--color-accent)] hover:text-black'
                    }`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${isActive ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'}`}>
                      <img
                        src={link.img}
                        alt=""
                        aria-hidden="true"
                        className={`w-4 h-4 object-contain ${isActive ? 'invert dark:invert-0' : 'dark:invert'}`}
                      />
                    </span>
                    {link.label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
                  </button>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div className="px-4 py-5 border-t border-black/10 dark:border-white/10 space-y-4">
              {/* Social icons */}
              <div className="flex items-center justify-center gap-3">
                {[
                  { src: '/social-icons/instagram-icon.png', label: 'Instagram' },
                  { src: '/social-icons/facebook-icon.png',  label: 'Facebook' },
                  { src: '/social-icons/linkedin-icon.png',  label: 'LinkedIn' },
                  { src: '/social-icons/whatsapp-icon.png',  label: 'WhatsApp' },
                  { src: '/social-icons/email-icon.png',     label: 'E-mail' },
                ].map(({ src, label }) => (
                  <a key={label} href="#" aria-label={label}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                    <img src={src} alt={label} className="w-4 h-4 object-contain dark:invert" />
                  </a>
                ))}
              </div>

              {authSession && (
                <button
                  type="button"
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-black text-sm uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-950/50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.signOut}
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {isAnnouncementVisible && newsletterState !== 'success' && (
        <div className="w-full bg-[var(--color-accent)] text-black px-4 py-4 relative border-b-4 border-black">
          {newsletterState === 'banner' && (
            <div className="flex items-center justify-center gap-4 text-xl md:text-2xl font-black uppercase tracking-widest">
              <span>★</span>
              <span>15% korting op je eerste aankoop</span>
              <span className="text-black hidden sm:inline">—</span>
              <button
                type="button"
                onClick={() => setNewsletterState('form')}
                className="underline hover:text-white transition-colors hidden sm:inline"
              >
                Aanmelden voor nieuwsbrief
              </button>
            </div>
          )}
          {(newsletterState === 'form' || newsletterState === 'submitting') && (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center justify-center gap-4 flex-wrap">
              <span className="text-black text-lg font-black uppercase tracking-widest whitespace-nowrap">★ 15% korting</span>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="jouw@email.nl"
                className="bg-white border-4 border-black text-black placeholder-black/40 text-xl px-6 py-3 outline-none focus:shadow-[4px_4px_0_0_black] transition-all w-80"
              />
              <button
                type="submit"
                disabled={newsletterState === 'submitting'}
                className="bg-black text-white text-xl font-black uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-60 border-4 border-black"
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
        <div className="w-full bg-white text-black px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest relative">
          <span>✓ Aangemeld!</span>
          <span className="text-black">Jouw kortingscode:</span>
          <span className="bg-black text-white px-2 py-0.5 font-mono tracking-normal select-all">promo_1T9tKD2Z8WgVHOZM0xJIa5Py</span>
          <button
            type="button"
            onClick={() => setIsAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-black transition-colors"
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
                  {session.stage === WorkflowStage.ERROR && (
                    <div className="w-full max-w-xl bg-white dark:bg-black border-2 md:border-4 border-black dark:border-[var(--color-accent)]/40 p-6 md:p-12 rounded-none text-center animate-fade-in-up">
                      <AlertTriangle className="w-12 h-12 md:w-20 md:h-20 text-black dark:text-white mb-6 md:mb-8 mx-auto" />
                      <h3 className="text-xl md:text-3xl font-black uppercase mb-3 md:mb-4 tracking-tighter">
                        Er ging iets mis
                      </h3>
                      <p className="text-black dark:text-white/50 font-bold mb-6 md:mb-10 leading-relaxed text-sm md:text-lg">
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
                          className="px-6 py-3 md:px-10 md:py-5 bg-white dark:bg-black border-2 border-black dark:border-[var(--color-accent)]/40 font-black rounded-none uppercase tracking-[0.2em] text-sm md:text-sm transition-all text-black dark:text-white hover:bg-[var(--color-accent)] hover:text-black"
                        >
                          Opnieuw proberen
                        </button>
                      </div>
                    </div>
                  )}

                  {session.stage === WorkflowStage.IDLE ? (
                    <div className="w-full">
                      {/* Intro header */}
                      <div className="text-center mb-12 md:mb-16">
                        <p className="text-lg font-black uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
                          {config.activeCouncil.length} AI-modellen analyseren tegelijk · Één eerlijk oordeel
                        </p>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-black dark:text-white leading-tight">
                          Wat wil jij weten?
                        </h1>
                      </div>

                      <div className="relative bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-zinc-700 rounded-xl p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] focus-within:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] md:focus-within:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:md:focus-within:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="relative w-full min-h-[200px] md:min-h-[350px]">
                          {!input && !isInputFocused && (
                            <div className="absolute top-0 left-0 pointer-events-none text-xl sm:text-2xl md:text-4xl font-black text-black/20 dark:text-white/20">
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
                              setInput(e.target.value)
                            }
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            aria-label="Stel je vraag aan de AI-raad"
                            placeholder="Stel je vraag..."
                            className="w-full h-full bg-transparent border-none p-0 text-xl sm:text-2xl md:text-4xl font-black text-black dark:text-white placeholder-transparent focus:ring-0 transition-all resize-none absolute top-0 left-0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleStart}
                          disabled={!input.trim()}
                          title="Verstuur vraag"
                          className="absolute bottom-4 right-4 md:bottom-12 md:right-12 p-4 md:p-8 bg-black dark:bg-[var(--color-accent)] hover:bg-[var(--color-accent)] dark:hover:bg-white disabled:opacity-20 disabled:grayscale text-white dark:text-black rounded-none transition-all hover:scale-105 active:scale-95 shadow-lg overflow-hidden border-2 border-black"
                        >
                          <AnimatedSendIcon />
                        </button>
                      </div>
                    </div>
                  ) : (
                    session.stage !== WorkflowStage.ERROR && (
                      <div className="animate-fade-in-up space-y-8 md:space-y-16 w-full pb-12">

                        {/* Query display */}
                        <div className="bg-white dark:bg-black border-4 border-black dark:border-[var(--color-accent)] rounded-none p-10 md:p-16 text-center shadow-[10px_10px_0_0_black] dark:shadow-[10px_10px_0_0_var(--color-accent)]">
                          <p className="text-base font-black uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">Jouw vraag</p>
                          <p className="text-3xl sm:text-5xl md:text-6xl text-black dark:text-white font-serif italic font-black tracking-tight leading-tight uppercase">
                            "{session.query}"
                          </p>
                        </div>

                        {/* Processing progress indicator */}
                        {session.stage === WorkflowStage.PROCESSING_COUNCIL && (
                          <div className="flex flex-col items-center gap-3 -mt-2">
                            <div className="flex items-center gap-2">
                              {config.activeCouncil.map((member, i) => {
                                const done = session.councilResponses.some(r => r.memberId === member.id);
                                const delayClass = i === 0 ? '[animation-delay:0ms]' : i === 1 ? '[animation-delay:150ms]' : '[animation-delay:300ms]';
                                return (
                                  <div key={member.id} className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${done ? 'bg-[var(--color-accent)] scale-125' : `bg-black/20 dark:bg-white/20 animate-pulse ${delayClass}`}`} />
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-black/40 dark:text-white/30">
                              {session.councilResponses.length} van {config.activeCouncil.length} analyses klaar
                            </span>
                          </div>
                        )}

                        {/* Council node cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {config.activeCouncil.map((member) => (
                            <CouncilCard
                              key={member.id}
                              member={member}
                              response={session.councilResponses.find(
                                (r) => r.memberId === member.id,
                              )}
                              isLoading={
                                session.stage === WorkflowStage.PROCESSING_COUNCIL &&
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
                           <div className="w-full bg-white dark:bg-black border-4 border-black dark:border-[var(--color-accent)] p-6 md:p-10 rounded-none animate-in fade-in duration-500 shadow-[8px_8px_0_0_var(--color-accent)]">
                            {/* Status badge */}
                            <div className="flex justify-center mb-6">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] border-2 border-black rounded-none">
                                <CircleCheck className="w-4 h-4 text-black shrink-0" />
                                <span className="text-sm font-black uppercase tracking-widest text-black">
                                  Alle {config.activeCouncil.length} analyses klaar
                                </span>
                              </div>
                            </div>

                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-center mb-3 text-black dark:text-white">
                              Wat wil je nu doen?
                            </h3>
                            <p className="text-base text-black/60 dark:text-white/50 font-bold text-center mb-8 max-w-lg mx-auto leading-snug">
                              Laat Victor direct oordelen — of stuur de AI's eerst het debat in voor diepere inzichten.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                              {/* Primary: Verdict */}
                               <button
                                 type="button"
                                 onClick={() => setSession(prev => ({ ...prev, stage: WorkflowStage.COMPOSITION }))}
                                 className="flex flex-col items-center gap-3 px-6 py-8 bg-black text-white font-black rounded-none transition-all hover:bg-[var(--color-accent)] hover:text-black hover:scale-[1.02] active:scale-95 shadow-[6px_6px_0_0_var(--color-accent)] border-4 border-black"
                               >
                                <Gavel className="w-8 h-8" />
                                <div className="text-center">
                                  <p className="text-base uppercase tracking-widest font-black">Eindoordeel</p>
                                  <p className="text-xs opacity-60 mt-1 font-bold leading-tight">Victor velt het definitieve oordeel</p>
                                </div>
                              </button>

                              {/* Secondary: Live Debate */}
                              <button
                                type="button"
                                onClick={() => setIsDebateOpen(true)}
                                className="flex flex-col items-center gap-3 px-6 py-8 bg-white dark:bg-black border-4 border-black dark:border-[var(--color-accent)] text-black dark:text-white font-black rounded-none transition-all hover:bg-[var(--color-accent)] hover:text-black hover:scale-[1.02] active:scale-95 shadow-[6px_6px_0_0_black] dark:shadow-[6px_6px_0_0_var(--color-accent)]"
                              >
                                <Swords className="w-8 h-8" />
                                <div className="text-center">
                                  <p className="text-base uppercase tracking-widest font-black">Live Debat</p>
                                  <p className="text-xs opacity-60 mt-1 font-bold leading-tight">Laat de AI's met elkaar in discussie gaan</p>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                         {session.stage === WorkflowStage.COMPOSITION && (
                           <CompositionStage
                             responses={session.councilResponses}
                             members={config.activeCouncil}
                             onCompose={handleCompose}
                           />
                         )}

                        {/* Victor's verdict — rendered BELOW the council cards so it appears naturally as user scrolls */}
                         {(session.stage === WorkflowStage.SYNTHESIZING ||
                           session.stage === WorkflowStage.COMPLETED) && (
                           <div ref={verdictRef} className="w-full bg-white dark:bg-black border-2 md:border-4 border-black dark:border-[var(--color-accent)]/40 rounded-none overflow-hidden shadow-[12px_12px_0_0_var(--color-accent)]">
                            {/* Verdict header */}
                            <div className="bg-black dark:bg-zinc-800 text-white px-6 md:px-10 py-5 md:py-7 flex items-center gap-4 border-b-2 border-black/20">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-zinc-700">
                                <img src={DEFAULT_CHAIRMAN.avatar} alt="Victor" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-black uppercase tracking-[0.35em] text-white/40 leading-none mb-1">Eindoordeel van de Raad</p>
                                <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight text-white leading-none flex items-center gap-3">
                                  <Gavel className="w-5 h-5 shrink-0 text-white/60" />
                                  Voorzitter Victor
                                </h3>
                              </div>
                              {session.stage === WorkflowStage.SYNTHESIZING && (
                                <div className="flex items-center gap-2 text-white/50 text-xs font-black uppercase tracking-widest shrink-0">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="hidden sm:inline">Verwerken…</span>
                                </div>
                              )}
                            </div>

                            {/* Verdict body */}
                            <div className="px-8 md:px-16 py-10 md:py-16 bg-white dark:bg-black">
                              {session.synthesis ? (
                                <div className="prose prose-xl max-w-none dark:prose-invert
                                  prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase
                                  prose-h2:text-4xl prose-h2:border-b-4 prose-h2:border-black dark:prose-h2:border-[var(--color-accent)] prose-h2:pb-4 prose-h2:mb-8 prose-h2:mt-16 first:prose-h2:mt-0
                                  prose-h3:text-2xl prose-h3:text-black dark:prose-h3:text-[var(--color-accent)] prose-h3:mt-12 prose-h3:mb-4
                                  prose-p:leading-relaxed prose-p:text-black dark:prose-p:text-white/80 prose-p:text-xl md:prose-p:text-2xl prose-p:font-bold
                                  prose-strong:text-black dark:prose-strong:text-[var(--color-accent)] prose-strong:font-black
                                  prose-blockquote:border-l-8 prose-blockquote:border-[var(--color-accent)] prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:rounded-none prose-blockquote:not-italic
                                  prose-li:text-black dark:prose-li:text-white/80 prose-li:my-2 prose-li:text-xl prose-li:font-bold
                                  prose-hr:border-black/10 dark:prose-hr:border-[var(--color-accent)]/20">
                                  <ReactMarkdown>{session.synthesis}</ReactMarkdown>
                                </div>
                              ) : (
                                <div className="h-52 flex flex-col items-center justify-center gap-5">
                                  <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-black/10 dark:border-white/10" />
                                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-black dark:border-t-white animate-spin" />
                                  </div>
                                  <div className="text-center">
                                    <p className="font-black text-sm uppercase tracking-[0.3em] text-black dark:text-white">Victor stelt het oordeel op</p>
                                    <p className="text-xs text-black dark:text-white/40 mt-1">Alle analyses worden gewogen en samengevat…</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Verdict footer — only when complete */}
                            {session.stage === WorkflowStage.COMPLETED && session.synthesis && (
                              <div className="px-6 md:px-12 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-700 flex items-center gap-2">
                                <CircleCheck className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white/40">
                                  Klaar — {config.activeCouncil.length} AI-modellen gehoord · Voorzitter Victor heeft geoordeeld
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {session.stage === WorkflowStage.COMPLETED && (
                          <div className="flex flex-col items-center gap-4 pt-8 pb-4 border-t border-black/5 dark:border-white/5">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-black dark:text-white/20">
                              Nog een vraag?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
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
                                 className="flex items-center gap-3 px-8 py-4 bg-[var(--color-accent)] text-black rounded-none font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[6px_6px_0_0_black]"
                              >
                                <ArrowRight className="w-4 h-4" />
                                Nieuwe vraag stellen
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate('/cookbook')}
                                 className="flex items-center gap-3 px-8 py-4 border-2 border-black/20 dark:border-white/20 text-black dark:text-white/50 rounded-none font-black text-sm uppercase tracking-widest hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all shadow-[4px_4px_0_0_black/5]"
                              >
                                Voorbeeldvragen bekijken
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
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
                  setSession({
                    id: crypto.randomUUID(),
                    stage: WorkflowStage.IDLE,
                    query: '',
                    councilResponses: [],
                    debateMessages: [],
                    reviews: [],
                    synthesis: '',
                  });
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

          {/* Pricing / Tokens */}
          <Route
            path="/tokens"
            element={
              <PricingPage
                hasOwnKeys={profile ? profile.credits_remaining > 0 : config.creditsRemaining > 0}
                onPurchaseTurns={handlePurchaseTurns}
                onPurchaseCredits={handlePurchaseTurns}
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
          <Route path="/ai-voorwaarden" element={<AiTermsPage />} />
          <Route path="/cookies" element={<CookieDeclarationPage />} />

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
          <Route path="/gebruik/hr-recruitment-ai" element={<UseCaseHRPage />} />
          <Route path="/gebruik/financiele-analyse-ai" element={<UseCaseFinancePage />} />
          <Route path="/vergelijken/fainl-vs-chatgpt" element={<CompareVsChatGPTPage />} />
          <Route path="/vergelijken/ai-modellen-vergelijken" element={<CompareMultiModelPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>

       <footer className="border-t-4 border-black dark:border-[var(--color-accent)] py-16 md:py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <p className="text-lg font-black uppercase tracking-[0.25em] text-[var(--color-accent)] mb-6">Product</p>
              <ul className="space-y-4">
                <li><Link to="/" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Home</Link></li>
                <li><Link to="/mission" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Start gratis</Link></li>
                <li><Link to="/cookbook" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Voorbeeldvragen</Link></li>
                <li><Link to="/tokens" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Prijzen</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-[0.25em] text-[var(--color-accent)] mb-6">Vergelijken</p>
              <ul className="space-y-4">
                <li><Link to="/vergelijken/fainl-vs-chatgpt" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">FAINL vs ChatGPT</Link></li>
                <li><Link to="/vergelijken/ai-modellen-vergelijken" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">AI modellen vergelijken</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-[0.25em] text-[var(--color-accent)] mb-6">Gebruik</p>
              <ul className="space-y-4">
                <li><Link to="/gebruik/juridisch-advies-ai" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">AI voor juridisch advies</Link></li>
                <li><Link to="/gebruik/marketing-strategie-ai" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">AI voor marketingstrategie</Link></li>
                <li><Link to="/gebruik/hr-recruitment-ai" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">AI voor HR & recruitment</Link></li>
                <li><Link to="/gebruik/financiele-analyse-ai" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">AI voor financiële analyse</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-[0.25em] text-[var(--color-accent)] mb-6">Info</p>
              <ul className="space-y-4">
                <li><Link to="/faq" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Privacyverklaring</Link></li>
                <li><Link to="/terms" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Algemene Voorwaarden</Link></li>
                <li><Link to="/ai-voorwaarden" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">AI-Gebruiksvoorwaarden</Link></li>
                <li><Link to="/cookies" className="text-lg font-bold text-black dark:text-white/60 hover:text-black dark:hover:text-[var(--color-accent)] transition-colors">Cookieverklaring</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t-4 border-black dark:border-[var(--color-accent)] pt-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <span className="text-lg font-black uppercase tracking-widest text-[var(--color-accent)]">© 2026 FAINL</span>
            <div className="flex items-center gap-6">
              {[
                { src: '/social-icons/instagram-icon.png', label: 'Instagram' },
                { src: '/social-icons/facebook-icon.png',  label: 'Facebook' },
                { src: '/social-icons/linkedin-icon.png',  label: 'LinkedIn' },
                { src: '/social-icons/whatsapp-icon.png',  label: 'WhatsApp' },
                { src: '/social-icons/email-icon.png',     label: 'E-mail' },
              ].map(({ src, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity bg-black dark:bg-white p-2 rounded-none border-2 border-black">
                  <img src={src} alt={label} className="w-6 h-6 object-contain grayscale brightness-0 invert dark:invert-0" />
                </a>
              ))}
            </div>
            <span className="text-lg font-black uppercase tracking-widest text-black dark:text-white/30">{t.common.madeBy} MNRV</span>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <a
        href="#"
        aria-label="Terug naar boven"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className={`scroll-up${showScrollTop ? ' _show-scroll' : ''}`}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="rgba(255,255,255,1)" d="M11.9997 10.8284L7.04996 15.7782L5.63574 14.364L11.9997 8L18.3637 14.364L16.9495 15.7782L11.9997 10.8284Z" />
        </svg>
      </a>

      <PaywallModal
        isOpen={isPaywallOpen}
        hasOwnKeys={profile ? profile.credits_remaining > 0 : config.creditsRemaining > 0}
        onPurchaseTurns={handlePurchaseTurns}
        onClose={() => setIsPaywallOpen(false)}
        authSession={authSession}
      />


      <AdRewardModal
        isOpen={isAdOpen}
        onRewardEarned={handleAdReward}
        onDismiss={() => setIsAdOpen(false)}
      />

      {/* Upsell Modal when last credit is used */}
      {showOutofCreditsUpsell && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-black border-4 border-black dark:border-[var(--color-accent)]/40 rounded-none w-full max-w-lg shadow-[24px_24px_0px_0px_var(--color-accent)] overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 md:p-16 text-center">
              <div className="w-24 h-24 bg-[var(--color-accent)] mx-auto rounded-none flex items-center justify-center border-4 border-black mb-10 shadow-[8px_8px_0_0_black]">
                <ZapIcon className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4">
                {language === 'nl' ? 'Dat was je laatste credit!' : 'That was your last credit!'}
              </h3>
              <p className="text-xl font-bold text-black dark:text-white/70 leading-relaxed mb-10">
                {language === 'nl' 
                  ? 'Je hebt zojuist je laatste premium FAINL vraag verbruikt. Tijd om op te waarderen voor je volgende diepe analyse?'
                  : 'You just used your last premium FAINL question. Time to recharge for your next deep analysis?'}
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setShowOutofCreditsUpsell(false);
                    navigate('/tokens');
                  }}
                  className="w-full py-6 bg-black text-white dark:bg-[var(--color-accent)] dark:text-black font-black text-xl uppercase tracking-widest rounded-none hover:scale-105 active:scale-95 transition-all shadow-[10px_10px_0_0_var(--color-accent)] border-4 border-black"
                >
                  {language === 'nl' ? 'Bekijk Pakketten' : 'View Packages'}
                </button>
                <button
                  onClick={() => setShowOutofCreditsUpsell(false)}
                  className="w-full py-4 bg-transparent text-black dark:text-white/40 hover:text-black dark:hover:text-[var(--color-accent)] font-black text-lg uppercase tracking-widest transition-colors"
                >
                  {language === 'nl' ? 'Nu niet, bedankt' : 'Not now, thanks'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
