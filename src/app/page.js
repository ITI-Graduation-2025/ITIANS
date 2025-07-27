import TopRatedMentors from "@/components/componentts/TopRatedMentors";
import OurImpactSection from "@/components/componentts/OurImpactSection";
import JobSlider from "@/components/componentts/JobSlider";
import ContactUs from "@/components/componentts/ContactUs";
import TracksMarquee from "@/components/componentts/TracksMarquee";
import QuoteSection from "@/components/componentts/QuoteSection";
import LandingSection from "@/components/componentts/LandingSection";
import AboutUsSection from "@/components/componentts/AboutUsSection";
import CompaniesTicker from "@/components/componentts/CompaniesTicker";
import Link from "next/link";
import { BsChatDots } from "react-icons/bs";

export default function Home() {
  return (
    <>
      <LandingSection />
      <section id="jobs">
        <JobSlider />
      </section>
      <section id="mentors">
        <TopRatedMentors />
      </section>
      <TracksMarquee />
      <section id="about">
        <AboutUsSection />
      </section>
      <QuoteSection />
      <CompaniesTicker />
      <OurImpactSection />
      <section id="contact">
        <ContactUs />
      </section>
    </>
  );
}
