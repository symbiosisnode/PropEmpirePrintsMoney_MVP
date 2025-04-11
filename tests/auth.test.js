const jwt = require('jsonwebtoken');
const authMiddleware = require('../server/authMiddleware');
const { login } = require('../server/auth');
const request = require('supertest');
const app = require('../server/server');

// Mock environment variables
process.env.JWT_SECRET = 'test_secret_key';

describe('Authentication Tests', () => {
  // Mock request and response objects
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  test('should return 403 if no token is provided', () => {
    authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 403 if token is invalid', () => {
    mockReq.headers['authorization'] = 'Bearer invalid_token';
    authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should call next() if token is valid', () => {
    // Create a valid token
    const token = jwt.sign({ username: 'testuser' }, process.env.JWT_SECRET);
    mockReq.headers['authorization'] = `Bearer ${token}`;
    
    authMiddleware(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
  });
});

describe('Authentication Routes', () => {
  test('should return 400 if username is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test123' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username is required');
  });

  test('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  test('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrong' });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('should return 200 and token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('role');
    expect(response.body.user).toHaveProperty('displayName');
  });

  test('should return valid JWT token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    const token = response.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('userId');
    expect(decoded).toHaveProperty('role');
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('exp');
  });

  test('should return correct user role and display name', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'investor', password: 'investor123' });
    expect(response.body.user.role).toBe('Investor');
    expect(response.body.user.displayName).toBe('John Investor');
  });
}); 