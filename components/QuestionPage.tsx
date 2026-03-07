import { FC, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  MessageSquare,
  Shield,
  Globe,
  Play,
} from "lucide-react";
import { DIRECTIVES } from "../data/directives";
import { SEO } from "./SEO";
import { ScrambleText } from "./ScrambleText";

export const QuestionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const directive = useMemo(() => {
    return DIRECTIVES.find((d) => d.id === id);
  }, [id]);

  if (!directive) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black uppercase mb-8">
          Recept niet gevonden
        </h1>
        <Link
          to="/cookbook"
          className="text-yellow-500 font-bold uppercase tracking-widest hover:underline"
        >
          Terug naar het Kookboek
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEO
        title={`${directive.title} - AI Reflectie Recept`}
        description={`Bekijk het protocol voor de vraag: "${directive.title}". Gebruik de collectieve intelligentie van FAINL voor een diepgaand antwoord.`}
        canonical={`/cookbook/${directive.id}`}
      />

      {/* Breadcrumb / Back */}
      <Link
        to="/cookbook"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar het Kookboek
      </Link>

      {/* Header Section */}
      <div className="mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest rounded-lg">
            {directive.category}
          </span>
          <span className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest">
            ID: {directive.id}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-[1.1] mb-8">
          {directive.title}
        </h1>
        <p className="text-lg md:text-xl font-medium text-black/60 dark:text-white/50 leading-relaxed italic border-l-4 border-yellow-400 pl-6 py-2">
          "Dit recept is zorgvuldig samengesteld om verschillende
          AI-perspectieven te laten botsen en te synthetiseren tot één
          overkoepelend inzicht."
        </p>
      </div>

      {/* Main Action Card */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_1px_rgba(255,255,255,0.05)] mb-16 md:mb-24 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap className="w-32 h-32 text-black dark:text-white" />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 text-black dark:text-white">
            Klaar voor uitvoering?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                <Shield className="w-3.5 h-3.5" /> Veiligheid
              </div>
              <p className="text-xs font-bold text-black dark:text-white uppercase">
                100% Lokaal opgeslagen
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                <Globe className="w-3.5 h-3.5" /> Intelligentie
              </div>
              <p className="text-xs font-bold text-black dark:text-white uppercase">
                Multi-Node Consensus
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                <MessageSquare className="w-3.5 h-3.5" /> Resultaat
              </div>
              <p className="text-xs font-bold text-black dark:text-white uppercase">
                Gewogen Eindoordeel
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // We'll need a way to pass this query to the App state
              // For now, we'll navigate to /mission and rely on local storage or URL state
              navigate(`/mission?q=${encodeURIComponent(directive.query)}`);
            }}
            className="w-full md:w-auto px-12 py-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Protocol
          </button>
        </div>
      </div>

      {/* Details / Lore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white">
            Waarom dit protocol?
          </h3>
          <p className="text-sm text-black/60 dark:text-white/50 leading-relaxed">
            Sommige vragen zijn te complex voor één AI. Dit specifieke protocol
            dwingt de verschillende modellen (zoals Gemini, GPT en Claude) om
            niet alleen een antwoord te geven, maar elkaars aannames te bevragen
            in de debate room.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white">
            Verwacht resultaat
          </h3>
          <p className="text-sm text-black/60 dark:text-white/50 leading-relaxed">
            Je ontvangt een 'Chairman's Verdict'. Dit is een synthese die de
            overeenkomsten tussen de AI's benadrukt, de belangrijkste nuances
            blootlegt en eventuele tegenstrijdigheden uitlegt.
          </p>
        </div>
      </div>
    </div>
  );
};
