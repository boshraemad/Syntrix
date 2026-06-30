import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Search, Plus, ChevronDown, Pencil, X } from 'lucide-react';
import { DASHBOARDS, addDashboard } from '@/utils/dashboardsMockData';
import { showSuccessToast } from '@/utils/toast';

function CreateDashboardModal({ onClose, onCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    const dashboard = addDashboard({
      title: data.title.trim(),
      description: data.description?.trim() || '',
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
    onCreated(dashboard);
  };

  const inputClass =
    'w-full bg-[#111] border border-purple-500/20 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50 focus:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all placeholder-gray-600';
  const labelClass = 'text-[10px] font-semibold text-gray-500 uppercase tracking-widest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-purple-500/30 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold tracking-tight">Create dashboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Title</label>
            <input {...register('title', { required: 'Title is required' })} placeholder="e.g. [Custom] SOC Overview" className={inputClass} />
            {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <input {...register('description')} placeholder="e.g. High-level SOC metrics" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Tags (comma separated)</label>
            <input {...register('tags')} placeholder="e.g. soc, overview" className={inputClass} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50">
              <Plus size={14} strokeWidth={3} /> Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboards() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const rows = useMemo(() => DASHBOARDS.slice(), [refresh]);

  const filteredDashboards = rows.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreated = (dashboard) => {
    setShowCreate(false);
    setRefresh((r) => r + 1);
    showSuccessToast(`Dashboard "${dashboard.title}" created`);
    navigate(`/dashboards/${dashboard.id}`);
  };

  return (
    <div className="pt-6 pb-8 px-4 text-white flex-1 h-full font-sans w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 gap-4 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboards</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-sm font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
        >
          <Plus size={16} strokeWidth={3} />
          Create dashboard
        </button>
      </div>

      {/* Controls: Search and Tags */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#0a0a0a] border border-purple-500/20 rounded-md px-3 py-2.5 focus-within:border-cyan-400/50 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-600"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#0a0a0a] border border-purple-500/20 px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-colors cursor-pointer shadow-lg">
          Tags <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-transparent mt-2 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-4 px-2 w-12 text-center">
                <input type="checkbox" className="accent-purple-500 cursor-pointer w-3.5 h-3.5" />
              </th>
              <th className="py-4 px-4 font-semibold">Title</th>
              <th className="py-4 px-4 font-semibold">Description</th>
              <th className="py-4 px-4 font-semibold">Tags</th>
              <th className="py-4 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDashboards.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-white/5 hover:bg-purple-500/5 hover:border-purple-500/20 transition-colors group"
              >
                <td className="py-3 px-2 text-center align-middle">
                  <input type="checkbox" className="accent-purple-500 cursor-pointer w-3.5 h-3.5" />
                </td>
                <td className="py-3 px-4 font-medium">
                  <Link to={`/dashboards/${doc.id}`} className="text-blue-400 hover:text-cyan-400 hover:underline transition-colors">
                    {doc.title}
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-400">{doc.desc}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags?.map((t) => (
                      <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-right align-middle">
                  <button
                    onClick={() => navigate(`/dashboards/${doc.id}`)}
                    className="text-gray-500 hover:text-cyan-400 transition-colors p-1 rounded-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Open dashboard"
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredDashboards.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No dashboards found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate && <CreateDashboardModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  );
}
