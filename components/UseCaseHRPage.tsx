import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, ClipboardList, Search, BarChart2 } from 'lucide-react';
import { SEO } from './SEO';

const USE_CASES = [
  {
    icon: Search,
    title: 'Functieprofiel & vacaturetekst',
    desc: 'Drie AI-modellen stellen elk een functieprofiel op vanuit een andere invalshoek: strategisch, operationeel en kandidaatgericht. FAINL synthetiseert de sterkste elementen tot één scherpe vacaturetekst.',
    example: '"Schrijf een vacaturetekst voor een Senior Product Manager bij een Nederlandse SaaS-scale-up met focus op inclusieve taal."',
  },
  {
    icon: ClipboardList,
    title: 'Interviewvragen & beoordeling',
    desc: 'Multi-model AI genereert gestructureerde interviewvragen per competentie. Modellen toetsen elkaars vragen op bias, volledigheid en relevantie — zodat je kandidaten eerlijk en compleet beoordeelt.',
    example: '"Genereer vijf competentiegerichte interviewvragen voor een salesfunctie, gericht op het testen van veerkracht en klantgerichtheid."',
  },
  {
    icon: Users,
    title: 'Organisatiecultuur & onboarding',
    desc: 'Laat drie modellen onafhankelijk je onboardingprogramma analyseren op lacunes, inconsistenties en verbeterkansen. Elk model signaleert andere risico\'s voor vroeg verloop.',
    example: '"Geef feedback op ons 30-60-90-dagenplan voor nieuwe salesmedewerkers en benoem de drie grootste risico\'s voor vroegtijdig verloop."',
  },
  {
    icon: BarChart2,
    title: 'Arbeidsmarktanalyse & loonstrategie',
    desc: 'Stel strategische HR-vragen over salarisniveaus, schaarse functiegroepen en arbeidsmarkttrends. Drie modellen geven elk hun interpretatie — FAINL benoemt de meest onderbouwde conclusie.',
    example: '"Wat zijn realistische salarisbandbreedtes voor een senior data engineer in Nederland in 2026 en hoe verhoudt zich dat tot de markt?"',
  },
];

