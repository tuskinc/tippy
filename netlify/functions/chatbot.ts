import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Check if OpenAI API key is configured
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured');
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), { status: 500 });
  }

  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages,
      // Optional: Add system prompt or other parameters
      // system: 'You are a helpful assistant for a local crafts marketplace...',
    });

    return result.toAIStreamResponse();

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: `Internal Server Error: ${errorMessage}` }), { status: 500 });
  }
} 