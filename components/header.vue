<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isHomeActive = computed(() =>
  route.path.startsWith('/pagpix') // Verifica se a rota começa com "/leads"
);

</script>

<template>
  <header>
    <div class="wrapper flex justify-center mb-10">
      <nav class="bg-gray-800 flex w-2/3 rounded-b-lg px-4 py-2 justify-start border-y border-gray-600 gap-9">
        <NuxtLink
          :class="{ 'router-link-exact-active': isHomeActive }"
          class="text-center font-normal text-md md:text-sm  text-content-100 transition-all" to="/">Assinar nosso conteudo</NuxtLink>
        <NuxtLink class="text-center font-normal text-md md:text-sm  text-content-100 transition-all" to="/ajuda">Ajuda para efetuar o pagamento</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.router-link-exact-active {
  font-weight: 600;
  color: #7e22ce;
  transition: all 0.3s ease;
}
</style>