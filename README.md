# Serenio Web Version

A web-based mental health AI assistant that provides empathetic conversations and support.

## Features

- User authentication (login/register)
- Real-time chat with AI assistant
- Message history persistence
- Responsive design for all devices
- Secure token-based authentication

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```env
# Database configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/serenio

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT configuration
JWT_SECRET=your_jwt_secret_here

# Node environment
NODE_ENV=development

# Server port
PORT=3000
```

3. Initialize the database:
```bash
npm run init-db
```

## Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend API at http://localhost:3000/api

## Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
NODE_ENV=production npm run dev:backend
```

## Project Structure

```
web-version/
├── src/                  # Frontend source code
│   ├── views/           # Vue components for each route
│   ├── router/          # Vue Router configuration
│   └── assets/          # Static assets
├── server/              # Backend source code
│   ├── routes/          # API route handlers
│   ├── database/        # Database setup and migrations
│   └── types.d.ts       # TypeScript type definitions
└── public/              # Static files served directly
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Chat
- GET `/api/chat/messages` - Get message history
- POST `/api/chat` - Send message and get AI response

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS protection
- Environment variables for sensitive data
- SQL injection protection with parameterized queries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
