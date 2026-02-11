// Backend server to handle Telegram API calls securely
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from current directory
// Specifically look for index.html as the default file
app.use(express.static('.', {
    index: 'index.html'
}));

// Fallback route to serve index.html for the root path if static middleware misses it
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get credentials from environment variables
const TELE_TOKEN = process.env.TELE_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Endpoint to send Telegram messages
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const url = `https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.json({ success: true, message: 'Message sent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send message', details: data });
        }
    } catch (error) {
        console.error('Error sending telegram message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the app for Vercel
module.exports = app;

// Only start the server if running directly (locally)
// In production (Vercel), static files are handled by the platform before hitting this function
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
