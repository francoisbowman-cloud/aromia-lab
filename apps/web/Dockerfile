FROM node:20-alpine AS builder
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --include=dev
COPY . .
ARG API_URL
ENV API_URL=$API_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN CIRCLE_NODE_TOTAL=3 npm run build

FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/next.config.mjs ./
COPY --chown=node:node --from=builder /app/preflight-catalog.mjs ./preflight-catalog.mjs
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["npm", "start"]
