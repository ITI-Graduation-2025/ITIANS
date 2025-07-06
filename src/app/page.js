import TopRatedMentors from "@/components/componentts/TopRatedMentors";
import OurImpactSection from "@/components/componentts/OurImpactSection";
import JobSlider from "@/components/componentts/JobSlider";
import ContactUs from "@/components/componentts/ContactUs";
import TracksMarquee from "@/components/componentts/TracksMarquee";
import Footer from "@/components/componentts/Footer";
import QuoteSection from "@/components/componentts/QuoteSection";
import LandingSection from "@/components/componentts/LandingSection";
import AboutUsSection from "@/components/componentts/AboutUsSection";
import CompaniesTicker from "@/components/componentts/CompaniesTicker";
import Navbar from "@/components/componentts/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingSection />
      <JobSlider />
      <TopRatedMentors />
      <TracksMarquee />
      <AboutUsSection />
      <QuoteSection />
      <CompaniesTicker />
      <OurImpactSection />
      <ContactUs />
      <Footer />
    </>
  );
}
