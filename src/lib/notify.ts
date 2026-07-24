/**
 * Server-side WhatsApp notifier for the doctor / clinic.
 *
 * Sends an automatic WhatsApp message whenever a consultation is booked or a
 * new patient enquiry is submitted. Provider is selected via env:
 *
 *   WHATSAPP_PROVIDER = "textmebot" | "callmebot" | "meta" | "webhook" | "none" (default)
 *
 * TextMeBot (recommended: low cost, reliable, no rotating numbers):
 *   TEXTMEBOT_PHONE   = +918712126799  (the doctor's WhatsApp number, with +)
 *   TEXTMEBOT_APIKEY  = <key from https://textmebot.com>
 *
 * CallMeBot (free, easiest for a single doctor's own phone):
 *   CALLMEBOT_PHONE   = 918712126799   (the doctor's WhatsApp number, no +)
 *   CALLMEBOT_APIKEY  = <key from one-time activation>
 *
 * Meta WhatsApp Cloud API (official):
 *   META_WA_TOKEN     = <permanent access token>
 *   META_WA_PHONE_ID  = <phone number id>
 *   DOCTOR_WHATSAPP   = 918712126799   (recipient, no +)
 *
 * Generic webhook (Zapier / Make / n8n / custom):
 *   WHATSAPP_WEBHOOK_URL = https://...
 *
 * If nothing is configured, it logs to the server console and no-ops, so
 * bookings still succeed.
 */

import { fetch as undiciFetch, Agent } from "undici";

type NotifyResult = { ok: boolean; provider: string; error?: string };

type FetchInit = Parameters<typeof undiciFetch>[1];

/**
 * Some networks (corporate/college Wi-Fi with SSL inspection) or misconfigured
 * API servers cause fetch to fail with "unable to verify the first
 * certificate". Set NOTIFY_INSECURE_TLS=true to relax cert verification ONLY
 * for these outbound notification calls (not the rest of the app).
 *
 * We use undici's own fetch + Agent here so the dispatcher is compatible.
 */
let insecureDispatcher: Agent | undefined;
function notifyFetch(url: string, init: FetchInit) {
  if (process.env.NOTIFY_INSECURE_TLS === "true") {
    if (!insecureDispatcher) {
      insecureDispatcher = new Agent({ connect: { rejectUnauthorized: false } });
    }
    return undiciFetch(url, { ...init, dispatcher: insecureDispatcher });
  }
  return undiciFetch(url, init);
}

/**
 * Normalise an Indian phone number to E.164 (+91XXXXXXXXXX).
 * Accepts "9876543210", "+91 98765 43210", "0091...", etc.
 */
export function normalizePhone(raw: string, defaultCountry = "91"): string {
  let digits = (raw || "").replace(/[^\d]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10) digits = defaultCountry + digits;
  return "+" + digits;
}

export async function notifyDoctorWhatsApp(message: string): Promise<NotifyResult> {
  const provider = (process.env.WHATSAPP_PROVIDER || "none").toLowerCase();

  try {
    switch (provider) {
      case "textmebot":
        return await sendViaTextMeBot(message);
      case "callmebot":
        return await sendViaCallMeBot(message);
      case "meta":
        return await sendViaMeta(message);
      case "webhook":
        return await sendViaWebhook(message);
      default:
        console.log("\n[notify] WhatsApp provider not configured. Message was:\n" + message + "\n");
        return { ok: false, provider: "none", error: "not-configured" };
    }
  } catch (err) {
    console.error("[notify] failed:", err);
    return {
      ok: false,
      provider,
      error: err instanceof Error ? err.message : "unknown-error",
    };
  }
}

type TmbRecipient = { phone: string; apikey: string };

/**
 * Build the list of TextMeBot recipients. The primary is the business number
 * (TEXTMEBOT_PHONE/APIKEY). Add extra alert numbers as pairs:
 *   TEXTMEBOT_PHONE_2 / TEXTMEBOT_APIKEY_2  (e.g. the owner's personal phone)
 * Each recipient needs its own one-time TextMeBot activation + apikey.
 * If a recipient has no apikey of its own, the primary apikey is reused
 * (works on TextMeBot plans where one apikey can send to multiple numbers).
 */
function textMeBotRecipients(): TmbRecipient[] {
  const primaryKey = process.env.TEXTMEBOT_APIKEY || "";
  const recipients: TmbRecipient[] = [];

  const p1 = process.env.TEXTMEBOT_PHONE;
  if (p1 && primaryKey) recipients.push({ phone: p1, apikey: primaryKey });

  const p2 = process.env.TEXTMEBOT_PHONE_2;
  if (p2) {
    const k2 = process.env.TEXTMEBOT_APIKEY_2 || primaryKey;
    if (k2) recipients.push({ phone: p2, apikey: k2 });
  }

  return recipients;
}

