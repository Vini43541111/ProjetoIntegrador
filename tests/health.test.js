const request = require('supertest');
const app = require('../src/app');

// Teste de fumaça inicial. Garante que a aplicação sobe e responde.
describe('Healthcheck', () => {
  it('GET /health deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.modulo).toBe('G9 - Convenios');
  });
});
