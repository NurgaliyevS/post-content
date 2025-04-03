import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/components/withAuth";
import { FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import { FaUsers, FaCheckCircle, FaSpinner, FaCalendar, FaClock } from "react-icons/fa";
import axios from "axios";
import { format, parse, setHours, setMinutes } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

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
    postingInterval: { value: 0, label: "Post all at once" }
  });
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Posting interval options
  const intervalOptions = [
    { value: 0, label: "Post all at once" },
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "60 minutes" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
    { value: 480, label: "8 hours" },
    { value: 720, label: "12 hours" },
    { value: 1440, label: "24 hours" },
    { value: 2880, label: "48 hours" },
    { value: 4320, label: "72 hours" },
    { value: 5760, label: "96 hours" },
    { value: 7200, label: "120 hours" },
    { value: 8640, label: "144 hours" },
    { value: 10080, label: "168 hours" },
    
  ];

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

  const handleIntervalChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      postingInterval: selectedOption,
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

  // Toast notification components
  const SuccessToast = ({ successful }) => {
    return (
      <div className="flex flex-col">
        <div className="space-y-1">
          <div className="flex flex-col gap-2">
            <span>Successfully scheduled for: </span>
            {successful.map((item, index) => (
              <div className="flex items-center gap-2" key={`success-${index}`}>
                <div className="text-green-600 bg-green-100 rounded-full p-0.5">
                  <FiCheck className="w-4 h-4" />
                </div>
                <span>{item.subreddit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const WarningToast = ({ successful, failed }) => (
    <div className="flex flex-col">
      <div className="space-y-1">
        <div className="flex flex-col gap-2">
          <span>Successfully scheduled for: </span>
          {successful.map((item, index) => (
            <div className="flex items-center gap-2" key={`success-${index}`}>
              <div className="text-green-600 bg-green-100 rounded-full p-0.5">
                <FiCheck className="w-4 h-4" />
              </div>
              <span>{item.subreddit}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t pt-2">
          <span>Failed to schedule for: </span>
          {failed.map((item, index) => (
            <div key={`failed-${index}`} className="flex items-center gap-2">
              <div className="text-red-600 bg-red-100 rounded-full p-0.5">
                <FiX className="w-4 h-4" />
              </div>
              <span>
                {item.subreddit} - ({item.reason})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ErrorToast = ({ failed }) => (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 font-medium">
        <span>Failed to schedule for: </span>
      </div>
      <div className="space-y-1">
        {failed.map((item, index) => (
          <div key={`failed-${index}`} className="flex items-center gap-2">
            <div className="text-red-600 bg-red-100 rounded-full p-0.5">
              <FiX className="w-4 h-4" />
            </div>
            <span>
              {item.subreddit} - ({item.reason})
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const showNotification = (type, results) => {
    const { successful, failed } = results;

    switch (type) {
      case "success":
        toast.success(<SuccessToast successful={successful} />, {
          autoClose: 10000,
          closeButton: true,
          className: "bg-green-50 border-l-4 border-green-500",
        });
        break;
      case "warning":
        toast.warning(
          <WarningToast successful={successful} failed={failed} />,
          {
            autoClose: 10000,
            closeButton: true,
            className: "bg-amber-50 border-l-4 border-amber-500",
          }
        );
        break;
      case "error":
        toast.error(<ErrorToast failed={failed} />, {
          autoClose: 10000,
          closeButton: true,
          className: "bg-red-50 border-l-4 border-red-500",
        });
        break;
      default:
        break;
    }
  };

  const schedulePost = async () => {
    if (
      !selectedPost ||
      !formData.selectedDate ||
      !formData.selectedTime ||
      selectedSubreddits.length === 0
    ) {
      showNotification("error", {
        successful: [],
        failed: [{ subreddit: "All", reason: "Missing required information" }],
        total: selectedSubreddits.length,
      });
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

      const promises = selectedSubreddits.map((subreddit, index) => {
        // Add interval time if not posting all at once
        let postTime = new Date(scheduledDateTime);
        if (formData.postingInterval.value > 0) {
          postTime.setMinutes(
            postTime.getMinutes() + index * formData.postingInterval.value
          );
        }
        
        const postTimeISO = format(postTime, "yyyy-MM-dd'T'HH:mm:ssxxx");
        
        return axios
          .post("/api/post/schedule-post", {
            community: subreddit.display_name_prefixed,
            title: selectedPost.title,
            text: selectedPost.text,
            scheduledDateTime: postTimeISO,
            timeZone: formData.timeZone,
            type: selectedPost.type,
            currentClientTime: currentTimeISO,
            isCrossPosting: true,
          })
          .then((response) => ({
            status: "fulfilled",
            subreddit: subreddit.display_name_prefixed,
            value: response,
          }))
          .catch((error) => ({
            status: "rejected",
            subreddit: subreddit.display_name_prefixed,
            reason: error.response?.data?.message || "Unknown error",
          }));
      });

      // Handle all promises
      const results = await Promise.allSettled(promises);

      console.log(results, "results");

      const successful = results
        .filter((result) => result.value.status === "fulfilled")
        .map((result) => ({ subreddit: result.value.subreddit }));

      const failed = results
        .filter((result) => result.value.status === "rejected")
        .map((result) => ({
          subreddit: result.value.subreddit,
          reason:
            result.value?.reason === "Unknown error"
              ? "Unknown error"
              : result.value?.reason.includes("karma")
                ? "karma requirement not met"
                : result.value?.reason.includes("7 days")
                  ? "already posted within 7 days"
                  : result.value?.reason,
        }));

      const postingResults = {
        successful,
        failed,
        total: selectedSubreddits.length,
      };

      console.log(postingResults, "postingResults");

      // Determine notification type based on results
      if (successful.length === 0) {
        // All posts failed
        showNotification("error", postingResults);
      } else if (failed.length === 0) {
        // All posts succeeded
        showNotification("success", postingResults);
        // Reset selection after complete success
        setSelectedPost(null);
        setSelectedSubreddits([]);
      } else {
        // Mixed results - some succeeded, some failed
        showNotification("warning", postingResults);
        // Keep selections for potential retry
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
      showNotification("error", {
        successful: [],
        failed: [
          { subreddit: "All", reason: "Server error. Please try again." },
        ],
        total: selectedSubreddits.length,
      });
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Cross-Posting</h1>

        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          newestOnTop
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          icon={false}
        />

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
              
              {/* Posting Interval Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  Posting Interval (minutes)
                </label>
                <div className="relative">
                  <Select
                    options={intervalOptions}
                    value={formData.postingInterval}
                    onChange={handleIntervalChange}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isSearchable={false}
                    placeholder="Select interval..."
                  />
                  {formData.postingInterval.value > 0 && selectedSubreddits.length > 1 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Posts will be scheduled {formData.postingInterval.value} minutes apart. 
                      Total duration: {(selectedSubreddits.length - 1) * formData.postingInterval.value} minutes.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="btn btn-primary px-4 py-2 rounded-md flex items-center"
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
                  <FiArrowRight className="w-3 h-3" />
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