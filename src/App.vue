<template>
  <div class="app">
    <nav v-if="isLoggedIn">
      <router-link to="/">Home</router-link> |
      <router-link to="/chat">Chat</router-link> |
      <a href="#" @click.prevent="logout">Logout</a>
    </nav>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  padding: 20px 0;
  text-align: center;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
