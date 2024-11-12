import express, { Request, Response } from 'express'
import OpenAI from 'openai'
import { pool } from '../index.ts'
import type { ChatCompletionMessage } from 'openai/resources/chat/completions'

const router = express.Router()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Get message history
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, content, is_bot, timestamp 
       FROM messages 
       ORDER BY timestamp ASC 
       LIMIT 50`
    )

    // Transform the data to match the frontend expected format
    const messages = result.rows.map(row => ({
      id: row.id.toString(),
      content: row.content,
      isBot: row.is_bot,
      timestamp: row.timestamp
    }))

    res.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    // Return empty messages array instead of error to prevent frontend from breaking
    res.json({ messages: [] })
  }
})

// Send message and get AI response
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body

    // Save user message
    const userMessage = await pool.query(
      `INSERT INTO messages (content, is_bot) 
       VALUES ($1, false) 
       RETURNING id, content, is_bot, timestamp`,
      [message]
    )

    // Get recent conversation history
    const history = await pool.query(
      `SELECT content, is_bot 
       FROM messages 
       ORDER BY timestamp DESC 
       LIMIT 10`
    )

    // Format messages for OpenAI
    const messages = [
      {
        role: "system" as const,
        content: process.env.BOT_PROMPT || "You are a compassionate mental health AI assistant. Respond with empathy and understanding."
      },
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
      `INSERT INTO messages (content, is_bot) 
       VALUES ($1, true) 
       RETURNING id, content, is_bot, timestamp`,
      [aiResponse]
    )

    res.json({
      response: aiResponse,
      userMessage: userMessage.rows[0],
      botMessage: botMessage.rows[0]
    })
  } catch (error) {
    console.error('Chat error:', error)
    // Return a more specific error message
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to process message',
      error: true 
    })
  }
})

export default router
