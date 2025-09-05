# ChatGPT UI Quick Start

This repository includes a ChatGPT UI with persistent conversations built with Next.js and the OpenAI API. The home page now defaults to this interface (also available at `/chatgpt-ui`) and renders replies using GitHub-flavored Markdown with syntax highlighting for code blocks. Links in replies automatically open in a new browser tab. A basic non-persistent interface remains available at `/chatgpt`. Follow these steps to run it locally:

1. Install dependencies if needed:

```bash
npm install
```

2. Set the `OPENAI_API_KEY` environment variable to your OpenAI API key.
   Optionally set `OPENAI_MODEL` to choose a different default model and
   `OPENAI_SYSTEM_MESSAGE` for a custom system prompt, then start the development server:

```bash
npm run dev
```

   You can also run the server inline with the key:

```bash
OPENAI_API_KEY=your-key OPENAI_MODEL=gpt-4 \
OPENAI_SYSTEM_MESSAGE="You are a helpful assistant." npm run dev
```

   To display the active model name in the header, also set
   `NEXT_PUBLIC_OPENAI_MODEL`:

```bash
NEXT_PUBLIC_OPENAI_MODEL=gpt-4 npm run dev
```

3. Open `http://localhost:3000/` in your browser.

Other pages to explore:

- `/chatgpt` – simple interface without persistence.
- `/chatgpt-simple` – minimal interface without dark mode or extras.
- `/gpt` – select a different model.
- `/chatgpt-advanced` – set a custom system prompt.
- `/chatgpt-ui` – same interface as the home page with persistent messages.
- `/chatgpt-persistent` – simplified persistent interface.
- `/chatgpt-ui-stream` – streaming replies with persistent history.
- `/chatgpt-markdown` – renders replies using GitHub-flavored Markdown.
- `/chatgpt-ko` – Korean interface.

All chat pages include a **Dark Mode** toggle. Use the **Clear** button to start a fresh conversation; the message input refocuses automatically.
An **Export** button lets you copy the chat history—including timestamps—to your clipboard.
You can also save the chat with timestamps as a text file using the **Download** button.
Each message now shows a timestamp for when it was sent.
Each message includes a **Copy** button that briefly displays "Copied!" after copying and announces the status to screen readers.
The header displays the current number of messages in the conversation and announces updates to screen readers.
The page title also updates with the current message count so you can see new activity from another tab.
The message input automatically expands to fit longer content.
The chat log announces updates to screen readers and indicates when a response is loading.
If there are no messages yet, a placeholder invites you to start the conversation.
Press Shift+Enter to add a newline.
An animated typing indicator appears while waiting for a response.
