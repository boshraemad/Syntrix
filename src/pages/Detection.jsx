import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Save, Trash2, ChevronLeft, Crosshair, Library, Loader2, Edit2 } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { 
  useSavedQueries, 
  useExecuteQuery, 
  useCreateSavedQuery, 
  useUpdateSavedQuery, 
  useDeleteSavedQuery 
} from "../features/huntingLogs/hooks/useHunting";

const PLACEHOLDERS = {
  esql: 'FROM logs-* | WHERE event.code == "4625" | LIMIT 100',
  kql: 'event.code:4625 and host.name:DC',
};

export default function Detection() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('esql');
  const [query, setQuery] = useState(PLACEHOLDERS.esql);
  const [queryName, setQueryName] = useState('');
  const [queryCategory, setQueryCategory] = useState('General');
  
  // States للمودالز
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingQuery, setEditingQuery] = useState(null); // لو مش بـ null يبقى بنعمل Edit

  // الـ 5 Hooks كاملين هنا:
  const { data: savedQueriesData, isLoading: isLoadingQueries } = useSavedQueries({ limit: 100 });
  const { mutate: runQuery, isLoading: isRunning, data: queryResult, error: queryError } = useExecuteQuery();
  const { mutate: saveQuery, isLoading: isSaving } = useCreateSavedQuery();
  const { mutate: updateQuery, isLoading: isUpdating } = useUpdateSavedQuery();
  const { mutate: deleteQuery } = useDeleteSavedQuery();

  const queriesList = savedQueriesData?.data || [];
  const visibleQueries = queriesList.filter((q) => (lang === 'esql' ? q.esql : q.kql));
  const categories = [...new Set(visibleQueries.map((q) => q.category || 'General'))];

  const handleRun = () => {
    if (!query.trim()) return;
    runQuery({ query, language: lang });
  };

  const loadQuery = (item) => {
    const text = lang === 'esql' ? item.esql : item.kql;
    if (text) setQuery(text);
  };

  const switchLang = (next) => {
    if (next === lang) return;
    setLang(next);
    setQuery(PLACEHOLDERS[next]);
  };

  // تشغيل الـ Delete Hook
  const handleDelete = (e, id) => {
    e.stopPropagation(); // عشان ميعملش load للـ query وأنت بتمسحه
    if (window.confirm('Are you sure you want to delete this query?')) {
      deleteQuery(id, {
        onSuccess: () => showSuccessToast('Query deleted successfully'),
        onError: () => showErrorToast('Failed to delete query')
      });
    }
  };

  // فتح مودال التعديل وتجهيز البيانات
  const openEditModal = (e, item) => {
    e.stopPropagation();
    setEditingQuery(item);
    setQueryName(item.name);
    setQueryCategory(item.category || 'General');
  };

  // تشغيل الـ Create أو Update بناءً على المودال المفتوح
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!queryName.trim()) return;

    const payload = {
      name: queryName,
      category: queryCategory,
      esql: lang === 'esql' ? query : null,
      kql: lang === 'kql' ? query : null,
    };

    if (editingQuery) {
      // تشغيل الـ Update Hook
      updateQuery({ id: editingQuery.id, data: payload }, {
        onSuccess: () => {
          showSuccessToast('Query updated successfully');
          setEditingQuery(null);
          setQueryName('');
        },
        onError: (err) => showErrorToast(err?.response?.data?.message || 'Failed to update query')
      });
    } else {
      // تشغيل الـ Create Hook
      saveQuery(payload, {
        onSuccess: () => {
          showSuccessToast('Query saved successfully');
          setShowSaveModal(false);
          setQueryName('');
        },
        onError: (err) => showErrorToast(err?.response?.data?.message || 'Failed to save query')
      });
    }
  };

  const resultData = queryResult?.data;

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden bg-[#050505]">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-3 border-b border-white/5 bg-background">
        <button
          onClick={() => navigate('/security')}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono mb-4 cursor-pointer"
        >
          <ChevronLeft size={14} /> Security
        </button>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crosshair className="text-cyan-400" size={22} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Detection</h1>
              <p className="text-gray-500 text-sm">Advanced hunting</p>
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex items-center gap-1 bg-[#111] p-1 rounded-md border border-white/5">
            {['esql', 'kql'].map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors uppercase tracking-wider cursor-pointer ${
                  lang === l ? 'bg-[#222] text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {l === 'esql' ? 'ES|QL' : 'KQL'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Saved queries sidebar */}
        <aside className="w-64 min-w-[230px] border-r border-white/5 bg-[#0a0a0a] flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Library size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">Saved queries</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {isLoadingQueries ? (
              <div className="flex justify-center pt-4"><Loader2 className="animate-spin text-gray-600" size={16} /></div>
            ) : categories.length === 0 ? (
              <div className="text-xs text-gray-600 text-center pt-4">No saved queries.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{cat}</div>
                  <div className="space-y-1">
                    {visibleQueries
                      .filter((q) => (q.category || 'General') === cat)
                      .map((q) => (
                        <div 
                          key={q.id} 
                          onClick={() => loadQuery(q)}
                          className="group w-full flex items-center justify-between text-xs text-gray-400 hover:text-white hover:bg-cyan-500/5 rounded px-2 py-1.5 transition-colors cursor-pointer"
                        >
                          <span className="truncate">{q.name}</span>
                          {/* زراير الـ Edit والـ Delete بتظهر عند الـ Hover */}
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                            <Edit2 
                              size={12} 
                              className="text-gray-500 hover:text-cyan-400 transition-colors" 
                              onClick={(e) => openEditModal(e, q)}
                            />
                            <Trash2 
                              size={12} 
                              className="text-gray-500 hover:text-red-400 transition-colors" 
                              onClick={(e) => handleDelete(e, q.id)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Editor + results */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-background">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleRun();
                }
              }}
              spellCheck={false}
              placeholder={PLACEHOLDERS[lang]}
              className="w-full h-28 bg-[#0a0a0a] border border-purple-500/20 rounded-md px-3 py-2.5 text-sm text-cyan-200 font-mono outline-none focus:border-cyan-400/50 focus:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all resize-none placeholder-gray-700"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-gray-600 font-mono">
                {lang === 'esql' ? 'ES|QL' : 'KQL'} • Ctrl/Cmd + Enter to run
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuery('')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={13} /> Clear
                </button>
                <button
                  onClick={() => { setQueryName(''); setShowSaveModal(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer"
                >
                  <Save size={13} /> Save Query
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 cursor-pointer"
                >
                  {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />} Run
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-auto bg-[#0a0a0a]">
            {isRunning ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-500 text-sm font-mono">
                <Loader2 className="animate-spin text-cyan-400" size={24} />
                Executing advanced hunting query...
              </div>
            ) : queryError || queryResult?.status === 'ERROR' ? (
              <div className="p-4">
                <div className="border border-red-500/30 bg-red-500/5 text-red-400 text-sm rounded-md px-4 py-3 font-mono">
                  {queryError?.response?.data?.message || queryResult?.message || 'An error occurred during execution.'}
                </div>
              </div>
            ) : !resultData ? (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                Run a query or pick one from the library to see results.
              </div>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-white/5 text-xs text-gray-500 font-mono flex justify-between">
                  <span>
                    {resultData.total?.toLocaleString() || 0} result{(resultData.total === 1) ? '' : 's'} in {resultData.took || 0} ms
                  </span>
                  <span className="uppercase text-cyan-500/70">{resultData.mode}</span>
                </div>
                
                {(!resultData.rows || resultData.rows.length === 0) ? (
                  <div className="p-8 text-center text-gray-600 text-sm">No matching events found.</div>
                ) : (
                  <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest bg-white/[0.01]">
                          {resultData.columns?.map((col) => (
                            <th key={col} className="py-2.5 px-3 font-semibold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {resultData.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                            {resultData.columns?.map((col) => (
                              <td key={col} className="py-2.5 px-3 font-mono text-xs text-gray-300 max-w-xs truncate">
                                {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* مودال مشترك للـ Create والـ Update */}
      {(showSaveModal || editingQuery) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#050505] border border-cyan-500/20 w-full max-w-md rounded-xl p-6 space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {editingQuery ? 'Update Saved Query' : 'Save Current Query'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Query Name</label>
                <input
                  type="text"
                  required
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
                  placeholder="e.g. Failed Admin Logins"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Category</label>
                <input
                  type="text"
                  required
                  value={queryCategory}
                  onChange={(e) => setQueryCategory(e.target.value)}
                  className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
                  placeholder="e.g. Authentication"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowSaveModal(false); setEditingQuery(null); setQueryName(''); }}
                  className="px-4 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUpdating}
                  className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  {(isSaving || isUpdating) && <Loader2 size={12} className="animate-spin" />} 
                  {editingQuery ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}