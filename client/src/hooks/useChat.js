import { useEffect, useState } from "react";
import {
  createChat,
  getChats,
  getMessages,
  sendMessage,
  deleteChat,
  renameChat,
} from "../utils/chatApi.js";

export const useChat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  // Load all chats
  const loadChats = async () => {
    try {
      const res = await getChats();
      const chats = res.data.chats || [];

      setChatList(chats);

      // Open the first chat automatically
      if (chats.length > 0 && !selectedChat) {
        openChat(chats[0]._id);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  // Open a chat
  const openChat = async (id) => {
    try {
      setSelectedChat(id);

      // Clear previous messages while loading
      setMessages([]);

      const res = await getMessages(id);

      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // Create a new chat
  const newChat = async () => {
    try {
      const res = await createChat();

      const chat = res.data.chat;

      setChatList((prev) => [chat, ...prev]);
      setSelectedChat(chat._id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  // Send message to AI
  const askAI = async (text) => {
    if (!text.trim()) return;
    if (loading) return;

    setLoading(true);

    try {
      let chatId = selectedChat;

      // Create chat if none exists
      if (!chatId) {
        const res = await createChat();

        const chat = res.data.chat;

        chatId = chat._id;

        setSelectedChat(chatId);
        setChatList((prev) => [chat, ...prev]);
      }

      // Show user message instantly
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: text,
        },
      ]);

      // Get AI response
      const res = await sendMessage(chatId, text);

      // Show AI reply
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
        },
      ]);

      // Refresh chat list (for auto-renamed titles)
      await loadChats();
    } catch (err) {
      console.error("Failed to send message:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    chatList,
    selectedChat,
    messages,
    loading,

    openChat,
    newChat,
    askAI,

    setChatList,
    setMessages,

    deleteChat,
    renameChat,
    loadChats,
  };
};