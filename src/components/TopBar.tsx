import { Phone, Clock, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, telLink, whatsappLink } from "@/config/site";

export function TopBar() {
  return (
    <div className="hidden bg-brand-800 text-white md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm">
        <div className="flex items-center gap-2 text-brand-100">
          <MapPin className="h-4 w-4 text-accent-400" />
          {siteConfig.hospitalName}, {siteConfig.location}
        </div>
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-2 text-brand-200">
            <Clock className="h-4 w-4" />
            {siteConfig.hours}
          </span>
          <a
            href={telLink()}
            className="inline-flex items-center gap-2 font-medium transition hover:text-accent-400"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phone}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium transition hover:text-accent-400"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
