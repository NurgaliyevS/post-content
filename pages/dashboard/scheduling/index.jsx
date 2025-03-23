import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BsLink45Deg, BsImage } from "react-icons/bs";
import { RiFileTextLine } from "react-icons/ri";
import { BiPoll } from "react-icons/bi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import TimeSelector from "@/components/ui/TimeSelector";

const FORMATTING_BUTTONS = [
  { label: "B", value: "bold" },
  { label: "I", value: "italic" },
  { label: "Link", value: "link" },
];

export default function Scheduling() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [subreddits, setSubreddits] = useState([]);
  const [subredditsLoading, setSubredditsLoading] = useState(false);
  const [subredditsError, setSubredditsError] = useState(null);
  const [formData, setFormData] = useState({
    community: "",
    title: "",
    text: "",
    selectedDate: new Date(),
    selectedTime: "",
    type: "text" // Default post type
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // For displaying save notifications

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
      
      if (session) {
        fetchUserSubreddits();
      }
    }
    
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
  }, [status, session]);

  const fetchUserSubreddits = async () => {
    try {
      setSubredditsLoading(true);
      setSubredditsError(null);
      
      const response = await fetch('/api/reddit/subreddits');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subreddits: ${response.status}`);
      }
      
      const data = await response.json();
      setSubreddits(data.subreddits || []);
    } catch (error) {
      console.error('Error fetching subreddits:', error);
      setSubredditsError(error.message);
    } finally {
      setSubredditsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      formattedText = formData.text.substring(0, start) + `**${selectedText}**` + formData.text.substring(end);
      newCursorPosition = selectedText.length ? end + 4 : start + 2;
    } else if (formatType === "italic") {
      formattedText = formData.text.substring(0, start) + `*${selectedText}*` + formData.text.substring(end);
      newCursorPosition = selectedText.length ? end + 2 : start + 1;
    } else if (formatType === "link") {
      if (selectedText) {
        // If text is selected, format it as a link with placeholder URL
        formattedText = formData.text.substring(0, start) + `[${selectedText}](url)` + formData.text.substring(end);
        newCursorPosition = start + selectedText.length + 2; // Position cursor at the start of 'url'
      } else {
        // If no text is selected, insert a link template
        formattedText = formData.text.substring(0, start) + "[Link text](url)" + formData.text.substring(end);
        newCursorPosition = start + 1; // Position cursor after the opening bracket to edit link text
      }
    }

    setFormData(prev => ({
      ...prev,
      text: formattedText
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
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setFormData(prev => ({
      ...prev,
      selectedDate: selected
    }));
  };

  const handleTimeSelection = (time) => {
    setFormData(prev => ({
      ...prev,
      selectedTime: time
    }));
  };

  const renderCalendar = () => {
    const today = new Date();
    // Reset the time part to ensure accurate date comparison
    today.setHours(0, 0, 0, 0);
    
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      dayDate.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      
      const isToday = today.getTime() === dayDate.getTime();
      const isPast = dayDate.getTime() < today.getTime();
      const isSelected = formData.selectedDate && 
                          formData.selectedDate.getFullYear() === dayDate.getFullYear() &&
                          formData.selectedDate.getMonth() === dayDate.getMonth() &&
                          formData.selectedDate.getDate() === dayDate.getDate();

      days.push(
        <button 
          key={i} 
          onClick={() => !isPast && handleDateSelection(i)}
          className={`p-2 rounded ${isSelected ? "bg-blue-500 text-white" : ""} ${isPast ? "text-gray-400 cursor-not-allowed" : ""}`}
          disabled={isPast}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const schedulePost = async () => {
    // Check required fields
    if (!formData.community || !formData.title || !formData.selectedDate || !formData.selectedTime) {
      setSaveStatus("Please fill in all required fields");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    try {
      // Here you would make an API call to save the scheduled post
      const response = await fetch('/api/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule post');
      }
      
      // Reset form
      setFormData({
        community: "",
        title: "",
        text: "",
        selectedDate: new Date(),
        selectedTime: "",
        type: "text"
      });
      
      setSaveStatus("Post scheduled successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error('Error scheduling post:', error);
      setSaveStatus("Error scheduling post. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const renderSubredditOptions = () => {
    if (subredditsLoading) {
      return <option value="" disabled>Loading subreddits...</option>;
    }
    
    if (subredditsError) {
      return <option value="" disabled>Error loading subreddits</option>;
    }
    
    if (subreddits.length === 0) {
      return <option value="" disabled>No subreddits found</option>;
    }
    
    return [
      <option key="placeholder" value="" disabled>Choose a community</option>,
      ...subreddits.map(subreddit => (
        <option key={subreddit.name} value={subreddit.display_name_prefixed}>
          {subreddit.display_name_prefixed}
        </option>
      ))
    ];
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
          <div className="mb-4">
            <select 
              className="select select-bordered w-full max-w-xs"
              name="community"
              value={formData.community}
              onChange={handleInputChange}
            >
              {renderSubredditOptions()}
            </select>
            
            {subredditsError && (
              <p className="text-red-500 text-sm mt-1">
                Error: {subredditsError}. <button 
                  className="text-blue-500 underline" 
                  onClick={fetchUserSubreddits}
                >
                  Try again
                </button>
              </p>
            )}
          </div>

          <div className="tabs mb-4">
            <button 
              className={`tab tab-bordered ${formData.type === 'text' ? 'tab-active' : ''} flex items-center gap-2`}
              onClick={() => setFormData(prev => ({...prev, type: 'text'}))}
            >
              <RiFileTextLine /> Text
            </button>
            <button
              disabled
              className="tab tab-bordered flex items-center gap-2 opacity-50"
            >
              <BsImage /> Images & Video
            </button>
            <button
              disabled
              className="tab tab-bordered flex items-center gap-2 opacity-50"
            >
              <BsLink45Deg /> Link
            </button>
            <button
              disabled
              className="tab tab-bordered flex items-center gap-2 opacity-50"
            >
              <BiPoll /> Poll
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />

            <div className="flex flex-wrap gap-2 mb-2">
              {FORMATTING_BUTTONS.map(button => (
                <button 
                  key={button.value} 
                  className="btn btn-sm"
                  onClick={() => handleFormatting(button.value)}
                >
                  {button.label}
                </button>
              ))}
            </div>

            <textarea
              className="textarea textarea-bordered w-full h-32"
              placeholder="Text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
            ></textarea>

            <div className="flex gap-8 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                  {userTimezone} timezone
                </p>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1" onClick={() => changeMonth(-1)}>
                      <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium">{getMonthName(currentDate)}</span>
                    <button className="p-1" onClick={() => changeMonth(1)}>
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                    <div>Su</div>
                    <div>Mo</div>
                    <div>Tu</div>
                    <div>We</div>
                    <div>Th</div>
                    <div>Fr</div>
                    <div>Sa</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-sm min-h-60">
                    {renderCalendar()}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <TimeSelector 
                  selectedTime={formData.selectedTime} 
                  onTimeSelect={handleTimeSelection} 
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                className="btn btn-primary" 
                disabled={!formData.selectedDate || !formData.selectedTime || !formData.title || !formData.community}
                onClick={schedulePost}
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}