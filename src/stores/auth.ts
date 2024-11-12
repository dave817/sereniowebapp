import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: string
  name: string
  email: string
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData extends LoginData {
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(data: LoginData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Login failed')
      }

      token.value = result.token
      user.value = result.user
      localStorage.setItem('token', result.token)
      localStorage.setItem('userId', result.user.id)
      
      await router.push('/chat')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      token.value = result.token
      user.value = result.user
      localStorage.setItem('token', result.token)
      localStorage.setItem('userId', result.user.id)
      
      await router.push('/chat')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    router.push('/login')
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      logout()
      return false
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Invalid token')
      }

      const data = await response.json()
      user.value = data.user
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
})
