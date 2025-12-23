CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  autor VARCHAR(100) NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_titulo ON posts USING gin(to_tsvector('portuguese', titulo));
CREATE INDEX IF NOT EXISTS idx_posts_conteudo ON posts USING gin(to_tsvector('portuguese', conteudo));

CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);

-- TODO: Remover esses inserts em producao (professores de teste)
INSERT INTO teachers (nome, email, password_hash) VALUES
  ('Professor FIAP', 'professor@fiap.com.br', '$2b$10$nQ3vr/hF9jqb8r7pobrC4OCE2NYgPtQvHMLhJXfKG4hqtG0quSVFi'),
  ('Maria Silva', 'maria@fiap.com.br', '$2b$10$cvqBjumrZuA4EWTDik6AeeHwASyHJJMfm81..BW60T4PmF6uKhGRi')
ON CONFLICT (email) DO NOTHING;
