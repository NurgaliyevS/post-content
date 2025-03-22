import { useState, useEffect } from "react";

const TimeSelector = ({ selectedTime, onTimeSelect }) => {
  const [internalTime, setInternalTime] = useState(null);
  const [selectedPeriod, setPeriod] = useState("AM");

  useEffect(() => {
    // Set current time on initial load if no time is provided
    if (!selectedTime) {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      
      // Convert 24h to 12h format
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      // Round minutes to nearest 15
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const minuteStr = roundedMinutes === 0 ? "00" : roundedMinutes === 60 ? "00" : roundedMinutes.toString();
      
      setPeriod(period);
      const newTime = `${hours}:${minuteStr} ${period}`;
      setInternalTime(newTime);
      onTimeSelect(newTime);
    } else {
      // If selectedTime is provided, use it to set internal state
      setInternalTime(selectedTime);
      
      // Extract period from the provided time
      if (selectedTime && selectedTime.includes(" ")) {
        const period = selectedTime.split(" ")[1];
        setPeriod(period);
      }
    }
  }, []);

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // Minutes in 15-minute increments
  const minutes = ["00", "15", "30", "45"];

  // Time periods
  const periods = ["AM", "PM"];

  const handleHourClick = (hour) => {
    const currentMinute = internalTime
      ? internalTime.split(":")[1].split(" ")[0]
      : "00";
    const newTime = `${hour}:${currentMinute} ${selectedPeriod}`;
    setInternalTime(newTime);
    onTimeSelect(newTime);
  };

  const handleMinuteClick = (minute) => {
    const currentHour = internalTime ? internalTime.split(":")[0] : "12";
    const newTime = `${currentHour}:${minute} ${selectedPeriod}`;
    setInternalTime(newTime);
    onTimeSelect(newTime);
  };

  const handlePeriodClick = (period) => {
    setPeriod(period);
    if (internalTime) {
      const [time] = internalTime.split(" ");
      const newTime = `${time} ${period}`;
      setInternalTime(newTime);
      onTimeSelect(newTime);
    } else {
      const newTime = `12:00 ${period}`;
      setInternalTime(newTime);
      onTimeSelect(newTime);
    }
  };

  // Parse currently selected time parts for highlighting
  const getCurrentTimeparts = () => {
    if (!internalTime) return { hour: null, minute: null, period: selectedPeriod };
    
    const [timePart, periodPart] = internalTime.split(" ");
    const [hourPart, minutePart] = timePart.split(":");
    
    return { 
      hour: hourPart, 
      minute: minutePart, 
      period: periodPart 
    };
  };
  
  const { hour, minute, period } = getCurrentTimeparts();

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-500 mb-2">Time</p>

      <div className="border border-gray-200 rounded-lg p-4 bg-white h-[346px]">
        {/* Display selected time */}
        <div className="text-center mb-4 p-2 bg-gray-50 rounded border border-gray-200 text-lg font-medium">
          {internalTime || "Select a time"}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Hours column */}
          <div className="border-r border-gray-200 pr-2">
            <div className="text-center font-medium mb-2 text-sm">Hour</div>
            <div className="grid grid-cols-3 gap-1">
              {hours.map((hourOption) => (
                <button
                  key={`hour-${hourOption}`}
                  onClick={() => handleHourClick(hourOption)}
                  className={`p-2 rounded-md text-sm  
                      ${
                        hour === hourOption
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                >
                  {hourOption}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes column */}
          <div className="border-r border-gray-200 pr-2">
            <div className="text-center font-medium mb-2 text-sm">Minute</div>
            <div className="grid grid-cols-2 gap-1">
              {minutes.map((minuteOption) => (
                <button
                  key={`minute-${minuteOption}`}
                  onClick={() => handleMinuteClick(minuteOption)}
                  className={`p-2 rounded-md text-sm
                      ${
                        minute === minuteOption
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                >
                  {minuteOption}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM column */}
          <div>
            <div className="text-center font-medium mb-2 text-sm">Period</div>
            <div className="grid grid-rows-2 gap-1">
              {periods.map((periodOption) => (
                <button
                  key={`period-${periodOption}`}
                  onClick={() => handlePeriodClick(periodOption)}
                  className={`p-2 rounded-md text-sm
                      ${
                        selectedPeriod === periodOption
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                >
                  {periodOption}
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