const request = require('supertest');
const app = require('../server');

describe('Server Tests', () => {
  describe('GET /api/health', () => {
    it('should return server status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('Server is running');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    it('should handle invalid routes', async () => {
      const response = await request(app)
        .post('/api/health')  // Wrong method
        .expect(404);
    });
  });

  describe('CORS', () => {
    it('should allow CORS', async () => {
      const response = await request(app)
        .options('/api/health')
        .expect(204); // OPTIONS requests typically return 204

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});