import { format } from "date-fns";
import { FaUsers, FaCheckCircle, FaSpinner, FaCalendar } from "react-icons/fa";
import NoPostsFound from "@/components/ui/NoPostsFound";
import { useSidebar } from "@/context/SidebarContext";
import Spinner from "@/components/ui/Spinner";

export default function SourcePostSelector({
  posts,
  selectedPost,
  onPostSelect,
  loadingPosts,
}) {
  const { hasScheduledPosts } = useSidebar();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <h2 className="text-lg font-semibold">Source Post</h2>

      <div className="space-y-3 mt-4 flex-grow overflow-y-auto h-[210px]">
        {loadingPosts ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
              selectedPost?._id === post._id ? "bg-blue-50 border-blue-200" : ""
            }`}
            onClick={() => onPostSelect(post)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FaUsers className="w-3 h-3" />
                  r/{post.community}
                </div>
                <h3 className="font-medium">{post.title}</h3>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                  post.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {post.status === "published" ? (
                  <FaCheckCircle className="w-3 h-3" />
                ) : (
                  <FaSpinner className="w-3 h-3" />
                )}
                {post.status}
              </div>
            </div>

            <div className="border-t border-gray-200 mt-2 pt-2 w-full flex items-center justify-between">
              <span className="text-gray-500 text-sm flex gap-2 items-center">
                <FaCalendar className="w-3 h-3" />
                {format(new Date(post.scheduledFor), "MM/dd/yyyy HH:mm")}
              </span>
              {post?.redditPostUrl && (
                <a
                  href={post.redditPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View on Reddit
                </a>
              )}
            </div>
            </div>
          ))
        )}

        {loadingPosts === false && hasScheduledPosts === false && <NoPostsFound />}
      </div>
    </div>
  );
}
