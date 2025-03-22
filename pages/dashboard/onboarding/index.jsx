import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BiCalendarCheck, BiSupport } from 'react-icons/bi';
import { FiTarget } from 'react-icons/fi';
import { AiOutlineLineChart } from 'react-icons/ai';
import { BsGraphUp } from 'react-icons/bs';
import { HiMenu } from 'react-icons/hi';
import Sidebar from '@/components/layout/Sidebar';
import FeatureCard from '@/components/ui/FeatureCard';
import Image from 'next/image';
import OnboardingChecklist from '@/components/ui/OnboardingChecklist';
import { RiMickeyLine } from 'react-icons/ri';

export default function Onboarding() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-3 bg-black rounded-xl mb-3">
            <RiMickeyLine className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-xl font-bold">Loading dashboard...</h1>
        </div>
      </div>
    );
  }

  const featureCards = [
    {
      icon: BiCalendarCheck,
      title: "Scheduling",
      description: "Publish when your target audience is most active",
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100"
    },
    {
      icon: FiTarget,
      title: "Cross-Posting",
      description: "Post to multiple subreddits with one click",
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100"
    },
    {
      icon: AiOutlineLineChart,
      title: "Hook Generator",
      description: "Viral templates for your Reddit posts",
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-100"
    },
    {
      icon: BsGraphUp,
      title: "Analytics",
      description: "Track views, engagement rates, and comments across all your posts",
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100"
    }
  ];

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
              setShowSidebar((showSidebar) => !showSidebar)
            }}
            className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <div className="rounded-lg flex items-center justify-center">
                <Image 
                  src="/logo.svg" 
                  alt="Reddit Icon" 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome to RedditScheduler</h1>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {featureCards.map((card, index) => (
              <FeatureCard key={index} {...card} />
            ))}
          </div>

          <div className="mt-8">
            <OnboardingChecklist />
          </div>
        </div>
      </main>
    </div>
  );
}
