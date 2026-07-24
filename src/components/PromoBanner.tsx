import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <Link
      href="/#body-analysis"
      className="group block bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
        <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-white" />
        <span>
          <span className="font-extrabold">NEW</span> · Body Composition
          Analysis — know your body fat, muscle &amp; metabolic age in{" "}
          <span className="font-extrabold">60 seconds</span>
        </span>
        <span className="hidden items-center gap-1 whitespace-nowrap underline underline-offset-2 sm:inline-flex">
          Book now
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
