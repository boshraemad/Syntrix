import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Save, Upload, FileCheck } from 'lucide-react';
import { addLogSource, updateLogSource } from '@/utils/logsMockData';

const CATEGORIES = ['endpoint', 'windows', 'network', 'cloud', 'application'];
const AGENTS = ['Auditbeat', 'Winlogbeat', 'Filebeat', 'Elastic Agent', 'Packetbeat', 'Custom'];
const FORMATS = ['ECS', 'raw', 'CEF', 'JSON', 'syslog'];

export default function LogSourceModal({ mode = 'add', source = null, onClose, onSaved }) {
  const isEdit = mode === 'edit' && source;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEdit
      ? {
          name: source.source.name,
          description: source.source.description,
          category: source.source.category,
          agent: source.collector.agent,
          dataset: source.source.dataset,
          index: source.source.index,
          format: source.collector.format,
          tags: (source.meta.tags || []).join(', '),
          enabled: source.meta.enabled,
        }
      : { category: 'application', agent: 'Filebeat', format: 'ECS', enabled: true },
  });

  const fileRef = useRef(null);
  const [jsonData, setJsonData] = useState(null);
  const [jsonFileName, setJsonFileName] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJsonError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('the file must contain a JSON object');
        }
        setJsonData(parsed);
        setJsonFileName(file.name);
      } catch (err) {
        setJsonData(null);
        setJsonFileName('');
        setJsonError(`Could not parse JSON: ${err.message}`);
      }
    };
    reader.onerror = () => setJsonError('Could not read the file');
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearJson = () => {
    setJsonData(null);
    setJsonFileName('');
    setJsonError('');
  };

  const onSubmit = (data) => {
    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      category: data.category,
      agent: data.agent,
      dataset: data.dataset?.trim() || undefined,
      index: data.index?.trim() || undefined,
      format: data.format,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      enabled: !!data.enabled,
      details: jsonData,
    };
    const result = isEdit ? updateLogSource(source.id, payload) : addLogSource(payload);
    onSaved(result);
  };

  const inputClass =
    'w-full bg-[#111] border border-purple-500/20 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50 focus:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all placeholder-gray-600';
  const labelClass = 'text-[10px] font-semibold text-gray-500 uppercase tracking-widest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-purple-500/30 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.15)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold tracking-tight">{isEdit ? 'Edit log source' : 'Add log source'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Source name</label>
            <input
              {...register('name', { required: 'Source name is required' })}
              placeholder="e.g. [Windows] Sysmon"
              className={inputClass}
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <input
              {...register('description')}
              placeholder="e.g. System monitor logs"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <select {...register('category')} className={`${inputClass} cursor-pointer`}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Collector / agent</label>
              <select {...register('agent')} className={`${inputClass} cursor-pointer`}>
                {AGENTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Dataset</label>
              <input {...register('dataset')} placeholder="e.g. windows.sysmon" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Format</label>
              <select {...register('format')} className={`${inputClass} cursor-pointer`}>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Index / data stream</label>
            <input {...register('index')} placeholder="e.g. logs-windows.sysmon-default" className={inputClass} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" {...register('enabled')} className="accent-cyan-500 w-3.5 h-3.5 cursor-pointer" />
            <span className="text-sm text-gray-300">Enabled (actively ingesting)</span>
          </label>

          <div className="space-y-1.5">
            <label className={labelClass}>Detailed info (JSON file) — optional</label>
            {!jsonData ? (
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-purple-500/30 rounded-md py-6 px-3 cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all text-center">
                <Upload size={20} className="text-gray-500" />
                <span className="text-xs text-gray-400">Click to upload a log-source JSON document</span>
                <span className="text-[10px] text-gray-600 leading-relaxed">
                  Populates ingestion stats, storage, detection coverage, sample events, and more.
                  The fields above take precedence.
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  ref={fileRef}
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between gap-2 border border-green-500/30 bg-green-500/5 rounded-md px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-green-400 truncate">
                  <FileCheck size={16} className="flex-shrink-0" />
                  <span className="truncate">{jsonFileName}</span>
                </span>
                <button type="button" onClick={clearJson} className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
                  <X size={16} />
                </button>
              </div>
            )}
            {jsonError && <p className="text-red-400 text-xs">{jsonError}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50"
            >
              {isEdit ? <Save size={14} /> : <Plus size={14} strokeWidth={3} />}
              {isEdit ? 'Save changes' : 'Add log source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
