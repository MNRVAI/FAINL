import { FC, useState } from 'react';
import { Cpu, ChevronRight, Search, Zap, Globe, Lock, Shield, Plus, Check } from 'lucide-react';
import { CouncilMember, ModelProvider } from '../types';
import { DEFAULT_COUNCIL } from '../constants';

const PROVIDER_BADGE: Record<string, string> = {
  [ModelProvider.GOOGLE]: '#4285F4',
  [ModelProvider.OPENAI]: '#10A37F',
  [ModelProvider.ANTHROPIC]: '#D4A574',
  [ModelProvider.GROQ]: '#F55036',
  [ModelProvider.DEEPSEEK]: '#1A6EFF',
  [ModelProvider.MISTRAL]: '#FF7000',
  [ModelProvider.OPENROUTER]: '#6366F1',
  [ModelProvider.OLLAMA]: '#555555',
};

interface NodesPageProps {
  onOpenSettings?: () => void;
}

export const NodesPage: FC<NodesPageProps> = ({ onOpenSettings }) => {
  const [search, setSearch] = useState('');
  const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_COUNCIL.map(m => m.id));

  const toggle = (id: string) =>
    setActiveIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const filtered = DEFAULT_COUNCIL.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <Cpu className="w-3.5 h-3.5" />
          Nodes
        </div>
        <h1 className="page-title">Mijn AI-Nodes</h1>
        <p className="page-sub">Beheer welke AI-modellen deelnemen aan jouw raad. Activeer, deactiveer of configureer elk knooppunt.</p>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {[
          { label: 'Actieve nodes', value: activeIds.length, icon: Zap },
          { label: 'Beschikbaar', value: DEFAULT_COUNCIL.length, icon: Globe },
          { label: 'Privé nodes', value: 0, icon: Lock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon"><Icon className="w-4 h-4" /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="control-bar">
        <div className="search-wrap">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Zoek op naam of provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={onOpenSettings}>
          <Plus className="w-4 h-4" />
          Eigen node toevoegen
        </button>
      </div>

      {/* Grid */}
      <div className="nodes-grid">
        {filtered.map(member => {
          const isActive = activeIds.includes(member.id);
          const badgeColor = PROVIDER_BADGE[member.provider] ?? '#888';
          return (
            <div key={member.id} className={`node-tile ${isActive ? 'node-tile--active' : ''}`}>
              {/* Provider dot */}
              <div className="node-tile-header">
                <span className="node-avatar" style={{ background: badgeColor + '33', border: `1.5px solid ${badgeColor}44` }}>
                  {member.avatar || member.name.charAt(0)}
                </span>
                <div className="node-tile-meta">
                  <span className="node-tile-name">{member.name}</span>
                  <span className="node-tile-provider" style={{ color: badgeColor }}>
                    {member.provider}
                  </span>
                </div>
                <button
                  onClick={() => toggle(member.id)}
                  className={`node-toggle ${isActive ? 'node-toggle--on' : ''}`}
                  title={isActive ? 'Deactiveren' : 'Activeren'}
                >
                  {isActive ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="node-tile-desc">{member.description}</p>

              <div className="node-tile-footer">
                <span className={`node-role-badge ${member.role === 'CHAIRMAN' ? 'node-role-badge--chair' : ''}`}>
                  {member.role === 'CHAIRMAN' ? 'Voorzitter' : 'Lid'}
                </span>
                <span className="node-model-id">{member.modelId}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="page-cta">
        <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ink-3)' }} />
        <h2 className="page-cta-title">Eigen model toevoegen</h2>
        <p className="page-cta-text">
          Gebruik een OpenAI-compatible API, een lokaal Ollama-model of een bedrijfsspecifiek endpoint als raadslid.
        </p>
        <button className="btn-primary" onClick={onOpenSettings} style={{ margin: '12px auto 0', display: 'flex' }}>
          Instellingen openen <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
