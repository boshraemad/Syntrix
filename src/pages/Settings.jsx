import ThemeToggle from "@/components/ToggleButton";
import { useState } from "react";


const SESSIONS = [
  {
    id: "sess_01",
    device: "Current Device",
    detail: "Windows 11 / Chrome 126",
    location: "Cairo, Egypt",
    ip: "197.45.12.88",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "sess_02",
    device: "Linux Server",
    detail: "Ubuntu 22.04 / SSH Client",
    location: "Cairo, Egypt",
    ip: "156.202.4.19",
    lastActive: "12 minutes ago",
    current: false,
  },
  {
    id: "sess_03",
    device: "MacBook Pro",
    detail: "macOS Sonoma / Safari 17",
    location: "Alexandria, Egypt",
    ip: "154.178.90.3",
    lastActive: "3 hours ago",
    current: false,
  },
  {
    id: "sess_04",
    device: "Mobile Device",
    detail: "Android 14 / Chrome Mobile",
    location: "Mansoura, Egypt",
    ip: "41.235.14.201",
    lastActive: "1 day ago",
    current: false,
  },
];

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Change Password" },
  { id: "sessions", label: "Active Sessions" },
];


function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02]">
      <div className="border-b border-white/5 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] text-slate-600">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20";

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-purple-500 text-black hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)]",
    ghost:
      "border border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300",
    danger:
      "border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40",
  };
  return (
    <button
      className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function StatusPill({ children, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/5",
    green: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
    gray: "border-white/10 text-slate-400 bg-white/[0.02]",
  };
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function ProfileSection() {
  const [form, setForm] = useState({
    name: "Ahmed Bakr",
    email: "ahmed.bakr@sentinel-sec.io",
    role: "Security Analyst II",
  });
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const initials = form.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1800);
    }, 900);
  }

  return (
    <SectionCard
      title="Profile"
      description="Your identity as it appears across the platform and in audit logs."
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-lg font-semibold text-cyan-300">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{form.name}</p>
          <p className="text-xs text-slate-500">{form.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name">
          <input
            className={inputBase}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            className={inputBase}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Role" hint="Managed by your organization admin">
          <input className={`${inputBase} opacity-60`} value={form.role} disabled />
        </Field>
        <Field label="User ID" hint="Read-only, used for audit trails">
          <input className={`${inputBase} opacity-60`} value="usr_8827f1a0" disabled />
        </Field>

        <div className="col-span-full mt-2 flex items-center gap-3">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save Changes"}
          </Button>
          {status === "saved" && (
            <StatusPill tone="green">Profile updated</StatusPill>
          )}
        </div>
      </form>
    </SectionCard>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  function handleSubmit(e) {
    e.preventDefault();
    if (!current || !next) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setCurrent("");
      setNext("");
      setTimeout(() => setStatus("idle"), 1800);
    }, 900);
  }

  return (
    <SectionCard
      title="Change Password"
      description="Use a strong, unique password. You will remain signed in on this device."
    >
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4">
        <Field label="Current Password">
          <input
            type="password"
            className={inputBase}
            placeholder="••••••••"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Field>
        <Field label="New Password" hint="Minimum 12 characters, one symbol, one number">
          <input
            type="password"
            className={inputBase}
            placeholder="••••••••"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </Field>

        <div className="mt-2 flex items-center gap-3">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Updating..." : "Update Password"}
          </Button>
          {status === "saved" && <StatusPill tone="green">Password changed</StatusPill>}
          {status === "error" && <StatusPill tone="gray">Both fields are required</StatusPill>}
        </div>
      </form>
    </SectionCard>
  );
}


function SessionsSection() {
  const sessions = SESSIONS;

  return (
    <SectionCard
      title="Active Sessions"
      description="Devices and locations currently signed in to your account."
    >
      <div className="overflow-hidden rounded-md border border-white/5">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-medium">Device</th>
              <th className="px-4 py-2.5 font-medium">Location</th>
              <th className="px-4 py-2.5 font-medium">IP Address</th>
              <th className="px-4 py-2.5 font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((sess) => (
              <tr
                key={sess.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.015]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">{sess.device}</span>
                    {sess.current && <StatusPill tone="cyan">This device</StatusPill>}
                  </div>
                  <div className="text-xs text-slate-500">{sess.detail}</div>
                </td>
                <td className="px-4 py-3 text-slate-400">{sess.location}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{sess.ip}</td>
                <td className="px-4 py-3 text-slate-400">
                  {sess.current ? (
                    <StatusPill tone="green">{sess.lastActive}</StatusPill>
                  ) : (
                    sess.lastActive
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}


export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
         <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-slate-500">
            Account
            </p>
            <ThemeToggle/>
         </div>
          <h1 className="mt-1 text-xl font-semibold text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your profile, security, and workspace preferences.
          </p>
        </div>

        <div className="mb-6 flex gap-1 border-b border-white/5">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition ${
                  active ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "password" && <PasswordSection />}
          {activeTab === "sessions" && <SessionsSection />}
        </div>
      </div>
    </div>
  );
}