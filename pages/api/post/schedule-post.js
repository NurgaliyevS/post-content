import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";
import { parse, isValid, format, addMinutes, differenceInMinutes } from "date-fns";

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
    const { community, title, text, selectedDate, selectedTime, timeZone, type = "text" } = req.body;

    // Use client's timezone or default to UTC
    const userTimeZone = timeZone || 'UTC';

    console.log(req.body, 'req.body');

    // Validate required fields
    if (!community || !title || !selectedDate || !selectedTime) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { community, title, text, selectedDate, selectedTime }
      });
    }
    
    // For text posts, ensure text content is provided
    if (type === 'text' && !text) {
      return res.status(400).json({ 
        message: 'Text content is required for text posts',
      });
    }

    // Check if the Reddit access token is available in the session
    if (!session.accessToken) {
      return res.status(401).json({ 
        message: 'Reddit authentication required',
        error: 'No Reddit access token found in session'
      });
    }
    
    // Check if the Reddit refresh token is available in the session
    if (!session.refreshToken) {
      return res.status(401).json({ 
        message: 'Reddit refresh token required',
        error: 'No Reddit refresh token found in session'
      });
    }

    // Parse and validate the date using date-fns
    let scheduledDate;
    
    try {
      // Validate date format (YYYY-MM-DD)
      const parsedDate = parse(selectedDate, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        throw new Error(`Invalid date format: ${selectedDate}. Expected YYYY-MM-DD`);
      }

      // Parse time (HH:MM AM/PM)
      const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/;
      const timeMatch = selectedTime.match(timeRegex);
      if (!timeMatch) {
        throw new Error(`Invalid time format: ${selectedTime}. Expected HH:MM AM/PM`);
      }

      const [_, hours, minutes, period] = timeMatch;
      
      // Create a date object for the selected date and time
      const dateTimeStr = `${selectedDate} ${hours}:${minutes} ${period}`;
      scheduledDate = parse(dateTimeStr, 'yyyy-MM-dd h:mm aa', new Date());

      if (!isValid(scheduledDate)) {
        throw new Error(`Invalid date/time: ${dateTimeStr}`);
      }
      
      // Log for debugging
      console.log('Parsed scheduled date:', format(scheduledDate, 'PPPp'));
      console.log('User timezone:', userTimeZone);
      console.log('Current server time:', format(new Date(), 'PPPp'));
      
    } catch (error) {
      return res.status(400).json({ 
        message: 'Invalid date or time format',
        error: error.message,
        received: { selectedDate, selectedTime, timeZone: userTimeZone }
      });
    }
    
    // Get current time
    const now = new Date();
    
    // Calculate time difference in minutes
    const minutesInFuture = differenceInMinutes(scheduledDate, now);
    
    // Determine if we should post immediately or schedule
    const shouldPostImmediately = minutesInFuture <= 2;
    
    // If we should post immediately, send it to Reddit now
    if (shouldPostImmediately) {
      console.log('Posting to Reddit immediately...');
      
      try {
        // Construct Reddit API request for submission
        const redditApiUrl = `https://oauth.reddit.com/api/submit`;
        
        // Make the actual API call to Reddit
        const redditResponse = await fetch(redditApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'RedditScheduler/1.0.0'
          },
          body: new URLSearchParams({
            'sr': community.replace('r/', ''), // Remove 'r/' prefix if present
            'kind': 'self',                   // 'self' for text posts
            'title': title,
            'text': text,
            'api_type': 'json',
            'resubmit': 'true'
          })
        });

        const redditData = await redditResponse.json();

        if (!redditResponse.ok) {
          throw new Error(redditData.error || redditData.message || 'Failed to submit post to Reddit');
        }
        
        // Connect to MongoDB
        await connectMongoDB();
        
        const postedPost = new ScheduledPost({
          userId: session.user.id,
          community: community.replace('r/', ''),
          title,
          text,
          type,
          scheduledFor: now, // Use current time
          timeZone: userTimeZone,
          status: 'published',
          redditPostId: redditData.json?.data?.id || null,
          redditFullname: redditData.json?.data?.name || null,
          redditAccessToken: session.accessToken,
          redditRefreshToken: session.refreshToken,
          postedAt: now
        });
        
        const savedPost = await postedPost.save();

        return res.status(200).json({
          message: 'Post submitted to Reddit immediately',
          data: {
            id: savedPost._id,
            community,
            title,
            postedAt: format(now, 'PPPp'),
            redditPostId: redditData.json?.data?.id || null,
            redditFullname: redditData.json?.data?.name || null,
            redditUrl: redditData.json?.data?.url || null
          }
        });
        
      } catch (error) {
        console.error('Error posting to Reddit:', error);
        return res.status(500).json({ 
          message: 'Error posting to Reddit',
          error: error.message 
        });
      }
    } 
    // Otherwise, schedule the post for later
    else {
      // Connect to MongoDB
      await connectMongoDB();
      
      // Create a new scheduled post
      const scheduledPost = new ScheduledPost({
        userId: session.user.id,
        community: community.replace('r/', ''), // Remove 'r/' prefix if present
        title,
        text,
        type,
        scheduledFor: scheduledDate,
        timeZone: userTimeZone, // Store the user's timezone for reference
        status: 'scheduled',
        redditAccessToken: session.accessToken,
        redditRefreshToken: session.refreshToken
      });
      
      const savedPost = await scheduledPost.save();

      return res.status(200).json({
        message: 'Post scheduled successfully',
        data: {
          id: savedPost._id,
          community,
          title,
          scheduledFor: format(scheduledDate, 'PPPp'),
          userTimeZone: userTimeZone,
          createdAt: format(savedPost.createdAt, 'PPPp')
        }
      });
    }

  } catch (error) {
    console.error('Error handling post request:', error);
    return res.status(500).json({ 
      message: 'Error handling post request',
      error: error.message 
    });
  }
}