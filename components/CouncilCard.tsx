import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CouncilMember, CouncilResponse } from '../types';
import { NodeLoader } from './NodeLoader';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  onToggle
}) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  const showFull = isExpanded || localExpanded;

  return (
    <div className="relative flex flex-col bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 rounded-2xl overflow-hidden transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_1px_rgba(255,255,255,0.1)]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black dark:border-white/20 bg-black dark:bg-zinc-800">
        <div className={`w-9 h-9 rounded-full shrink-0 border-2 border-white/30 overflow-hidden ${member.color}`}>
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-sm uppercase tracking-widest text-white truncate leading-none">{member.name}</h3>
          <p className="text-xs text-white/40 mt-0.5 font-medium truncate italic">{member.description}</p>
        </div>
        {isLoading && (
          <div className="shrink-0">
            <NodeLoader shape="circle" />
          </div>
        )}
        {response && (
          <button
            type="button"
            onClick={() => { setLocalExpanded(e => !e); onToggle(); }}
            className="shrink-0 p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
            title={showFull ? 'Inklappen' : 'Volledig lezen'}
          >
            {showFull ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          !showFull && response ? 'max-h-[280px]' : ''
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-black/40 dark:text-white/30">
            <NodeLoader shape="circle" />
            <span className="text-xs font-black uppercase tracking-widest animate-pulse">Analyseert jouw vraag…</span>
          </div>
        ) : response ? (
          <div className="px-5 py-4">
            <div className="prose prose-sm max-w-none
              prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:my-2
              prose-strong:text-black dark:prose-strong:text-white prose-strong:font-black
              prose-headings:text-black dark:prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
              prose-ul:my-2 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:my-1 prose-li:leading-relaxed
              prose-hr:border-zinc-200 dark:prose-hr:border-zinc-700">
              <ReactMarkdown>{response.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-black/20 dark:text-white/15">
            <span className="text-xs font-black uppercase tracking-widest">Wacht op analyse…</span>
          </div>
        )}
      </div>

      {/* Gradient + expand button when truncated */}
      {response && !showFull && (
        <div className="relative">
          <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
          <button
            type="button"
            onClick={() => { setLocalExpanded(true); onToggle(); }}
            className="w-full py-2.5 text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/30 hover:text-black dark:hover:text-white border-t border-black/5 dark:border-white/5 transition-colors bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center gap-1"
          >
            <ChevronDown className="w-3 h-3" /> Lees het volledige antwoord
          </button>
        </div>
      )}

      {response && showFull && (
        <button
          type="button"
          onClick={() => { setLocalExpanded(false); onToggle(); }}
          className="w-full py-2.5 text-xs font-black uppercase tracking-widest text-black/30 dark:text-white/20 hover:text-black dark:hover:text-white border-t border-black/5 dark:border-white/5 transition-colors bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center gap-1"
        >
          <ChevronUp className="w-3 h-3" /> Inklappen
        </button>
      )}
    </div>
  );
};
