import Select from "react-select";
import { FiArrowRight } from "react-icons/fi";
import { format } from "date-fns";

export default function SchedulingForm({
  formData,
  intervalOptions,
  selectedSubreddits,
  isLoadingForm,
  onDateTimeChange,
  onIntervalChange,
  onSchedulePost,
  flairsBySubreddit = {},
  flairsLoading = {},
  flairSelections = {},
  flairErrors = {},
  onFlairChange = () => {},
  customScheduling = false,
  onCustomSchedulingToggle = () => {},
}) {
  return (
    // by default in the bottom
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center mb-4">
        <span className="text-sm font-medium mr-3 block">Custom scheduling</span>
        <input
          type="checkbox"
          className="toggle toggle-md"
          checked={customScheduling}
          onChange={onCustomSchedulingToggle}
        />
      </div>

      {!customScheduling && (
        <>
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

          {selectedSubreddits.map((sub) => {
            const subName = sub.value;
            const flairs = flairsBySubreddit[subName] || [];
            const flairRequired = flairs.length >= 2;
            const flairOptions = flairs.map((flair) => ({
              value: flair.id,
              label: flair.text,
              flair,
            }));
            const selectedFlair =
              flairOptions.find(
                (option) => option.value === flairSelections[subName]?.id
              ) || null;
            return (
              <div key={subName} className="mb-6 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Flair for <span className="font-semibold">{subName}</span>
                    {flairRequired && (
                      <span className="text-error ml-1">*</span>
                    )}
                  </label>
                  <Select
                    options={
                      flairRequired
                        ? flairOptions
                        : [{ value: "", label: "No Flair" }, ...flairOptions]
                    }
                    value={
                      selectedFlair ||
                      (flairRequired ? null : { value: "", label: "No Flair" })
                    }
                    onChange={(option) =>
                      onFlairChange(subName, option ? option.flair : null)
                    }
                    placeholder={
                      flairRequired ? "Select a flair (required)" : "No Flair"
                    }
                    isLoading={!!flairsLoading[subName]}
                    className="w-full"
                    classNamePrefix="react-select"
                  />
                  {flairErrors[subName] && (
                    <div className="text-neutral-content text-sm font-medium mt-1">
                      {flairErrors[subName]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

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
              {formData.postingInterval.value > 0 &&
              selectedSubreddits.length > 1 ? (
                <div className="mt-2 text-xs text-gray-500">
                  Posts will be scheduled {formData.postingInterval.value}{" "}
                  minutes apart. Total duration:{" "}
                  {(selectedSubreddits.length - 1) *
                    formData.postingInterval.value}{" "}
                  minutes.
                </div>
              ) : (
                <div className="mt-2 text-xs text-gray-500">
                  Posts will be scheduled all at once.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {customScheduling && (
        <>
          {selectedSubreddits.map((sub) => {
            const subName = sub.value;
            const flairs = flairsBySubreddit[subName] || [];
            const flairRequired = flairs.length >= 2;
            const flairOptions = flairs.map((flair) => ({
              value: flair.id,
              label: flair.text,
              flair,
            }));
            const selectedFlair =
              flairOptions.find(
                (option) => option.value === flairSelections[subName]?.id
              ) || null;
            return (
              <div key={subName} className="mb-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">{subName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name={`${subName}-date`}
                        value={
                          formData[`${subName}-date`] || formData.selectedDate
                        }
                        onChange={(e) => onDateTimeChange(e, subName)}
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name={`${subName}-time`}
                        value={
                          formData[`${subName}-time`] || formData.selectedTime
                        }
                        onChange={(e) => onDateTimeChange(e, subName)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Flair
                    {flairRequired && (
                      <span className="text-error ml-1">*</span>
                    )}
                  </label>
                  <Select
                    options={
                      flairRequired
                        ? flairOptions
                        : [{ value: "", label: "No Flair" }, ...flairOptions]
                    }
                    value={
                      selectedFlair ||
                      (flairRequired ? null : { value: "", label: "No Flair" })
                    }
                    onChange={(option) =>
                      onFlairChange(subName, option ? option.flair : null)
                    }
                    placeholder={
                      flairRequired ? "Select a flair (required)" : "No Flair"
                    }
                    isLoading={!!flairsLoading[subName]}
                    className="w-full"
                    classNamePrefix="react-select"
                  />
                  {flairErrors[subName] && (
                    <div className="text-neutral-content text-sm font-medium mt-1">
                      {flairErrors[subName]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

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
