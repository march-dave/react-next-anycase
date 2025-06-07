import React from 'react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={isUser ? 'bg-white' : 'bg-gray-50'}>
      <div
        className={`max-w-2xl mx-auto py-3 flex ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className="space-y-1 max-w-full">
          <span className="text-xs text-gray-500">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <p
            className={`rounded-md px-4 py-2 border whitespace-pre-wrap ${
              isUser
                ? 'bg-gray-100 text-gray-900 border-gray-300'
                : 'bg-white text-gray-900 border-gray-200'
            }`}
          >
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}
