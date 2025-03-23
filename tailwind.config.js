import daisyui from "daisyui";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'pill': '9999px',
      },
      button: {
        base: 'py-3 px-6 font-medium rounded-pill flex items-center transition-colors duration-200',
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-white hover:bg-gray-100 text-gray-800 shadow-sm',
      }
    }
  },
  plugins: [
    daisyui,
    function({ addComponents }) {
      addComponents({
        '.btn': {
          borderRadius: '9999px', 
          display: 'flex',
          alignItems: 'center',
          fontWeight: '500',
          transition: 'all 200ms ease',
          justifyContent: 'center',
          textAlign: 'center',
        },
        '.btn-primary': {
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: '#3367D6',
          },
        },
        '.btn-secondary': {
          backgroundColor: 'white',
          color: '#333333',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          border: 'none',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      })
    }
  ],
  daisyui: {
    themes: true
  },
};