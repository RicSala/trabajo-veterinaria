import Stripe from 'stripe';

import { database as db } from '@repo/database';
import { stripe } from '@repo/payments/index';

// REFERENCES:
// - https://docs.stripe.com/api/events

export async function paymentWebhookController(
  rawBody: any,
  stripeSignature: string
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not set');
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook secret is not set');
  }

  // REVIEW:
  // Stripe send a post request with the event data in the body and a signature in the header
  // We need to verify that the signature is legit and has not been tampered with
  // The header has this format: t=1629780000,v1=8e3....d7
  // We need to compare that signature with the one we would get using the webhook secret
  // For that we take the timestamp and the body and we create a signature with the webhook secret and compare it with the one we got in the header. If they match, the event is legit
  // We could do it manually, but Stripe has a method to do it for us: stripe.webhooks.constructEvent(body, signature, webhookSecret)
  //   We need to provide the body as it was received it
  const event = stripe.webhooks.constructEvent(
    rawBody,
    stripeSignature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );

  if (event.type === 'customer.created') {
    await _processStripeCustomerCreated(event);
  }

  if (event.type === 'customer.subscription.created') {
    await _processStripeCustomerSubscriptionCreated(event);
  }

  //   Ref: https://docs.stripe.com/api/checkout/sessions/object
  if (event.type === 'checkout.session.completed') {
    await _processStripeCheckoutSessionCompleted(event);
  }

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await _processStripeCustomerSubscriptionUpdatedOrDeleted(stripe, event);
  }
}

// We don't do anything with the customer.created event
const _processStripeCustomerCreated = async (event: Stripe.Event) => {};

const _processStripeCheckoutSessionCompleted = async (
  event: Stripe.CheckoutSessionCompletedEvent
) => {
  const data = event.data.object;

  // get the checkout session, expanding certain fields
  const stripeCheckoutSession = await stripe.checkout.sessions.retrieve(
    data.id,
    {
      expand: ['line_items', 'customer', 'subscription'],
    }
  );

  // Assert the types of the expanded fields
  const stripeCustomer = stripeCheckoutSession.customer as Stripe.Customer;
  const subscription =
    stripeCheckoutSession.subscription as Stripe.Subscription;

  // This app only has subscription, so we don't need to handle other types of checkout sessions
  if (stripeCheckoutSession.mode !== 'subscription') {
    throw new Error('Checkout session is not a subscription');
  }

  const stripePriceId = stripeCheckoutSession.line_items?.data[0]?.price?.id;

  if (!isValidPriceId(stripePriceId)) {
    throw new Error(
      `Skipping ${event.type} because the price ${stripePriceId} was not found in the environment variables.`
    );
  }

  // metadata is the data we pass when creating the session to be able to identify the user later
  if (!stripeCheckoutSession?.metadata?.userId && !stripeCustomer) {
    throw new Error('User not found in metadata or stripe customer');
  }

  await db.subscription.create({
    data: {
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: stripeCustomer.id,
      stripePriceId: stripePriceId!,
      userId: stripeCheckoutSession.client_reference_id as string,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });
};

async function _processStripeCustomerSubscriptionUpdatedOrDeleted(
  stripe: Stripe,
  event: Stripe.Event
) {
  const stripeSubscription = event.data.object as Stripe.Subscription;
  const stripePriceId = stripeSubscription?.items?.data?.[0]?.price
    ?.id as string;

  if (!isValidPriceId(stripePriceId)) {
    throw new Error(
      `Skipping ${event.type} because the price ${stripePriceId} was not found in the environment variables.`
    );
  }

  await db.subscription.update({
    data: {
      status: stripeSubscription.status,
      isCancelAtEndPeriod: stripeSubscription.cancel_at_period_end,
      stripePriceId: stripePriceId,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAt: stripeSubscription.cancel_at
        ? new Date(stripeSubscription.cancel_at * 1000)
        : null,
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
    },
    where: {
      stripeSubscriptionId: stripeSubscription.id,
    },
  });
}

const _processStripeCustomerSubscriptionCreated = async (
  event: Stripe.CustomerSubscriptionCreatedEvent
) => {};

// TODO: Implement this
export const isValidPriceId = (priceId: string | undefined) => {
  return true;
};
