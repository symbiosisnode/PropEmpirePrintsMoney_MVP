const request = require('supertest');
const app = require('../server/server');

describe('Server Configuration', () => {
  test('should serve static files from dist directory', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
  });

  test('should handle 404 errors for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test('should have CORS enabled', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:3000');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('should parse JSON request bodies', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' })
      .set('Content-Type', 'application/json');
    expect(response.status).not.toBe(415); // Not Unsupported Media Type
  });

  test('should have security headers', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
  });
}); 