import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AlternativesSection from "@/components/sections/AlternativesSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PricingSection from "@/components/sections/PricingSection";

export default function Home() {
  return (
    <>
      <SEO />
      <div className="min-h-screen bg-[#F3F4EF]">
        <Navbar />
        <HeroSection />
        <AlternativesSection />
        <FeaturesSection />
        <PricingSection />
        <Footer />
      </div>
    </>
  );
}