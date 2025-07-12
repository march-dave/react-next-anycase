# ChatGPT UI Quick Start

This repository includes a simple ChatGPT interface built with Next.js and the OpenAI API. The home page now defaults to this chat interface (also available at `/chatgpt`). Follow these steps to run it locally:

1. Install dependencies if needed:

```bash
npm install
```

2. Set the `OPENAI_API_KEY` environment variable to your OpenAI API key.
   Optionally set `OPENAI_MODEL` to choose a different default model, then start the development server:

```bash
npm run dev
```

   You can also run the server inline with the key:

```bash
OPENAI_API_KEY=your-key OPENAI_MODEL=gpt-4 npm run dev
```

3. Open `http://localhost:3000/` in your browser.

Other pages to explore:

- `/chatgpt` – same interface as the home page.
- `/gpt` – select a different model.
- `/chatgpt-ui` – messages persist across reloads.
- `/chatgpt-ko` – Korean interface.

All chat pages include a **Dark Mode** toggle. Use the **Clear** button to start a fresh conversation.
A new **Export** button lets you copy the chat history to your clipboard.
