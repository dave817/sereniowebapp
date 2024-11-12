#!/bin/bash

# Create necessary directories
mkdir -p /home/runner/${REPL_SLUG}/postgres
mkdir -p /home/runner/${REPL_SLUG}/run/postgresql

# Kill existing PostgreSQL process if any
pkill -f postgres

# Initialize PostgreSQL database
initdb -D /home/runner/${REPL_SLUG}/postgres

# Modify postgresql.conf
echo "unix_socket_directories = '/home/runner/${REPL_SLUG}/run/postgresql'" >> /home/runner/${REPL_SLUG}/postgres/postgresql.conf
echo "listen_addresses = '*'" >> /home/runner/${REPL_SLUG}/postgres/postgresql.conf
echo "port = 5432" >> /home/runner/${REPL_SLUG}/postgres/postgresql.conf

# Update pg_hba.conf to allow local connections
echo "local   all             all                                     trust" > /home/runner/${REPL_SLUG}/postgres/pg_hba.conf
echo "host    all             all             127.0.0.1/32            trust" >> /home/runner/${REPL_SLUG}/postgres/pg_hba.conf
echo "host    all             all             ::1/128                 trust" >> /home/runner/${REPL_SLUG}/postgres/pg_hba.conf

# Start PostgreSQL
pg_ctl -D /home/runner/${REPL_SLUG}/postgres -l /home/runner/${REPL_SLUG}/postgres/logfile -o "-k /home/runner/${REPL_SLUG}/run/postgresql" start

# Wait for PostgreSQL to start
sleep 2

# Create the database
createdb -h 127.0.0.1 serenio

# Initialize the database schema
psql -h 127.0.0.1 -d serenio -f server/database/init.sql

# Update environment variables
cat > .env << EOL
DATABASE_URL=postgres://runner:@127.0.0.1:5432/serenio
OPENAI_API_KEY=${OPENAI_API_KEY}
BOT_PROMPT="You are great at creating beautiful, high-quality and natural conversation, making the User comfortable and understanding the meaning behind the words of User. You are great at listening deeply to craft responses that echo human empathy. You focus on the main topic brought up by the User, dive deep into it by asking relevant questions, rather than simply catching keywords to generate responses. You must use beautiful words and craft charming sentences to talk with the User. Your name is Serenio in English or 小癒 in Chinese. You must use a friendly tone to talk with the User and use '你' instead of '您' when referring to the User."
NODE_ENV=development
PORT=3001
FRONTEND_PORT=3000
BACKEND_PORT=3001
FRONTEND_URL=https://sereniowebapp.david1049.repl.co
DB_POOL_MIN=2
DB_POOL_MAX=10
EOL

# Kill any existing Node.js processes
pkill -f node

# Wait a moment for processes to clean up
sleep 2
