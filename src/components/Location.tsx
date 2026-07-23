import { MapPin, Clock, PhoneCall, MessageCircle } from "lucide-react";
import { siteConfig, telLink, whatsappLink, mapLink } from "@/config/site";
import { SectionHeading } from "./SectionHeading";

export function Location() {
  return (
    <section id="location" className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Find Us"
          title="Visit Sri Sitara Hospital"
          subtitle="Located in the heart of Tanuku. Walk in when you're ready — no appointment needed for your first visit."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
            <iframe
              title="Sri Sitara Hospital location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                siteConfig.mapQuery
              )}&output=embed`}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-slate-800">Address</div>
                <p className="mt-0.5 text-sm text-slate-600">{siteConfig.address}</p>
                <a
                  href={mapLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-brand-700 underline"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-slate-800">Timings</div>
                <p className="mt-0.5 text-sm text-slate-600">{siteConfig.hours}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={telLink()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <PhoneCall className="h-4 w-4" />
                Call {siteConfig.phone}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
