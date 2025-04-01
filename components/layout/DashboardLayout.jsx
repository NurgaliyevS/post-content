import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

function DashboardLayout({ children, loading }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { state } = useSidebar();

  if (state.loading) {
    return (
      <div className="flex min-h-screen bg-[#F3F4EF] items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-3 rounded-xl mb-3">
            <Image
              src="/logo.svg"
              alt="Reddit Scheduler Logo"
              width={32}
              height={32}
            />
          </div>
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
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
