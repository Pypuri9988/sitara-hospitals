"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="bg-brand-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Need Help?"
          title="Frequently Asked Questions"
        />

        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-600 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
