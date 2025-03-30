import { useEffect } from "react";

const CrispChat = ({ websiteId }) => {
  console.log("websiteId", websiteId);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined" && websiteId) {
      // Initialize Crisp
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = websiteId;
      
      // Load Crisp script
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== "undefined" && window.$crisp) {
        document.querySelector('script[src="https://client.crisp.chat/l.js"]')?.remove();
        delete window.$crisp;
        delete window.CRISP_WEBSITE_ID;
      }
    };
  }, [websiteId]);

  return null; // This component doesn't render anything
};

export default CrispChat;