import React from "react";
import { Plus } from "lucide-react";

const ChatHistory = ({
  chats,
  selectedChat,
  onSelect,
  onNewChat,
}) => {
  return (
    <div className="w-72 border-r bg-white flex flex-col">

      <div className="p-4 border-b">

        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Chat
        </button>

      </div>

      <div className="flex-1 overflow-y-auto">

        {chats.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-8">
            No conversations yet.
          </p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelect(chat._id)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition ${
                selectedChat === chat._id
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : ""
              }`}
            >
              <p className="truncate font-medium text-sm">
                {chat.title}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))
        )}

      </div>

    </div>
  );
};

export default ChatHistory;