import { Book, ArrowRight, Search, ChevronDown, Layers, Clock, LayoutGrid, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FC, useState, useMemo } from 'react';
import { DIRECTIVES } from '../data/directives';

interface CookbookPageProps {
  onSelectMission: (query: string) => void;
}

export const CookbookPage: FC<CookbookPageProps> = ({ onSelectMission }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating'>('popularity');
  const [localRatings, setLocalRatings] = useState<Record<string, number>>({});

  const categories = ['All', ...Array.from(new Set(DIRECTIVES.map(d => d.category)))];

  const handleVote = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalRatings(prev => ({ ...prev, [id]: (prev[id] || 0) + delta }));
  };

  const filteredDirectives = useMemo(() => {
    return DIRECTIVES.filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating + (localRatings[b.id] || 0)) - (a.rating + (localRatings[a.id] || 0));
      return b.popularity - a.popularity;
    });
  }, [searchQuery, activeCategory, sortBy, localRatings]);



  const selectStyle = {
    appearance: 'none' as const,
    background: 'var(--surface-2)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-md)',
    padding: '8px 28px 8px 12px',
    fontSize: 12.5,
    color: 'var(--ink-2)',
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge"><LayoutGrid className="w-3.5 h-3.5" />Inspiratie</div>
        <h1 className="page-title">Inspiratie</h1>
        <p className="page-sub">Blader door honderden gecureerde vragen om je volgende raadssessie te inspireren. Klik op een vraag om deze direct te laden.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Vragen', value: DIRECTIVES.length, icon: Book },
          { label: 'Zichtbaar', value: filteredDirectives.length, icon: LayoutGrid },
          { label: 'Categorieën', value: categories.length - 1, icon: Layers },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon"><Icon className="w-4 h-4" /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Control bar */}
      <div className="control-bar" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="search-wrap" style={{ flex: '1 1 200px' }}>
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Zoek vragen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { value: activeCategory, setter: setActiveCategory, options: categories.map(c => ({ value: c, label: c === 'All' ? 'Alle categorieën' : c })) },
            { value: sortBy, setter: (v: any) => setSortBy(v), options: [{ value: 'popularity', label: 'Populairste' }, { value: 'rating', label: 'Hoogst gewaardeerd' }] },
          ].map((sel, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <select
                value={sel.value}
                onChange={e => sel.setter(e.target.value)}
                aria-label={sel.options[0]?.label || 'Filter'}
                style={selectStyle}
              >
                {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: 'var(--ink-4)', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="nodes-grid">
        {filteredDirectives.length === 0 ? (
          <div className="page-cta" style={{ gridColumn: '1 / -1' }}>
            <Book className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ink-4)' }} />
            <h2 className="page-cta-title">Geen resultaten</h2>
            <p className="page-cta-text">Probeer een andere zoekterm of filter.</p>
          </div>
        ) : filteredDirectives.map(directive => {
          const score = directive.rating + (localRatings[directive.id] || 0);
          return (
            <button
              key={directive.id}
              onClick={() => onSelectMission(directive.query)}
              className="node-tile"
              style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {/* Top row: category + thumbs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 99, background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-3)', fontWeight: 500 }}>
                  {directive.category}
                </span>
                {/* Facebook-style thumbs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={(e) => handleVote(directive.id, 1, e)}
                    title="Nuttig"
                    style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 7px', borderRadius: 99, background: score > 0 ? '#1877f21a' : 'var(--surface-2)', border: `1px solid ${score > 0 ? '#1877f244' : 'var(--line)'}`, cursor: 'pointer', color: score > 0 ? '#1877f2' : 'var(--ink-4)', fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}
                  >
                    <ThumbsUp style={{ width: 12, height: 12 }} />
                    <span>{score > 0 ? score : ''}</span>
                  </button>
                  <button
                    onClick={(e) => handleVote(directive.id, -1, e)}
                    title="Niet nuttig"
                    style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 7px', borderRadius: 99, background: score < 0 ? '#ef44441a' : 'var(--surface-2)', border: `1px solid ${score < 0 ? '#ef444444' : 'var(--line)'}`, cursor: 'pointer', color: score < 0 ? '#ef4444' : 'var(--ink-4)', fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}
                  >
                    <ThumbsDown style={{ width: 12, height: 12 }} />
                    <span>{score < 0 ? Math.abs(score) : ''}</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="node-tile-name" style={{ fontSize: 13 }}>{directive.title}</div>

              {/* Quote */}
              <p style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '2px solid var(--line)', paddingLeft: 10, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                "{directive.query}"
              </p>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: 12, fontSize: 10.5, color: 'var(--ink-4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Layers style={{ width: 11, height: 11 }} />{directive.nodesNeeded} modellen
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 11, height: 11 }} />{directive.length}
                  </span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--ink-2)' }}>
                  Probeer dit <ArrowRight style={{ width: 11, height: 11 }} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="page-cta">
        <ThumbsUp className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ink-3)' }} />
        <h2 className="page-cta-title">Door de community beoordeeld</h2>
        <p className="page-cta-text">Hoe vaker een vraag wordt gebruikt en positief beoordeeld, hoe hoger deze rankt. Draag bij door vragen te gebruiken en te beoordelen.</p>
      </div>
    </div>
  );
};
