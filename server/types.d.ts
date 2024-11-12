import { Request } from 'express'
import OpenAI from 'openai'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
      }
    }
  }
}

export type ChatMessage = {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  userId: string
}

export type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam
