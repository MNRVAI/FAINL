
import { FC, useState } from 'react';
import { CouncilResponse, CouncilMember } from '../types';
import { Sparkles, Gavel, Check, MousePointer2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CompositionStageProps {
  responses: CouncilResponse[];
  members: CouncilMember[];
  onCompose: (composedText: string) => void;
}

export const CompositionStage: FC<CompositionStageProps> = ({
  responses,
  members,
  onCompose
}) => {
  const categories = ['STANDPUNT', 'ANALYSE', 'NUANCE', 'ADVIES'];
  
  // State to track which member's compartment is selected for each category
  const [selections, setSelections] = useState<Record<string, string>>({
    STANDPUNT: responses[0]?.memberId || '',
    ANALYSE: responses[0]?.memberId || '',
    NUANCE: responses[0]?.memberId || '',
    ADVIES: responses[0]?.memberId || ''
  });

  const getMember = (id: string) => members.find(m => m.id === id);
  const getResponse = (id: string) => responses.find(r => r.memberId === id);

  const handleSelect = (category: string, memberId: string) => {
    setSelections(prev => ({ ...prev, [category]: memberId }));
  };

  const generateComposedText = () => {
    return categories
      .map(cat => {
        const memberId = selections[cat];
        const resp = getResponse(memberId);
        return resp?.sections?.[cat] || '';
      })
      .filter(Boolean)
      .join('\n\n');
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#004f57] text-black text-[10px] font-black uppercase tracking-[0.3em] border-2 border-black">
          <Sparkles className="w-3 h-3" />
          Nieuwe Functie: Maatwerk Oordeel
        </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
          Smeed jouw <span className="text-[#004f57]">eindoordeel</span>
        </h2>
        <p className="text-lg text-black dark:text-white/50 font-bold max-w-2xl mx-auto">
          Mix en match de sterkste segmenten van elke AI-expert. Jouw compositie wordt de basis voor Victor's eindvonnis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#004f57] text-center border-b-2 border-[#004f57] pb-2">
              {cat}
            </h3>
            <div className="space-y-4">
              {responses.map((resp) => {
                const member = getMember(resp.memberId);
                if (!member || !resp.sections?.[cat]) return null;
                const isSelected = selections[cat] === resp.memberId;

                return (
                  <button
                    key={resp.memberId}
                    onClick={() => handleSelect(cat, resp.memberId)}
                    className={`group relative w-full text-left p-4 border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'bg-black text-white border-black shadow-[6px_6px_0_0_#004f57]' 
                        : 'bg-white dark:bg-zinc-900 border-black/10 dark:border-white/10 hover:border-[#004f57] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img src={member.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-[#004f57]/50" />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-[#004f57]' : 'text-black/40 dark:text-white/40'}`}>
                        {member.name}
                      </span>
                      {isSelected && <Check className="w-3 h-3 ml-auto text-[#004f57]" />}
                    </div>
                    <div className={`text-xs leading-relaxed font-medium line-clamp-4 ${isSelected ? 'text-white' : 'text-black/80 dark:text-white/60'}`}>
                      {resp.sections[cat]}
                    </div>
                    {!isSelected && (
                      <div className="absolute inset-0 bg-[#004f57]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <MousePointer2 className="w-6 h-6 text-[#004f57] animate-bounce" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Preview & Submit */}
      <div className="bg-white dark:bg-black border-4 border-black dark:border-[#004f57] p-8 md:p-12 shadow-[12px_12px_0_0_black] dark:shadow-[12px_12px_0_0_#004f57] animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <h4 className="text-xl font-black uppercase tracking-widest text-[#004f57]">Jouw Samengestelde Antwoord</h4>
            <div className="prose prose-sm dark:prose-invert max-w-none opacity-80 italic italic">
              <ReactMarkdown>{generateComposedText()}</ReactMarkdown>
            </div>
          </div>
          <button
            onClick={() => onCompose(generateComposedText())}
            className="shrink-0 flex items-center gap-4 px-10 py-6 bg-black text-white font-black text-xl uppercase tracking-widest hover:bg-[#004f57] hover:text-black transition-all hover:scale-105 active:scale-95 shadow-[8px_8px_0_0_#004f57] border-4 border-black"
          >
            <Gavel className="w-6 h-6" />
            Vraag oordeel aan
          </button>
        </div>
      </div>
    </div>
  );
};
