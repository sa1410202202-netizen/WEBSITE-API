# 🤖 Sparkle Bots WhatsApp AI Assistant

A production-ready WhatsApp chatbot backend built with Node.js, Express.js, and WhatsApp Cloud API. Fully configured for deployment on Vercel.

## ✨ Features

- ✅ **Webhook Verification** - Secure webhook endpoint with VERIFY_TOKEN authentication
- ✅ **Message Processing** - Handle incoming WhatsApp messages with intelligent routing
- ✅ **Automated Responses** - Smart bot flow with contextual replies
- ✅ **Session Management** - Track user conversations using in-memory sessions
- ✅ **Typing Indicators** - Simulate bot "thinking" for better UX
- ✅ **Error Handling** - Comprehensive error handling and logging middleware
- ✅ **Logging System** - Structured logging with timestamps for debugging
- ✅ **Vercel Ready** - Pre-configured for Vercel deployment
- ✅ **Health Monitoring** - Built-in health check and statistics endpoints
- ✅ **Environment Configuration** - Secure environment variable management with dotenv

## 📦 Bot Capabilities

### User Greetings
When a user sends: `hi`, `hello`, `hey`

Bot responds with welcome menu:
```
👋 Welcome to Sparkle Bots!

We are here to help you.

Please choose an option:

1️⃣ Course Inquiry
2️⃣ Fees Structure
3️⃣ Demo Class
4️⃣ Talk to Counselor
5️⃣ Placement Support
```

### Menu Options
- **Option 1**: Course Inquiry → Collects course interest
- **Option 2**: Fees Structure → Shares pricing information
- **Option 3**: Demo Class → Collects preferred time
- **Option 4**: Talk to Counselor → Connects to human support
- **Option 5**: Placement Support → Explains job assistance

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- WhatsApp Business Account
- Meta Developer Account
- A Vercel account (for deployment)

### Local Setup

1. **Clone or create the project directory**

```bash
cd "c:\Users\Divya Gandhi\OneDrive\Desktop\watsapp api"
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file from example**

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
```

4. **Add your WhatsApp credentials to .env**

```
WHATSAPP_TOKEN=your_whatsapp_business_account_access_token
PHONE_NUMBER_ID=your_phone_number_id  
VERIFY_TOKEN=your_unique_verify_token_123
PORT=3000
NODE_ENV=development
```

5. **Start the server**

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔌 Meta Developer Setup

### Step 1: Create Meta Developer App

