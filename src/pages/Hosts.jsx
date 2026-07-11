import React, { useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Search, Plus, ChevronDown, Pencil, X, Upload, FileCheck } from 'lucide-react';
import { HOSTS } from '@/utils/hostsMockData'; 
import { showSuccessToast } from '@/utils/toast';
import { useGetDevices } from '@/features/devices/hooks/getDevices';
import { useCreateDevice } from '../features/devices/hooks/createDevices'; 
import { useUpdateDevice } from '../features/devices/hooks/updateDevice'; // 🌟 استيراد هوك التعديل الجديد

function AddHostModal({ onClose, initialData }) {
  const isEditMode = !!initialData; // 🌟 فحص إذا كنا في وضع التعديل أم الإضافة

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ 
    defaultValues: { 
      name: initialData?.title || '', // وضع القيم القديمة تلقائياً في الفورم
      ip: initialData?.ip || '',
      type: 'server', 
      criticality: 'medium' 
    } 
  });

  const fileRef = useRef(null);
  const [jsonData, setJsonData] = useState(null);
  const [jsonFileName, setJsonFileName] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { mutate: handleAddHost, isPending: isCreating } = useCreateDevice();
  const { mutate: handleUpdateHost, isPending: isUpdating } = useUpdateDevice(); // 🌟 هوك التعديل

  const isSubmitting = isCreating || isUpdating;

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
    const finalData = {
      hostName: data.name.trim(),
      ip: data.ip?.trim() || "",
    };

    if (isEditMode) {
      // 🌟 تشغيل دالة التعديل وإرسال الـ ID مع الـ Body الجديد
      handleUpdateHost({ id: initialData.id, deviceData: finalData }, {
        onSuccess: () => {
          showSuccessToast(`Host "${data.name.trim()}" updated successfully`);
          onClose();
        }
      });
    } else {
      // تشغيل دالة الإضافة الافتراضية
      handleAddHost(finalData, {
        onSuccess: () => {
          showSuccessToast(`Host "${data.name.trim()}" added`);
          onClose();
        },
      });
    }
  };

  const inputClass =
    'w-full bg-[#111] border border-purple-500/20 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50 focus:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all placeholder-gray-600';
  const labelClass = 'text-[10px] font-semibold text-gray-500 uppercase tracking-widest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-purple-500/30 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.15)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          {/* 🌟 تغيير العنوان بناءً على الـ Mode */}
          <h2 className="text-lg font-bold tracking-tight">{isEditMode ? 'Update host' : 'Add host'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Hostname</label>
            <input
              {...register('name', { required: 'Hostname is required' })}
              placeholder="e.g. WS-jdoe"
              className={inputClass}
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <input
              {...register('description')}
              placeholder="e.g. Workstation for J. Doe"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>IP address</label>
            <input
              {...register('ip', {
                required: 'IP address is required',
                validate: (v) =>
                  !v ||
                  /^(\d{1,3}\.){3}\d{1,3}$/.test(v.trim()) ||
                  'Enter a valid IPv4 address',
              })}
              placeholder="e.g. 10.0.20.60"
              className={inputClass}
            />
            {errors.ip && <p className="text-red-400 text-xs">{errors.ip.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Type</label>
              <select {...register('type')} className={`${inputClass} cursor-pointer`}>
                <option value="server">Server</option>
                <option value="workstation">Workstation</option>
                <option value="firewall">Firewall / Network device</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Criticality</label>
              <select {...register('criticality')} className={`${inputClass} cursor-pointer`}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Detailed info (JSON file) — optional</label>
            {!jsonData ? (
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-purple-500/30 rounded-md py-6 px-3 cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all text-center">
                <Upload size={20} className="text-gray-500" />
                <span className="text-xs text-gray-400">Click to upload a host JSON document</span>
                <span className="text-[10px] text-gray-600 leading-relaxed">
                  Populates OS, hardware, network, agent, services, tags, and more.
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
                <button
                  type="button"
                  onClick={clearJson}
                  className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                >
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
            {/* 🌟 تغيير نص الزرار بناءً على الـ Mode والحالة الحاليّة */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50"
            >
              <Plus size={14} strokeWidth={3} /> {isEditMode ? (isUpdating ? 'Updating...' : 'Update host') : (isCreating ? 'Adding...' : 'Add host')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Hosts() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingHost, setEditingHost] = useState(null); // 🌟 State لحفظ الجهاز المراد تعديله

  const { data: devicesData, isLoading, isError } = useGetDevices();

  const rows = useMemo(() => {
    const list = devicesData?.data || devicesData || [];
    
    if (list.length === 0 && !isLoading && !isError) {
      return HOSTS.map((h) => ({
        id: h.id,
        title: h.host.name,
        desc: h.meta.description,
        tags: h.meta.tags,
        ip: h.host.ip?.[0] || ''
      }));
    }

    return list.map((item) => ({
      id: item.id || item._id,
      title: item.hostName || item.title || item.name || 'Unknown Host',
      desc: item.desc || item.description || 'No description provided.',
      tags: item.tags || [],
      ip: item.ip || '', // حفظ الـ IP لاستدعائه عند التعديل
    }));
  }, [devicesData, isLoading, isError]);

  const filteredHosts = rows.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pt-6 pb-8 px-4 text-white flex-1 h-full font-sans w-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 gap-4 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Hosts</h1>
        <button
          onClick={() => {
            setEditingHost(null); // التأكد من تصفير الـ Edit Mode عند فتح إضافة جديد
            setShowAdd(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-sm font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
        >
          <Plus size={16} strokeWidth={3} />
          Add host
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#0a0a0a] border border-purple-500/20 rounded-md px-3 py-2.5 focus-within:border-cyan-400/50 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search hosts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-600"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#0a0a0a] border border-purple-500/20 px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-colors cursor-pointer shadow-lg">
          Tags <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 bg-transparent mt-2 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-4 px-2 w-12 text-center">
                <input type="checkbox" className="accent-purple-500 cursor-pointer w-3.5 h-3.5" />
              </th>
              <th className="py-4 px-4 font-semibold">Hostname</th>
              <th className="py-4 px-4 font-semibold">Description</th>
              <th className="py-4 px-4 font-semibold">Tags</th>
              <th className="py-4 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs font-mono text-cyan-400">Loading hosts...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs font-mono text-red-400">Failed to fetch data from API.</td>
              </tr>
            ) : (
              filteredHosts.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-white/5 hover:bg-purple-500/5 hover:border-purple-500/20 transition-colors group"
                >
                  <td className="py-3 px-2 text-center align-middle">
                    <input type="checkbox" className="accent-purple-500 cursor-pointer w-3.5 h-3.5" />
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <Link
                      to={`/observability/hosts/${doc.id}`}
                      className="text-blue-400 hover:text-cyan-400 hover:underline transition-colors"
                    >
                      {doc.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {doc.desc}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags?.map((t) => (
                        <span
                          key={t}
                          className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right align-middle">
                    {/* 🌟 زر الـ Pencil القديم: يظهر عند الـ Hover ومربوط بالـ Click لفتح المودال وتمرير بيانات الـ Row الحالية */}
                    <button 
                      onClick={() => {
                        setEditingHost(doc);
                        setShowAdd(true);
                      }}
                      className="text-gray-500 hover:text-cyan-400 transition-colors p-1 rounded-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && filteredHosts.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No hosts found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 تمرير الـ editingHost للمودال إن وُجد */}
      {showAdd && (
        <AddHostModal 
          onClose={() => {
            setShowAdd(false);
            setEditingHost(null);
          }} 
          initialData={editingHost}
        />
      )}
    </div>
  );
}