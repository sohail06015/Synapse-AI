import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


//  create new chat
export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      title: "New Chat",
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get chat

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user._id,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({
      chatId: id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// send message

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Save user message
    await Message.create({
      chatId: id,
      role: "user",
      content: message,
    });

    // Auto rename chat after first message
if (chat.title === "New Chat") {
  chat.title =
    message.length > 40
      ? message.substring(0, 40) + "..."
      : message;

  await chat.save();
}

// Load only the latest 30 messages
const messages = await Message.find({
  chatId: id,
})
.sort({ createdAt: -1 })
.limit(30);

// Reverse to maintain chronological order
messages.reverse();

    

    // Prepare conversation history
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Gemini
    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
    });

    const aiReply = result.text;

    // Save AI response
    await Message.create({
      chatId: id,
      role: "assistant",
      content: aiReply,
    });

    // Update latest activity
    chat.updatedAt = new Date();
    await chat.save();

    res.status(200).json({
      success: true,
      reply: aiReply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const renameChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    chat.title = title.trim();

    await chat.save();

    res.status(200).json({
      success: true,
      message: "Chat renamed successfully",
      chat,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Delete all messages in this chat
    await Message.deleteMany({
      chatId: id,
    });

    // Delete the chat
    await Chat.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};