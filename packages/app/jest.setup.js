import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to silence console.log in tests
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};