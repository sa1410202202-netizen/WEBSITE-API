/**
 * Webhook Routes
 * 
 * Defines all webhook endpoints for WhatsApp Cloud API
 * Includes verification, message handling, and monitoring endpoints
 * 
 * Author: Sparkle Bots
 * Version: 1.0.0
 */

const express = require('express');
const router = express.Router();
const {
  verifyWebhook,
  handleIncomingMessage,
  healthCheck,
  getStats,
} = require('../controllers/webhookController');
const { Logger } = require('../services/logger');

const logger = new Logger('WebhookRoutes');

/**
 * Webhook Verification Route
 * GET /webhook
 * 
 * Responds to WhatsApp Cloud API webhook verification challenge
 * WhatsApp will send: GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
 * We must respond with the challenge value to confirm webhook ownership
 */
router.get('/webhook', async (req, res) => {
  logger.info('GET /webhook - Verification request');
  await verifyWebhook(req, res);
});

/**
 * Incoming Messages Route
 * POST /webhook
 * 
 * Receives incoming messages and status updates from WhatsApp Cloud API
 * Payload structure: { object, entry: [{ changes: [{ value: { messages: [...], statuses: [...] } }] }] }
 * Processes messages and sends automated responses
 */
router.post('/webhook', async (req, res) => {
  logger.info('POST /webhook - Incoming message');
  await handleIncomingMessage(req, res);
});

/**
 * Health Check Route
 * GET /health
 * 
 * Returns server health status and basic metrics
 * Used for uptime monitoring and deployment health checks
 * 
 * Response: { status, timestamp, activeSessions, uptime, environment }
 */
router.get('/health', async (req, res) => {
  logger.info('GET /health - Health check');
  await healthCheck(req, res);
});

/**
 * Statistics Route
 * GET /stats
 * 
 * Returns current chatbot statistics
 * Shows active user sessions, states, and interaction history
 * 
 * Response: { totalActiveSessions, sessions: [...], timestamp }
 * 
 * Note: In production, this should be protected by authentication
 */
router.get('/stats', async (req, res) => {
  logger.info('GET /stats - Statistics request');
  await getStats(req, res);
});

module.exports = router;
