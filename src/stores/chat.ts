import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  userId: string
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sortedMessages = computed(() => {
    return [...messages.value].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  })

  async function loadMessages() {
    isLoading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load messages')
      }

      const data = await response.json()
      messages.value = data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load messages'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(content: string) {
    isLoading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: content })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Add both user message and bot response to the messages array
      messages.value.unshift({
        ...data.userMessage,
        timestamp: new Date(data.userMessage.timestamp)
      })
      
      messages.value.unshift({
        ...data.botMessage,
        timestamp: new Date(data.botMessage.timestamp)
      })

      return data.botMessage.content
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send message'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
    error.value = null
  }

  return {
    messages,
    sortedMessages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    clearMessages
  }
})
