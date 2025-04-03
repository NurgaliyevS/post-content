import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String },
    redditId: String,
    image: String,
    variant_name: { type: String, default: "free" },
    subscription_renews_at: { type: String, default: null },
    ends_at: { type: String, default: null },
    customer_id: String,
    subscription_id: String,
    customer_name: String,
    post_available: { type: Number, default: 0 },
    has_received_first_subscription_email: { type: Boolean, default: false },
    is_in_trial: { type: Boolean, default: false },
    trial_ends_at: { type: String, default: null },
    is_cross_posting: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;