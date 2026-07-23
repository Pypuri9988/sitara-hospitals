"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, MessageCircle, Phone, CalendarCheck } from "lucide-react";
import { whatsappLink, telLink } from "@/config/site";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop / tablet floating stack (sits above the chat launcher) */}
      <div className="fixed bottom-24 right-5 z-40 hidden flex-col items-end gap-3 sm:flex">
        {showTop && (
          <button
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg transition hover:bg-brand-800"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="animate-pulse-ring group inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:hidden">
        <a
          href={telLink()}
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-brand-700"
        >
          <Phone className="h-5 w-5" />
          Call
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-slate-100 py-2.5 text-xs font-medium text-whatsapp"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>
        <Link
          href="/#book"
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-accent-600"
        >
          <CalendarCheck className="h-5 w-5" />
          Book
        </Link>
      </div>
    </>
  );
}
