"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Lock,
  LogOut,
  RefreshCw,
  CalendarCheck,
  UserPlus,
  Phone,
  MessageCircle,
  Search,
  Users,
  Clock,
  Home,
} from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/config/site";

type Appointment = {
  id: string;
  name: string;
  phone: string;
  condition: string;
  preferredDate: string;
  preferredTime: string;
  mode: string;
  message: string;
  createdAt: string;
};

type Registration = {
  id: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
  city: string;
  concern: string;
  createdAt: string;
};

const TOKEN_KEY = "sitara_admin_token";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [inputToken, setInputToken] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"appointments" | "registrations">("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (saved) setToken(saved);
  }, []);

  const fetchData = useCallback(
    async (tk: string, silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const [aRes, rRes] = await Promise.all([
          fetch(`/api/appointments?token=${encodeURIComponent(tk)}`),
          fetch(`/api/register?token=${encodeURIComponent(tk)}`),
        ]);
        if (aRes.status === 401 || rRes.status === 401) {
          throw new Error("unauthorized");
        }
        const aData = await aRes.json();
        const rData = await rRes.json();
        setAppointments(
          (aData.items ?? []).sort(
            (x: Appointment, y: Appointment) => +new Date(y.createdAt) - +new Date(x.createdAt)
          )
        );
        setRegistrations(
          (rData.items ?? []).sort(
            (x: Registration, y: Registration) => +new Date(y.createdAt) - +new Date(x.createdAt)
          )
        );
        setLastUpdated(new Date());
      } catch (err) {
        if (err instanceof Error && err.message === "unauthorized") {
          setError("Invalid access token.");
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        } else {
          setError("Could not load data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (token) fetchData(token);
  }, [token, fetchData]);

  useEffect(() => {
    if (!token || !autoRefresh) return;
    const interval = setInterval(() => fetchData(token, true), 15000);
    return () => clearInterval(interval);
  }, [token, autoRefresh, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) {
      setLoginError("Please enter your access token.");
      return;
    }
    localStorage.setItem(TOKEN_KEY, inputToken.trim());
    setToken(inputToken.trim());
    setInputToken("");
    setLoginError("");
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAppointments([]);
    setRegistrations([]);
  };

  // ---- Login screen ----
  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-mesh px-4 py-16">
        <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-secondary-600 text-white shadow-soft">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-center text-xl font-extrabold text-slate-900">
            Doctor Dashboard
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Enter your access token to view bookings
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-3">
            <input
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Access token"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Sign In
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-400">
            Token is configured in your <code>.env.local</code> as ADMIN_TOKEN.
          </p>
        </div>
      </div>
    );
  }

  // ---- Dashboard ----
  const filteredAppointments = appointments.filter((a) =>
    `${a.name} ${a.phone} ${a.condition} ${a.id}`.toLowerCase().includes(query.toLowerCase())
  );
  const filteredRegistrations = registrations.filter((r) =>
    `${r.name} ${r.phone} ${r.city} ${r.id}`.toLowerCase().includes(query.toLowerCase())
  );

  const todayCount = appointments.filter(
    (a) => new Date(a.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const homeVisits = appointments.filter((a) => a.mode === "Home visit").length;

  return (
    <div className="min-h-[80vh] bg-mesh px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Consultations Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              {siteConfig.name} · {siteConfig.hospitalName}
              {lastUpdated && (
                <span className="ml-2 text-xs text-slate-400">
                  Updated {lastUpdated.toLocaleTimeString("en-IN")}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-brand-600"
              />
              Auto-refresh
            </label>
            <button
              onClick={() => token && fetchData(token)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={CalendarCheck} label="Total Consultations" value={appointments.length} />
          <StatCard icon={Clock} label="Booked Today" value={todayCount} />
          <StatCard icon={Home} label="Home Visits" value={homeVisits} />
          <StatCard icon={Users} label="Registrations" value={registrations.length} />
        </div>

        {/* Tabs + search */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setTab("appointments")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === "appointments" ? "bg-white text-brand-700 shadow" : "text-slate-500"
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              Consultations ({appointments.length})
            </button>
            <button
              onClick={() => setTab("registrations")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === "registrations" ? "bg-white text-brand-700 shadow" : "text-slate-500"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Registrations ({registrations.length})
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, ID…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-72"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {/* Content */}
        <div className="mt-4">
          {tab === "appointments" ? (
            <AppointmentsTable items={filteredAppointments} loading={loading} />
          ) : (
            <RegistrationsTable items={filteredRegistrations} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-2xl font-extrabold text-slate-900">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function ContactButtons({ name, phone }: { name: string; phone: string }) {
  return (
    <div className="flex gap-1.5">
      <a
        href={telLink(phone)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition hover:bg-brand-600 hover:text-white"
        aria-label={`Call ${name}`}
      >
        <Phone className="h-4 w-4" />
      </a>
      <a
        href={whatsappLink(`Hello ${name}, this is ${siteConfig.name} regarding your consultation.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-whatsapp transition hover:bg-whatsapp hover:text-white"
        aria-label={`WhatsApp ${name}`}
      >
        <MessageCircle className="h-4 w-4" />
      </a>
    </div>
  );
}

function EmptyOrLoading({ loading, label }: { loading: boolean; label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 py-14 text-center text-sm text-slate-400">
      {loading ? "Loading…" : `No ${label} yet.`}
    </div>
  );
}

function AppointmentsTable({ items, loading }: { items: Appointment[]; loading: boolean }) {
  if (items.length === 0) return <EmptyOrLoading loading={loading} label="consultations" />;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Concern</th>
              <th className="px-4 py-3">Preferred</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Booked</th>
              <th className="px-4 py-3">Ref / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((a) => (
              <tr key={a.id} className="transition hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.phone}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {a.condition}
                  {a.message && (
                    <div className="mt-0.5 text-xs italic text-slate-400">“{a.message}”</div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {a.preferredDate}
                  <div className="text-xs text-slate-400">{a.preferredTime}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700">
                    {a.mode}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="mb-1 text-xs font-mono text-slate-400">{a.id}</div>
                  <ContactButtons name={a.name} phone={a.phone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {items.map((a) => (
          <div key={a.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-800">{a.name}</div>
                <div className="text-xs text-slate-500">{a.phone}</div>
              </div>
              <ContactButtons name={a.name} phone={a.phone} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div><span className="text-slate-400">Concern:</span> {a.condition}</div>
              <div><span className="text-slate-400">Mode:</span> {a.mode}</div>
              <div><span className="text-slate-400">Preferred:</span> {a.preferredDate}, {a.preferredTime}</div>
              <div><span className="text-slate-400">Booked:</span> {formatDate(a.createdAt)}</div>
            </div>
            <div className="mt-1 font-mono text-[10px] text-slate-400">{a.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationsTable({ items, loading }: { items: Registration[]; loading: boolean }) {
  if (items.length === 0) return <EmptyOrLoading loading={loading} label="registrations" />;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Age / Gender</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Concern</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((r) => (
              <tr key={r.id} className="transition hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.phone}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {r.age || "-"} / {r.gender}
                </td>
                <td className="px-4 py-3 text-slate-600">{r.city || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{r.concern || "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <ContactButtons name={r.name} phone={r.phone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {items.map((r) => (
          <div key={r.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-800">{r.name}</div>
                <div className="text-xs text-slate-500">{r.phone}</div>
              </div>
              <ContactButtons name={r.name} phone={r.phone} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div><span className="text-slate-400">Age/Gender:</span> {r.age || "-"} / {r.gender}</div>
              <div><span className="text-slate-400">City:</span> {r.city || "-"}</div>
              <div className="col-span-2"><span className="text-slate-400">Concern:</span> {r.concern || "-"}</div>
              <div className="col-span-2"><span className="text-slate-400">Registered:</span> {formatDate(r.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
