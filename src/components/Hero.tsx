import Image from "next/image";
import { MessageCircle, CalendarCheck, MapPin, PhoneCall, CheckCircle2 } from "lucide-react";
import { siteConfig, whatsappLink, telLink, mapLink } from "@/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background hospital image */}
      <div className="absolute inset-0">
        <Image
          src={siteConfig.images.hospital}
          alt={`${siteConfig.hospitalName} building in ${siteConfig.location}`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-brand-900/85 to-brand-700/40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="animate-fade-up text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-50 ring-1 ring-white/25">
            <MapPin className="h-4 w-4 text-accent-400" />
            {siteConfig.location} · Walk-ins Welcome
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Medicine that treats <span className="text-accent-400">you</span> —
            not just your numbers
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
            {siteConfig.doctor.name} brings globally trained, evidence-based,
            whole-person care to {siteConfig.location} — for diabetes, weight,
            blood pressure, thyroid and aging well.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {siteConfig.highlights &&
              [siteConfig.highlights.walkIn, siteConfig.highlights.homeVisit].map(
                (h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent-400" />
                    {h}
                  </span>
                )
              )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#book"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-600"
            >
              <CalendarCheck className="h-4 w-4" />
              Book Consultation
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <a
              href={telLink()}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20"
            >
              <PhoneCall className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </div>
        </div>

        {/* Doctor card */}
        <div className="animate-fade-up lg:justify-self-end">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-white/40 backdrop-blur">
            <div className="bg-gradient-to-br from-brand-100 to-brand-200">
              <Image
                src={siteConfig.doctor.photo}
                alt={siteConfig.doctor.name}
                width={800}
                height={800}
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-slate-900">
                {siteConfig.doctor.name}
              </h2>
              <p className="text-sm font-medium text-brand-700">
                {siteConfig.doctor.title}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {siteConfig.doctor.credentials.map((c) => (
                  <div key={c.label} className="rounded-xl bg-brand-50 p-2">
                    <div className="text-sm font-extrabold text-brand-700">
                      {c.label}
                    </div>
                    <div className="mt-0.5 text-[10px] leading-tight text-slate-500">
                      {c.detail}
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={mapLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <MapPin className="h-4 w-4" />
                {siteConfig.hospitalName}, {siteConfig.location}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-6 w-full rounded-t-[2rem] bg-white" />
    </section>
  );
}
