import mongoose from "mongoose";

const PostMetricsSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  community: {
    type: String,
    required: true
  },
  impressions: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  postUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isEarlyEmailSent: {
    type: Boolean,
    default: false
  },
  upvoteRatio: {
    type: Number,
    default: 0
  }
});

export default mongoose.models.PostMetrics || mongoose.model("PostMetrics", PostMetricsSchema); 