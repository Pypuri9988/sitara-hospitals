/**
 * In-WhatsApp conversational bot for Sitara360 Care.
 *
 * Mirrors the website assistant: shows a tappable menu ("See all options"),
 * books consultations, registers new patients, and answers common questions —
 * all inside WhatsApp, replying to whatever number messages the business.
 *
 * State is kept in memory (per phone number). This is fine for a single
 * long-running server (VPS / node process). On serverless/multi-instance
 * hosting, move `sessions` to a shared store (Redis, DB) so state survives.
 */

import { sendText, sendList, sendButtons } from "@/lib/whatsapp";
import { appendToCollection, generateId } from "@/lib/storage";
import { notifyDoctorWhatsApp } from "@/lib/notify";
import { siteConfig, mapLink } from "@/config/site";
import { conditions } from "@/data/content";

type Flow = "book" | "register" | null;
type Session = {
  flow: Flow;
  step: string;
  data: Record<string, string>;
  updatedAt: number;
};

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const sessions = new Map<string, Session>();

function getSession(from: string): Session {
  const existing = sessions.get(from);
  if (existing && Date.now() - existing.updatedAt < SESSION_TTL_MS) return existing;
  const fresh: Session = { flow: null, step: "idle", data: {}, updatedAt: Date.now() };
  sessions.set(from, fresh);
  return fresh;
}

function save(from: string, s: Session) {
  s.updatedAt = Date.now();
  sessions.set(from, s);
}

function clear(from: string) {
  sessions.delete(from);
}

const dayButtons = [
  { id: "day:As soon as possible", title: "ASAP" },
  { id: "day:Tomorrow", title: "Tomorrow" },
  { id: "day:This weekend", title: "This weekend" },
];

const timeButtons = [
  { id: "time:Morning (9 AM - 12 PM)", title: "Morning" },
  { id: "time:Afternoon (12 - 4 PM)", title: "Afternoon" },
  { id: "time:Evening (4 - 8 PM)", title: "Evening" },
];

const modeButtons = [
  { id: "mode:In-person visit", title: "In-person" },
  { id: "mode:Home visit", title: "Home visit" },
  { id: "mode:Video consultation", title: "Video" },
];

const genderButtons = [
  { id: "gender:Male", title: "Male" },
  { id: "gender:Female", title: "Female" },
  { id: "gender:Other", title: "Other" },
];

async function sendMainMenu(to: string) {
  await sendList(
    to,
    `Welcome to ${siteConfig.hospitalName}! 👋\n\nHow can I help you today?\nTap below to see all options.`,
    "See all options",
    [
      { id: "menu:book", title: "📅 Book Appointment", description: "Schedule a doctor consultation" },
      { id: "menu:register", title: "📝 New Patient Reg.", description: "Register as a new patient" },
      { id: "menu:conditions", title: "🩺 Conditions Treated", description: "What Dr. Neelu specialises in" },
      { id: "menu:timings", title: "🕐 Timings & Location", description: "Hours and how to reach us" },
      { id: "menu:homevisit", title: "🏠 Home Visit", description: "Care at home for seniors" },
      { id: "menu:talk", title: "💬 Talk to our team", description: "Leave a message for us" },
    ],
    `${siteConfig.shortName} Assistant`
  );
}

function isGreeting(text: string) {
  return /\b(hi|hello|hey|namaste|start|menu|home|options|help)\b/i.test(text.trim());
}

type Incoming = { id?: string; text?: string; profileName?: string };

/**
 * Main entry: process one incoming message and reply.
 */
export async function handleIncoming(from: string, msg: Incoming): Promise<void> {
  const raw = (msg.text ?? "").trim();
  const choice = msg.id ?? ""; // id from a tapped list row / button

  // Global commands always work.
  if (choice === "menu:home" || (!choice && isGreeting(raw))) {
    clear(from);
    await sendMainMenu(from);
    return;
  }
  if (choice === "menu:exit") {
    clear(from);
    await sendText(from, "Thank you for contacting us. Take care! 🙏 Send *Hi* anytime to start again.");
    return;
  }

  // Top-level menu selections.
  if (choice.startsWith("menu:")) {
    return handleMenu(from, choice.slice(5));
  }

  const session = getSession(from);

  // Active flows.
  if (session.flow === "book") return handleBooking(from, session, raw, choice);
  if (session.flow === "register") return handleRegister(from, session, raw, choice);

  // Not in a flow and not a recognised command → show the menu.
  await sendMainMenu(from);
}

