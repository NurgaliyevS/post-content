import ResultsSection from "./ResultsSection";
import CTAButton from "../CTAButton";
import VideoModal from '../VideoModal';
import { FiPlay } from "react-icons/fi";

export default function HeroSection() {
  const openVideoModal = () => {
    const modal = document.getElementById('video_modal');
    modal.showModal();
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
      <div className="flex justify-center gap-4">
        <CTAButton className="btn btn-primary" />
        <button 
          onClick={openVideoModal} 
          className="btn btn-secondary"
        >
          <FiPlay className="w-4 h-4" /> Demo
        </button>
      </div>
      <ResultsSection />
      <VideoModal />
    </div>
  );
}