/**
 * Webhook Controller
 * 
 * Handles all HTTP requests from WhatsApp Cloud API
 * Manages webhook verification and incoming message processing
 * 
 * Author: Sparkle Bots
 * Version: 1.0.0
 */

const { Logger } = require('../services/logger');
const ChatbotService = require('../services/chatbotService');

/**
 * Initialize logger and chatbot service
 */
const logger = new Logger('WebhookController');
const chatbotService = new ChatbotService();

/**
 * GET /webhook - Webhook Verification
 * 
 * WhatsApp Cloud API requires webhook verification
 * This endpoint responds with the VERIFY_TOKEN if it matches
 * 
 * Query Parameters:
 * - hub.mode: Should be 'subscribe'
 * - hub.challenge: Random string to echo back
 * - hub.verify_token: Token to verify (must match VERIFY_TOKEN)
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const verifyWebhook = async (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = process.env.VERIFY_TOKEN;

    logger.info('Webhook verification request received', {
      mode,
      tokenProvided: !!token,
      challenge: challenge ? 'present' : 'missing',
    });

    // Verify that the request is coming from WhatsApp
    if (mode && token && challenge) {
      // Check if the token matches
      if (mode === 'subscribe' && token === verifyToken) {
        logger.info('✓ Webhook verified successfully');
        return res.status(200).send(challenge);
      }
    }

    logger.error('Webhook verification failed', {
      reasonMode: mode !== 'subscribe' ? 'invalid mode' : '',
      reasonToken: token !== verifyToken ? 'invalid token' : '',
      reasonChallenge: !challenge ? 'missing challenge' : '',
    });

    return res.status(403).json({ error: 'Forbidden' });
  } catch (error) {
    logger.error('Error in webhook verification', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * POST /webhook - Handle Incoming Messages
 * 
 * Processes incoming messages from WhatsApp users
 * Parses message data, generates bot response, and sends reply
 * 
 * Webhook Payload Format:
 * {
 *   object: "whatsapp_business_account",
 *   entry: [{
 *     id: "...",
 *     changes: [{
 *       value: {
 *         messaging_product: "whatsapp",
 *         messages: [{
 *           from: "phone_number",
 *           id: "message_id",
 *           text: { body: "message_text" },
 *           timestamp: "unix_timestamp"
 *         }]
 *       }
 *     }]
 *   }]
 * }
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 */
const handleIncomingMessage = async (req, res) => {
  try {
    // Always respond with 200 OK immediately (important for WhatsApp)
    res.status(200).json({ status: 'received' });

    logger.info('Webhook POST request received');

    // Validate webhook payload structure
    if (!req.body?.entry?.[0]?.changes?.[0]?.value?.messages) {
      logger.warn('Invalid webhook payload structure');
      return;
    }

    // Extract the message array from webhook payload
    const incomingMessages = req.body.entry[0].changes[0].value.messages;

    // Process each incoming message
    for (const message of incomingMessages) {
      try {
        await processMessage(message);
      } catch (error) {
        logger.error('Error processing individual message', error.message);
        // Continue processing other messages even if one fails
      }
    }
  } catch (error) {
    logger.error('Error in handleIncomingMessage', error.message);
    // Still return 200 to acknowledge receipt to WhatsApp
    if (!res.headersSent) {
      res.status(200).json({ status: 'error_processed' });
    }
  }
};

/**
 * Process a single incoming message
 * Extracts text, generates response, and sends reply
 * 
 * @param {object} message - Message object from WhatsApp
 * @returns {Promise<void>}
 * @private
 */
const processMessage = async (message) => {
  try {
    // Only process text messages
    if (message.type !== 'text') {
      logger.info(`Skipping non-text message type: ${message.type}`);
      return;
    }

    // Extract message details
    const fromPhoneNumber = message.from;
    const messageId = message.id;
    const messageText = message.text?.body;

    logger.info(`Message received from ${fromPhoneNumber}`, {
      messageId,
      textPreview: messageText?.substring(0, 50),
    });

    // Validate message content
    if (!messageText || messageText.trim() === '') {
      logger.warn(`Empty message from ${fromPhoneNumber}`);
      return;
    }

    // Get WhatsApp service from app context
    // This is set during server initialization
    const whatsappService = global.whatsappService;
    if (!whatsappService) {
      logger.error('WhatsApp service not initialized');
      return;
    }

    // Process message through chatbot
    const botResponse = chatbotService.processMessage(fromPhoneNumber, messageText);

    if (!botResponse.shouldReply) {
      logger.info(`No reply needed for message from ${fromPhoneNumber}`);
      return;
    }

    // Send bot response with simulated delay
    try {
      await whatsappService.sendMessageWithDelay(
        fromPhoneNumber,
        botResponse.responseText,
        botResponse.delayMs || 1000
      );

      logger.info(`✓ Response sent to ${fromPhoneNumber}`, {
        newState: botResponse.newState,
        delayMs: botResponse.delayMs,
      });
    } catch (error) {
      logger.error(`Failed to send response to ${fromPhoneNumber}`, error.message);
    }
  } catch (error) {
    logger.error('Error in processMessage', error.message);
  }
};

/**
 * Health check endpoint
 * Used for monitoring and Vercel deployment checks
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const healthCheck = async (req, res) => {
  try {
    const activeSessions = chatbotService.getAllActiveSessions();
    const uptime = process.uptime();

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      activeSessions: activeSessions.length,
      uptime: Math.floor(uptime),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    logger.error('Error in health check', error.message);
    return res.status(500).json({ status: 'error' });
  }
};

/**
 * Get chatbot statistics (for monitoring/admin)
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getStats = async (req, res) => {
  try {
    const activeSessions = chatbotService.getAllActiveSessions();
    const stats = {
      totalActiveSessions: activeSessions.length,
      sessions: activeSessions.map((session) => ({
        phoneNumber: session.phoneNumber,
        state: session.state,
        createdAt: session.createdAt,
        lastInteraction: session.lastInteraction,
        messages: session.conversationHistory.length,
      })),
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(stats);
  } catch (error) {
    logger.error('Error in getStats', error.message);
    return res.status(500).json({ error: 'Failed to retrieve stats' });
  }
};

module.exports = {
  verifyWebhook,
  handleIncomingMessage,
  healthCheck,
  getStats,
};