async function handleMenu(from: string, action: string) {
  switch (action) {
    case "book": {
      const s: Session = { flow: "book", step: "name", data: { phone: from }, updatedAt: Date.now() };
      save(from, s);
      await sendText(from, "Great! Let's book your consultation. 📅\n\nWhat's your *full name*?");
      return;
    }
    case "register": {
      const s: Session = { flow: "register", step: "name", data: { phone: from }, updatedAt: Date.now() };
      save(from, s);
      await sendText(from, "Let's register you as a new patient. 📝\n\nWhat's the *patient's full name*?");
      return;
    }
    case "conditions": {
      const list = conditions.map((c) => `• ${c.name}`).join("\n");
      await sendText(from, `Dr. Neelu specialises in:\n\n${list}\n\nSend *Hi* to go back to the menu, or tap Book Appointment.`);
      await sendButtons(from, "Would you like to book a consultation?", [
        { id: "menu:book", title: "📅 Book now" },
        { id: "menu:home", title: "🏠 Menu" },
      ]);
      return;
    }
    case "timings": {
      await sendText(
        from,
        `🕐 *Timings:* ${siteConfig.hours}\n\n📍 *Location:* ${siteConfig.address}\n\nDirections: ${mapLink()}\n\nWalk-ins are welcome for your first visit.`
      );
      await sendButtons(from, "Anything else?", [
        { id: "menu:book", title: "📅 Book" },
        { id: "menu:home", title: "🏠 Menu" },
      ]);
      return;
    }
    case "homevisit": {
      await sendButtons(
        from,
        "🏠 Yes, home visits are available for senior patients and those who can't travel easily. Shall I book a home visit?",
        [
          { id: "menu:book", title: "📅 Book home visit" },
          { id: "menu:home", title: "🏠 Menu" },
        ]
      );
      return;
    }
    case "talk": {
      const s: Session = { flow: "book", step: "talk-name", data: { phone: from }, updatedAt: Date.now() };
      save(from, s);
      await sendText(from, `You can also call us directly at ${siteConfig.phone}. 📞\n\nTo have our team call you back, what's your *name*?`);
      return;
    }
    default:
      await sendMainMenu(from);
  }
}

async function handleBooking(from: string, s: Session, raw: string, choice: string) {
  switch (s.step) {
    case "name":
      if (raw.length < 2) {
        await sendText(from, "Please enter a valid name so we can address you correctly. 🙂");
        return;
      }
      s.data.name = raw;
      s.step = "condition";
      save(from, s);
      await sendList(
        from,
        `Thanks, ${raw.split(" ")[0]}! What's your main *health concern*?`,
        "Choose concern",
        [
          ...conditions.map((c, i) => ({ id: `cond:${i}`, title: c.name })),
          { id: "cond:other", title: "Other / General" },
        ]
      );
      return;

    case "talk-name":
      if (raw.length < 2) {
        await sendText(from, "Please enter a valid name. 🙂");
        return;
      }
      s.data.name = raw;
      s.data.condition = "Call Back Request";
      s.data.preferredDate = "";
      s.data.preferredTime = "Any time";
      s.data.mode = "Phone call";
      s.data.message = "Requested a call back via WhatsApp.";
      save(from, s);
      await finalizeBooking(from, s);
      return;

    case "condition": {
      let concern = "General Consultation";
      if (choice === "cond:other") concern = "General Consultation";
      else if (choice.startsWith("cond:")) {
        const idx = Number(choice.slice(5));
        concern = conditions[idx]?.name ?? "General Consultation";
      } else if (raw) {
        concern = raw;
      } else {
        await sendText(from, "Please tap one of the options above. 👆");
        return;
      }
      s.data.condition = concern;
      s.step = "day";
      save(from, s);
      await sendButtons(from, "When would you like to come in?", dayButtons);
      return;
    }

    case "day": {
      const day = choice.startsWith("day:") ? choice.slice(4) : raw;
      if (!day) {
        await sendText(from, "Please tap one of the options above. 👆");
        return;
      }
      s.data.preferredDate = day;
      s.step = "time";
      save(from, s);
      await sendButtons(from, "What time suits you best?", timeButtons);
      return;
    }

    case "time": {
      if (!choice.startsWith("time:")) {
        await sendText(from, "Please tap one of the time options above. 👆");
        return;
      }
      s.data.preferredTime = choice.slice(5);
      s.step = "mode";
      save(from, s);
      await sendButtons(from, "How would you like to consult?", modeButtons);
      return;
    }

    case "mode": {
      if (!choice.startsWith("mode:")) {
        await sendText(from, "Please tap one of the options above. 👆");
        return;
      }
      s.data.mode = choice.slice(5);
      s.step = "confirm";
      save(from, s);
      await sendButtons(
        from,
        `Please confirm your booking:\n\n👤 ${s.data.name}\n📞 ${s.data.phone}\n🩺 ${s.data.condition}\n📅 ${s.data.preferredDate} · ${s.data.preferredTime}\n💠 ${s.data.mode}`,
        [
          { id: "confirm:yes", title: "✅ Confirm" },
          { id: "confirm:no", title: "✖ Cancel" },
        ]
      );
      return;
    }

    case "confirm": {
      if (choice === "confirm:no") {
        clear(from);
        await sendText(from, "No problem, booking cancelled. Send *Hi* anytime to start again.");
        return;
      }
      if (choice !== "confirm:yes") {
        await sendText(from, "Please tap *Confirm* or *Cancel* above. 👆");
        return;
      }
      await finalizeBooking(from, s);
      return;
    }

    default:
      clear(from);
      await sendMainMenu(from);
  }
}

