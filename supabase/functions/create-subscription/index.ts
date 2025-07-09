import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import Stripe from 'npm:stripe@14.14.0';

const stripeSecretKey = Deno.env.get('STRIPE_ENVIRONMENT') === 'production'
  ? Deno.env.get('STRIPE_LIVE_SECRET_KEY')
  : Deno.env.get('STRIPE_TEST_SECRET_KEY');

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

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
    const { userId, email, returnUrl } = await req.json();

    if (!userId || !email) {
      throw new Error('User ID and email are required');
    }

    console.log('Creating/retrieving Stripe customer for:', email);

    // Create or retrieve Stripe customer
    let customer;
    try {
      // Try to find existing customer by email
      const customers = await stripe.customers.list({ email });
      customer = customers.data[0];

      if (!customer) {
        console.log('No existing customer found, creating new one');
        // Create new customer if none exists
        customer = await stripe.customers.create({
          email,
          metadata: {
            userId
          }
        });
      }

      console.log('Customer ID:', customer.id);
    } catch (error) {
      console.error('Error with Stripe customer:', error);
      throw new Error('Failed to process customer information');
    }

    console.log('Creating checkout session...');

    // Use the provided returnUrl or fall back to environment variable
    const baseUrl = returnUrl || Deno.env.get('SITE_URL') || 'https://soft-brigadeiros-731ee5.netlify.app';
    const successUrl = new URL('/dashboard', baseUrl);
    successUrl.searchParams.set('subscription', 'success');
    
    const cancelUrl = new URL('/premium', baseUrl);
    cancelUrl.searchParams.set('subscription', 'canceled');

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MindfulMingle Premium',
              description: 'Monthly subscription to MindfulMingle Premium features'
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      allow_promotion_codes: true,
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Subscription error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create subscription',
        details: error.stack
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