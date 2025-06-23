import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import ChatBubble from '@/components/ChatBubble';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function ChatGptStreamPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
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
    let botMsg = { role: 'assistant', text: '' };
    setMessages((prev) => [...prev, botMsg]);
    try {
      const res = await fetch('/api/chatgpt-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          const cleaned = line.replace(/^data: /, '').trim();
          if (!cleaned || cleaned === '[DONE]') continue;
          try {
            const data = JSON.parse(cleaned);
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              botMsg.text += content;
              setMessages((prev) => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...botMsg };
                return newMsgs;
              });
            }
          } catch (err) {
            console.error('Parse error', err);
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ChatGPT Stream UI</title>
      </Head>
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <DarkModeToggle />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg} />
          ))}
          {loading && <ChatBubble message={{ role: 'assistant', text: '...' }} />}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50" disabled={loading} aria-label="Send message">
            Send
          </button>
        </form>
      </div>
    </>
  );
}
