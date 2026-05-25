/**
 * Chatbot Service Module
 * 
 * Handles all chatbot logic including message parsing,
 * bot flow, and response generation
 * Maintains user sessions and conversation context
 * 
 * Author: Sparkle Bots
 * Version: 1.0.0
 */

const { Logger } = require('./logger');

/**
 * Chatbot Service Class
 * Manages conversation flow and generates appropriate responses
 */
class ChatbotService {
  /**
   * Initialize chatbot service
   * User sessions are stored in memory using Map()
   */
  constructor() {
    this.logger = new Logger('ChatbotService');
    // Store user sessions - key: phone number, value: { state, lastInteraction, data }
    this.userSessions = new Map();
    // Cleanup intervals - remove inactive sessions after 24 hours
    this.startSessionCleanup();
  }

  /**
   * Welcome message shown when user initiates conversation
   */
  getWelcomeMessage() {
    return `👋 Welcome to Sparkle Bots!

We are here to help you.

Please choose an option:

1️⃣ Course Inquiry
2️⃣ Fees Structure
3️⃣ Demo Class
4️⃣ Talk to Counselor
5️⃣ Placement Support`;
  }

  /**
   * Get responses based on user selection
   */
  getResponseForOption(option) {
    const responses = {
      '1': {
        text: '📚 Please tell us which course you are interested in.',
        state: 'waiting_course_info',
      },
      '2': {
        text: '💰 Our team will share the latest fee structure shortly.',
        state: 'waiting_acknowledgement',
      },
      '3': {
        text: '🎯 Please share your preferred time for demo class.',
        state: 'waiting_demo_time',
      },
      '4': {
        text: '📞 Our counselor will contact you soon.',
        state: 'waiting_acknowledgement',
      },
      '5': {
        text: '🚀 We provide placement assistance and interview preparation support.',
        state: 'waiting_acknowledgement',
      },
    };

    return responses[option] || null;
  }

  /**
   * Get fallback message for invalid input
   */
  getFallbackMessage() {
    return `❓ Sorry, I didn't understand that.

Please type:
1, 2, 3, 4, or 5`;
  }

  /**
   * Process incoming message and generate response
   * @param {string} phoneNumber - User's phone number
   * @param {string} messageText - User's message content
   * @returns {object} { shouldReply: boolean, responseText: string, newState: string }
   */
  processMessage(phoneNumber, messageText) {
    try {
      const trimmedMessage = messageText.trim().toLowerCase();

      // Get or create user session
      let session = this.getOrCreateSession(phoneNumber);

      // Greeting trigger - reset conversation
      if (this.isGreeting(trimmedMessage)) {
        this.logger.info(`Greeting received from ${phoneNumber}`);
        session.state = 'showing_welcome';
        session.lastInteraction = new Date();

        return {
          shouldReply: true,
          responseText: this.getWelcomeMessage(),
          newState: 'showing_welcome',
          delayMs: 1500,
        };
      }

      // If user is in welcome state, check for valid option (1-5)
      if (session.state === 'showing_welcome' || !session.state) {
        return this.handleMenuSelection(phoneNumber, trimmedMessage, session);
      }

      // Handle other states
      if (session.state === 'waiting_course_info') {
        session.courseInfo = messageText;
        session.state = 'course_recorded';
        this.logger.info(`Course info recorded for ${phoneNumber}: ${messageText}`);

        return {
          shouldReply: true,
          responseText: `✅ Thank you for your interest in ${messageText}! Our team will contact you shortly with detailed information.`,
          newState: 'course_recorded',
          delayMs: 1200,
        };
      }

      if (session.state === 'waiting_demo_time') {
        session.demoTime = messageText;
        session.state = 'demo_scheduled';
        this.logger.info(`Demo time recorded for ${phoneNumber}: ${messageText}`);

        return {
          shouldReply: true,
          responseText: `🎯 Perfect! We'll schedule your demo class for ${messageText}. Our team will confirm the timing shortly.`,
          newState: 'demo_scheduled',
          delayMs: 1200,
        };
      }

      if (session.state === 'waiting_acknowledgement') {
        return {
          shouldReply: true,
          responseText: this.getWelcomeMessage(),
          newState: 'showing_welcome',
          delayMs: 1000,
        };
      }

      // Default: invalid input
      this.logger.info(`Invalid input from ${phoneNumber}: ${trimmedMessage}`);
      return {
        shouldReply: true,
        responseText: this.getFallbackMessage(),
        newState: session.state || 'showing_welcome',
        delayMs: 800,
      };
    } catch (error) {
      this.logger.error(`Error processing message from ${phoneNumber}`, error.message);
      return {
        shouldReply: true,
        responseText: this.getFallbackMessage(),
        newState: 'error',
        delayMs: 800,
      };
    }
  }

