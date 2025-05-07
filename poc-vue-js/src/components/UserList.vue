<template>
    <div class="user-list">
      <h2>Users</h2>
  
      <div v-if="loading">Loading users...</div>
      <div v-else-if="error" class="error">Error: {{ error }}</div>
      <ul v-else>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} — {{ user.email }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const users = ref([])
  const loading = ref(true)
  const error = ref(null)
  
  onMounted(async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      users.value = await res.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .user-list {
    margin-top: 2rem;
    text-align: left;
  }
  .error {
    color: red;
  }
  </style>
  