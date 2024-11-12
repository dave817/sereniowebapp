<template>
  <div class="chat">
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div v-if="sortedMessages.length === 0" class="empty-state">
          <p>Start a conversation! Your AI companion is here to listen and support you.</p>
        </div>
        <div v-for="message in sortedMessages" :key="message.id" :class="['message', message.isBot ? 'bot' : 'user']">
          <div class="avatar" v-if="message.isBot">
            <img src="../assets/bot-avatar.svg" alt="Bot Avatar">
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
import { format } from 'date-fns'
import { useChatStore } from '../stores/chat'

const store = useChatStore()
const messageText = ref('')
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
  if (!messageText.value.trim() || store.isLoading) return

  const currentMessage = messageText.value
  messageText.value = ''

  try {
    await store.sendMessage(currentMessage)
    await scrollToBottom()
  } catch (error) {
    console.error('Chat error:', error)
    alert('Failed to send message. Please try again.')
  }
}

onMounted(async () => {
  try {
    await store.loadMessages()
    await scrollToBottom()
  } catch (error) {
    console.error('Error loading messages:', error)
  }
})

// Use store's state
const { sortedMessages, isLoading } = store
</script>

<style scoped>
.chat {
  height: calc(100vh - 140px);
  padding: 20px;
  background: #f5f7fa;
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

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 2rem;
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
  background: #f0f2f5;
  padding: 5px;
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
  white-space: pre-wrap;
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
  background: white;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  height: 50px;
  font-family: inherit;
  font-size: 1rem;
}

textarea:focus {
  outline: none;
  border-color: #42b983;
}

button {
  padding: 0 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

button:hover:not(:disabled) {
  background: #3aa876;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat {
    padding: 10px;
  }

  .message {
    max-width: 90%;
  }
}
</style>
