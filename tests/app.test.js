const request = require('supertest');
const app = require('../src/app');

describe('Task API', () => {
  test('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('POST /tasks creates a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Write Dockerfile' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Write Dockerfile');
  });

  test('POST /tasks rejects missing title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });

  test('GET /tasks returns task list', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});