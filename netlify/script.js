// Toast notification system
const Toast = {
  container: null,
  
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  
  show(message, type = 'info') {
    if (!this.container) this.init();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    this.container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        this.container.removeChild(toast);
      }, 300);
    }, 3000);
  },
  
  success(message) {
    this.show(message, 'success');
  },
  
  error(message) {
    this.show(message, 'error');
  }
};

// Check authentication on page load
function checkAuth() {
  const token = localStorage.getItem('sessionToken');
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  const userRole = localStorage.getItem('userRole');
  const userDisplayName = localStorage.getItem('userDisplayName');
  
  if (!token || !sessionExpiry || !userRole || !userDisplayName) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return;
  }
  
  // Check if session has expired
  if (Date.now() > parseInt(sessionExpiry)) {
    // Clear session data
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDisplayName');
    
    // Redirect to login
    window.location.href = 'login.html';
    return;
  }
  
  // Update user info in the UI
  updateUserInfo(userDisplayName, userRole);
  
  // Load properties
  loadProperties();
}

// Update user info in the UI
function updateUserInfo(displayName, role) {
  // Update avatar
  const avatar = document.querySelector('.user-avatar');
  if (avatar) {
    avatar.textContent = displayName.charAt(0);
  }
  
  // Update user name
  const userName = document.querySelector('.user-name');
  if (userName) {
    userName.textContent = displayName;
  }
  
  // Update user role
  const userRole = document.querySelector('.user-role');
  if (userRole) {
    userRole.textContent = role;
  }
  
  // Update welcome message
  const welcomeMessage = document.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome, ${displayName}!`;
  }
}

// Handle logout
function handleLogout() {
  // Clear session data
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('sessionExpiry');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userDisplayName');
  
  // Show success message
  Toast.success('Logged out successfully');
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// API Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_VERSION = process.env.API_VERSION || 'v1';
const API_ENDPOINT = `${API_BASE_URL}/api/${API_VERSION}`;

// Update fetch calls to use API_ENDPOINT
async function loadProperties() {
  try {
    // For demo purposes, we'll use localStorage
    // In production, this would be:
    // const response = await fetch(`${API_ENDPOINT}/properties`, {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // });
    // const data = await response.json();
    // return data.properties;
    
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    return properties;
  } catch (error) {
    console.error('Error loading properties:', error);
    return [];
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = {
    name: document.getElementById('propertyName').value,
    address: document.getElementById('propertyAddress').value,
    type: document.getElementById('propertyType').value,
    status: document.getElementById('propertyStatus').value,
    price: parseFloat(document.getElementById('propertyPrice').value),
    bedrooms: parseInt(document.getElementById('propertyBedrooms').value),
    bathrooms: parseInt(document.getElementById('propertyBathrooms').value),
    squareFeet: parseInt(document.getElementById('propertySquareFeet').value),
    yearBuilt: parseInt(document.getElementById('propertyYearBuilt').value),
    description: document.getElementById('propertyDescription').value
  };

  try {
    // For demo purposes, we'll use localStorage
    // In production, this would be:
    // const response = await fetch(`${API_ENDPOINT}/properties`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(formData)
    // });
    
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const newProperty = {
      ...formData,
      id: Date.now().toString()
    };
    properties.push(newProperty);
    localStorage.setItem('properties', JSON.stringify(properties));
    
    Toast.success('Property added successfully!');
    document.getElementById('propertyForm').reset();
    loadProperties();
  } catch (error) {
    console.error('Error adding property:', error);
    Toast.error('Failed to add property. Please try again.');
  }
}

async function deleteProperty(id) {
  try {
    // For demo purposes, we'll use localStorage
    // In production, this would be:
    // const response = await fetch(`${API_ENDPOINT}/properties/${id}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // });
    
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const updatedProperties = properties.filter(property => property.id !== id);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    Toast.success('Property deleted successfully!');
    loadProperties();
  } catch (error) {
    console.error('Error deleting property:', error);
    Toast.error('Failed to delete property. Please try again.');
  }
}

// Setup search filter
function setupSearchFilter() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const propertyCards = document.querySelectorAll('.property-card');
    
    let hasResults = false;
    
    propertyCards.forEach(card => {
      const propertyName = card.querySelector('h3').textContent.toLowerCase();
      const propertyLocation = card.querySelector('.property-details p:first-child').textContent.toLowerCase();
      
      if (propertyName.includes(searchTerm) || propertyLocation.includes(searchTerm)) {
        card.classList.remove('hidden');
        hasResults = true;
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Show no results message if needed
    const noResults = document.querySelector('.no-results');
    if (!hasResults && searchTerm) {
      if (!noResults) {
        const noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results';
        noResultsElement.textContent = 'No properties found matching your search.';
        document.getElementById('properties-list').appendChild(noResultsElement);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });
}

// Check session timeout periodically
function checkSessionTimeout() {
  setInterval(() => {
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
      // Session expired, log out
      handleLogout();
    }
  }, 60000); // Check every minute
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Initialize toast system
  Toast.init();
  
  // Check authentication
  checkAuth();
  
  // Setup form submission
  const propertyForm = document.getElementById('property-form');
  if (propertyForm) {
    propertyForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Setup logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
  
  // Check session timeout
  checkSessionTimeout();
}); 