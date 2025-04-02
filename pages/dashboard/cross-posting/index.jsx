import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/components/withAuth";
import { FiArrowRight, FiCalendar, FiCheck } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";

function CrossPosting() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/post/get-post");
      if (response?.status === 200 && response?.data?.scheduledPosts) {
        setPosts(response?.data?.scheduledPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Cross-Posting
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Source Post</h2>

            <div className="space-y-3 mt-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FaUsers className="w-3 h-3" />
                        r/{post.community} • {format(new Date(post.scheduledFor), "MM/dd/yyyy")}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Target Subreddits</h2>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Select Target Subreddits
                </label>
                <button className="text-sm text-blue-600">Select All</button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" id="sub1" className="mr-2" />
                  <label htmlFor="sub1" className="flex-grow">
                    r/SideProject
                  </label>
                  <span className="text-xs text-gray-500">12.5k members</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" id="sub2" className="mr-2" />
                  <label htmlFor="sub2" className="flex-grow">
                    r/startups
                  </label>
                  <span className="text-xs text-gray-500">1.2M members</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" id="sub3" className="mr-2" />
                  <label htmlFor="sub3" className="flex-grow">
                    r/Entrepreneur
                  </label>
                  <span className="text-xs text-gray-500">987k members</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" id="sub4" className="mr-2" />
                  <label htmlFor="sub4" className="flex-grow">
                    r/webdev
                  </label>
                  <span className="text-xs text-gray-500">756k members</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" id="sub5" className="mr-2" />
                  <label htmlFor="sub5" className="flex-grow">
                    r/programming
                  </label>
                  <span className="text-xs text-gray-500">5.4M members</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-medium mb-3">Scheduling Options</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      defaultValue="2025-04-02"
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full p-2 border rounded-md"
                      defaultValue="15:30"
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Posting Interval (minutes)
                </label>
                <select className="w-full p-2 border rounded-md">
                  <option>Post all at once</option>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>60 minutes</option>
                  <option>Custom</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                  Schedule Cross-Posts
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Cross-Posting History</h2>
            <select className="p-2 border rounded-md text-sm">
              <option>All Status</option>
              <option>Scheduled</option>
              <option>Published</option>
              <option>Failed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Original Post
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Cross-Posted To
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Schedule
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">
                    <div className="font-medium">
                      A tool that schedule your posts on Reddit
                    </div>
                    <div className="text-sm text-gray-500">r/microsaas</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        r/SideProject
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        r/startups
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        +2 more
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-1" />
                      <span>04/03/2025 10:15</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Scheduled
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm ml-3">
                      Cancel
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">
                    <div className="font-medium">Test post</div>
                    <div className="text-sm text-gray-500">r/test</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        r/webdev
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <FiCheck className="text-green-500 mr-1" />
                      <span>04/01/2025 22:10</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Published
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(CrossPosting);
