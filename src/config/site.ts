export const siteConfig = {
  name: "Sitara360 Care",
  shortName: "Sitara360",
  hospitalName: "Sri Sitara Hospital",
  tagline: "Medicine that treats you — not just your numbers",
  location: "Tanuku, Andhra Pradesh",
  doctor: {
    name: "Dr. Neelu Mahendra Sunkavalli",
    title: "Consultant Physician, Internal Medicine",
    credentials: [
      { label: "MD", detail: "Internal Medicine" },
      { label: "MRCP-UK", detail: "Royal Colleges, London" },
      { label: "10+ Years", detail: "Clinical Practice" },
    ],
    photo: "/images/doctor-neelu.png",
  },
  description:
    "Sitara Holistic Care in Tanuku offers globally trained, evidence-based, whole-person medicine for diabetes, weight, blood pressure, thyroid and healthy aging.",
  // Update these with your real numbers.
  phone: "+91 87121 26799",
  // WhatsApp business number in international format WITHOUT + or spaces.
  whatsappNumber: "918712126799",
  whatsappDefaultMessage:
    "Hello Sitara360 Care, I would like to book a consultation with Dr. Neelu Mahendra.",
  email: "care@sitara360care.com",
  address: "Sri Sitara Hospital, Tanuku, West Godavari, Andhra Pradesh 534211",
  mapQuery: "Sri Sitara Hospital, Tanuku, Andhra Pradesh",
  hours: "Mon - Sat: 9:00 AM - 8:00 PM  |  Walk-ins welcome",
  highlights: {
    walkIn: "No appointment needed for your first visit",
    homeVisit: "Home visits available for senior patients",
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
  images: {
    hospital: "/images/hospital-exterior.png",
    clinic: "/images/clinic-interior.png",
    doctor: "/images/doctor-neelu.png",
  },
} as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.whatsappDefaultMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function telLink(phone?: string) {
  return `tel:${(phone ?? siteConfig.phone).replace(/[^+\d]/g, "")}`;
}

export function mapLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.mapQuery
  )}`;
}
