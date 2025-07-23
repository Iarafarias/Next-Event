import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../../main';

describe('Rota protegida com JWT e perfis', () => {
  it('deve negar acesso sem token', async () => {
    const res = await request(app)
      .get('/api/users/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido.');
  });

  it('deve negar acesso com token inválido', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer tokeninvalido');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token inválido.');
  });

  it('deve permitir acesso com token válido de admin', async () => {
    const payload = { id: '123', email: 'admin@teste.com', role: 'admin' };
    const secret = process.env.JWT_SECRET || 'testsecret';
    const token = jwt.sign(payload, secret);
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.status);
  });

  it('deve permitir acesso com token válido de participant', async () => {
    const payload = { id: '456', email: 'user@teste.com', role: 'participant' };
    const secret = process.env.JWT_SECRET || 'testsecret';
    const token = jwt.sign(payload, secret);
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.status);
  });

  it('deve negar acesso de participant para rota de admin', async () => {
    const payload = { id: '456', email: 'user@teste.com', role: 'participant' };
    const secret = process.env.JWT_SECRET || 'testsecret';
    const token = jwt.sign(payload, secret);
    const res = await request(app)
      .put('/api/users/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome' });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado.');
  });

  it('deve permitir acesso de admin para rota de admin', async () => {
    const payload = { id: '123', email: 'admin@teste.com', role: 'admin' };
    const secret = process.env.JWT_SECRET || 'testsecret';
    const token = jwt.sign(payload, secret);
    const res = await request(app)
      .put('/api/users/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome' });
    expect([200, 201, 404]).toContain(res.status);
  });
});
