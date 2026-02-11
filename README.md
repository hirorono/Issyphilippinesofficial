# Team Manila Voting Website

A secure voting website with Telegram integration for notifications.

## 🔒 Security Setup

This project uses environment variables to keep sensitive credentials secure.

### Setup Instructions

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - The `.env` file has already been created with your credentials
   - **IMPORTANT**: Never commit the `.env` file to Git (it's already in `.gitignore`)

4. **Run the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the Website**
   - Open your browser and go to: `http://localhost:3000`

## 📁 Project Structure

```
MNL2026VOTES/
├── .env                 # Environment variables (NEVER commit this!)
├── .gitignore          # Prevents sensitive files from being committed
├── server.js           # Backend server (handles Telegram API securely)
├── package.json        # Node.js dependencies
├── Index.html          # Main HTML file
├── Style.css           # Styles
├── Script.js           # Frontend JavaScript (no credentials!)
└── assets/             # Images
```

## 🔐 Environment Variables

The `.env` file contains:
- `TELE_TOKEN` - Your Telegram bot token
- `CHAT_ID` - Your Telegram chat ID

## 🚀 How It Works

1. **Frontend** (Script.js) sends requests to your backend API
2. **Backend** (server.js) reads credentials from `.env` file
3. **Backend** makes secure API calls to Telegram
4. Credentials are **never exposed** to the browser

## ⚠️ Important Security Notes

- ✅ Credentials are stored in `.env` (server-side only)
- ✅ `.env` is in `.gitignore` (won't be committed to Git)
- ✅ Frontend code has no hardcoded credentials
- ✅ Backend API handles all sensitive operations

## 📝 API Endpoint

**POST** `/api/send-telegram`
```json
{
  "message": "Your message here"
}
```

## 🌐 Deployment

When deploying to production (Vercel, Heroku, etc.):
1. Add environment variables in your hosting platform's settings
2. Never commit the `.env` file
3. Use the platform's environment variable configuration