import mongoose from 'mongoose';

const { Schema } = mongoose;

const communityPostSchema = new Schema({
  
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }], // Tags to categorize posts
  comments: [
    {
      comment_id: {
        type: String,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
        ref: 'User',
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  image:{
    type:String, //url
  },
}, { timestamps: true });

 export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);


