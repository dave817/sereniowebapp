<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Register</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            :disabled="isLoading"
            placeholder="Enter your name"
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="isLoading"
            placeholder="Enter your email"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :disabled="isLoading"
            placeholder="Enter your password"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            :disabled="isLoading"
            placeholder="Confirm your password"
          >
        </div>

        <div class="error" v-if="error">{{ error }}</div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>

        <div class="auth-links">
          <router-link to="/login">Already have an account? Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const validateForm = computed(() => {
  if (password.value !== confirmPassword.value) {
    return 'Passwords do not match'
  }
  if (password.value.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return null
})

const handleSubmit = async () => {
  if (isLoading.value) return

  const validationError = validateForm.value
  if (validationError) {
    error.value = validationError
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.user.id)
    router.push('/chat')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

button {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background: #3aa876;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  margin-bottom: 15px;
  font-size: 14px;
}

.auth-links {
  margin-top: 20px;
  text-align: center;
}

.auth-links a {
  color: #42b983;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
