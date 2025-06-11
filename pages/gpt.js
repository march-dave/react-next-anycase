import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import ChatBubble from '@/components/ChatBubble';

const MODELS = ['gpt-3.5-turbo', 'gpt-4'];

export default function GptUIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(MODELS[0]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

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
    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text }))
        }),
      });
      const data = await res.json();
      const botMsg = { role: 'assistant', text: data.text || 'No response' };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = { role: 'assistant', text: 'Error: ' + err.message };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>GPT UI</title>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          {loading && (
            <ChatBubble message={{ role: 'assistant', text: 'Loading...' }} />
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2 items-start">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <textarea
            ref={inputRef}
            rows={1}
            className="w-full border border-gray-300 rounded p-2 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
            disabled={loading}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
