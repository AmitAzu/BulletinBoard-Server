import request from 'supertest';
import { app } from '../src/index';

describe('Server Tests', () => {
  it('should perform a test', async () => {
    const response = await request(app).get('/getBulletin');
    expect(response.status).toBe(200);
  });
});
