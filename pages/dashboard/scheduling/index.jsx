import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TimeSelector from "@/components/ui/TimeSelector";
import withAuth from "@/components/withAuth";
import PostTypeTabs from "@/components/scheduling/PostTypeTabs";
import FormattingToolbar from "@/components/scheduling/FormattingToolbar";
import Calendar from "@/components/scheduling/Calendar";
import SubredditSelector from "@/components/scheduling/SubredditSelector";
import { format, parse, setHours, setMinutes, add, sub } from "date-fns";

function Scheduling() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [subreddits, setSubreddits] = useState([]);
  const [subredditsLoading, setSubredditsLoading] = useState(false);
  const [subredditsError, setSubredditsError] = useState(null);
  const [formData, setFormData] = useState({
    community: "",
    title: "",
    text: "",
    selectedDate: format(new Date(), "yyyy-MM-dd"),
    selectedTime: format(new Date(), "h:mm aa"),
    type: "text", // Default post type
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // For displaying save notifications
  const [initialized, setInitialized] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  if (status !== "loading" && !initialized) {
    setLoading(false);
    setInitialized(true);

    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);

    // Only fetch subreddits if we have a session
    if (session && subreddits.length === 0 && !subredditsLoading) {
      fetchUserSubreddits();
    }
  }

  async function fetchUserSubreddits() {
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
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormatting = (formatType) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.text.substring(start, end);

    let formattedText = "";
    let newCursorPosition = end;

    if (formatType === "bold") {
      formattedText =
        formData.text.substring(0, start) +
        `**${selectedText}**` +
        formData.text.substring(end);
      newCursorPosition = selectedText.length ? end + 4 : start + 2;
    } else if (formatType === "italic") {
      formattedText =
        formData.text.substring(0, start) +
        `*${selectedText}*` +
        formData.text.substring(end);
      newCursorPosition = selectedText.length ? end + 2 : start + 1;
    } else if (formatType === "link") {
      if (selectedText) {
        formattedText =
          formData.text.substring(0, start) +
          `[${selectedText}](url)` +
          formData.text.substring(end);
        newCursorPosition = start + selectedText.length + 2;
      } else {
        formattedText =
          formData.text.substring(0, start) +
          "[Link text](url)" +
          formData.text.substring(end);
        newCursorPosition = start + 1;
      }
    }

    setFormData((prev) => ({
      ...prev,
      text: formattedText,
    }));
  };

  // Calendar functions
  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleDateSelection = (day) => {
    const monthStr = format(currentDate, "yyyy-MM");
    const dayStr = day.toString().padStart(2, "0");
    const dateStr = `${monthStr}-${dayStr}`;

    setFormData((prev) => ({
      ...prev,
      selectedDate: dateStr,
    }));
  };

  const handleTimeSelection = (time) => {
    setFormData((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  const schedulePost = async () => {
    if (
      !formData.community ||
      !formData.title ||
      !formData.selectedDate ||
      !formData.selectedTime
    ) {
      setSaveStatus("Please fill in all required fields");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    setIsLoadingForm(true);
    try {
      // Parse the date string
      const scheduledDate = parse(
        formData.selectedDate,
        "yyyy-MM-dd",
        new Date()
      );

      // Parse the time string
      const timeMatch = formData.selectedTime.match(/^(\d+):(\d+) (AM|PM)$/);
      if (!timeMatch) {
        throw new Error(`Invalid time format: ${formData.selectedTime}`);
      }

      const [_, hours, minutes, period] = timeMatch;
      let hour = parseInt(hours, 10);

      // Convert to 24-hour format
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      // Set hours and minutes on the scheduledDate
      let scheduledDateTime = setHours(scheduledDate, hour);
      scheduledDateTime = setMinutes(scheduledDateTime, parseInt(minutes, 10));

      // Format as ISO string for API
      const scheduledDateTimeISO = format(
        scheduledDateTime,
        "yyyy-MM-dd'T'HH:mm:ssxxx"
      );
      const currentTimeISO = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");

      const response = await fetch("/api/post/schedule-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          community: formData.community,
          title: formData.title,
          text: formData.text.replace(/\n/g, "\n\n"),
          scheduledDateTime: scheduledDateTimeISO,
          timeZone: userTimezone,
          currentClientTime: currentTimeISO,
          type: formData.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule post");
      }

      setFormData({
        community: "",
        title: "",
        text: "",
        selectedDate: format(new Date(), "yyyy-MM-dd"),
        selectedTime: format(new Date(), "h:mm aa"),
        type: "text",
      });

      const data = await response.json();
      if (data?.message) {
        setSaveStatus(data?.message);
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus("Post scheduled successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
      setSaveStatus("Error scheduling post. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <DashboardLayout loading={loading}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Schedule Your Reddit Posts
        </h1>

        {saveStatus && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {saveStatus}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SubredditSelector
            subreddits={subreddits}
            subredditsLoading={subredditsLoading}
            subredditsError={subredditsError}
            selectedCommunity={formData.community}
            onCommunityChange={handleInputChange}
            onRetry={fetchUserSubreddits}
          />

          <PostTypeTabs
            type={formData.type}
            onTypeChange={(type) => setFormData((prev) => ({ ...prev, type }))}
          />

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />

            <FormattingToolbar onFormat={handleFormatting} />

            <textarea
              className="textarea textarea-bordered w-full min-h-32"
              placeholder="Text"
              name="text"
              value={formData.text}
              onChange={(e) => {
                // Reset height to auto
                e.target.style.height = "auto";

                // Set height based on scroll height
                e.target.style.height = `${e.target.scrollHeight}px`;

                handleInputChange(e);
              }}
            ></textarea>

            <div className="flex gap-8 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                  {userTimezone} timezone
                </p>
                <Calendar
                  currentDate={currentDate}
                  selectedDate={formData.selectedDate}
                  onDateSelect={handleDateSelection}
                  onMonthChange={changeMonth}
                  getMonthName={getMonthName}
                  getDaysInMonth={getDaysInMonth}
                  getFirstDayOfMonth={getFirstDayOfMonth}
                />
              </div>

              <div className="flex-1">
                <TimeSelector
                  selectedTime={formData.selectedTime}
                  onTimeSelect={handleTimeSelection}
                  selectedDate={formData.selectedDate}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="btn btn-primary"
                disabled={
                  !formData.selectedDate ||
                  !formData.selectedTime ||
                  !formData.title ||
                  !formData.community ||
                  isLoadingForm
                }
                onClick={schedulePost}
              >
                {isLoadingForm ? "Scheduling..." : "Schedule Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Scheduling);
