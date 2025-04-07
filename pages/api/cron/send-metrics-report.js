import connectMongoDB from "@/backend/mongodb";
import PostMetrics from "@/backend/PostMetricsSchema";
import User from "@/backend/user";
import { Resend } from "resend";
import { DateTime } from "luxon";

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint will be called by Vercel Cron
export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("hey");

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Get current time in UTC
    const currentTimeUTC = DateTime.now().toUTC();

    // Determine if this is a weekly report
    const isWeeklyReport = req.query.type === "weekly";

    // Set the time range based on report type
    const timeRange = isWeeklyReport ? { days: 7 } : { hours: 6 };

    // Find metrics from the specified time range
    const metrics = await PostMetrics.find({
      createdAt: {
        $gte: currentTimeUTC.minus(timeRange).toJSDate(),
      },
    })
      .sort({ impressions: -1 })
      .limit(5);

    if (metrics.length === 0) {
      return res.status(200).json({ message: "No metrics to report" });
    }

    // Group metrics by userId
    const metricsByUser = metrics.reduce((acc, metric) => {
      if (!acc[metric.userId]) {
        acc[metric.userId] = [];
      }
      acc[metric.userId].push(metric);
      return acc;
    }, {});

    const results = [];

    // Send report to each user
    for (const [userId, userMetrics] of Object.entries(metricsByUser)) {
      try {
        // Get user email
        const user = await User.findById(userId);
        if (!user?.email) {
          console.log(`No email found for user ${userId}`);
          continue;
        }

        console.log(user, "user");

        // Generate HTML for metrics table
        const metricsHtml = userMetrics
          .map(
            (metric) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${metric.title}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${metric.impressions.toLocaleString()}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${metric.upvotes.toLocaleString()}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${metric.comments.toLocaleString()}</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="${metric.postUrl}" style="color: #0066cc;">View Post</a></td>
          </tr>
        `
          )
          .join("");

        // Calculate totals
        const totals = userMetrics.reduce(
          (acc, metric) => ({
            impressions: acc.impressions + metric.impressions,
            upvotes: acc.upvotes + metric.upvotes,
            comments: acc.comments + metric.comments,
          }),
          { impressions: 0, upvotes: 0, comments: 0 }
        );

        if (isWeeklyReport) {
          await weeklyEmail(user, metrics);
        } else {
          await earlyEmail(user, metrics);
        }

        // Send email using Resend
        // await resend.emails.send({
        //   from: 'RedditScheduler <updates@mg.redditscheduler.com>',
        //   to: user.email,
        //   subject: isWeeklyReport ?
        //     'Your Weekly Reddit Post Performance Report' :
        //     'Early Performance Report for Your Recent Reddit Posts',
        //   html: `
        //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        //       <h2 style="color: #333;">${isWeeklyReport ? 'Weekly' : 'Early'} Performance Report</h2>

        //       <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        //         <h3 style="margin: 0 0 10px 0;">Summary</h3>
        //         <p style="margin: 5px 0;">Total Impressions: ${totals.impressions.toLocaleString()}</p>
        //         <p style="margin: 5px 0;">Total Upvotes: ${totals.upvotes.toLocaleString()}</p>
        //         <p style="margin: 5px 0;">Total Comments: ${totals.comments.toLocaleString()}</p>
        //       </div>

        //       <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        //         <thead>
        //           <tr style="background: #f8f9fa;">
        //             <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Post Title</th>
        //             <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Impressions</th>
        //             <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Upvotes</th>
        //             <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Comments</th>
        //             <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Link</th>
        //           </tr>
        //         </thead>
        //         <tbody>
        //           ${metricsHtml}
        //         </tbody>
        //       </table>

        //       <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        //         <p style="color: #666; font-size: 14px;">
        //           View more detailed analytics in your
        //           <a href="https://redditscheduler.com/dashboard/analytics" style="color: #0066cc;">dashboard</a>.
        //         </p>
        //       </div>
        //     </div>
        //   `
        // });

        results.push({
          userId,
          email: user.email,
          status: "sent",
          posts: userMetrics.length,
        });
      } catch (error) {
        console.error(`Error sending report to user ${userId}:`, error);
        results.push({
          userId,
          status: "error",
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      message: `Sent reports to ${results.length} users`,
      results,
    });
  } catch (error) {
    console.error("Error sending metrics reports:", error);
    return res.status(500).json({
      message: "Error sending metrics reports",
      error: error.message,
    });
  }
}

async function weeklyEmail(user, metrics) {
  await resend.emails.send({
    from: "RedditScheduler <updates@mg.redditscheduler.com>",
    to: user.email,
    subject: "Your Weekly Reddit Post Performance Report",
    html: `
    `,
  });
}

async function earlyEmail(user, metrics) {
  await resend.emails.send({
    from: "RedditScheduler <updates@mg.redditscheduler.com>",
    to: user.email,
    subject: "Performance Report - ",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
    <p>Hi ${user?.customer_name || user?.name},</p>
    <h2 style="color: #333;">Performance Report</h2>

    
    </div>
  `,
  });
}
