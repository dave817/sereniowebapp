<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to Serenio</h1>
      <p>Your AI-powered mental health companion</p>
      <div class="actions">
        <button @click="startChat" class="primary-button">Start Chat</button>
      </div>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>24/7 Support</h3>
        <p>Always here to listen and support you, any time of day or night.</p>
      </div>
      <div class="feature">
        <h3>Private & Secure</h3>
        <p>Your conversations are completely private and secure.</p>
      </div>
      <div class="feature">
        <h3>AI-Powered</h3>
        <p>Advanced AI technology to provide meaningful conversations and support.</p>
      </div>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  margin-top: 2rem;
}

.primary-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #3aa876;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature h3 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1.2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>
