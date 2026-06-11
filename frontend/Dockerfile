# Stage 1: Build ứng dụng React
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve bằng Nginx
FROM nginx:alpine
# Copy file đã build từ stage 1 sang thư mục của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
