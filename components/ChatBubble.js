import React from 'react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={isUser ? 'bg-white' : 'bg-gray-50'}>
      <div className="max-w-2xl mx-auto py-4 flex">
        <span className="font-semibold w-20 text-gray-700">
          {isUser ? 'You' : 'Assistant'}
        </span>
        <p className="whitespace-pre-wrap text-gray-900">
          {message.text}
        </p>
      </div>
    </div>
  );
}
