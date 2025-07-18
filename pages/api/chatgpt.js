export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    return;
  }
  const { messages, model } = req.body;
  const defaultModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  const chosenModel = typeof model === 'string' && model.trim()
    ? model.trim()
    : defaultModel;
  const systemPrompt = process.env.OPENAI_SYSTEM_MESSAGE;
  const allMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosenModel,
        messages: allMessages,
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
