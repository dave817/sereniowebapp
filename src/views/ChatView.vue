<template>
  <div class="chat">
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" :class="['message', message.isBot ? 'bot' : 'user']">
          <div class="avatar" v-if="message.isBot">
            <img src="@/assets/bot-avatar.png" alt="Bot Avatar">
          </div>
          <div class="message-content">
            <p>{{ message.content }}</p>
            <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>

      <div class="input-container">
        <textarea
          v-model="messageText"
          @keydown.enter.prevent="sendMessage"
          placeholder="Type your message..."
          :disabled="isLoading"
        ></textarea>
        <button @click="sendMessage" :disabled="isLoading || !messageText.trim()">
          <span v-if="!isLoading">Send</span>
          <span v-else>...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  userId: string
}

const router = useRouter()
const messages = ref<Message[]>([])
const messageText = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const formatTime = (date: Date) => {
  return format(new Date(date), 'HH:mm')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!messageText.value.trim() || isLoading.value) return

  const userMessage: Message = {
    id: Date.now().toString(),
    content: messageText.value,
    isBot: false,
    timestamp: new Date(),
    userId: localStorage.getItem('userId') || ''
  }

  messages.value.push(userMessage)
  const currentMessage = messageText.value
  messageText.value = ''
  isLoading.value = true

  try {
    await scrollToBottom()

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message: currentMessage,
        userId: userMessage.userId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get response')
    }

    const data = await response.json()
    
    const botMessage: Message = {
      id: Date.now().toString(),
      content: data.response,
      isBot: true,
      timestamp: new Date(),
      userId: userMessage.userId
    }

    messages.value.push(botMessage)
    await scrollToBottom()
  } catch (error) {
    console.error('Chat error:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const loadMessages = async () => {
  try {
    const response = await fetch('/api/messages', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to load messages')
    }

    const data = await response.json()
    messages.value = data.messages
    await scrollToBottom()
  } catch (error) {
    console.error('Error loading messages:', error)
    alert('Failed to load message history')
  }
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
    return
  }
  loadMessages()
})
</script>

<style scoped>
.chat {
  height: calc(100vh - 140px);
  padding: 20px;
}

.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 20px;
  max-width: 80%;
}

.message.bot {
  align-self: flex-start;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.message-content {
  background: #f0f2f5;
  padding: 12px;
  border-radius: 12px;
  position: relative;
}

.message.user .message-content {
  background: #42b983;
  color: white;
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.timestamp {
  font-size: 0.75em;
  color: #999;
  margin-top: 4px;
  display: block;
}

.message.user .timestamp {
  color: rgba(255, 255, 255, 0.8);
}

.input-container {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  height: 50px;
  font-family: inherit;
}

button {
  padding: 0 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
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
</style>
