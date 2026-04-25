import { FC, useState } from 'react';
import { Users, MessageSquare, Zap, Database, History, ChevronRight, Shield, Trash2, Archive, ChevronLeft, CheckCircle2, Square, CheckSquare, Infinity as InfinityIcon } from 'lucide-react';
import { SessionState, AppConfig } from '../types';

interface AccountPageProps {
  config: AppConfig;
  history: SessionState[];
  onLoadSession: (session: SessionState) => void;
  onDeleteSessions: (ids: string[]) => void;
  onArchiveSessions: (ids: string[]) => void;
  mode?: 'answers' | 'verdicts';
}

export const AccountPage: FC<AccountPageProps> = ({ config, history, onLoadSession, onDeleteSessions, onArchiveSessions, mode = 'answers' }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const turnsRemaining = config.isLifetime
    ? <InfinityIcon className="w-5 h-5" />
    : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === currentHistory.length ? [] : currentHistory.map(s => s.id));
  };
  const handleDelete = () => { if (selectedIds.length === 0) return; onDeleteSessions(selectedIds); setSelectedIds([]); };
  const handleArchive = () => { if (selectedIds.length === 0) return; onArchiveSessions(selectedIds); setSelectedIds([]); };

  const S = { // inline style helpers
    card: { padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)' } as React.CSSProperties,
    row: { display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties,
  };

  return (
    <div className="page-container animate-fade-in-up">
      <div className="page-header">
        <div className="page-badge">
          {mode === 'verdicts'
            ? <><Shield className="w-3.5 h-3.5" />Uitspraken</>
            : <><MessageSquare className="w-3.5 h-3.5" />Antwoorden</>
          }
        </div>
        <h1 className="page-title">
          {mode === 'verdicts' ? 'Uitspraken' : 'Mijn antwoorden'}
        </h1>
        <p className="page-sub">
          {mode === 'verdicts'
            ? 'Bekijk eerder gegenereerde uitspraken van de AI-raad. Klik op een uitspraak om terug te keren naar de sessie.'
            : 'Bekijk, herstel of verwijder eerdere AI-antwoorden. Alles wordt lokaal opgeslagen.'
          }
        </p>
      </div>

      <div className="stats-row">
        {[
          { label: 'Beurten resterend', value: turnsRemaining, icon: Zap },
          { label: 'Credits resterend', value: config.creditsRemaining ?? 0, icon: Zap },
          { label: 'Opgeslagen sessies', value: history.length, icon: History },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon"><Icon className="w-4 h-4" /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="key-card">
            <div className="key-card-header">
              <span className="key-label"><Zap className="w-4 h-4 inline mr-1" style={{verticalAlign:-3}} />Toegangsstatus</span>
              {config.isLifetime && <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'var(--surface-2)',border:'1px solid var(--line)'}}>∞ Levenslang</span>}
            </div>
            {[['Beurten resterend', turnsRemaining], ['Credits resterend', config.creditsRemaining ?? 0]].map(([label, val]) => (
              <div key={String(label)} style={S.card}>
                <div style={{fontFamily:'var(--f-display)',fontSize:'1.4rem',fontWeight:700,color:'var(--ink)',display:'flex',alignItems:'center'}}>{val}</div>
                <div style={{fontSize:10,color:'var(--ink-4)',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:2}}>{String(label)}</div>
              </div>
            ))}
          </div>

          <div className="key-card" style={{flexDirection:'row',alignItems:'flex-start',gap:14}}>
            <div className="stat-icon" style={{flexShrink:0,margin:0,background:'#22c55e1a',border:'1px solid #22c55e33'}}>
              <Shield className="w-4 h-4" style={{color:'#22c55e'}} />
            </div>
            <div>
              <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',marginBottom:4}}>Lokale beveiliging</div>
              <div style={{fontSize:11.5,color:'var(--ink-4)',lineHeight:1.55}}>Alle sessiegegevens worden uitsluitend lokaal opgeslagen. Niets verlaat je apparaat.</div>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{...S.row,justifyContent:'space-between'}}>
            <div style={{...S.row,fontSize:13,fontWeight:700,color:'var(--ink)'}}>
              <History className="w-4 h-4" style={{color:'var(--ink-3)'}} />Sessiegeschiedenis
            </div>
            {selectedIds.length > 0 && (
              <div style={S.row}>
                <span style={{fontSize:11,color:'var(--ink-4)'}}>{selectedIds.length} geselecteerd</span>
                <button onClick={handleArchive} title="Archiveren" style={{padding:6,borderRadius:8,background:'none',border:'1px solid var(--line)',cursor:'pointer',color:'var(--ink-3)',display:'flex'}}>
                  <Archive className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} title="Verwijderen" style={{padding:6,borderRadius:8,background:'none',border:'1px solid #ef444444',cursor:'pointer',color:'#ef4444',display:'flex'}}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div style={{...S.row,justifyContent:'space-between'}}>
              <button onClick={toggleSelectAll} style={{...S.row,fontSize:11,color:'var(--ink-4)',background:'none',border:'none',cursor:'pointer'}}>
                {selectedIds.length === currentHistory.length && currentHistory.length > 0
                  ? <CheckSquare className="w-3.5 h-3.5" style={{color:'var(--ink)'}} />
                  : <Square className="w-3.5 h-3.5" />}
                {selectedIds.length === currentHistory.length ? 'Alles deselecteren' : 'Pagina selecteren'}
              </button>
              {totalPages > 1 && (
                <div style={S.row}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} title="Vorige pagina"
                    style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,border:'1px solid var(--line)',background:'none',cursor:'pointer',opacity:currentPage===1?0.3:1}}>
                    <ChevronLeft className="w-4 h-4" style={{color:'var(--ink-3)'}} />
                  </button>
                  <span style={{fontSize:11,color:'var(--ink-4)'}}>{currentPage} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} title="Volgende pagina"
                    style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,border:'1px solid var(--line)',background:'none',cursor:'pointer',opacity:currentPage===totalPages?0.3:1}}>
                    <ChevronRight className="w-4 h-4" style={{color:'var(--ink-3)'}} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {history.length === 0 ? (
              <div className="page-cta" style={{padding:'40px 24px'}}>
                <Database className="w-8 h-8 mx-auto mb-3" style={{color:'var(--ink-4)'}} />
                <h2 className="page-cta-title">Nog geen sessies</h2>
                <p className="page-cta-text">Je voltooide raadsessies verschijnen hier. Stel een vraag om te beginnen.</p>
              </div>
            ) : currentHistory.map(session => (
              <div key={session.id} style={{position:'relative'}}>
                <button onClick={(e) => toggleSelect(session.id, e)}
                  style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',zIndex:10,background:'none',border:'none',cursor:'pointer',
                    opacity:selectedIds.includes(session.id)?1:0,transition:'opacity 0.2s'}}>
                  {selectedIds.includes(session.id)
                    ? <CheckSquare className="w-4 h-4" style={{color:'var(--ink)'}} />
                    : <Square className="w-4 h-4" style={{color:'var(--ink-4)'}} />}
                </button>
                <button onClick={() => onLoadSession(session)}
                  style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'12px 14px 12px 38px',
                    background:selectedIds.includes(session.id)?'var(--surface-2)':'var(--surface)',
                    border:`1px solid ${selectedIds.includes(session.id)?'var(--ink-4)':'var(--line)'}`,
                    borderRadius:'var(--r-lg)',cursor:'pointer',textAlign:'left',transition:'border-color 0.15s',
                    opacity:session.isArchived?0.55:1}}
                  onMouseOver={e=>(e.currentTarget.style.borderColor='var(--ink-4)')}
                  onMouseOut={e=>(e.currentTarget.style.borderColor=selectedIds.includes(session.id)?'var(--ink-4)':'var(--line)')}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
                    <div className="stat-icon" style={{width:28,height:28,flexShrink:0,margin:0}}>
                      {session.isArchived ? <Archive className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        "{session.query}"
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
                        <span style={{fontSize:10.5,color:'var(--ink-4)'}}>{new Date().toLocaleDateString('nl-NL')}</span>
                        {session.isArchived
                          ? <span style={{fontSize:10,background:'var(--surface-2)',border:'1px solid var(--line)',padding:'1px 6px',borderRadius:4,color:'var(--ink-4)'}}>Gearchiveerd</span>
                          : session.synthesis
                            ? <span style={{fontSize:10,background:'#22c55e1a',border:'1px solid #22c55e33',padding:'1px 6px',borderRadius:4,color:'#22c55e',display:'flex',alignItems:'center',gap:3}}>
                                <CheckCircle2 className="w-2.5 h-2.5" />Gesynthetiseerd
                              </span>
                            : null}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{color:'var(--ink-4)',flexShrink:0}} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
