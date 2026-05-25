# 🏗️ Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WhatsApp User                           │
│                   (Mobile/Web Client)                       │
└────────────────────────┬────────────────────────────────────┘
                         │ WhatsApp Message
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         WhatsApp Cloud API                                  │
│    (Meta Developer Infrastructure)                          │
└────────────────────────┬────────────────────────────────────┘
                         │ Webhook POST Request
                         ↓
┌──────────────────────────────────────────────────────────────┐
│       Sparkle Bots Server (Vercel/Railway/VPS)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Application                             │  │
│  │  ├─ index.js (Server & Middleware)                 │  │
│  │  │                                                   │  │
│  │  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  │ Routes Layer                               │ │  │
│  │  │  │ ├─ GET  /webhook  → Verification          │ │  │
│  │  │  │ ├─ POST /webhook  → Message Handler        │ │  │
│  │  │  │ ├─ GET  /health   → Health Check          │ │  │
│  │  │  │ └─ GET  /stats    → Statistics            │ │  │
│  │  │  └────────────────────────────────────────────┘ │  │
│  │  │                                                   │  │
│  │  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  │ Controllers                                │ │  │
│  │  │  │ └─ webhookController.js                    │ │  │
│  │  │  │    ├─ verifyWebhook()                      │ │  │
│  │  │  │    ├─ handleIncomingMessage()              │ │  │
│  │  │  │    ├─ healthCheck()                        │ │  │
│  │  │  │    └─ getStats()                           │ │  │
│  │  │  └────────────────────────────────────────────┘ │  │
│  │  │                                                   │  │
│  │  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  │ Services Layer                             │ │  │
│  │  │  │ ├─ whatsappService.js                      │ │  │
│  │  │  │ │  ├─ sendMessage()                        │ │  │
│  │  │  │ │  ├─ sendMessageWithDelay()               │ │  │
│  │  │  │ │  ├─ sendTypingIndicator()                │ │  │
│  │  │  │ │  └─ markMessageAsRead()                  │ │  │
│  │  │  │ │                                            │ │  │
│  │  │  │ ├─ chatbotService.js                       │ │  │
│  │  │  │ │  ├─ processMessage()                      │ │  │
│  │  │  │ │  ├─ getWelcomeMessage()                  │ │  │
│  │  │  │ │  ├─ getResponseForOption()               │ │  │
│  │  │  │ │  └─ Session Management (Map)             │ │  │
│  │  │  │ │                                            │ │  │
│  │  │  │ └─ logger.js                               │ │  │
│  │  │  │    ├─ info()                               │ │  │
│  │  │  │    ├─ error()                              │ │  │
│  │  │  │    └─ warn()                               │ │  │
│  │  │  └────────────────────────────────────────────┘ │  │
│  │  │                                                   │  │
│  │  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  │ Middleware Layer                           │ │  │
│  │  │  │ ├─ requestLogger()                         │ │  │
│  │  │  │ ├─ globalErrorHandler()                    │ │  │
│  │  │  │ ├─ notFoundHandler()                       │ │  │
│  │  │  │ └─ requestTimeout()                        │ │  │
│  │  │  └────────────────────────────────────────────┘ │  │
│  │  │                                                   │  │
│  │  └──────────────────────────────────────────────────┘  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐  │
│  │  │ In-Memory Storage                               │  │
│  │  │ └─ userSessions (Map)                           │  │
│  │  │    ├─ Phone Number → Session Data              │  │
│  │  │    ├─ State Management                          │  │
│  │  │    ├─ Conversation History                      │  │
│  │  │    └─ Auto-cleanup (24 hrs)                     │  │
│  │  └──────────────────────────────────────────────────┘  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐  │
│  │  │ Configuration (.env)                             │  │
│  │  │ ├─ WHATSAPP_TOKEN                               │  │
│  │  │ ├─ PHONE_NUMBER_ID                              │  │
│  │  │ ├─ VERIFY_TOKEN                                 │  │
│  │  │ └─ NODE_ENV                                     │  │
│  │  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
        │ Send Message Response        │ Log Events
        ↓                              ↓
┌──────────────────────────────────────────────────────────────┐
│         WhatsApp Cloud API Response                          │
│     (Message Sent Confirmation)                              │
└──────────────────────────────────────────────────────────────┘
        │
        ↓
