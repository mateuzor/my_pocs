<template>
    <button @click="count++">
      Vue Counter: {{ count }}
    </button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const count = ref(0);
  </script>
  