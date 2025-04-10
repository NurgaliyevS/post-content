import ResultsSection from "./ResultsSection";
import VideoModal from '../VideoModal';
import { FiPlay, FiCalendar } from "react-icons/fi";

export default function HeroSection() {
  const openVideoModal = () => {
    const modal = document.getElementById('video_modal');
    modal.showModal();
  };

  const handleDemoBooking = () => {
    // TODO: Implement demo booking functionality
    window.open('https://cal.com/sabyr-nurgaliyev/15min', '_blank');
  };

  return (
    <div className="text-center px-4 py-16 mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Schedule Reddit posts that drive
        <br />
        traffic to your website
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Turn Reddit into your traffic machine without the headache
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <button 
          onClick={handleDemoBooking}
          className="btn btn-primary btn-wide md:w-48"
        >
          <FiCalendar className="w-4 h-4" /> Book a demo call
        </button>
        <button 
          onClick={openVideoModal} 
          className="btn btn-secondary btn-wide md:w-48"
        >
          <FiPlay className="w-4 h-4" /> Watch how it works
        </button>
      </div>
      <ResultsSection />
      <VideoModal />
    </div>
  );
}