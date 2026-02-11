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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for root if needed (though express.static handles index.html by default)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve other HTML files directly if requested without extension (optional but good for clean URLs)
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        res.sendFile(path.join(__dirname, 'public', req.path));
    } else {
        next();
    }
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
