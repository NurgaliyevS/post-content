import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BiCalendarCheck } from "react-icons/bi";
import { FiTarget } from "react-icons/fi";
import { AiOutlineLineChart } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import FeatureCard from "@/components/ui/FeatureCard";
import Image from "next/image";
import OnboardingChecklist from "@/components/ui/OnboardingChecklist";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

export default function Onboarding() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  const featureCards = [
    {
      icon: BiCalendarCheck,
      title: "Scheduling",
      description: "Publish when your target audience is most active",
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100",
      href: "/dashboard/scheduling",
    },
    {
      icon: FiTarget,
      title: "Cross-Posting",
      description: "Post to multiple subreddits with one click to get more impressions",
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100",
      href: "/dashboard/cross-posting",
    },
    {
      icon: AiOutlineLineChart,
      title: "Hook Generator",
      description: "Viral templates to maximize engagement on your posts",
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-100",
      href: "/dashboard/hook-generator",
    },
    {
      icon: BsGraphUp,
      title: "Analytics",
      description:
        "Track views, engagement rates, and comments across your posts (coming soon)",
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100",
      href: "/dashboard/analytics",
    },
  ];

  return (
    <DashboardLayout loading={loading}>
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

          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome to RedditScheduler
          </h1>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {featureCards.map((card, index) => (
            <Link href={card.href} key={index}>
              <FeatureCard {...card} />
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <OnboardingChecklist />
        </div>
      </div>
    </DashboardLayout>
  );
}
