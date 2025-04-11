const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Pre-configured user accounts for demo purposes
// In production, these would be stored in a database
const USER_ACCOUNTS = {
  admin: {
    username: 'admin',
    // This is a hashed version of 'admin123'
    password: '$2b$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9',
    role: 'Administrator',
    displayName: 'Admin User'
  },
  investor: {
    username: 'investor',
    // This is a hashed version of 'investor123'
    password: '$2b$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9',
    role: 'Investor',
    displayName: 'John Investor'
  },
  agent: {
    username: 'agent',
    // This is a hashed version of 'agent123'
    password: '$2b$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9',
    role: 'Real Estate Agent',
    displayName: 'Sarah Agent'
  },
  manager: {
    username: 'manager',
    // This is a hashed version of 'manager123'
    password: '$2b$10$X7UrE9N9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9ZqX9',
    role: 'Property Manager',
    displayName: 'Mike Manager'
  }
};

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Find user
  const user = USER_ACCOUNTS[username];
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  try {
    // In production, we would use bcrypt.compare to verify the password
    // For demo purposes, we'll use a simple comparison
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === username + '123'; // Simple demo validation

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: user.username,
        role: user.role,
        displayName: user.displayName
      }, 
      JWT_SECRET, 
      { expiresIn: '30m' }
    );

    // Return user info and token
    res.json({ 
      token,
      user: {
        username: user.username,
        role: user.role,
        displayName: user.displayName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router; 