import { CheckCircle2 } from "lucide-react";
import { careModels } from "@/data/content";
import { whatsappLink } from "@/config/site";
import { SectionHeading } from "./SectionHeading";

export function CareModel() {
  return (
    <section id="care-model" className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Prescription Model"
          title="Care Designed Around You"
          subtitle="Three focused pathways of care, each built on listening first and treating the whole person."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {careModels.map((m) => (
            <div
              key={m.key}
              className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                <m.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{m.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{m.description}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {m.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(`Hello, I would like to know more about ${m.title} care at Sitara Holistic Care.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Ask on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
