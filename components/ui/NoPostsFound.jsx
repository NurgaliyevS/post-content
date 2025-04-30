import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

export default function NoPostsFound() {
  return (
    <div className="flex flex-col items-center justify-center h-3/4 py-12">
      <FaRegFileAlt className="text-5xl mb-3" />
      <div className="font-semibold text-base-content text-lg mb-1">
        No posts found
      </div>
      <div className="text-base-content/60 text-sm text-center mb-4">
        You have no posts available for cross-posting.
        <br />
        <span className="font-medium">Schedule a post first.</span>
      </div>
      <a
        className="btn btn-primary px-4 py-2 rounded-md flex items-center"
        href="/dashboard/scheduling"
      >
        Schedule Post
        <FiArrowRight className="w-3 h-3 ml-1" />
      </a>
    </div>
  );
}
