# Deploying to IONOS

## Prerequisites
1. IONOS hosting account with Node.js support
2. Domain name configured with IONOS
3. SSH access enabled
4. SFTP credentials

## Environment Variables
Create a `.env` file on your IONOS server with:
```env
PORT=3001
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_API_URL=https://your-domain.com/api
```

## Deployment Steps

### 1. Prepare Your Application
```bash
# Build the application
npm run build

# Ensure all dependencies are in package.json
npm install
```

### 2. Upload Files to IONOS
Using SFTP, upload the following files/folders:
- `dist/` (contains the built React app)
- `server/` (contains the Node.js server)
- `package.json`
- `package-lock.json`
- `.env` (create this on the server with your production values)

### 3. Connect to Your IONOS Server via SSH
```bash
ssh username@your-ionos-server
```

### 4. Install Dependencies
```bash
cd ~/your-app-directory
npm install --production
```

### 5. Start the Server
```bash
# Start the server
npm start
```

### 6. Configure IONOS Domain Settings
1. Log in to your IONOS Control Panel
2. Go to Domains & SSL
3. Select your domain
4. Point your domain to the Node.js application port
5. Enable SSL certificate

## Troubleshooting
1. If the server doesn't start, check the logs:
   ```bash
   tail -f ~/logs/nodejs/error.log
   ```

2. If environment variables aren't loading:
   - Verify `.env` file exists in the root directory
   - Check file permissions: `chmod 600 .env`

3. If static files aren't serving:
   - Check if the `dist` directory is in the correct location
   - Verify the path in `server.js`

## Important Notes
- Keep your `.env` file secure and never commit it to version control
- Use `npm run build` before every deployment to ensure latest changes
- Consider using PM2 for process management:
  ```bash
  npm install -g pm2
  pm2 start server/server.js
  ```
