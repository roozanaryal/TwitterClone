import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
    enum: ["like", "comment", "follow"],
  },
  message: {
    type: String,
    required: true,
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Notification", notificationSchema);
