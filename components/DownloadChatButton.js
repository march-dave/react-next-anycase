import React from 'react';

export default function DownloadChatButton({ messages, label = 'Download' }) {
  const handleDownload = () => {
    const text = messages
      .map(m => `${m.role}${m.time ? ` (${m.time})` : ''}: ${m.text}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label={label}
    >
      {label}
    </button>
  );
}
