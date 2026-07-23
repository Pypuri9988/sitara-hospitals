/**
 * Meta WhatsApp Cloud API — OUTBOUND message helpers for the inbound bot.
 *
 * These send messages back to a user who is chatting with your WhatsApp
 * Business number. Because the user messaged you first, you're inside the
 * 24-hour customer-service window and can send free-form text / interactive
 * messages WITHOUT an approved template.
 *
 * Requires (already in .env.local):
 *   META_WA_TOKEN     = <permanent system-user access token>
 *   META_WA_PHONE_ID  = <your WhatsApp phone number id>
 */

import { fetch as undiciFetch, Agent } from "undici";

const GRAPH_VERSION = "v20.0";

type FetchInit = Parameters<typeof undiciFetch>[1];

let insecureDispatcher: Agent | undefined;
function waFetch(url: string, init: FetchInit) {
  if (process.env.NOTIFY_INSECURE_TLS === "true") {
    if (!insecureDispatcher) {
      insecureDispatcher = new Agent({ connect: { rejectUnauthorized: false } });
    }
    return undiciFetch(url, { ...init, dispatcher: insecureDispatcher });
  }
  return undiciFetch(url, init);
}

export type ListRow = { id: string; title: string; description?: string };
export type ReplyButton = { id: string; title: string };

async function send(payload: Record<string, unknown>): Promise<boolean> {
  const token = process.env.META_WA_TOKEN;
  const phoneId = process.env.META_WA_PHONE_ID;
  if (!token || !phoneId) {
    console.log("[whatsapp] META_WA_TOKEN / META_WA_PHONE_ID missing — cannot send.");
    return false;
  }
  try {
    const res = await waFetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[whatsapp] send failed: HTTP ${res.status} ${body.slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[whatsapp] send error:", err);
    return false;
  }
}

export function sendText(to: string, body: string) {
  return send({ to, type: "text", text: { preview_url: false, body } });
}

/**
 * Interactive LIST message (like Yashoda's "See all options").
 * Max 10 rows total across sections. Titles <= 24 chars, descriptions <= 72.
 */
export function sendList(
  to: string,
  bodyText: string,
  buttonText: string,
  rows: ListRow[],
  header?: string,
  footer?: string
) {
  return send({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      ...(header ? { header: { type: "text", text: header.slice(0, 60) } } : {}),
      body: { text: bodyText.slice(0, 1024) },
      ...(footer ? { footer: { text: footer.slice(0, 60) } } : {}),
      action: {
        button: buttonText.slice(0, 20),
        sections: [
          {
            rows: rows.slice(0, 10).map((r) => ({
              id: r.id.slice(0, 200),
              title: r.title.slice(0, 24),
              ...(r.description ? { description: r.description.slice(0, 72) } : {}),
            })),
          },
        ],
      },
    },
  });
}

/**
 * Interactive REPLY BUTTONS (max 3). Titles <= 20 chars.
 */
export function sendButtons(to: string, bodyText: string, buttons: ReplyButton[], header?: string) {
  return send({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      ...(header ? { header: { type: "text", text: header.slice(0, 60) } } : {}),
      body: { text: bodyText.slice(0, 1024) },
      action: {
        buttons: buttons.slice(0, 3).map((b) => ({
          type: "reply",
          reply: { id: b.id.slice(0, 256), title: b.title.slice(0, 20) },
        })),
      },
    },
  });
}

/** Mark an incoming message as read (blue ticks) — optional nicety. */
export function markRead(messageId: string) {
  return send({ status: "read", message_id: messageId });
}
