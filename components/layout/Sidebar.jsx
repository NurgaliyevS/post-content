import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegUserCircle, FaRegCalendarAlt, FaUserAlt } from "react-icons/fa";
import { MdOutlineOndemandVideo, MdOutlineCampaign } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { RiMickeyLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { AiOutlineCreditCard } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const navItems = [
    { name: "AI UGC avatars", icon: FaUserAlt },
    { name: "AI UGC ads", icon: MdOutlineOndemandVideo },
    { name: "Greenscreen Memes", icon: RiMickeyLine },
    { name: "Videos", icon: MdOutlineOndemandVideo },
    { name: "Schedule", icon: FaRegCalendarAlt },
    { name: "Campaigns", icon: MdOutlineCampaign },
  ];

  const bottomNavItems = [
    { name: "Support", icon: BiSupport },
    { name: "Billing", icon: AiOutlineCreditCard },
    { name: "Settings", icon: FiSettings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <Link href="/">
            <span className="font-semibold text-gray-800">RedditScheduler</span>
          </Link>
        </div>
      </div>

      <div className="py-4 flex flex-col h-[calc(100%-64px)] justify-between">
        {/* Top Navigation */}
        <div>
          <div className="px-4 mb-6">
            <button className="flex items-center w-full px-4 py-2 text-white bg-blue-500 rounded-lg">
              <IoHomeOutline className="w-5 h-5 mr-3" />
              <span>Home</span>
            </button>
          </div>

          <nav className="space-y-1 px-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-2">
          {/* Bottom Navigation */}
          <div className="space-y-1">
            {bottomNavItems.map((item, index) => (
              <button
                key={index}
                className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Usage Meter */}
          <div className="mt-6 px-4">
            <div className="mb-1 flex justify-between">
              <span className="text-sm text-blue-600 font-medium">
                0 videos remaining
              </span>
            </div>
            <div className="text-xs text-gray-500">Resets in 2 days</div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className="bg-blue-600 h-1 rounded-full w-0"></div>
            </div>
          </div>

          {/* User Profile */}
          <div className="mt-6 p-4 flex items-center border-t border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              <FaRegUserCircle className="w-8 h-8 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
