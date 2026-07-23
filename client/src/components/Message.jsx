import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Copy, Check } from "lucide-react";

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");

  const code = String(children).replace(/\n$/, "");

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden">

      <button
        onClick={copyCode}
        className="absolute right-3 top-3 z-10 bg-gray-700 hover:bg-gray-600 text-white rounded-md p-2 transition"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      <SyntaxHighlighter
        language={match ? match[1] : "text"}
        style={oneDark}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
};

const Message = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-4xl rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none">

            <ReactMarkdown
              components={{
                code({
                  inline,
                  className,
                  children,
                  ...props
                }) {
                  if (inline) {
                    return (
                      <code
                        className="bg-gray-200 px-1 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock className={className}>
                      {children}
                    </CodeBlock>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

          </div>
        )}
      </div>
    </div>
  );
};

export default Message;