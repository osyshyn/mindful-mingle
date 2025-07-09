import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import OpenAI from 'npm:openai@4.28.4';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversation } = await req.json();

    if (!conversation) {
      throw new Error('Missing conversation text');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert in analyzing conversations and emotional intelligence. 
            Analyze the provided conversation and return a JSON object with:
            - Overall sentiment (positive/negative/neutral)
            - Sentiment score (0-100)
            - Analysis for each participant including:
              - Individual sentiment
              - Sentiment score
              - Detected emotions
              - Suggestions for improvement
            - A summary of the conversation dynamics
            
            Focus on emotional undertones, communication patterns, and relationship dynamics.`
        },
        {
          role: 'user',
          content: conversation
        }
      ],
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred analyzing the conversation'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});