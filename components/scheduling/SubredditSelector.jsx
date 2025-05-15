import React, { useCallback } from "react";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num;
};

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
    subscribers: subreddit.subscribers,
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

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Async load options for subreddit search with debouncing
  const loadOptions = useCallback(
    debounce(async (inputValue, callback) => {
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
          subscribers: subreddit.subscribers,
        }));
        callback(options);
      } catch (error) {
        callback([]);
      }
    }, 500), // 500ms delay
    [subredditOptions]
  );

  // Custom rendering for options and selected value (name + members)
  const formatOptionLabel = (option) => (
    <div>
      <div className="font-medium">{option.label}</div>
      {option.subscribers !== undefined && (
        <div className="text-xs text-gray-400">{formatNumber(option.subscribers)} members</div>
      )}
    </div>
  );

  // Find the selected option object for correct rendering
  const selectedOption = selectedCommunity
    ? subredditOptions.find(opt => opt.value === selectedCommunity) || { value: selectedCommunity, label: selectedCommunity }
    : null;

  return (
    <div className="mb-4">
      <AsyncSelect
        cacheOptions
        defaultOptions={subredditOptions}
        loadOptions={loadOptions}
        value={selectedOption}
        onChange={handleChange}
        isLoading={subredditsLoading}
        placeholder={getPlaceholder()}
        noOptionsMessage={() => "No subreddits found"}
        filterOption={null} // Let async handle filtering
        classNamePrefix="react-select"
        formatOptionLabel={formatOptionLabel}
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