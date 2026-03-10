
import { FC } from 'react';
import {
  Users,
  MessageSquare,
  Zap,
  Database,
  History,
  ChevronRight,
  CreditCard,
  Trash2,
  Archive,
  ChevronLeft,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { SessionState, AppConfig, ModelProvider, CouncilMember } from '../types';
import { DEFAULT_COUNCIL } from '../constants';
import { useNavigate } from 'react-router-dom';

interface AccountPageProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  history: SessionState[];
  onLoadSession: (session: SessionState) => void;
  onDeleteSessions: (ids: string[]) => void;
  onArchiveSessions: (ids: string[]) => void;
}

export const AccountPage: FC<AccountPageProps> = ({
  config,
  onUpdateConfig,
  history,
  onLoadSession,
  onDeleteSessions,
  onArchiveSessions
}) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNode, setNewNode] = useState({ name: '', role: '', systemPrompt: '' });

  // Stats
  const creditsRemaining = config.isLifetime ? '∞' : config.creditsRemaining;
  const freeSessiesResterend = config.isLifetime ? '∞' : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);
  const totalSessies = history.length;

  // Pagination Logic
  const activeHistory = history.filter(s => !s.isArchived);
  const totalPages = Math.ceil(activeHistory.length / itemsPerPage);
  const currentHistory = activeHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // A custom node is "active in council" if its id is in config.activeCouncil
  const isNodeActiveInCouncil = (nodeId: string) =>
    config.activeCouncil.some(m => m.id === nodeId);

  const handleToggleNodeInCouncil = (node: CouncilMember) => {
    if (isNodeActiveInCouncil(node.id)) {
      // Remove from council — never remove DEFAULT_COUNCIL members
      onUpdateConfig({
        ...config,
        activeCouncil: config.activeCouncil.filter(m => m.id !== node.id),
      });
    } else {
      onUpdateConfig({
        ...config,
        activeCouncil: [...config.activeCouncil, node],
      });
    }
  };

  const handleAddNode = () => {
    if (!newNode.name || !newNode.role) return;
    const node: CouncilMember = {
      id: `custom-${Date.now()}`,
      name: newNode.name,
      role: newNode.role,
      provider: ModelProvider.GOOGLE,
      modelId: 'gemini-2.0-flash',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newNode.name)}`,
      color: 'bg-zinc-800',
      description: newNode.role || 'Custom AI Node',
      systemPrompt: newNode.systemPrompt || `Jij bent ${newNode.name}. Jouw rol: ${newNode.role}. Analyseer de vraag vanuit jouw specifieke perspectief.`,
    };
    onUpdateConfig({
      ...config,
      customNodes: [...(config.customNodes || []), node],
    });
    setNewNode({ name: '', role: '', systemPrompt: '' });
    setIsAddingNode(false);
  };

  const handleRemoveNode = (id: string) => {
    onUpdateConfig({
      ...config,
      customNodes: config.customNodes.filter(n => n.id !== id),
      activeCouncil: config.activeCouncil.filter(m => m.id !== id),
    });
  };

  const handleResetCouncil = () => {
    onUpdateConfig({ ...config, activeCouncil: DEFAULT_COUNCIL });
  };

  const handleExportData = () => {
    const data = JSON.stringify({ config, history }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fainl_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.config && parsed.history) {
          onUpdateConfig(parsed.config);
          localStorage.setItem('fainl_history', JSON.stringify(parsed.history));
          window.location.reload();
        }
      } catch {
        alert('Ongeldig backup bestand.');
      }
    };
    reader.readAsText(file);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentHistory.map(s => s.id));
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Weet je zeker dat je ${selectedIds.length} sessie(s) wilt verwijderen?`)) return;
    onDeleteSessions(selectedIds);
    setSelectedIds([]);
  };

  const handleArchive = () => {
    if (selectedIds.length === 0) return;
    onArchiveSessions(selectedIds);
    setSelectedIds([]);
  };

  const formatDate = (ts?: number) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('nl-NL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black">
            Commandocentrum
          </h1>
          <p className="text-black font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Beheer je credits, nodes, datakluis en missiegeschiedenis.
          </p>
        </div>
        <button
          onClick={() => navigate('/tokens')}
          className="flex items-center gap-2 px-6 py-3 bg-[#FDC700] border-4 border-black shadow-[4px_4px_0_0_black] font-black text-xs uppercase tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_black] transition-all"
        >
          <CreditCard className="w-4 h-4" />
          Credits Kopen
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16">
        <div className="p-5 bg-black text-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] flex flex-col gap-1">
          <Zap className="w-5 h-5 mb-1 text-[#FDC700]" />
          <div className="text-3xl font-black">{creditsRemaining}</div>
          <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Credits Resterend</div>
        </div>
        <div className="p-5 bg-white border-4 border-black shadow-[4px_4px_0_0_black] flex flex-col gap-1">
          <MessageSquare className="w-5 h-5 mb-1 text-black/40" />
          <div className="text-3xl font-black text-black">{freeSessiesResterend}</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-black/50">Gratis Sessies</div>
        </div>
        <div className="p-5 bg-white border-4 border-black shadow-[4px_4px_0_0_black] flex flex-col gap-1">
          <History className="w-5 h-5 mb-1 text-black/40" />
          <div className="text-3xl font-black text-black">{totalSessies}</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-black/50">Sessies Totaal</div>
        </div>
        <div className="p-5 bg-white border-4 border-black shadow-[4px_4px_0_0_black] flex flex-col gap-1">
          <Users className="w-5 h-5 mb-1 text-black/40" />
          <div className="text-3xl font-black text-black">{config.activeCouncil.length}</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-black/50">Actieve Nodes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

        {/* LEFT COLUMN */}
        <div className="space-y-12">

          {/* Custom Nodes Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Users className="w-6 h-6" />
                Persoonlijke Nodes
              </h2>
              <div className="flex items-center gap-2">
                {config.activeCouncil.length !== DEFAULT_COUNCIL.length && (
                  <button
                    onClick={handleResetCouncil}
                    className="px-3 py-1.5 bg-zinc-100 text-black font-black text-[9px] uppercase tracking-widest border-2 border-black hover:bg-zinc-200 transition-all"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsAddingNode(!isAddingNode)}
                  className="px-4 py-2 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                  {isAddingNode ? 'Annuleren' : '+ Nieuwe Node'}
                </button>
              </div>
            </div>

            {/* Default Council Members (always visible) */}
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-black/30">Standaard Raad</p>
              {DEFAULT_COUNCIL.map(node => (
                <div key={node.id} className="p-3 bg-zinc-50 border-2 border-black/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#FDC700] rounded-full" />
                    <div>
                      <h4 className="font-black uppercase text-xs text-black">{node.name}</h4>
                      <p className="text-[9px] font-bold text-black/40">{node.modelId}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Altijd Actief</span>
                </div>
              ))}
            </div>

            {/* Add Node Form */}
            {isAddingNode && (
              <div className="p-6 bg-zinc-50 border-4 border-black space-y-4 animate-in slide-in-from-top-2 duration-300">
                <p className="text-[9px] font-black uppercase tracking-widest text-black/40">Nieuwe Node op Gemini (2.0 Flash)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Naam (bijv. Juridisch Expert)"
                    value={newNode.name}
                    onChange={e => setNewNode({ ...newNode, name: e.target.value })}
                    className="bg-white border-2 border-black p-3 font-bold text-sm w-full"
                  />
                  <input
                    type="text"
                    placeholder="Rol (bijv. Advocaat)"
                    value={newNode.role}
                    onChange={e => setNewNode({ ...newNode, role: e.target.value })}
                    className="bg-white border-2 border-black p-3 font-bold text-sm w-full"
                  />
                </div>
                <textarea
                  placeholder="Systeem prompt / Instructies (optioneel)..."
                  value={newNode.systemPrompt}
                  onChange={e => setNewNode({ ...newNode, systemPrompt: e.target.value })}
                  className="w-full bg-white border-2 border-black p-3 font-bold text-sm h-28 resize-none"
                />
                <button
                  onClick={handleAddNode}
                  disabled={!newNode.name || !newNode.role}
                  className="w-full py-3 bg-[#FDC700] text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40"
                >
                  Node Activeren
                </button>
              </div>
            )}

            {/* Custom Nodes List */}
            {config.customNodes?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-black/30">Jouw Nodes</p>
                {config.customNodes.map(node => {
                  const isActive = isNodeActiveInCouncil(node.id);
                  return (
                    <div key={node.id} className={`p-4 bg-white border-2 border-black flex items-center justify-between group ${isActive ? 'border-[#FDC700] shadow-[2px_2px_0_0_#FDC700]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#FDC700]' : 'bg-black/20'}`} />
                        <div>
                          <h4 className="font-black uppercase text-xs text-black">{node.name}</h4>
                          <p className="text-[9px] font-bold text-black/40">{node.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleNodeInCouncil(node)}
                          title={isActive ? 'Deactiveer in raad' : 'Activeer in raad'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-[9px] uppercase tracking-widest border transition-all ${isActive ? 'bg-[#FDC700] border-black text-black' : 'bg-zinc-100 border-black/20 text-black/50 hover:border-black hover:text-black'}`}
                        >
                          {isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          {isActive ? 'Actief' : 'Inactief'}
                        </button>
                        <button
                          onClick={() => handleRemoveNode(node.id)}
                          className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                          title="Node Verwijderen"
                          aria-label="Node Verwijderen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(!config.customNodes || config.customNodes.length === 0) && !isAddingNode && (
              <p className="text-center py-6 text-[10px] font-black uppercase tracking-widest text-black/20 italic border-2 border-dashed border-black/10">
                Nog geen persoonlijke nodes aangemaakt
              </p>
            )}
          </div>

          {/* Data Vault Section */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-3 border-b-4 border-black pb-4">
              <Database className="w-6 h-6" />
              Datakluis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center justify-center gap-3 p-6 bg-zinc-50 border-2 border-black hover:bg-black hover:text-white transition-all group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <div className="text-left">
                  <span className="block font-black uppercase text-xs">Export Backup</span>
                  <span className="text-[9px] font-bold opacity-50">Download je data als JSON</span>
                </div>
              </button>
              <label className="flex items-center justify-center gap-3 p-6 bg-zinc-50 border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer group">
                <Upload className="w-5 h-5 group-hover:animate-pulse" />
                <div className="text-left">
                  <span className="block font-black uppercase text-xs">Import Backup</span>
                  <span className="text-[9px] font-bold opacity-50">Herstel vanuit JSON bestand</span>
                </div>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Mission History */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b-4 border-black pb-6 text-black">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <History className="w-6 h-6 md:w-8 md:h-8" />
              Missiegeschiedenis
            </h2>
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in duration-300">
                  <button
                    onClick={handleArchive}
                    className="p-2 hover:bg-black/5 transition-colors text-black/60"
                    title="Archiveer geselecteerde"
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-red-500/10 transition-colors text-red-500"
                    title="Verwijder geselecteerde"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
              <span className="px-4 py-1.5 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                {activeHistory.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {activeHistory.length > 0 && (
              <div className="flex items-center justify-between px-2 pb-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                >
                  {selectedIds.length === currentHistory.length && currentHistory.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-black" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  Selecteer Pagina
                </button>
                {totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="disabled:opacity-20 text-black"
                      aria-label="Vorige pagina"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="disabled:opacity-20 text-black"
                      aria-label="Volgende pagina"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeHistory.length === 0 ? (
              <div className="py-16 text-center bg-zinc-50 border-4 border-dashed border-black/10 rounded-lg">
                <Database className="w-12 h-12 text-black/10 mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-black/20 text-sm mb-2">Lokale Kluis Leeg</p>
                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Start je eerste missie om hem hier te zien</p>
                <button
                  onClick={() => navigate('/mission')}
                  className="mt-6 px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                  Nieuwe Missie
                </button>
              </div>
            ) : (
              currentHistory.map((session) => (
                <div key={session.id} className="relative group/row pl-8">
                  <button
                    onClick={(e) => toggleSelect(session.id, e)}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 p-1 transition-all ${selectedIds.includes(session.id) ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'}`}
                  >
                    {selectedIds.includes(session.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onLoadSession(session)}
                    className="w-full flex items-center justify-between p-4 bg-white border-2 border-black hover:shadow-[6px_6px_0_0_black] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-zinc-100 rounded-lg flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-black" />
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className="text-xs font-black uppercase tracking-tight truncate max-w-[160px] sm:max-w-xs text-black">
                          "{session.query}"
                        </h4>
                        <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest">
                          {formatDate(session.timestamp)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/row:opacity-100 transition-all text-black" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Archived sessions count */}
          {history.filter(s => s.isArchived).length > 0 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-black/30 text-center">
              {history.filter(s => s.isArchived).length} gearchiveerde sessie(s) verborgen
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
