# 📖 Quick Reference Guide

Common commands, API examples, and troubleshooting quick fixes.

## 🚀 Quick Start Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

### Testing
```bash
# Health check
curl http://localhost:3000/health

# Get statistics
curl http://localhost:3000/stats

# Test webhook verification
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test"
```

---

## 🔌 API Quick Reference

### Webhook Verification (GET)
```bash
# What WhatsApp sends during verification
GET /webhook?hub.mode=subscribe&hub.verify_token=TOKEN&hub.challenge=CHALLENGE

# Server responds with the challenge value if token matches
```

### Incoming Message (POST)
```bash
# Webhook automatically receives messages from WhatsApp
# No action needed - bot responds automatically
```

### Health Status
```bash
GET /health

# Response
{
  "status": "ok",
  "timestamp": "2025-05-25T10:30:00.000Z",
  "activeSessions": 5,
  "uptime": 3600,
  "environment": "production"
}
```

### Bot Statistics
```bash
GET /stats

# Response
{
  "totalActiveSessions": 2,
  "sessions": [
    {
      "phoneNumber": "919876543210",
      "state": "showing_welcome",
      "createdAt": "2025-05-25T10:00:00.000Z",
      "lastInteraction": "2025-05-25T10:30:00.000Z",
      "messages": 3
    }
  ],
  "timestamp": "2025-05-25T10:30:00.000Z"
}
```

---

## 🔑 Environment Variables Setup

### Create .env File
```bash
# Copy example
cp .env.example .env

# Edit with your credentials
```

### .env Content
```
WHATSAPP_TOKEN=your_whatsapp_business_account_access_token
PHONE_NUMBER_ID=your_phone_number_id
VERIFY_TOKEN=your_unique_secure_token
PORT=3000
NODE_ENV=development
```

---

## 🤖 Bot Flow Reference

### User Message → Bot Response

| User Input | Bot Response | Next State |
|-----------|--------------|-----------|
| hi, hello, hey | Welcome menu | showing_welcome |
| 1 | Course inquiry prompt | waiting_course_info |
| 2 | Fees info message | waiting_acknowledgement |
| 3 | Demo time prompt | waiting_demo_time |
| 4 | Counselor message | waiting_acknowledgement |
| 5 | Placement message | waiting_acknowledgement |
| Other | Invalid input error | Same state |

---

## 📁 File Structure Quick Map

```
index.js                     ← Start here - Main server
├── controllers/
│   └── webhookController.js ← Handle requests
├── routes/
│   └── webhook.js           ← Define routes
├── services/
│   ├── whatsappService.js   ← WhatsApp API calls
│   ├── chatbotService.js    ← Bot logic & responses
│   └── logger.js            ← Logging utility
└── middleware/
    └── errorHandler.js      ← Error handling
```

---

## 🐛 Debugging Tips

### Enable Verbose Logging
```bash
NODE_ENV=development npm run dev
```

### Check Active Sessions
```bash
curl http://localhost:3000/stats | jq .
```

### Monitor in Real-time
```bash
# For nodemon
npm run dev

# View logs continuously
tail -f logs/app.log
```

### Test Specific Endpoint
```bash
# Health check
curl -v http://localhost:3000/health

# With headers
curl -v -H "Content-Type: application/json" http://localhost:3000/health
```

---

## ✅ Production Checklist

### Before Going Live

- [ ] .env file created with real credentials
- [ ] .gitignore includes .env
- [ ] Environment variables set in deployment platform
- [ ] NODE_ENV=production
- [ ] Webhook URL updated in Meta dashboard
- [ ] Verify token matches between app and Meta
- [ ] Phone number ID correct
- [ ] Access token generated and not expired
- [ ] HTTPS enabled (Vercel/Railway do automatically)
- [ ] Error logging working
- [ ] Health endpoint responsive

### Monitoring Production

- [ ] Check health endpoint daily
- [ ] Review logs for errors
- [ ] Monitor active sessions
- [ ] Track WhatsApp account balance
- [ ] Refresh access token before expiry
- [ ] Backup session data if using database

---

## 🔐 Security Checklist

- [ ] Never commit .env to Git
- [ ] Use strong VERIFY_TOKEN (32+ characters)
- [ ] Rotate access tokens every 60 days
- [ ] Use HTTPS only (never HTTP in production)
- [ ] Validate all incoming data
- [ ] Implement rate limiting (if needed)
- [ ] Log suspicious activity
- [ ] Keep Node.js updated
- [ ] Review dependencies for vulnerabilities

---

## 📞 Common Issues & Solutions

