const express = require('express');
const router = express.Router();
const authenticateToken = require('../authMiddleware');

// GET /api/v1/properties
router.get('/', authenticateToken, (req, res) => {
  // In a real app, this would fetch from a database
  // For demo purposes, we'll return a mock response
  res.json({
    properties: [
      {
        id: 1,
        name: 'Sample Property',
        address: '123 Main St',
        price: 500000,
        status: 'Available'
      }
    ]
  });
});

// POST /api/v1/properties
router.post('/', authenticateToken, (req, res) => {
  const { name, address, price } = req.body;
  
  if (!name || !address || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // In a real app, this would save to a database
  res.status(201).json({
    id: Date.now(),
    name,
    address,
    price,
    status: 'Available'
  });
});

// DELETE /api/v1/properties/:id
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // In a real app, this would delete from a database
  res.status(200).json({ message: `Property ${id} deleted successfully` });
});

module.exports = router; 