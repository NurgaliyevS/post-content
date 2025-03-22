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
  const [text, setText] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
    
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
  }, [status]);

  const handleFormatting = (formatType) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let formattedText = "";
    let newCursorPosition = end;

    if (formatType === "bold") {
      formattedText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
      newCursorPosition = selectedText.length ? end + 4 : start + 2;
    } else if (formatType === "italic") {
      formattedText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
      newCursorPosition = selectedText.length ? end + 2 : start + 1;
    } else if (formatType === "link") {
      if (selectedText) {
        // If text is selected, format it as a link with placeholder URL
        formattedText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end);
        newCursorPosition = start + selectedText.length + 2; // Position cursor at the start of 'url'
      } else {
        // If no text is selected, insert a link template
        formattedText = text.substring(0, start) + "[Link text](url)" + text.substring(end);
        newCursorPosition = start + 1; // Position cursor after the opening bracket to edit link text
      }
    }

    setText(formattedText);
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
    setSelectedDate(selected);
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
      const isSelected = selectedDate && selectedDate.getTime() === dayDate.getTime();

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

  return (
    <DashboardLayout loading={loading}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Schedule Your Reddit Posts
        </h1>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-4">
            <select className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Choose a community
              </option>
              <option>r/programming</option>
              <option>r/webdev</option>
              <option>r/reactjs</option>
            </select>
          </div>

          <div className="tabs mb-4">
            <button className="tab tab-bordered tab-active flex items-center gap-2">
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
              value={text}
              onChange={(e) => setText(e.target.value)}
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
                <TimeSelector />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button className="btn btn-primary" disabled={!selectedDate}>Schedule Post</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}