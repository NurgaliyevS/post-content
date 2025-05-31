// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600

// Simple in-memory cache
const cache = new Map()

export default async function handler(req, res) {
  const { subredditName } = req.query

  // Check cache first
  const cacheKey = `subreddit:${subredditName}`
  const cachedData = cache.get(cacheKey)
  
  if (cachedData && cachedData.timestamp > Date.now() - (CACHE_DURATION * 1000)) {
    // Set cache headers
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=59`)
    return res.status(200).json(cachedData.data)
  }

  try {
    const response = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`, {
      headers: {
        'User-Agent': 'redditscheduler.com/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch subreddit data: ${response.statusText}`)
    }

    const data = await response.json()

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    // Set cache headers
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=59`)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
} 