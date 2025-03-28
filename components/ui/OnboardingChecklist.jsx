import React, { useEffect, useState } from 'react';
import { SiStripe } from 'react-icons/si';
import { FaArrowRight, FaReddit } from 'react-icons/fa';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import Link from 'next/link';

const OnboardingStep = ({ icon: Icon, title, time, completed, customIcon, actionButton }) => {
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-100 flex items-center mb-3 shadow-sm ${completed ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 rounded-full mr-4 flex-shrink-0">
        {customIcon ? customIcon : <Icon className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium text-gray-800">{title}</span>
            {time && <div className="text-xs text-gray-400">Estimated {time}</div>}
          </div>
          {completed ? (
            <span className="text-green-500">✓</span>
          ) : (
            actionButton
          )}
        </div>
      </div>
    </div>
  );
};

export default function OnboardingChecklist() {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [amountOfScheduledPosts, setAmountOfScheduledPosts] = useState(0);

  const steps = [
    {
        title: "Connect Reddit account", 
        time: "30 seconds",
        completed: true,
        iconComponent: FaReddit,
        actionButton: null
      },
    {
      title: "Subscription required",
      time: "2 minutes",
      completed: isSubscribed,
      customIcon: <SiStripe className="w-4 h-4" />,
      iconComponent: null,
      actionButton: (
        <Link href="/#pricing">
          <button className="btn btn-primary btn-sm">Upgrade now
            <FaArrowRight className='w-3 h-3' />
          </button>
        </Link>
      )
    },
    {
      title: "Schedule your first post",
      time: "2 minutes", 
      completed: amountOfScheduledPosts > 0,
      iconComponent: FaRegCalendarAlt,
      actionButton: (
        <Link href="/dashboard/scheduling">
          <button className="btn btn-primary btn-sm">Schedule Post
            <FaArrowRight className='w-3 h-3' />
          </button>
        </Link>
      )
    }
  ];

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getScheduledPosts();
  }, []);

  const getUser = async () => {
    const response = await fetch("/api/user/user");
    const userData = await response.json();
    setIsSubscribed(userData?.variant_name !== "free");
  };

  const getScheduledPosts = async () => {
    const response = await fetch("/api/post/get-post");
    const scheduledPosts = await response.json();
    if (scheduledPosts?.scheduledPosts?.length > 0) {
      setAmountOfScheduledPosts(scheduledPosts?.scheduledPosts?.length);
    }
  };

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <OnboardingStep
          key={index}
          icon={step.iconComponent}
          title={step.title}
          time={step.time}
          completed={step.completed}
          customIcon={step.customIcon}
          actionButton={step.actionButton}
        />
      ))}
    </div>
  );
}