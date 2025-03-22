import React from 'react';
import { TbCurrencyDollar } from 'react-icons/tb';
import { FaRegUserCircle, FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlineCampaign } from 'react-icons/md';

const OnboardingStep = ({ icon: Icon, title, time, completed, customIcon }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 flex items-center mb-3 shadow-sm">
      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 rounded-full mr-4 flex-shrink-0">
        {customIcon ? customIcon : <Icon className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">{title}</span>
          <span className={completed ? "text-green-500" : "text-gray-400"}>
            {completed ? "✓" : "Pending"}
          </span>
        </div>
        {time && <span className="text-xs text-gray-400">Estimated {time}</span>}
      </div>
    </div>
  );
};

export default function OnboardingChecklist() {
  const steps = [
    {
      title: "Subscription required",
      time: "2-3 minutes",
      completed: true,
      customIcon: <TbCurrencyDollar className="w-4 h-4" />,
      iconComponent: null
    },
    {
      title: "Connect Reddit account",
      time: "30 seconds",
      completed: true,
      iconComponent: FaRegUserCircle
    },
    {
      title: "Schedule your first post",
      time: "2 minutes",
      completed: false,
      iconComponent: FaRegCalendarAlt
    },
    {
      title: "Create your first campaign",
      time: "5 minutes",
      completed: false,
      iconComponent: MdOutlineCampaign
    }
  ];

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
        />
      ))}
    </div>
  );
}