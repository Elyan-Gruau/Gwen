# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package.json package-lock.json ./
COPY gwen-common ./gwen-common
COPY gwen-server ./gwen-server

# Install dependencies
RUN npm ci

# Build gwen-common first, then gwen-server
RUN npm run build --workspace=gwen-common
RUN npm run build --workspace=gwen-server

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY gwen-common ./gwen-common
COPY gwen-server ./gwen-server

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/gwen-common/dist ./gwen-common/dist
COPY --from=builder /app/gwen-server/dist ./gwen-server/dist

EXPOSE 3000

CMD ["npm", "start", "--workspace=gwen-server"]

