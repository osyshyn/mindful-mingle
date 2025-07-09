import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import OpenAI from 'npm:openai@4.28.4';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),});


const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();

    if (!messages || !userId) {
      throw new Error('Missing required parameters');
    }

    // Fetch user's coaching preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('coaching_preferences')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    const preferences = profile?.coaching_preferences || {};

    // Create system message based on user preferences
    const systemMessage = {
      role: 'system',
      content: `You are an empathetic AI emotional intelligence coach. Your responses should:
        ${preferences.communication_style === 'direct' ? '- Be direct and straightforward' : ''}
        ${preferences.communication_style === 'supportive' ? '- Be supportive and encouraging' : ''}
        ${preferences.communication_style === 'analytical' ? '- Be analytical and detailed' : ''}
        ${preferences.spiritual_inclusion ? '- Include spiritual and mindfulness perspectives when relevant' : ''}
        
        Focus areas to emphasize:
        ${preferences.focus_areas?.join(', ') || 'general emotional intelligence'}
        
        Base your coaching approach on:
        ${preferences.methodology === 'goleman' ? 'Goleman\'s EQ Framework' : ''}
        ${preferences.methodology === 'eq-i' ? 'The EQ-i 2.0 Model' : ''}
        ${preferences.methodology === 'mindfulness' ? 'Mindfulness-Based EQ practices' : ''}
        
        Keep responses concise, practical, and actionable.`
    };

    // Prepare messages for OpenAI
    const chatMessages: ChatMessage[] = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.is_ai_response ? 'assistant' : 'user',
        content: msg.message
      }))
    ];

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Store AI response in database
    const { error: dbError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: aiResponse,
        is_ai_response: true
      });

    if (dbError) {
      throw new Error(`Error storing message: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({ message: aiResponse }),
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
        error: error.message || 'An error occurred processing your request'
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