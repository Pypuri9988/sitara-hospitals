import { NextResponse } from "next/server";
import { appendToCollection, readCollection, generateId } from "@/lib/storage";
import { validateName, validatePhone, sanitize } from "@/lib/validation";
import { notifyDoctorWhatsApp, notifyPatientWhatsApp } from "@/lib/notify";
import { siteConfig } from "@/config/site";

export type Registration = {
  id: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
  city: string;
  concern: string;
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

  const registration: Registration = {
    id: generateId("REG"),
    name,
    phone,
    age: sanitize(body.age, 3),
    gender: sanitize(body.gender, 20),
    city: sanitize(body.city, 60),
    concern: sanitize(body.concern, 500),
    createdAt: new Date().toISOString(),
  };

  await appendToCollection("registrations", registration);

  const notifyText =
    `📝 New Patient Enquiry — Sitara360 Care\n` +
    `Ref: ${registration.id}\n` +
    `Name: ${registration.name}\n` +
    `Phone: ${registration.phone}\n` +
    `Age/Gender: ${registration.age || "-"} / ${registration.gender}\n` +
    `City: ${registration.city || "-"}\n` +
    `Concern: ${registration.concern || "-"}\n` +
    `On: ${new Date(registration.createdAt).toLocaleString("en-IN")}`;

  const patientText =
    `Hello ${registration.name}, thank you for registering with ${siteConfig.name}! 🩺\n\n` +
    `Ref: ${registration.id}\n` +
    `Our team will reach out to you shortly.\n` +
    `Location: ${siteConfig.address}.\n` +
    `Need help? Reply here or call ${siteConfig.phone}.`;

  // Template variables for Meta WhatsApp ({{1}} name, {{2}} ref, {{3}} details).
  const patientTemplateParams = [
    registration.name,
    registration.id,
    registration.concern || "New patient registration",
  ];

  const [notified, patientNotified] = await Promise.all([
    notifyDoctorWhatsApp(notifyText).catch(() => ({ ok: false })),
    notifyPatientWhatsApp(registration.phone, patientText, patientTemplateParams).catch(() => ({
      ok: false,
    })),
  ]);

  return NextResponse.json({
    ok: true,
    id: registration.id,
    notified: notified.ok,
    patientNotified: patientNotified.ok,
    message: "Registration successful.",
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const items = await readCollection<Registration>("registrations");
  return NextResponse.json({ ok: true, count: items.length, items });
}
