import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, iconColor, iconBgColor }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex items-center justify-center w-10 h-10 ${iconBgColor} rounded-lg mb-4`}>
        <Icon className={`${iconColor} w-6 h-6`} />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}