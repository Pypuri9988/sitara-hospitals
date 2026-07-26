export const siteConfig = {
  name: "Sitara360 Care",
  shortName: "Sitara360",
  hospitalName: "Sri Sitara 360 Care",
  // Physical premises name shown next to location/map pins (Google-registered).
  locationName: "Sri Sitara Hospital",
  tagline: "Medicine that treats you — not just your numbers",
  location: "Tanuku, Andhra Pradesh",
  doctor: {
    name: "Dr. Neelu Mahendra Sunkavalli",
    title: "Consultant Physician, Internal Medicine",
    credentials: [
      { label: "MD", detail: "Internal Medicine" },
      { label: "MRCP-UK", detail: "Royal Colleges, London" },
      { label: "FGID", detail: "CMC - Vellore" },
      { label: "10+ Years", detail: "Clinical Practice" },
    ],
    photo: "/images/doctor-sitara360.png",
  },
  description:
    "Sri Sitara Hospital Tanuku offers globally trained, evidence-based, personalized medicine for diabetes, obesity, blood pressure, thyroid and healthy aging.",
  // Update these with your real numbers.
  phone: "+91 87121 26799",
  // WhatsApp business number in international format WITHOUT + or spaces.
  whatsappNumber: "918712126799",
  whatsappDefaultMessage:
    "Hello Sitara360 Care, I would like to book a consultation with Dr. Neelu Mahendra.",
  email: "askdoctor247@gmail.com",
  address: "Sri Sitara Hospital, Tanuku, West Godavari, Andhra Pradesh 534211",
  // Keep the map search on the Google-registered hospital name so the pin resolves.
  mapQuery: "Sri Sitara Hospital, Tanuku, Andhra Pradesh",
  hours: "Mon - Sat: 9:00 AM - 8:00 PM  |  Walk-ins welcome",
  highlights: {
    walkIn: "No appointment needed for your first visit",
    homeVisit: "Home visits available for senior patients",
  },
  social: {
    instagram: "https://www.instagram.com/sitara_hospitals",
    linkedin:
      "https://www.linkedin.com/in/dr-neelu-mahendra-sunkavalli-68417b194",
  },
  images: {
    hospital: "/images/hospital-exterior.png",
    clinic: "/images/clinic-interior.png",
    doctor: "/images/doctor-sitara360.png",
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
