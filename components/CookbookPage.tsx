import {
    ArrowRight,
    Search,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Layers,
    Clock,
    Sparkles,
    X,
} from 'lucide-react';
import { FC, useState, useMemo, useEffect, useRef } from 'react';

const ITEMS_PER_PAGE = 12;
import { DIRECTIVES, Directive } from '../data/directives';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from './SEO';

interface CookbookPageProps {
    onSelectMission: (query: string) => void;
}


export const CookbookPage: FC<CookbookPageProps> = ({ onSelectMission }) => {
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'popularity' | 'rating'>('popularity');
    const [currentPage, setCurrentPage] = useState(1);
    const categoryBarRef = useRef<HTMLDivElement>(null);

    const [localRatings, setLocalRatings] = useState<Record<string, number>>(() => {
        try { return JSON.parse(localStorage.getItem('fainl_votes') || '{}'); } catch { return {}; }
    });
    const [userVotes, setUserVotes] = useState<Record<string, 1 | -1>>(() => {
        try { return JSON.parse(localStorage.getItem('fainl_user_votes') || '{}'); } catch { return {}; }
    });

    const categoryCounts = DIRECTIVES.reduce<Record<string, number>>((acc, d) => {
        acc[d.category] = (acc[d.category] || 0) + 1;
        return acc;
    }, {});
    const categories = ['All', ...Array.from(new Set(DIRECTIVES.map(d => d.category))).filter(c => categoryCounts[c] >= 1)];

    const handleVote = (id: string, delta: 1 | -1, e: React.MouseEvent) => {
        e.stopPropagation();
        const existing = userVotes[id];
        const actualDelta = existing === delta ? -delta : (existing ? delta - existing : delta);
        const newUserVote = existing === delta ? undefined : delta;

        setLocalRatings(prev => {
            const next = { ...prev, [id]: (prev[id] || 0) + actualDelta };
            localStorage.setItem('fainl_votes', JSON.stringify(next));
            return next;
        });
        setUserVotes(prev => {
            const next = { ...prev };
            if (newUserVote === undefined) delete next[id];
            else next[id] = newUserVote;
            localStorage.setItem('fainl_user_votes', JSON.stringify(next));
            return next;
        });
    };

    const filteredDirectives = useMemo(() => {
        return DIRECTIVES.filter(d => {
            const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.subject.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === 'rating') {
                return ((b.rating + (localRatings[b.id] || 0)) - (a.rating + (localRatings[a.id] || 0)));
            }
            return b.popularity - a.popularity;
        });
    }, [searchQuery, activeCategory, sortBy, localRatings]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, activeCategory, sortBy]);

    const totalPages = Math.ceil(filteredDirectives.length / ITEMS_PER_PAGE);
    const pagedDirectives = filteredDirectives.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const goTo = (p: number) => {
        setCurrentPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
        <SEO
          title="Voorbeeldvragen voor AI Consensus — FAINL Kookboek"
          description="Ontdek honderden voorbeeldvragen voor meerdere AI-modellen tegelijk. Van juridisch advies tot marketingstrategie — laat AI consensus voor je werken."
          canonical="/cookbook"
          keywords="AI voorbeeldvragen, AI consensus voorbeelden, meerdere AI modellen gebruiken, FAINL kookboek"
        />

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">

            {/* ── Hero ── */}
            <div className="mb-10 md:mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    {language === 'nl' ? 'Voorbeeldvragen' : 'Example Questions'}
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 leading-none">
                    {language === 'nl' ? 'Waar wil jij\nAI-consensus over?' : 'What do you want\nAI consensus on?'}
                </h1>
                <p className="text-base md:text-lg text-black/50 dark:text-white/50 font-medium max-w-2xl leading-relaxed mb-8">
                    {language === 'nl'
                        ? 'Kies een vraag die je aanspreekt en laat meerdere AI-modellen er tegelijk naar kijken. Je ontvangt één gefundeerd consensus-antwoord.'
                        : 'Pick a question that interests you and let multiple AI models analyze it simultaneously. You receive one well-founded consensus answer.'}
                </p>

                {/* Step flow */}
                <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 max-w-lg">
                    {[
                        { n: '1', label: language === 'nl' ? 'Kies een vraag' : 'Pick a question' },
                        { n: '2', label: language === 'nl' ? 'Klik op Probeer dit' : 'Click Try this' },
                        { n: '3', label: language === 'nl' ? 'Ontvang consensus' : 'Receive consensus' },
                    ].map((step, i, arr) => (
                        <div key={step.n} className="flex items-center gap-0">
                            <div className="flex items-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
                                <span className="text-xs font-black text-yellow-400 dark:text-yellow-600">{step.n}</span>
                                <span className="text-xs font-black uppercase tracking-wide whitespace-nowrap">{step.label}</span>
                            </div>
                            {i < arr.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-black/20 dark:text-white/20 mx-1 shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Search + Sort ── */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
                    <input
                        type="text"
                        placeholder={language === 'nl' ? 'Zoek een vraag of onderwerp…' : 'Search a question or topic…'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border-2 border-black/15 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            title={language === 'nl' ? 'Zoekopdracht wissen' : 'Clear search'}
                            aria-label={language === 'nl' ? 'Zoekopdracht wissen' : 'Clear search'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        title={language === 'nl' ? 'Sorteren op' : 'Sort by'}
                        aria-label={language === 'nl' ? 'Sorteren op' : 'Sort by'}
                        className="appearance-none bg-white dark:bg-zinc-900 border-2 border-black/15 dark:border-white/10 rounded-xl px-4 py-3 pr-9 text-sm font-bold focus:outline-none cursor-pointer text-black dark:text-white focus:border-black dark:focus:border-white transition-colors"
                    >
                        <option value="popularity">{language === 'nl' ? 'Meest gebruikt' : 'Most used'}</option>
                        <option value="rating">{language === 'nl' ? 'Hoogst beoordeeld' : 'Top rated'}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black/40 dark:text-white/40" />
                </div>
            </div>

            {/* ── Category pills ── */}
            <div
                ref={categoryBarRef}
                className="flex gap-2 overflow-x-auto pb-3 mb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
            >
                {categories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap ${
                            activeCategory === cat
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                : 'bg-white dark:bg-zinc-900 text-black/50 dark:text-white/50 border-black/15 dark:border-white/10 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                        }`}
                    >
                        {cat === 'All' ? (language === 'nl' ? 'Alles' : 'All') : cat}
                        {cat !== 'All' && (
                            <span className="ml-1.5 opacity-50">{categoryCounts[cat]}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Results count ── */}
            <p className="text-xs font-black uppercase tracking-widest text-black/30 dark:text-white/30 mb-5">
                {filteredDirectives.length} {language === 'nl' ? 'vragen' : 'questions'}
                {totalPages > 1 && ` · pagina ${currentPage} van ${totalPages}`}
            </p>

            {/* ── Grid ── */}
            {filteredDirectives.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                    <Search className="w-8 h-8 mx-auto mb-3 text-black/20 dark:text-white/20" />
                    <p className="font-black uppercase tracking-widest text-black/30 dark:text-white/30 text-sm">
                        {language === 'nl' ? 'Geen vragen gevonden' : 'No questions found'}
                    </p>
                    <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                        className="mt-4 text-xs font-black uppercase tracking-widest underline text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                    >
                        {language === 'nl' ? 'Filters wissen' : 'Clear filters'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {pagedDirectives.map((directive) => (
                        <DirectiveCard
                            key={directive.id}
                            directive={directive}
                            localRating={localRatings[directive.id] || 0}
                            userVote={userVotes[directive.id]}
                            onVote={handleVote}
                            onSelect={() => onSelectMission(directive.query)}
                            language={language}
                        />
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (() => {
                const slots: (number | '…')[] = [];
                const add = (p: number) => { if (!slots.includes(p)) slots.push(p); };
                add(1);
                if (currentPage > 3) slots.push('…');
                for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) add(p);
                if (currentPage < totalPages - 2) slots.push('…');
                add(totalPages);

                return (
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <p className="text-xs font-black uppercase tracking-widest text-black/30 dark:text-white/30">
                            {language === 'nl' ? `Pagina ${currentPage} van ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => goTo(currentPage - 1)}
                                disabled={currentPage === 1}
                                title={language === 'nl' ? 'Vorige pagina' : 'Previous page'}
                                aria-label={language === 'nl' ? 'Vorige pagina' : 'Previous page'}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black/15 dark:border-white/15 font-black disabled:opacity-25 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {slots.map((slot, i) =>
                                slot === '…' ? (
                                    <span key={`el-${i}`} className="w-9 h-9 flex items-center justify-center text-black/30 dark:text-white/30 font-black text-sm">…</span>
                                ) : (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => goTo(slot)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 font-black text-sm transition-all ${
                                            slot === currentPage
                                                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white scale-110 shadow-md'
                                                : 'border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                )
                            )}
                            <button
                                type="button"
                                onClick={() => goTo(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                title={language === 'nl' ? 'Volgende pagina' : 'Next page'}
                                aria-label={language === 'nl' ? 'Volgende pagina' : 'Next page'}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-black/15 dark:border-white/15 font-black disabled:opacity-25 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })()}

            {/* ── Bottom CTA ── */}
            <div className="mt-20 p-10 md:p-16 bg-black dark:bg-zinc-900 text-white rounded-3xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-xl mx-auto space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full">
                        <Sparkles className="w-3.5 h-3.5" />
                        {language === 'nl' ? 'Eigen vraag?' : 'Your own question?'}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                        {language === 'nl' ? 'Stel jouw eigen vraag' : 'Ask your own question'}
                    </h2>
                    <p className="text-white/50 text-sm md:text-base leading-relaxed">
                        {language === 'nl'
                            ? 'Staat jouw vraag er niet bij? Ga naar de hoofdpagina en typ hem direct in. Elke vraag is welkom.'
                            : "Don't see your question? Go to the home page and type it in directly. Any question is welcome."}
                    </p>
                    <a
                        href="/mission"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-yellow-300 transition-colors"
                    >
                        {language === 'nl' ? 'Begin hier' : 'Start here'} <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
        </>
    );
};

/* ────────────────────────────────────────────────────────── */
interface DirectiveCardProps {
    directive: Directive;
    localRating: number;
    userVote?: 1 | -1;
    onVote: (id: string, delta: 1 | -1, e: React.MouseEvent) => void;
    onSelect: () => void;
    language: string;
}

const DirectiveCard: FC<DirectiveCardProps> = ({ directive, localRating, userVote, onVote, onSelect, language }) => {
    const rating = directive.rating + localRating;

    return (
        <div className="group flex flex-col bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-black dark:hover:border-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">

            {/* Card header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold text-black/40 dark:text-white/30 uppercase tracking-wide truncate">{directive.category}</span>
                </div>
                {/* Votes */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => onVote(directive.id, 1, e)}
                        aria-label="Upvote"
                        className={`p-1 rounded transition-colors ${userVote === 1 ? 'text-emerald-600' : 'text-black/25 dark:text-white/25 hover:text-emerald-500'}`}
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-black/50 dark:text-white/50 min-w-[20px] text-center">{rating}</span>
                    <button
                        type="button"
                        onClick={(e) => onVote(directive.id, -1, e)}
                        aria-label="Downvote"
                        className={`p-1 rounded transition-colors ${userVote === -1 ? 'text-red-500' : 'text-black/25 dark:text-white/25 hover:text-red-400'}`}
                    >
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Title + question */}
            <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
                <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black dark:text-white leading-snug line-clamp-2">
                    {directive.title}
                </h3>
                <blockquote className="border-l-4 border-yellow-400 pl-3 py-2 bg-yellow-400/5 rounded-r-lg">
                    <p className="text-sm text-black/65 dark:text-white/60 leading-relaxed italic line-clamp-3">
                        "{directive.query}"
                    </p>
                </blockquote>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-black/5 dark:border-white/5 flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40">
                <div className="flex items-center gap-3 text-[11px] font-black text-black/30 dark:text-white/30 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {directive.nodesNeeded} nodes
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {directive.length}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onSelect}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-400 dark:hover:text-black transition-all group-hover:gap-2.5"
                >
                    {language === 'nl' ? 'Probeer dit' : 'Try this'} <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};
