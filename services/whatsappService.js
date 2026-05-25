/**
 * WhatsApp Service Module
 * 
 * Handles all interactions with WhatsApp Cloud API
 * Including sending messages, managing templates, and API formatting
 * 
 * Author: Sparkle Bots
 * Version: 1.0.0
 */

const axios = require('axios');
const { Logger } = require('./logger');

// Constants
const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_BASE_URL = `https://graph.instagram.com/${WHATSAPP_API_VERSION}`;

/**
 * WhatsApp Service Class
 * Manages all WhatsApp Cloud API operations
 */
class WhatsAppService {
  /**
   * Initialize WhatsApp Service
   * @param {string} token - WhatsApp Cloud API access token
   * @param {string} phoneNumberId - WhatsApp Business Phone Number ID
   */
  constructor(token, phoneNumberId) {
    this.token = token;
    this.phoneNumberId = phoneNumberId;
    this.logger = new Logger('WhatsAppService');
  }

  /**
   * Send text message to WhatsApp user
   * @param {string} recipientPhoneNumber - Recipient's WhatsApp phone number (with country code)
   * @param {string} messageText - Message content to send
   * @returns {Promise<object>} API response
   */
  async sendMessage(recipientPhoneNumber, messageText) {
    try {
      // Validate inputs
      if (!recipientPhoneNumber || !messageText) {
        throw new Error('Phone number and message text are required');
      }

      // Build request payload
      const payload = {
        messaging_product: 'whatsapp',
        to: recipientPhoneNumber,
        type: 'text',
        text: {
          body: messageText,
        },
      };

      // Make API request
      const response = await axios.post(
        `${WHATSAPP_API_BASE_URL}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.info(
        `✓ Message sent successfully to ${recipientPhoneNumber}`,
        { messageId: response.data?.messages?.[0]?.id }
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `✗ Failed to send message to ${recipientPhoneNumber}`,
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Send message with typing indicator delay
   * Simulates bot "thinking" time for better UX
   * @param {string} recipientPhoneNumber - Recipient's phone number
   * @param {string} messageText - Message to send
   * @param {number} delayMs - Delay in milliseconds (default: 1000ms)
   * @returns {Promise<object>} API response
   */
  async sendMessageWithDelay(
    recipientPhoneNumber,
    messageText,
    delayMs = 1000
  ) {
    try {
      // Send typing indicator
      await this.sendTypingIndicator(recipientPhoneNumber);

      // Wait for simulated thinking time
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      // Send actual message
      const response = await this.sendMessage(recipientPhoneNumber, messageText);

      return response;
    } catch (error) {
      this.logger.error('Error in sendMessageWithDelay', error.message);
      throw error;
    }
  }

  /**
   * Send typing indicator to show bot is responding
   * @param {string} recipientPhoneNumber - Recipient's phone number
   * @returns {Promise<object>} API response
   */
  async sendTypingIndicator(recipientPhoneNumber) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'typing',
        recipient_type: 'individual',
        to: recipientPhoneNumber,
      };

      const response = await axios.post(
        `${WHATSAPP_API_BASE_URL}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error sending typing indicator', error.message);
      // Don't throw - typing indicator is optional
      return null;
    }
  }

  /**
   * Mark message as read
   * @param {string} messageId - ID of the message to mark as read
   * @returns {Promise<object>} API response
   */
  async markMessageAsRead(messageId) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      };

      const response = await axios.post(
        `${WHATSAPP_API_BASE_URL}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.info(`✓ Message marked as read: ${messageId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error marking message as read', error.message);
      throw error;
    }
  }

  /**
   * Extract message data from webhook payload
   * @param {object} messageData - Message data from webhook
   * @returns {object} Extracted and formatted message data
   */
  extractMessageData(messageData) {
    try {
      const message = {
        textContent: null,
        fromPhoneNumber: null,
        messageId: null,
        timestamp: null,
      };

      // Extract phone number
      if (messageData?.from) {
        message.fromPhoneNumber = messageData.from;
      }

      // Extract message ID
      if (messageData?.id) {
        message.messageId = messageData.id;
      }

      // Extract timestamp
      if (messageData?.timestamp) {
        message.timestamp = new Date(parseInt(messageData.timestamp) * 1000);
      }

      // Extract text content
      if (messageData?.type === 'text' && messageData?.text?.body) {
        message.textContent = messageData.text.body;
      }

      return message;
    } catch (error) {
      this.logger.error('Error extracting message data', error.message);
      throw error;
    }
  }

  /**
   * Validate webhook signature (optional but recommended for production)
   * @param {string} body - Request body as string
   * @param {string} signature - X-Hub-Signature header
   * @param {string} secret - App secret token
   * @returns {boolean} True if signature is valid
   */
  validateWebhookSignature(body, signature, secret) {
    try {
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      const expectedSignature = `sha256=${hash}`;

      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Error validating webhook signature', error.message);
      return false;
    }
  }
}

module.exports = WhatsAppService;
