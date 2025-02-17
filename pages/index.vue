<script setup lang="ts">
const numberCard = ref('');
const validateCard = ref('');
const cvvCard = ref('');
const nameCard = ref('');

</script>

<template>
<div class="w-full h-screen flex justify-center items-center">
    <div class="flex justify-center flex-row bg-gray-800 gap-14 p-8 border-gray-700 border-2 rounded-xl">
        <div>
            <InputCardNumber mask="#### #### #### ####" v-model="numberCard" 
            label="Número do cartão" placeholder="1111 1111 1111 1111"/>

            <InputPrimary v-model="nameCard" 
            label="Nome do titular" placeholder="Nome como está no cartão"/>
            
            <div class="mt-4 flex max-w-80 gap-4 flex-row">
                <InputCardNumber mask="##/##" label="Validade" v-model="validateCard" placeholder="mm/aa"/>
                <InputCardCvv mask="###" label="CVV" v-model="cvvCard" placeholder="***"/>
            </div>
        </div>
        <div>
            <img class="m-auto animate-bounce" width="100" height="100" src="~/assets/work_icon.svg" alt="In work">
            <p class="text-white text-lg">In Construction</p>
        </div>
    </div>
</div>
</template>

<style scoped>
</style>
