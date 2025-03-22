import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RiMickeyLine } from 'react-icons/ri';
import { MdOutlineOndemandVideo, MdOutlineCampaign } from 'react-icons/md';
import { FaUserAlt, FaRegUserCircle, FaRegCalendarAlt } from 'react-icons/fa';
import { BiCalendarCheck } from 'react-icons/bi';
import { FiTarget } from 'react-icons/fi';
import { AiOutlineLineChart } from 'react-icons/ai';
import { BsGraphUp } from 'react-icons/bs';
import Sidebar from '@/components/layout/Sidebar';
import FeatureCard from '@/components/ui/FeatureCard';
import Image from 'next/image';
import OnboardingChecklist from '@/components/ui/OnboardingChecklist';

export default function Onboarding() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

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
      <aside>
        <Sidebar />
      </aside>

      <main className="flex-1 p-10 ml-64">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <section className="text-center mb-12">
            <div className="inline-block rounded-xl">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-center">Welcome to RedditScheduler</h1>
          </section>

          {/* Feature Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {featureCards.map((card, index) => (
              <FeatureCard 
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                iconColor={card.iconColor}
                iconBgColor={card.iconBgColor}
              />
            ))}
          </section>

          <section className="max-w-2xl mx-auto">
            <OnboardingChecklist />
          </section>
        </div>
      </main>
    </div>
  );
}