FROM node:18-alpine

WORKDIR /app

# Copy package.json và package-lock.json trước để tận dụng Docker Cache
COPY package*.json ./

RUN npm install --production

# Copy toàn bộ source code
COPY . .

EXPOSE 5000

# Chạy server
CMD ["node", "src/server.js"]
