import mongoose from "mongoose";

const ScheduledPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  community: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ["text", "link", "image"],
    default: "text"
  },
  scheduledFor: {
    type: Date,
  },
  userTimeZone: {
    type: String,
  },
  status: {
    type: String,
    enum: ["scheduled", "published", "failed", "cancelled"],
    default: "scheduled",
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  failureReason: {
    type: String
  },
  redditAccessToken: {
    type: String,
    required: true
  },
  redditRefreshToken: {
    type: String,
    required: true
  },
  redditPostUrl: {
    type: String
  },
  redditPostId: {
    type: String
  },
  isCrossPosting: {
    type: Boolean,
    default: false
  },
  flairId: {
    type: String
  },
  flairText: {
    type: String
  }
});

export default mongoose.models.ScheduledPost || mongoose.model("ScheduledPost", ScheduledPostSchema);