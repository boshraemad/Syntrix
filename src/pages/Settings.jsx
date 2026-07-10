import { useState } from "react";
import { useActiveSessions } from "@/features/Auth/hooks/useActiveSessions";

// Lightweight User-Agent parser — no external dependency.
function parseUserAgent(ua = "") {
  let os = "Unknown OS";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Unknown Browser";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/chrome\//i.test(ua)) browser = "Chrome";
  else if (/version\/.*safari/i.test(ua)) browser = "Safari";
  else if (/firefox\//i.test(ua)) browser = "Firefox";

  return { os, browser };
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Change Password" },
  { id: "sessions", label: "Active Sessions" },
];

// ---------------------------------------------------------------------------
// Shared atoms
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Profile section
// ---------------------------------------------------------------------------
function ProfileSection() {
  const [form, setForm] = useState(() => {
    try {
      // قراءة الـ string من الـ localStorage وتحويله لـ Object
      const savedUser = localStorage.getItem("user-data");
      const user = savedUser ? JSON.parse(savedUser) : null;

      // لو الـ user موجود، حولي شكل الداتا فوراً، لو مش موجود حطي القيم الافتراضية
      return user ? {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        role: user.role || ''
      } : {
        name: "Ahmed Bakr",
        email: "ahmed.bakr@sentinel-sec.io",
        role: "Security Analyst II",
      };
    } catch (error) {
      console.error("Error parsing user context:", error);
      return { name: "", email: "", role: "" };
    }
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

// ---------------------------------------------------------------------------
// Password section
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Active sessions section
// ---------------------------------------------------------------------------
function SessionsSection({data}) {
  const sessions = data;

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
              <th className="px-4 py-2.5 font-medium">IP Address</th>
              <th className="px-4 py-2.5 font-medium">Created</th>
              <th className="px-4 py-2.5 font-medium">Expires</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((sess) => {
              const { os, browser } = parseUserAgent(sess.userAgent);
              const isCurrent = sess.id == JSON.parse(localStorage.getItem("user-data")).id;
              console.log(isCurrent)
              return (
                <tr
                  key={sess.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.015]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200">
                        {os} · {browser}
                      </span>
                      {isCurrent && <StatusPill tone="cyan">This device</StatusPill>}
                    </div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-slate-600" title={sess.userAgent}>
                      {sess.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {sess.ipAddress}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatDateTime(sess.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatDateTime(sess.expiresAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------
export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data, isLoading, error } = useActiveSessions();
  console.log(data);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-widest text-slate-500">
            Account
          </p>
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
          {activeTab === "sessions" && <SessionsSection data={data} />}
        </div>
      </div>
    </div>
  );
}