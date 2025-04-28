import React from "react";
import Select from "react-select";

const FORMATTING_BUTTONS = [{ label: "Link", value: "link" }];

const FormattingToolbar = ({ onFormat, formData, handleFlairChange, flairs }) => {
  // Transform flairs to react-select format
  const flairOptions = flairs?.map((flair) => ({
    value: flair.id,
    label: flair.text,
    flair, // keep the full flair object if needed
  })) || [];

  // Find the selected flair option
  const selectedFlair = flairOptions.find(option => option.value === formData.flairId) || null;

  // Handle change for react-select
  const handleChange = (selectedOption) => {
    handleFlairChange(selectedOption ? selectedOption.flair : null);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 items-center">
      {FORMATTING_BUTTONS.map((button) => (
        <button
          key={button.value}
          className="btn btn-sm h-10 min-h-[40px] px-4"
          onClick={() => onFormat(button.value)}
        >
          {button.label}
        </button>
      ))}
      {flairs?.length > 0 && (
        <div className="form-control min-w-[220px]">
          <Select
            options={[{ value: "", label: "No Flair" }, ...flairOptions]}
            value={selectedFlair || { value: "", label: "No Flair" }}
            onChange={handleChange}
            isClearable={false}
            placeholder="Select a flair"
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
      )}
    </div>
  );
};

export default FormattingToolbar;
