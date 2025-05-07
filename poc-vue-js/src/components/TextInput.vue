<template>
  <div>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Type something..."
    />
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { watch } from 'vue'

const props = defineProps(['modelValue'])
defineEmits(['update:modelValue'])

// Reactive watch that fires every time modelValue changes
watch(() => props.modelValue, (newVal, oldVal) => {
  console.log('Input changed from', oldVal, 'to', newVal)
})
</script>

<style scoped>
input {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
