import React from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Onboarding() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Complete your setup</h2>
        
        <div className="space-y-5">
          {/* Step 1 */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full mr-4 flex-shrink-0">
              <span className="font-medium">S</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Subscription required</h3>
                  <p className="text-sm text-gray-500">Estimated 2-3 minutes</p>
                </div>
                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                  ✓
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="ml-4 pl-4 border-l-2 border-gray-200 h-6"></div>

          {/* Step 2 */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full mr-4 flex-shrink-0">
              <MdOutlineOndemandVideo className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Connect TikTok account</h3>
                  <p className="text-sm text-gray-500">Estimated 30 seconds</p>
                </div>
                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                  ✓
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="ml-4 pl-4 border-l-2 border-gray-200 h-6"></div>

          {/* Step 3 */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full mr-4 flex-shrink-0">
              <FaRegUserCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Add your first product</h3>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}