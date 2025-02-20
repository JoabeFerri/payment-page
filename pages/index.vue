<script setup lang="ts">
import { ref, computed } from 'vue';

const numberCard = ref('');
const validateCard = ref('');
const cvvCard = ref('');
const nameCard = ref('');
const cpfUser = ref('');
const emailUser = ref('');
const cellphoneUser = ref('');
const dueDate = ref(getNextDate());
const isSubscription = ref(false);
const isLoading = ref(false);
const paymentSuccess = ref(false);
const paymentDescription = ref('');

const links = [
  { label: 'Cartão de crédito', to: '/' },
  { label: 'Pix', to: '/pagpix' }
];

const cardBrands = [
  { name: 'elo', pattern: /^(4011|4312|4389|4514|4576|5041|6277|6362|6504|6505|6509|6516|6550)/ },
  { name: 'visa', pattern: /^4/ },
  { name: 'master', pattern: /^5[1-5]/ },
];

function getNextDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

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
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
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
    dueDate.value.trim() !== '' &&
    !isLoading.value
  );
});

const paymentAmount = computed(() => {
  return isSubscription.value ? 100 : 150;
});

const createPayment = async () => {
  isLoading.value = true;
  paymentSuccess.value = false;

  try {
    const payment = await $fetch<{ id: string, link: string, description: string }>('/api/asaas-create-payment', {
      method: 'POST',
      body: {
        name: nameCard.value,
        cpf: cpfUser.value,
        email: emailUser.value,
        phone: cellphoneUser.value,
        planName: isSubscription.value ? 'Plano Mensal' : 'Pagamento Único',
        value: paymentAmount.value,
        dueDate: dueDate.value,
        isSubscription: isSubscription.value,
      }
    });

    console.log('Pagamento criado:', payment);
    paymentDescription.value = payment.description;
    paymentSuccess.value = true;

    // 🔹 Limpa os campos do formulário
    numberCard.value = '';
    validateCard.value = '';
    cvvCard.value = '';
    nameCard.value = '';
    cpfUser.value = '';
    emailUser.value = '';
    cellphoneUser.value = '';
    isSubscription.value = false;

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
  } finally {
    isLoading.value = false;
  }
};

const createPaymentStripe = async () => {
  isLoading.value = true

  try {
    const payment = await $fetch('/api/stripe-create-session', {
      method: 'POST',
    });
    await navigateTo(payment?.url, {external: true})
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
  } finally {

  }

}
</script>

<template>
<div class="w-full h-auto flex justify-center items-center">
  <div class="bg-gray-800 p-8 border-gray-700 border-2 rounded-xl">
    <div v-if="paymentSuccess" class="text-center text-white">
      <h2 class="text-xl font-bold mb-4">Pagamento realizado com sucesso! 🎉</h2>
      <p class="text-gray-300">{{ paymentDescription }}</p>
    </div>


    <div v-else>
      <UHorizontalNavigation :links="links" class="mb-6 border-gray-200 dark:border-gray-800"
        :ui="{
          active: 'after:bg-purple-500 dark:after:bg-purple-500'
        }" />
    
        <div class="flex justify-center gap-6 flex-row">
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
            </div>
    
            <div class="flex flex-col justify-between">
                <div class="h-44 w-80 rounded-lg p-3 bg-card-bg bg-no-repeat bg-cover flex flex-col justify-between">
                    <div class="flex w-full h-9 justify-between items-center">
                        <img :src="`/${cardBrand}.png`" :alt="`Bandeira ${cardBrand}`">
                    </div>
                    <div class="h-1/3 w-full flex flex-row justify-between items-end">
                        <p>{{ numberCard ? numberCard : '•••• •••• •••• ••••' }}</p>
                        <p class="text-gray-300">{{ cvvCard ? cvvCard : '•••' }}</p>
                    </div>
                    <div class="h-1/3 w-full flex justify-between items-end">
                        <div>{{ nameCard ? nameCard : 'Titular do cartão' }}</div>
                        <div>{{ validateCard ? validateCard : '••/••' }}</div>
                    </div>
                </div>
    
                <div>
                  <InputPrimary type="email" v-model="emailUser" 
                  label="E-mail do pagador" placeholder="example@johndoe.com"/>
      
                  <InputPrimary v-model="cellphoneUser" 
                  label="Telefone do pagador" placeholder="11999999999"/>  
                </div>
            </div>
        </div>
    
        <div class="mt-4 flex items-center">
          <input type="checkbox" id="subscription" v-model="isSubscription" class="mr-2">
          <label for="subscription" class="text-white">Assinatura mensal</label>
        </div>
    
        <div class="mt-2 text-white">
          Valor a pagar: R$ {{ paymentAmount.toFixed(2) }}
          <span v-if="isSubscription">/mês</span>
        </div>
    
        <ButtonPrimary class="w-full mt-4" :disabled="isPaymentDisabled" @click="createPayment" :label="isSubscription ? 'Assinar' : 'Pagar'"/>
        <ButtonPrimary class="w-full mt-4" @click="createPaymentStripe" label="Pagar com Stripe"/>
    </div>

  </div>
</div>
</template>

<style scoped>
</style>