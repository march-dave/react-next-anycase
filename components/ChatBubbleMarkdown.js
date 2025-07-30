import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatBubbleMarkdown({ message }) {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch (err) {
      // ignore errors
    }
  };

  return (
    <div className={isUser ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
      <div className={`max-w-2xl mx-auto py-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className="space-y-1 max-w-full">
          <span className="text-xs text-gray-500">
            {isUser ? 'You' : 'Assistant'}
            {message.time && <span className="ml-1 text-gray-400">{message.time}</span>}
          </span>
          <div className="flex items-start gap-2">
            <div
              className={`rounded-md px-4 py-2 border prose dark:prose-invert whitespace-pre-wrap ${
                isUser
                  ? 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-500 hover:underline mt-1"
              aria-label="Copy message"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
