const request = require('supertest');
const app = require('../server/server');
const jwt = require('jsonwebtoken');

describe('Property Management Routes', () => {
  let authToken;
  let testProperty;

  beforeAll(() => {
    // Create a test property
    testProperty = {
      name: 'Test Property',
      address: '123 Test St',
      type: 'Residential',
      status: 'Available',
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2000,
      yearBuilt: 2020,
      description: 'A test property for unit testing'
    };
  });

  beforeEach(async () => {
    // Get auth token for protected routes
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    authToken = loginResponse.body.token;
  });

  test('should return 401 when accessing properties without token', async () => {
    const response = await request(app)
      .get('/api/properties');
    expect(response.status).toBe(401);
  });

  test('should return 200 and empty array for new user', async () => {
    const response = await request(app)
      .get('/api/properties')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('should create a new property', async () => {
    const response = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testProperty);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(testProperty.name);
    expect(response.body.address).toBe(testProperty.address);
  });

  test('should return 400 when creating property with missing required fields', async () => {
    const invalidProperty = { name: 'Test Property' };
    const response = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidProperty);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('should get all properties after creation', async () => {
    const response = await request(app)
      .get('/api/properties')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });

  test('should update an existing property', async () => {
    // First create a property
    const createResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testProperty);
    const propertyId = createResponse.body.id;

    // Then update it
    const updatedProperty = {
      ...testProperty,
      name: 'Updated Test Property',
      price: 600000
    };

    const response = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedProperty);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedProperty.name);
    expect(response.body.price).toBe(updatedProperty.price);
  });

  test('should delete an existing property', async () => {
    // First create a property
    const createResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testProperty);
    const propertyId = createResponse.body.id;

    // Then delete it
    const response = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Property deleted successfully');

    // Verify property is deleted
    const getResponse = await request(app)
      .get(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(getResponse.status).toBe(404);
  });

  test('should return 404 when updating non-existent property', async () => {
    const response = await request(app)
      .put('/api/properties/999999')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testProperty);
    expect(response.status).toBe(404);
  });

  test('should return 404 when deleting non-existent property', async () => {
    const response = await request(app)
      .delete('/api/properties/999999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(404);
  });
}); 