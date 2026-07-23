"use client";

import { useState } from "react";
import { PhoneCall, X, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";

type Status = "idle" | "loading" | "success" | "error";

const timeSlots = [
  "As soon as possible",
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 - 4 PM)",
  "Evening (4 - 8 PM)",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export function CallBackWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", preferredTime: timeSlots[0] });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState("");

  const waMessage = () =>
    `Call back request for ${siteConfig.name}:\n` +
    `Name: ${form.name}\n` +
    `Phone: ${form.phone}\n` +
    `Best time to call: ${form.preferredTime}\n` +
    (resultId ? `Ref: ${resultId}` : "");

  const reset = () => {
    setForm({ name: "", phone: "", preferredTime: timeSlots[0] });
    setStatus("idle");
    setError("");
    setResultId("");
  };

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
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          condition: "Call Back Request",
          preferredDate: "",
          preferredTime: form.preferredTime,
          mode: "Phone call",
          message: "Requested a call back via the website widget.",
        }),
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

  return (
    <>
      {/* Side tab launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Request a call back"
        className="fixed left-0 top-1/2 z-40 flex -translate-y-1/2 origin-left -rotate-90 items-center gap-2 rounded-b-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-600"
      >
        <PhoneCall className="h-4 w-4" />
        Request a Call Back
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Request a call back"
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-700 to-secondary-800 px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-bold">Request a Call Back</div>
                  <div className="text-[11px] text-brand-100">We&apos;ll call you shortly</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <CheckCircle2 className="h-14 w-14 text-brand-600" />
                  <h3 className="mt-4 text-lg font-bold text-slate-900">Request Received!</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Reference ID:{" "}
                    <span className="font-semibold text-brand-700">{resultId}</span>
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Our team will call {form.phone} shortly. For faster help, message us on
                    WhatsApp.
                  </p>
                  <a
                    href={whatsappLink(waMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Confirm on WhatsApp
                  </a>
                  <button
                    onClick={reset}
                    className="mt-3 text-xs font-medium text-slate-400 underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Share your number and our team will reach out to you.
                  </p>
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
                  <div>
                    <label className={labelClass}>Best Time to Call</label>
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

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PhoneCall className="h-4 w-4" />
                    )}
                    {status === "loading" ? "Sending..." : "Request Call Back"}
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    By submitting, you agree to be contacted by {siteConfig.name}.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
