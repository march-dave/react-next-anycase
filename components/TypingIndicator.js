import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto py-3 flex justify-start">
        <div className="space-y-1 max-w-full">
          <span className="text-xs text-gray-500">Assistant</span>
          <div className="flex items-start gap-2">
            <div className="rounded-md px-4 py-2 border bg-white text-gray-900 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
