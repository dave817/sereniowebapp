import express from 'express'
import dotenv from 'dotenv'
import pkg from 'pg'
const { Pool } = pkg
import cors from 'cors'
import chatRoutes from './routes/chat.ts'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

const app = express()
const port = parseInt(process.env.PORT || '3001', 10)
const __dirname = dirname(fileURLToPath(import.meta.url))

// Database setup
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: false
}

console.log('Database config:', { ...dbConfig, connectionString: '[REDACTED]' })

export const pool = new Pool(dbConfig)

// Initialize database
async function initDb() {
  let retries = 5
  while (retries > 0) {
    try {
      await pool.query('SELECT NOW()')
      console.log('Database connection successful')
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          is_bot BOOLEAN DEFAULT false,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
      `)
      console.log('Database initialized successfully')
      return
    } catch (error) {
      console.error(`Database initialization error (${retries} retries left):`, error)
      retries--
      if (retries === 0) {
        throw error
      }
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// API Routes
app.use('/api/chat', chatRoutes)

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

let server: any = null

// Start server
async function startServer() {
  try {
    await initDb()
    
    server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`)
    })

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`)
        process.exit(1)
      } else {
        console.error('Server error:', error)
        process.exit(1)
      }
    })
  } catch (error) {
    console.error('Server startup error:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
      pool.end(() => {
        console.log('Database connection pool closed')
        process.exit(0)
      })
    })
  }
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
      pool.end(() => {
        console.log('Database connection pool closed')
        process.exit(0)
      })
    })
  }
})

startServer().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
