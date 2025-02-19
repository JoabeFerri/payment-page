import asaasApi from '@/utils/asaas';
import { defineEventHandler, readBody } from 'h3';

interface PaymentRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  planName: string;
  value: number;
  dueDate: string;
  isSubscription: boolean;
}

interface PaymentResponse {
  id: string;
  link: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PaymentRequest>(event);

  try {
    // Criar o cliente
    const customerResponse = await asaasApi.post('/customers', {
      name: body.name,
      cpfCnpj: body.cpf,
      email: body.email,
      mobilePhone: body.phone
    });

    const customerId = customerResponse.data.id;

    let paymentResponse;

    if (body.isSubscription) {
      // Criar assinatura para o cliente
      paymentResponse = await asaasApi.post<PaymentResponse>('/subscriptions', {
        customer: customerId,
        billingType: 'CREDIT_CARD',
        value: body.value,
        nextDueDate: body.dueDate,
        cycle: 'MONTHLY',
        description: 'Sua assinatura mensal sobre nossos produtos foram confirmados com sucesso!',
      });
    } else {
      // Criar pagamento único para o cliente
      paymentResponse = await asaasApi.post<PaymentResponse>('/payments', {
        customer: customerId,
        billingType: 'CREDIT_CARD',
        value: body.value,
        dueDate: body.dueDate,
        description: 'Seu pagamento único foi confirmado com sucesso!',
      });
    }

    return paymentResponse.data;
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
});