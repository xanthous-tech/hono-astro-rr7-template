// import workers that will run along the main server here.
import emailWorker from './email';
import stripeWebhookWorker from './stripe-webhook';

export const workers = [emailWorker, stripeWebhookWorker];
