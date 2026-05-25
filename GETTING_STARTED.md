# 🚀 Getting Started - 5 Minute Setup Guide

**Everything is ready! Here's how to get running in 5 minutes.**

---

## ⏱️ Step 1: Install Dependencies (2 minutes)

Open PowerShell in your project folder and run:

```powershell
npm install
```

This installs all required packages:
- Express.js (web server)
- Axios (for API calls)
- dotenv (environment variables)
- Nodemon (auto-reload in development)

**Expected output:**
```
added 67 packages in 2.5s
```

---

## 🔑 Step 2: Create .env File (1 minute)

Copy the example to create your .env file:

```powershell
Copy-Item .env.example .env
```

Edit the `.env` file with your credentials:

```
WHATSAPP_TOKEN=your_token_here
PHONE_NUMBER_ID=your_phone_id_here
VERIFY_TOKEN=your_unique_secure_token_here
PORT=3000
NODE_ENV=development
```

**Where to get these values:**
- **WHATSAPP_TOKEN** - Meta Developer Dashboard → App Settings
- **PHONE_NUMBER_ID** - Meta Dashboard → WhatsApp → Phone Numbers
- **VERIFY_TOKEN** - Create your own (any secure string)

---

## 🏃 Step 3: Start the Server (1 minute)

```powershell
npm run dev
```

**Expected output:**
```
🔧 Initializing Sparkle Bots WhatsApp API Server...
✓ Middleware configured
✓ WhatsApp Service initialized
✓ Routes configured
✓ Error handling configured
🚀 Server started successfully
   port: 3000
   environment: development
📋 Available endpoints:
   health: http://localhost:3000/health
   stats: http://localhost:3000/stats
   webhook: http://localhost:3000/webhook
```

Server is running! 🎉

---

## ✅ Step 4: Test It Works (1 minute)

Open another PowerShell window and test the health endpoint:

```powershell
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-05-25T10:30:00.000Z",
  "activeSessions": 0,
  "uptime": 10,
  "environment": "development"
}
```

✅ **Server is working!**

---

## 🎯 Step 5: Test Webhook Verification (Final minute!)

Test webhook verification with your VERIFY_TOKEN:

```powershell
$token = "your_verify_token_from_.env"
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=$token&hub.challenge=test123"
```

**Expected response:**
```
test123
```

✅ **Webhook verification works!**

---

## 📋 Next: Deploy to Vercel

When ready to go live, follow these steps:

### 1. Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sparkle-bots.git
git push -u origin main
```

### 2. Deploy to Vercel

```powershell
npm install -g vercel
vercel
```

Follow the prompts to deploy!

### 3. Set Environment Variables

In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add: WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN

### 4. Update WhatsApp Webhook URL

Go to Meta Developer Dashboard:
- WhatsApp → Configuration
- Webhook URL: `https://your-vercel-app.vercel.app/webhook`
- Verify Token: (from your .env)

---

## 🤖 Test the Bot

Send a WhatsApp message to your number:
- Type: **"hi"**
- Bot responds with: Welcome menu

Send: **"1"**
- Bot responds with: Course inquiry prompt

---

## 📚 Documentation Quick Links

| Need | File |
|------|------|
| Setup help | README.md |
| Deployment options | DEPLOYMENT.md |
| Quick commands | QUICK_REFERENCE.md |
| API reference | README.md |
| System design | ARCHITECTURE.md |
| File details | FILE_INDEX.md |

---

## 🆘 Troubleshooting

### Server won't start
```powershell
# Check Node version
node --version

# Should be 18.x or higher
# If not, install Node.js 18+
```

### Can't install dependencies
```powershell
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

### Webhook not verifying
1. Check `.env` file has correct VERIFY_TOKEN
2. Check the token in your test matches
3. Verify server is running on port 3000

### Still stuck?

See **QUICK_REFERENCE.md** → Troubleshooting section

---

## ✨ What's Included

✅ Complete WhatsApp chatbot backend  
✅ Webhook verification  
✅ Message handling  
✅ Automated bot responses  
✅ Session management  
✅ Error handling  
✅ Logging system  
✅ Ready for Vercel deployment  
✅ Fully documented  
✅ Professional code  

---

## 🎉 You're Ready!

**Congratulations!** Your WhatsApp chatbot is set up and running.

**Next Steps:**
1. Test locally (messages with simulator or real phone)
2. Deploy to Vercel
3. Configure in Meta Developer Dashboard
4. Test with real WhatsApp messages
5. Customize bot responses as needed

---

## 📞 Common Commands

```powershell
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Test health endpoint
curl http://localhost:3000/health

# Check active sessions
curl http://localhost:3000/stats

# Stop server
Ctrl + C
```

---

## 🎓 Learning Resources

- **WhatsApp API Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **Vercel Docs**: https://vercel.com/docs
- **Express.js Guide**: https://expressjs.com/
- **Node.js Docs**: https://nodejs.org/docs/

---

## 💡 Pro Tips

1. **Use Postman** - Test API endpoints visually
2. **Check logs** - They tell you everything
3. **Start simple** - Test basics first
4. **Deploy often** - Early and frequently
5. **Monitor health** - Check /health regularly

---

## 🎯 Success Checklist

- [ ] npm install completed
- [ ] .env file created with credentials
- [ ] Server starts with npm run dev
- [ ] Health endpoint responds (http://localhost:3000/health)
- [ ] Webhook verification works
- [ ] Ready to deploy

**All checked? You're ready to go live!** 🚀

---

**Time to complete this guide:** ~5 minutes  
**Status:** ✅ You're all set!

Need more help? See README.md for comprehensive documentation.

---

**Happy coding!** 🎉

Sparkle Bots WhatsApp AI Assistant v1.0.0
