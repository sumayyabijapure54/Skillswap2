import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js']
    // Vitest isolates each test FILE in its own module registry by default,
    // so module-level state (e.g. express-rate-limit's in-memory request
    // counters) starts fresh per file but is shared across tests within one
    // file — relied on by tests/rateLimiting.test.js.
  }
});
