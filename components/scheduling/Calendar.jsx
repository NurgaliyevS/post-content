import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Calendar = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  getMonthName,
  getDaysInMonth,
  getFirstDayOfMonth,
}) => {
  const today = new Date();
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
    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      i
    );
    dayDate.setHours(0, 0, 0, 0);

    const isPast = dayDate.getTime() < today.getTime();
    const isSelected =
      selectedDate &&
      selectedDate.getFullYear() === dayDate.getFullYear() &&
      selectedDate.getMonth() === dayDate.getMonth() &&
      selectedDate.getDate() === dayDate.getDate();

    days.push(
      <button
        key={i}
        onClick={() => !isPast && onDateSelect(i)}
        className={`p-2 rounded ${
          isSelected ? "bg-blue-500 text-white" : ""
        } ${isPast ? "text-gray-400 cursor-not-allowed" : ""}`}
        disabled={isPast}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button className="p-1" onClick={() => onMonthChange(-1)}>
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium">{getMonthName(currentDate)}</span>
        <button className="p-1" onClick={() => onMonthChange(1)}>
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
        {days}
      </div>
    </div>
  );
};

export default Calendar; 