import { 
  Book,
  ArrowRight,
  Search,
  ChevronUp,
  ChevronDown,
  Layers,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { FC, useState, useMemo } from 'react';
import { DIRECTIVES, Directive } from '../data/directives';
import { ScrambleText } from './ScrambleText';

interface CookbookPageProps {
  onSelectMission: (query: string) => void;
}

export const CookbookPage: FC<CookbookPageProps> = ({ onSelectMission }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest'>('popularity');
  
  // Local state for simulated rankings
  const [localRatings, setLocalRatings] = useState<Record<string, number>>({});

  const categories = ['All', ...Array.from(new Set(DIRECTIVES.map(d => d.category)))];
  const difficulties = ['All', 'Alpha', 'Beta', 'Gamma'];

  const handleVote = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalRatings(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + delta
    }));
  };

  const filteredDirectives = useMemo(() => {
    return DIRECTIVES.filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
      const matchesDifficulty = activeDifficulty === 'All' || d.difficulty === activeDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        const ratingA = a.rating + (localRatings[a.id] || 0);
        const ratingB = b.rating + (localRatings[b.id] || 0);
        return ratingB - ratingA;
      }
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      return 0; // Newest not implemented (no date field)
    });
  }, [searchQuery, activeCategory, activeDifficulty, sortBy, localRatings]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-1000/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-4">
          <LayoutGrid className="w-3.5 h-3.5" />
          Examples
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
          <ScrambleText text="Question Cookbook" />
        </h1>
        <p className="max-w-md mx-auto text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
          Browse curated example questions to inspire your next council session. Click any to load it instantly.
        </p>
      </div>

      {/* Control Bar */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-card card-shadow rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                    <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        title="Filter by Category"
                        className="appearance-none glass-card card-shadow rounded-xl px-3.5 py-2.5 pr-8 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer focus:ring-2 focus:ring-zinc-900/10 transition-all"
                    >
                        {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-zinc-400" />
                </div>

                <div className="relative">
                    <select
                        value={activeDifficulty}
                        onChange={(e) => setActiveDifficulty(e.target.value)}
                        title="Filter by Difficulty"
                        className="appearance-none glass-card card-shadow rounded-xl px-3.5 py-2.5 pr-8 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer focus:ring-2 focus:ring-zinc-900/10 transition-all"
                    >
                        {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All levels' : `Level ${d}`}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-zinc-400" />
                </div>

                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        title="Sort by"
                        className="appearance-none glass-card card-shadow rounded-xl px-3.5 py-2.5 pr-8 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer focus:ring-2 focus:ring-zinc-900/10 transition-all"
                    >
                        <option value="popularity">Most popular</option>
                        <option value="rating">Top rated</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-zinc-400" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDirectives.length === 0 ? (
            <div className="col-span-full py-16 text-center glass-card card-shadow rounded-2xl">
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">No matching questions found.</p>
                <p className="text-[11px] text-zinc-300 dark:text-zinc-700 mt-1">Try a different search term or filter.</p>
            </div>
        ) : (
            filteredDirectives.map((directive) => (
                <button
                    key={directive.id}
                    onClick={() => onSelectMission(directive.query)}
                    className="group text-left glass-card card-shadow hover:card-shadow-hover p-4 md:p-5 rounded-2xl transition-all relative overflow-hidden hover:scale-[1.01]"
                >
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />

                    <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              directive.difficulty === 'Gamma'
                                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20'
                                : directive.difficulty === 'Beta'
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                                : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                            }`}>
                              {directive.difficulty === 'Alpha' ? 'Beginner' : directive.difficulty === 'Beta' ? 'Intermediate' : 'Advanced'}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-white/5 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-white/8">
                              {directive.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-zinc-50 dark:bg-white/5 rounded-lg px-1.5 py-1">
                            <button
                                onClick={(e) => handleVote(directive.id, 1, e)}
                                title="Upvote"
                                className="p-0.5 rounded hover:text-emerald-500 text-zinc-400 dark:text-zinc-500 transition-colors"
                            >
                                <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 min-w-[18px] text-center">
                                {directive.rating + (localRatings[directive.id] || 0)}
                            </span>
                            <button
                                onClick={(e) => handleVote(directive.id, -1, e)}
                                title="Downvote"
                                className="p-0.5 rounded hover:text-red-500 text-zinc-400 dark:text-zinc-500 transition-colors"
                            >
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1">{directive.title}</h3>
                    <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed italic mb-4 border-l-2 border-zinc-300/60 dark:border-zinc-700/60 pl-3 line-clamp-2">
                        "{directive.query}"
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 dark:text-zinc-500">
                            <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3" /> {directive.nodesNeeded} models
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {directive.length}
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 group-hover:gap-1.5 transition-all">
                            Try this <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </button>
            ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 glass-card card-shadow rounded-2xl p-8 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/15 to-transparent" />
        <Book className="w-8 h-8 mx-auto text-zinc-700 mb-3" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Community-Ranked Questions</h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
          The more a question is used and upvoted, the higher it ranks. Contribute by using and rating questions in the Cookbook.
        </p>
      </div>
    </div>
  );
};
