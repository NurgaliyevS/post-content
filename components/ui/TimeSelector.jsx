import { useState } from "react";

const TimeSelector = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeriod, setPeriod] = useState("AM");

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // Minutes in 15-minute increments
  const minutes = ["00", "15", "30", "45"];

  // Time periods
  const periods = ["AM", "PM"];

  const handleHourClick = (hour) => {
    const currentMinute = selectedTime
      ? selectedTime.split(":")[1].split(" ")[0]
      : "00";
    setSelectedTime(`${hour}:${currentMinute} ${selectedPeriod}`);
  };

  const handleMinuteClick = (minute) => {
    const currentHour = selectedTime ? selectedTime.split(":")[0] : "12";
    setSelectedTime(`${currentHour}:${minute} ${selectedPeriod}`);
  };

  const handlePeriodClick = (period) => {
    setPeriod(period);
    if (selectedTime) {
      const [time] = selectedTime.split(" ");
      setSelectedTime(`${time} ${period}`);
    } else {
      setSelectedTime(`12:00 ${period}`);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-500 mb-2">Time</p>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        {/* Display selected time */}
        <div className="text-center mb-4 p-2 bg-gray-50 rounded border border-gray-200 text-lg font-medium">
          {selectedTime || "Select a time"}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Hours column */}
          <div className="border-r border-gray-200 pr-2">
            <div className="text-center font-medium mb-2 text-sm">Hour</div>
            <div className="grid grid-cols-3 gap-1">
              {hours.map((hour) => (
                <button
                  key={`hour-${hour}`}
                  onClick={() => handleHourClick(hour)}
                  className={`p-2 rounded-md text-sm  
                      ${
                        selectedTime && selectedTime.split(":")[0] === hour
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes column */}
          <div className="border-r border-gray-200 pr-2">
            <div className="text-center font-medium mb-2 text-sm">Minute</div>
            <div className="grid grid-cols-2 gap-1">
              {minutes.map((minute) => (
                <button
                  key={`minute-${minute}`}
                  onClick={() => handleMinuteClick(minute)}
                  className={`p-2 rounded-md text-sm
                      ${
                        selectedTime &&
                        selectedTime.split(":")[1].split(" ")[0] === minute
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM column */}
          <div>
            <div className="text-center font-medium mb-2 text-sm">Period</div>
            <div className="grid grid-rows-2 gap-1">
              {periods.map((period) => (
                <button
                  key={`period-${period}`}
                  onClick={() => handlePeriodClick(period)}
                  className={`p-2 rounded-md text-sm
                      ${
                        selectedPeriod === period
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
