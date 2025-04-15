import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BiCalendarCheck } from "react-icons/bi";
import { FiTarget } from "react-icons/fi";
import FeatureCard from "@/components/ui/FeatureCard";
import Image from "next/image";
import OnboardingChecklist from "@/components/ui/OnboardingChecklist";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import withAuth from "@/components/withAuth";

function Onboarding() {
  const { data: session, status } = useSession();

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
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto min-h-screen pb-20">
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
            Welcome to Post Content
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

export default withAuth(Onboarding);