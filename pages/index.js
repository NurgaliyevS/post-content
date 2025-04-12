import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AlternativesSection from "@/components/sections/AlternativesSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PricingSection from "@/components/sections/PricingSection";
import VideoSection from "@/components/sections/VideoSection";
export default function Home() {
  return (
    <>
      <SEO />
      <main className="min-h-screen bg-[#F3F4EF]">
        <div className="max-w-4xl mx-auto">
          <Navbar />
          <HeroSection />
          <AlternativesSection />
          <FeaturesSection />
          <PricingSection />
          <VideoSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
