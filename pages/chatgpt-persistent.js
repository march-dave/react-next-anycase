import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import ChatBubble from '@/components/ChatBubble';

const STORAGE_KEY = 'chatgptPersistentMessages';

export default function ChatGptPersistent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const disableSend = loading || !input.trim();

  // Load saved messages on mount
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

  // Save messages whenever they change
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
    setLoading(true);
    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      const botMsg = { role: 'assistant', text: data.text || 'No response', time: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = { role: 'assistant', text: 'Error: ' + err.message, time: new Date().toLocaleTimeString() };
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

  const handleClear = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
  };

  return (
    <>
      <Head>
        <title>ChatGPT Persistent</title>
      </Head>
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex justify-end p-2 border-b bg-white">
          <button onClick={handleClear} className="border px-2 py-1 rounded text-sm bg-white" aria-label="Clear messages">
            Clear
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          {loading && <ChatBubble message={{ role: 'assistant', text: 'Loading...' }} />}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            className="w-full border border-gray-300 rounded p-2 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message"
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
