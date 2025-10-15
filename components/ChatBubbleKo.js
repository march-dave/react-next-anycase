import React from 'react';

export default function ChatBubble({ message }) {
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
      <div
        className={`max-w-2xl mx-auto py-3 flex ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className="space-y-1 max-w-full">
          <span className="text-xs text-gray-500">
            {isUser ? '사용자' : '어시스턴트'}
            {message.time && (
              <span className="ml-1 text-gray-400">{message.time}</span>
            )}
          </span>
          <div className="flex items-start gap-2">
            <p
              className={`rounded-md px-4 py-2 border whitespace-pre-wrap ${
                isUser
                  ? 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
              }`}
            >
              {message.text}
            </p>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-500 hover:underline mt-1"
              aria-label="메시지 복사"
            >
              복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
