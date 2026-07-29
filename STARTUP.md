# Pull check

# Backend Startup Guide

## 1. Set up environment variables

1. Copy `.env.example` to `.env`.
2. Fill in the values with valid credentials for your environment.
3. If a key does not work, replace it with a valid local or service credential.
   - For Redis, a local fallback is usually:
     - `REDIS_HOST=127.0.0.1`
     - `REDIS_PORT=6379`
   - For MongoDB, a local fallback is usually:
     - `MONGO_URI=mongodb://localhost:27017/finestlms`

## 2. Install dependencies

```bash
npm install
```

## 3. Verify Redis is running

If Redis is installed locally:

```bash
redis-cli -h $REDIS_HOST -p $REDIS_PORT ping
```

Expected response:

```bash
PONG
```

If you do not have Redis installed locally, you can run it with Docker:

```bash
docker run --rm -p 6379:6379 redis:latest
```

## 4. Start the backend server

Use development mode with auto-reload:

```bash
npm run dev
```

Or start the server directly:

```bash
npm start
```

The backend will be available at:

```bash
http://localhost:5000
```

API docs are available at:

```bash
http://localhost:5000/api-docs
```

## 5. Start the worker process

A separate process is required for video queue processing:

```bash
npm run worker
```

This starts `worker.js` and connects to Redis for BullMQ queue processing.

## 6. Recommended process order

Open separate terminals for each step:

1. `npm install`
2. `npm run dev` (or `npm start`)
3. `npm run worker`

## 7. Troubleshooting

- If Redis fails to connect, verify `REDIS_HOST` and `REDIS_PORT` in `.env`.
- If MongoDB fails to connect, verify `MONGO_URI` is correct and MongoDB is running.
- If email or Razorpay credentials fail, replace them with working service credentials.
- If `AWS_*` or `CLOUDFRONT_*` are not used, they can remain placeholders for local testing.
