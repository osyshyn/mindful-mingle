import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Resend } from 'npm:resend@2.1.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing welcome email request');
    const { email, name } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    console.log('Sending welcome email to:', email);

    const welcomeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .feature { margin-bottom: 20px; }
            .button { 
              display: inline-block;
              padding: 12px 24px;
              background-color: #f43f5e;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to MindfulMingle! 🎉</h1>
            </div>
            
            <p>Hi ${name || 'there'},</p>
            
            <p>We're excited to have you join our community of mindful individuals working to strengthen their relationships and emotional intelligence.</p>
            
            <h2>Here's what you can do with MindfulMingle:</h2>
            
            <div class="feature">
              <h3>🤝 Track Your Relationships</h3>
              <p>Add important relationships and track their health over time with our assessment tools.</p>
            </div>
            
            <div class="feature">
              <h3>💡 Daily Tips</h3>
              <p>Receive personalized tips and insights to improve your emotional intelligence and relationship skills.</p>
            </div>
            
            <div class="feature">
              <h3>🤖 AI Coach</h3>
              <p>Get personalized guidance from our AI coach trained in emotional intelligence and relationship dynamics.</p>
            </div>
            
            <div class="feature">
              <h3>📊 Biometric Tracking</h3>
              <p>Connect your devices to track stress levels and emotional states during interactions.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${Deno.env.get('SITE_URL')}/dashboard" class="button">
                Start Your Journey
              </a>
            </div>
            
            <p style="margin-top: 30px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
            
            <p>Best regards,<br>The MindfulMingle Team</p>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'MindfulMingle <welcome@mindfulmingle.com>',
      to: email,
      subject: 'Welcome to MindfulMingle! 🎉',
      html: welcomeHtml
    });

    console.log('Welcome email sent successfully:', result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Welcome email error:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: error.toString()
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