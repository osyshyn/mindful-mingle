import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import Stripe from 'npm:stripe@14.14.0';

const stripeSecretKey = Deno.env.get('STRIPE_ENVIRONMENT') === 'production'
  ? Deno.env.get('STRIPE_LIVE_SECRET_KEY')
  : Deno.env.get('STRIPE_TEST_SECRET_KEY');

const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const endpointSecret = Deno.env.get('STRIPE_ENVIRONMENT') === 'production'
  ? Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET')
  : Deno.env.get('STRIPE_TEST_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) throw new Error('No signature found');

    const body = await req.text();
    console.log('Received webhook event:', body);

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );

    console.log('Processing event type:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Processing checkout session:', session);

        // Get subscription from the session
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const customerId = session.customer;

        console.log('Retrieved subscription:', {
          subscriptionId: subscription.id,
          customerId,
          status: subscription.status
        });

        // Get customer to retrieve userId from metadata
        const customer = await stripe.customers.retrieve(customerId as string);
        const userId = customer.metadata.userId;

        if (!userId) {
          throw new Error(`No userId found in customer metadata for customer: ${customerId}`);
        }

        console.log('Updating subscription in database for user:', userId);

        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan: 'premium',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at: subscription.cancel_at 
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (upsertError) {
          throw new Error(`Failed to update subscription in database: ${upsertError.message}`);
        }

        console.log('Successfully updated subscription in database');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        console.log('Processing subscription update:', {
          subscriptionId: subscription.id,
          customerId,
          status: subscription.status
        });

        const customer = await stripe.customers.retrieve(customerId as string);
        const userId = customer.metadata.userId;

        if (!userId) {
          throw new Error(`No userId found in customer metadata for customer: ${customerId}`);
        }

        console.log('Updating subscription in database for user:', userId);

        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan: 'premium',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at: subscription.cancel_at 
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString()
          });

        if (upsertError) {
          throw new Error(`Failed to update subscription in database: ${upsertError.message}`);
        }

        console.log('Successfully updated subscription in database');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Processing subscription deletion:', subscription.id);

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          throw new Error(`Failed to mark subscription as canceled: ${updateError.message}`);
        }

        console.log('Successfully marked subscription as canceled');
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: error.toString()
      }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});