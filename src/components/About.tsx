import Image from "next/image";
import { Quote } from "lucide-react";
import { siteConfig } from "@/config/site";
import { whyPoints } from "@/data/content";

export function About() {
  return (
    <section id="about" className="px-4 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={siteConfig.images.clinic}
              alt="Consultation room at Sitara Holistic Care"
              width={900}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden max-w-xs rounded-2xl bg-brand-700 p-5 text-white shadow-xl sm:block">
            <Quote className="h-6 w-6 text-accent-400" />
            <p className="mt-2 text-sm leading-relaxed">
              He wanted to understand <em>why</em> a patient was unwell — not just
              hand over another prescription.
            </p>
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            About the Doctor
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Whole-person care, backed by global training
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {siteConfig.doctor.name} is a consultant physician who kept seeing
            patients leave with prescriptions but no real answers about why they
            were unwell. That gap — between treating a number and treating a
            person — is what shaped {siteConfig.name}. Here, every visit begins
            with listening.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            His MRCP-UK qualification, awarded by the Royal Colleges of
            Physicians in London, is the same credential held by hospital
            specialists across the UK&apos;s NHS — a rarity in this region.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {whyPoints.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {p.title}
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {p.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
