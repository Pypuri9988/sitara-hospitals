"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
  fit: "cover" | "contain";
};

const slides: Slide[] = [
  {
    src: "/images/bca-report-dashboard.png",
    alt: "Detailed body composition report showing body fat, muscle and metabolic age",
    caption: "Your full body report — in just 60 seconds",
    fit: "cover",
  },
  {
    src: "/images/body-composition-analyzer.png",
    alt: "Professional body composition analyser at Sri Sitara 360 Care",
    caption: "Advanced, clinic-grade body analyser",
    fit: "contain",
  },
  {
    src: "/images/bca-doctor-review.png",
    alt: "Doctor explaining a body composition report to a patient",
    caption: "We explain every number, in simple words",
    fit: "cover",
  },
  {
    src: "/images/bca-healthy-patient.png",
    alt: "Happy, healthy patient after body composition guided care",
    caption: "Know your true health — beyond the weighing scale",
    fit: "cover",
  },
];

const INTERVAL = 3800;

export function BodyCompositionCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-br from-brand-50 via-white to-brand-100 shadow-lg">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={slide.fit === "contain" ? "object-contain p-8" : "object-cover"}
              priority={i === 0}
            />
            {/* Caption gradient + text */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 via-slate-900/25 to-transparent p-5 pt-16">
              <p className="text-sm font-semibold text-white sm:text-base">
                {slide.caption}
              </p>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow transition hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow transition hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-7 bg-brand-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 left-6 z-10 flex items-center gap-2 rounded-2xl bg-brand-700 px-4 py-2.5 text-white shadow-xl">
        <span className="text-lg font-extrabold">60-sec</span>
        <span className="text-[11px] uppercase leading-tight tracking-wider text-brand-100">
          full body
          <br />
          report
        </span>
      </div>
    </div>
  );
}
