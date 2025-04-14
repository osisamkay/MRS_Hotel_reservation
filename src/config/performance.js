export const PERFORMANCE_CONFIG = {
  // Response time thresholds (in milliseconds)
  responseTimeThresholds: {
    search: 2000,
    reservation: 2000,
    authentication: 1000,
    payment: 2000,
  },

  // Rate limiting configuration
  rateLimiting: {
    // Maximum requests per minute
    maxRequestsPerMinute: 500,
    // Maximum concurrent users
    maxConcurrentUsers: 10000,
  },

  // Caching configuration
  caching: {
    // Cache duration in seconds
    searchResults: 300, // 5 minutes
    roomAvailability: 60, // 1 minute
    userSession: 3600, // 1 hour
  },

  // Database connection pool settings
  database: {
    maxConnections: 100,
    minConnections: 10,
    connectionTimeout: 30000, // 30 seconds
  },

  // API timeout settings
  apiTimeouts: {
    search: 5000, // 5 seconds
    booking: 10000, // 10 seconds
    payment: 15000, // 15 seconds
  },
}; 