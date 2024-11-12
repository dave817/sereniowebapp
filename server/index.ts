import express from 'express'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import cors from 'cors'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import { createServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const __dirname = dirname(fileURLToPath(import.meta.url))

// Database setup
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
})

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

// Vite integration for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createServer({
    root: resolve(__dirname, '..'),
    server: {
      middlewareMode: true
    }
  })
  app.use(vite.middlewares)
} else {
  // Serve static files in production
  app.use(express.static(resolve(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../dist/index.html'))
  })
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// Initialize database
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        is_bot BOOLEAN DEFAULT false,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
    process.exit(1)
  }
}

// Start server
async function startServer() {
  await initDb()
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startServer().catch(console.error)
