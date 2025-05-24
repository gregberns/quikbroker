const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Helper function to determine if a request is an API request
function isApiRequest(req) {
  const parsedUrl = parse(req.url, true);
  return parsedUrl.pathname.startsWith('/api/');
}

// Function to send JSON error response for API routes
function sendJsonError(res, statusCode, message, details) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode || 500;
  res.end(JSON.stringify({
    status: 'error',
    message: message || 'Internal Server Error',
    details: dev ? details : undefined,
  }));
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      
      // Check if it's an API request
      if (isApiRequest(req)) {
        // For API requests, return a JSON error response
        sendJsonError(res, 500, 'Internal Server Error', err.stack);
      } else {
        // For page requests, return HTML error response
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
}); 
