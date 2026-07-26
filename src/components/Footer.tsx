import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/config/site";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SocialLinks } from "./SocialLinks";

const quickLinks = [
  { label: "About the Doctor", href: "#about" },
  { label: "Prescription Model", href: "#care-model" },
  { label: "Conditions We Treat", href: "#conditions" },
  { label: "Patient Stories", href: "#testimonials" },
  { label: "FAQs", href: "#faqs" },
  { label: "Book Consultation", href: "#book" },
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
            <SocialLinks variant="footer" />
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
                  <WhatsAppIcon className="h-4 w-4 text-accent-400" />
                  WhatsApp Chat
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 transition hover:text-white"
                >
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
            © {new Date().getFullYear()} {siteConfig.name}, {siteConfig.hospitalName}. All
            Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Tanuku · Walk-ins welcome · Home visits available</span>
            <Link
              href="/admin"
              className="font-medium text-brand-200 underline transition hover:text-white"
            >
              Doctor Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
