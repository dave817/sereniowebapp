import express from 'express'
import OpenAI from 'openai'
import { pool } from '../index'
import { verifyToken } from './auth'
import type { ChatCompletionMessage } from 'openai/resources/chat/completions'

const router = express.Router()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Get message history
router.get('/messages', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE user_id = $1 
       ORDER BY timestamp DESC 
       LIMIT 50`,
      [req.user.userId]
    )

    res.json({ messages: result.rows })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ message: 'Failed to fetch messages' })
  }
})

// Send message and get AI response
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message } = req.body
    const userId = req.user.userId

    // Save user message
    const userMessage = await pool.query(
      `INSERT INTO messages (user_id, content, is_bot) 
       VALUES ($1, $2, false) 
       RETURNING *`,
      [userId, message]
    )

    // Get recent conversation history
    const history = await pool.query(
      `SELECT content, is_bot 
       FROM messages 
       WHERE user_id = $1 
       ORDER BY timestamp DESC 
       LIMIT 10`,
      [userId]
    )

    // Format messages for OpenAI
    const messages: Array<ChatCompletionMessage> = [
      {
        role: "system",
        content: "You are a compassionate mental health AI assistant. Respond with empathy and understanding."
      } as ChatCompletionMessage,
      ...history.rows.reverse().map(msg => ({
        role: msg.is_bot ? ("assistant" as const) : ("user" as const),
        content: msg.content
      }))
    ]

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Save AI response
    const botMessage = await pool.query(
      `INSERT INTO messages (user_id, content, is_bot) 
       VALUES ($1, $2, true) 
       RETURNING *`,
      [userId, aiResponse]
    )

    res.json({
      userMessage: userMessage.rows[0],
      botMessage: botMessage.rows[0]
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Failed to process message' })
  }
})

export default router