async function sendToOneTextMeBot(r: TmbRecipient, message: string): Promise<boolean> {
  const url =
    `https://api.textmebot.com/send.php?recipient=${encodeURIComponent(r.phone)}` +
    `&apikey=${encodeURIComponent(r.apikey)}&text=${encodeURIComponent(message)}`;
  try {
    const res = await notifyFetch(url, { method: "GET" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[notify] textmebot -> ${r.phone} failed: HTTP ${res.status} ${body.slice(0, 120)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[notify] textmebot -> ${r.phone} error:`, err);
    return false;
  }
}

async function sendViaTextMeBot(message: string): Promise<NotifyResult> {
  const recipients = textMeBotRecipients();
  if (recipients.length === 0) {
    console.log("[notify] textmebot selected but TEXTMEBOT_PHONE/APIKEY missing.");
    return { ok: false, provider: "textmebot", error: "missing-credentials" };
  }

  // Send to every configured recipient; succeed if at least one delivers.
  const results = await Promise.all(recipients.map((r) => sendToOneTextMeBot(r, message)));
  const okAny = results.some(Boolean);
  return {
    ok: okAny,
    provider: "textmebot",
    error: okAny ? undefined : "all-recipients-failed",
  };
}

async function sendViaCallMeBot(message: string): Promise<NotifyResult> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) {
    console.log("[notify] callmebot selected but CALLMEBOT_PHONE/APIKEY missing.");
    return { ok: false, provider: "callmebot", error: "missing-credentials" };
  }
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`;

  const res = await notifyFetch(url, { method: "GET" });
  const ok = res.ok;
  if (!ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, provider: "callmebot", error: `HTTP ${res.status} ${body.slice(0, 120)}` };
  }
  return { ok: true, provider: "callmebot" };
}

async function sendViaMeta(message: string): Promise<NotifyResult> {
  const token = process.env.META_WA_TOKEN;
  const phoneId = process.env.META_WA_PHONE_ID;
  const to = process.env.DOCTOR_WHATSAPP;
  if (!token || !phoneId || !to) {
    console.log("[notify] meta selected but META_WA_TOKEN/PHONE_ID/DOCTOR_WHATSAPP missing.");
    return { ok: false, provider: "meta", error: "missing-credentials" };
  }
  const res = await notifyFetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, provider: "meta", error: `HTTP ${res.status} ${body.slice(0, 160)}` };
  }
  return { ok: true, provider: "meta" };
}

/**
 * Send a WhatsApp message to a PATIENT (any number).
 * Requires a provider that can message arbitrary numbers: Twilio or Meta.
 * (CallMeBot / TextMeBot can only message your own activated number.)
 *
 *   PATIENT_NOTIFY_PROVIDER = "twilio" | "meta" | "none" (default)
 *
 * Twilio:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (e.g. whatsapp:+14155238886)
 * Meta (reuses the same credentials as the doctor notifier):
 *   META_WA_TOKEN, META_WA_PHONE_ID
 *
 * NOTE: WhatsApp only allows free-form messages within a 24h window after the
 * patient messages you. For always-on confirmations in production you must use
 * an approved message template (Twilio Content template / Meta template).
 */
export async function notifyPatientWhatsApp(
  toPhoneRaw: string,
  message: string,
  templateParams: string[] = []
): Promise<NotifyResult> {
  const provider = (process.env.PATIENT_NOTIFY_PROVIDER || "none").toLowerCase();
  const to = normalizePhone(toPhoneRaw);
  try {
    switch (provider) {
      case "twilio":
        return await sendPatientViaTwilio(to, message);
      case "meta":
        return await sendPatientViaMeta(to, message, templateParams);
      default:
        console.log(`[notify] patient provider not configured. Would send to ${to}:\n${message}`);
        return { ok: false, provider: "none", error: "not-configured" };
    }
  } catch (err) {
    console.error("[notify] patient send failed:", err);
    return {
      ok: false,
      provider,
      error: err instanceof Error ? err.message : "unknown-error",
    };
  }
}

async function sendPatientViaTwilio(to: string, message: string): Promise<NotifyResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    console.log("[notify] twilio selected but TWILIO_ACCOUNT_SID/AUTH_TOKEN/WHATSAPP_FROM missing.");
    return { ok: false, provider: "twilio", error: "missing-credentials" };
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const form = new URLSearchParams({
    From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
    To: `whatsapp:${to}`,
    Body: message,
  });
  const res = await notifyFetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, provider: "twilio", error: `HTTP ${res.status} ${body.slice(0, 160)}` };
  }
  return { ok: true, provider: "twilio" };
}

async function sendPatientViaMeta(
  to: string,
  message: string,
  templateParams: string[]
): Promise<NotifyResult> {
  const token = process.env.META_WA_TOKEN;
  const phoneId = process.env.META_WA_PHONE_ID;
  if (!token || !phoneId) {
    console.log("[notify] meta patient selected but META_WA_TOKEN/PHONE_ID missing.");
    return { ok: false, provider: "meta", error: "missing-credentials" };
  }

  const templateName = process.env.META_WA_TEMPLATE;
  const lang = process.env.META_WA_TEMPLATE_LANG || "en";

  // A template is REQUIRED to reach a patient who hasn't messaged you in the
  // last 24h (i.e. every booking). Free-form text is only used as a fallback
  // for testing inside the 24h customer-service window.
  const payload = templateName
    ? {
        messaging_product: "whatsapp",
        to: to.replace("+", ""),
        type: "template",
        template: {
          name: templateName,
          language: { code: lang },
          components: templateParams.length
            ? [
                {
                  type: "body",
                  parameters: templateParams.map((text) => ({ type: "text", text })),
                },
              ]
            : [],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: to.replace("+", ""),
        type: "text",
        text: { body: message },
      };

  const res = await notifyFetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, provider: "meta", error: `HTTP ${res.status} ${body.slice(0, 160)}` };
  }
  return { ok: true, provider: "meta" };
}

async function sendViaWebhook(message: string): Promise<NotifyResult> {
  const url = process.env.WHATSAPP_WEBHOOK_URL;
  if (!url) {
    console.log("[notify] webhook selected but WHATSAPP_WEBHOOK_URL missing.");
    return { ok: false, provider: "webhook", error: "missing-url" };
  }
  const res = await notifyFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    return { ok: false, provider: "webhook", error: `HTTP ${res.status}` };
  }
  return { ok: true, provider: "webhook" };
}
