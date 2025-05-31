import { useState } from 'react';
import Head from 'next/head';
import ChatBubble from '@/components/ChatBubble';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const botMsg = { role: 'bot', text: `You said: ${input}` };
    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t flex bg-white">
          <input
            type="text"
            className="flex-1 border rounded p-2 mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4">
            Send
          </button>
        </form>
      </div>
    </>
  );
}
