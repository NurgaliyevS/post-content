import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { state } = useSidebar();

  if (state.loading) {
    return (
      <div className="flex min-h-screen bg-[#F3F4EF]">
        <aside className="md:w-64 flex-shrink-0">
          <div className="animate-pulse h-screen bg-gray-200" />
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-48 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F3F4EF]">
      <aside className="md:w-64 flex-shrink-0">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Mobile menu button */}
        <div className="md:hidden fixed left-4 bottom-4 z-50">
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
