"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  X,
  Send,
  Bot,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Loader2,
} from "lucide-react";
import { siteConfig, whatsappLink, mapLink } from "@/config/site";
import { conditions, faqs } from "@/data/content";

type Option = { label: string; action: string };
type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  options?: Option[];
  node?: "map" | "whatsapp-confirm";
  waMessage?: string;
  refId?: string;
};

type Step =
  | "idle"
  | "name"
  | "phone"
  | "condition"
  | "date"
  | "time"
  | "mode"
  | "confirm"
  | "submitting";

const timeSlots = ["Morning (9 AM - 12 PM)", "Afternoon (12 - 4 PM)", "Evening (4 - 8 PM)"];
const modes = ["In-person visit", "Home visit", "Video consultation"];

const mainMenu: Option[] = [
  { label: "📅 Book a consultation", action: "book" },
  { label: "📍 Get directions", action: "directions" },
  { label: "🕐 Timings & fees", action: "timings" },
  { label: "🩺 Conditions treated", action: "conditions" },
  { label: "🏠 Home visit", action: "homevisit" },
  { label: "💬 Chat on WhatsApp", action: "whatsapp" },
];

let idCounter = 0;
const uid = () => `m${Date.now()}_${idCounter++}`;

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    condition: "",
    preferredDate: "",
    preferredTime: "",
    mode: "In-person visit",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      pushBot(
        `Hi! I'm the ${siteConfig.shortName} assistant 🤖. I can book your consultation or answer your questions. How can I help?`,
        mainMenu
      );
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pushUser(text: string) {
    setMessages((m) => [...m, { id: uid(), role: "user", text }]);
  }

  function pushBot(text: string, options?: Option[], extra?: Partial<Message>) {
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: uid(), role: "bot", text, options, ...extra }]);
      setTyping(false);
    }, 450);
  }

  function resetBooking() {
    setBooking({
      name: "",
      phone: "",
      condition: "",
      preferredDate: "",
      preferredTime: "",
      mode: "In-person visit",
    });
  }

  // ---- Intent detection for free text ----
  function detectIntent(text: string): string | null {
    const t = text.toLowerCase();
    if (/(book|appoint|consult|slot|visit doctor|see doctor)/.test(t)) return "book";
    if (/(where|location|address|direction|reach|map|how to get|come to)/.test(t)) return "directions";
    if (/(time|timing|hour|open|close|fee|cost|price|charge|payment)/.test(t)) return "timings";
    if (/(home visit|come home|at home|house)/.test(t)) return "homevisit";
    if (/(condition|treat|disease|diabet|thyroid|bp|pressure|pcos|weight|obesit|liver|sugar|hormon)/.test(t))
      return "conditions";
    if (/(whatsapp|wa\b)/.test(t)) return "whatsapp";
    if (/(hi|hello|hey|namaste|start|menu|help)/.test(t)) return "menu";
    return null;
  }

  function matchFaq(text: string): string | null {
    const t = text.toLowerCase();
    for (const f of faqs) {
      const words = f.question.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
      const hits = words.filter((w) => t.includes(w)).length;
      if (hits >= 2) return f.answer;
    }
    return null;
  }

  // ---- Booking submission ----
  async function submitBooking(finalMode?: string) {
    setStep("submitting");
    const payload = { ...booking, mode: finalMode ?? booking.mode };
    pushBot("Booking your consultation… ⏳");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      const confirmLine = data.patientNotified
        ? `📲 A confirmation has just been sent to ${payload.phone} on WhatsApp. Our team will also call you to finalize the time.`
        : `Our team will call ${payload.phone} shortly to confirm.`;
      pushBot(
        `✅ All done, ${payload.name.split(" ")[0]}! Your consultation is requested.\n\nReference ID: ${data.id}\n${payload.preferredDate} · ${payload.preferredTime} · ${payload.mode}\n\n${confirmLine}`,
        [
          { label: "📍 Get directions", action: "directions" },
          { label: "🏠 Back to menu", action: "menu" },
        ]
      );
      setStep("idle");
      resetBooking();
    } catch (err) {
      pushBot(
        `Sorry, I couldn't save that (${
          err instanceof Error ? err.message : "error"
        }). You can try again or book on WhatsApp.`,
        [
          { label: "🔁 Try again", action: "book" },
          { label: "💬 WhatsApp", action: "whatsapp" },
        ]
      );
      setStep("idle");
    }
  }

  // ---- Handle a chosen option / typed intent ----
  function handleAction(action: string, label?: string) {
    if (label) pushUser(label);

    // Booking sub-actions
    if (action.startsWith("cond:")) {
      const c = action.slice(5);
      setBooking((b) => ({ ...b, condition: c }));
      setStep("date");
      pushBot("When would you like to come in?", [
        { label: "As soon as possible", action: "date:As soon as possible" },
        { label: "Tomorrow", action: "date:Tomorrow" },
        { label: "This weekend", action: "date:This weekend" },
      ]);
      return;
    }
    if (action.startsWith("date:")) {
      const d = action.slice(5);
      setBooking((b) => ({ ...b, preferredDate: d }));
      setStep("time");
      pushBot("What time suits you best?", timeSlots.map((t) => ({ label: t, action: `time:${t}` })));
      return;
    }
    if (action.startsWith("time:")) {
      const t = action.slice(5);
      setBooking((b) => ({ ...b, preferredTime: t }));
      setStep("mode");
      pushBot("How would you like to consult?", modes.map((m) => ({ label: m, action: `mode:${m}` })));
      return;
    }
    if (action.startsWith("mode:")) {
      const m = action.slice(5);
      setBooking((b) => ({ ...b, mode: m }));
      setStep("confirm");
      const b = { ...booking, mode: m };
      pushBot(
        `Please confirm your booking:\n\n👤 ${b.name}\n📞 ${b.phone}\n🩺 ${b.condition}\n📅 ${b.preferredDate} · ${b.preferredTime}\n💠 ${m}`,
        [
          { label: "✅ Confirm booking", action: "confirm" },
          { label: "✖ Cancel", action: "menu" },
        ]
      );
      return;
    }

    switch (action) {
      case "book":
        resetBooking();
        setStep("name");
        pushBot("Great! Let's book your consultation. 📅\n\nWhat's your full name?");
        break;
      case "confirm":
        submitBooking();
        break;
      case "directions":
        pushBot(
          `We're at ${siteConfig.address}. Tap below for turn-by-turn directions.`,
          [
            { label: "📅 Book a consultation", action: "book" },
            { label: "🏠 Back to menu", action: "menu" },
          ],
          { node: "map" }
        );
        break;
      case "timings":
        pushBot(
          `🕐 Timings: ${siteConfig.hours}.\n\nWalk-ins are welcome for your first visit, which is unhurried (30-45 minutes). For current consultation fees, please ask us on WhatsApp — we'll help right away.`,
          [
            { label: "💬 Ask fees on WhatsApp", action: "whatsapp" },
            { label: "📅 Book a consultation", action: "book" },
            { label: "🏠 Back to menu", action: "menu" },
          ]
        );
        break;
      case "conditions":
        pushBot(
          `Dr. Neelu specialises in:\n\n${conditions
            .map((c) => `• ${c.name}`)
            .join("\n")}\n\nWould you like to book a consultation?`,
          [
            { label: "📅 Book now", action: "book" },
            { label: "🏠 Back to menu", action: "menu" },
          ]
        );
        break;
      case "homevisit":
        pushBot(
          "🏠 Yes, home visits are available for senior patients and those who can't travel easily. Shall I book a home visit for you?",
          [
            { label: "📅 Book a home visit", action: "book-home" },
            { label: "🏠 Back to menu", action: "menu" },
          ]
        );
        break;
      case "book-home":
        resetBooking();
        setBooking((b) => ({ ...b, mode: "Home visit" }));
        setStep("name");
        pushBot("Of course. What's the patient's full name?");
        break;
      case "whatsapp":
        pushBot("Opening WhatsApp so you can chat with our team in real time… 💬", [
          { label: "🏠 Back to menu", action: "menu" },
        ]);
        if (typeof window !== "undefined") window.open(whatsappLink(), "_blank");
        break;
      case "menu":
      default:
        setStep("idle");
        pushBot("What would you like to do?", mainMenu);
        break;
    }
  }

  // ---- Handle typed input ----
  function sendText(raw: string) {
    const text = raw.trim();
    if (!text) return;
    pushUser(text);
    setInput("");

    // Steps that expect free text
    if (step === "name") {
      if (text.length < 2) {
        pushBot("Please enter a valid name so we can address you correctly. 🙂");
        return;
      }
      setBooking((b) => ({ ...b, name: text }));
      setStep("phone");
      pushBot(`Thanks, ${text.split(" ")[0]}! What's your 10-digit mobile number? 📞`);
      return;
    }
    if (step === "phone") {
      if (text.replace(/\D/g, "").length < 10) {
        pushBot("That doesn't look like a valid number. Please enter a 10-digit mobile number.");
        return;
      }
      setBooking((b) => ({ ...b, phone: text }));
      setStep("condition");
      pushBot(
        "What's your main health concern?",
        [
          ...conditions.map((c) => ({ label: c.name, action: `cond:${c.name}` })),
          { label: "Other / General", action: "cond:General Consultation" },
        ]
      );
      return;
    }
    if (step === "date") {
      setBooking((b) => ({ ...b, preferredDate: text }));
      setStep("time");
      pushBot("What time suits you best?", timeSlots.map((t) => ({ label: t, action: `time:${t}` })));
      return;
    }

    // Option-driven steps: nudge to tap a button
    if (["condition", "time", "mode", "confirm"].includes(step)) {
      pushBot("Please tap one of the options above to continue. 👆");
      return;
    }

    // Idle: detect intent, else FAQ, else fallback
    const intent = detectIntent(text);
    if (intent) {
      handleAction(intent);
      return;
    }
    const faq = matchFaq(text);
    if (faq) {
      pushBot(faq, [
        { label: "📅 Book a consultation", action: "book" },
        { label: "🏠 Back to menu", action: "menu" },
      ]);
      return;
    }
    pushBot(
      "I'm not sure I understood that. I can help you book a consultation, share directions, timings, or connect you on WhatsApp.",
      mainMenu
    );
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-500 to-secondary-600 px-4 py-3 font-semibold text-white shadow-card ring-1 ring-white/30 transition hover:scale-105 sm:bottom-5 sm:right-5"
        >
          <MessageSquareText className="h-6 w-6" />
          <span className="hidden text-sm sm:inline">Chat with us</span>
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-500" />
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex h-[72vh] flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 sm:bottom-5 sm:left-auto sm:right-5 sm:h-[560px] sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-700 to-secondary-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Bot className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold">{siteConfig.shortName} Assistant</div>
                <div className="flex items-center gap-1 text-[11px] text-brand-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Online · replies instantly
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-brand-50/40 px-3 py-4"
          >
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className="max-w-[85%]">
                  <div
                    className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "rounded-br-sm bg-brand-600 text-white"
                        : "rounded-bl-sm bg-white text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.node === "map" && (
                    <a
                      href={mapLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-secondary-700"
                    >
                      <MapPin className="h-4 w-4" />
                      Open in Google Maps
                    </a>
                  )}

                  {m.node === "whatsapp-confirm" && m.waMessage && (
                    <a
                      href={whatsappLink(m.waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-whatsapp px-3 py-2 text-xs font-semibold text-white transition hover:brightness-105"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Confirm on WhatsApp
                    </a>
                  )}

                  {m.options && m.options.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.options.map((opt) => (
                        <button
                          key={opt.action + opt.label}
                          onClick={() => handleAction(opt.action, opt.label)}
                          className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-600 hover:text-white"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step !== "submitting") sendText(input);
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                step === "submitting" ? "Please wait…" : "Type your message…"
              }
              disabled={step === "submitting"}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={step === "submitting" || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {step === "submitting" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
