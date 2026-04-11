# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package.json package-lock.json ./
COPY gwen-client ./gwen-client
COPY gwen-common ./gwen-common
COPY gwen-generated-api ./gwen-generated-api

# Install dependencies
RUN npm ci

# Build gwen-common first, then gwen-client
RUN npm run build --workspace=gwen-common
RUN npm run build --workspace=gwen-client

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the client
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/gwen-client/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
