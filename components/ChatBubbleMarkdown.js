import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function ChatBubbleMarkdown({ message, matchSummary = null }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const hasMatches = matchSummary && matchSummary.total > 0;
  const matchTermLabel = useMemo(() => {
    if (!hasMatches) {
      return '';
    }

    return matchSummary.preview || matchSummary.term || '';
  }, [hasMatches, matchSummary]);
  const matchFieldSummary = useMemo(() => {
    if (!hasMatches || !Array.isArray(matchSummary.fields)) {
      return '';
    }

    return matchSummary.fields
      .map((field) => {
        if (!field || typeof field !== 'object') {
          return '';
        }
        const label = field.label || '';
        const count = Number.isFinite(field.count) ? field.count : 0;
        if (!label || count <= 0) {
          return '';
        }
        return `${label} ×${count}`;
      })
      .filter(Boolean)
      .join(' · ');
  }, [hasMatches, matchSummary]);
  const matchAnnouncement = useMemo(() => {
    if (!hasMatches || !matchSummary) {
      return '';
    }

    const hitsLabel = matchSummary.total === 1 ? 'match' : 'matches';
    const term = matchTermLabel;
    const fieldSummary = matchFieldSummary ? ` (${matchFieldSummary})` : '';
    return term
      ? `Matches for “${term}”: ${matchSummary.total} ${hitsLabel}${fieldSummary}`
      : `Matches: ${matchSummary.total} ${hitsLabel}${fieldSummary}`;
  }, [hasMatches, matchFieldSummary, matchSummary, matchTermLabel]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // ignore errors
    }
  };

  return (
    <div className={isUser ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
      <div className={`max-w-2xl mx-auto py-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className="space-y-1 max-w-full">
          <span className="text-xs text-gray-500">
            {isUser ? 'You' : 'Assistant'}
            {message.time && <span className="ml-1 text-gray-400">{message.time}</span>}
          </span>
          {hasMatches && (
            <div
              className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[0.7rem] text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
              aria-live="polite"
              aria-label={matchAnnouncement || undefined}
            >
              <span className="font-semibold uppercase tracking-wide">
                Matches
              </span>
              {matchTermLabel && (
                <span className="italic">“{matchTermLabel}”</span>
              )}
              <span>
                {matchSummary.total} {matchSummary.total === 1 ? 'match' : 'matches'}
              </span>
              {matchFieldSummary && (
                <span className="text-blue-600 dark:text-blue-100">
                  {matchFieldSummary}
                </span>
              )}
            </div>
          )}
          <div className="flex items-start gap-2">
            <div
              className={`rounded-md px-4 py-2 border prose dark:prose-invert whitespace-pre-wrap ${
                isUser
                  ? 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-500 hover:underline mt-1"
              aria-label="Copy message"
            >
              <span aria-live="polite">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
