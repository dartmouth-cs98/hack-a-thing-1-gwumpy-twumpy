import mongoose, { Schema } from 'mongoose';

const TweetSchema = new Schema({
  id: { type: Number, unique: true },
  text: String,
  created_at: String,
  sentiment_score: Number,
  sentiment_magnitude: Number,
}, {
  toJSON: {
    virtuals: true,
  },
});

// create model class
const TweetModel = mongoose.model('Tweet', TweetSchema);

export default TweetModel;
