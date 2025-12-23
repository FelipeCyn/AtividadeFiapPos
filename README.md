# Blog FIAP

Sistema de blog desenvolvido para atividade da FIAP, com autenticacao de professores para gerenciamento de posts.

## Indice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como rodar](#como-rodar)
- [Criando um professor](#criando-um-professor)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Testes](#testes)

## Sobre

O Blog FIAP e uma aplicacao fullstack que permite:
- Visualizacao publica de posts por qualquer visitante
- Busca de posts por palavra-chave
- Autenticacao de professores via JWT
- Criacao, edicao e exclusao de posts (apenas professores autenticados)
- Cada professor so pode editar/excluir seus proprios posts

## Tecnologias

### Backend
- Node.js
- Express 5.1
- PostgreSQL 16
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- React 19
- React Router 7
- Vite 7
- CSS com variaveis customizadas

### Infraestrutura
- Docker / Docker Compose
- GitHub Actions (CI/CD)

## Arquitetura

```
AtividadeFiapNodejs/
├── backend/
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── config/
│       │   └── database.js
│       ├── middleware/
│       │   └── auth.js
│       ├── models/
│       │   ├── Post.js
│       │   └── Teacher.js
│       ├── scripts/
│       │   └── createTeacher.js
│       └── database/
│           └── init.sql
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Button/
│       │   ├── Header/
│       │   ├── Input/
│       │   └── PostCard/
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── usePosts.js
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── CriarPost.jsx
│       │   ├── EditarPost.jsx
│       │   ├── MeusPosts.jsx
│       │   └── PostDetail.jsx
│       └── styles/
│           └── variables.css
└── docker-compose.yml
```

### Banco de Dados

**Tabela `teachers`:**
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | SERIAL | Chave primaria |
| nome | VARCHAR(100) | Nome do professor |
| email | VARCHAR(255) | Email unico |
| password_hash | VARCHAR(255) | Senha criptografada |
| created_at | TIMESTAMP | Data de criacao |

**Tabela `posts`:**
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | SERIAL | Chave primaria |
| titulo | VARCHAR(255) | Titulo do post |
| conteudo | TEXT | Conteudo do post |
| autor | VARCHAR(100) | Nome do autor |
| teacher_id | INTEGER | FK para teachers |
| created_at | TIMESTAMP | Data de criacao |
| updated_at | TIMESTAMP | Data de atualizacao |

## Como rodar

### Com Docker (recomendado)

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
docker-compose down -v
```

Apos subir:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

### Sem Docker

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Criando um professor

Professores sao criados via script (nao pelo site).

**Com Docker:**
```bash
docker-compose exec backend node src/scripts/createTeacher.js "Nome do Professor" "email@exemplo.com" "senha123"
```

**Sem Docker:**
```bash
cd backend
node src/scripts/createTeacher.js "Nome do Professor" "email@exemplo.com" "senha123"
```

**Professores de teste (criados automaticamente):**
| Nome | Email | Senha |
|------|-------|-------|
| Professor FIAP | professor@fiap.com.br | fiap123 |
| Maria Silva | maria@fiap.com.br | maria123 |

## API Endpoints

### Autenticacao

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| POST | `/auth/login` | Login do professor | Nao |

**Body do login:**
```json
{
  "email": "professor@fiap.com.br",
  "password": "fiap123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "teacher": {
    "id": 1,
    "nome": "Professor FIAP",
    "email": "professor@fiap.com.br"
  }
}
```

### Posts

| Metodo | Rota | Descricao | Autenticacao |
|--------|------|-----------|--------------|
| GET | `/posts` | Listar todos os posts | Nao |
| GET | `/posts/:id` | Obter post por ID | Nao |
| GET | `/posts/search?q=termo` | Buscar posts | Nao |
| GET | `/posts/me` | Posts do professor logado | Sim |
| POST | `/posts` | Criar novo post | Sim |
| PUT | `/posts/:id` | Atualizar post | Sim |
| DELETE | `/posts/:id` | Deletar post | Sim |

**Headers para rotas autenticadas:**
```
Authorization: Bearer <token>
```

**Body para criar/atualizar post:**
```json
{
  "titulo": "Titulo do post",
  "conteudo": "Conteudo do post"
}
```

## Frontend

### Paginas

| Rota | Componente | Descricao | Autenticacao |
|------|------------|-----------|--------------|
| `/` | Home | Lista de posts com busca | Nao |
| `/post/:id` | PostDetail | Visualizar post | Nao |
| `/login` | Login | Tela de login | Nao |
| `/criar-post` | CriarPost | Criar novo post | Sim |
| `/editar-post/:id` | EditarPost | Editar post | Sim |
| `/meus-posts` | MeusPosts | Posts do professor | Sim |

### Componentes

- **Header**: Navegacao com logo, links e botoes de acao
- **Button**: Botao reutilizavel com variantes
- **Input**: Campo de entrada com label e validacao
- **PostCard**: Card de visualizacao de post

### Hooks Customizados

**useAuth:**
- `isLoggedIn`: Estado de autenticacao
- `teacher`: Dados do professor logado
- `login(email, password)`: Fazer login
- `logout()`: Fazer logout
- `requireAuth()`: Redireciona para login se nao autenticado

**usePosts:**
- `posts`: Lista de posts
- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `fetchAllPosts()`: Buscar todos os posts
- `fetchMyPosts()`: Buscar posts do professor
- `fetchPostById(id)`: Buscar post por ID
- `searchPosts(query)`: Buscar por palavra-chave
- `createPost(titulo, conteudo)`: Criar post
- `updatePost(id, titulo, conteudo)`: Atualizar post
- `deletePost(id)`: Deletar post

## Testes

```bash
cd backend
npm test
npm run test:coverage
npm run test:watch
```

Os testes utilizam Jest + Supertest e testam todas as rotas da API.

## Variaveis de Ambiente

### Backend (.env)
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=posts_db
JWT_SECRET=sua_chave_secreta
```

---

Projeto desenvolvido para atividade da FIAP
