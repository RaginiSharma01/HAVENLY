FROM node:18-alpine AS app
WORKDIR /app

# Copy package.json & package-lock.json first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy rest of the app files
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD ["node", "app.js"]
