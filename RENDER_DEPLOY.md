# Deploying to Render

## Prerequisites
1. Create a Render account at https://render.com
2. Create a GitHub repository and push your code
3. Have your API credentials ready:
   - SendGrid API Key
   - Twilio Account SID
   - Twilio Auth Token

## Deployment Steps

### 1. Connect Your Repository
1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository

### 2. Configure Your Web Service
1. Fill in the following details:
   - **Name**: lavimac-royal-hotel
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select paid plan for production)

### 3. Set Environment Variables
Add the following environment variables in Render dashboard:
```
NODE_ENV=production
PORT=3001
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for the initial deployment to complete
3. Your app will be available at: https://lavimac-royal-hotel.onrender.com

### 5. Custom Domain (Optional)
1. Go to your web service settings
2. Click on "Custom Domain"
3. Add your domain and follow the DNS configuration instructions

## Monitoring and Logs
- View logs in the Render dashboard
- Monitor application performance
- Set up alerts for errors or downtime

## Troubleshooting
1. If build fails:
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Ensure build command is correct

2. If runtime errors occur:
   - Check runtime logs
   - Verify environment variables
   - Check if all API services (SendGrid, Twilio) are working

3. If static files aren't serving:
   - Verify the dist directory is being created
   - Check if the path in server.js is correct

## Auto-Deploy
By default, Render will automatically deploy when you push to:
- main branch
- master branch

You can configure auto-deploy settings in your web service settings.
