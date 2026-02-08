import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isReported: { type: Boolean, default: false },
}, { timestamps: true });

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent'
});

// Ensure virtuals are included in JSON
commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export default mongoose.model("Comment", commentSchema);