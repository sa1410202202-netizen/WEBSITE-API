# 🚀 Deployment Guide

Complete deployment instructions for various hosting platforms.

## Vercel (Recommended - Easiest)

### Prerequisites
- Vercel Account
- GitHub repository

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sparkle-bots.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com/new
- Import your GitHub repository
- Select Node.js runtime

3. **Set Environment Variables**
   
In Vercel Dashboard → Project Settings → Environment Variables:

```
WHATSAPP_TOKEN = your_token_here
PHONE_NUMBER_ID = your_phone_id_here
VERIFY_TOKEN = your_verify_token_here
NODE_ENV = production
```

4. **Deploy**
- Click "Deploy"
- Wait for deployment to complete
- Get your URL (e.g., https://sparkle-bots.vercel.app)

5. **Update WhatsApp Webhook**
- Go to Meta Developer Console
- Set Webhook URL to: `https://sparkle-bots.vercel.app/webhook`
- Set Verify Token to: `your_verify_token_here`

### Monitoring Vercel Deployment
```bash
# View deployment logs
vercel logs

# Rollback to previous deployment
vercel rollback

# Check deployment status
vercel status
```

---

## Railway.app

### Steps

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository

3. **Add Environment Variables**
   
   In Railway Console:
   ```
   WHATSAPP_TOKEN=your_token
   PHONE_NUMBER_ID=your_id
   VERIFY_TOKEN=your_token
   NODE_ENV=production
   PORT=3000
   ```

4. **Configure Package.json**
   
   Already configured ✓

5. **Deploy**
   - Railway automatically deploys on push
   - Get URL from Railway project dashboard
   - Verify deployment with health endpoint

### Testing Railway Deployment
```bash
curl https://your-railway-app.up.railway.app/health
```

---

## Railway.app (Docker Alternative)

### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

### Build and Deploy
```bash
docker build -t sparkle-bots .
docker run -p 3000:3000 \
  -e WHATSAPP_TOKEN=your_token \
  -e PHONE_NUMBER_ID=your_id \
  -e VERIFY_TOKEN=your_token \
  sparkle-bots
```

---

## Heroku (Legacy Platform)

### Prerequisites
- Heroku CLI installed
- Heroku account

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create sparkle-bots-api
```

3. **Set Environment Variables**
```bash
heroku config:set WHATSAPP_TOKEN=your_token
heroku config:set PHONE_NUMBER_ID=your_id
heroku config:set VERIFY_TOKEN=your_token
heroku config:set NODE_ENV=production
```

4. **Add Procfile**
Create file named `Procfile`:
```
web: node index.js
```

5. **Deploy**
```bash
git push heroku main
```

6. **View Logs**
```bash
heroku logs --tail
```

---

## AWS Lambda + API Gateway

### Prerequisites
- AWS Account
- AWS CLI configured

### Steps

1. **Install SAM CLI**
```bash
pip install aws-sam-cli
```

2. **Create template.yaml**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    MemorySize: 512

Resources:
  WhatsAppFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: index.app
      Runtime: nodejs18.x
      Environment:
        Variables:
          WHATSAPP_TOKEN: !Ref WhatsAppToken
          PHONE_NUMBER_ID: !Ref PhoneNumberId
          VERIFY_TOKEN: !Ref VerifyToken
      Events:
        WebhookAPI:
          Type: Api
          Properties:
            Path: /webhook
            Method: ANY

Parameters:
  WhatsAppToken:
    Type: String
  PhoneNumberId:
    Type: String
  VerifyToken:
    Type: String
```

3. **Deploy**
```bash
sam build
sam deploy --guided
```

4. **Get API Endpoint**
```bash
aws cloudformation describe-stacks --stack-name sam-app --query 'Stacks[0].Outputs'
```

---

## Google Cloud Run

### Prerequisites
- Google Cloud Account
- Google Cloud CLI installed

### Steps

1. **Create Dockerfile** (see Docker section above)

2. **Build and Push Image**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/sparkle-bots
```

3. **Deploy to Cloud Run**
```bash
gcloud run deploy sparkle-bots \
  --image gcr.io/PROJECT_ID/sparkle-bots \
  --platform managed \
  --region us-central1 \
  --set-env-vars WHATSAPP_TOKEN=your_token,PHONE_NUMBER_ID=your_id,VERIFY_TOKEN=your_token
```

4. **Get Service URL**
```bash
gcloud run services list
```

---

## Azure App Service

### Prerequisites
- Azure Account
- Azure CLI installed

### Steps

1. **Create Resource Group**
```bash
az group create --name sparkle-bots-rg --location eastus
```

2. **Create App Service Plan**
```bash
az appservice plan create \
  --name sparkle-bots-plan \
  --resource-group sparkle-bots-rg \
  --sku B1 --is-linux
```

3. **Create App**
```bash
az webapp create \
  --resource-group sparkle-bots-rg \
  --plan sparkle-bots-plan \
  --name sparkle-bots-app \
  --runtime "NODE|18"
```

4. **Configure Environment Variables**
```bash
az webapp config appsettings set \
  --resource-group sparkle-bots-rg \
  --name sparkle-bots-app \
  --settings WHATSAPP_TOKEN=your_token PHONE_NUMBER_ID=your_id VERIFY_TOKEN=your_token
```

5. **Deploy from Git**
```bash
az webapp deployment source config \
  --resource-group sparkle-bots-rg \
  --name sparkle-bots-app \
  --repo-url https://github.com/USERNAME/sparkle-bots \
  --branch main
```

---

## DigitalOcean App Platform

### Prerequisites
- DigitalOcean Account

### Steps

1. **Push to GitHub** (see Vercel section)

2. **Create New App**
   - Go to DigitalOcean Dashboard
   - Click "Apps"
   - Click "Create App"
   - Connect GitHub repository

3. **Configure Build**
   - Set build command: `npm install`
   - Set run command: `npm start`

4. **Add Environment Variables**
   - Click "Edit" on environment
   - Add variables: WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN

5. **Deploy**
   - Click "Deploy"
   - DigitalOcean will build and deploy automatically

---

## Local VPS Deployment (Ubuntu/Linux)

### Prerequisites
- VPS with Ubuntu 20.04+
- SSH access
- Domain name (optional but recommended)

### Steps

1. **Connect to VPS**
```bash
ssh root@your_vps_ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2 (Process Manager)**
```bash
npm install -g pm2
```

4. **Clone Repository**
```bash
git clone https://github.com/USERNAME/sparkle-bots.git
cd sparkle-bots
```

5. **Install Dependencies**
```bash
npm install --production
```

6. **Create .env**
```bash
cat > .env << EOF
WHATSAPP_TOKEN=your_token
PHONE_NUMBER_ID=your_id
VERIFY_TOKEN=your_token
NODE_ENV=production
PORT=3000
EOF
```

7. **Start with PM2**
```bash
pm2 start index.js --name "sparkle-bots"
pm2 save
pm2 startup
```

8. **Setup Nginx Reverse Proxy**
```bash
sudo apt-get install -y nginx
```

Create `/etc/nginx/sites-available/sparkle-bots`:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/sparkle-bots /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

10. **Monitor**
```bash
pm2 status
pm2 logs sparkle-bots
```

---

## Performance Monitoring

### Vercel Analytics (Recommended for Vercel)
```bash
npm install @vercel/analytics
```

### New Relic Integration
```bash
npm install newrelic
```

Add to top of index.js:
```javascript
require('newrelic');
```

### Datadog Integration
```bash
npm install dd-trace
```

---

## Environment Variable Best Practices

### Never in Code
❌ WRONG:
```javascript
const token = "ghp_xxxxxxxxxxxxxxxxxxxx";
```

### Use Environment Variables
✅ CORRECT:
```javascript
const token = process.env.WHATSAPP_TOKEN;
```

### In .env
✅ CORRECT:
```
WHATSAPP_TOKEN=your_token_here
```

### In Deployment Platform
✅ BEST:
Set in Vercel/Railway/etc dashboard, never in code

---

## Testing After Deployment

### Health Check
```bash
curl https://your-deployed-app.com/health
```

### Stats Endpoint
```bash
curl https://your-deployed-app.com/stats
```

### Webhook Verification
```bash
curl "https://your-deployed-app.com/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
```

---

## Troubleshooting Deployments

### Blank Page or 500 Error
1. Check environment variables are set
2. View deployment logs
3. Verify Node.js version compatibility

### Webhook Not Receiving
1. Check webhook URL in Meta dashboard
2. Test with health endpoint first
3. Verify firewall allows HTTPS

### Memory Issues
1. Increase memory allocation
2. Check for memory leaks in logs
3. Use Node.js profiling tools

---

## Scaling Considerations

### Current Architecture
- Single process (good for low traffic)
- In-memory session storage (lost on restart)
- OK for <1000 concurrent users

### For Higher Scale
1. **Add Redis** for session storage
2. **Use Database** (MongoDB/PostgreSQL)
3. **Load Balancing** for multiple instances
4. **Caching** with Redis/Memcached
5. **Message Queue** (Redis/RabbitMQ) for async processing

---

## Cost Comparison

| Platform | Free Tier | Startup Cost | Good For |
|----------|-----------|--------------|----------|
| Vercel | 100GB/month | $0 | Small to Medium |
| Railway | $5/month | $5 | Medium |
| Heroku | None | $7-50 | Medium to Large |
| AWS Lambda | 1M requests | $0.20/M | Variable load |
| DigitalOcean | None | $4/month | Beginners |
| Google Cloud | $300 credit | $0 | Learning |

---

## Support

Choose based on your needs:
- **Simplicity**: Vercel or DigitalOcean
- **Free Trial**: Google Cloud or AWS
- **Control**: VPS deployment
- **Scalability**: AWS Lambda or Google Cloud Run

---

Last Updated: May 2025
