import React from 'react';

export default function ClearChatButton({
  onClear,
  label = 'Clear',
  confirmMessage = 'Clear chat history?'
}) {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onClear();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label={label}
    >
      {label}
    </button>
  );
}
