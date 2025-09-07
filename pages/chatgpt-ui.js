import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import ChatBubbleMarkdown from '@/components/ChatBubbleMarkdown';
import DarkModeToggle from '@/components/DarkModeToggle';
import ClearChatButton from '@/components/ClearChatButton';
import ExportChatButton from '@/components/ExportChatButton';
import DownloadChatButton from '@/components/DownloadChatButton';
import TypingIndicator from '@/components/TypingIndicator';

const STORAGE_KEY = 'chatgptMessages';

export default function ChatGptUIPersist() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const disableSend = loading || !input.trim();
  const modelName = process.env.NEXT_PUBLIC_OPENAI_MODEL;
  const messageCount = messages.length;
  const title = `ChatGPT UI (Persistent)${messageCount ? ` - ${messageCount} message${messageCount > 1 ? 's' : ''}` : ''}`;

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleClear = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.height = 'auto';
    }
  }, []);

  useEffect(() => {
    const shortcutHandler = (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (window.confirm('Clear chat history?')) {
          handleClear();
        }
      }
    };
    window.addEventListener('keydown', shortcutHandler);
    return () => window.removeEventListener('keydown', shortcutHandler);
  }, [handleClear]);

  // Load messages from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save messages', err);
    }
  }, [messages]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setLoading(true);
    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text }))
        }),
      });
      const data = await res.json();
      const botMsg = { role: 'assistant', text: data.text || 'No response', time: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        text: 'Error: ' + err.message,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex gap-2">
        <DarkModeToggle />
        <ClearChatButton onClear={handleClear} />
        <ExportChatButton messages={messages} />
        <DownloadChatButton messages={messages} />
        {messages.length > 0 && (
          <span
            className="ml-auto text-sm text-gray-500 dark:text-gray-400 self-center"
            aria-label={`${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`}
            aria-live="polite"
          >
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
        )}
        {modelName && (
          <span
            className={`${messages.length > 0 ? '' : 'ml-auto '}text-sm text-gray-500 dark:text-gray-400 self-center`}
            aria-label={`Model ${modelName}`}
          >
            Model: {modelName}
          </span>
        )}
      </div>
      <div
        className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4"
        role="log"
        aria-live="polite"
          aria-busy={loading}
        >
          {messages.length === 0 && !loading && (
            <div
              className="text-center text-gray-500 dark:text-gray-400 mt-4"
              aria-label="No messages yet"
            >
              No messages yet. Start the conversation below.
            </div>
          )}
          {messages.map((msg, idx) => (
            <ChatBubbleMarkdown key={idx} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            style={{ height: 'auto' }}
            className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 resize-none overflow-hidden bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Message input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message (Shift+Enter for newline)"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50"
            disabled={disableSend}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
