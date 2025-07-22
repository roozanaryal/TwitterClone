import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import asyncHandler from "express-async-handler";
import { param, query, validationResult } from "express-validator";
import Conversation from "../models/conversation.model.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const senderId = req.user._id;
    const { message } = req.body;
    const { id: reciverId } = req.params;

    if (!senderId || !reciverId || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const senderUser = await User.findById(senderId);
    const reciverUser = await User.findById(reciverId);

    if (!senderUser || !reciverUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find existing conversation or create new
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId], $size: 2 },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    // Use correct field names for Message
    const messageData = new Message({
      sender: senderId,
      receiver: reciverId,
      message,
      conversationId: conversation._id,
    });

    await Promise.all([
      messageData.save(),
      conversation.updateOne({
        $push: { messages: messageData._id },
      }),
    ]);

    //SOCKET IO Functionality

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while sending message",
      error: error.message,
    });
  }
});

export const getMessage = asyncHandler(async (req, res) => {
  const errors = queryValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { id: userToChatId } = req.params;
    const userId = req.user._id; // Use consistent _id style

    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, userToChatId],
        $size: 2,
      },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Explicit participant check for security
    const participants = conversation.participants.map(id => id.toString());
    if (!participants.includes(userId.toString())) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not a participant in this conversation",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation found",
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while getting message",
      error: error.message,
    });
  }
});