import { conditions } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Conditions() {
  return (
    <section id="conditions" className="bg-brand-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Areas of Care"
          title="Conditions We Focus On"
          subtitle="Deep, focused expertise in metabolic and chronic conditions that are too often overlooked."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <div
              key={c.name}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{c.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
