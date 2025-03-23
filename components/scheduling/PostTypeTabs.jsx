import React from "react";
import { BsLink45Deg, BsImage } from "react-icons/bs";
import { RiFileTextLine } from "react-icons/ri";
import { BiPoll } from "react-icons/bi";

const PostTypeTabs = ({ type, onTypeChange }) => {
  return (
    <div className="tabs mb-4">
      <button
        className={`tab relative ${type === "text" ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : ""} flex items-center gap-2`}
        onClick={() => onTypeChange("text")}
      >
        <RiFileTextLine /> Text
      </button>
      <button
        disabled
        className="tab flex items-center gap-2 opacity-50"
      >
        <BsImage /> Images & Video
      </button>
      <button
        disabled
        className="tab flex items-center gap-2 opacity-50"
      >
        <BsLink45Deg /> Link
      </button>
      <button
        disabled
        className="tab flex items-center gap-2 opacity-50"
      >
        <BiPoll /> Poll
      </button>
    </div>
  );
};

export default PostTypeTabs;