┌──────────────────────────────────────────────────────────────┐
│     WhatsApp User Receives Message                           │
│          (Mobile/Web Client)                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  User sends message "hi" on WhatsApp                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  WhatsApp Cloud API                                         │
│  ├─ Receives message                                        │
│  ├─ Validates                                               │
│  └─ Sends POST /webhook                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  Express Router                                             │
│  POST /webhook → webhookController.handleIncomingMessage()  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─ Respond 200 OK (immediately)
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  Message Processing                                         │
│  ├─ Extract message data                                    │
│  ├─ Validate message structure                              │
│  ├─ Get user session or create new                          │
│  ├─ Check message type (text only)                          │
│  └─ Call chatbotService.processMessage()                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─ Message: "hi" (greeting detected)
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  ChatBot Logic                                              │
│  ├─ Detect greeting                                         │
│  ├─ Create/Get user session                                 │
│  ├─ Set state: "showing_welcome"                            │
│  └─ Generate response: Welcome menu                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─ Response:
                 │  "👋 Welcome to Sparkle Bots!
                 │   Please choose option: 1-5"
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  Send Message                                               │
│  ← whatsappService.sendMessageWithDelay()                   │
│    ├─ Send typing indicator                                 │
│    ├─ Wait 1000-2000ms (simulate thinking)                  │
│    ├─ Send actual message via WhatsApp API                  │
│    └─ Log success with timestamp                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  WhatsApp Cloud API                                         │
│  ├─ Receive send request                                    │
│  ├─ Deliver to user                                         │
│  └─ Send delivery confirmation                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  User Receives Message                                      │
│  "👋 Welcome to Sparkle Bots!"                              │
│  "Please choose an option: 1, 2, 3, 4, or 5"              │
└─────────────────────────────────────────────────────────────┘
```

---

## User Conversation State Flow

```
                    ┌─────────────────────┐
                    │    START            │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │ User sends greeting         │
                │ ("hi", "hello", "hey")      │
                └──────────────┬──────────────┘
                               │
                               ↓
                    ┌─────────────────────────┐
                    │ showing_welcome         │
                    │ (Display menu 1-5)      │
                    └──────────────┬──────────┘
                                   │
        ┌──────────────┬───────────┼────────────┬──────────────┐
        │              │           │            │              │
   User selects    User selects User selects User selects  User selects
      "1"             "2"          "3"         "4"            "5"
        │              │           │            │              │
        ↓              ↓           ↓            ↓              ↓
   ┌────────┐   ┌──────────┐  ┌────────┐  ┌───────────┐  ┌──────────┐
   │ Option │ → │ Option 2 │→ │ Option │→ │ Counselor │→ │ Placement│
   │   1    │   │ "Fees"   │  │   3    │  │ Connect   │  │ Support  │
   │Course  │   │          │  │Demo    │  │           │  │          │
   │Inquiry │   │          │  │Class   │  │           │  │          │
   └────┬───┘   └──────┬───┘  └───┬────┘  └─────┬─────┘  └─────┬────┘
        │              │          │             │              │
        ↓              ↓          ↓             ↓              ↓
    ┌────────────┐ ┌────────┐ ┌───────┐ ┌──────────┐ ┌──────────────┐
    │waiting_    │ │waiting_│ │waiting│ │waiting_  │ │waiting_      │
    │course_info │ │ack.    │ │demo_  │ │ack.      │ │ack.          │
    │            │ │        │ │time   │ │          │ │              │
    └────┬───────┘ └────┬───┘ └───┬───┘ └────┬─────┘ └──────┬───────┘
         │              │         │          │              │
         │ User sends   │         │User sends│              │
         │ response     │         │response  │              │
         ↓              ↓         ↓          ↓              ↓
    ┌─────────────┐ ┌─────┐ ┌──────────┐ ┌─────┐ ┌────────────────┐
    │course_      │ │Show │ │demo_     │ │Show │ │Show Placement  │
    │recorded     │→│Menu │→│scheduled │→│Menu │→│Info & Show Menu│
    │(Save data)  │ │Again│ │(Save)    │ │Again│ │                │
    └─────────────┘ └─────┘ └──────────┘ └─────┘ └────────────────┘
         │              │         │          │              │
         └──────────────┴─────────┴──────────┴──────────────┘
                        │
                        ↓
                    ┌────────────┐
                    │ Loop: User │
                    │can select  │
                    │another     │
                    │option or   │
                    │end chat    │
                    └────────────┘


Legend:
┌─────┐  = State/Action Node
─────→  = Flow/Transition
│      = User Input/Decision
```

---

## Request/Response Lifecycle

```
1. INCOMING REQUEST
   └─ WhatsApp sends POST to /webhook with message

2. MIDDLEWARE PROCESSING
   ├─ Body Parser: Parse JSON
   ├─ Logger: Log incoming request
   └─ Timeout: Set 30s timeout

3. ROUTE MATCHING
   └─ POST /webhook matched to webhookController

4. VERIFICATION
   ├─ Validate webhook structure
   ├─ Check message exists
   └─ Verify message type

5. MESSAGE EXTRACTION
   ├─ Get phone number
   ├─ Get message text
   ├─ Get message ID
   └─ Get timestamp

6. CHATBOT PROCESSING
   ├─ Get/create user session
   ├─ Detect message intent (greeting/option/etc)
   ├─ Generate appropriate response
   ├─ Update user state
   └─ Return response object

