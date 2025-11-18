import React, { useState } from 'react';

export default function ExportChatButton({
  messages,
  label = 'Export',
  systemPrompt = '',
  insightsText = '',
}) {
  const [status, setStatus] = useState('');

  const handleExport = async () => {
    const formatted = buildTranscript(messages, systemPrompt, insightsText);
    try {
      await navigator.clipboard.writeText(formatted);
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

function buildTranscript(messages, systemPrompt, insightsText) {
  const trimmedPrompt = typeof systemPrompt === 'string' ? systemPrompt.trim() : '';
  const trimmedInsights = typeof insightsText === 'string' ? insightsText.trim() : '';
  const sections = [];
  if (trimmedInsights) {
    sections.push(trimmedInsights);
  }
  const lines = [];
  if (trimmedPrompt) {
    lines.push(`system: ${trimmedPrompt}`);
  }
  for (const m of messages) {
    const timeLabel = formatMessageTimestamp(m);
    lines.push(`${m.role}${timeLabel ? ` (${timeLabel})` : ''}: ${m.text}`);
  }
  if (lines.length > 0) {
    sections.push(lines.join('\n'));
  }
  return sections.join('\n\n');
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
