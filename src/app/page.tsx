import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BodyComposition } from "@/components/BodyComposition";
import { DoctorVideo } from "@/components/DoctorVideo";
import { FirstVisit } from "@/components/FirstVisit";
import { Testimonials } from "@/components/Testimonials";
import { BookingSection } from "@/components/BookingSection";
import { Location } from "@/components/Location";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <BodyComposition />
      <DoctorVideo src="/videos/Siatara.mp4" />
      <About />
      <FirstVisit />
      <Testimonials />
      <BookingSection />
      <Location />
      <FAQ />
    </>
  );
}
