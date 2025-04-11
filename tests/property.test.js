const { loadProperties, handleFormSubmit, deleteProperty } = require('../dist/script');

describe('Property Management', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Property Loading', () => {
    test('should load properties from localStorage', () => {
      // Mock properties in localStorage
      const mockProperties = [
        {
          id: 1,
          name: 'Test Property 1',
          address: '123 Test St',
          type: 'Residential',
          status: 'Available'
        }
      ];
      localStorage.setItem('properties', JSON.stringify(mockProperties));

      // Mock document.getElementById
      document.getElementById = jest.fn(() => ({
        innerHTML: ''
      }));

      loadProperties();
      expect(localStorage.getItem).toHaveBeenCalledWith('properties');
    });

    test('should handle empty properties list', () => {
      localStorage.setItem('properties', JSON.stringify([]));
      document.getElementById = jest.fn(() => ({
        innerHTML: ''
      }));

      loadProperties();
      expect(document.getElementById).toHaveBeenCalledWith('propertyList');
    });
  });

  describe('Property Submission', () => {
    test('should validate required fields', () => {
      const formData = {
        name: '',
        address: '123 Test St',
        type: 'Residential',
        status: 'Available'
      };

      const result = handleFormSubmit(formData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    test('should successfully add a property', () => {
      const formData = {
        name: 'Test Property',
        address: '123 Test St',
        type: 'Residential',
        status: 'Available'
      };

      const result = handleFormSubmit(formData);
      expect(result.success).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Property Deletion', () => {
    test('should delete property by id', () => {
      // Setup mock properties
      const mockProperties = [
        { id: 1, name: 'Test Property 1' },
        { id: 2, name: 'Test Property 2' }
      ];
      localStorage.setItem('properties', JSON.stringify(mockProperties));

      // Mock document.getElementById
      document.getElementById = jest.fn(() => ({
        innerHTML: ''
      }));

      const result = deleteProperty(1);
      expect(result.success).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should handle non-existent property id', () => {
      const mockProperties = [
        { id: 1, name: 'Test Property 1' }
      ];
      localStorage.setItem('properties', JSON.stringify(mockProperties));

      const result = deleteProperty(999);
      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });
  });
}); 