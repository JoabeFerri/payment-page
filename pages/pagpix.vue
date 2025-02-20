<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const nameUser = ref('');
const cpfUser = ref('');
const emailUser = ref('');
const cellphoneUser = ref('');
const pix = ref<{id: string; invoiceUrl: string; pixQrCode: { payload: string; encodedImage: string }}|null>();
const value = ref(100.00); // Valor do pagamento
const qrCode = ref<string | null>(null);
const copyPasteCode = ref<string | null>(null);
const dueDate = ref(getNextDate());
const isLoading = ref(false);

const links = [{
    label: 'Cartão de credito',
    to: '/'
  }, {
    label: 'Pix',
    to: '/pagpix'
}]

function getNextDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

const isFormValid = computed(() => {
  return (
    nameUser.value.trim() !== '' &&
    cpfUser.value.length === 14 &&
    emailUser.value.trim() !== '' &&
    cellphoneUser.value.length === 11 &&
    !isLoading.value
  );
});

// Função para criar o pagamento via Pix
const createPixPayment = async () => {
  isLoading.value = true;

  try {
    const response = await $fetch<{ id: string; invoiceUrl: string; pixQrCode: { payload: string; encodedImage: string } }>('/api/asaas-pix-payment', {
      method: 'POST',
      body: {
        name: nameUser.value,
        cpf: cpfUser.value,
        email: emailUser.value,
        phone: cellphoneUser.value,
        value: value.value,
        dueDate: dueDate.value,
      }
    });

    copyPasteCode.value = response.pixQrCode.payload;
    sessionStorage.setItem('pix', JSON.stringify(response));
    if(sessionStorage.getItem("pix"))
      pix.value = JSON.parse(sessionStorage.getItem("pix")?? '');
  } catch (error) {
    console.error('Erro ao gerar pagamento via Pix:', error);
  } finally {
    isLoading.value = false;
  }
};

const copyToClipboard = async () => {
  if (copyPasteCode.value) {
    try {
      await navigator.clipboard.writeText(copyPasteCode.value);
      alert("Código Pix copiado com sucesso! ✅");
    } catch (error) {
      console.error("Erro ao copiar o código Pix:", error);
      alert("Erro ao copiar. Tente manualmente. ❌");
    }
  }
};

onMounted(() => {
  if(sessionStorage.getItem("pix"))
    pix.value = JSON.parse(sessionStorage.getItem("pix")?? '');

});
</script>

<template>
  <div class="w-full h-auto flex justify-center items-center">
    <div class="bg-gray-800 p-8 border-gray-700 border-2 rounded-xl">
              <!-- Exibir QR Code -->
      <div v-if="pix" class="mt-6 flex flex-col items-center">
        <h2 class="text-white text-lg mb-3">Escaneie o QR Code para pagar</h2>
        <img :src="`data:image/png;base64,${pix.pixQrCode.encodedImage}`" alt="QR Code Pix" class="w-48 h-48 rounded-lg shadow-lg" />

        <!-- Código Copia e Cola -->
        <div class="mt-4 p-3 bg-gray-700 rounded-md w-full text-center">
          <p class="text-white text-sm mb-4">Ou copie o código Pix:</p>
          <ButtonPrimary class="w-full" @click="copyToClipboard" label="Copiar Código Pix" />
        </div>
      </div>

      <div v-else>
        <UHorizontalNavigation :links="links" class="mb-6 border-gray-200 dark:border-gray-800"
            :ui="{ active: 'after:bg-purple-500 dark:after:bg-purple-500' }" />

        <div class="flex justify-center gap-6 flex-row">
            <div>
            <InputPrimary v-model="nameUser" label="Nome completo" placeholder="Nome completo" />
            <InputCardNumber mask="###.###.###-##" v-model="cpfUser" label="CPF" placeholder="123.456.789-10" />
            </div>
            <div>
            <InputPrimary type="email" v-model="emailUser" label="E-mail" placeholder="example@johndoe.com" />
            <InputPrimary v-model="cellphoneUser" label="Telefone" placeholder="11999999999" />
            </div>
        </div>

        <ButtonPrimary
            class="w-full mt-4"
            :disabled="!isFormValid"
            @click="createPixPayment"
            :label="isLoading ? 'Gerando Pix...' : 'Gerar Pix'"
        />
      </div>

    </div>
  </div>
</template>

<style scoped></style>
