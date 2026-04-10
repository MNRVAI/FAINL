import { FC, useState } from 'react';
import {
  Users,
  MessageSquare,
  Zap,
  Database,
  History,
  ChevronRight,
  Shield,
  Trash2,
  Archive,
  ChevronLeft,
  CheckCircle2,
  Square,
  CheckSquare,
  Infinity as InfinityIcon,
} from 'lucide-react';
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
  onArchiveSessions,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const turnsRemaining = config.isLifetime
    ? <InfinityIcon className="w-7 h-7 text-zinc-700" />
    : Math.max(0, config.totalTurnsAllowed - config.turnsUsed);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
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
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 animate-fade-in-up">

      {/* Page Header */}
      <div className="mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-1000/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold tracking-wide mb-3">
          <Users className="w-3.5 h-3.5" />
          Account
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          <ScrambleText text="Command Center" />
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1.5">
          Manage your sessions, usage, and local data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">

        {/* ── Sidebar Stats ── */}
        <div className="space-y-4">

          {/* Access Stats */}
          <div className="glass-card card-shadow rounded-2xl overflow-hidden">
            <div className="h-px bg-linear-to-r from-transparent via-zinc-500/15 to-transparent" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Access Status</h2>
                {config.isLifetime && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold">
                    <Zap className="w-3 h-3" /> Lifetime
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/3 border border-zinc-100 dark:border-white/6">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    {turnsRemaining}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">
                    Turns remaining
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/3 border border-zinc-100 dark:border-white/6">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {config.creditsRemaining}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">
                    Credits remaining
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="glass-card card-shadow rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Local Security</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
              All session data is stored exclusively in your browser's local storage. Nothing leaves your device.
            </p>
          </div>

          {/* Session Count */}
          <div className="glass-card card-shadow rounded-2xl p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center">
              <History className="w-4 h-4 text-zinc-700" />
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{history.length}</div>
              <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Saved sessions</div>
            </div>
          </div>
        </div>

        {/* ── History Area ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-700" />
              Session History
            </h2>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    {selectedIds.length} selected
                  </span>
                  <button
                    onClick={handleArchive}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 transition-all"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Select All + Pagination row */}
          {history.length > 0 && (
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                {selectedIds.length === currentHistory.length && currentHistory.length > 0
                  ? <CheckSquare className="w-3.5 h-3.5 text-zinc-700" />
                  : <Square className="w-3.5 h-3.5" />
                }
                {selectedIds.length === currentHistory.length ? 'Deselect all' : 'Select page'}
              </button>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  </button>
                  <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-2.5">
            {history.length === 0 ? (
              <div className="py-16 text-center glass-card card-shadow rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">No sessions yet</p>
                <p className="text-[11px] text-zinc-300 dark:text-zinc-600 mt-1">Your completed missions will appear here</p>
              </div>
            ) : (
              currentHistory.map((session) => (
                <div key={session.id} className="relative group">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => toggleSelect(session.id, e)}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${
                      selectedIds.includes(session.id)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {selectedIds.includes(session.id)
                      ? <CheckSquare className="w-4 h-4 text-zinc-700" />
                      : <Square className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    }
                  </button>

                  <button
                    onClick={() => onLoadSession(session)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left group/item ${
                      session.isArchived ? 'opacity-50' : ''
                    } ${
                      selectedIds.includes(session.id)
                        ? 'border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-1000/5'
                        : 'glass-card card-shadow hover:card-shadow-hover'
                    } pl-10`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        session.isArchived
                          ? 'bg-zinc-100 dark:bg-white/5'
                          : 'bg-zinc-100 dark:bg-white/5 group-hover/item:bg-zinc-200 dark:group-hover/item:bg-white/10'
                      }`}>
                        {session.isArchived
                          ? <Archive className="w-3.5 h-3.5 text-zinc-400" />
                          : <MessageSquare className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-500 transition-colors" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          "{session.query}"
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            {new Date().toLocaleDateString()}
                          </span>
                          {session.isArchived ? (
                            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                              Archived
                            </span>
                          ) : session.synthesis ? (
                            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Synthesized
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover/item:text-zinc-700 group-hover/item:translate-x-0.5 transition-all shrink-0" />
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
