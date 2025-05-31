import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function SubredditAnalysis() {
  const router = useRouter()
  const { subredditName } = router.query
  const [subredditData, setSubredditData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subredditName) return

    const fetchSubredditData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/subreddit/${subredditName}`)
        if (!response.ok) {
          throw new Error('Failed to fetch subreddit data')
        }
        const data = await response.json()
        setSubredditData(data.data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setSubredditData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSubredditData()
  }, [subredditName])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  if (!subredditData) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Analysis for r/{subredditName}
      </h1>
      <div className="bg-base-200 p-6 rounded-lg">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            {subredditData.icon_img && (
              <img 
                src={subredditData.icon_img} 
                alt={`${subredditName} icon`}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold">{subredditData.title}</h2>
              <p className="text-base-content/70">r/{subredditData.display_name}</p>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Subscribers</div>
              <div className="stat-value">{subredditData.subscribers?.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Active Users</div>
              <div className="stat-value">{subredditData.active_user_count?.toLocaleString()}</div>
            </div>
          </div>
          {subredditData.public_description && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-base-content/80">{subredditData.public_description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 