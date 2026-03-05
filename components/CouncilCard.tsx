import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { CouncilMember, CouncilResponse } from '../types';
import { Bot, Loader2 } from 'lucide-react';

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
  return (
    <div 
      className={`relative flex flex-col bg-white dark:bg-zinc-900 border-2 md:border-4 border-black dark:border-white/20 rounded-xl overflow-hidden transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_1px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)]`}
    >
      {/* Header Section */}
      <div className="flex flex-col border-b-2 md:border-b-4 border-black dark:border-white/20 bg-white dark:bg-zinc-900/50">
        {/* Identity Row */}
        <div className="p-3 md:p-4 pb-2 flex items-center gap-2 md:gap-3">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${member.color} shadow-sm border-2 border-black dark:border-white/40 shrink-0`}>
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-black dark:text-white text-xs md:text-sm uppercase tracking-wide truncate">{member.name}</h3>
            <div className="flex items-center mt-0.5">
              <span className="text-[8px] md:text-[10px] font-mono font-bold text-black/50 dark:text-white/40 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded truncate">
                {member.provider}
              </span>
            </div>
          </div>
          {isLoading && (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-black dark:text-white animate-spin shrink-0" />
          )}
        </div>

        {/* Description Row */}
        <div className="px-3 md:px-4 pb-3 md:pb-4 pt-1 md:pt-2">
          <div className="text-[10px] md:text-[11px] text-black/80 dark:text-white/80 font-medium leading-relaxed border-l-2 border-black/20 dark:border-white/20 pl-2 md:pl-3 italic">
            "{member.description}"
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 p-3 md:p-4 pr-2 md:pr-3 overflow-y-auto min-h-[150px] md:min-h-[200px] max-h-[300px] md:max-h-[400px] bg-white dark:bg-zinc-900/30 text-xs md:text-sm text-black dark:text-white border-t-2 border-black/5 dark:border-white/5`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-black/50 dark:text-white/40">
            <span className="animate-pulse font-mono uppercase text-[10px] md:text-xs">Processing...</span>
          </div>
        ) : response ? (
          <div className="prose prose-xs md:prose-sm max-w-none prose-p:text-black dark:prose-p:text-white prose-headings:text-black dark:prose-headings:text-white prose-strong:text-black dark:prose-strong:text-white leading-relaxed">
            <ReactMarkdown>{response.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-black/30 dark:text-white/20">
            <Bot className="w-6 h-6 md:w-8 md:h-8 mb-2 opacity-50" />
            <span className="font-mono text-[10px] md:text-xs uppercase">Standby</span>
          </div>
        )}
      </div>
    </div>
  );
};