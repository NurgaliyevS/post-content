import React from "react";

const FORMATTING_BUTTONS = [
  // { label: "B", value: "bold" },
  // { label: "I", value: "italic" },
  { label: "Link", value: "link" },
];

const FormattingToolbar = ({ onFormat }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {FORMATTING_BUTTONS.map((button) => (
        <button
          key={button.value}
          className="btn btn-sm"
          onClick={() => onFormat(button.value)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default FormattingToolbar; 