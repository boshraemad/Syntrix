import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Save, Trash2, ChevronLeft, Crosshair, Library } from 'lucide-react';
import { HUNTING_QUERIES, runHuntingQuery } from '@/utils/securityData';
import DocumentTable from '@/components/interval_controls/DocumentTable';
import { showSuccessToast } from '@/utils/toast';

const PLACEHOLDERS = {
  esql: 'FROM logs-* | WHERE event.code == "4625" | LIMIT 100',
  kql: 'event.code:4625 and host.name:DC',
};

export default function Detection() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('esql');
  const [query, setQuery] = useState(HUNTING_QUERIES[0].esql);
  const [result, setResult] = useState(null);

  const visibleQueries = HUNTING_QUERIES.filter((q) => lang === 'esql' || q.kql);
  const categories = [...new Set(visibleQueries.map((q) => q.category))];

  const run = (q = query) => setResult(runHuntingQuery(q, lang));

  const loadQuery = (item) => {
    const text = lang === 'esql' ? item.esql : item.kql;
    setQuery(text);
    setResult(runHuntingQuery(text, lang));
  };

  const switchLang = (next) => {
    if (next === lang) return;
    setLang(next);
    setResult(null);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  };

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
        {/* Saved queries */}
        <aside className="w-64 min-w-[230px] border-r border-white/5 bg-[#0a0a0a] flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Library size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">Saved queries</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{cat}</div>
                <div className="space-y-1">
                  {visibleQueries
                    .filter((q) => q.category === cat)
                    .map((q) => (
                      <button
                        key={q.id}
                        onClick={() => loadQuery(q)}
                        className="w-full text-left text-xs text-gray-400 hover:text-white hover:bg-cyan-500/5 rounded px-2 py-1.5 transition-colors cursor-pointer"
                      >
                        {q.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Editor + results */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-background">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
                  onClick={() => { setQuery(''); setResult(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={13} /> Clear
                </button>
                <button
                  onClick={() => showSuccessToast('Query saved as detection rule (mock)')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer"
                >
                  <Save size={13} /> Save as rule
                </button>
                <button
                  onClick={() => run()}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
                >
                  <Play size={13} /> Run
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto bg-[#0a0a0a]">
            {!result ? (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                Run a query or pick one from the library to see results.
              </div>
            ) : result.error ? (
              <div className="p-4">
                <div className="border border-red-500/30 bg-red-500/5 text-red-400 text-sm rounded-md px-4 py-3 font-mono">
                  {result.error}
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-white/5 text-xs text-gray-500 font-mono">
                  {result.total.toLocaleString()} result{result.total === 1 ? '' : 's'} in {result.took} ms
                  {result.mode === 'stats' && ' • aggregation'}
                </div>
                {result.total === 0 ? (
                  <div className="p-8 text-center text-gray-600 text-sm">No matching events.</div>
                ) : result.mode === 'stats' ? (
                  <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[400px]">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                          {result.columns.map((c) => (
                            <th key={c} className={`py-2 px-3 font-semibold ${c === 'count' ? 'text-right' : ''}`}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                            {result.columns.map((c) => (
                              <td key={c} className={`py-2 px-3 font-mono ${c === 'count' ? 'text-right text-cyan-400' : 'text-gray-300'}`}>
                                {row[c]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <DocumentTable documents={result.rows} columns={['@timestamp', 'Document']} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
