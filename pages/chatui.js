import { useState } from 'react';
import Head from 'next/head';
import ChatBubble from '@/components/ChatBubble';

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome! How can I help?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const botMsg = { role: 'assistant', text: `You said: ${input}` };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
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
        <title>Chat UI</title>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {messages.map((m, idx) => (
            <ChatBubble key={idx} message={m} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
          <textarea
            rows={1}
            className="w-full border border-gray-300 rounded p-2 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
            Send
          </button>
        </form>
      </div>
    </>
  );
}
