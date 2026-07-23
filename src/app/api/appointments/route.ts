import { NextResponse } from "next/server";
import { appendToCollection, readCollection, generateId } from "@/lib/storage";
import { validateName, validatePhone, sanitize } from "@/lib/validation";
import { notifyDoctorWhatsApp, notifyPatientWhatsApp } from "@/lib/notify";
import { siteConfig } from "@/config/site";

export type Appointment = {
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

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const name = sanitize(body.name, 80);
  const phone = sanitize(body.phone, 20);

  if (!validateName(name)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid name." },
      { status: 422 }
    );
  }
  if (!validatePhone(phone)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid phone number." },
      { status: 422 }
    );
  }

  const appointment: Appointment = {
    id: generateId("APPT"),
    name,
    phone,
    condition: sanitize(body.condition, 80) || "General Consultation",
    preferredDate: sanitize(body.preferredDate, 30),
    preferredTime: sanitize(body.preferredTime, 30),
    mode: sanitize(body.mode, 30) || "In-person",
    message: sanitize(body.message, 500),
    createdAt: new Date().toISOString(),
  };

  await appendToCollection("appointments", appointment);

  const notifyText =
    `🩺 New Consultation Booked — Sitara360 Care\n` +
    `Ref: ${appointment.id}\n` +
    `Name: ${appointment.name}\n` +
    `Phone: ${appointment.phone}\n` +
    `Concern: ${appointment.condition}\n` +
    `Preferred: ${appointment.preferredDate || "Any day"} - ${appointment.preferredTime || "Any time"}\n` +
    `Mode: ${appointment.mode}\n` +
    `Notes: ${appointment.message || "-"}\n` +
    `Booked: ${new Date(appointment.createdAt).toLocaleString("en-IN")}`;

  const patientText =
    `Hello ${appointment.name}, thank you for choosing ${siteConfig.name}! 🩺\n\n` +
    `Your consultation request is received.\n` +
    `Ref: ${appointment.id}\n` +
    `Preferred: ${appointment.preferredDate || "Any day"} - ${appointment.preferredTime || "Any time"}\n` +
    `Mode: ${appointment.mode}\n\n` +
    `Our team will call you shortly to confirm. Location: ${siteConfig.address}.\n` +
    `Need help? Reply here or call ${siteConfig.phone}.`;

  // Template variables for Meta WhatsApp ({{1}} name, {{2}} ref, {{3}} schedule).
  const patientTemplateParams = [
    appointment.name,
    appointment.id,
    `${appointment.preferredDate || "Any day"} - ${appointment.preferredTime || "Any time"} (${appointment.mode})`,
  ];

  // Fire notifications but never let them break the booking.
  const [notified, patientNotified] = await Promise.all([
    notifyDoctorWhatsApp(notifyText).catch(() => ({ ok: false })),
    notifyPatientWhatsApp(appointment.phone, patientText, patientTemplateParams).catch(() => ({
      ok: false,
    })),
  ]);

  return NextResponse.json({
    ok: true,
    id: appointment.id,
    notified: notified.ok,
    patientNotified: patientNotified.ok,
    message: "Your consultation request has been received.",
  });
}

export async function GET(request: Request) {
  // Lightweight admin listing protected by a token in the query string.
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const items = await readCollection<Appointment>("appointments");
  return NextResponse.json({ ok: true, count: items.length, items });
}
