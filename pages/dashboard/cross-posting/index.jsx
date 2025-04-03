import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/components/withAuth";
import { FiArrowRight, FiCalendar, FiCheck } from "react-icons/fi";
import { FaUsers, FaCheckCircle, FaSpinner, FaCalendar } from "react-icons/fa";
import axios from "axios";
import { format, parse, setHours, setMinutes } from "date-fns";

function CrossPosting() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [subreddits, setSubreddits] = useState([]);
  const [subredditsLoading, setSubredditsLoading] = useState(false);
  const [subredditsError, setSubredditsError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [formData, setFormData] = useState({
    selectedDate: format(new Date(), "yyyy-MM-dd"),
    selectedTime: format(new Date(), "HH:mm"),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [saveStatus, setSaveStatus] = useState("");
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchUserSubreddits();
  }, []);

  const fetchUserSubreddits = async () => {
    try {
      setSubredditsLoading(true);
      setSubredditsError(null);

      const response = await fetch("/api/reddit/subreddits");

      if (!response.ok) {
        throw new Error(`Failed to fetch subreddits: ${response.status}`);
      }

      const data = await response.json();
      setSubreddits(data.subreddits || []);
    } catch (error) {
      console.error("Error fetching subreddits:", error);
      setSubredditsError(error.message);
    } finally {
      setSubredditsLoading(false);
    }
  };

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

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostSelect = (post) => {
    setSelectedPost(post);
  };

  const handleSubredditSelect = (subreddit) => {
    setSelectedSubreddits((prev) => {
      if (prev.find((s) => s.id === subreddit.id)) {
        return prev.filter((s) => s.id !== subreddit.id);
      }
      return [...prev, subreddit];
    });
  };

  const handleSelectAll = () => {
    if (selectedSubreddits.length === subreddits.length) {
      setSelectedSubreddits([]);
    } else {
      setSelectedSubreddits([...subreddits]);
    }
  };

  const schedulePost = async () => {
    if (
      !selectedPost ||
      !formData.selectedDate ||
      !formData.selectedTime ||
      selectedSubreddits.length === 0
    ) {
      setSaveStatus(
        "Please select a post, target subreddits, and schedule time"
      );
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
  
    setIsLoadingForm(true);
    try {
      const scheduledDate = parse(
        formData.selectedDate,
        "yyyy-MM-dd",
        new Date()
      );
      const [hours, minutes] = formData.selectedTime.split(":");
  
      let scheduledDateTime = setHours(scheduledDate, parseInt(hours, 10));
      scheduledDateTime = setMinutes(scheduledDateTime, parseInt(minutes, 10));
  
      const scheduledDateTimeISO = format(
        scheduledDateTime,
        "yyyy-MM-dd'T'HH:mm:ssxxx"
      );
      const currentTimeISO = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");
  
      const promises = selectedSubreddits.map((subreddit) => 
        axios.post("/api/post/schedule-post", {
          community: subreddit.display_name_prefixed,
          title: selectedPost.title,
          text: selectedPost.text,
          scheduledDateTime: scheduledDateTimeISO,
          timeZone: formData.timeZone,
          type: selectedPost.type,
          currentClientTime: currentTimeISO,
          isCrossPosting: true,
        })
      );
  
      // Use Promise.allSettled to handle all promises even if some fail
      const results = await Promise.allSettled(promises);
      
      // Check if any promises succeeded
      const anySucceeded = results.some(result => result.status === 'fulfilled');
      
      if (anySucceeded) {
        setSaveStatus("Posts scheduled successfully!");
        setSelectedPost(null);
        setSelectedSubreddits([]);
      } else {
        // All promises failed
        setSaveStatus("Failed to schedule any posts. Please try again.");
      }
      
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error scheduling post:", error);
      setSaveStatus("Error scheduling post. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Cross-Posting</h1>

        {saveStatus && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {saveStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
            <h2 className="text-lg font-semibold">Source Post</h2>

            <div className="space-y-3 mt-4 flex-grow overflow-y-auto h-[500px]">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedPost?._id === post._id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => handlePostSelect(post)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FaUsers className="w-3 h-3" />
                        r/{post.community}
                      </div>
                      <h3 className="font-medium">{post.title}</h3>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status === "published" ? (
                        <FaCheckCircle className="w-3 h-3" />
                      ) : (
                        <FaSpinner className="w-3 h-3" />
                      )}
                      {post.status}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-2 pt-2 w-full">
                    <span className="text-gray-500 text-sm flex gap-2 items-center">
                      <FaCalendar className="w-3 h-3" />
                      {format(new Date(post.scheduledFor), "MM/dd/yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4">Target Subreddits</h2>
              <button
                className="text-sm text-blue-600"
                onClick={handleSelectAll}
              >
                {selectedSubreddits.length === subreddits.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="h-60 overflow-y-auto space-y-2 border rounded-md p-2">
              {subredditsLoading ? (
                <div className="text-center p-4 text-gray-500">Loading...</div>
              ) : subredditsError ? (
                <div className="text-center p-4 text-red-500">
                  {subredditsError}
                  <button
                    onClick={fetchUserSubreddits}
                    className="text-blue-600 hover:underline block mt-2"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                subreddits.map((subreddit) => (
                  <div
                    key={subreddit.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      id={subreddit.id}
                      className="mr-2"
                      checked={selectedSubreddits.some(
                        (s) => s.id === subreddit.id
                      )}
                      onChange={() => handleSubredditSelect(subreddit)}
                    />
                    <label htmlFor={subreddit.id} className="flex-grow">
                      {subreddit.display_name_prefixed}
                    </label>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {subreddit.subscribers.toLocaleString()}
                      <FaUsers className="w-3 h-3" />
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="selectedDate"
                      value={formData.selectedDate}
                      onChange={handleDateTimeChange}
                      min={format(new Date(), "yyyy-MM-dd")}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="selectedTime"
                      value={formData.selectedTime}
                      onChange={handleDateTimeChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                  onClick={schedulePost}
                  disabled={
                    !selectedPost ||
                    !formData.selectedDate ||
                    !formData.selectedTime ||
                    selectedSubreddits.length === 0 ||
                    isLoadingForm
                  }
                >
                  {isLoadingForm ? "Scheduling..." : "Schedule Cross-Posts"}
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(CrossPosting);
