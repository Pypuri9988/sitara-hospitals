export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  {
    label: "Prescription Model",
    href: "#care-model",
    children: [
      { label: "Metabolic Health", href: "#care-model" },
      { label: "Chronic Disease Care", href: "#care-model" },
      { label: "Senior Care", href: "#care-model" },
    ],
  },
  { label: "Conditions", href: "#conditions" },
  { label: "Patient Stories", href: "#testimonials" },
  { label: "FAQs", href: "#faqs" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#book" },
];
