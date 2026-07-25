import { siteConfig, whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

const segments = [
  "One click away on WhatsApp",
  `Chat ${siteConfig.phone}`,
  "Book a consultation",
  "Home sample pickup",
  "Medicine delivery",
  "Talk to Sitara360 Care",
];

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4">
      {segments.map((text) => (
        <span key={text} className="inline-flex items-center gap-2.5 whitespace-nowrap">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
          </span>
          <span className="text-[13px] font-semibold tracking-wide text-white/95 sm:text-sm">
            {text}
          </span>
          <span className="h-1 w-1 rounded-full bg-accent-400/90" aria-hidden />
        </span>
      ))}
    </div>
  );
}

/**
 * Professional infinite-scroll strip highlighting WhatsApp as the fastest
 * way to reach Sitara360 Care (Meta business number).
 */
export function WhatsAppMarquee() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Sitara360 Care on WhatsApp at ${siteConfig.phone}`}
      className="group relative block overflow-hidden border-b border-white/10 bg-gradient-to-r from-brand-900 via-brand-800 to-secondary-900"
    >
      {/* Soft highlight shimmer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "waShimmer 4.5s ease-in-out infinite",
        }}
      />

      <div className="relative flex items-center py-2.5">
        <div className="wa-marquee flex w-max items-center group-hover:[animation-play-state:paused]">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>
    </a>
  );
}