  /**
   * Handle menu option selection (1-5)
   * @private
   */
  handleMenuSelection(phoneNumber, selection, session) {
    // Validate input is a number 1-5
    if (!['1', '2', '3', '4', '5'].includes(selection)) {
      return {
        shouldReply: true,
        responseText: this.getFallbackMessage(),
        newState: session.state || 'showing_welcome',
        delayMs: 800,
      };
    }

    // Get response for selected option
    const response = this.getResponseForOption(selection);

    if (response) {
      session.lastSelection = selection;
      session.state = response.state;
      session.lastInteraction = new Date();

      this.logger.info(
        `User ${phoneNumber} selected option ${selection}`,
        { newState: response.state }
      );

      return {
        shouldReply: true,
        responseText: response.text,
        newState: response.state,
        delayMs: 1000,
      };
    }

    return {
      shouldReply: true,
      responseText: this.getFallbackMessage(),
      newState: 'showing_welcome',
      delayMs: 800,
    };
  }

  /**
   * Check if message is a greeting
   * @private
   */
  isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'hey there', 'hi there'];
    return greetings.includes(message);
  }

  /**
   * Get or create user session
   * @private
   */
  getOrCreateSession(phoneNumber) {
    if (this.userSessions.has(phoneNumber)) {
      return this.userSessions.get(phoneNumber);
    }

    const newSession = {
      phoneNumber,
      state: null,
      createdAt: new Date(),
      lastInteraction: new Date(),
      conversationHistory: [],
      courseInfo: null,
      demoTime: null,
      lastSelection: null,
    };

    this.userSessions.set(phoneNumber, newSession);
    this.logger.info(`New session created for ${phoneNumber}`);

    return newSession;
  }

  /**
   * Clean up inactive sessions
   * Removes sessions inactive for more than 24 hours
   * @private
   */
  startSessionCleanup() {
    setInterval(() => {
      const now = new Date();
      const maxInactivityMs = 24 * 60 * 60 * 1000; // 24 hours

      for (const [phoneNumber, session] of this.userSessions.entries()) {
        const inactivityTime = now - session.lastInteraction;

        if (inactivityTime > maxInactivityMs) {
          this.userSessions.delete(phoneNumber);
          this.logger.info(`Session cleaned up for ${phoneNumber} (inactive)`);
        }
      }
    }, 60 * 60 * 1000); // Run cleanup every hour
  }

  /**
   * Get session info for a user (useful for debugging)
   */
  getSessionInfo(phoneNumber) {
    return this.userSessions.get(phoneNumber) || null;
  }

  /**
   * Get all active sessions (useful for admin/monitoring)
   */
  getAllActiveSessions() {
    return Array.from(this.userSessions.values());
  }

  /**
   * Clear a specific user session
   */
  clearSession(phoneNumber) {
    this.userSessions.delete(phoneNumber);
    this.logger.info(`Session cleared for ${phoneNumber}`);
  }
}

module.exports = ChatbotService;
