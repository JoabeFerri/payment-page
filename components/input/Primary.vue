<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from 'vue'

withDefaults(defineProps<{
  placeholder: string,
  label: string,
  modelValue: string,
  type?: string,
}>(), {
  type: 'text',
  modelValue: '',
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="w-full flex gap-2 flex-col mb-5">
    <label class="font-semibold">{{ label }}</label>
    <input 
      class="bg-gray-900 w-full h-11 border-gray-700 border-2 rounded-lg
      focus-visible:border-purple-600 placeholder:text-content-placeholder outline-none px-4 transition-all" 
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      @input="updateValue"
    >
  </div>
</template>

<style scoped>
</style>
