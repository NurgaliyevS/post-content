import React from "react";

const SubredditSelector = ({
  subreddits,
  subredditsLoading,
  subredditsError,
  selectedCommunity,
  onCommunityChange,
  onRetry,
}) => {
  const renderSubredditOptions = () => {
    if (subredditsLoading) {
      return (
        <option value="" disabled>
          Loading subreddits...
        </option>
      );
    }

    if (subredditsError) {
      return (
        <option value="" disabled>
          Error loading subreddits
        </option>
      );
    }

    if (subreddits.length === 0) {
      return (
        <option value="" disabled>
          No subreddits found
        </option>
      );
    }

    return [
      <option key="placeholder" value="" disabled>
        Select a subreddit
      </option>,
      ...subreddits.map((subreddit) => (
        <option key={subreddit.name} value={subreddit.display_name_prefixed}>
          {subreddit.display_name_prefixed}
        </option>
      )),
    ];
  };

  return (
    <div className="mb-4">
      <select
        className="select select-bordered w-full max-w-xs"
        name="community"
        value={selectedCommunity}
        onChange={onCommunityChange}
      >
        {renderSubredditOptions()}
      </select>

      {subredditsError && (
        <p className="text-red-500 text-sm mt-1">
          Error: {subredditsError}.{" "}
          <button className="text-blue-500 underline" onClick={onRetry}>
            Try again
          </button>
        </p>
      )}
    </div>
  );
};

export default SubredditSelector; 