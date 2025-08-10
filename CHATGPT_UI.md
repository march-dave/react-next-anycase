# ChatGPT UI Quick Start

This repository includes a ChatGPT UI with persistent conversations built with Next.js and the OpenAI API. The home page now defaults to this interface (also available at `/chatgpt-ui`). A basic non-persistent interface remains available at `/chatgpt`. Follow these steps to run it locally:

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

3. Open `http://localhost:3000/` in your browser.

Other pages to explore:

- `/chatgpt` – simple interface without persistence.
- `/chatgpt-simple` – minimal interface without dark mode or extras.
- `/gpt` – select a different model.
- `/chatgpt-advanced` – set a custom system prompt.
- `/chatgpt-ui` – same interface as the home page with persistent messages.
- `/chatgpt-persistent` – simplified persistent interface.
- `/chatgpt-ui-stream` – streaming replies with persistent history.
- `/chatgpt-markdown` – renders replies using Markdown.
- `/chatgpt-ko` – Korean interface.

All chat pages include a **Dark Mode** toggle. Use the **Clear** button to start a fresh conversation.
An **Export** button lets you copy the chat history—including timestamps—to your clipboard.
You can also save the chat with timestamps as a text file using the **Download** button.
Each message now shows a timestamp for when it was sent.
The message input automatically expands to fit longer content.
Press Shift+Enter to add a newline.
