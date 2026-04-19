# Base image — specific version, never "latest" in production
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (Docker layer caching optimization)
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Health check — Docker will monitor this
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Run the app
CMD ["node", "src/app.js"]