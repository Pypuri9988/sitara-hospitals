import { CheckCircle2, MessageCircle, HeartPulse } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { bodyCompositionPoints, bodyCompositionMetrics } from "@/data/content";
import { SectionHeading } from "./SectionHeading";
import { BodyCompositionCarousel } from "./BodyCompositionCarousel";

const enquiryMessage =
  "Hello Sitara360 Care, I would like to know more about the Body Composition Analysis test and book it.";

const recommendedFor = [
  "Diabetes",
  "Weight & Obesity",
  "Thyroid",
  "PCOS",
  "Heart Health",
];

export function BodyComposition() {
  return (
    <section
      id="body-analysis"
      className="relative overflow-hidden px-4 py-20"
    >
      {/* soft brand backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-white" />
            New · Now Available
          </span>
        </div>
        <SectionHeading
          eyebrow="Advanced Diagnostics · Only at Sri Sitara 360 Care"
          title="Discover Your Body Like Never Before"
          subtitle="Our clinic-grade Body Composition Analysis reveals what your weight can never tell you — fat, muscle, water and hidden risks — in a single, painless 60-second scan."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          {/* Auto-sliding image showcase */}
          <div className="order-1">
            <BodyCompositionCarousel />
          </div>

          {/* Benefits + CTA */}
          <div className="order-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {bodyCompositionPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {p.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800">
                Your report reveals:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bodyCompositionMetrics.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(enquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent-600 hover:shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                Get Your Body Composition Test
              </a>
              <a
                href="/#book"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-6 py-3.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Book at the clinic
              </a>
            </div>
          </div>
        </div>

        {/* Promotional highlight banner */}
        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:flex-row sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-400/15 text-accent-600">
              <HeartPulse className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-bold text-slate-900">
                Especially valuable if you have:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendedFor.map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <a
            href={whatsappLink(enquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <MessageCircle className="h-4 w-4" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
