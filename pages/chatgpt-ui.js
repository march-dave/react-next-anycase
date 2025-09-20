import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ChatBubbleMarkdown from '@/components/ChatBubbleMarkdown';
import DarkModeToggle from '@/components/DarkModeToggle';
import ClearChatButton from '@/components/ClearChatButton';
import ExportChatButton from '@/components/ExportChatButton';
import DownloadChatButton from '@/components/DownloadChatButton';
import TypingIndicator from '@/components/TypingIndicator';

const STORAGE_KEY = 'chatgptMessages';
const SETTINGS_KEY = 'chatgptUiSettings';

const promptSuggestions = [
  {
    title: 'Summarize a meeting',
    description: 'Turn long notes into concise action items.',
    prompt:
      'Summarize the following meeting transcript into concise action items and key decisions:\n\n',
    tags: ['Meetings', 'Summaries'],
  },
  {
    title: 'Draft release notes',
    description: 'Highlight what changed in a friendly tone.',
    prompt:
      'Create release notes for the following list of updates. Include a short intro and grouped bullet points:\n\n',
    tags: ['Product', 'Announcements'],
  },
  {
    title: 'Explain a concept',
    description: 'Request an accessible explanation with examples.',
    prompt:
      'Explain the following concept to a new developer. Use a real-world analogy and list common pitfalls:\n\n',
    tags: ['Education', 'Guides'],
  },
  {
    title: 'Draft a pull request summary',
    description: 'Capture key changes and how they were tested.',
    prompt:
      'Write a concise pull request summary for the following changes. Call out the motivation, key updates, and any tests run:' +
      '\n\n',
    tags: ['Collaboration', 'Pull Request'],
  },
  {
    title: 'Outline verification steps',
    description: 'List the manual and automated checks to run before shipping.',
    prompt:
      'Given the following feature work, outline a test plan that lists the manual checks, automated suites, and any follow-up verification needed before release. Close with expected outcomes for each step.\n\n',
    tags: ['Quality', 'Pull Request'],
  },
  {
    title: 'Brainstorm ideas',
    description: 'Generate creative approaches for a problem.',
    prompt:
      'Brainstorm five creative feature ideas for a productivity app that helps remote teams collaborate asynchronously.',
    tags: ['Productivity', 'Ideation'],
  },
];

const DEFAULT_PR_TEMPLATE = `Summary
* Key outcome 1
* Key outcome 2

Testing
* ✅ ${'`'}command or suite${'`'}
* ✅ Manual flow description

`;

