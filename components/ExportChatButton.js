import React, { useState } from 'react';

export default function ExportChatButton({ messages, label = 'Export' }) {
  const [status, setStatus] = useState('');

  const handleExport = async () => {
    const text = messages
      .map((m) => `${m.role}${m.time ? ` (${m.time})` : ''}: ${m.text}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied!');
    } catch (err) {
      setStatus('Copy failed');
    }
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <button
      onClick={handleExport}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label={label}
    >
      <span aria-live="polite">{status || label}</span>
    </button>
  );
}
