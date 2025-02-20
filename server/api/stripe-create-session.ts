import { stripe } from '@/utils/stripe';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    // const body = await readBody(event);
    
    try {
        const session = await stripe.checkout.sessions.create({
            // payment_method_types: ['card'],
            line_items: [{
                price: 'price_1QuQDk2NTi3sbeEgSE2wAIA2',
                // price: 'price_1QuPlr2NTi3sbeEgDe2wqr5P',
                quantity: 1,
            }],
            mode: 'subscription',
            // mode: 'payment',
            locale: 'pt-BR',
            phone_number_collection: {
                enabled: true,
            },
            metadata: {},
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
        })

        return session
    } catch (error) {
        
    }
});
