# Titanium Cutting Board Site

A simple Next.js website showcasing a titanium cutting board. Styled with Tailwind CSS.

## Development

Install dependencies (requires Node.js) and run the development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Android App

An Expo-based React Native project lives in `android-app` for Android only.
Install dependencies and run on a device or emulator:

```bash
cd android-app
npm install
npm run android
```

`npm run build` generates a production AAB using EAS.

The Android project integrates AdMob ads via `react-native-google-mobile-ads` and
includes a simple PDF viewer component powered by `react-native-pdf`.

## Mosaic Puzzle Game

Another React Native project using version 0.74 lives in `mosaic-puzzle-game`.
Run it on Android with the same commands:

```bash
cd mosaic-puzzle-game
npm install
npm run android
```

This app displays all text in English and integrates Google Mobile Ads
(`react-native-google-mobile-ads` @14.7.2).

## Reflex Rush App

A reaction time game using React Native 0.78 in `ReflexRushApp`. Run on Android with:

```bash
cd ReflexRushApp
npm install
npm run android
```

Google Mobile Ads (`react-native-google-mobile-ads` @15.2.0) is integrated and all user text is in English.

## ChatGPT UI

The site now defaults to a simple ChatGPT interface on the home page (`/`). You
can also access it directly via `/chatgpt`.

To run it locally:

1. Set the `OPENAI_API_KEY` environment variable.
2. Start the dev server:

   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

You can also choose a different model (e.g. `gpt-4`) at `/gpt`.
For conversations that persist across page reloads, visit `/chatgpt-ui`.
A Korean interface is available at `/chatgpt-ko`.
All chat pages now include a **Dark Mode** toggle in the header.
For a condensed quick-start guide, see [`CHATGPT_UI.md`](./CHATGPT_UI.md).

Key files implementing the chat interface:

- `pages/chatgpt.js` – renders the chat UI.
- `pages/api/chatgpt.js` – API route that sends prompts to OpenAI.
- `components/ChatBubble.js` – the message bubble component.
- `pages/gpt.js` – variant with a model selector.
- `pages/chatgpt-ui.js` – version that stores messages in local storage.
- `pages/chatgpt-ko.js` – Korean language interface.
- `pages/chatgpt-stream.js` – streams responses token by token.
- `pages/api/chatgpt-stream.js` – API route powering the streaming UI.

Below is a short excerpt from the `handleSubmit` function in
`pages/chatgpt.js`. It shows how each message is sent to the `/api/chatgpt`
endpoint and how the assistant's reply (or any error) gets appended to the
conversation:

```javascript
const userMsg = { role: 'user', text: input };
setMessages((prev) => [...prev, userMsg]);
setInput('');
setLoading(true);
try {
  const res = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.text,
      })),
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
```

### UX Design Tips

Here are a few guidelines that informed the simple chat interface:

1. **Simplicity** – Keep the layout focused on the conversation with minimal clutter.
2. **Visual hierarchy** – Differentiate user and assistant messages with distinct backgrounds.
3. **Accessibility** – Ensure readable fonts and keyboard navigation. The input area automatically receives focus.
4. **Feedback** – While waiting for a reply, a loading message appears and the send button is disabled.
5. **Scrolling behavior** – New messages scroll into view so context is maintained.
6. **Customization** – Choose a different model on the `/gpt` page.
