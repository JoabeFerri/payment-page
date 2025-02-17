<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from 'vue'

const props = withDefaults(defineProps<{
  placeholder: string
  label: string
  modelValue: string
  type?: string
  mask?: string
}>(), {
  type: 'text',
  modelValue: '',
  mask: ''
})

const emit = defineEmits(['update:modelValue'])

const applyMask = (value: string, mask: string) => {
  if (!mask) return value

  let maskedValue = ''
  let index = 0
  for (let char of mask) {
    if (index >= value.length) break
    if (char === '#') {
      maskedValue += value[index]
      index++
    } else {
      maskedValue += char
    }
  }
  return maskedValue
}

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement
  const rawValue = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
  input.value = applyMask(rawValue, props.mask) // Aplica a máscara
  emit('update:modelValue', input.value)
}
</script>

<template>
  <div class="w-full flex gap-2 flex-col mb-5">
    <label class="font-semibold">{{ props.label }}</label>
    <input 
      class="bg-gray-900 w-full h-11 border-gray-700 border-2 rounded-lg
      focus-visible:border-purple-600 placeholder:text-content-placeholder outline-none px-4 transition-all" 
      :placeholder="props.placeholder"
      :type="props.type"
      :value="modelValue"
      @input="updateValue"
    >
  </div>
</template>
