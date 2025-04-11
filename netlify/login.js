// API Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_VERSION = process.env.API_VERSION || 'v1';
const API_ENDPOINT = `${API_BASE_URL}/api/${API_VERSION}`;

// Pre-configured user accounts for demo purposes
const USER_ACCOUNTS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'Administrator',
    displayName: 'Admin User'
  },
  investor: {
    username: 'investor',
    password: 'investor123',
    role: 'Investor',
    displayName: 'John Investor'
  },
  agent: {
    username: 'agent',
    password: 'agent123',
    role: 'Real Estate Agent',
    displayName: 'Sarah Agent'
  },
  manager: {
    username: 'manager',
    password: 'manager123',
    role: 'Property Manager',
    displayName: 'Mike Manager'
  }
};

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
  const sessionToken = localStorage.getItem('sessionToken');
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  const userRole = localStorage.getItem('userRole');
  
  if (sessionToken && sessionExpiry) {
    // Check if session is still valid
    if (Date.now() < parseInt(sessionExpiry)) {
      // User is already logged in with valid session, redirect to dashboard
      window.location.href = 'index.html';
    } else {
      // Session expired, clear it
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('sessionExpiry');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userDisplayName');
    }
  }
  
  // Add enter key support for login
  document.getElementById('username').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('password').focus();
    }
  });
  
  document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('login-form').dispatchEvent(new Event('submit'));
    }
  });
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Show loading state
  const submitButton = this.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Logging in...';
  
  try {
    // For demo purposes, we'll use the USER_ACCOUNTS object
    // In production, this would be:
    // const response = await fetch(`${API_ENDPOINT}/auth/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ username, password })
    // });
    // const data = await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = USER_ACCOUNTS[username];
    if (user && user.password === password) {
      // Generate session token (in production, this would come from the API)
      const token = btoa(JSON.stringify({
        username,
        role: user.role,
        displayName: user.displayName,
        exp: Date.now() + SESSION_TIMEOUT
      }));
      
      // Store session data
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userDisplayName', user.displayName);
      
      // Redirect to dashboard
      window.location.href = '/';
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    document.getElementById('error-message').textContent = 'Invalid username or password';
    document.getElementById('error-message').style.display = 'block';
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

// Show error message
function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  
  // Shake animation for error feedback
  const loginContainer = document.querySelector('.login-container');
  loginContainer.classList.add('shake');
  setTimeout(() => {
    loginContainer.classList.remove('shake');
  }, 500);
}

// Hide error message
function hideError() {
  const errorMessage = document.getElementById('error-message');
  errorMessage.classList.remove('show');
} 