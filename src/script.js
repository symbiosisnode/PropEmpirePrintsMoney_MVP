// Toast notification system
const Toast = {
  show(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Check authentication on page load
function checkAuth() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userDisplayName = localStorage.getItem('userDisplayName');
  const expiry = localStorage.getItem('tokenExpiry');

  if (!token || !userRole || !userDisplayName || !expiry) {
    window.location.href = '/login.html';
    return;
  }

  if (Date.now() > parseInt(expiry)) {
    localStorage.clear();
    window.location.href = '/login.html';
    return;
  }

  updateUserInfo();
}

// Update UI with user info
function updateUserInfo() {
  const userDisplayName = localStorage.getItem('userDisplayName');
  const userRole = localStorage.getItem('userRole');
  
  document.getElementById('userName').textContent = userDisplayName;
  document.getElementById('userRole').textContent = userRole;
  document.getElementById('welcomeMessage').textContent = `Welcome, ${userDisplayName}!`;
  
  // Update avatar with initials
  const initials = userDisplayName.split(' ').map(n => n[0]).join('');
  document.getElementById('userAvatar').textContent = initials;
}

// Handle logout
function handleLogout() {
  localStorage.clear();
  Toast.show('Logged out successfully');
  setTimeout(() => window.location.href = '/login.html', 1000);
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const property = Object.fromEntries(formData.entries());

  // Validate form data
  if (!property.name || !property.address || !property.price) {
    Toast.show('Please fill in all required fields', 'error');
    return;
  }

  // Simulate API request
  setTimeout(() => {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    properties.push({ ...property, id: Date.now() });
    localStorage.setItem('properties', JSON.stringify(properties));
    Toast.show('Property added successfully');
    event.target.reset();
    loadProperties();
  }, 1000);
}

// Delete property
function deleteProperty(id) {
  if (!confirm('Are you sure you want to delete this property?')) return;

  // Simulate API request
  setTimeout(() => {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const updatedProperties = properties.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    Toast.show('Property deleted successfully');
    loadProperties();
  }, 1000);
}

// Load properties
function loadProperties() {
  const properties = JSON.parse(localStorage.getItem('properties') || '[]');
  const container = document.getElementById('propertiesContainer');
  container.innerHTML = '';

  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
      <h3>${property.name}</h3>
      <p>${property.address}</p>
      <p>$${property.price}</p>
      <button onclick="deleteProperty(${property.id})">Delete</button>
    `;
    container.appendChild(card);
  });
}

// Setup search filter
function setupSearchFilter() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const properties = document.querySelectorAll('.property-card');
    
    properties.forEach(property => {
      const text = property.textContent.toLowerCase();
      property.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadProperties();
  setupSearchFilter();
  
  // Setup session timeout
  setInterval(() => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry && Date.now() > parseInt(expiry)) {
      handleLogout();
    }
  }, 60000); // Check every minute
}); 