import React from "react";

import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import ChatHistory from "../components/ChatHistory";

import { useChat } from "../hooks/useChat";

const Chat = () => {

  const {
    chatList,
    selectedChat,
    messages,
    loading,
    openChat,
    newChat,
    askAI,
  } = useChat();

  return (
    <div className="h-full flex flex-col">

      <div className="bg-white border-b flex items-center justify-between px-6 py-4">

        <div>
          <h1 className="text-xl font-semibold">AI Chat</h1>
          <p className="text-gray-500 text-sm">
            Chat with Synapse AI
          </p>
        </div>

        <button
          onClick={newChat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          New Chat
        </button>

      </div>

      <div className="flex flex-1 overflow-hidden">

        <ChatHistory
          chats={chatList}
          selectedChat={selectedChat}
          onSelect={openChat}
          onNewChat={newChat}
        />

        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            loading={loading}
          />
        </div>

      </div>

      <MessageInput
        onSend={askAI}
        disabled={loading}
      />

    </div>
  );
};

export default Chat;