"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, MessageCircle, CalendarCheck } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { whatsappLink } from "@/config/site";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all ${
        scrolled
          ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
                {item.children && (
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                )}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full min-w-56 translate-y-2 rounded-xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-whatsapp transition hover:bg-green-50 lg:inline-flex"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <Link
            href="/#book"
            className="hidden items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Consultation
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-slate-900/50 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-white shadow-2xl transition-transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <Logo />
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {mainNav.map((item) => (
              <div key={item.label} className="border-b border-slate-50">
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenGroup(openGroup === item.label ? null : item.label)
                      }
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-800"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition ${
                          openGroup === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openGroup === item.label && (
                      <div className="pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-6 py-2 text-sm text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="border-t border-slate-100 p-4">
            <Link
              href="/#book"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
            >
              <CalendarCheck className="h-4 w-4" />
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
