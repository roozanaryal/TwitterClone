import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true, enum: ["like", "comment", "follow"] },
    message: { type: String, required: true },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    relatedComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }, // set when marked as read
    expireAt: { type: Date, index: { expires: 0 } }, // TTL field
  },
  { timestamps: true }
);

// When isRead changes to true, set expireAt = readAt + 7 days
notificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead) {
    this.readAt = new Date();
    this.expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model("Notification", notificationSchema);
