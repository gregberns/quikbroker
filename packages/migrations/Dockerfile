FROM sqitch/sqitch:latest

WORKDIR /app
COPY . .

# Set entry point to run migrations
ENTRYPOINT ["sqitch"]
CMD ["deploy"]