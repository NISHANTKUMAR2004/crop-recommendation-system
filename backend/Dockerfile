# Use stable Node LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]