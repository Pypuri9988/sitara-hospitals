import { firstVisit } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function FirstVisit() {
  return (
    <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-secondary-900 px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">
            Your First Visit
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            What to Bring With You
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-100">
            A few simple things help us make the most of your unhurried first
            consultation.
          </p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent-500" />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {firstVisit.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
            >
              <span className="absolute right-4 top-4 text-4xl font-black text-white/10">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-accent-400">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
