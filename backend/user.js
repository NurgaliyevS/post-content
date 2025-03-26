import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String},
    redditId: String,
    image: String,
    variant_name: { type: String, default: "free" }, // Updated
    subscription_renews_at: { type: String, default: null }, // Updated
    ends_at: { type: String, default: null }, // Updated
    customer_id: String,
    subscription_id: String,
    customer_name: String,
    post_available: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
