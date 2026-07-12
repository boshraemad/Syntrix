import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import useCreateLogSource from '@/features/logsources/hooks/useCreateLogSource';
import useUpdateLogSource from '@/features/logsources/hooks/useUpdateLogSource';

export default function LogSourceModal({ mode, source, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const { createSource, loading: isCreating } = useCreateLogSource();
  const { updateSource, loading: isUpdating } = useUpdateLogSource();
  const [submitting, setSubmitting] = useState(false);

  // الـ state مفرودة بالكامل بناءً على مواصفات الـ Swagger الجديد
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    vendor: '',
    product: '',
    description: '',
    dataset: '',
    agent: '',
    pipeline: '',
    index: '',
    retentionDays: 30,
    shards: 1,
    enabled: true,
    tags: '',
  });

  // فك الـ Nested structure القديم عشان نملا الـ Form في حالة الـ Edit
  useEffect(() => {
    if (isEdit && source) {
      setFormData({
        name: source.source?.name || '',
        category: source.source?.category || '',
        vendor: source.source?.vendor || '',
        product: source.source?.product || '',
        description: source.source?.description || '',
        dataset: source.source?.dataset || '',
        agent: source.collector?.agent || '',
        pipeline: source.collector?.pipeline || '',
        index: source.source?.index || '',
        retentionDays: source.storage?.retentionDays ?? 30,
        shards: source.storage?.shards ?? 1,
        enabled: source.meta?.enabled ?? true,
        tags: source.meta?.tags ? source.meta.tags.join(', ') : '',
      });
    }
  }, [isEdit, source]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // تجهيز الداتا وتحويل القيم الرقمية والـ Tags لـ Array
    const payload = {
      ...formData,
      retentionDays: parseInt(formData.retentionDays, 10) || 0,
      shards: parseInt(formData.shards, 10) || 0,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter((t) => t !== '')
        : [],
    };

    try {
      if (isEdit) {
        // الـ PATCH المفرود باستخدام الـ Hook الجديد
        const response = await updateSource(source.id, payload);
        onSaved(response);
      } else {
        // الـ CREATE المفرود
        const response = await createSource(payload);
        onSaved(response);
      }
    } catch (error) {
      console.error('Failed to save log source:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = isCreating || isUpdating || submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#050505] border border-cyan-500/20 w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {isEdit ? 'Edit Log Source' : 'Create New Log Source'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Source Name</label>
              <input
                type="text"
                name="name"
                required={!isEdit}
                value={formData.name}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Category</label>
              <input
                type="text"
                name="category"
                required={!isEdit}
                value={formData.category}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Vendor */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Vendor</label>
              <input
                type="text"
                name="vendor"
                required={!isEdit}
                value={formData.vendor}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Product */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Product</label>
              <input
                type="text"
                name="product"
                required={!isEdit}
                value={formData.product}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Dataset */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Dataset</label>
              <input
                type="text"
                name="dataset"
                required={!isEdit}
                value={formData.dataset}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Agent */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Agent</label>
              <input
                type="text"
                name="agent"
                required={!isEdit}
                value={formData.agent}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Pipeline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Pipeline</label>
              <input
                type="text"
                name="pipeline"
                required={!isEdit}
                value={formData.pipeline}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Index */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Index</label>
              <input
                type="text"
                name="index"
                required={!isEdit}
                value={formData.index}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            {/* Retention Days */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Retention Days</label>
              <input
                type="number"
                name="retentionDays"
                required={!isEdit}
                min="0"
                value={formData.retentionDays}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors font-mono"
              />
            </div>

            {/* Shards */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Shards</label>
              <input
                type="number"
                name="shards"
                required={!isEdit}
                min="0"
                value={formData.shards}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              placeholder="e.g. production, security, auth"
              value={formData.tags}
              onChange={handleChange}
              className="bg-[#0a0a0a] border border-cyan-500/10 focus:border-cyan-400/50 rounded-md px-3 py-2 text-sm text-white outline-none transition-colors"
            />
          </div>

          {/* Enabled Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
              className="accent-cyan-500 cursor-pointer w-4 h-4"
            />
            <label htmlFor="enabled" className="text-xs uppercase tracking-wider text-gray-300 font-semibold cursor-pointer select-none">
              Enabled
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white rounded-md text-xs uppercase tracking-wider font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] disabled:opacity-50 disabled:transform-none cursor-pointer"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Source'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}