import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { paymentWebhookController } from '@repo/payments/controllers/subscriptionWebhookController';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  // REVIEW:
  // Stripe send a post request with the event data in the body and a signature in the header
  // We need to verify that the signature is legit and has not been tampered with
  // The header has this format: t=1629780000,v1=8e3....d7
  // We need to compare that signature with the one we would get using the webhook secret
  // For that we take the timestamp and the body and we create a signature with the webhook secret and compare it with the one we got in the header. If they match, the event is legit
  // We could do it manually, but Stripe has a method to do it for us: stripe.webhooks.constructEvent(body, signature, webhookSecret)
  //   We need to provide the body as it was received it

  try {
    await paymentWebhookController(body, signature);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: Error = err;
    console.error(`!!error, ${error.message}`);
    // We do not send 400 status to stripe, as it will keep retrying
    return NextResponse.json({ error: error.message }, { status: 200 });
  }

  return NextResponse.json(null, { status: 200 });
}
