const fetch = require('node-fetch');

// Test the GET /api/properties endpoint
async function testGetProperties() {
  try {
    console.log('Testing GET /api/properties...');
    const response = await fetch('http://localhost:5000/api/properties');
    const data = await response.json();
    console.log('GET /api/properties response:', data);
    return data;
  } catch (error) {
    console.error('Error testing GET /api/properties:', error);
  }
}

// Test the POST /api/properties endpoint
async function testCreateProperty() {
  try {
    console.log('Testing POST /api/properties...');
    const propertyData = {
      name: 'Test Property',
      location: '123 Test Street, Test City',
      arv: 250000,
      notes: 'This is a test property created by the test script'
    };
    
    const response = await fetch('http://localhost:5000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(propertyData)
    });
    
    const data = await response.json();
    console.log('POST /api/properties response:', data);
    return data;
  } catch (error) {
    console.error('Error testing POST /api/properties:', error);
  }
}

// Run the tests
async function runTests() {
  console.log('Starting API tests...');
  
  // First create a property
  const createdProperty = await testCreateProperty();
  
  // Then get all properties
  await testGetProperties();
  
  console.log('API tests completed!');
}

runTests(); 