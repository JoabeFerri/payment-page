<script setup lang="ts">
import { ref, computed } from 'vue';

const numberCard = ref('');
const validateCard = ref('');
const cvvCard = ref('');
const nameCard = ref('');
const cpfUser = ref('');
const emailUser = ref('');
const cellphoneUser = ref('');
const dueDate = ref('');

const cardBrands = [
    { name: 'elo', pattern: /^(4011|4312|4389|4514|4576|5041|6277|6362|6504|6505|6509|6516|6550)/ },
    { name: 'visa', pattern: /^4/ },
    { name: 'master', pattern: /^5[1-5]/ },
];

// Computed property para detectar a bandeira do cartão
const cardBrand = computed(() => {
  const brand = cardBrands.find(brand => brand.pattern.test(numberCard.value));
  return brand ? brand.name : 'visa';
});

const isValidCardNumber = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number).reverse();
  const sum = digits.reduce((acc, digit, index) => {
    if (index % 2 === 1) {
      const double = digit * 2;
      return acc + (double > 9 ? double - 9 : double);
    }
    return acc + digit;
  }, 0);
  return sum % 10 === 0;
};

const isValidExpiryDate = (expiry: string) => {
  const [month, year] = expiry.split('/').map(Number);
  if (!month || !year || month < 1 || month > 12) return false;
  
  const currentYear = new Date().getFullYear() % 100; // Pega os dois últimos dígitos do ano
  const currentMonth = new Date().getMonth() + 1; // Janeiro = 0, então soma 1

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

const isValidCvv = (cvv: string) => {
  return /^\d{3,4}$/.test(cvv);
};

const isPaymentDisabled = computed(() => {
  return !(
    isValidCardNumber(numberCard.value) &&
    isValidExpiryDate(validateCard.value) &&
    isValidCvv(cvvCard.value) &&
    nameCard.value.trim() !== '' &&
    cpfUser.value.trim() !== '' &&
    emailUser.value.trim() !== '' &&
    cellphoneUser.value.trim() !== '' &&
    dueDate.value.trim() !== ''
  );
});

// ✅ Função para criar pagamento após validação
const createPayment = async () => {
  try {
    const payment = await $fetch<{ id: string }>('/api/asaas-create-payment', {
      method: 'POST',
      body: {
        name: nameCard.value,
        cpf: cpfUser.value,
        email: emailUser.value,
        phone: cellphoneUser.value,
        planName: 'Plano Mensal',
        value: 100.00,
        dueDate: dueDate.value,
      }
    });
    console.log('Pagamento criado:', payment);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
  }
};
</script>

<template>
<div class="w-full h-auto flex justify-center items-center">
    <div class="flex justify-center flex-row bg-gray-800 gap-6 p-8 border-gray-700 border-2 rounded-xl">
        <div>
            <InputCardNumber mask="#### #### #### ####" v-model="numberCard" 
            label="Número do cartão" placeholder="1111 1111 1111 1111"/>

            <InputPrimary v-model="nameCard" 
            label="Nome do titular" placeholder="Nome como está no cartão"/>
            
            <div class="mt-4 flex max-w-80 gap-4 flex-row">
                <InputCardNumber mask="##/##" label="Validade" v-model="validateCard" placeholder="mm/aa"/>
                <InputCardCvv mask="###" label="CVV" v-model="cvvCard" placeholder="***"/>
            </div>

            <InputCardNumber mask="###.###.###-##" v-model="cpfUser" 
            label="CPF" placeholder="123.456.789-10"/>

            <InputPrimary type="email" v-model="emailUser" 
            label="E-mail do pagador" placeholder="example@johndoe.com"/>

            <InputPrimary v-model="cellphoneUser" 
            label="Telefone do pagador" placeholder="11999999999"/>

            <InputPrimary type="date" v-model="dueDate" 
            label="Data de Vencimento" placeholder="11999999999"/>
            <ButtonPrimary :disabled="isPaymentDisabled" @click="createPayment" label="Pagar"/>

        </div>
        <div>
            <div class="h-48 w-80 rounded-lg p-3 bg-card-bg bg-no-repeat bg-cover flex flex-col justify-between">
                <div class="flex w-full h-auto justify-between items-center">
                    <img :src="`/${cardBrand}.png`" :alt="`Bandeira ${cardBrand}`">
                </div>
                <div class="h-1/3 w-full flex flex-row justify-between items-end">
                    <p>{{ numberCard ? numberCard : '**** **** **** ****' }}</p>
                    <p class="text-gray-300">{{ cvvCard ? cvvCard : '***' }}</p>
                </div>
                <div class="h-1/3 w-full flex justify-between items-end">
                    <div>{{ nameCard ? nameCard : 'Titular do cartão' }}</div>
                    <div>{{ validateCard ? validateCard : 'mm/aa' }}</div>
                </div>
            </div>
        </div>

    </div>

</div>
</template>

<style scoped>
</style>
