// src/components/DocumentTable.jsx
import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Pencil, X } from "lucide-react";

function formatTimestamp(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso ?? "");
  const pad = (n) => String(n).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `Jan ${pad(d.getDate())}, ${d.getFullYear()} @ ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
}

function buildDocumentPreview(doc) {
  return Object.entries(doc)
    .filter(([k]) => k !== "id")
    .map(([k, v]) => `${k} ${v}`)
    .join(" ");
}

function ExpandedDocRow({ doc, colSpan }) {
  const entries = Object.entries(doc).filter(([k]) => k !== "id");
  return (
    <tr>
      <td colSpan={colSpan} className="bg-gray-800/50 px-4 py-3">
        <table className="w-full text-xs">
          <tbody>
            {entries.map(([key, val]) => (
              <tr key={key} className="border-b border-gray-700/30">
                <td className="text-blue-400 py-1 pr-4 font-mono whitespace-nowrap w-48 align-top">
                  {key}
                </td>
                <td className="text-gray-300 py-1 font-mono break-all">{String(val)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

export default function DocumentTable({ documents, selectedFields = [], onRemoveField, onSort }) {
  const [expandedId, setExpandedId] = useState(null);
  const [sortField, setSortField] = useState("@timestamp");
  const [sortDir, setSortDir] = useState("desc");

  const hasFieldColumns = selectedFields.length > 0;
  const colSpan = 2 + 1 + (hasFieldColumns ? selectedFields.length : 1);

  const handleSort = (field) => {
    const nextDir = field === sortField ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    setSortField(field);
    setSortDir(nextDir);
    onSort?.(field, nextDir);
  };

  const sortedDocs = useMemo(() => {
    const docs = [...documents];
    docs.sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (sortField === "@timestamp") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else {
        const an = parseFloat(av);
        const bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) {
          av = an;
          bv = bn;
        } else {
          av = String(av ?? "").toLowerCase();
          bv = String(bv ?? "").toLowerCase();
        }
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return docs;
  }, [documents, sortField, sortDir]);

  const SortArrow = ({ field }) =>
    sortField === field ? (
      <span className="text-blue-400">{sortDir === "asc" ? "↑" : "↓"}</span>
    ) : null;

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#16181d]">
          <tr className="border-b border-gray-700/60">
            <th className="w-8 px-2 py-2" />
            <th className="w-6 px-1 py-2" />
            <th
              className="text-left px-3 py-2 text-gray-400 font-medium cursor-pointer hover:text-white whitespace-nowrap"
              onClick={() => handleSort("@timestamp")}
            >
              @timestamp <SortArrow field="@timestamp" />
            </th>
            {hasFieldColumns ? (
              selectedFields.map((field) => (
                <th key={field} className="text-left px-3 py-2 text-gray-400 font-medium group">
                  <span className="flex items-center gap-1">
                    <span className="cursor-pointer hover:text-white" onClick={() => handleSort(field)}>
                      {field} <SortArrow field={field} />
                    </span>
                    {onRemoveField && (
                      <button
                        onClick={() => onRemoveField(field)}
                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove column"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </span>
                </th>
              ))
            ) : (
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Document</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedDocs.map((doc) => {
            const expanded = expandedId === doc.id;
            return (
              <>
                <tr key={doc.id} className="border-b border-gray-700/30 hover:bg-gray-800/40 group">
                  <td className="px-2 py-2 text-gray-600 hover:text-blue-400 cursor-pointer">
                    <Pencil size={11} />
                  </td>
                  <td className="px-1 py-2">
                    <input type="checkbox" className="accent-blue-500 cursor-pointer" />
                  </td>
                  <td
                    className="px-3 py-2 text-gray-400 font-mono whitespace-nowrap cursor-pointer hover:text-blue-300 align-top"
                    onClick={() => setExpandedId(expanded ? null : doc.id)}
                  >
                    <span className="flex items-center gap-1">
                      {expanded ? (
                        <ChevronDown size={11} className="text-blue-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight size={11} className="flex-shrink-0" />
                      )}
                      {formatTimestamp(doc["@timestamp"])}
                    </span>
                  </td>
                  {hasFieldColumns ? (
                    selectedFields.map((field) => (
                      <td key={field} className="px-3 py-2 text-gray-300 font-mono align-top break-all">
                        {doc[field] !== undefined && doc[field] !== null ? String(doc[field]) : "-"}
                      </td>
                    ))
                  ) : (
                    <td className="px-3 py-2 text-gray-400 font-mono leading-relaxed">
                      <span className="line-clamp-2 text-[11px]">{buildDocumentPreview(doc)}</span>
                    </td>
                  )}
                </tr>
                {expanded && <ExpandedDocRow key={`${doc.id}-exp`} doc={doc} colSpan={colSpan} />}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
