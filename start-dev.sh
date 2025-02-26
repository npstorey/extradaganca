#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== VIBE GENERATOR DEVELOPMENT SERVER STARTUP ===${NC}"
echo

# Step 1: Check and kill any existing processes
echo -e "${YELLOW}Step 1: Checking for existing server processes...${NC}"
VITE_RUNNING=$(pgrep -f vite)
TSX_RUNNING=$(pgrep -f "tsx src/main.ts")

if [ -n "$VITE_RUNNING" ] || [ -n "$TSX_RUNNING" ]; then
    echo -e "${YELLOW}Found existing processes. Stopping them...${NC}"
    
    if [ -n "$VITE_RUNNING" ]; then
        echo "Stopping Vite frontend server (PID: $VITE_RUNNING)"
        pkill -f vite
    fi
    
    if [ -n "$TSX_RUNNING" ]; then
        echo "Stopping TSX backend server (PID: $TSX_RUNNING)"
        pkill -f "tsx src/main.ts"
    fi
    
    # Give processes time to shut down
    sleep 2
    echo -e "${GREEN}Existing processes stopped.${NC}"
else
    echo -e "${GREEN}No existing server processes found.${NC}"
fi

echo

# Step 2: Start the backend server
echo -e "${YELLOW}Step 2: Starting backend server on port 3002...${NC}"
npm run start:server &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}Backend server started successfully!${NC}"
    echo -e "${GREEN}Backend available at: http://localhost:3002${NC}"
else
    echo -e "${RED}Failed to start backend server.${NC}"
    exit 1
fi

echo

# Step 3: Start the frontend server
echo -e "${YELLOW}Step 3: Starting frontend server on port 3000...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend to initialize..."
sleep 5

# Check if frontend is running
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}Frontend server started successfully!${NC}"
    echo -e "${GREEN}Frontend available at: http://localhost:3000${NC}"
else
    echo -e "${RED}Failed to start frontend server.${NC}"
    exit 1
fi

echo
echo -e "${GREEN}=== DEVELOPMENT ENVIRONMENT READY ===${NC}"
echo -e "${YELLOW}Backend:${NC} http://localhost:3002"
echo -e "${YELLOW}Frontend:${NC} http://localhost:3000"
echo
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Keep script running to make it easy to stop both servers with Ctrl+C
wait 