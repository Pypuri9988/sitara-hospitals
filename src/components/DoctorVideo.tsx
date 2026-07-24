"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX, CheckCircle2, MessageCircle, CalendarCheck } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";

type DoctorVideoProps = {
  /** Path served by the site, e.g. "/videos/Siatara.mp4" (file lives in public/videos/). */
  src: string;
  poster?: string;
};

const points = [
  "Globally trained — MRCP-UK, Royal Colleges, London",
  "Root-cause, whole-person care — not just prescriptions",
  "Unhurried consultations, time to truly listen",
];

export function DoctorVideo({ src, poster }: DoctorVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // Most doctor clips are vertical; default portrait to avoid a layout flash,
  // then correct from the real dimensions once metadata loads.
  const [portrait, setPortrait] = useState(true);

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (v && v.videoWidth > 0) setPortrait(v.videoHeight >= v.videoWidth);
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !muted;
    v.muted = nextMuted;
    if (!nextMuted) {
      v.volume = 1;
      void v.play().catch(() => {});
    }
    setMuted(nextMuted);
  };

  return (
    <section id="doctor-video" className="px-4 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Text side */}
        <div className="order-2 lg:order-1">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            In Her Own Words
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            A Message from Your Doctor
          </h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-accent-500" />
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Hear directly from {siteConfig.doctor.name} about the kind of care
            you can expect — and why so many families in {siteConfig.location}{" "}
            trust her with their health.
          </p>

          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/#book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent-600"
            >
              <CalendarCheck className="h-4 w-4" />
              Book a Consultation
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-6 py-3.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Video side */}
        <div className="relative order-1 lg:order-2">
          <div className="absolute -inset-1 rounded-[2.3rem] bg-gradient-to-r from-brand-400 via-brand-600 to-accent-500 opacity-25 blur-md" />

          <div
            className={`relative mx-auto overflow-hidden rounded-[2rem] border border-white/50 bg-slate-900 shadow-2xl ${
              portrait ? "w-full max-w-[340px]" : "w-full"
            }`}
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={onLoadedMetadata}
              className="block h-auto w-full"
            />

            <button
              type="button"
              onClick={toggleSound}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
