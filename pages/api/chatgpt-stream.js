export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed');
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).end('Missing OPENAI_API_KEY');
    return;
  }
  const { messages, model, systemPrompt } = req.body;
  const defaultModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  const chosenModel = typeof model === 'string' && model.trim()
    ? model.trim()
    : defaultModel;
  const envPrompt = process.env.OPENAI_SYSTEM_MESSAGE;
  const finalPrompt =
    typeof systemPrompt === 'string' && systemPrompt.trim()
      ? systemPrompt.trim()
      : envPrompt;
  const allMessages = finalPrompt
    ? [{ role: 'system', content: finalPrompt }, ...messages]
    : messages;
  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosenModel,
        messages: allMessages,
        stream: true,
      }),
    });
    if (!upstream.ok) {
      const errText = await upstream.text();
      throw new Error(errText);
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });
    upstream.body.on('data', (chunk) => {
      res.write(chunk);
    });
    upstream.body.on('end', () => {
      res.end();
    });
    upstream.body.on('error', (err) => {
      console.error('Stream error', err);
      res.end();
    });
  } catch (err) {
    res.status(500).end('Error: ' + err.message);
  }
}
