import asaasApi from '@/utils/asaas';
import { defineEventHandler, readBody } from 'h3';

interface SubscriptionRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  planName: string;
  value: number;
  dueDate: string;
  discount: number;
}

interface SubscriptionResponse {
  id: string;
  link: string; // Link para pagamento ou detalhes da assinatura
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscriptionRequest>(event);

  try {
    // Criar o cliente
    const customerResponse = await asaasApi.post('/customers', {
      name: body.name,
      cpfCnpj: body.cpf,
      email: body.email,
      mobilePhone: body.phone
    });

    const customerId = customerResponse.data.id;

    // Criar assinatura para o cliente
    const subscriptionResponse = await asaasApi.post<SubscriptionResponse>('/subscriptions', {
      customer: customerId, // ID do cliente
      plan: body.planName,   // Nome ou ID do plano
      value: body.value,     // Valor da assinatura
      dueDate: body.dueDate, // Data de vencimento da primeira cobrança
      cycle: "MONTHLY",
      discount: {
        value: 0,
        dueDateLimitDays: 3
      },
      billingType: 'CREDIT_CARD',
      description: 'Sua assinatura mensal sobre nossos produtos foram confirmados com sucesso!',
    });

    return subscriptionResponse.data;
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
});
