import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');

  if (req.method === 'POST') {
    console.log('Request Body:', req.body);

    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        system: "You are a witty comeback generator. Your responses should be clever, concise, and tailored to the specific type of comeback requested.",
        messages: [
          {
            role: "user",
            content: req.body.messages[0].content
          }
        ],
        max_tokens: 1024,
      });

      console.log('Claude API Response:', response);

      if (response && response.content) {
        res.status(200).json(response);
      } else {
        console.error('Invalid response format:', response);
        res.status(500).json({ error: 'Invalid response format from Claude API' });
      }
    } catch (error) {
      console.error('Error communicating with Claude API:', error);
      res.status(500).json({ error: 'Error communicating with Claude API' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}