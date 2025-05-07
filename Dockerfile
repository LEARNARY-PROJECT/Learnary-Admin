# 1. Base image
FROM node:18-alpine AS builder

WORKDIR /app

# 2. Copy deps và install
COPY package.json package-lock.json ./
RUN npm install

# 3. Copy source và build
COPY . .
RUN npm run build

# 4. Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

# Chạy ở production mode
ENV NODE_ENV=production

# Expose port Next.js chạy
EXPOSE 3000

# Start app
CMD ["npm", "start"]
