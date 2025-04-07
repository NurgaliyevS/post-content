import connectMongoDB from "@/backend/mongodb";
import PostMetrics from "@/backend/PostMetricsSchema";
import User from "@/backend/user";
import { Resend } from "resend";
import { DateTime } from "luxon";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize Resend with API key
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
      ...(isWeeklyReport
        ? {} // No isEarlyEmailSent filter for weekly reports
        : { isEarlyEmailSent: false }), // Only for early reports
    })
      .sort({ impressions: -1 })
      .limit(5);

    if (metrics.length === 0) {
      return res.status(200).json({
        message: isWeeklyReport
          ? "No metrics for weekly report"
          : "No new metrics to report",
      });
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
        console.log(isWeeklyReport, "isWeeklyReport");

        if (isWeeklyReport) {
          // Send weekly digest
          const { data, error } = await weeklyEmail(user, userMetrics);
          if (error) {
            console.error(
              `Failed to send weekly email to user ${userId}:`,
              error
            );
            results.push({
              userId,
              status: "error",
              error: error,
            });
          } else {
            results.push({
              userId,
              status: "sent",
              type: "weekly",
              postsCount: userMetrics.length,
            });
          }
        } else {
          // Send individual email for each metric with delay between sends
          for (const metric of userMetrics) {
            try {
              const { data, error } = await earlyEmail(user, metric);

              if (error) {
                console.error(
                  `Failed to send email for post ${metric.postId}:`,
                  error
                );
                results.push({
                  userId,
                  postId: metric.postId,
                  status: "error",
                  error: error,
                });
                continue;
              }

              // Update the metric to mark email as sent
              await PostMetrics.findByIdAndUpdate(metric._id, {
                isEarlyEmailSent: true,
                lastUpdated: new Date(),
              });

              results.push({
                userId,
                postId: metric.postId,
                status: "sent",
              });

              // Add 1 second delay between emails to avoid rate limits
              await delay(1000);
            } catch (error) {
              console.error(
                `Error sending email for post ${metric.postId}:`,
                error
              );
              results.push({
                userId,
                postId: metric.postId,
                status: "error",
                error: error.message,
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
        results.push({
          userId,
          status: "error",
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      message: `Processed ${results.length} emails`,
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
  const beginningOfWeek = DateTime.now().startOf("week").toUTC();
  const endOfWeek = DateTime.now().endOf("week").toUTC();

  // Sort metrics by impressions for top performers
  const sortedMetrics = [...metrics].sort((a, b) => b.upvotes - a.upvotes);
  const topPerformers = sortedMetrics.slice(0, 5); // Top 5 posts

  // Calculate total stats
  const totalStats = metrics.reduce(
    (acc, metric) => {
      acc.impressions += metric.impressions || 0;
      acc.upvotes += metric.upvotes || 0;
      acc.comments += metric.comments || 0;
      return acc;
    },
    { impressions: 0, upvotes: 0, comments: 0 }
  );

  console.log(totalStats, "totalStats");
  console.log(topPerformers, "topPerformers");

  try {
    const { data, error } = await resend.emails.send({
      from: "RedditScheduler <updates@redditscheduler.com>",
      to: user.email,
      subject: `Weekly Digest: Highlights from ${beginningOfWeek.toFormat("MMM dd")} - ${endOfWeek.toFormat("MMM dd, yyyy")}`,
      html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #ececec;border-radius:10px;padding:24px;max-width:600px" width="100%">
        <tbody>
          <tr>
            <td style="padding-bottom:20px;text-align:center">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="text-align:center;">
              <img alt="RedditScheduler" src="https://redditscheduler.com/logoAndName.png" style="display:block;width:auto;height:40px;margin:0 auto;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <h1 style="color:#1f2937;text-decoration:none;font-size:24px;margin:0;text-align:center">
                Your Weekly Performance Report
              </h1>
              <p style="color:#6b7280;font-size:16px;line-height:24px;text-align:center;margin-top:12px">
                Here's how your Reddit posts performed this week
              </p>
            </td>
          </tr>

          <!-- Weekly Summary -->
          <tr>
            <td style="padding:24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:16px;background-color:#f9fafb;border-radius:8px;">
                    <h2 style="color:#1f2937;font-size:18px;margin:0 0 16px 0">Weekly Summary</h2>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color:#4b5563;font-size:14px;">Total Upvotes:</td>
                        <td style="color:#3b82f6;font-weight:600;text-align:right">${totalStats.upvotes.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="color:#4b5563;font-size:14px;">Total Comments:</td>
                        <td style="color:#3b82f6;font-weight:600;text-align:right">${totalStats.comments.toLocaleString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Performing Posts -->
          <tr>
            <td style="padding-bottom:24px;">
              <h2 style="color:#1f2937;font-size:18px;margin:0 0 16px 0">Top Performing Posts</h2>
              ${topPerformers
                .map(
                  (post, index) => `
                <div style="margin-bottom:${index === topPerformers.length - 1 ? "0" : "16px"};padding:16px;border:1px solid #e5e7eb;border-radius:8px;">
                  <h3 style="color:#1f2937;font-size:16px;margin:0 0 12px 0">${post.title}</h3>
                  <table width="100%" cellpadding="3" cellspacing="0">
                    <tr>
                      <td style="color:#4b5563;font-size:14px;">Upvotes:</td>
                      <td style="color:#3b82f6;font-weight:600;text-align:right">${post.upvotes.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="color:#4b5563;font-size:14px;">Comments:</td>
                      <td style="color:#3b82f6;font-weight:600;text-align:right">${post.comments.toLocaleString()}</td>
                    </tr>
                    ${
                      post.upvoteRatio
                        ? `
                    <tr>
                      <td style="color:#4b5563;font-size:14px;">Upvote Ratio:</td>
                      <td style="color:#3b82f6;font-weight:600;text-align:right">${(post.upvoteRatio * 100).toFixed(0)}%</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>
                  <div style="margin-top:12px;">
                    <a href="${post.postUrl}" style="background-color:#3b82f6;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block">View Post →</a>
                  </div>
                </div>
              `
                )
                .join("")}
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;border-top:1px solid #e5e7eb;">
              <p style="color:gray;font-size:12px;text-align:center;margin:0">
                © ${new Date().getFullYear()} RedditScheduler, All rights reserved.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      `,
    });

    if (error) {
      console.error("Error sending weekly email:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error sending weekly email:", error);
    return { data: null, error: error.message };
  }
}

async function earlyEmail(user, metric) {
  console.log("Sending email for:", {
    to: user.email,
    postId: metric.postId,
    title: metric.title,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "RedditScheduler <updates@redditscheduler.com>",
      to: user.email,
      subject: `Metrics Report - ${metric.title}`,
      html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #ececec;border-radius:10px;padding:24px;max-width:540px" width="100%">
        <tbody>
          <tr>
            <td style="padding-bottom:20px;text-align:center">
              <img alt="RedditScheduler" src="https://redditscheduler.com/logoAndName.png" style="display:block;width:auto;height:40px;margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="color:#1f2937;text-decoration:none;font-size:22px;margin:0">
                ${metric.title}
              </h1>
              <p style="color:#6b7280;font-size:16px;line-height:20px">
                It has been a few hours since you published your post. Check out these metrics to get a snapshot of how it's doing.
              </p>
              <p style="color:#6b7280;font-size:16px;line-height:20px;margin:0">
                You can also
                <a style="color:#3b82f6;text-decoration:underline;text-decoration-color:#3b82f6" href="${metric.postUrl}">view live post</a>
                for the most up-to-date metrics.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;padding-top:40px">
              <div style="border-bottom:1px solid #e5e7eb"></div>
            </td>
          </tr>
  
          <!-- Upvotes -->
          <tr>
            <td>
              <p style="color:#4b5563;font-weight:800;margin:0;font-size:12px;letter-spacing:0.05em;margin-bottom:8px">UPVOTES</p>
              <p style="margin:0;font-size:0px;line-height:1;font-family:Helvetica,sans-serif">
                <span style="font-size:48px;color:#3b82f6;font-weight:900">${metric.upvotes}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;padding-top:20px">
              <div style="border-bottom:1px solid #e5e7eb"></div>
            </td>
          </tr>

          <!-- Upvote Ratio -->
          <tr>
            <td>
              <p style="color:#4b5563;font-weight:800;margin:0;font-size:12px;letter-spacing:0.05em;margin-bottom:8px">UPVOTE RATIO</p>
              <p style="margin:0;font-size:0px;line-height:1;font-family:Helvetica,sans-serif">
                <span style="font-size:48px;color:#3b82f6;font-weight:900">${metric.upvoteRatio}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;padding-top:20px">
              <div style="border-bottom:1px solid #e5e7eb"></div>
            </td>
          </tr>
  
          <!-- Comments -->
          <tr>
            <td>
              <p style="color:#4b5563;font-weight:800;margin:0;font-size:12px;letter-spacing:0.05em;margin-bottom:8px">COMMENTS</p>
              <p style="margin:0;font-size:0px;line-height:1;font-family:Helvetica,sans-serif">
                <span style="font-size:48px;color:#3b82f6;font-weight:900">${metric.comments}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;padding-top:20px">
              <div style="border-bottom:1px solid #e5e7eb"></div>
            </td>
          </tr>
  
          <!-- Community -->
          <tr>
            <td>
              <p style="color:#4b5563;font-weight:800;margin:0;font-size:12px;letter-spacing:0.05em;margin-bottom:8px">POSTED IN</p>
              <p style="margin:0;font-size:0px;line-height:1;font-family:Helvetica,sans-serif">
                <span style="font-size:24px;color:#4b5563;font-weight:900">r/${metric.community}</span>
              </p>
            </td>
          </tr>
  
          <tr>
            <td style="padding-top:40px;text-align:center">
              <a href="${metric.postUrl}" style="background-color:#3b82f6;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block">View Post on Reddit</a>
            </td>
          </tr>
  
          <tr>
            <td style="padding-top:40px">
              <hr style="background-color:#ececec;border:0;height:1px;margin:0">
              <p style="color:gray;font-size:12px;text-align:center;margin-top:20px">
                © ${new Date().getFullYear()} RedditScheduler, All rights reserved.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error sending early email:", error);
    return { data: null, error: error.message };
  }
}
