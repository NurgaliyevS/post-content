import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    redditId: { type: String, unique: true },
    image: String,
    receipt_link: String,
    customer_portal_url: String,
    variant_name: { type: String, default: 'free' }, // Updated
    subscription_renews_at: { type: String, default: null }, // Updated
    ends_at: { type: String, default: null }, // Updated
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
