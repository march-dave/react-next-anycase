import React from 'react';

export default function ExportChatButton({ messages, label = 'Export' }) {
  const handleExport = async () => {
    const text = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Chat copied to clipboard');
    } catch (err) {
      alert('Failed to copy chat: ' + err.message);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label={label}
    >
      {label}
    </button>
  );
}
