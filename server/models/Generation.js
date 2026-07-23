import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  type: {
    type: String, enum: ['article', 'image', 'blog-title', 'resume-review'], required: true
  },
  prompt: {
    type: String, required: true
  },
  result: {
    type: String, required: true
  },
  length: {
    type: Number
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],


  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Generation', generationSchema);
