import React, { useState } from 'react';

export default function ClearChatButton({
  onClear,
  label = 'Clear',
  confirmMessage = 'Clear chat history?'
}) {
  const [status, setStatus] = useState('');
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onClear();
      setStatus('Cleared!');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label={label}
    >
      <span aria-live="polite">{status || label}</span>
    </button>
  );
}
