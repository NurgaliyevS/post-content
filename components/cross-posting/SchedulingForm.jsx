import Select from 'react-select';
import { FiArrowRight } from "react-icons/fi";
import { format } from "date-fns";

export default function SchedulingForm({
  formData,
  intervalOptions,
  selectedSubreddits,
  isLoadingForm,
  onDateTimeChange,
  onIntervalChange,
  onSchedulePost
}) {
  return (
    <div className="border-t pt-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <div className="relative">
            <input
              type="date"
              name="selectedDate"
              value={formData.selectedDate}
              onChange={onDateTimeChange}
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
              onChange={onDateTimeChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 flex items-center gap-1">
          Posting Interval (minutes)
        </label>
        <div className="relative">
          <Select
            options={intervalOptions}
            value={formData.postingInterval}
            onChange={onIntervalChange}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
            placeholder="Select interval..."
          />
          {formData.postingInterval.value > 0 && selectedSubreddits.length > 1 ? (
            <div className="mt-2 text-xs text-gray-500">
              Posts will be scheduled {formData.postingInterval.value} minutes apart. 
              Total duration: {(selectedSubreddits.length - 1) * formData.postingInterval.value} minutes.
            </div>
          ) : (
            <div className="mt-2 text-xs text-gray-500">
              Posts will be scheduled all at once.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="btn btn-primary px-4 py-2 rounded-md flex items-center"
          onClick={onSchedulePost}
          disabled={isLoadingForm}
        >
          {isLoadingForm ? "Scheduling..." : "Schedule Cross-Posts"}
          <FiArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
} 