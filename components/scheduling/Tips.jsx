import React, { useEffect, useState } from "react";
import { FiTarget } from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { LuTrendingUp } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa6";
import { BiSolidUpvote } from "react-icons/bi";

function getTips(subreddit) {
  return [
    'Lead with specific metrics and timeframes ("How I got 1,247 users in 3 months", "From $0 to $5k MRR in 8 weeks")',
    'Be honest about struggles and failures ("Why my SaaS almost died after 6 months", "I spent $12k on features nobody wanted")',
    'Include exact numbers from your journey ("My SaaS costs breakdown: $847/month to run", "47 customer interviews that changed everything")',
    'Use personal, direct language ("I built a SaaS and here\'s what happened", "My biggest SaaS mistake cost me $8k")',
    'Share behind-the-scenes moments ("The email that saved my SaaS", "How one feature request doubled my revenue")',
    'Ask for community feedback ("Roast my SaaS landing page", "Which pricing model would you choose?")',
  ];
}

function getContentIdeas(subreddit) {
  return [
    'Share your customer experience with real interview snippets and how they shaped your product',
    'Share your complete tech stack breakdown with costs, pros/cons of each tool you use',
    'Break down your pricing strategy experiments with actual conversion data and revenue impact',
    'Tell the story of your first paying customer - how you found them and what convinced them to pay',
    'Analyze your biggest feature failures with user feedback, and lessons learned',
    'Share your customer support horror stories and how you turned angry users into friends',
    'Share your marketing channel experiments with exact spend, results, and ROI calculations',
    'Share your SaaS metrics dashboard with commentary on what each number means for your business',
  ];
}

async function fetchTopPosts(subreddit) {
    try {
        const sub = subreddit.replace(/^r\//, ''); // remove 'r/' prefix
        const res = await fetch(`https://www.reddit.com/r/${sub}/top.json?limit=5&t=all`);
        const data = await res.json();
        return (data.data.children || []).map(child => ({
          title: child.data.title,
          stats: {
            upvotes: child.data.ups,
            comments: child.data.num_comments,
            url: `https://reddit.com${child.data.permalink}`,
          },
          insight: "Posts with high engagement perform best.",
        }));
    } catch (error) {
        console.error('Error fetching top posts:', error);
        return [];
    }
}

function Tips({ subreddit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tips, setTips] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [contentIdeas, setContentIdeas] = useState([]);
  const [tab, setTab] = useState('tips');

  useEffect(() => {
    if (!subreddit) return;

    // Set tips and content ideas using templates
    setTips(getTips(subreddit));
    setContentIdeas(getContentIdeas(subreddit));

    // Fetch top posts from Reddit
    fetchTopPosts(subreddit)
      .then(posts => {
        setTopPosts(posts);
        setLoading(false);
      })
      .catch(() => {
        setTopPosts([]);
        setLoading(false);
      });
  }, [subreddit]);

  if (!subreddit) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <FiTarget className="h-12 w-12 text-gray-300 mb-4" />
        <span className="text-gray-500 text-lg font-medium">
          Select a subreddit to see viral tips, top posts,
          <br />
          and content ideas
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-pulse">
        <span className="loading loading-spinner loading-lg mb-4"></span>
        <span className="text-gray-400 text-lg font-medium">Loading tips for {subreddit}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <span className="text-error text-lg font-medium mb-2">Error loading tips</span>
        <span className="text-gray-400">{error}</span>
      </div>
    );
  }

  // Helper for show more
  const renderList = (items) => (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-base text-gray-800">
          <span className="mt-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  // Helper for posts
  const renderPosts = () => (
    <ul className="flex flex-col gap-4">
      {topPosts.map((post, i) => (
        <li key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="font-semibold text-gray-900 text-base mb-1">{post.title}</div>
          <div className="flex items-center gap-6 text-gray-500 text-sm mb-2 mt-2">
            <span className="flex items-center gap-1"><span className="text-base"><BiSolidUpvote /></span> {post.stats.upvotes}</span>
            <span className="flex items-center gap-1"><FaRegCommentDots className="text-base" /> {post.stats.comments}</span>
            <a href={post.stats.url} className="text-blue-600 hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">View</a>
          </div>
        </li>
      ))}
    </ul>
  );

  // Desktop & Mobile: Tabs
  return (
    <div className="block w-full">
      <div className="tabs tabs-primary tabs-sm tabs-boxed mb-4 w-full flex overflow-x-auto whitespace-nowrap">
        <button
          type="button"
          className={`tab w-full sm:w-1/3 ${tab === 'tips' ? 'tab-active' : ''} flex items-center justify-center gap-1 px-2 text-sm`}
          aria-selected={tab === 'tips'}
          onClick={() => setTab('tips')}
        >
          <LuSparkles className="mr-1" />
          Viral
        </button>
        <button
          type="button"
          className={`tab w-full sm:w-1/3 ${tab === 'posts' ? 'tab-active' : ''} flex items-center justify-center gap-1 px-2 text-sm`}
          aria-selected={tab === 'posts'}
          onClick={() => setTab('posts')}
        >
          <LuTrendingUp className="mr-1" />
          Top
        </button>
        <button
          type="button"
          className={`tab w-full sm:w-1/3 ${tab === 'ideas' ? 'tab-active' : ''} flex items-center justify-center gap-1 px-2 text-sm`}
          aria-selected={tab === 'ideas'}
          onClick={() => setTab('ideas')}
        >
          <FaLightbulb className="mr-1" />
          Ideas
        </button>
      </div>
      <div className="card bg-white border border-gray-200 shadow-none">
        <div className="card-body p-4 sm:p-6">
          {tab === 'tips' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <LuSparkles className="text-yellow-400 text-2xl" />
                <span className="font-bold text-xl text-gray-800">Viral Title Tips</span>
              </div>
              {renderList(tips)}
            </>
          )}
          {tab === 'posts' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <LuTrendingUp className="text-green-500 text-2xl" />
                <span className="font-bold text-xl text-gray-800">Top Posts</span>
              </div>
              {renderPosts()}
            </>
          )}
          {tab === 'ideas' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <FaLightbulb className="text-yellow-400 text-2xl" />
                <span className="font-bold text-xl text-gray-800">Content Ideas</span>
              </div>
              {renderList(contentIdeas)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tips;
