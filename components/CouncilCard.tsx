import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { CouncilMember, CouncilResponse } from '../types';
import { Bot, Loader2, Cpu } from 'lucide-react';

interface CouncilCardProps {
  member: CouncilMember;
  response?: CouncilResponse;
  isLoading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CouncilCard: FC<CouncilCardProps> = ({
  member,
  response,
  isLoading,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden card-shadow transition-all duration-300 hover:card-shadow-hover glass-card">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />

      {/* Header */}
      <div className="flex flex-col border-b border-black/[0.06] dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02]">
        {/* Identity Row */}
        <div className="p-4 flex items-center gap-3">
          {/* Avatar with glow ring */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-zinc-1000/20 blur-sm scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-zinc-400/40 transition-all duration-300">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight truncate">
              {member.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-2.5 h-2.5 text-zinc-700 opacity-70" />
              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                {member.provider}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div className="shrink-0">
            {isLoading ? (
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-1000/10 text-zinc-800 dark:text-zinc-200 rounded-full px-2.5 py-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[9px] font-bold tracking-wide uppercase">Thinking</span>
              </div>
            ) : response ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold tracking-wide uppercase">Done</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="text-[9px] font-bold tracking-wide uppercase">Standby</span>
              </div>
            )}
          </div>
        </div>

        {/* Description Row */}
        <div className="px-4 pb-3.5">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-300/60 dark:border-zinc-700/60 pl-2.5">
            "{member.description}"
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[160px] max-h-[360px] bg-white/30 dark:bg-transparent">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
            {/* Animated dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-1000"
                  style={{
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Processing...
            </span>
          </div>
        ) : response ? (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 leading-relaxed text-sm">
            <ReactMarkdown>{response.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-zinc-300 dark:text-zinc-700">
            <Bot className="w-7 h-7" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Awaiting input</span>
          </div>
        )}
      </div>
    </div>
  );
};