7. MESSAGE SENDING
   ├─ Send typing indicator
   ├─ Wait simulated delay (1-2s)
   ├─ Send message via WhatsApp API
   ├─ Handle response
   └─ Log result with timestamp

8. OUTGOING RESPONSE
   ├─ Return 200 OK
   └─ Send message_id confirmation

9. ERROR HANDLING
   ├─ Catch any errors
   ├─ Log with full context
   ├─ Send fallback message if needed
   └─ Ensure 200 OK always sent

10. MONITORING
    ├─ Update session state
    ├─ Track last interaction
    ├─ Update statistics
    └─ Ready for next message
```

---

## Database Schema (Future Enhancement)

```
users_table
├─ id (PK)
├─ phone_number (UNIQUE)
├─ name
├─ email
├─ created_at
├─ last_interaction
└─ status (active/inactive)

conversations_table
├─ id (PK)
├─ user_id (FK → users_table)
├─ message_text
├─ sender (user/bot)
├─ state
├─ timestamp
└─ response_time (ms)

sessions_table
├─ id (PK)
├─ user_id (FK → users_table)
├─ state
├─ data (JSON)
├─ created_at
├─ updated_at
└─ expires_at

templates_table
├─ id (PK)
├─ name
├─ content
├─ variables (JSON)
├─ created_at
└─ updated_at
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│              GitHub Repository                       │
│         (Source Code Management)                     │
└─────────────────────┬────────────────────────────────┘
                      │
                      ↓
         ┌────────────────────────────┐
         │  Vercel / Railway / AWS    │
         │   (Deployment Platform)    │
         └────────────────┬───────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ↓ (Dev)              ↓ (Staging)           ↓ (Production)
┌─────────┐        ┌──────────────┐      ┌─────────────┐
│Dev App  │        │Staging App   │      │Production   │
│:3000    │        │:staging.url  │      │App:appurl   │
└────┬────┘        └──────┬───────┘      └────┬────────┘
     │                    │                    │
     │ .env.development   │ .env.staging      │ .env.production
     │                    │                   │
     └────────────────────┴───────────────────┘
              All connect to WhatsApp API
```

---

## Error Handling Flow

```
┌─ Error Occurs
│
├─ Express-level errors
│  ├─ Caught by middleware
│  ├─ Logged with timestamp & context
│  └─ Response: JSON error (status code + message)
│
├─ Try-catch in functions
│  ├─ Catch error
│  ├─ Log error with context
│  ├─ Send user-friendly message
│  └─ Don't crash process
│
├─ Validation errors
│  ├─ Missing/invalid fields
│  ├─ Return 400 Bad Request
│  └─ Log validation failure
│
├─ API errors (WhatsApp)
│  ├─ Invalid token
│  ├─ Network error
│  ├─ Rate limit hit
│  ├─ Log API error response
│  └─ Retry with exponential backoff
│
└─ Unhandled resources
   ├─ 404 Not Found
   ├─ 405 Method Not Allowed
   ├─ 500 Internal Server Error
   └─ Generic error response
```

---

## Logging Architecture

```
┌──────────────────────────────────────┐
│         Event Occurs                 │
└──────────────┬───────────────────────┘
               │
               ↓
        ┌─────────────────┐
        │  Logger Service │
        │  (logger.js)    │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ↓            ↓            ↓
┌────────┐  ┌────────┐  ┌────────┐
│ INFO   │  │ ERROR  │  │ WARN   │
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    ├─ Format:  ├─ Format:  ├─ Format:
    │ [TIME]    │ [TIME]    │ [TIME]
    │ [SERVICE] │ [SERVICE] │ [SERVICE]
    │ Message   │ Message   │ Message
    │           │           │
    └─ To console
      
    Development Mode        Production Mode
    └─ Pretty Print         └─ Structured JSON
      └─ Colors               └─ Log aggregation
        └─ Full details       └─ Monitoring tools
```

---

## Performance Optimization Points

```
1. MESSAGE PROCESSING
   ├─ Parallel processing (async)
   ├─ Non-blocking I/O
   └─ Quick response to WhatsApp

2. SESSION MANAGEMENT
   ├─ In-memory Map (fastest)
   ├─ Auto-cleanup every hour
   └─ No database overhead (for now)

3. API CALLS
   ├─ Axios with timeouts
   ├─ Error handling to prevent hangs
   └─ Request logging for monitoring

4. MIDDLEWARE
   ├─ Only necessary middleware
   ├─ Order optimized
   └─ Early exit if possible

5. SCALING
   Current: Single instance
   Future: 
   ├─ Redis for sessions
   ├─ Database for history
   ├─ Message queue (RabbitMQ/Redis)
   └─ Load balancer
```

---

**Architecture Version:** 1.0  
**Last Updated:** May 25, 2025  
**Status:** Complete & Documented
