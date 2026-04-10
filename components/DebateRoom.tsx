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
  { pitch: 0.8,  rate: 1.05 },
  { pitch: 1.25, rate: 1.1  },
  { pitch: 0.65, rate: 0.95 },
  { pitch: 1.45, rate: 1.15 },
  { pitch: 0.9,  rate: 1.0  },
  { pitch: 1.1,  rate: 1.08 },
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

export const DebateRoom: FC<DebateRoomProps> = ({
  isOpen, session, config, councilService,
  onClose, onEndDebate, onAddDebateMessage,
}) => {
  const [messages, setMessages]               = useState<DebateMessage[]>([]);
  const [userInput, setUserInput]             = useState('');
  const [isPaused, setIsPaused]               = useState(false);
  const [isGenerating, setIsGenerating]       = useState(false);
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

  const speak = useCallback((text: string, nodeIdx: number) => {
    if (!voiceEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*`_>~\[\]]/g, ' ').replace(/\s+/g, ' ').substring(0, 280);
    const utter  = new SpeechSynthesisUtterance(clean);
    const engVoices = cachedVoices.filter(v => v.lang.startsWith('en'));
    const pool  = engVoices.length > 0 ? engVoices : cachedVoices;
    if (pool.length > 0) utter.voice = pool[nodeIdx % pool.length];
    const p = VOICE_PROFILES[nodeIdx % VOICE_PROFILES.length];
    utter.pitch = p.pitch;
    utter.rate  = p.rate;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  }, [cachedVoices]);

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

  const runNextTurn = useCallback(async () => {
    if (!isRunningRef.current || isPausedRef.current) {
      if (isRunningRef.current) loopTimerRef.current = setTimeout(runNextTurn, 800);
      return;
    }

    if (!isMountedRef.current) return;

    const speaker = readyMembers[speakerIdxRef.current % readyMembers.length];
    setIsGenerating(true);

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

      const speakerIdx = readyMembers.findIndex(m => m.id === speaker.id);
      speak(response, speakerIdx >= 0 ? speakerIdx : 0);

      speakerIdxRef.current += 1;
    } catch (err) {
      console.error('Turn error', err);
    } finally {
      if (isMountedRef.current) setIsGenerating(false);
    }

    if (isRunningRef.current && isMountedRef.current) {
      loopTimerRef.current = setTimeout(runNextTurn, 400);
    }
  }, [readyMembers, session, councilService, speak, onAddDebateMessage]);

  const startCountdown = useCallback((seconds: number) => {
    if (seconds < 0) return;
    setTimeLeft(seconds);
    const tick = () => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleEndRef.current();
          return 0;
        }
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
    loopTimerRef.current = setTimeout(runNextTurn, 100);
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
    if (isPausedRef.current) {
      isPausedRef.current = false;
      setIsPaused(false);
    }
    if (isRunningRef.current) {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      loopTimerRef.current = setTimeout(runNextTurn, 200);
    }
  }, [userInput, onAddDebateMessage, runNextTurn]);

  const toggleMic = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported — use Chrome or Edge.'); return; }

    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      return;
    }

    const r = new SR();
    r.lang = 'en-US';
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
          loopTimerRef.current = setTimeout(runNextTurn, 200);
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

  const ACCENT = [
    'border-l-zinc-400', 'border-l-blue-400', 'border-l-amber-400',
    'border-l-emerald-400', 'border-l-rose-400', 'border-l-cyan-400',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-3xl h-[100dvh] sm:h-[92vh] bg-[#0c0c15] dark:bg-[#0c0c15] sm:border border-white/10 sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">

        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent shrink-0" />

        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/[0.06] px-5 py-3.5 flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-zinc-900/20 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-0.5">Live Debate Room</p>
            <p className="text-sm text-white/70 truncate leading-tight italic">"{session.query}"</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {phase === 'live' && (
              <>
                <span className={`font-mono font-bold text-base tabular-nums ${duration >= 0 && timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-white/60'}`}>
                  {fmtTime(timeLeft)}
                </span>
                <button
                  onClick={() => {
                    setVoiceEnabled(v => !v);
                    if (voiceEnabledRef.current) window.speechSynthesis?.cancel();
                    voiceEnabledRef.current = !voiceEnabledRef.current;
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title={voiceEnabled ? 'Mute voices' : 'Enable voices'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-40" />}
                </button>
                <button
                  onClick={togglePause}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleEnd}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs rounded-lg transition-all"
                  title="End debate and get final verdict"
                >
                  <Gavel className="w-3 h-3" /> Verdict
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white ml-1"
              title="Close debate room"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Duration Picker */}
        {phase === 'pick' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900/20 flex items-center justify-center mx-auto mb-5">
                <Timer className="w-7 h-7 text-zinc-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">How long should they debate?</h2>
              <p className="text-sm text-white/40">You can always end it early.</p>
            </div>

            <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setDuration(opt.seconds)}
                  className={`py-5 rounded-2xl border-2 font-bold text-base transition-all ${
                    duration === opt.seconds
                      ? 'bg-zinc-900 text-white border-zinc-900 scale-105 shadow-lg shadow-zinc-900/15'
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-zinc-800 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-white/25">
              <span>{readyMembers.length} members</span>
              <span>·</span>
              <span>{cachedVoices.filter(v => v.lang.startsWith('en')).length} voices ready</span>
            </div>

            <button
              onClick={handleStart}
              className="btn-violet px-14 py-4 rounded-2xl font-semibold text-base"
            >
              Start Debate
            </button>
          </div>
        )}

        {/* Chat */}
        {phase === 'live' && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-black/20">

              {isPaused && (
                <div className="sticky top-0 text-center py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-400">
                  Paused — resume or type a message below
                </div>
              )}

              {messages.map((msg, i) => {
                const isUser  = msg.memberId === 'user';
                const member  = isUser ? null : config.activeCouncil.find(m => m.id === msg.memberId);
                const nodeIdx = isUser ? -1 : readyMembers.findIndex(m => m.id === msg.memberId);
                const accent  = nodeIdx >= 0 ? ACCENT[nodeIdx % ACCENT.length] : '';

                return (
                  <div key={msg.id} className={`flex gap-2.5 items-end ${isUser ? 'flex-row-reverse' : ''}`}>

                    <div className={`w-8 h-8 rounded-full shrink-0 overflow-hidden border ${isUser ? 'border-zinc-800 bg-zinc-900' : 'border-white/10'} flex items-center justify-center`}>
                      {isUser
                        ? <Users className="w-4 h-4 text-white" />
                        : <img src={member?.avatar} alt="" className="w-full h-full object-cover" />
                      }
                    </div>

                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <span className="text-[10px] font-medium text-white/30 mb-1 px-0.5">
                        {isUser ? 'You' : member?.name}
                      </span>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? 'bg-zinc-900 text-white rounded-br-sm shadow-md'
                            : `bg-white/[0.07] text-white/90 rounded-bl-sm border-l-4 ${accent} cursor-pointer hover:bg-white/10 transition-all`
                        }`}
                        onClick={() => !isUser && setUserInput(prev => `${prev}> ${member?.name}: "${msg.content.substring(0, 60)}..."\n\n`)}
                        title={!isUser ? 'Click to quote' : ''}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isGenerating && !isPaused && (
                <div className="flex gap-2.5 items-end">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse shrink-0" />
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.07] border-l-4 border-l-zinc-400/40">
                    <div className="flex gap-1 items-center h-3">
                      <span className="w-1.5 h-1.5 bg-zinc-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 0 && !isGenerating && (
                <div className="text-center py-16 text-white/20">
                  <p className="text-sm animate-pulse">Getting things ready...</p>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="bg-black/30 border-t border-white/[0.06] px-3 py-3 flex gap-2 items-center shrink-0">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                  micActive
                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                }`}
                title={micActive ? 'Stop mic' : 'Use microphone'}
              >
                {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Join the debate — type your take..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all"
              />

              <button
                onClick={handleSend}
                disabled={!userInput.trim()}
                title="Send message"
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-1000 text-white disabled:opacity-30 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                onClick={handleEnd}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all shrink-0"
                title="End debate and get verdict"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
