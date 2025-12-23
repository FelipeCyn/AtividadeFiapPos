import request from 'supertest';
import app from '../app.js';
import pool from '../config/database.js';
import Teacher from '../models/Teacher.js';
import { generateToken } from '../middleware/auth.js';

describe('Posts API', () => {
  let authToken;
  let testTeacher;

  beforeAll(async () => {
    await pool.query('DELETE FROM posts');
    await pool.query('DELETE FROM teachers');

    testTeacher = await Teacher.create('Professor Teste', 'teste@test.com', 'senha123');
    authToken = generateToken(testTeacher);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM posts');
    await pool.query('DELETE FROM teachers');
    await pool.end();
  });

  describe('POST /posts', () => {
    it('deve criar um novo post com autenticacao', async () => {
      const newPost = {
        titulo: 'Post de Teste',
        conteudo: 'Conteudo do teste'
      };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPost)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.titulo).toBe(newPost.titulo);
      expect(response.body.conteudo).toBe(newPost.conteudo);
      expect(response.body.autor).toBe(testTeacher.nome);
    });

    it('deve retornar erro 401 sem autenticacao', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ titulo: 'Teste', conteudo: 'Conteudo' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar erro 400 quando faltam campos obrigatorios', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ titulo: 'Sem conteudo' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /posts', () => {
    it('deve listar todos os posts', async () => {
      const response = await request(app)
        .get('/posts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /posts/:id', () => {
    it('deve retornar um post por ID', async () => {
      const result = await pool.query(
        'INSERT INTO posts (titulo, conteudo, autor, teacher_id) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Teste GET', 'Conteudo', testTeacher.nome, testTeacher.id]
      );
      const postId = result.rows[0].id;

      const response = await request(app)
        .get(`/posts/${postId}`)
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.titulo).toBe('Teste GET');
    });

    it('deve retornar 404 para post inexistente', async () => {
      const response = await request(app)
        .get('/posts/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /posts/search', () => {
    it('deve buscar posts por palavra-chave', async () => {
      await pool.query(
        'INSERT INTO posts (titulo, conteudo, autor, teacher_id) VALUES ($1, $2, $3, $4)',
        ['JavaScript', 'Conteudo sobre JS', testTeacher.nome, testTeacher.id]
      );

      const response = await request(app)
        .get('/posts/search?q=javascript')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('deve retornar erro 400 sem query string', async () => {
      const response = await request(app)
        .get('/posts/search')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /posts/:id', () => {
    it('deve atualizar um post com autenticacao', async () => {
      const result = await pool.query(
        'INSERT INTO posts (titulo, conteudo, autor, teacher_id) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Antes', 'Conteudo antes', testTeacher.nome, testTeacher.id]
      );
      const postId = result.rows[0].id;

      const updatedData = {
        titulo: 'Depois',
        conteudo: 'Conteudo depois'
      };

      const response = await request(app)
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.titulo).toBe('Depois');
      expect(response.body.conteudo).toBe('Conteudo depois');
    });

    it('deve retornar erro 401 sem autenticacao', async () => {
      const response = await request(app)
        .put('/posts/1')
        .send({ titulo: 'Teste', conteudo: 'Conteudo' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('deve deletar um post com autenticacao', async () => {
      const result = await pool.query(
        'INSERT INTO posts (titulo, conteudo, autor, teacher_id) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Para deletar', 'Conteudo', testTeacher.nome, testTeacher.id]
      );
      const postId = result.rows[0].id;

      await request(app)
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const checkResult = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
      expect(checkResult.rows.length).toBe(0);
    });

    it('deve retornar erro 401 sem autenticacao', async () => {
      const response = await request(app)
        .delete('/posts/1')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /posts/me', () => {
    it('deve retornar posts do professor autenticado', async () => {
      const response = await request(app)
        .get('/posts/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve retornar erro 401 sem autenticacao', async () => {
      const response = await request(app)
        .get('/posts/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
