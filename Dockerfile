# ──────────────────────────────────────────────
# Stage 1: Install dependencies
# ──────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# ──────────────────────────────────────────────
# Stage 2: Build the application
# ──────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* variables are inlined at build time by Next.js.
# Pass them via --build-arg during docker build.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_FB_API_KEY
ARG NEXT_PUBLIC_FB_AUTH_DOMAIN
ARG NEXT_PUBLIC_FB_PROJECT_ID
ARG NEXT_PUBLIC_FB_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FB_APP_ID
ARG NEXT_PUBLIC_FB_VAPID_KEY
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_S3_PUBLIC_BASE

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_FB_API_KEY=$NEXT_PUBLIC_FB_API_KEY
ENV NEXT_PUBLIC_FB_AUTH_DOMAIN=$NEXT_PUBLIC_FB_AUTH_DOMAIN
ENV NEXT_PUBLIC_FB_PROJECT_ID=$NEXT_PUBLIC_FB_PROJECT_ID
ENV NEXT_PUBLIC_FB_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FB_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FB_APP_ID=$NEXT_PUBLIC_FB_APP_ID
ENV NEXT_PUBLIC_FB_VAPID_KEY=$NEXT_PUBLIC_FB_VAPID_KEY
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_S3_PUBLIC_BASE=$NEXT_PUBLIC_S3_PUBLIC_BASE

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ──────────────────────────────────────────────
# Stage 3: Production runner
# ──────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# public/ and .next/static/ are NOT included in standalone output
COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["node", "server.js"]
