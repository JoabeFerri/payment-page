<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'

withDefaults(defineProps<{
  label: string;
}>(), {
  label: 'Default Label' // Define um valor padrão para 'label'
});
</script>

<template>
  <button class="font-inter py-2 px-4 bg-purple-600 rounded-md float-right transition-all
  hover:bg-purple-800 focus:outline-2 focus:outline-offset-2 focus:outline-purple-400 
  active:bg-purple-500 disabled:bg-gray-600 disabled:text-content-placeholder">
    {{ label }}
  </button>
</template>

<style scoped>
</style>
