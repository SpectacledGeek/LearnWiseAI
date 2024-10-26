import mongoose from "mongoose";




const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["notes", "mcqs"],
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

 const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;