async function finalizeBooking(from: string, s: Session) {
  const appointment = {
    id: generateId("APPT"),
    name: s.data.name || "WhatsApp User",
    phone: s.data.phone || from,
    condition: s.data.condition || "General Consultation",
    preferredDate: s.data.preferredDate || "",
    preferredTime: s.data.preferredTime || "",
    mode: s.data.mode || "In-person",
    message: s.data.message || "Booked via WhatsApp bot.",
    createdAt: new Date().toISOString(),
  };
  await appendToCollection("appointments", appointment);

  const notifyText =
    `🩺 New Booking (WhatsApp bot) — ${siteConfig.name}\n` +
    `Ref: ${appointment.id}\n` +
    `Name: ${appointment.name}\n` +
    `Phone: ${appointment.phone}\n` +
    `Concern: ${appointment.condition}\n` +
    `Preferred: ${appointment.preferredDate || "Any day"} - ${appointment.preferredTime || "Any time"}\n` +
    `Mode: ${appointment.mode}\n` +
    `Notes: ${appointment.message}`;
  await notifyDoctorWhatsApp(notifyText).catch(() => ({ ok: false }));

  clear(from);
  await sendText(
    from,
    `✅ All done, ${appointment.name.split(" ")[0]}! Your request is received.\n\n*Reference:* ${appointment.id}\n${appointment.preferredDate || "Any day"} · ${appointment.preferredTime || "Any time"} · ${appointment.mode}\n\nOur team will call you shortly to confirm. Send *Hi* anytime for the menu.`
  );
}

async function handleRegister(from: string, s: Session, raw: string, choice: string) {
  switch (s.step) {
    case "name":
      if (raw.length < 2) {
        await sendText(from, "Please enter a valid name. 🙂");
        return;
      }
      s.data.name = raw;
      s.step = "age";
      save(from, s);
      await sendText(from, "What's the patient's *age*?");
      return;

    case "age":
      s.data.age = raw.replace(/\D/g, "").slice(0, 3);
      s.step = "gender";
      save(from, s);
      await sendButtons(from, "Gender?", genderButtons);
      return;

    case "gender":
      s.data.gender = choice.startsWith("gender:") ? choice.slice(7) : raw || "Other";
      s.step = "city";
      save(from, s);
      await sendText(from, "Which *city / town* are you from?");
      return;

    case "city":
      s.data.city = raw;
      s.step = "concern";
      save(from, s);
      await sendText(from, "Briefly, what's the main *health concern*?");
      return;

    case "concern": {
      s.data.concern = raw;
      const registration = {
        id: generateId("REG"),
        name: s.data.name || "WhatsApp User",
        phone: s.data.phone || from,
        age: s.data.age || "",
        gender: s.data.gender || "",
        city: s.data.city || "",
        concern: s.data.concern || "",
        createdAt: new Date().toISOString(),
      };
      await appendToCollection("registrations", registration);
      const notifyText =
        `📝 New Patient Reg. (WhatsApp bot) — ${siteConfig.name}\n` +
        `Ref: ${registration.id}\n` +
        `Name: ${registration.name}\n` +
        `Phone: ${registration.phone}\n` +
        `Age/Gender: ${registration.age || "-"} / ${registration.gender || "-"}\n` +
        `City: ${registration.city || "-"}\n` +
        `Concern: ${registration.concern || "-"}`;
      await notifyDoctorWhatsApp(notifyText).catch(() => ({ ok: false }));
      clear(from);
      await sendText(
        from,
        `✅ Thank you, ${registration.name.split(" ")[0]}! You're registered.\n\n*Reference:* ${registration.id}\nOur team will reach out shortly. Send *Hi* anytime for the menu.`
      );
      return;
    }

    default:
      clear(from);
      await sendMainMenu(from);
  }
}