### Issue: Webhook not verifying

**Solution:**
```bash
# 1. Check VERIFY_TOKEN matches
# 2. Test directly:
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=YOUR_EXACT_TOKEN&hub.challenge=test123"

# 3. Should return: test123
```

### Issue: Messages not sending

**Solution:**
```bash
# 1. Check logs
curl http://localhost:3000/health

# 2. Verify .env variables
cat .env

# 3. Test with actual phone number format
# Include country code: 919876543210
```

### Issue: 500 Error

**Solution:**
```bash
# 1. Check NODE_ENV
echo $NODE_ENV

# 2. Check all environment variables set
env | grep WHATSAPP

# 3. Check server logs
npm run dev
```

### Issue: Sessions not persisting

**Note:** In-memory sessions reset on server restart. This is expected.
To persist sessions, add database integration later.

---

## 🚀 Deployment Quick Commands

### Vercel
```bash
# Install CLI
npm install -g vercel

# Deploy
vercel

# View logs
vercel logs

# Rollback
vercel rollback
```

### Railway
```bash
# App automatically deploys on git push
git push origin main
```

### Local VPS
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start index.js --name "sparkle-bots"

# View logs
pm2 logs sparkle-bots
```

---

## 🧪 Testing Workflows

### Basic Flow Test
1. Start server: `npm run dev`
2. Check health: `curl http://localhost:3000/health`
3. Send test message with cURL
4. Monitor logs for responses
5. Check stats: `curl http://localhost:3000/stats`

### Production Readiness Test
1. Build for production: `npm install --production`
2. Test .env file is properly loaded
3. Verify all credentials work
4. Test webhook verification
5. Simulate user conversation
6. Check error handling with invalid input

---

## 📊 Performance Monitoring

### Response Time
```bash
# Time a request
time curl http://localhost:3000/health
```

### Active Sessions
```bash
# Monitor sessions
watch -n 5 'curl http://localhost:3000/stats | jq .totalActiveSessions'
```

### Memory Usage
```bash
# Monitor process
ps aux | grep "node index"
```

---

## 🔄 Updating the App

### Pull Latest Changes
```bash
git pull origin main
npm install
npm start
```

### Deploy Updates
```bash
# For Vercel (automatic on git push)
git add .
git commit -m "Update: description"
git push origin main

# For local VPS
git pull origin main
pm2 restart sparkle-bots
```

---

## 📝 Code Modification Guide

### Add New Greeting
Edit `services/chatbotService.js`:
```javascript
isGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'namaste', 'hola'];
  return greetings.includes(message);
}
```

### Add New Menu Option
Edit `services/chatbotService.js`:
```javascript
getResponseForOption(option) {
  const responses = {
    '1': { text: '📚 Course info', state: 'waiting_course_info' },
    '6': { text: '🎓 New Option!', state: 'new_state' }, // Add here
  };
  return responses[option] || null;
}
```

### Add Custom Response
Edit `services/chatbotService.js`:
```javascript
processMessage(phoneNumber, messageText) {
  const trimmed = messageText.trim().toLowerCase();
  
  // Add custom response
  if (trimmed === 'custom keyword') {
    return {
      shouldReply: true,
      responseText: 'Your custom response',
      newState: 'custom_state',
      delayMs: 1000,
    };
  }
  
  // ... rest of logic
}
```

---

## 📞 Meta Developer Resources

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhook Reference](https://developers.facebook.com/docs/whatsapp/webhooks)
- [API Explorer](https://developers.facebook.com/tools/explorer)
- [Status Dashboard](https://status.fb.com)

---

## 💡 Pro Tips

### Simulate typing delay for UX
```javascript
// Already implemented! Messages automatically have delay
await whatsappService.sendMessageWithDelay(
  phoneNumber,
  message,
  2000 // 2 second delay
);
```

### Monitor session activity
```bash
# Check active users
curl http://localhost:3000/stats | jq '.sessions[] | {phone: .phoneNumber, state: .state}'
```

### Quick health check script
```bash
#!/bin/bash
while true; do
  curl -s http://localhost:3000/health | jq .status
  sleep 10
done
```

### Reset all sessions (dev only)
```bash
# In chatbotService.js, uncomment in endpoint:
// this.userSessions.clear();
```

---

## 🆘 Getting Help

1. **Check logs first** - Most issues are documented in logs
2. **Review .env** - Verify all variables are set
3. **Test endpoints** - Use cURL to test manually
4. **Check Meta status** - Ensure WhatsApp API is available
5. **Review README.md** - Full documentation available

---

**Last Updated:** May 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✓
