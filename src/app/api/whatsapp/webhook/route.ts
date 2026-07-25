import { NextResponse } from "next/server";
import { handleIncoming } from "@/lib/wa-bot";
import { markRead } from "@/lib/whatsapp";

/**
 * Meta WhatsApp Cloud API webhook.
 *
 * GET  — one-time verification handshake from Meta (echoes hub.challenge).
 * POST — receives incoming user messages and drives the bot replies.
 *
 * Setup in Meta App Dashboard > WhatsApp > Configuration > Webhook:
 *   Callback URL : https://YOUR_DOMAIN/api/whatsapp/webhook
 *   Verify token : must match WHATSAPP_VERIFY_TOKEN in .env.local
 *   Subscribe to the "messages" field.
 *
 * NOTE: Meta only calls a PUBLIC https URL. For local testing, expose your dev
 * server with a tunnel (e.g. `ngrok http 3000`) and use that https URL.
 */

// Verification handshake.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// Minimal shape of the parts of Meta's payload we use.
type WAMessage = {
  from: string;
  id: string;
  type: string;
  text?: { body: string };
  interactive?: {
    type: string;
    list_reply?: { id: string; title: string };
    button_reply?: { id: string; title: string };
  };
  image?: { id?: string; caption?: string; mime_type?: string };
  document?: { id?: string; caption?: string; filename?: string; mime_type?: string };
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    const entries = (body as { entry?: unknown[] })?.entry ?? [];
    for (const entry of entries) {
      const changes = (entry as { changes?: unknown[] })?.changes ?? [];
      for (const change of changes) {
        const value = (change as { value?: Record<string, unknown> })?.value ?? {};
        const messages = (value.messages as WAMessage[] | undefined) ?? [];
        const contacts = (value.contacts as Array<{ profile?: { name?: string } }> | undefined) ?? [];
        const profileName = contacts[0]?.profile?.name;

        for (const m of messages) {
          // Acknowledge (blue ticks) — non-blocking.
          if (m.id) markRead(m.id).catch(() => {});

          let text: string | undefined;
          let id: string | undefined;
          let hasMedia = false;

          if (m.type === "text") {
            text = m.text?.body;
          } else if (m.type === "interactive") {
            const reply = m.interactive?.list_reply ?? m.interactive?.button_reply;
            id = reply?.id;
            text = reply?.title;
          } else if (m.type === "button") {
            // Legacy template quick-reply button.
            text = (m as unknown as { button?: { text?: string } }).button?.text;
          } else if (m.type === "image" || m.type === "document") {
            // Photo/scan of a prescription or test list uploaded by the patient.
            hasMedia = true;
            text = m.image?.caption ?? m.document?.caption;
          }

          if (m.from && (text || id || hasMedia)) {
            await handleIncoming(m.from, { id, text, profileName, hasMedia });
          }
        }
      }
    }
  } catch (err) {
    console.error("[whatsapp-webhook] error:", err);
  }

  // Always 200 quickly so Meta doesn't retry/disable the webhook.
  return NextResponse.json({ ok: true });
}
