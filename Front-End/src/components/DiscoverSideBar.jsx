// src/components/DiscoverSideBar.jsx
import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Plus, Filter, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICON_MAP = {
  date: { label: "t", color: "text-yellow-400" },
  keyword: { label: "#", color: "text-blue-400" },
  text: { label: "t", color: "text-green-400" },
  ip: { label: "IP", color: "text-purple-400" },
  long: { label: "#", color: "text-orange-400" },
  _id: { label: "_", color: "text-gray-400" },
  _index: { label: "_", color: "text-gray-400" },
  _score: { label: "_", color: "text-gray-400" },
  _source: { label: "_", color: "text-gray-400" },
  _type: { label: "_", color: "text-gray-400" },
  _version: { label: "_", color: "text-gray-400" },
  _seq_no: { label: "_", color: "text-gray-400" },
  _primary_term: { label: "_", color: "text-gray-400" },
  _routing: { label: "_", color: "text-gray-400" },
};

function FieldTypeIcon({ type }) {
  const config = TYPE_ICON_MAP[type] || { label: "?", color: "text-gray-400" };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold border border-gray-600 flex-shrink-0",
        config.color
      )}
    >
      {config.label}
    </span>
  );
}

function FieldItem({ field, onAdd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-2 px-2 py-[3px] rounded cursor-pointer hover:bg-gray-700/50 group text-xs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FieldTypeIcon type={field.type} />
      <span className="text-gray-300 truncate flex-1">{field.name}</span>
      {hovered && (
        <button
          onClick={() => onAdd?.(field.name)}
          className="text-blue-400 hover:text-blue-300 flex-shrink-0"
          title="Add field as column"
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  );
}

function CollapsibleSection({ title, count, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 w-full px-2 py-1.5 text-xs font-semibold text-gray-300 hover:text-white"
      >
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        <span className="flex-1 text-left">{title}</span>
        {badge !== undefined && (
          <span className="bg-gray-700 text-gray-300 rounded px-1.5 py-0.5 text-[10px] min-w-[22px] text-center">
            {badge}
          </span>
        )}
      </button>
      {open && <div className="mt-0.5">{children}</div>}
    </div>
  );
}

export default function DiscoverSideBar({ fields, onAddField }) {
  const [search, setSearch] = useState("");
  const [filterCount] = useState(0);

  const filterFields = (list) =>
    list.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <aside className="w-56 min-w-[210px] bg-[#0a0a0a] border-r border-gray-700/60 flex flex-col h-full overflow-hidden">
      {/* Field search */}
      <div className="p-2 border-b border-gray-700/60 flex items-center gap-1.5">
        <div className="flex-1 flex items-center gap-1.5 bg-gray-800 border border-gray-600/50 rounded px-2 py-1">
          <Search size={12} className="text-gray-500 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search field names"
            className="bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
        <button className="relative flex items-center justify-center w-7 h-7 rounded border border-gray-600/50 bg-gray-800 text-gray-400 hover:text-white hover:border-gray-500">
          <Filter size={12} />
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* Scrollable field list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent py-2 px-1">
        <CollapsibleSection
          title="Popular fields"
          badge={fields.popular.length}
          defaultOpen
        >
          {filterFields(fields.popular).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Available fields"
          badge={fields.available.length}
          defaultOpen
        >
          {filterFields(fields.available).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Empty fields"
          badge={fields.empty.length}
        >
          {filterFields(fields.empty).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Meta fields"
          badge={fields.meta.length}
        >
          {filterFields(fields.meta).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>
      </div>

      {/* Bottom action button */}
      <div className="p-2 border-t border-transparent w-full mt-auto">
        <button className="flex items-center justify-center gap-2.5 bg-transparent text-white font-semibold text-xs py-2 px-4 border border-gray-700/70 rounded-md w-full transition-all mb-[20px] hover:bg-gray-800/40 hover:border-gray-600">
          <FilePlus2 size={16} strokeWidth={1.8} className="text-gray-300" />
          Add field
        </button>
      </div>
    </aside>
  );
}