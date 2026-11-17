FROM node:20-alpine AS builder
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/migrations ./migrations
COPY --chown=node:node --from=builder /app/data ./data
COPY --chown=node:node --from=builder /app/scripts ./scripts
USER node
EXPOSE 4000
CMD ["sh", "-lc", "node dist/db/applyCatalogCompleteness.js && node dist/index.js"]
