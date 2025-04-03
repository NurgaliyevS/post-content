import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/components/withAuth";
import axios from "axios";
import { format, parse, setHours, setMinutes } from "date-fns";
import { toast } from "react-toastify";
import CrossPostingHistory from "@/components/ui/CrossPostingHistory";
import SourcePostSelector from "@/components/cross-posting/SourcePostSelector";
import SubredditSelector from "@/components/cross-posting/SubredditSelector";
import SchedulingForm from "@/components/cross-posting/SchedulingForm";
import { showNotification } from "@/components/cross-posting/ToastNotifications";

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
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
    { value: 480, label: "8 hours" },
    { value: 720, label: "12 hours" },
    { value: 1440, label: "1 day" },
    { value: 2880, label: "2 days" },
    { value: 4320, label: "3 days" },
    { value: 5760, label: "4 days" },
    { value: 7200, label: "5 days" },
    { value: 8640, label: "6 days" },
    { value: 10080, label: "7 days" },
    
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
      }, toast);
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

      // Update the notification calls to pass toast
      if (successful.length === 0) {
        showNotification("error", postingResults, toast);
      } else if (failed.length === 0) {
        showNotification("success", postingResults, toast);
        setSelectedPost(null);
        setSelectedSubreddits([]);
      } else {
        showNotification("warning", postingResults, toast);
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
      showNotification("error", {
        successful: [],
        failed: [
          { subreddit: "All", reason: "Server error. Please try again." },
        ],
        total: selectedSubreddits.length,
      }, toast);
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Cross-Posting</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SourcePostSelector
            posts={posts}
            selectedPost={selectedPost}
            onPostSelect={handlePostSelect}
          />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <SubredditSelector
              subreddits={subreddits}
              selectedSubreddits={selectedSubreddits}
              subredditsLoading={subredditsLoading}
              subredditsError={subredditsError}
              onSubredditSelect={handleSubredditSelect}
              onSelectAll={handleSelectAll}
              onRetry={fetchUserSubreddits}
            />

            <SchedulingForm
              formData={formData}
              intervalOptions={intervalOptions}
              selectedSubreddits={selectedSubreddits}
              isLoadingForm={isLoadingForm}
              onDateTimeChange={handleDateTimeChange}
              onIntervalChange={handleIntervalChange}
              onSchedulePost={schedulePost}
            />
          </div>
        </div>

        <CrossPostingHistory posts={posts} />
      </div>
    </DashboardLayout>
  );
}

export default withAuth(CrossPosting);