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

let conversationHistory = [];

// Reset endpoint to clear conversation history
app.post('/api/reset', (req, res) => {
  conversationHistory = [];
  res.json({ success: true });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    // Add current message to history
    conversationHistory.push({
      role: 'user',
      content: message,
      think: '',
      main: ''
    });
    
    // Keep only the last 10 complete conversations
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }
    
    // Format conversation history for Ollama API
    const formattedMessages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const ollamaRes = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:0.6b',
        messages: formattedMessages,
      }),
    });
    if (!ollamaRes.ok) {
      const text = await ollamaRes.text();
      throw new Error(`Ollama API error: ${text}`);
    }
    const data = await ollamaRes.json();
    const reply = data.choices?.[0]?.message?.content || '';
    
    // Parse the response to separate think content
    const mainContent = [];
    const thinkContent = [];
    
    // Split by <think> tags
    const parts = reply.split(/<think>([\s\S]*?)<\/think>/);
    
    // Separate main and think content
    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        // Even index: main content
        mainContent.push(String(part));
      } else {
        // Odd index: think content
        thinkContent.push(String(part.trim()));
      }
    });
    
    // Add bot's complete response to history
    conversationHistory.push({
      role: 'assistant',
      content: String(mainContent.join('')).trim(),
      think: thinkContent.join('<br>'),
      main: String(mainContent.join('')).trim()
    });

    res.json({
      main: String(mainContent.join('')).trim(),
      think: thinkContent
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Error communicating with Ollama', details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
