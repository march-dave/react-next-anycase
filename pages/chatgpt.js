import { useState } from 'react';
import Head from 'next/head';
import ChatBubble from '@/components/ChatBubble';

export default function ChatGptPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
        <title>ChatGPT UI</title>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          {loading && (
            <ChatBubble message={{ role: 'assistant', text: 'Loading...' }} />
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
          <textarea
            rows={1}
            className="w-full border border-gray-300 rounded p-2 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
