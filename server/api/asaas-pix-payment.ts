import asaasApi from '@/utils/asaas';
import { defineEventHandler, readBody } from 'h3';

interface PixRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  value: number;
  dueDate: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PixRequest>(event);

  try {
    const customerResponse = await asaasApi.post('/customers', {
      name: body.name,
      cpfCnpj: body.cpf,
      email: body.email,
      mobilePhone: body.phone,
    });

    const customerId = customerResponse.data.id;

    const paymentResponse = await asaasApi.post('/payments', {
      customer: customerId,
      billingType: 'PIX',
      value: body.value,
      description: 'Pagamento via Pix',
      dueDate: body.dueDate,
    });

    const paymentId = paymentResponse.data.id;

    // Buscar o QR Code do pagamento
    const qrCodeResponse = await asaasApi.get(`/payments/${paymentId}/pixQrCode`);

    return {
      id: paymentId,
      pixQrCode: {
        encodedImage: qrCodeResponse.data.encodedImage, // QR Code em Base64
        payload: qrCodeResponse.data.payload, // Código Copia e Cola
      },
    };
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
});
