# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app/backend

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set default environment variables
ENV PORT=5000

# Document the port (for reference)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]