// controllers/conversationController.js
import { Conversation } from "../models/conversation.model.js";
import { User } from "../models/user.model.js";

// Save user and bot messages to a conversation
export const addMessageToConversation = async (userId, role, content) => {
  try {
    // Check if a conversation exists for the user
    let conversation = await Conversation.findOne({ user: userId });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        user: userId,
        messages: [{ role, content }],
      });
    } else {
      // Append the new message to the existing conversation
      conversation.messages.push({ role, content });
    }

    await conversation.save();
    return conversation;
  } catch (error) {
    console.error("Error adding message to conversation:", error);
    throw error;
  }
};
