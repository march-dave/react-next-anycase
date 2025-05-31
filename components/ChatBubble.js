import React from 'react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`rounded-lg p-2 max-w-xs whitespace-pre-wrap ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
        {message.text}
      </div>
    </div>
  );
}
