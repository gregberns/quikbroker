FROM node:20.11.0-alpine3.19

RUN apk add --update --no-cache bash postgresql-client

WORKDIR /app

COPY packages/schema/package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-optional

COPY packages/schema/migrations ./migrations
# COPY packages/schema/scripts ./scripts
COPY packages/schema/docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
