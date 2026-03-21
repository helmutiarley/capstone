FROM node:20-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci && npx prisma generate

FROM base AS prod-deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS runtime

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src
COPY server.js ./

RUN chown -R node:node /app

USER node
EXPOSE 3000

CMD ["node", "server.js"]

FROM deps AS migrate

ENV NODE_ENV=production

RUN chown -R node:node /app

USER node

CMD ["npx", "prisma", "migrate", "deploy"]
