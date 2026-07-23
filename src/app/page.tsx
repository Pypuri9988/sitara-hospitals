import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Conditions } from "@/components/Conditions";
import { CareModel } from "@/components/CareModel";
import { FirstVisit } from "@/components/FirstVisit";
import { Testimonials } from "@/components/Testimonials";
import { BookingSection } from "@/components/BookingSection";
import { Location } from "@/components/Location";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Conditions />
      <CareModel />
      <FirstVisit />
      <Testimonials />
      <BookingSection />
      <Location />
      <FAQ />
    </>
  );
}
