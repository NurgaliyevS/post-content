import ResultsSection from "./ResultsSection";
import CTAButton from "../CTAButton";
import { FiCalendar } from "react-icons/fi";
import { FaReddit } from "react-icons/fa";

export default function HeroSection() {
  const handleDemoBooking = () => {
    window.open("https://cal.com/sabyr-nurgaliyev/15min", "_blank");
  };

  return (
    <div className="text-center px-4 py-16 mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 text-sm font-medium shadow-sm bg-white border border-gray-200">
        <FaReddit className="w-4 h-4 text-[#FF4500]" />
        Perfect for marketing agencies, community managers and content creators
        on Reddit
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Schedule Reddit posts at the best time for your audience
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-8">
        Reddit Scheduler that will improve your impressions, upvotes and karma.
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

      <div className="flex justify-center mt-10 gap-4">
        <a
          href="https://www.uneed.best/tool/post-content?tab=rewards"
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:opacity-90 transition-opacity"
          title="Uneed Daily Winner"
        >
          <img
            src="/rewards/uneed-winner-monthly-winner.png"
            alt="Uneed Daily Winner Badge"
            className="w-32 md:w-40"
          />
        </a>
        <a
          href="https://www.tinystartups.com/launch/reddit-scheduler"
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
      </div>
      <ResultsSection />
    </div>
  );
}
