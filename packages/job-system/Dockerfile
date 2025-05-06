FROM graphile/worker

WORKDIR /worker

# COPY ./package.json ./package.json
COPY package.json ./
# COPY package.json yarn.lock ./

RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

# RUN apt-get update -qq && \
#     apt-get install -y && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*



# COPY ./files/FMCSA_CENSUS1_2025Mar/FMCSA_CENSUS1_2025Mar.txt ./files/FMCSA_CENSUS1_2025Mar/FMCSA_CENSUS1_2025Mar.txt

# COPY ./scripts ./scripts
# COPY ./scripts/fmcsa-file-upload.sh /app/scripts/fmcsa-file-upload.sh

COPY ./src/tasks /worker/tasks


# docker build -t fmcsa-upload . && docker run --rm --env-file ./.env fmcsa-upload ./scripts/fmcsa-file-upload.sh

# ENTRYPOINT ["/app/scripts/fmcsa-file-upload.sh"]
