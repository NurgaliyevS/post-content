import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaCalendar, FaCheckCircle, FaSpinner, FaUsers } from "react-icons/fa";

function Post() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/post/get-post");
      if (response?.status === 200 && response?.data?.scheduledPosts) {
        setPosts(response?.data?.scheduledPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const toggleExpand = (postId, event) => {
    event.preventDefault(); // Prevent link click when expanding
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-6">My Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) =>
          post.status === "published" && post.redditPostUrl ? (
            <a
              href={post.redditPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={post._id}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium flex items-center gap-2">
                  <FaUsers className="w-3 h-3" />
                  r/{post.community}
                </span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-green-100 text-green-800 flex items-center gap-2">
                  <FaCheckCircle className="w-3 h-3" />
                  {post.status}
                </span>
              </div>

              <h3 className="text-lg font-medium">{post.title}</h3>
              <p className="text-gray-600 text-sm">
                {expandedPosts[post._id] ? post.text : truncateText(post.text)}
              </p>
              {post.text.length > 150 && (
                <button
                  onClick={(e) => toggleExpand(post._id, e)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {expandedPosts[post._id] ? "Read less" : "Read more"}
                </button>
              )}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <span className="text-gray-500 text-sm flex gap-2 items-center">
                  <FaCalendar className="w-3 h-3" />
                  {format(new Date(post.createdAt), "MM/dd/yyyy HH:mm")}
                </span>
              </div>
            </a>
          ) : (
            <div
              key={post._id}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium flex items-center gap-2">
                  <FaUsers className="w-3 h-3" />
                  r/{post.community}
                </span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 flex items-center gap-2">
                  <FaSpinner className="w-3 h-3" />
                  {post.status}
                </span>
              </div>

              <h3 className="text-lg font-medium">{post.title}</h3>
              <p className="text-gray-600 text-sm">
                {expandedPosts[post._id] ? post.text : truncateText(post.text)}
              </p>
              {post.text.length > 150 && (
                <button
                  onClick={() =>
                    setExpandedPosts((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                  className="text-blue-600 text-sm hover:underline"
                >
                  {expandedPosts[post._id] ? "Read less" : "Read more"}
                </button>
              )}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <span className="text-gray-500 text-sm flex gap-2 items-center">
                  <FaCalendar className="w-3 h-3" />
                  {format(new Date(post.scheduledFor), "MM/dd/yyyy HH:mm")}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Post;
