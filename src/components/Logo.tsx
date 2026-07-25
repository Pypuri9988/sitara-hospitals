import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-soft ring-1 transition group-hover:scale-105 ${
          light ? "bg-white/10 ring-white/20" : "bg-white ring-slate-200"
        }`}
      >
        <Image
          src="/images/icon-sitara360.png"
          alt={`${siteConfig.name} logo`}
          width={44}
          height={44}
          className="h-full w-full object-cover"
          priority
        />
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
