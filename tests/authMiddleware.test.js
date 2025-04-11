const jwt = require('jsonwebtoken');
const { verifyToken } = require('../server/authMiddleware');

describe('Authentication Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  test('should return 401 if no token provided', () => {
    verifyToken(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'No token provided'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 401 if token is invalid', () => {
    mockReq.headers.authorization = 'Bearer invalid-token';
    verifyToken(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid token'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should call next() if token is valid', () => {
    const token = jwt.sign(
      { userId: 'test-user', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    mockReq.headers.authorization = `Bearer ${token}`;
    verifyToken(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.userId).toBe('test-user');
    expect(mockReq.user.role).toBe('admin');
  });

  test('should return 401 if token is expired', () => {
    const token = jwt.sign(
      { userId: 'test-user', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );
    mockReq.headers.authorization = `Bearer ${token}`;
    verifyToken(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Token expired'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
}); 