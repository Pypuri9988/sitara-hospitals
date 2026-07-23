import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/config/site";
import { Logo } from "./Logo";

type IconProps = { className?: string };

const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
  </svg>
);
const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.55.55-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.63-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.63-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5.87a5.13 5.13 0 1 0 0 10.26 5.13 5.13 0 0 0 0-10.26Zm0 8.46a3.33 3.33 0 1 1 0-6.66 3.33 3.33 0 0 1 0 6.66Zm6.54-8.66a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
  </svg>
);
const YoutubeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
  </svg>
);

const quickLinks = [
  { label: "About the Doctor", href: "#about" },
  { label: "Prescription Model", href: "#care-model" },
  { label: "Conditions We Treat", href: "#conditions" },
  { label: "Patient Stories", href: "#testimonials" },
  { label: "FAQs", href: "#faqs" },
  { label: "Book Consultation", href: "#book" },
];

const socials = [
  { icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: YoutubeIcon, href: siteConfig.social.youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-brand-900 via-brand-900 to-secondary-900 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-200">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-brand-100 transition hover:bg-accent-500 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {siteConfig.address}
              </li>
              <li>
                <a href={telLink()} className="flex items-center gap-2 transition hover:text-white">
                  <Phone className="h-4 w-4 text-accent-400" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 text-accent-400" />
                  WhatsApp Chat
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-white">
                  <Mail className="h-4 w-4 text-accent-400" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {siteConfig.hours}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-brand-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}, {siteConfig.hospitalName}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Tanuku · Walk-ins welcome · Home visits available</span>
            <Link href="/admin" className="font-medium text-brand-200 underline transition hover:text-white">
              Doctor Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
