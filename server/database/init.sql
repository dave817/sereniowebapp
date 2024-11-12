-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for timestamp
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
