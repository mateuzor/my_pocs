<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <AppCounter />
    <TextInput v-model="message" />
    <p>You typed: {{ message }}</p>
    <UserList />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppCounter from './components/AppCounter.vue'
import TextInput from './components/TextInput.vue'
import UserList from './components/UserList.vue'


const title = 'Vue Js poc'
const message = ref('')
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 2rem;
}
</style>
