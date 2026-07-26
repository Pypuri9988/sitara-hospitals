import { siteConfig } from "@/config/site";

type IconProps = { className?: string };

/** Official Instagram glyph (white) — use on brand gradient. */
export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.55.55-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.63-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.63-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5.87a5.13 5.13 0 1 0 0 10.26 5.13 5.13 0 0 0 0-10.26Zm0 8.46a3.33 3.33 0 1 1 0-6.66 3.33 3.33 0 0 1 0 6.66Zm6.54-8.66a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

/** Official LinkedIn "in" mark. */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2Z" />
    </svg>
  );
}

export const socialLinks = [
  {
    key: "instagram",
    href: siteConfig.social.instagram,
    label: "Instagram — Sitara Hospitals",
    shortLabel: "Instagram",
  },
  {
    key: "linkedin",
    href: siteConfig.social.linkedin,
    label: "LinkedIn — Dr. Neelu Mahendra Sunkavalli",
    shortLabel: "LinkedIn",
  },
] as const;

type SocialLinksProps = {
  variant?: "about" | "footer";
};

export function SocialLinks({ variant = "footer" }: SocialLinksProps) {
  if (variant === "about") {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram — Sitara Hospitals"
          title="Instagram — Sitara Hospitals"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{
            background:
              "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          }}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15">
            <InstagramIcon className="h-4 w-4 text-white" />
          </span>
          Instagram
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn — Dr. Neelu Mahendra Sunkavalli"
          title="LinkedIn — Dr. Neelu Mahendra Sunkavalli"
          className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004182]"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15">
            <LinkedInIcon className="h-4 w-4 text-white" />
          </span>
          LinkedIn
        </a>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-300">
        Follow us
      </span>
      <a
        href={siteConfig.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram — Sitara Hospitals"
        title="Instagram — Sitara Hospitals"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
        style={{
          background:
            "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        }}
      >
        <InstagramIcon className="h-4 w-4 shrink-0" />
        Instagram
      </a>
      <a
        href={siteConfig.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn — Dr. Neelu Mahendra Sunkavalli"
        title="LinkedIn — Dr. Neelu Mahendra Sunkavalli"
        className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#004182]"
      >
        <LinkedInIcon className="h-4 w-4 shrink-0" />
        LinkedIn
      </a>
    </div>
  );
}
