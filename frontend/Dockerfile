# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server with optimized settings
CMD ["npm", "run", "dev"] 