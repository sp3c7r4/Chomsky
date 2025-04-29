const express = require('express');
const cors = require('cors');
const { Mastra } = require('mastra-ai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Mastra.ai
const mastra = new Mastra({
  apiKey: process.env.MASTRA_API_KEY // You'll need to set this in your environment variables
});

// Example endpoint using Mastra.ai
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await mastra.analyze(text);
    res.json(result);
  } catch (error) {
    console.error('Mastra.ai error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 