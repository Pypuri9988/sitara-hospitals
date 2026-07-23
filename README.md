# Sitara Holistic Care — Sri Sitara Hospital, Tanuku

A modern, friendly clinic website for **Dr. Neelu Mahendra Sunkavalli** (Sitara Holistic Care, Tanuku), built with **Next.js (App Router) + TypeScript + Tailwind CSS**. It includes real-time **WhatsApp** connect, plus a **backend** for online **consultation booking** and **new-patient registration**.

> This is an original build with placeholder marketing copy and AI-generated placeholder images. Replace the doctor photo, hospital image, and any wording with your real assets before going live.

## Features

### Frontend
- Hero with hospital background image + doctor credential card (MD, MRCP-UK, 10+ yrs)
- About / philosophy section with clinic interior image and "why choose" points
- Conditions we focus on (Diabetes, Hypertension, Metabolic, Thyroid/Fatty Liver, PCOS, Senior Care)
- Prescription Model: Metabolic Health / Chronic Disease Care / Senior Care
- "What to bring to your first visit" checklist
- Patient testimonials
- Google Maps location + timings + call/WhatsApp
- FAQ accordion
- Sticky header (mobile drawer), footer, floating WhatsApp button, mobile bottom bar (Call / WhatsApp / Book)

### WhatsApp (real-time, business number `+91 8712126799`)
- Floating WhatsApp button and header/footer/hero shortcuts, all opening `wa.me` chat with a prefilled message
- After booking/registration, a "Confirm on WhatsApp" button sends the full structured request to your WhatsApp instantly

### Backend (API + storage)
- `POST /api/appointments` — validates and stores consultation requests
- `POST /api/register` — validates and stores new-patient registrations
- `GET /api/appointments?token=...` and `GET /api/register?token=...` — admin listing (requires `ADMIN_TOKEN`)
- Data is persisted as JSON in a local `data/` folder (git-ignored). Swap for a real DB (Postgres/Mongo/Supabase) for serverless hosting.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Admin listing (optional)
Create a `.env.local` file:

```
ADMIN_TOKEN=your-secret-token
```

Then view submissions at:
- `http://localhost:3000/api/appointments?token=your-secret-token`
- `http://localhost:3000/api/register?token=your-secret-token`

## Where to customize

- **Brand, doctor, phone, WhatsApp number, address, hours**: [`src/config/site.ts`](src/config/site.ts)
  - `whatsappNumber` is already set to `918712126799` (international format, no `+`).
- **Conditions / care model / first-visit / testimonials / FAQs**: [`src/data/content.ts`](src/data/content.ts)
- **Navigation**: [`src/data/navigation.ts`](src/data/navigation.ts)
- **Images**: replace files in `public/images/` (`doctor-portrait.png`, `hospital-exterior.png`, `clinic-interior.png`)
- **Backend storage/validation**: [`src/lib/storage.ts`](src/lib/storage.ts), [`src/lib/validation.ts`](src/lib/validation.ts)

## Upgrading WhatsApp to the official Cloud API (optional)
The current setup uses click-to-chat (`wa.me`), which is instant and needs no approval. To send automated confirmations/reminders from the server, add a Meta WhatsApp Cloud API integration inside `src/app/api/appointments/route.ts` after the record is saved (requires a Meta Business account, verified number, and an access token).

## Build & run in production

```bash
npm run build
npm start
```
