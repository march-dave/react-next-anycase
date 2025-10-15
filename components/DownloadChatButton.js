import React, { useState } from 'react';

export default function DownloadChatButton({ messages, label = 'Download', systemPrompt = '' }) {
  const [status, setStatus] = useState('');

  const handleDownload = () => {
    const formatted = buildTranscript(messages, systemPrompt);
    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = createFilename();
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Downloaded!');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <button
      onClick={handleDownload}
      className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
      aria-label={label}
    >
      <span aria-live="polite">{status || label}</span>
    </button>
  );
}

function buildTranscript(messages, systemPrompt) {
  const trimmedPrompt = typeof systemPrompt === 'string' ? systemPrompt.trim() : '';
  const lines = [];
  if (trimmedPrompt) {
    lines.push(`system: ${trimmedPrompt}`);
  }
  for (const m of messages) {
    const timeLabel = formatMessageTimestamp(m);
    lines.push(`${m.role}${timeLabel ? ` (${timeLabel})` : ''}: ${m.text}`);
  }
  return lines.join('\n');
}

function formatMessageTimestamp(message) {
  if (message?.timestamp) {
    const parsed = new Date(message.timestamp);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }
  return typeof message?.time === 'string' ? message.time : '';
}

function createFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `chat-${timestamp}.txt`;
}
