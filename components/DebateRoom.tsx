import { FC, useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X, Mic, MicOff, Volume2, VolumeX, Pause, Play, Gavel,
  Send, Timer, Users, Zap, StopCircle
} from 'lucide-react';
import { SessionState, CouncilMember, DebateMessage, AppConfig } from '../types';
import { UnifiedCouncilService } from '../services/councilService';

interface DebateRoomProps {
  isOpen: boolean;
  session: SessionState;
  config: AppConfig;
  councilService: UnifiedCouncilService;
  onClose: () => void;
  onEndDebate: (debateMessages: DebateMessage[]) => void;
  onAddDebateMessage: (msg: DebateMessage) => void;
}

const VOICE_PROFILES = [
  { pitch: 0.85, rate: 0.95 },
  { pitch: 1.15, rate: 1.0  },
  { pitch: 0.7,  rate: 0.9  },
  { pitch: 1.3,  rate: 1.0  },
  { pitch: 0.9,  rate: 0.95 },
  { pitch: 1.05, rate: 0.98 },
];

const DURATION_OPTIONS = [
  { label: '1 min',  seconds: 60 },
  { label: '5 min',  seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '∞',      seconds: -1 },
];

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(resolve => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    if (voices.length > 0) { resolve(voices); return; }
    const handler = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis?.addEventListener('voiceschanged', handler, { once: true });
    setTimeout(() => resolve(window.speechSynthesis?.getVoices() ?? []), 2000);
  });
}

// Speak text in Dutch and return a Promise that resolves when TTS finishes
function speakNL(
  text: string,
  nodeIdx: number,
  voices: SpeechSynthesisVoice[],
  profile: { pitch: number; rate: number }
): Promise<void> {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();

    const clean = text
      .replace(/[#*`_>~\[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 400);

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'nl-NL';

    // Prefer Dutch voices; fall back to any available
    const nlVoices = voices.filter(v => v.lang.startsWith('nl'));
    const pool = nlVoices.length > 0 ? nlVoices : voices;
    if (pool.length > 0) utter.voice = pool[nodeIdx % pool.length];

    utter.pitch  = profile.pitch;
    utter.rate   = profile.rate;
    utter.volume = 1;
    utter.onend  = () => resolve();
    utter.onerror = () => resolve();

    window.speechSynthesis.speak(utter);
  });
}

