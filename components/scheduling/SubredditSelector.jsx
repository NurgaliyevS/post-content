import React, { useCallback } from "react";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const SubredditSelector = ({
  subreddits,
  subredditsLoading,
  subredditsError,
  selectedCommunity,
  onCommunityChange,
  onRetry,
}) => {
  // Transform subreddits to react-select format
  const subredditOptions = subreddits.map((subreddit) => ({
    value: subreddit.display_name_prefixed,
    label: subreddit.display_name_prefixed,
    key: subreddit.id,
  }));

  // Handle change for react-select
  const handleChange = (selectedOption) => {
    onCommunityChange({
      target: {
        name: 'community',
        value: selectedOption ? selectedOption.value : '',
      },
    });
  };

  // Determine what to show based on loading/error states
  const getPlaceholder = () => {
    if (subredditsLoading) return 'Loading subreddits...';
    if (subredditsError) return 'Error loading subreddits';
    return 'Select a subreddit';
  };

  // Async load options for subreddit search
  const loadOptions = useCallback(async (inputValue, callback) => {
    if (!inputValue) {
      // Show user's subreddits if no input
      callback(subredditOptions);
      return;
    }
    try {
      const response = await fetch(`/api/reddit/search-subreddits?q=${encodeURIComponent(inputValue)}`);
      if (!response.ok) {
        callback([]);
        return;
      }
      const data = await response.json();
      const options = (data.subreddits || []).map((subreddit) => ({
        value: subreddit.display_name_prefixed,
        label: subreddit.display_name_prefixed,
        key: subreddit.id,
      }));
      callback(options);
    } catch (error) {
      callback([]);
    }
  }, [subredditOptions]);

  return (
    <div className="mb-4">
      <AsyncSelect
        cacheOptions
        defaultOptions={subredditOptions}
        loadOptions={loadOptions}
        value={
          selectedCommunity
            ? { value: selectedCommunity, label: selectedCommunity }
            : null
        }
        onChange={handleChange}
        isLoading={subredditsLoading}
        placeholder={getPlaceholder()}
        noOptionsMessage={() => "No subreddits found"}
        filterOption={null} // Let async handle filtering
        classNamePrefix="react-select"
      />

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