export default function ChatGptUIPersist() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showPrHelper, setShowPrHelper] = useState(false);
  const [promptSearch, setPromptSearch] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [prTemplateText, setPrTemplateText] = useState(DEFAULT_PR_TEMPLATE);
  const [prCopyStatus, setPrCopyStatus] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const promptLibraryButtonRef = useRef(null);
  const promptLibrarySearchRef = useRef(null);
  const promptLibraryHasOpened = useRef(false);
  const prHelperButtonRef = useRef(null);
  const prHelperTextareaRef = useRef(null);
  const prHelperHasOpened = useRef(false);
  const disableSend = loading || !input.trim();
  const modelName = process.env.NEXT_PUBLIC_OPENAI_MODEL;
  const messageCount = messages.length;
  const titleBase = `ChatGPT UI (Persistent)${modelName ? ` - ${modelName}` : ''}`;
  const title = `${titleBase}${messageCount ? ` - ${messageCount} message${messageCount > 1 ? 's' : ''}` : ''}`;
  const trimmedSystemPrompt = useMemo(() => systemPrompt.trim(), [systemPrompt]);
  const systemPromptPreview = useMemo(() => {
    if (!trimmedSystemPrompt) return '';
    return trimmedSystemPrompt.length > 80
      ? `${trimmedSystemPrompt.slice(0, 77)}...`
      : trimmedSystemPrompt;
  }, [trimmedSystemPrompt]);

  const adjustInputHeight = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    requestAnimationFrame(adjustInputHeight);
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
    }
    requestAnimationFrame(adjustInputHeight);
  }, [adjustInputHeight]);

  const applySuggestedPrompt = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      adjustInputHeight();
      if (inputRef.current) {
        inputRef.current.focus();
        const length = prompt.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
  };

  const filteredPromptSuggestions = useMemo(() => {
    const search = promptSearch.trim().toLowerCase();
    if (!search) return promptSuggestions;
    return promptSuggestions.filter((suggestion) => {
      if (
        suggestion.title.toLowerCase().includes(search) ||
        suggestion.description.toLowerCase().includes(search) ||
        suggestion.prompt.toLowerCase().includes(search)
      ) {
        return true;
      }
      if (!suggestion.tags?.length) return false;
      return suggestion.tags.some((tag) => tag.toLowerCase().includes(search));
    });
  }, [promptSearch]);

  const handleSystemPromptChange = (e) => {
    setSystemPrompt(e.target.value);
  };

  const handleResetSystemPrompt = () => {
    setSystemPrompt('');
  };

  const handleCopyPrTemplate = async () => {
    try {
      await navigator.clipboard.writeText(prTemplateText);
      setPrCopyStatus('Copied!');
    } catch (err) {
      setPrCopyStatus('Copy failed');
    }
    setTimeout(() => setPrCopyStatus(''), 2000);
  };

  const handleInsertPrTemplate = () => {
    setInput((prev) => {
      const trimmedPrev = prev.trimEnd();
      const next = trimmedPrev ? `${trimmedPrev}\n\n${prTemplateText}` : prTemplateText;
      return next;
    });
    setShowPrHelper(false);
    requestAnimationFrame(() => {
      adjustInputHeight();
      if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
  };

  const handleResetPrTemplate = () => {
    setPrTemplateText(DEFAULT_PR_TEMPLATE);
    requestAnimationFrame(() => {
      if (prHelperTextareaRef.current) {
        prHelperTextareaRef.current.focus();
        prHelperTextareaRef.current.select();
      }
    });
  };

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

  // Load settings (currently only the system prompt) once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.systemPrompt === 'string') {
          setSystemPrompt(parsed.systemPrompt);
        }
      }
    } catch (err) {
      console.error('Failed to load chat settings', err);
    }
  }, []);

  // Persist the system prompt locally so it survives refreshes
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ systemPrompt })
      );
    } catch (err) {
      console.error('Failed to save chat settings', err);
    }
  }, [systemPrompt]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    adjustInputHeight();
  }, [adjustInputHeight]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    adjustInputHeight();
  }, [input, adjustInputHeight]);

  useEffect(() => {
    if (!showPromptLibrary) {
      setPromptSearch('');
      if (promptLibraryHasOpened.current && promptLibraryButtonRef.current) {
        promptLibraryButtonRef.current.focus();
      }
      return;
    }

    promptLibraryHasOpened.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowPromptLibrary(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (promptLibrarySearchRef.current) {
        promptLibrarySearchRef.current.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPromptLibrary]);

  useEffect(() => {
    if (!showPrHelper) {
      setPrCopyStatus('');
      if (prHelperHasOpened.current && prHelperButtonRef.current) {
        prHelperButtonRef.current.focus();
      }
      return;
    }

    prHelperHasOpened.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowPrHelper(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (prHelperTextareaRef.current) {
        prHelperTextareaRef.current.focus();
        prHelperTextareaRef.current.select();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPrHelper]);

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
      const payload = {
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text })),
      };
      if (trimmedSystemPrompt) {
        payload.systemPrompt = trimmedSystemPrompt;
      }
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    if (e.key === 'ArrowUp' && !input.trim()) {
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUser) {
        setInput(lastUser.text);
        requestAnimationFrame(() => {
          adjustInputHeight();
        });
      }
    } else if (e.key === 'Escape') {
      setInput('');
      requestAnimationFrame(adjustInputHeight);
    } else if (e.key === 'Enter' && !e.shiftKey) {
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
        <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <DarkModeToggle />
          <ClearChatButton onClear={handleClear} />
          <ExportChatButton messages={messages} systemPrompt={systemPrompt} />
          <DownloadChatButton messages={messages} systemPrompt={systemPrompt} />
          <button
            type="button"
            ref={promptLibraryButtonRef}
            onClick={() => setShowPromptLibrary(true)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-haspopup="dialog"
            aria-expanded={showPromptLibrary}
            aria-controls="prompt-library"
          >
            Prompt library
          </button>
          <button
            type="button"
            ref={prHelperButtonRef}
            onClick={() => setShowPrHelper(true)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-haspopup="dialog"
            aria-expanded={showPrHelper}
            aria-controls="pr-helper"
          >
            PR helper
          </button>
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            aria-expanded={showSettings}
            aria-controls="chat-settings"
          >
            {showSettings ? 'Hide settings' : 'Settings'}
          </button>
          <div className="ml-auto flex flex-wrap gap-x-4 gap-y-1 items-center text-sm text-gray-500 dark:text-gray-400">
            {messages.length > 0 && (
              <span
                className="self-center"
                aria-label={`${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`}
                aria-live="polite"
              >
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </span>
            )}
            {modelName && (
              <span className="self-center" aria-label={`Model ${modelName}`}>
                Model: {modelName}
              </span>
            )}
            {trimmedSystemPrompt && (
              <span
                className="text-xs text-blue-600 dark:text-blue-300"
                title={trimmedSystemPrompt}
                aria-live="polite"
              >
                Custom system prompt active
              </span>
            )}
          </div>
        </div>
        {showSettings && (
          <div
            id="chat-settings"
            className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 space-y-2"
          >
            <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Custom system prompt
            </label>
            <textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={handleSystemPromptChange}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Set the assistant's behavior. Leave blank to use the default prompt."
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={handleResetSystemPrompt}
                className="self-start border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
                disabled={!trimmedSystemPrompt}
              >
                Clear custom prompt
              </button>
              <span>Saved locally and applied to every message in this conversation.</span>
            </div>
          </div>
        )}
        <div
          className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4"
          role="log"
          aria-live="polite"
          aria-busy={loading}
        >
          {messages.length === 0 && !loading && (
            <div
              className="text-center text-gray-500 dark:text-gray-400 mt-4 space-y-6"
              aria-label="No messages yet"
            >
              <div>
                <p>No messages yet. Start the conversation below.</p>
                {trimmedSystemPrompt && (
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                    Using custom system prompt: <span className="font-medium">{systemPromptPreview}</span>
                  </p>
                )}
              </div>
              <div className="max-w-3xl mx-auto text-left">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Try one of these starters
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {promptSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.title}
                      type="button"
                      onClick={() => applySuggestedPrompt(suggestion.prompt)}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-left bg-white dark:bg-gray-800 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <span className="block font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.description}
                      </span>
                      {suggestion.tags?.length > 0 && (
                        <span className="mt-2 flex flex-wrap gap-1">
                          {suggestion.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Looking for more inspiration? Open the <span className="font-medium">Prompt library</span> from the header to browse every saved starter. The badges show the themes each prompt is best suited for.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Preparing a pull request? The <span className="font-medium">PR helper</span> button offers a ready-to-edit summary and testing template you can copy or drop into the composer.
                </p>
              </div>
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
            placeholder="Send a message (Shift+Enter for newline, Up Arrow to recall last message)"
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
      {showPromptLibrary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prompt-library-title"
          id="prompt-library"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close prompt library"
            tabIndex={-1}
            onClick={() => setShowPromptLibrary(false)}
          />
          <div className="relative max-h-full w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 id="prompt-library-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Prompt library
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Browse curated starters or search to quickly reuse a favorite request. Results match titles, descriptions,
                  prompts, and badges.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPromptLibrary(false)}
              >
                Close
              </button>
            </div>
            <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
              <label htmlFor="prompt-library-search" className="sr-only">
                Search prompts
              </label>
              <input
                id="prompt-library-search"
                ref={promptLibrarySearchRef}
                type="search"
                value={promptSearch}
                onChange={(event) => setPromptSearch(event.target.value)}
                placeholder="Search prompts by title, keyword, or tag"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
              {filteredPromptSuggestions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No prompts match your search yet. Try a different keyword.
                </p>
              ) : (
                <ul className="space-y-3">
                  {filteredPromptSuggestions.map((suggestion) => (
                    <li key={suggestion.title}>
                      <button
                        type="button"
                        onClick={() => {
                          applySuggestedPrompt(suggestion.prompt);
                          setShowPromptLibrary(false);
                        }}
                        className="block w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {suggestion.title}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.description}
                        </span>
                        {suggestion.tags?.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1">
                            {suggestion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      {showPrHelper && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pr-helper-title"
          id="pr-helper"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close PR helper"
            tabIndex={-1}
            onClick={() => setShowPrHelper(false)}
          />
          <div className="relative max-h-full w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 id="pr-helper-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Pull request helper
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Keep your summaries and testing notes consistent. Edit the template, copy it, or insert it directly into the message box.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPrHelper(false)}
              >
                Close
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p id="pr-helper-tip" className="text-xs text-gray-500 dark:text-gray-400">
                  Swap the emoji to ⚠️ or ❌ if a check is flaky or failing, and replace the placeholders with project details.
                </p>
                <textarea
                  ref={prHelperTextareaRef}
                  value={prTemplateText}
                  onChange={(event) => setPrTemplateText(event.target.value)}
                  aria-describedby="pr-helper-tip"
                  rows={8}
                  className="mt-3 w-full rounded border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleCopyPrTemplate}
                    className="border border-blue-500 bg-blue-500 px-3 py-2 font-medium text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span aria-live="polite">{prCopyStatus || 'Copy template'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertPrTemplate}
                    className="border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    Insert into chat
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResetPrTemplate}
                  className="self-start text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Reset template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
