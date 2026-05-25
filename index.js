/**
 * Main Application Entry Point
 * 
 * Sparkle Bots WhatsApp AI Assistant
 * Production-ready WhatsApp Chatbot Backend
 * 
 * This server:
 * - Initializes Express with middleware
 * - Connects to WhatsApp Cloud API
 * - Handles webhook verification and incoming messages
 * - Provides error handling and logging
 * - Is ready for Vercel deployment
 * 
 * Author: Sparkle Bots
 * Version: 1.0.0
 * Node Version: 18.x
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

// Import middleware
const {
  notFoundHandler,
  globalErrorHandler,
  requestLogger,
} = require('./middleware/errorHandler');

// Import routes
const webhookRoutes = require('./routes/webhook');

// Import services
const WhatsAppService = require('./services/whatsappService');
const { Logger } = require('./services/logger');

// Initialize logger
const logger = new Logger('Server');

/**
 * Application Configuration
 */
const app = express();

// Get configuration from environment
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
const validateEnvironment = () => {
  const required = ['WHATSAPP_TOKEN', 'PHONE_NUMBER_ID', 'VERIFY_TOKEN'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error(
      'Missing required environment variables',
      missing.join(', ')
    );
    logger.warn(
      'Please create a .env file with required variables. See .env.example for reference.'
    );

    // In production, exit the process
    if (NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

/**
 * Middleware Configuration
 * Order matters - middleware is called in the order it's defined
 */
const configureMiddleware = () => {
  // Body parser middleware (parse JSON requests)
  app.use(bodyParser.json({ limit: '10kb' }));
  app.use(bodyParser.urlencoded({ limit: '10kb', extended: true }));

  // Request logging middleware
  app.use(requestLogger);

  logger.info('✓ Middleware configured');
};

/**
 * Initialize WhatsApp Service
 * This service handles all communication with WhatsApp Cloud API
 */
const initializeWhatsAppService = () => {
  try {
    const whatsappService = new WhatsAppService(
      process.env.WHATSAPP_TOKEN,
      process.env.PHONE_NUMBER_ID
    );

    // Store in global for access from other modules
    global.whatsappService = whatsappService;

    logger.info('✓ WhatsApp Service initialized', {
      phoneNumberId: process.env.PHONE_NUMBER_ID,
    });

    return whatsappService;
  } catch (error) {
    logger.error('Failed to initialize WhatsApp Service', error.message);
    throw error;
  }
};

/**
 * Configure Routes
 */
const configureRoutes = () => {
  // Homepage route
  app.get('/', (req, res) => {
    res.status(200).json({
      message: '👋 Welcome to Sparkle Bots WhatsApp API',
      version: '1.0.0',
      status: 'active',
      endpoints: {
        webhook: '/webhook (GET for verification, POST for messages)',
        health: '/health (GET)',
        stats: '/stats (GET)',
      },
      documentation: 'See README.md for detailed setup instructions',
    });
  });

  // Mount webhook routes
  app.use('/', webhookRoutes);

  logger.info('✓ Routes configured');
};

/**
 * Configure Error Handling
 * Error handlers should be last
 */
const configureErrorHandling = () => {
  // 404 handler (must come before global error handler)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(globalErrorHandler);

  logger.info('✓ Error handling configured');
};

/**
 * Start Server
 */
const startServer = () => {
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(PORT, () => {
        logger.info(`🚀 Server started successfully`, {
          port: PORT,
          environment: NODE_ENV,
          timestamp: new Date().toISOString(),
        });

        logger.info('📋 Available endpoints:', {
          health: `http://localhost:${PORT}/health`,
          stats: `http://localhost:${PORT}/stats`,
          webhook: `http://localhost:${PORT}/webhook`,
        });

        resolve(server);
      });

      // Handle server errors
      server.on('error', (error) => {
        logger.error('Server error', error.message);
        reject(error);
      });
    } catch (error) {
      logger.error('Failed to start server', error.message);
      reject(error);
    }
  });
};

/**
 * Graceful Shutdown Handler
 * Handles process termination signals
 */
const handleGracefulShutdown = (server) => {
  const signals = ['SIGTERM', 'SIGINT'];

  signals.forEach((signal) => {
    process.on(signal, () => {
      logger.info(`Received ${signal} signal, shutting down gracefully...`);

      server.close(() => {
        logger.info('✓ Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown (timeout)');
        process.exit(1);
      }, 10000);
    });
  });
};

/**
 * Handle Unhandled Rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at Promise', {
    promise,
    reason: reason instanceof Error ? reason.message : reason,
  });
});

/**
 * Main Application Initialization
 */
const initializeApp = async () => {
  try {
    logger.info('🔧 Initializing Sparkle Bots WhatsApp API Server...');

    // 1. Validate environment variables
    validateEnvironment();

    // 2. Configure middleware
    configureMiddleware();

    // 3. Initialize WhatsApp service
    initializeWhatsAppService();

    // 4. Configure routes
    configureRoutes();

    // 5. Configure error handling
    configureErrorHandling();

    // 6. Start server
    const server = await startServer();

    // 7. Setup graceful shutdown
    handleGracefulShutdown(server);

    return server;
  } catch (error) {
    logger.error('Failed to initialize application', error.message);
    process.exit(1);
  }
};

/**
 * Start Application
 * Runs only if this file is executed directly (not imported)
 */
if (require.main === module) {
  initializeApp();
}

// Export app for testing or other uses
module.exports = app;