1. Go to [Meta Developer Console](https://developers.facebook.com/)
2. Create a new app → Choose "Business" type
3. Add "WhatsApp" product to your app
4. Complete the app setup

### Step 2: Create WhatsApp Business Account

1. Go to WhatsApp Business Dashboard
2. Create new Business Account
3. Add your business phone number (must be verified)

### Step 3: Generate Access Token

1. In app dashboard → Settings → Basic
2. Generate an access token (Business Account scope)
3. Note: Token expires after 60 days, refresh periodically

### Step 4: Get Phone Number ID

1. Go to WhatsApp API section
2. Select your phone number
3. Copy the Phone Number ID (starts with numbers only)

### Step 5: Set Webhook URL (Important!)

1. In WhatsApp → Configuration
2. Set Webhook URL to your server: `https://yourdomain.com/webhook`
3. Set Verify Token: Use your custom secure token
4. Subscribe to: `messages`, `message_templates_status_update`

## 🌐 Webhook Configuration

Your webhook endpoint (`/webhook`) will receive POST requests from WhatsApp with structure:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "account_id",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "messages": [
              {
                "from": "919876543210",
                "id": "wamid.xxx",
                "text": {
                  "body": "User's message"
                },
                "timestamp": "1234567890",
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## 📡 API Endpoints

### GET /webhook
**Webhook Verification Endpoint**

Used by WhatsApp for handshake verification. WhatsApp sends:
```
GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
```

Server responds with the challenge value if token matches.

### POST /webhook
**Incoming Messages Endpoint**

Receives incoming messages from WhatsApp. Always responds with `200 OK` immediately.

**Example Response:**
```json
{
  "status": "received"
}
```

### GET /health
**Health Check Endpoint**

Returns server health status and metrics.

**Example Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-05-25T10:30:00.000Z",
  "activeSessions": 12,
  "uptime": 3600,
  "environment": "production"
}
```

### GET /stats
**Statistics Endpoint**

Returns current chatbot statistics and active sessions.

**Example Response:**
```json
{
  "totalActiveSessions": 12,
  "sessions": [
    {
      "phoneNumber": "919876543210",
      "state": "showing_welcome",
      "createdAt": "2025-05-25T10:00:00.000Z",
      "lastInteraction": "2025-05-25T10:30:00.000Z",
      "messages": 5
    }
  ],
  "timestamp": "2025-05-25T10:30:00.000Z"
}
```

### GET /
**Home Endpoint**

Returns API information and available endpoints.

## 🧪 Testing with cURL

### Test Webhook Verification

```bash
# Simulate WhatsApp verification request
curl -X GET "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=your_unique_verify_token_123&hub.challenge=test_challenge_123"
```

**Expected Response:**
```
test_challenge_123
```

### Test Health Check

```bash
curl -X GET "http://localhost:3000/health"
```

### Test Statistics

```bash
curl -X GET "http://localhost:3000/stats"
```

### Test Incoming Message

```bash
curl -X POST "http://localhost:3000/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "123456789",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "messages": [
                {
                  "from": "919876543210",
                  "id": "wamid.test123",
                  "text": {
                    "body": "hi"
                  },
                  "timestamp": "'$(date +%s)'",
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  }'
```

**Expected Response:**
```json
{
  "status": "received"
}
```

## ☁️ Vercel Deployment

### Prerequisite: Connect GitHub

Vercel works best with Git repositories:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sparkle-bots-whatsapp-api.git
git push -u origin main
```

### Deploy to Vercel

#### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts to authorize and deploy
```

#### Option 2: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Deploy!

### Set Environment Variables on Vercel

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add these variables:

| Key | Value |
|-----|-------|
| `WHATSAPP_TOKEN` | Your WhatsApp access token |
| `PHONE_NUMBER_ID` | Your phone number ID |
| `VERIFY_TOKEN` | Your unique verification token |
| `NODE_ENV` | `production` |

3. Redeploy after adding variables

### Update WhatsApp Webhook URL

After Vercel deployment:

1. Get your Vercel deployment URL (e.g., `https://sparkle-bots.vercel.app`)
2. Go to Meta Developer Dashboard → WhatsApp → Configuration
3. Update Webhook URL: `https://yourvercelapp.vercel.app/webhook`
4. Keep the same Verify Token
5. Save configuration

## 🛠️ Development

### Project Structure

```
sparkle-bots-whatsapp-api/
├── index.js                          # Main server entry point
├── package.json                      # Dependencies and scripts
├── .env.example                      # Environment variables template
├── vercel.json                       # Vercel configuration
├── README.md                         # This file
│
├── controllers/
│   └── webhookController.js          # Webhook request handlers
│
├── routes/
│   └── webhook.js                    # API route definitions
│
├── services/
│   ├── whatsappService.js            # WhatsApp API client
│   ├── chatbotService.js             # Bot logic and responses
│   └── logger.js                     # Logging utility
│
└── middleware/
    └── errorHandler.js               # Error handling middleware
```

### Adding Custom Responses

Edit `services/chatbotService.js`:

```javascript
// Add custom greetings
isGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'namaste']; // Add here
  return greetings.includes(message);
}

// Add menu options
getResponseForOption(option) {
  const responses = {
    '1': { text: 'Your response', state: 'state_name' },
    // Add more options
  };
  return responses[option] || null;
}
```

### Monitoring Sessions

Check active user sessions:

```bash
curl http://localhost:3000/stats | jq .
```

### Enable Debug Logging

Set environment variable:

```bash
NODE_ENV=development npm run dev
```

Logs will include detailed timestamp and service information.

## 🐛 Troubleshooting

### Webhook Not Receiving Messages

1. **Check Verify Token**
   ```bash
   # Test webhook verification
   curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
   ```

2. **Verify Webhook URL** is publicly accessible and matches Meta configuration

3. **Check Firewall/Network** - Ensure WhatsApp Cloud API IPs are allowed

4. **Review Logs** - Check error logs for detailed error messages

### Messages Not Sending

1. **Verify Access Token** hasn't expired (regenerate if needed)
2. **Check Phone Number ID** is correct in .env
3. **Validate User Phone Number** includes country code (e.g., 919876543210)
4. **Check Account Balance** - Ensure WhatsApp account has credits
5. **Review Logs** - Error logs show exact API response

### Vercel Deployment Issues

1. **Check Environment Variables** are set correctly in Vercel dashboard
2. **View Logs** - Use `vercel logs` command
3. **Redeploy** - Push new commit or click Redeploy in Vercel dashboard

### Session Issues

1. **Check Logs** for session creation/cleanup messages
2. **Send Debug Command** to see active sessions:
   ```bash
   curl http://localhost:3000/stats
   ```

## 📋 Checklist for Production

- [ ] WhatsApp Business Account verified and active
- [ ] Access token generated and valid
- [ ] Phone number ID configured
- [ ] Verify token set to strong random value
- [ ] Webhook URL updated to production domain
- [ ] Environment variables configured in Vercel
- [ ] Testing completed with real WhatsApp messages
- [ ] Error handling tested
- [ ] Session management working
- [ ] Logging and monitoring setup
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] Rate limiting configured (if required)

## 🔒 Security Best Practices

1. **Never commit .env file** - It contains sensitive credentials
2. **Use strong VERIFY_TOKEN** - Minimum 32 characters, random
3. **Validate incoming webhooks** - Check signature if implemented
4. **Rotate access tokens regularly** - Every 60 days minimum
5. **Use environment variables** - Never hardcode secrets
6. **Enable HTTPS** - Always use for webhook (Vercel does automatically)
7. **Implement rate limiting** - To prevent abuse
8. **Monitor logs** - Check for suspicious activity

## 📚 Additional Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-input-output/)

## 📝 License

MIT License - Feel free to use this in your projects!

## 👨‍💼 Support

For issues and questions:

1. Check the troubleshooting section
2. Review error logs with timestamp and service information
3. Verify all environment variables are set
4. Test endpoints with provided cURL examples

## 🎯 Roadmap

Future enhancements:
- [ ] Multi-language support
- [ ] Database integration for scalability
- [ ] Advanced NLP/AI responses
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Scheduled messages
- [ ] Media support (images, documents)
- [ ] Interactive buttons and lists

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your needs!

---

**Built with ❤️ by Sparkle Bots**

v1.0.0 | May 2025 | Production Ready
