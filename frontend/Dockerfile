# Install dependencies only when needed
FROM node:16.13-buster-slim AS builder

WORKDIR /app

# copy all files
# not excluded in .dockerignore
COPY . .

# install
RUN npm install --frozen-lockfile

# build the solution
RUN npm run build

# Production image, copy all the files and run next
FROM node:16.13-buster-slim AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup nodejs
RUN useradd -g nodejs nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]