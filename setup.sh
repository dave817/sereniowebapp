#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Serenio Web setup...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js version 18 or higher.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please update it with your configuration.${NC}"
fi

# Initialize database
echo -e "${BLUE}Initializing database...${NC}"
npm run init-db

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to initialize database. Please check your database configuration in .env file.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update the .env file with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo -e "\n${BLUE}For more information, see the README.md file.${NC}"
