import asaasApi from '@/utils/asaas';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
      const body = await readBody(event);
    
      switch (body.event) {
        case 'PAYMENT_CREATED':
            const payment = body.payment;
            console.log(payment);
            break;
        case 'PAYMENT_RECEIVED':
            const receivedPayment = body.payment;
            console.log(receivedPayment);
            break;
      
        default:
            break;
      }
})