import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.text());

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Flashcard Generator",
  },
});

const systemPrompt = `You are a flashcard creator that MUST return responses in valid JSON format. Your response should contain ONLY the JSON object, with no additional text, explanations, or formatting.

Key Requirements:

1. Generate exactly 10 flashcards for the given topic
2. Each flashcard must have:
   - "front": A single term or concept (1-5 words)
   - "back": A clear, concise explanation (2-3 sentences max)
3. Use simple, clear language
4. Format must be EXACTLY as shown below, with no deviations

ONLY return a JSON object in this exact format:

{
    "flashcards": [
        {
            "front": "Term or Concept",
            "back": "Clear explanation of the term"
        }
    ]
}

Do not include any other text, markdown, or formatting - ONLY the JSON object.`;

app.post('/api/flashcards', async (req, res) => {
  try {
    const prompt = req.body;

    console.log('Making request to OpenRouter API...');
    
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 10 flashcards about: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    console.log('OpenRouter API Response:', completion); // Debug log

    const content = completion.choices[0].message.content;
    
    // Try to clean the response if it's not pure JSON
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/, '').replace(/```$/, '');
    }
    
    try {
      const flashcards = JSON.parse(cleanedContent);
      res.json({ flashcards: flashcards.flashcards });
    } catch (parseError) {
      console.error('Error parsing JSON:', cleanedContent);
      res.status(500).json({ 
        error: 'Failed to parse flashcards response',
        details: parseError.message,
        rawContent: cleanedContent // Include raw content for debugging
      });
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: error.message || 'Failed to generate flashcards.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Using OpenRouter with NVIDIA Llama 3.1 Nemotron Nano 8B');
}); 