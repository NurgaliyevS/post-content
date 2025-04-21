import ResultsSection from "./ResultsSection";
import CTAButton from "../CTAButton";
import { FiCalendar } from "react-icons/fi";

export default function HeroSection() {
  const handleDemoBooking = () => {
    window.open('https://cal.com/sabyr-nurgaliyev/15min', '_blank');
  };

  return (
    <div className="text-center px-4 py-16 mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Double Reddit Results 
        <br />
        While You Sleep
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Schedule Reddit posts that drive traffic to your website
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <CTAButton className="btn btn-primary btn-wide md:w-48" />
        <button 
          onClick={handleDemoBooking}
          className="btn btn-secondary btn-wide md:w-48"
        >
          <FiCalendar className="w-4 h-4" /> Book a demo call
        </button>
      </div>
      <ResultsSection />
    </div>
  );
}