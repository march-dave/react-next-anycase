import React from 'react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={isUser ? 'bg-white' : 'bg-gray-50'}>
      <div
        className={`max-w-2xl mx-auto py-2 flex flex-col ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <span className="text-sm text-gray-500 mb-1">
          {isUser ? 'You' : 'Assistant'}
        </span>
        <p
          className={`rounded-lg px-3 py-2 whitespace-pre-wrap ${
            isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
          }`}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
}
