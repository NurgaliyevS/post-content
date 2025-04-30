import React from "react";

export default function Spinner({ 
  className = "", 
  size = 32, 
  label = "Loading...",
  showLabel = true,
  color = "text-primary"
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div 
          className={`animate-spin ${color} rounded-full border-4 border-t-transparent`}
          style={{width: size, height: size}}
          role="status"
          aria-label={label}
        />
        <span className="sr-only">{label}</span>
      </div>
      {showLabel && (
        <span className="text-base-content/70 text-sm font-medium animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}