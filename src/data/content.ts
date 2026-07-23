import type { LucideIcon } from "lucide-react";
import {
  Droplet,
  HeartPulse,
  Scale,
  Activity,
  UserRound,
  Venus,
  Pill,
  FileText,
  ClipboardList,
  Clock,
  Stethoscope,
  ShieldCheck,
  Home,
} from "lucide-react";

export type Condition = {
  name: string;
  icon: LucideIcon;
  description: string;
};

export const conditions: Condition[] = [
  { name: "Diabetes & Prediabetes", icon: Droplet, description: "Root-cause diabetes care that explains your numbers and helps you feel better, not just look controlled on paper." },
  { name: "Hypertension", icon: HeartPulse, description: "Blood pressure management tailored to your body, lifestyle and other conditions." },
  { name: "Obesity & Metabolic Health", icon: Scale, description: "Investigating insulin resistance and hormones behind stubborn weight gain." },
  { name: "Thyroid & Fatty Liver", icon: Activity, description: "Careful evaluation of thyroid and liver issues that are often missed elsewhere." },
  { name: "Senior & Geriatric Care", icon: UserRound, description: "Unhurried, respectful care for older adults, with home visits when travel is hard." },
  { name: "PCOS & Hormonal Health", icon: Venus, description: "Whole-person care for PCOS and hormonal imbalance that goes beyond symptoms." },
];

export type CareModel = {
  key: string;
  title: string;
  icon: LucideIcon;
  description: string;
  points: string[];
};

export const careModels: CareModel[] = [
  {
    key: "metabolic",
    title: "Metabolic Health",
    icon: Scale,
    description: "For diabetes, weight, insulin resistance, thyroid and PCOS.",
    points: [
      "Detailed metabolic assessment",
      "Personalised nutrition & lifestyle plan",
      "Regular tracking and honest reviews",
    ],
  },
  {
    key: "chronic",
    title: "Chronic Disease Care",
    icon: HeartPulse,
    description: "For blood pressure, heart risk, fatty liver and long-term conditions.",
    points: [
      "Evidence-based medication review",
      "Understanding the 'why' behind your numbers",
      "Preventing complications early",
    ],
  },
  {
    key: "senior",
    title: "Senior Care",
    icon: Home,
    description: "For older adults who need patient, dignified, whole-person care.",
    points: [
      "Longer, unhurried consultations",
      "Home visits for those who can't travel",
      "Family-friendly, clear guidance",
    ],
  },
];

export type FirstVisitStep = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

export const firstVisit: FirstVisitStep[] = [
  { title: "Bring your current medicines", detail: "Any tablets you already take — a photo of the strip is perfectly fine.", icon: Pill },
  { title: "Old reports help (not required)", detail: "Blood tests, scans or discharge summaries. Even partial records are useful.", icon: FileText },
  { title: "Note your main concerns", detail: "When did it start? What makes it worse? Writing it down saves time.", icon: ClipboardList },
  { title: "Set aside 30-45 minutes", detail: "First visits are unhurried. Try not to schedule anything right after.", icon: Clock },
];

export type WhyPoint = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

export const whyPoints: WhyPoint[] = [
  { title: "Globally trained", detail: "MRCP-UK from the Royal Colleges, London — rarely found in rural Andhra Pradesh.", icon: ShieldCheck },
  { title: "Root-cause approach", detail: "We look for why you're unwell, not just which number to lower.", icon: Stethoscope },
  { title: "Time to listen", detail: "Longer consultations so nothing important gets missed.", icon: Clock },
  { title: "Care at home", detail: "Home visits available for seniors and those who cannot travel easily.", icon: Home },
];

export type Testimonial = {
  name: string;
  meta: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Patient, Tanuku",
    meta: "Type 2 Diabetes · 54 years",
    text: "I was told my sugar was controlled for years, yet I still felt tired. This was the first time a doctor sat with me and explained what my reports actually meant. A few months on, I genuinely feel different.",
  },
  {
    name: "Family of patient, Tanuku",
    meta: "Home Visit · Senior Care",
    text: "My mother is elderly and cannot travel easily. The doctor came home, spent almost an hour, and gave her a plan she could actually follow. Calm, patient and caring.",
  },
  {
    name: "Patient, Tanuku",
    meta: "Metabolic Health · 38 years",
    text: "I had been gaining weight for years and kept being told to just eat less. Here they found the insulin resistance and thyroid issue behind it. Finally I have real answers.",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Do I need an appointment for my first visit?",
    answer:
      "No. Walk-ins are welcome for your first visit — just come when you're ready. If you prefer a fixed time, you can book a consultation online or on WhatsApp.",
  },
  {
    question: "What should I bring to my consultation?",
    answer:
      "Bring any medicines you currently take (a photo of the strip is fine) and any recent reports if you have them. Old reports help but are not required.",
  },
  {
    question: "Do you offer home visits?",
    answer:
      "Yes. Home visits are available for senior patients and those who find it difficult to travel. Please share the patient's details on WhatsApp so we can arrange a suitable time.",
  },
  {
    question: "Which conditions does Dr. Neelu treat?",
    answer:
      "Diabetes and prediabetes, hypertension, obesity and metabolic health, thyroid and fatty liver, PCOS and hormonal health, and senior/geriatric care.",
  },
  {
    question: "How long does a first consultation take?",
    answer:
      "First visits are unhurried and usually take 30 to 45 minutes so we can understand your full history and answer your questions properly.",
  },
];
