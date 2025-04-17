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
    apt-get install -y python-is-python3 pkg-config build-essential postgresql-client && \
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
COPY packages/app/package.json ./packages/app/package.json

# Set up workspace and install dependencies
# RUN yarn install --production=false
RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/app/ ./packages/app/

# Build the app
RUN cd packages/app && yarn build

# Runner stage
FROM base AS runner
WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/ ./

# USER root
# RUN corepack disable
# # Set user

USER nextjs

WORKDIR /app/packages/app

# Start the server
CMD ["node", "./server.js"]
# ENTRYPOINT ["./docker-entrypoint.sh"]
