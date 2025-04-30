import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const ollamaRes = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:0.6b',
        messages: [{ role: 'user', content: message }],
      }),
    });
    if (!ollamaRes.ok) {
      const text = await ollamaRes.text();
      throw new Error(`Ollama API error: ${text}`);
    }
    const data = await ollamaRes.json();
    const reply = data.choices?.[0]?.message?.content || '';
    res.json({ reply });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Error communicating with Ollama', details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
