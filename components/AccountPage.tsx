
import { FC } from 'react';
import { 
  Users, 
  MessageSquare, 
  Zap, 
  Database, 
  History, 
  ChevronRight,
  ShieldAlert,
  CreditCard,
  Trash2,
  Archive,
  ChevronLeft,
  CheckCircle2,
  Square,
  CheckSquare
} from 'lucide-react';
import { useState } from 'react';
import { SessionState, AppConfig } from '../types';
import { ScrambleText } from './ScrambleText';

interface AccountPageProps {
  config: AppConfig;
  history: SessionState[];
  onLoadSession: (session: SessionState) => void;
  onDeleteSessions: (ids: string[]) => void;
  onArchiveSessions: (ids: string[]) => void;
}

export const AccountPage: FC<AccountPageProps> = ({ 
  config, 
  history,
  onLoadSession,
  onDeleteSessions,
  onArchiveSessions
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const turnsRemaining = config.isLifetime ? 'Unlimited' : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);

  // Pagination Logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    onDeleteSessions(selectedIds);
    setSelectedIds([]);
  };

  const handleArchive = () => {
    if (selectedIds.length === 0) return;
    onArchiveSessions(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
            <ScrambleText text="Command Center" />
          </h1>
          <p className="max-w-2xl text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            High-integrity neural state management and session orchestration logs.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-5 md:p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] text-black dark:text-white">
            <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
                <span className="block text-[8px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Active Identity</span>
                <span className="font-black text-xs md:text-sm uppercase tracking-tight text-black dark:text-white">FAINL-USER-01</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-20">
        {/* Statistics Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.05)] relative overflow-hidden text-black dark:text-white">
            <div className={`absolute top-0 right-0 p-4 ${config.isLifetime ? 'bg-yellow-400' : 'bg-black dark:bg-white'} text-white dark:text-black rounded-bl-2xl shadow-lg`}>
                <Zap className={`w-5 h-5 ${config.isLifetime ? 'text-black' : 'text-white dark:text-black'}`} />
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white mb-8">Access Integrity</h2>
            <div className="space-y-6 text-black dark:text-white">
                <div>
                    <span className="block text-3xl md:text-4xl font-black">{turnsRemaining}</span>
                    <span className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Turns Available</span>
                </div>
                <div>
                    <span className="block text-3xl md:text-4xl font-black">{config.creditsRemaining}</span>
                    <span className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Orchestration Credits</span>
                </div>
            </div>
          </div>

          <div className="bg-black dark:bg-zinc-900 text-white dark:text-white p-8 rounded-[2rem] border-4 border-black dark:border-white/10 space-y-6">
             <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                 <ShieldAlert className="w-6 h-6 text-yellow-500" />
                 <span className="font-black uppercase tracking-widest text-[10px]">Security Protocol</span>
             </div>
             <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase tracking-wider">
                 Decentralized storage protocol engaged. Your mission data is localized exclusively to this node's environment.
             </p>
          </div>
        </div>

        {/* History Area */}
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b-4 border-black dark:border-white/20 pb-6 text-black dark:text-white">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                <History className="w-6 h-6 md:w-8 md:h-8" />
                Mission History
            </h2>
            <div className="flex items-center gap-3">
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                        <button 
                            onClick={handleArchive}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-black/60 dark:text-white/60"
                            title="Archive Selected"
                        >
                            <Archive className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                            title="Delete Selected"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <span className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full uppercase tracking-widest">
                    {history.length} Saved
                </span>
            </div>
          </div>

          <div className="space-y-4">
            {history.length > 0 && (
                <div className="flex items-center justify-between px-4 pb-2">
                    <button 
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                    >
                        {selectedIds.length === currentHistory.length && currentHistory.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-black dark:text-white" />
                        ) : (
                            <Square className="w-4 h-4" />
                        )}
                        {selectedIds.length === currentHistory.length ? 'Deselect All' : 'Select Page'}
                    </button>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                title="Previous Page"
                                aria-label="Previous Page"
                                className="disabled:opacity-20 hover:scale-110 transition-transform text-black dark:text-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                                {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                title="Next Page"
                                aria-label="Next Page"
                                className="disabled:opacity-20 hover:scale-110 transition-transform text-black dark:text-white"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {history.length === 0 ? (
                <div className="py-20 text-center bg-white/40 border-4 border-dashed border-black/10 rounded-[2rem]">
                    <Database className="w-16 h-16 text-black/5 mx-auto mb-6" />
                    <p className="font-black uppercase tracking-widest text-black/20">No data records found in local vault</p>
                </div>
            ) : (
                currentHistory.map((session) => (
                    <div key={session.id} className="relative group">
                        <button 
                            onClick={(e) => toggleSelect(session.id, e)}
                            className={`absolute left-[-2.5rem] top-1/2 -translate-y-1/2 p-2 transition-all duration-300 ${selectedIds.includes(session.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-black dark:text-white`}
                        >
                            {selectedIds.includes(session.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                        
                        <button 
                            onClick={() => onLoadSession(session)}
                            className={`w-full group/item flex items-center justify-between p-5 md:p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl md:rounded-[2rem] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all text-left text-black dark:text-white overflow-hidden ${session.isArchived ? 'opacity-50 grayscale' : ''} ${selectedIds.includes(session.id) ? 'border-yellow-400 bg-yellow-400/5 dark:bg-yellow-400/5' : ''}`}
                        >
                            <div className="flex items-center gap-5 md:gap-6">
                                <div className={`p-3 md:p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl md:rounded-2xl group-hover/item:bg-black dark:group-hover/item:bg-white group-hover/item:text-white dark:group-hover/item:text-black transition-colors ${selectedIds.includes(session.id) ? 'bg-yellow-400 text-black' : ''}`}>
                                    {session.isArchived ? <Archive className="w-5 h-5" /> : <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                                <div>
                                    <h4 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1 truncate max-w-[150px] sm:max-w-md">"{session.query}"</h4>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                        <span className="text-[8px] md:text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                                        <span className="px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                                            {session.isArchived ? 'Archived' : 'Consensus Achieved'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-2 transition-all opacity-0 md:opacity-100" />
                        </button>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
