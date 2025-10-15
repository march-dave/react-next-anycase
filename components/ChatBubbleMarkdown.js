import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function ChatBubbleMarkdown({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

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
