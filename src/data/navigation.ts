export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Body Analysis", href: "#body-analysis" },
  { label: "Patient Stories", href: "#testimonials" },
  { label: "FAQs", href: "#faqs" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#book" },
];
