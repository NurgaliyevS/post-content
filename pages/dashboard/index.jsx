import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RiMickeyLine } from 'react-icons/ri';
import { MdOutlineOndemandVideo, MdOutlineCampaign } from 'react-icons/md';
import { FaUserAlt, FaRegUserCircle } from 'react-icons/fa';
import Sidebar from '@/components/layout/Sidebar';
import FeatureCard from '@/components/ui/FeatureCard';
import Image from 'next/image';
export default function Dashboard() {
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
      icon: MdOutlineOndemandVideo,
      title: "Create UGC videos",
      description: "Create & publish UGC videos promoting your product demo",
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100"
    },
    {
      icon: RiMickeyLine,
      title: "Create Greenscreen Meme videos",
      description: "Create relatable meme videos about your product / business",
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100"
    },
    {
      icon: FaUserAlt,
      title: "UGC Avatar Generator",
      description: "Create custom AI avatars for the UGC \"hook + demo\" video format",
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-100"
    },
    {
      icon: MdOutlineCampaign,
      title: "Hook Generator",
      description: "Auto-magically generate and save viral hooks for your videos",
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-block rounded-xl">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </div>
            <h1 className="text-2xl font-bold">Welcome to RedditScheduler</h1>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
          </div>

          {/* Onboarding Steps */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-500 rounded-full mr-2">
                S
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">Subscription required</span>
                  <span className="text-green-500">✓</span>
                </div>
                <span className="text-sm text-gray-500">Estimated 2-3 minutes</span>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 rounded-full mr-2">
                <MdOutlineOndemandVideo className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">Connect TikTok account</span>
                  <span className="text-green-500">✓</span>
                </div>
                <span className="text-sm text-gray-500">Estimated 30 seconds</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 rounded-full mr-2">
                <FaRegUserCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">Add your first product</span>
                  <span className="text-green-500">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}