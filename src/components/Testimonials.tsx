import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-brand-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Real People, Real Outcomes"
          subtitle="Stories from patients in and around Tanuku who finally found answers."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.text}
              className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-0.5 text-accent-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <Quote className="mt-4 h-7 w-7 text-brand-200" />
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">
                {t.text}
              </blockquote>
              <figcaption className="mt-5 border-t border-slate-100 pt-4">
                <div className="text-sm font-bold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-400">{t.meta}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
