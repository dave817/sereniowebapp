import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  userId?: string
}

const API_BASE = process.env.REPL_ID 
  ? 'https://sereniowebapp--david1049.repl.co'
  : 'http://localhost:3001'

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
      const response = await fetch(`${API_BASE}/api/chat/messages`)

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
      // Add user message immediately
      const userMessage = {
        id: Date.now().toString(),
        content,
        isBot: false,
        timestamp: new Date()
      }
      messages.value.unshift(userMessage)

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: content })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Add bot response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date()
      }
      messages.value.unshift(botMessage)

      return data.response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send message'
      // Remove the user message if there was an error
      messages.value = messages.value.filter(msg => msg.content !== content)
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
