# Dockerfile pour gwen-client - utilise les artefacts pré-compilés
# Build the client first locally with: npm run build:client

FROM node:20-alpine

WORKDIR /app

# Install serve to run the client
RUN npm install -g serve

# Copy built files (doit être compilé localement avec npm run build:client)
COPY gwen-client/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]





