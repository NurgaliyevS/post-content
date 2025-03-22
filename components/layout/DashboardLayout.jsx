import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import Sidebar from "@/components/layout/Sidebar";
import { RiMickeyLine } from "react-icons/ri";

function DashboardLayout({ children, loading }) {
  const [showSidebar, setShowSidebar] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-3 bg-black rounded-xl mb-3">
            <RiMickeyLine className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="md:w-64 flex-shrink-0">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Mobile menu button */}
        <div className="md:hidden fixed right-4 bottom-4 z-50">
          <button
            onClick={() => {
              setShowSidebar((showSidebar) => !showSidebar);
            }}
            className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;