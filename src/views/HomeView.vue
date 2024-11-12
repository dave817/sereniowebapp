<template>
  <div class="home">
    <h1>Welcome to Serenio</h1>
    <p>Your AI-powered mental health companion</p>
    <div class="actions">
      <button @click="startChat" class="primary-button">Start Chat</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startChat = () => {
  router.push('/chat')
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 40px 20px;
}

h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 40px;
}

.actions {
  margin-top: 30px;
}

.primary-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #3aa876;
}
</style>
