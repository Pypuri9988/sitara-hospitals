import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-secondary-600 shadow-soft ring-1 ring-white/30 transition group-hover:scale-105">
        <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-extrabold tracking-tight ${
            light ? "text-white" : "text-brand-800"
          }`}
        >
          Sitara
          <span className="text-accent-500">360</span>
          <span className={light ? "text-brand-100" : "text-slate-500"}> Care</span>
        </span>
        <span
          className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${
            light ? "text-brand-100" : "text-slate-400"
          }`}
        >
          {siteConfig.location}
        </span>
      </span>
    </Link>
  );
}
