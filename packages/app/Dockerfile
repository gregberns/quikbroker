# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="NodeJS"

# Setup environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV YARN_VERSION=4.2.2
ENV PORT=8080

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install and configure yarn
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Builder stage
FROM base AS builder
WORKDIR /app


# Copy package files
COPY package.json yarn.lock ./
COPY packages/app/ ./packages/app/

# Set up workspace and install dependencies
# RUN yarn install --production=false
RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

RUN ls -la ./
RUN ls -la ./packages/app/
RUN ls -la ./packages/app/src/app

# Build the app
RUN cd packages/app && yarn build

# Runner stage
FROM base AS runner
WORKDIR /app

# Copy necessary files from builder
# COPY --from=builder --chown=nextjs:nodejs /app/packages/app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/packages/app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/packages/app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/ ./

# Set user
USER nextjs

# Expose port
# EXPOSE 8080

WORKDIR /app/packages/app

# Start the server
CMD ["node", "./server.js"]
