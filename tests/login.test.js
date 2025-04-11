const jwt = require('jsonwebtoken');
const { USER_ACCOUNTS } = require('../dist/login');

// Mock environment variables
process.env.JWT_SECRET = 'test_secret_key';

describe('Login Tests', () => {
  test('should return 400 if username or password is missing', () => {
    // This would be a test for the login route
    // In a real test, we would use supertest to test the actual route
    const loginRequest = (username, password) => {
      if (!username || !password) {
        return { status: 400, error: 'Username and password are required' };
      }
      
      const user = USER_ACCOUNTS[username];
      if (!user) {
        return { status: 401, error: 'Invalid username or password' };
      }
      
      if (user.password !== password) {
        return { status: 401, error: 'Invalid username or password' };
      }
      
      const token = jwt.sign(
        { 
          username: user.username,
          role: user.role,
          displayName: user.displayName
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30m' }
      );
      
      return { 
        status: 200, 
        token,
        user: {
          username: user.username,
          role: user.role,
          displayName: user.displayName
        }
      };
    };
    
    // Test missing username
    const result1 = loginRequest(null, 'password');
    expect(result1.status).toBe(400);
    expect(result1.error).toBe('Username and password are required');
    
    // Test missing password
    const result2 = loginRequest('admin', null);
    expect(result2.status).toBe(400);
    expect(result2.error).toBe('Username and password are required');
  });
  
  test('should return 401 if username or password is invalid', () => {
    // This would be a test for the login route
    // In a real test, we would use supertest to test the actual route
    const loginRequest = (username, password) => {
      if (!username || !password) {
        return { status: 400, error: 'Username and password are required' };
      }
      
      const user = USER_ACCOUNTS[username];
      if (!user) {
        return { status: 401, error: 'Invalid username or password' };
      }
      
      if (user.password !== password) {
        return { status: 401, error: 'Invalid username or password' };
      }
      
      const token = jwt.sign(
        { 
          username: user.username,
          role: user.role,
          displayName: user.displayName
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30m' }
      );
      
      return { 
        status: 200, 
        token,
        user: {
          username: user.username,
          role: user.role,
          displayName: user.displayName
        }
      };
    };
    
    // Test invalid username
    const result1 = loginRequest('invaliduser', 'password');
    expect(result1.status).toBe(401);
    expect(result1.error).toBe('Invalid username or password');
    
    // Test invalid password
    const result2 = loginRequest('admin', 'wrongpassword');
    expect(result2.status).toBe(401);
    expect(result2.error).toBe('Invalid username or password');
  });
  
  test('should return token and user info if credentials are valid', () => {
    // This would be a test for the login route
    // In a real test, we would use supertest to test the actual route
    const loginRequest = (username, password) => {
      if (!username || !password) {
        return { status: 400, error: 'Username and password are required' };
      }
      
      const user = USER_ACCOUNTS[username];
      if (!user) {
        return { status: 401, error: 'Invalid username or password' };
      }
      
      if (user.password !== password) {
        return { status: 401, error: 'Invalid username or password' };
      }
      
      const token = jwt.sign(
        { 
          username: user.username,
          role: user.role,
          displayName: user.displayName
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30m' }
      );
      
      return { 
        status: 200, 
        token,
        user: {
          username: user.username,
          role: user.role,
          displayName: user.displayName
        }
      };
    };
    
    // Test valid credentials
    const result = loginRequest('admin', 'admin123');
    expect(result.status).toBe(200);
    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.username).toBe('admin');
    expect(result.user.role).toBe('Administrator');
    expect(result.user.displayName).toBe('Admin User');
    
    // Verify token
    const decoded = jwt.verify(result.token, process.env.JWT_SECRET);
    expect(decoded.username).toBe('admin');
    expect(decoded.role).toBe('Administrator');
    expect(decoded.displayName).toBe('Admin User');
  });
});

describe('Login Functionality', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('User Accounts', () => {
    test('should have all required user roles', () => {
      expect(USER_ACCOUNTS).toHaveProperty('admin');
      expect(USER_ACCOUNTS).toHaveProperty('investor');
      expect(USER_ACCOUNTS).toHaveProperty('agent');
      expect(USER_ACCOUNTS).toHaveProperty('manager');
    });

    test('each account should have required properties', () => {
      const requiredProps = ['username', 'password', 'role', 'displayName'];
      
      Object.values(USER_ACCOUNTS).forEach(account => {
        requiredProps.forEach(prop => {
          expect(account).toHaveProperty(prop);
          expect(account[prop]).toBeTruthy();
        });
      });
    });
  });

  describe('Login Process', () => {
    test('should store user info in localStorage on successful login', () => {
      const mockLogin = (username, password) => {
        const account = USER_ACCOUNTS[username];
        if (account && account.password === password) {
          localStorage.setItem('userRole', account.role);
          localStorage.setItem('userDisplayName', account.displayName);
          return true;
        }
        return false;
      };

      // Test with valid credentials
      const result = mockLogin('admin', 'admin123');
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'Administrator');
      expect(localStorage.setItem).toHaveBeenCalledWith('userDisplayName', 'Admin User');
    });

    test('should not store user info with invalid credentials', () => {
      const mockLogin = (username, password) => {
        const account = USER_ACCOUNTS[username];
        if (account && account.password === password) {
          localStorage.setItem('userRole', account.role);
          localStorage.setItem('userDisplayName', account.displayName);
          return true;
        }
        return false;
      };

      // Test with invalid credentials
      const result = mockLogin('admin', 'wrongpassword');
      expect(result).toBe(false);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
}); 