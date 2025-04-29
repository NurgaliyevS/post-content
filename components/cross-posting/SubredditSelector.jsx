import { FaUsers } from "react-icons/fa";

export default function SubredditSelector({
  subreddits,
  selectedSubreddits,
  subredditsLoading,
  subredditsError,
  onSubredditSelect,
  onSelectAll,
  onRetry
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-4">Target Subreddits</h2>
        <button className="text-sm text-blue-600" onClick={onSelectAll}>
          {selectedSubreddits.length === subreddits.length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="h-60 overflow-y-auto space-y-2 border rounded-md p-2">
        {subredditsLoading ? (
          <div className="text-center p-4 text-gray-500">Loading...</div>
        ) : subredditsError ? (
          <div className="text-center p-4 text-red-500">
            {subredditsError}
            <button
              onClick={onRetry}
              className="text-blue-600 hover:underline block mt-2"
            >
              Retry
            </button>
          </div>
        ) : (
          subreddits.map((subreddit) => (
            <div
              key={subreddit.subscribers}
              className="flex items-center p-2 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                id={subreddit.id}
                className="mr-2"
                checked={selectedSubreddits.some((s) => s.id === subreddit.id)}
                onChange={() => onSubredditSelect(subreddit)}
              />
              <label htmlFor={subreddit.id} className="flex-grow">
                {subreddit.display_name_prefixed}
              </label>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                {subreddit.subscribers.toLocaleString()}
                <FaUsers className="w-3 h-3" />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 