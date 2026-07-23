import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { Bot } from "lucide-react";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="text-center max-w-xl">

          <Bot
            size={60}
            className="mx-auto text-blue-600 mb-5"
          />

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Synapse AI
          </h1>

          <p className="mt-3 text-gray-500">
            Ask coding questions, generate content, debug
            code, summarize text, or get help with anything.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-8">

      <div className="max-w-5xl mx-auto space-y-6">

        {messages.map((message, index) => (
          <Message
            key={message._id || index}
            message={message}
          />
        ))}

        {loading && (
          <div className="flex justify-start">

            <div className="bg-white border rounded-2xl px-5 py-3 shadow-sm">

              <div className="flex items-center gap-2">

                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>

                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>

                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>

              </div>

            </div>

          </div>
        )}

        <div ref={bottomRef}></div>

      </div>

    </div>
  );
};

export default ChatWindow;