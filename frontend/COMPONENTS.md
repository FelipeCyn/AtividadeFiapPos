# Componentes Reutilizáveis - Blog FIAP

Este documento lista todos os componentes reutilizáveis que serão criados para o frontend do Blog FIAP.

---

## 📁 Estrutura de Pastas

```
frontend/src/
├── components/
│   ├── common/           # Componentes genéricos
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Loading/
│   │   └── Alert/
│   │
│   ├── layout/           # Componentes de layout
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Container/
│   │
│   └── posts/            # Componentes específicos de posts
│       ├── PostCard/
│       ├── PostList/
│       ├── PostForm/
│       └── PostSearch/
│
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Posts/
│   ├── PostDetail/
│   └── CreatePost/
│
└── styles/
    └── variables.css     # Variáveis CSS globais
```

---

## 🧩 Componentes Comuns (common/)

### 1. Button
Botão reutilizável com variantes.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Estilo do botão |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho do botão |
| `disabled` | `boolean` | `false` | Desabilita o botão |
| `loading` | `boolean` | `false` | Mostra spinner de loading |
| `fullWidth` | `boolean` | `false` | Ocupa largura total |
| `onClick` | `function` | - | Função de clique |

**Uso:**
```jsx
<Button variant="primary" size="large" onClick={handleSubmit}>
  Salvar
</Button>
```

---

### 2. Input
Campo de entrada com label e validação.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `string` | - | Label do campo |
| `type` | `'text' \| 'email' \| 'password' \| 'textarea'` | `'text'` | Tipo do input |
| `placeholder` | `string` | - | Placeholder |
| `value` | `string` | - | Valor do campo |
| `onChange` | `function` | - | Função de mudança |
| `error` | `string` | - | Mensagem de erro |
| `required` | `boolean` | `false` | Campo obrigatório |

**Uso:**
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

---

### 3. Card
Container com sombra e bordas arredondadas.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | `string` | - | Título do card |
| `children` | `ReactNode` | - | Conteúdo do card |
| `hoverable` | `boolean` | `false` | Efeito hover |
| `padding` | `'small' \| 'medium' \| 'large'` | `'medium'` | Espaçamento interno |

**Uso:**
```jsx
<Card title="Meu Post" hoverable>
  <p>Conteúdo do card</p>
</Card>
```

---

### 4. Modal
Janela modal para confirmações e formulários.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | `boolean` | `false` | Controla visibilidade |
| `onClose` | `function` | - | Função para fechar |
| `title` | `string` | - | Título do modal |
| `children` | `ReactNode` | - | Conteúdo |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho do modal |

**Uso:**
```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirmar">
  <p>Deseja excluir este post?</p>
  <Button variant="danger" onClick={handleDelete}>Excluir</Button>
</Modal>
```

---

### 5. Loading
Indicador de carregamento.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho do spinner |
| `fullScreen` | `boolean` | `false` | Ocupa tela inteira |
| `text` | `string` | - | Texto abaixo do spinner |

**Uso:**
```jsx
<Loading size="large" text="Carregando posts..." />
```

---

### 6. Alert
Mensagens de feedback (sucesso, erro, aviso).

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Tipo do alerta |
| `message` | `string` | - | Mensagem |
| `dismissible` | `boolean` | `false` | Pode ser fechado |
| `onDismiss` | `function` | - | Função ao fechar |

**Uso:**
```jsx
<Alert type="success" message="Post criado com sucesso!" dismissible />
```

---

## 🏗️ Componentes de Layout (layout/)

### 7. Header
Cabeçalho com navegação e logo.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `user` | `object \| null` | `null` | Usuário logado |
| `onLogout` | `function` | - | Função de logout |

**Uso:**
```jsx
<Header user={currentUser} onLogout={handleLogout} />
```

---

### 8. Footer
Rodapé com informações e links.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `showLinks` | `boolean` | `true` | Exibe links |

**Uso:**
```jsx
<Footer />
```

---

### 9. Container
Wrapper com largura máxima e padding.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | Largura máxima |
| `children` | `ReactNode` | - | Conteúdo |

**Uso:**
```jsx
<Container size="medium">
  <h1>Conteúdo centralizado</h1>
</Container>
```

---

## 📝 Componentes de Posts (posts/)

### 10. PostCard
Card individual de um post.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `post` | `object` | - | Dados do post |
| `onEdit` | `function` | - | Função de editar |
| `onDelete` | `function` | - | Função de excluir |
| `showActions` | `boolean` | `true` | Mostra botões de ação |

**Uso:**
```jsx
<PostCard
  post={post}
  onEdit={() => navigate(`/posts/${post.id}/edit`)}
  onDelete={() => handleDelete(post.id)}
/>
```

---

### 11. PostList
Lista de posts com loading e empty state.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `posts` | `array` | `[]` | Lista de posts |
| `loading` | `boolean` | `false` | Estado de loading |
| `emptyMessage` | `string` | `'Nenhum post encontrado'` | Mensagem quando vazio |

**Uso:**
```jsx
<PostList posts={posts} loading={isLoading} />
```

---

### 12. PostForm
Formulário para criar/editar posts.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `initialData` | `object` | `null` | Dados iniciais (edição) |
| `onSubmit` | `function` | - | Função de submit |
| `loading` | `boolean` | `false` | Estado de loading |

**Uso:**
```jsx
<PostForm onSubmit={handleCreatePost} loading={isSubmitting} />
```

---

### 13. PostSearch
Barra de busca de posts.

**Props:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onSearch` | `function` | - | Função de busca |
| `placeholder` | `string` | `'Buscar posts...'` | Placeholder |

**Uso:**
```jsx
<PostSearch onSearch={handleSearch} />
```

---

## 🎨 Variáveis CSS Globais

```css
/* styles/variables.css */

:root {
  /* Cores */
  --color-primary: #667eea;
  --color-primary-dark: #764ba2;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;

  /* Texto */
  --color-text: #333333;
  --color-text-light: #666666;
  --color-text-muted: #999999;

  /* Background */
  --color-bg: #ffffff;
  --color-bg-light: #f8f9fa;
  --color-bg-dark: #242424;

  /* Bordas */
  --color-border: #e1e1e1;
  --border-radius: 6px;
  --border-radius-lg: 10px;

  /* Sombras */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.2);

  /* Espaçamentos */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Tipografia */
  --font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 3rem;

  /* Transições */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* Container */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}
```

---

## 📋 Páginas que Utilizarão os Componentes

| Página | Componentes Utilizados |
|--------|------------------------|
| **Home** | Header, Footer, Container, PostList, PostCard, PostSearch |
| **Login** | Container, Input, Button, Alert |
| **Posts** | Header, Footer, Container, PostList, PostCard, PostSearch, Loading |
| **PostDetail** | Header, Footer, Container, Card, Button, Modal, Alert |
| **CreatePost** | Header, Footer, Container, PostForm, Input, Button, Alert |

---

## ✅ Ordem de Implementação Sugerida

1. **Fase 1 - Base**
   - [ ] Variáveis CSS globais
   - [ ] Button
   - [ ] Input
   - [ ] Container

2. **Fase 2 - Layout**
   - [ ] Header
   - [ ] Footer
   - [ ] Loading
   - [ ] Alert

3. **Fase 3 - Posts**
   - [ ] Card
   - [ ] PostCard
   - [ ] PostList
   - [ ] PostForm
   - [ ] PostSearch

4. **Fase 4 - Avançado**
   - [ ] Modal
   - [ ] Integração com API
   - [ ] Autenticação

---

## 🔗 Referências

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)
