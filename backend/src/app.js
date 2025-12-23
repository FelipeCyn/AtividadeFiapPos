import express from 'express';
import Post from './models/Post.js';
import Teacher from './models/Teacher.js';
import { generateToken, authMiddleware } from './middleware/auth.js';

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const teacher = await Teacher.findByEmail(email);

    if (!teacher) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValidPassword = await Teacher.validatePassword(password, teacher.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(teacher);

    res.json({
      token,
      teacher: {
        id: teacher.id,
        nome: teacher.nome,
        email: teacher.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
      return res.status(400).json({
        error: 'Título e conteúdo são obrigatórios'
      });
    }

    const post = await Post.create({
      titulo,
      conteudo,
      autor: req.teacher.nome,
      teacher_id: req.teacher.id
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

app.get('/posts/me', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.findByTeacherId(req.teacher.id);
    res.json(posts);
  } catch (error) {
    console.error('Erro ao listar posts do professor:', error);
    res.status(500).json({ error: 'Erro ao listar posts' });
  }
});

app.get('/posts/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query string "q" é obrigatória' });
    }

    const posts = await Post.search(q);
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    res.status(500).json({ error: 'Erro ao listar posts' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

app.put('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
      return res.status(400).json({
        error: 'Título e conteúdo são obrigatórios'
      });
    }

    const post = await Post.update(id, { titulo, conteudo, autor: req.teacher.nome });

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

app.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.delete(id);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

export default app;
