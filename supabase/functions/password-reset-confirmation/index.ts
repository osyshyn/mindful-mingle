import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Resend } from 'npm:resend@2.1.0';

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
    console.log('Processing password reset confirmation request');
    const { email } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    console.log('Sending confirmation email to:', email);

    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not configured');
    }

    const resend = new Resend(resendApiKey);

    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { margin-bottom: 30px; }
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
              <h1>Password Reset Confirmation</h1>
            </div>
            
            <div class="content">
              <p>Hi there,</p>
              
              <p>Your password has been successfully reset. If you did not make this change, please contact our support team immediately.</p>
              
              <p>For security reasons, we recommend:</p>
              <ul>
                <li>Using unique passwords for different accounts</li>
                <li>Enabling two-factor authentication when possible</li>
                <li>Never sharing your password with others</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${Deno.env.get('SITE_URL') || 'https://mindfulmingle.ai'}/login" class="button">
                Sign In to Your Account
              </a>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              If you have any questions or concerns, please don't hesitate to contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    console.log('Sending email via Resend');

    const result = await resend.emails.send({
      from: 'MindfulMingle <security@mindfulmingle.com>',
      to: email,
      subject: 'Password Reset Confirmation - MindfulMingle',
      html: confirmationHtml
    });

    console.log('Email sent successfully:', result);

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
    console.error('Password reset confirmation email error:', error);
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