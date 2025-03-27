import React from "react";
import Select from 'react-select';

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

  return (
    <div className="mb-4">
      <Select
        options={subredditOptions}
        value={
          selectedCommunity 
            ? { value: selectedCommunity, label: selectedCommunity } 
            : null
        }
        onChange={handleChange}
        isLoading={subredditsLoading}
        placeholder={getPlaceholder()}
        noOptionsMessage={() => "No subreddits found"}
        filterOption={(option, inputValue) => 
          option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.label.toLowerCase().replace('r/', '').includes(inputValue.toLowerCase())
        }
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