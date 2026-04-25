import { FC, useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { CouncilMember, CouncilResponse } from '../types';
import { Bot, Cpu, CheckCircle2, Clock, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface CouncilCardProps {
  member: CouncilMember;
  response?: CouncilResponse;
  isLoading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  index?: number;
}

// Node accent colors matching CSS vars
const NODE_COLORS = [
  '#6366f1', '#8b5cf6', '#f59e0b',
  '#10b981', '#ef4444', '#06b6d4',
  '#ec4899', '#84cc16', '#f97316', '#a855f7',
];

const NODE_BG = [
  'rgba(99,102,241,0.12)',  'rgba(139,92,246,0.12)', 'rgba(245,158,11,0.12)',
  'rgba(16,185,129,0.12)', 'rgba(239,68,68,0.12)',   'rgba(6,182,212,0.12)',
  'rgba(236,72,153,0.12)', 'rgba(132,204,22,0.12)',  'rgba(249,115,22,0.12)', 'rgba(168,85,247,0.12)',
];

export const CouncilCard: FC<CouncilCardProps> = ({
  member,
  response,
  isLoading,
  isExpanded,
  onToggle,
  index = 0,
}) => {
  const accentColor = NODE_COLORS[index % NODE_COLORS.length];
  const accentBg    = NODE_BG[index % NODE_BG.length];

  const [copied, setCopied]         = useState(false);
  const [displayed, setDisplayed]   = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const typeRef                     = useRef<NodeJS.Timeout | null>(null);
  const prevContent                 = useRef<string>('');

  // Typewriter effect when response arrives
  useEffect(() => {
    if (!response?.content || response.content === prevContent.current) return;
    prevContent.current = response.content;
    setDisplayed('');
    setIsTyping(true);

    const full = response.content;
    let i = 0;
    const speed = Math.max(4, Math.min(18, Math.floor(40 / (full.length / 80))));

    const tick = () => {
      i += Math.ceil(full.length / 160); // chunk size scales with length
      if (i >= full.length) {
        setDisplayed(full);
        setIsTyping(false);
        return;
      }
      setDisplayed(full.slice(0, i));
      typeRef.current = setTimeout(tick, speed);
    };
    typeRef.current = setTimeout(tick, 60);
    return () => { if (typeRef.current) clearTimeout(typeRef.current); };
  }, [response?.content]);

  const handleCopy = () => {
    if (!response?.content) return;
    navigator.clipboard.writeText(response.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const elapsed = response
    ? ((response.timestamp - (response as any).startedAt || 0) / 1000).toFixed(1)
    : null;

  // Border glow
  const borderStyle: React.CSSProperties = isLoading
    ? { borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}33, 0 0 24px ${accentColor}18` }
    : response
    ? { borderColor: 'rgba(16,185,129,0.35)', boxShadow: '0 0 0 1px rgba(16,185,129,0.15), 0 0 20px rgba(16,185,129,0.06)' }
    : {};

  return (
    <div
      className="node-card card-shadow animate-fade-in-up flex flex-col"
      style={borderStyle}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          {isLoading && (
            <div
              className="absolute inset-0 rounded-full animate-node-pulse"
              style={{ boxShadow: `0 0 0 0 ${accentColor}` }}
            />
          )}
          <div
            className="w-10 h-10 rounded-full overflow-hidden ring-2 transition-all duration-300"
            style={{ boxShadow: isLoading ? `0 0 0 2px ${accentColor}60` : response ? '0 0 0 2px rgba(16,185,129,0.5)' : '0 0 0 1px rgba(255,255,255,0.08)' }}
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text)] text-sm truncate leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            {member.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Cpu className="w-2.5 h-2.5 opacity-40" style={{ color: accentColor }} />
            <span className="text-[10px] text-[var(--text-muted)] truncate font-medium uppercase tracking-wide">
              {member.provider}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] opacity-40">·</span>
            <span className="text-[10px] text-[var(--text-muted)] truncate opacity-60">
              {member.modelId}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0 flex items-center gap-2">
          {isLoading ? (
            <span className="badge badge-accent">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              Thinking
            </span>
          ) : response ? (
            <span className="badge badge-success">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Done
            </span>
          ) : (
            <span className="badge badge-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] opacity-40" />
              Standby
            </span>
          )}

          {/* Expand toggle */}
          {response && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar while loading */}
      {isLoading && (
        <div className="mx-4 h-0.5 rounded-full overflow-hidden bg-[var(--border-2)]">
          <div
            className="h-full rounded-full animate-shimmer"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, backgroundSize: '200% 100%', width: '100%' }}
          />
        </div>
      )}

      {/* Description */}
      <div className="px-4 pt-2 pb-0">
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic"
          style={{ borderLeft: `2px solid ${accentColor}40`, paddingLeft: '8px' }}>
          {member.description}
        </p>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? '600px' : response ? '160px' : '120px' }}
      >
        <div className="p-4 overflow-y-auto h-full">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-4">
              <div className="skeleton h-3 w-[85%] rounded" />
              <div className="skeleton h-3 w-[70%] rounded" />
              <div className="skeleton h-3 w-[90%] rounded" />
              <div className="skeleton h-3 w-[60%] rounded" />
              <div className="flex items-center gap-1.5 mt-2">
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: accentColor,
                      animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : response ? (
            <div className="prose prose-sm max-w-none prose-fainl text-[13px] leading-relaxed">
              <ReactMarkdown>{displayed || response.content}</ReactMarkdown>
              {isTyping && <span className="typing-cursor" />}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-6 opacity-30">
              <Bot className="w-7 h-7 text-[var(--text-muted)]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Awaiting query
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer — only when response ready */}
      {response && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface-2)] rounded-b-2xl">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <Clock className="w-2.5 h-2.5" />
            <span>{new Date(response.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
          >
            <Copy className="w-2.5 h-2.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};
