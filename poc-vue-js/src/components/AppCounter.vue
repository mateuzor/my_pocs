<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value--
</script>

<style scoped>
.counter {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}
button {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
}
</style>
