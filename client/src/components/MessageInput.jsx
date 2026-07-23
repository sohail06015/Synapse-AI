import React, { useState } from "react";
import { Send } from "lucide-react";

const MessageInput = ({ onSend , disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t px-6 py-4">
      <div className="flex items-end gap-3">

        <textarea
          rows={1}
          value={message}
          placeholder="Message Synapse AI..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim() }
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition"
        >
          <Send size={20} />
        </button>

      </div>
    </div>
  );
};

export default MessageInput;