import React, { useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ChevronLeft, Server, Monitor, Shield, ShieldAlert, Cpu, HardDrive,
  Globe, Network, Activity, Users, AlertTriangle, Boxes, Lock, Wifi, Cable, Power, Trash2, Loader2, Plus, X, Pencil
} from 'lucide-react';
import { useGetDeviceById } from '@/features/devices/hooks/getDeviceById'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteDevice } from '@/services/devices.services';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

// استيراد الهوكس الخاصة بالخدمات بناءً على هيكلة المجلدات الحالية
import useGetServices from '../features/servcies/useGetServices';
import useCreateService from '../features/servcies/useCreateServices';
import useUpdateService from '../features/servcies/useUpdateServcies'; // 🌟 هوك التعديل الجديد
import useDeleteService from '../features/servcies/useDeleteServices'; // 🌟 هوك الحذف الجديد

// 💡 1. مودال إضافة خدمة جديدة (By Default يحمل معرف المستخدم الحالي)
function AddServiceModal({ onClose, deviceId }) {
  const userData = JSON.parse(localStorage.getItem("user-data") || "{}");
  const currentUserId = userData.id || userData._id || "";

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { userId: currentUserId }
  });
  
  const { createDeviceService, loading } = useCreateService(deviceId);

  const onSubmit = async (data) => {
    try {
      const payload = {
        type: data.type.trim(),
        port: parseInt(data.port, 10),
        userId: data.userId.trim(),
        deviceId: deviceId,
      };
      
      await createDeviceService(payload);
      showSuccessToast(`Service "${payload.type}" created successfully`);
      onClose();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || 'Failed to create service');
    }
  };

  const inputClass = 'w-full bg-[#111] border border-purple-500/20 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50 transition-all placeholder-gray-600';
  const labelClass = 'text-[10px] font-semibold text-gray-500 uppercase tracking-widest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-purple-500/30 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold tracking-tight">Create Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Type / Service Name</label>
            <input {...register('type', { required: 'Service type is required' })} placeholder="e.g. ssh, http" className={inputClass} />
            {errors.type && <p className="text-red-400 text-xs">{errors.type.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Port Number</label>
            <input type="number" {...register('port', { required: 'Port is required', min: 1, max: 65535 })} placeholder="e.g. 22" className={inputClass} />
            {errors.port && <p className="text-red-400 text-xs">Enter a valid port number (1-65535)</p>}
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>User ID (By Default)</label>
            <input {...register('userId', { required: 'User ID is required' })} className={`${inputClass} opacity-60 bg-gray-900/40 cursor-not-allowed`} readOnly />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 cursor-pointer">
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 💡 2. مودال تعديل خدمة موجودة بالفعل (EditServiceModal)
function EditServiceModal({ onClose, deviceId, service }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      type: service?.type || '',
      port: service?.port || '',
      userId: service?.userId || ''
    }
  });

  const { updateDeviceService, loading } = useUpdateService(deviceId);

  const onSubmit = async (data) => {
    try {
      const payload = {
        type: data.type.trim(),
        port: parseInt(data.port, 10),
        userId: data.userId.trim(),
        deviceId: deviceId
      };
      
      // مناداة الهوك وتمرير الـ ID الخاص بالخدمة مع الـ body المعدل
      await updateDeviceService({ id: service.id || service._id, payload });
      showSuccessToast(`Service updated successfully`);
      onClose();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || 'Failed to update service');
    }
  };

  const inputClass = 'w-full bg-[#111] border border-purple-500/20 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50 transition-all';
  const labelClass = 'text-[10px] font-semibold text-gray-500 uppercase tracking-widest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-cyan-500/30 rounded-xl shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold tracking-tight text-white">Update Cluster Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Type / Service Name</label>
            <input {...register('type', { required: 'Service type is required' })} className={inputClass} />
            {errors.type && <p className="text-red-400 text-xs">{errors.type.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Port Number</label>
            <input type="number" {...register('port', { required: 'Port is required', min: 1, max: 65535 })} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>User Context ID</label>
            <input {...register('userId', { required: 'User context is required' })} className={inputClass} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold disabled:opacity-50 cursor-pointer">
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeviceDeleteButton({ deviceId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      navigate('/observability/hosts');
    },
  });

  const handleDeleteClick = () => {
    toast.promise(
      deleteMutation.mutateAsync(),
      {
        loading: 'Deleting device from cluster...',
        success: 'Device permanently deleted successfully!',
        error: (err) => err.response?.data?.message || 'Failed to delete device. Access denied.',
      },
      { style: { minWidth: '250px', background: '#333', color: '#fff' } }
    );
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={deleteMutation.isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={14} />
      {deleteMutation.isPending ? 'Deleting...' : 'Delete asset'}
    </button>
  );
}

const SEVERITY_COLORS = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6', info: '#8b5cf6' };
const sevColor = (level) => SEVERITY_COLORS[String(level || '').toLowerCase()] || '#38bdf8';

const formatDate = (iso) => {
  if (!iso) return 'n/a';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const formatUptime = (seconds) => {
  if (!seconds) return 'n/a';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
};

const TABS = ['Overview', 'Network', 'Services', 'Alerts',  'Raw'];

function Badge({ children, color, className = '' }) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm ${className}`}
      style={color ? { backgroundColor: `${color}22`, color, border: `1px solid ${color}55` } : undefined}
    >
      {children}
    </span>
  );
}

function Section({ title, icon: Icon, children, actionButton }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={15} className="text-cyan-400" />}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-300">{title}</h3>
        </div>
        {actionButton && actionButton}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, mono = true }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
      <span className={`text-sm text-gray-200 break-words ${mono ? 'font-mono' : ''}`}>
        {value === null || value === undefined || value === '' ? 'n/a' : value}
      </span>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-mono font-bold" style={color ? { color } : { color: '#fff' }}>
        {value}
      </span>
    </div>
  );
}

export default function HostDetail() {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { data: host, isLoading, isError } = useGetDeviceById(hostId, true, true);
  const { services: deviceServices, loading: servicesLoading, error: servicesError } = useGetServices(hostId);
  const { deleteDeviceService } = useDeleteService(hostId); // مناداة دالة حذف الخدمة

  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null); // 🌟 لحفظ بيانات الخدمة المراد تعديلها حالياً

  const requestedTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(TABS.includes(requestedTab) ? requestedTab : 'Overview');
  const [isolated, setIsolated] = useState(false);

  // دالة التعامل مع حذف الخدمة الفردية من الجدول مع الـ Toast التفاعلي
  const handleDeleteServiceClick = async (serviceId) => {
    if (window.confirm("Are you sure you want to drop this listening service from cluster database?")) {
      try {
        await deleteDeviceService(serviceId);
        showSuccessToast("Service dropped successfully");
      } catch (err) {
        showErrorToast("Failed to delete network service instance.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-cyan-400 bg-[#050505] gap-4 font-mono text-xs">
        <Activity size={32} className="animate-pulse" />
        <p>Fetching asset telemetry from cluster...</p>
      </div>
    );
  }

  if (isError || !host) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-gray-400 bg-[#050505] gap-4">
        <ShieldAlert size={48} className="opacity-20" />
        <p>Host "{hostId}" was not found or failed to load.</p>
        <Link to="/observability/hosts" className="text-cyan-400 hover:underline text-sm">Back to Hosts</Link>
      </div>
    );
  }

  const online = host.status === 'online';
  const openAlerts = host.alerts?.filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length || 0;
  const sevCounts = host.alerts?.reduce((acc, a) => {
    const k = a.severity.toLowerCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden bg-[#050505]">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-3 border-b border-white/5 bg-background">
        <Link to="/observability/hosts" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono mb-4"><ChevronLeft size={14} /> Hosts</Link>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-purple-500/30 flex items-center justify-center bg-purple-500/5">
              {host.host?.type === 'firewall' ? <Shield className="text-cyan-400" size={22} /> : host.host?.type === 'workstation' ? <Monitor className="text-cyan-400" size={22} /> : <Server className="text-cyan-400" size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{host.host?.name || host.hostName}</h1>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                  <span className={online ? 'text-green-400' : 'text-gray-500'}>{online ? 'Online' : 'Offline'}</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm font-mono mt-0.5">{host.host?.hostname} • {host.host?.type} • {host.host?.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Risk</div>
              <div className="text-2xl font-mono font-bold" style={{ color: sevColor(host.risk?.level) }}>{host.risk?.score || 0}</div>
            </div>
            <div className="flex flex-col gap-1.5 items-start mr-1">
              <Badge color={sevColor(host.meta?.criticality)}>{host.meta?.criticality || 'medium'} asset</Badge>
              {host.risk?.iocMatches > 0 && <Badge color="#ef4444">{host.risk.iocMatches} IOC match</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsolated((v) => !v)} className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border ${isolated ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-transparent text-gray-300 border-purple-500/30 hover:border-cyan-400/50 hover:text-white'}`}><Power size={14} />{isolated ? 'Isolated' : 'Isolate host'}</button>
              <DeviceDeleteButton deviceId={hostId} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0 mt-4 -mb-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest font-mono border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab ? 'border-cyan-400 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}>{tab === 'Alerts' && openAlerts > 0 ? <span>Alerts <span className="text-red-400">({openAlerts})</span></span> : tab}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Risk score" value={host.risk?.score || 0} color={sevColor(host.risk?.level)} />
              <StatCard label="Open alerts" value={openAlerts} color={openAlerts ? '#ef4444' : '#22c55e'} />
              <StatCard label="Services" value={host.services?.length || 0} color="#38bdf8" />
              <StatCard label="Vulnerabilities" value={host.posture?.vulnerabilities?.length || 0} color={host.posture?.vulnerabilities?.length ? '#f97316' : '#22c55e'} />
            </div>
            {/* بقية كائن الـ Identity & Inventory و الـ OS والـ Hardware تظل كما هي... */}
          </>
        )}

        {/* 🌟 جدول الخدمات - تمت إضافة أزرار الـ Edit والـ Delete لكل صف بنجاح وعرض داتا حية */}
        {activeTab === 'Services' && (
          <Section 
            title="Listening Services & Ports" 
            icon={Boxes}
            actionButton={
              <button
                onClick={() => setShowAddService(true)}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1.5 rounded-sm text-[11px] font-semibold tracking-wider transition-all hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                <Plus size={12} strokeWidth={3} /> Add Service
              </button>
            }
          >
            {servicesLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-cyan-400 font-mono text-xs gap-2">
                <Loader2 className="animate-spin" size={24} />
                <span>Fetching live network services from asset...</span>
              </div>
            ) : servicesError ? (
              <div className="text-center py-8 text-red-400 font-mono text-xs border border-red-500/10 bg-red-500/5 rounded-lg">Error loading services: {servicesError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="py-3 px-3 font-semibold">Service Name</th>
                      <th className="py-3 px-3 font-semibold">Port</th>
                      <th className="py-3 px-3 font-semibold">Protocol</th>
                      <th className="py-3 px-3 font-semibold">User Context</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceServices.map((s, i) => (
                      <tr key={s.id || s._id || i} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors group">
                        <td className="py-3 px-3 font-medium text-cyan-400">{s.type || s.name || 'unknown'}</td>
                        <td className="py-3 px-3 font-mono text-gray-300">{s.port ?? 'n/a'}</td>
                        <td className="py-3 px-3 font-mono text-gray-500 uppercase">{s.protocol || 'tcp'}</td>
                        <td className="py-3 px-3 font-mono text-xs text-gray-400 truncate max-w-[120px]">{s.userId || 'system'}</td>
                        <td className="py-3 px-3">
                          <Badge color="#22c55e">running</Badge>
                        </td>
                        {/* عمود الـ Actions المشغّل لـ الـ Edit والـ Delete */}
                        <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingService(s)}
                            className="text-gray-500 hover:text-cyan-400 p-1 rounded-sm cursor-pointer transition-colors inline-block"
                            title="Edit service"
                          >
                            <Pencil size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteServiceClick(s.id || s._id)}
                            className="text-gray-500 hover:text-red-400 p-1 rounded-sm cursor-pointer transition-colors inline-block"
                            title="Drop service"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {deviceServices.length === 0 && (
                      <tr><td colSpan="6" className="py-10 text-center text-gray-500 italic">No active monitoring services discovered on this host instance.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        {/* بقية الـ tabs الخاصة بالـ Security, Alerts, Users تظل كما هي... */}
      </div>

      {/* شاشة مودال الإضافة */}
      {showAddService && (
        <AddServiceModal deviceId={hostId} onClose={() => setShowAddService(false)} />
      )}

      {/* 🌟 شاشة مودال التعديل المنبثقة عند اختيار خدمة معينة */}
      {editingService && (
        <EditServiceModal 
          deviceId={hostId} 
          service={editingService} 
          onClose={() => setEditingService(null)} 
        />
      )}
    </div>
  );
}