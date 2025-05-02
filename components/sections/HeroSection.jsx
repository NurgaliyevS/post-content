import ResultsSection from "./ResultsSection";
import CTAButton from "../CTAButton";
import { FiCalendar } from "react-icons/fi";

export default function HeroSection() {
  const handleDemoBooking = () => {
    window.open("https://cal.com/sabyr-nurgaliyev/15min", "_blank");
  };

  return (
    <div className="text-center px-4 py-16 mx-auto">
      <div className="flex justify-center mb-6 gap-4">
        <a
          href="https://www.tinystartups.com/startups/post-content"
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:opacity-90 transition-opacity"
          title="1st place winner on Tiny Startups of the week"
        >
          <img
            src="/rewards/tinystartups-winner-weekly-winner.png"
            alt="Featured on Tiny Startups"
            className="w-32 md:w-48"
          />
        </a>
        <a
          href="https://www.uneed.best/tool/post-content?tab=rewards"
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:opacity-90 transition-opacity"
          title="Uneed Daily Winner"
        >
          <img
            src="/rewards/uneed-winner-daily-winner.png"
            alt="Uneed Daily Winner Badge"
            className="w-32 md:w-40"
          />
        </a>
      </div>
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
