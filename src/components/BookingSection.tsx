"use client";

import { useState } from "react";
import {
  CalendarCheck,
  UserPlus,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { siteConfig, whatsappLink, telLink } from "@/config/site";
import { conditions } from "@/data/content";

type Tab = "book" | "register";
type Status = "idle" | "loading" | "success" | "error";

const timeSlots = ["Morning (9 AM - 12 PM)", "Afternoon (12 - 4 PM)", "Evening (4 - 8 PM)"];
const modes = ["In-person visit", "Home visit", "Video consultation"];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export function BookingSection() {
  const [tab, setTab] = useState<Tab>("book");

  return (
    <section id="book" className="px-4 py-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-secondary-900 shadow-card">
        <div className="grid lg:grid-cols-2">
          {/* Left info panel */}
          <div className="p-8 text-white sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Book Your Consultation
            </h2>
            <p className="mt-3 text-brand-100">
              Your first visit starts here. Walk in when you&apos;re ready — or
              reserve a time below. Prefer instant help? We&apos;re on WhatsApp.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-whatsapp text-white">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">Chat on WhatsApp</span>
                  <span className="block text-xs text-brand-100">
                    {siteConfig.phone} · real-time replies
                  </span>
                </span>
              </a>
              <a
                href={telLink()}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500 text-white">
                  <PhoneCall className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{siteConfig.phone}</span>
                  <span className="block text-xs text-brand-100">{siteConfig.hours}</span>
                </span>
              </a>
            </div>

            <div className="mt-8 rounded-xl bg-white/5 p-4 text-sm text-brand-100 ring-1 ring-white/10">
              <CheckCircle2 className="mb-1 inline h-4 w-4 text-accent-400" />{" "}
              No appointment needed for your first visit. Home visits available
              for seniors.
            </div>
          </div>

          {/* Right form panel */}
          <div className="bg-white p-6 sm:p-8">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setTab("book")}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === "book"
                    ? "bg-white text-brand-700 shadow"
                    : "text-slate-500"
                }`}
              >
                <CalendarCheck className="h-4 w-4" />
                Book Consultation
              </button>
              <button
                onClick={() => setTab("register")}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === "register"
                    ? "bg-white text-brand-700 shadow"
                    : "text-slate-500"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                New Patient
              </button>
            </div>

            {tab === "book" ? <BookingForm /> : <RegistrationForm />}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessCard({
  id,
  waMessage,
  onReset,
  title,
}: {
  id: string;
  waMessage: string;
  onReset: () => void;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <CheckCircle2 className="h-14 w-14 text-brand-600" />
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">
        Reference ID: <span className="font-semibold text-brand-700">{id}</span>
      </p>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        Our team will contact you shortly. For a faster confirmation, send us the
        details on WhatsApp.
      </p>
      <a
        href={whatsappLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
      >
        <MessageCircle className="h-4 w-4" />
        Confirm on WhatsApp
      </a>
      <button
        onClick={onReset}
        className="mt-3 text-xs font-medium text-slate-400 underline"
      >
        Submit another request
      </button>
    </div>
  );
}

function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    condition: conditions[0].name,
    preferredDate: "",
    preferredTime: timeSlots[0],
    mode: modes[0],
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState("");

  const waMessage = () =>
    `New consultation request for ${siteConfig.name}:\n` +
    `Name: ${form.name}\n` +
    `Phone: ${form.phone}\n` +
    `Concern: ${form.condition}\n` +
    `Preferred: ${form.preferredDate || "Any day"} - ${form.preferredTime}\n` +
    `Mode: ${form.mode}\n` +
    `Notes: ${form.message || "-"}\n` +
    (resultId ? `Ref: ${resultId}` : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter your name and a valid 10-digit phone number.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setResultId(data.id);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <SuccessCard
        id={resultId}
        title="Consultation Requested!"
        waMessage={waMessage()}
        onReset={() => {
          setStatus("idle");
          setForm({ ...form, message: "" });
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className={labelClass}>Mobile Number</label>
          <input
            type="tel"
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="10-digit mobile"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Health Concern</label>
        <select
          className={inputClass}
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
        >
          {conditions.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
          <option>Other / General Consultation</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Preferred Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.preferredDate}
            onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Preferred Time</label>
          <select
            className={inputClass}
            value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
          >
            {timeSlots.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Consultation Mode</label>
        <select
          className={inputClass}
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
        >
          {modes.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Briefly describe your concern"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CalendarCheck className="h-4 w-4" />
        )}
        {status === "loading" ? "Booking..." : "Request Consultation"}
      </button>
      <p className="text-center text-xs text-slate-400">
        By submitting, you agree to be contacted by {siteConfig.name}.
      </p>
    </form>
  );
}

function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Male",
    city: "",
    concern: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState("");

  const waMessage = () =>
    `New patient registration for ${siteConfig.name}:\n` +
    `Name: ${form.name}\n` +
    `Phone: ${form.phone}\n` +
    `Age/Gender: ${form.age || "-"} / ${form.gender}\n` +
    `City: ${form.city || "-"}\n` +
    `Concern: ${form.concern || "-"}\n` +
    (resultId ? `Ref: ${resultId}` : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter your name and a valid 10-digit phone number.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setResultId(data.id);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <SuccessCard
        id={resultId}
        title="Registration Successful!"
        waMessage={waMessage()}
        onReset={() => {
          setStatus("idle");
          setForm({ ...form, concern: "" });
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Patient name"
          />
        </div>
        <div>
          <label className={labelClass}>Mobile Number</label>
          <input
            type="tel"
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="10-digit mobile"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            min={0}
            max={120}
            className={inputClass}
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="Age"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Gender</label>
          <select
            className={inputClass}
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>City / Town</label>
        <input
          className={inputClass}
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="e.g. Tanuku"
        />
      </div>
      <div>
        <label className={labelClass}>Main Health Concern</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          value={form.concern}
          onChange={(e) => setForm({ ...form, concern: e.target.value })}
          placeholder="Tell us briefly what brings you in"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "loading" ? "Registering..." : "Register as New Patient"}
      </button>
    </form>
  );
}