const FAQS = [
  {
    q: 'Hoe gebruik ik AI voor HR en recruitment?',
    a: 'AI is het sterkst in HR wanneer je het inzet voor het structureren van processen: vacatureteksten, interviewvragen, functieprofielen en onboardingprogramma\'s. Met FAINL krijg je drie onafhankelijke perspectieven die elkaars aannames toetsen — wat bias vermindert en kwaliteit verhoogt.',
  },
  {
    q: 'Kan AI helpen bij het verminderen van bias in recruitment?',
    a: 'Ja, mits bewust ingezet. FAINL laat meerdere modellen elkaars vacatureteksten en interviewvragen beoordelen op bias. Dit levert systematisch betere resultaten dan één model — dat zijn eigen vooroordelen niet ziet. Menselijke controle blijft essentieel.',
  },
  {
    q: 'Is AI-gegenereerde HR-content betrouwbaar voor gebruik?',
    a: 'AI levert sterke structuur, frameworks en taalinspiratie — maar de specifieke context van jouw organisatie, sector en cultuur moet je zelf toevoegen. FAINL\'s consensus-aanpak verhoogt betrouwbaarheid doordat modellen elkaars output kritisch toetsen.',
  },
  {
    q: 'Wat maakt FAINL anders dan andere AI-tools voor HR?',
    a: 'De meeste HR-tools zijn gebaseerd op één AI-model. FAINL laat drie modellen tegelijk werken, ze debatteren over elkaars output en een Voorzitter synthetiseert het sterkste advies. Dit levert diepgaandere analyse dan een enkelvoudige AI-assistent.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI voor HR & Recruitment: Scherpere Wervingsprocessen met Multi-Model AI',
      description: 'Gebruik multi-model AI voor vacatureteksten, interviewvragen en onboarding. FAINL synthetiseert drie HR-perspectieven tot één gewogen advies.',
      url: 'https://fainl.com/gebruik/hr-recruitment-ai',
      datePublished: '2026-03-13',
      dateModified: '2026-03-13',
      author: { '@type': 'Organization', name: 'FAINL', url: 'https://fainl.com' },
      publisher: { '@type': 'Organization', name: 'FAINL', logo: { '@type': 'ImageObject', url: 'https://fainl.com/favicon.png' } },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fainl.com/' },
        { '@type': 'ListItem', position: 2, name: 'Gebruik', item: 'https://fainl.com/gebruik' },
        { '@type': 'ListItem', position: 3, name: 'HR & Recruitment', item: 'https://fainl.com/gebruik/hr-recruitment-ai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
};

export const UseCaseHRPage: FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="AI voor HR & Recruitment: Betere Werving met Multi-Model AI"
        description="Gebruik meerdere AI-modellen voor vacatureteksten, interviewvragen en onboarding. FAINL combineert drie HR-perspectieven tot één gewogen advies. Twee sessies gratis."
        canonical="/gebruik/hr-recruitment-ai"
        keywords="AI voor HR, AI recruitment Nederland, AI vacaturetekst, AI interviewvragen, kunstmatige intelligentie HR, AI onboarding, multi-model AI HR tool"
        ogTitle="AI voor HR & Recruitment — Drie Modellen, Eén Scherp HR-Advies"
        ogDescription="Laat meerdere AI-modellen samenwerken voor betere vacatureteksten, interviewvragen en HR-strategie. Minder bias, meer diepgang."
        jsonLd={JSON_LD}
      />

      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-5 sm:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          <li><button type="button" onClick={() => navigate('/')} className="hover:text-black dark:hover:text-white transition-colors">Home</button></li>
          <li>/</li>
          <li className="text-black/60 dark:text-white/50">Gebruik</li>
          <li>/</li>
          <li className="text-black dark:text-white">HR & Recruitment</li>
        </ol>
      </nav>

      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-[0.25em] rounded-full mb-6">
          Use case — HR & Recruitment
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black uppercase tracking-tighter text-black dark:text-white leading-[1.05] mb-6">
          AI voor HR:{' '}
          <span className="text-[#FF9900]">minder bias, betere kandidaten.</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/70 dark:text-white/60 leading-relaxed max-w-2xl mb-8">
          Wervingsprocessen zijn gebaat bij meerdere invalshoeken — niet één mening van één model.
          Drie AI-modellen analyseren onafhankelijk je functieprofiel, interviewvragen en onboardingprogramma.{' '}
          <strong className="text-black dark:text-white">FAINL legt de blinde vlekken bloot en levert een scherper HR-advies.</strong>
        </p>
        <button type="button" onClick={() => navigate('/mission')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
          Analyseer je HR-vraag — gratis starten
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <section aria-label="HR toepassingen" className="max-w-4xl mx-auto px-5 sm:px-8 pb-16">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-6">Toepassingen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USE_CASES.map(uc => (
            <div key={uc.title} className="border-2 border-black dark:border-white/20 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_1px_rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-black dark:bg-white rounded-lg">
                  <uc.icon className="w-4 h-4 text-white dark:text-black" />
                </div>
                <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">{uc.title}</h3>
              </div>
              <p className="text-sm text-black/60 dark:text-white/50 leading-relaxed mb-4">{uc.desc}</p>
              <div className="bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3">
                <p className="text-sm font-black uppercase tracking-widest text-black/30 dark:text-white/30 mb-1">Voorbeeldvraag</p>
                <p className="text-sm text-black/70 dark:text-white/60 italic leading-relaxed">{uc.example}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="CTA" className="max-w-4xl mx-auto px-5 sm:px-8 pb-16">
        <div className="bg-black dark:bg-white rounded-2xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)]">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white dark:text-black mb-4">
            Betere werving begint met{' '}
            <span className="text-[#FF9900]">meerdere perspectieven.</span>
          </h2>
          <p className="text-white/70 dark:text-black/60 leading-relaxed text-base md:text-lg mb-8">
            Stel je HR-vraag aan FAINL. Drie modellen analyseren onafhankelijk, bekritiseren elkaars
            aannames op bias en kwaliteit, en Victor synthetiseert het sterkste HR-advies — in één sessie.
          </p>
          <button type="button" onClick={() => navigate('/mission')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF9900] text-black font-black text-sm uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
            Start gratis — twee sessies, geen account nodig
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section aria-label="Veelgestelde vragen" className="max-w-4xl mx-auto px-5 sm:px-8 pb-24">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-6">Veelgestelde vragen</h2>
        <div className="border-2 border-black dark:border-white/20 rounded-2xl px-6 bg-white dark:bg-zinc-900">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-black/10 dark:border-white/10 last:border-0">
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start justify-between py-5 text-left gap-4 group">
                <span className="font-black text-base md:text-lg uppercase tracking-tight text-black dark:text-white group-hover:text-[#FF9900] transition-colors">{faq.q}</span>
                <span className="text-black/40 dark:text-white/40 text-xl leading-none mt-0.5 shrink-0">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <p className="pb-5 text-base text-black/70 dark:text-white/60 leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
