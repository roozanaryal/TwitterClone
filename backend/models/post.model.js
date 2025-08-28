import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure every post has an owner
    },
    // content: {
    //   type: String,
    // },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280, // Enforce Twitter-like length
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.index({ postOwner: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
