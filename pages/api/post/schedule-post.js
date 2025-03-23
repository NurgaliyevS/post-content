import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the submitted data
    const { community, title, text, selectedDate, selectedTime } = req.body;

    console.log(req.body, 'req.body');

    // Test data validation
    if (!community || !title || !text || !selectedDate || !selectedTime) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { community, title, text, selectedDate, selectedTime }
      });
    }
    
    // Check if the Reddit access token is available in the session
    if (!session.accessToken) {
      return res.status(401).json({ 
        message: 'Reddit authentication required',
        error: 'No Reddit access token found in session'
      });
    }

    // Construct Reddit API request for submission
    const redditApiUrl = `https://oauth.reddit.com/api/submit`;
    
    // Make the actual API call to Reddit
    const redditResponse = await fetch(redditApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'YourAppName/1.0.0'
      },
      body: new URLSearchParams({
        'sr': community.replace('r/', ''), // Remove 'r/' prefix if present
        'kind': 'self',                   // 'self' for text posts
        'title': title,
        'text': text,
        'api_type': 'json',
        'resubmit': 'true',
        // If you want to schedule for later rather than post immediately
        // uncomment the following and ensure scheduledDateTime is in the correct format
        // 'scheduled_timestamp': Math.floor(scheduledDateTime.getTime() / 1000)
      })
    });

    const redditData = await redditResponse.json();

    if (!redditResponse.ok) {
      throw new Error(redditData.error || redditData.message || 'Failed to submit post to Reddit');
    }

    // Store the scheduled post in your database here if needed
    // const savedPost = await db.scheduledPosts.create({...})

    return res.status(200).json({
      message: 'Post scheduled successfully',
      data: {
        redditApiResponse: redditData,
        community,
        title,
        text,
        selectedDate,
        selectedTime,
        scheduledAt: new Date().toISOString(),
        userId: session.user.id
      }
    });

  } catch (error) {
    console.error('Error scheduling post:', error);
    return res.status(500).json({ 
      message: 'Error scheduling post',
      error: error.message 
    });
  }
}

// Helper function to convert 12-hour time format to 24-hour format
function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours}:${minutes}:00`;
}