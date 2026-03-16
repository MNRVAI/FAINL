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
          className="text-black font-bold uppercase tracking-widest hover:underline"
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
        className="inline-flex items-center gap-2 text-base font-black uppercase tracking-[0.2em] text-black dark:text-white/40 hover:text-black dark:hover:text-white transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar het Kookboek
      </Link>

      {/* Header Section */}
      <div className="mb-20 md:mb-32">
        <div className="flex items-center gap-4 mb-8">
          <span className="px-4 py-2 bg-black dark:bg-[#004f57] text-white dark:text-black text-lg font-black uppercase tracking-widest rounded-none">
            {directive.category}
          </span>
          <span className="text-lg font-black text-[#004f57] dark:text-[#004f57] uppercase tracking-widest">
            ID: {directive.id}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black dark:text-white leading-[1.05] mb-10">
          {directive.title}
        </h1>
        <p className="text-xl md:text-3xl font-bold text-black dark:text-white/80 leading-relaxed italic border-l-8 border-[#004f57] pl-10 py-4">
          "Dit recept is zorgvuldig samengesteld om verschillende
          AI-perspectieven te laten botsen en te synthetiseren tot één
          overkoepelend inzicht."
        </p>
      </div>

      {/* Main Action Card */}
      <div className="bg-white dark:bg-black border-4 border-black dark:border-[#004f57] rounded-none p-10 md:p-20 shadow-[15px_15px_0_0_black] dark:shadow-[15px_15px_0_0_#004f57] mb-20 md:mb-32 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap className="w-48 h-48 text-black dark:text-[#004f57]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10 text-black dark:text-white">
            Klaar voor uitvoering?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-base font-black uppercase tracking-widest text-[#004f57] dark:text-[#004f57]">
                <Shield className="w-5 h-5" /> Veiligheid
              </div>
              <p className="text-xl font-black text-black dark:text-white uppercase">
                100% Lokaal opgeslagen
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-base font-black uppercase tracking-widest text-[#004f57] dark:text-[#004f57]">
                <Globe className="w-5 h-5" /> Intelligentie
              </div>
              <p className="text-xl font-black text-black dark:text-white uppercase">
                Multi-Node Consensus
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-base font-black uppercase tracking-widest text-[#004f57] dark:text-[#004f57]">
                <MessageSquare className="w-5 h-5" /> Resultaat
              </div>
              <p className="text-xl font-black text-black dark:text-white uppercase">
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
            className="w-full md:w-auto px-12 py-6 bg-black dark:bg-[#004f57] text-white dark:text-black rounded-none font-black uppercase tracking-[0.2em] text-xl hover:bg-[#004f57] hover:text-black dark:hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4"
          >
            <Play className="w-6 h-6 fill-current" />
            Start Protocol
          </button>
        </div>
      </div>

      {/* Details / Lore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-black dark:text-white">
            Waarom dit protocol?
          </h3>
          <p className="text-lg md:text-2xl text-black dark:text-white/80 leading-relaxed font-bold">
            Sommige vragen zijn te complex voor één AI. Dit specifieke protocol
            dwingt de verschillende modellen (zoals Gemini, GPT en Claude) om
            niet alleen een antwoord te geven, maar elkaars aannames te bevragen
            in de debate room.
          </p>
        </div>
        <div className="space-y-8">
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-black dark:text-white">
            Verwacht resultaat
          </h3>
          <p className="text-lg md:text-2xl text-black dark:text-white/80 leading-relaxed font-bold">
            Je ontvangt een 'Chairman's Verdict'. Dit is een synthese die de
            overeenkomsten tussen de AI's benadrukt, de belangrijkste nuances
            blootlegt en eventuele tegenstrijdigheden uitlegt.
          </p>
        </div>
      </div>
    </div>
  );
};
