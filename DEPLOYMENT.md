# Deployment Instructions

## Project Structure
This project consists of:
- Frontend: Vue.js application
- Backend: Node.js/Express API
- Database: PostgreSQL

## Step 1: Prepare for Deployment

### Frontend Deployment (Vercel/Netlify)
1. Create a new repository for the frontend code
2. Copy these files/folders to the new frontend repository:
   - src/
   - public/
   - index.html
   - package.json (remove backend dependencies)
   - tsconfig.json
   - tsconfig.node.json
   - vite.config.ts
   - .env (create new with only frontend variables)

3. Update environment variables:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend Deployment (Render.com)
1. Create a new repository for the backend code
2. Copy these files/folders to the new backend repository:
   - server/
   - package.json (remove frontend dependencies)
   - tsconfig.json
   - .env (create new with backend variables)

3. Required environment variables on Render.com:
```env
DATABASE_URL=postgres://your-render-postgres-url
OPENAI_API_KEY=your-openai-key
BOT_PROMPT=your-bot-prompt
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Database (Render.com)
1. Create a new PostgreSQL database on Render.com
2. Use the connection string provided by Render in your backend's DATABASE_URL
3. Run the database initialization script using the provided connection string

## Step 2: Deploy

### Frontend Deployment Steps
1. Push your frontend code to a new GitHub repository
2. Sign up for Vercel or Netlify
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Add environment variables in the Vercel/Netlify dashboard
6. Deploy

### Backend Deployment Steps
1. Push your backend code to a new GitHub repository
2. Sign up for Render.com
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure build settings:
   - Build command: `npm install`
   - Start command: `node --loader ts-node/esm server/index.ts`
6. Add environment variables in the Render dashboard
7. Deploy

### Database Setup on Render
1. Create a new PostgreSQL database
2. Copy the external connection string
3. Update your backend service's DATABASE_URL with this connection string
4. Connect to the database and run the initialization script:
   ```sql
   -- Copy contents of server/database/init.sql
   ```

## Step 3: Verify Deployment
1. Test frontend URL: https://your-app.vercel.app
2. Test backend URL: https://your-api.onrender.com
3. Verify database connection
4. Test complete application flow

## Common Issues and Solutions
1. CORS: Ensure FRONTEND_URL in backend environment variables matches your frontend URL
2. Database Connection: Verify DATABASE_URL format and credentials
3. Environment Variables: Double-check all required variables are set in both frontend and backend
4. Build Errors: Make sure all dependencies are properly listed in package.json

## Monitoring and Maintenance
- Monitor application logs in Vercel/Netlify and Render dashboards
- Set up alerts for errors or high usage
- Regularly backup your database
- Monitor API usage and costs (especially OpenAI API)
