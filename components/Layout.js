import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function Layout({ children }) {

  return (
    <div className="min-h-screen bg-[#F3F4EF]">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
