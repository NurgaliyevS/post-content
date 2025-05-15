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
import { useRouter } from "next/router";
import { useSidebar } from "@/context/SidebarContext";

function CrossPosting() {
  const { data: session } = useSession();
  const [loadingPosts, setLoadingPosts] = useState(false);
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
    postingInterval: { value: 0, label: "Post all at once" },
  });
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Flair logic
  const [flairsBySubreddit, setFlairsBySubreddit] = useState({});
  const [flairsLoading, setFlairsLoading] = useState({});
  const [flairSelections, setFlairSelections] = useState({});
  const [flairErrors, setFlairErrors] = useState({});
  const [customScheduling, setCustomScheduling] = useState(false);

  const router = useRouter();
  const { refreshData } = useSidebar();

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

  // Separate useEffect for initial load
  useEffect(() => {
    fetchUserSubreddits();
  }, []);

  // New useEffect to watch refreshTrigger and fetch posts
  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]); // This will run fetchPosts whenever refreshTrigger changes

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
    setLoadingPosts(true);
    try {
      const response = await axios.get("/api/post/get-post");
      if (response?.status === 200 && response?.data?.scheduledPosts) {
        setPosts(response?.data?.scheduledPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCustomSchedulingToggle = () => {
    setCustomScheduling((prev) => !prev);
  };

  const handleDateTimeChange = (e, subredditName) => {
    const { name, value } = e.target;
    if (customScheduling && subredditName) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const checkPostAvailability = async (requiredPosts) => {
    const accessResponse = await fetch("/api/user/check-access");
    if (!accessResponse.ok) {
      throw new Error("Failed to check post availability");
    }
    const accessData = await accessResponse.json();

    if (accessData.post_available < requiredPosts) {
      router.push("/#pricing");
      throw new Error(
        `Not enough posts available. You need ${requiredPosts} posts but have ${accessData.post_available}.\nPlease upgrade your plan.`
      );
    }

    return true;
  };

  const updatePostAvailability = async (amountDecreased) => {
    try {
      await fetch("/api/user/update-post-available", {
        method: "POST",
        body: JSON.stringify({ amountDecreased: amountDecreased }),
      });
      refreshData();
    } catch (updateError) {
      console.error("Error updating post availability:", updateError);
    }
  };

  // Fetch flairs for a subreddit if not already cached
  const fetchFlairsForSubreddit = async (subreddit) => {
    if (flairsBySubreddit[subreddit.display_name_prefixed]) return;
    setFlairsLoading((prev) => ({ ...prev, [subreddit.display_name_prefixed]: true }));
    try {
      const response = await fetch(`/api/reddit/flairs?subreddit=${subreddit.display_name_prefixed}`);
      const data = await response.json();
      if (!response.ok) {
        setFlairErrors((prev) => ({ ...prev, [subreddit.display_name_prefixed]: data?.error || "Error fetching flairs" }));
        setFlairsBySubreddit((prev) => ({ ...prev, [subreddit.display_name_prefixed]: [] }));
      }
      const flairs = data.choices || [];
      setFlairsBySubreddit((prev) => ({ ...prev, [subreddit.display_name_prefixed]: flairs }));
    } catch (error) {
      const errorData = await response.json();
      console.error("Error fetching flairs for subreddit:", errorData);
      setFlairsBySubreddit((prev) => ({ ...prev, [subreddit.display_name_prefixed]: [] }));
    } finally {
      setFlairsLoading((prev) => ({ ...prev, [subreddit.display_name_prefixed]: false }));
    }
  };

  // When subreddits are selected, fetch their flairs if needed
  useEffect(() => {
    selectedSubreddits.forEach((sub) => {
      fetchFlairsForSubreddit(sub);
    });
  }, [selectedSubreddits]);

  // Handle flair selection for a subreddit
  const handleFlairChange = (subredditName, flair) => {
    setFlairSelections((prev) => ({ ...prev, [subredditName]: flair }));
    setFlairErrors((prev) => ({ ...prev, [subredditName]: "" }));
  };

  const schedulePost = async () => {
    if (
      !selectedPost ||
      !formData.selectedDate ||
      !formData.selectedTime ||
      selectedSubreddits.length === 0
    ) {
      showNotification(
        "error",
        {
          successful: [],
          failed: [
            { subreddit: "All", reason: "Missing required information" },
          ],
          total: selectedSubreddits.length,
        },
        toast
      );
      return;
    }

    // Flair validation: require flair if 2 or more flairs for subreddit
    let hasFlairError = false;
    const newFlairErrors = {};
    selectedSubreddits.forEach((sub) => {
      const subName = sub.display_name_prefixed;
      const flairs = flairsBySubreddit[subName] || [];
      if (flairs.length >= 2 && !flairSelections[subName]) {
        newFlairErrors[subName] = "Please select a flair for this subreddit.";
        hasFlairError = true;
      }
    });
    setFlairErrors(newFlairErrors);
    if (hasFlairError) return;

    setIsLoadingForm(true);
    try {
      // Check if user has enough posts available for all selected subreddits
      await checkPostAvailability(selectedSubreddits.length);

      const currentTimeISO = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");

      const promises = selectedSubreddits.map(async (subreddit, index) => {
        try {
          const subName = subreddit.display_name_prefixed;
          let postTimeISO;
          if (customScheduling) {
            const postDate = formData[`${subName}-date`] || formData.selectedDate;
            const postTime = formData[`${subName}-time`] || formData.selectedTime;
            const scheduledDate = parse(postDate, "yyyy-MM-dd", new Date());
            const [hours, minutes] = postTime.split(":");
            let scheduledDateTime = setHours(scheduledDate, parseInt(hours, 10));
            scheduledDateTime = setMinutes(scheduledDateTime, parseInt(minutes, 10));
            postTimeISO = format(scheduledDateTime, "yyyy-MM-dd'T'HH:mm:ssxxx");
          } else {
            const scheduledDate = parse(formData.selectedDate, "yyyy-MM-dd", new Date());
            const [hours, minutes] = formData.selectedTime.split(":");
            let scheduledDateTime = setHours(scheduledDate, parseInt(hours, 10));
            scheduledDateTime = setMinutes(scheduledDateTime, parseInt(minutes, 10));
            let postTime = new Date(scheduledDateTime);
            if (formData.postingInterval.value > 0) {
              postTime.setMinutes(
                postTime.getMinutes() + index * formData.postingInterval.value
              );
            }
            postTimeISO = format(postTime, "yyyy-MM-dd'T'HH:mm:ssxxx");
          }
          const flair = flairSelections[subName];

          const response = await axios.post("/api/post/schedule-post", {
            community: subName,
            title: selectedPost.title,
            text: selectedPost.text,
            scheduledDateTime: postTimeISO,
            timeZone: formData.timeZone,
            type: selectedPost.type,
            currentClientTime: currentTimeISO,
            isCrossPosting: true,
            flairId: flair?.id || "",
            flairText: flair?.text || "",
          });
          return {
            status: "fulfilled",
            subreddit: subName,
            value: response,
          };
        } catch (error) {
          return {
            status: "rejected",
            subreddit: subreddit.display_name_prefixed,
            reason: error.response?.data?.message || "Unknown error",
          };
        }
      });

      // Handle all promises
      const results = await Promise.allSettled(promises);

      const successful = results
        .filter((result) => result.value.status === "fulfilled")
        .map((result) => ({ subreddit: result.value.subreddit }));

      await updatePostAvailability(successful.length);

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

      // Update the notification calls and add refreshTrigger
      if (successful.length === 0) {
        showNotification("error", postingResults, toast);
      } else if (failed.length === 0) {
        showNotification("success", postingResults, toast);
        setSelectedPost(null);
        setSelectedSubreddits([]);
        setFlairSelections({});
        setFlairErrors({});
      } else {
        showNotification("warning", postingResults, toast);
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
      showNotification(
        "error",
        {
          successful: [],
          failed: [
            {
              subreddit: "All",
              reason: error.message || "Server error. Please try again.",
            },
          ],
          total: selectedSubreddits.length,
        },
        toast
      );
    } finally {
      setIsLoadingForm(false);
      setRefreshTrigger((prev) => prev + 1);
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
            loadingPosts={loadingPosts}
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
              flairsBySubreddit={flairsBySubreddit}
              flairsLoading={flairsLoading}
              flairSelections={flairSelections}
              flairErrors={flairErrors}
              onFlairChange={handleFlairChange}
              customScheduling={customScheduling}
              onCustomSchedulingToggle={handleCustomSchedulingToggle}
            />
          </div>
        </div>

        <CrossPostingHistory posts={posts} loadingPosts={loadingPosts} />
      </div>
    </DashboardLayout>
  );
}

export default withAuth(CrossPosting);
