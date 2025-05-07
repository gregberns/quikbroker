# Builder stage
FROM node:20-slim AS builder
WORKDIR /app

# Install necessary build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install and setup yarn
ENV YARN_VERSION=4.2.2
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# Copy package files
COPY package.json yarn.lock ./
COPY packages/mclookup/package.json ./packages/mclookup/package.json

# Copy UI components package for monorepo build
COPY packages/ui-components/ ./packages/ui-components/

# Install dependencies
RUN yarn install --production --pure-lockfile --non-interactive

# Copy the mclookup app source code
COPY packages/mclookup/ ./packages/mclookup/

# Build the static site
RUN cd packages/mclookup && yarn build

# Production stage - nginx for serving static files
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Copy nginx configuration
COPY packages/mclookup/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/packages/mclookup/out .

# Expose port for Railway
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]