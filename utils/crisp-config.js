// utils/crisp-config.js
const configureCrisp = (websiteId) => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;
  };
  
  export default configureCrisp;