export const DebateRoom: FC<DebateRoomProps> = ({
  isOpen, session, config, councilService,
  onClose, onEndDebate, onAddDebateMessage,
}) => {
  const [messages, setMessages]               = useState<DebateMessage[]>([]);
  const [userInput, setUserInput]             = useState('');
  const [isPaused, setIsPaused]               = useState(false);
  const [isGenerating, setIsGenerating]       = useState(false);
  const [generatingSpeaker, setGeneratingSpeaker] = useState<CouncilMember | null>(null);
  const [voiceEnabled, setVoiceEnabled]       = useState(true);
  const [micActive, setMicActive]             = useState(false);
  const [duration, setDuration]               = useState(300);
  const [timeLeft, setTimeLeft]               = useState(300);
  const [phase, setPhase]                     = useState<'pick' | 'live'>('pick');
  const [cachedVoices, setCachedVoices]       = useState<SpeechSynthesisVoice[]>([]);

  const messagesRef      = useRef<DebateMessage[]>([]);
  const speakerIdxRef    = useRef(0);
  const isRunningRef     = useRef(false);
  const isPausedRef      = useRef(false);
  const voiceEnabledRef  = useRef(true);
  const isMountedRef     = useRef(true);
  const scrollRef        = useRef<HTMLDivElement>(null);
  const loopTimerRef     = useRef<NodeJS.Timeout | null>(null);
  const countdownRef     = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef   = useRef<any>(null);

  const readyMembers = councilService.getReadyMembers(config.activeCouncil);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  useEffect(() => {
    isMountedRef.current = true;
    getVoices().then(v => { if (isMountedRef.current) setCachedVoices(v); });
    return () => {
      isMountedRef.current = false;
      stopLoop();
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setMessages([]);
    messagesRef.current = [];
    setUserInput('');
    setIsPaused(false);
    isPausedRef.current = false;
    setIsGenerating(false);
    setPhase('pick');
    speakerIdxRef.current = 0;
    isRunningRef.current = false;
    window.speechSynthesis?.cancel();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isGenerating]);

  // ── Core turn runner — waits for TTS before scheduling next ──────────────
  const runNextTurn = useCallback(async () => {
    if (!isRunningRef.current || isPausedRef.current) {
      if (isRunningRef.current) loopTimerRef.current = setTimeout(runNextTurn, 800);
      return;
    }
    if (!isMountedRef.current) return;

    const speaker = readyMembers[speakerIdxRef.current % readyMembers.length];
    setIsGenerating(true);
    setGeneratingSpeaker(speaker);

    try {
      const response = await councilService.generateDebateResponse(
        session.query,
        speaker,
        session.councilResponses,
        messagesRef.current,
        readyMembers
      );

      if (!isMountedRef.current || !isRunningRef.current) return;

      const msg: DebateMessage = {
        id: `${Date.now()}-${Math.random()}`,
        memberId: speaker.id,
        content: response,
        timestamp: Date.now(),
      };

      messagesRef.current = [...messagesRef.current, msg];
      setMessages([...messagesRef.current]);
      onAddDebateMessage(msg);
      speakerIdxRef.current += 1;

      // Speak and wait — only then schedule next turn
      if (voiceEnabledRef.current) {
        const speakerIdx = readyMembers.findIndex(m => m.id === speaker.id);
        const profile = VOICE_PROFILES[(speakerIdx >= 0 ? speakerIdx : 0) % VOICE_PROFILES.length];
        await speakNL(response, speakerIdx >= 0 ? speakerIdx : 0, cachedVoices, profile);
      }

    } catch (err) {
      console.error('Debatfout:', err);
    } finally {
      if (isMountedRef.current) {
        setIsGenerating(false);
        setGeneratingSpeaker(null);
      }
    }

    // Natural pause between turns (1.5s after TTS ends)
    if (isRunningRef.current && isMountedRef.current) {
      loopTimerRef.current = setTimeout(runNextTurn, 1500);
    }
  }, [readyMembers, session, councilService, cachedVoices, onAddDebateMessage]);

  const handleEndRef = useRef<() => void>(() => {});

  const handleEnd = useCallback(() => {
    isRunningRef.current = false;
    if (loopTimerRef.current)  { clearTimeout(loopTimerRef.current);  loopTimerRef.current = null; }
    if (countdownRef.current)  { clearTimeout(countdownRef.current);  countdownRef.current = null; }
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    onEndDebate([...messagesRef.current]);
  }, [onEndDebate]);

  useEffect(() => { handleEndRef.current = handleEnd; }, [handleEnd]);

  const startCountdown = useCallback((seconds: number) => {
    if (seconds < 0) return;
    setTimeLeft(seconds);
    const tick = () => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleEndRef.current(); return 0; }
        countdownRef.current = setTimeout(tick, 1000);
        return prev - 1;
      });
    };
    countdownRef.current = setTimeout(tick, 1000);
  }, []);

  const stopLoop = () => {
    isRunningRef.current = false;
    if (loopTimerRef.current)  { clearTimeout(loopTimerRef.current);  loopTimerRef.current = null; }
    if (countdownRef.current)  { clearTimeout(countdownRef.current);  countdownRef.current = null; }
  };

  const handleStart = () => {
    isRunningRef.current = true;
    isPausedRef.current  = false;
    setIsPaused(false);
    setPhase('live');
    startCountdown(duration);
    loopTimerRef.current = setTimeout(runNextTurn, 200);
  };

  const togglePause = () => {
    const next = !isPausedRef.current;
    isPausedRef.current = next;
    setIsPaused(next);
    if (!next && isRunningRef.current) {
      window.speechSynthesis?.cancel();
      loopTimerRef.current = setTimeout(runNextTurn, 200);
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  const handleSend = useCallback(() => {
    const text = userInput.trim();
    if (!text) return;
    const msg: DebateMessage = {
      id: `user-${Date.now()}`,
      memberId: 'user',
      content: text,
      timestamp: Date.now(),
    };
    window.speechSynthesis?.cancel();
    messagesRef.current = [...messagesRef.current, msg];
    setMessages([...messagesRef.current]);
    onAddDebateMessage(msg);
    setUserInput('');
    if (isPausedRef.current) { isPausedRef.current = false; setIsPaused(false); }
    if (isRunningRef.current) {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      loopTimerRef.current = setTimeout(runNextTurn, 300);
    }
  }, [userInput, onAddDebateMessage, runNextTurn]);

  const toggleMic = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Spraakherkenning niet ondersteund — gebruik Chrome of Edge.'); return; }

    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      return;
    }

    const r = new SR();
    r.lang = 'nl-NL';
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e: any) => {
      const t = e.results[0]?.[0]?.transcript?.trim();
      if (t) {
        const msg: DebateMessage = { id: `user-${Date.now()}`, memberId: 'user', content: t, timestamp: Date.now() };
        window.speechSynthesis?.cancel();
        messagesRef.current = [...messagesRef.current, msg];
        setMessages([...messagesRef.current]);
        onAddDebateMessage(msg);
        if (isRunningRef.current) {
          if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
          loopTimerRef.current = setTimeout(runNextTurn, 300);
        }
      }
      setMicActive(false);
    };
    r.onerror = () => setMicActive(false);
    r.onend   = () => setMicActive(false);
    recognitionRef.current = r;
    r.start();
    setMicActive(true);
  }, [micActive, onAddDebateMessage, runNextTurn]);

  if (!isOpen) return null;

  const fmtTime = (s: number) => {
    if (s < 0) return '∞';
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const nlVoiceCount = cachedVoices.filter(v => v.lang.startsWith('nl')).length;

  const ACCENT = [
    'border-l-blue-400', 'border-l-purple-400', 'border-l-amber-400',
    'border-l-emerald-400', 'border-l-rose-400', 'border-l-cyan-400',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl">
      <div className="w-full max-w-3xl h-[100dvh] sm:h-[92vh] bg-[#f5f4f0] dark:bg-zinc-950 border-0 sm:border-4 border-black dark:border-white/20 sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="bg-black dark:bg-zinc-900 border-b-2 dark:border-white/10 text-white px-5 py-3.5 flex items-center gap-3 shrink-0">
          <Zap className="w-4 h-4 shrink-0 opacity-70" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-xs uppercase tracking-[0.35em] text-white/40">Live Debat</p>
            <p className="font-serif italic text-sm truncate text-white/80 leading-tight">"{session.query}"</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {phase === 'live' && (
              <>
                <span className={`font-mono font-black text-lg tabular-nums ${duration >= 0 && timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-white/70'}`}>
                  {fmtTime(timeLeft)}
                </span>
                <button type="button" onClick={() => { setVoiceEnabled(v => !v); if (voiceEnabledRef.current) window.speechSynthesis?.cancel(); voiceEnabledRef.current = !voiceEnabledRef.current; }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title={voiceEnabled ? 'Geluid uit' : 'Geluid aan'}>
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-40" />}
                </button>
                <button type="button" onClick={togglePause} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title={isPaused ? 'Hervatten' : 'Pauzeren'}>
                  {isPaused ? <Play className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4" />}
                </button>
                <button type="button" onClick={handleEnd} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-all" title="Debat beëindigen en oordeel ophalen">
                  <Gavel className="w-3 h-3" /> Oordeel
                </button>
              </>
            )}
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-1" title="Debatruimte sluiten">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Duurkiezer ─────────────────────────────────────────── */}
        {phase === 'pick' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
            <div className="text-center">
              <Timer className="w-10 h-10 mx-auto mb-4 text-black dark:text-white opacity-60" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white">Hoe lang?</h2>
              <p className="text-sm text-black/40 dark:text-white/40 mt-1">Je kunt het debat altijd vroegtijdig beëindigen.</p>
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
              {DURATION_OPTIONS.map(opt => (
                <button type="button" key={opt.label} onClick={() => setDuration(opt.seconds)}
                  className={`py-5 rounded-2xl border-4 font-black text-base uppercase transition-all ${
                    duration === opt.seconds
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white scale-105'
                      : 'bg-white dark:bg-zinc-900 text-black dark:text-white border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/25 dark:text-white/25">
              <span>{readyMembers.length} deelnemers</span>
              <span>·</span>
              <span>{nlVoiceCount > 0 ? `${nlVoiceCount} Nederlandse stemmen` : 'Standaard stemmen'}</span>
            </div>
            <button type="button" onClick={handleStart}
              className="px-14 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.12)]">
              Debat starten
            </button>
          </div>
        )}

        {/* ── Chat ──────────────────────────────────────────────── */}
        {phase === 'live' && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-zinc-50 dark:bg-zinc-900">

              {isPaused && (
                <div className="sticky top-0 text-center py-1.5 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
                  ⏸ Gepauzeerd — hervat of typ hieronder
                </div>
              )}

              {messages.map((msg, i) => {
                const isUser  = msg.memberId === 'user';
                const member  = isUser ? null : config.activeCouncil.find(m => m.id === msg.memberId);
                const nodeIdx = isUser ? -1 : readyMembers.findIndex(m => m.id === msg.memberId);
                const accent  = nodeIdx >= 0 ? ACCENT[nodeIdx % ACCENT.length] : '';

                return (
                  <div key={msg.id} className={`flex gap-2.5 items-end [animation-delay:${Math.min(i * 20, 200)}ms] ${isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 ${isUser ? 'border-black dark:border-white bg-black dark:bg-white' : 'border-zinc-300 dark:border-zinc-600'} flex items-center justify-center`}>
                      {isUser
                        ? <Users className="w-4 h-4 text-white dark:text-black" />
                        : <img src={member?.avatar} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <span className="text-xs font-black uppercase tracking-widest text-black/25 dark:text-white/25 mb-0.5 px-0.5">
                        {isUser ? 'Jij' : member?.name}
                      </span>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-sm shadow-md'
                            : `bg-white dark:bg-zinc-800 text-black dark:text-white rounded-bl-sm border-l-4 ${accent} cursor-pointer hover:brightness-95 dark:hover:brightness-110 transition-all shadow-sm`
                        }`}
                        onClick={() => !isUser && setUserInput(prev => `${prev}> ${member?.name}: "${msg.content.substring(0, 60)}..."\n\n`)}
                        title={!isUser ? 'Klik om te citeren' : ''}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isGenerating && !isPaused && (
                <div className="flex gap-2.5 items-end">
                  <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 border-zinc-300 dark:border-zinc-600">
                    {generatingSpeaker
                      ? <img src={generatingSpeaker.avatar} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />}
                  </div>
                  <div className="flex flex-col items-start">
                    {generatingSpeaker && (
                      <span className="text-xs font-black uppercase tracking-widest text-black/25 dark:text-white/25 mb-0.5 px-0.5">
                        {generatingSpeaker.name}
                      </span>
                    )}
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-zinc-800 border-l-4 border-l-zinc-300 dark:border-l-zinc-500 shadow-sm">
                      <div className="flex gap-1 items-center h-3">
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 0 && !isGenerating && (
                <div className="text-center py-12 text-black/20 dark:text-white/20">
                  <p className="font-black text-sm uppercase tracking-widest animate-pulse">Deelnemers formuleren hun openingsstandpunt...</p>
                </div>
              )}
            </div>

            {/* ── Invoerbalk ─────────────────────────────────────── */}
            <div className="bg-white dark:bg-zinc-950 border-t-2 border-black/10 dark:border-zinc-800 px-3 py-2.5 flex gap-2 items-center shrink-0">
              <button type="button" onClick={toggleMic}
                className={`p-2.5 rounded-xl border-2 transition-all shrink-0 ${micActive ? 'bg-red-500 border-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-black/40 dark:text-white/40 hover:border-black dark:hover:border-white'}`}
                title={micActive ? 'Stop opname' : 'Spreek in'}>
                {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input type="text" value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Doe mee — zeg wat je denkt..."
                className="flex-1 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:border-black dark:focus:border-white outline-none transition-all" />

              <button type="button" onClick={handleSend} disabled={!userInput.trim()} title="Verstuur bericht"
                className="p-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-80 disabled:opacity-20 transition-all shrink-0">
                <Send className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleEnd}
                className="p-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-white transition-all shrink-0" title="Beëindigen en samenvatten">
                <StopCircle className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
