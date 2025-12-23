import { useState, useEffect } from 'react'
import { useAuth, usePosts } from '../hooks'
import Header from '../components/Header'
import Button from '../components/Button'
import './MeusPosts.css'

function MeusPosts() {
  const [deleting, setDeleting] = useState(null)
  const { requireAuth } = useAuth()
  const { posts, loading, error, fetchMyPosts, deletePost } = usePosts()

  useEffect(() => {
    if (requireAuth()) {
      fetchMyPosts()
    }
  }, [])

  const handleDelete = async (postId, postTitulo) => {
    if (!window.confirm(`Tem certeza que deseja excluir o post "${postTitulo}"?`)) {
      return
    }

    setDeleting(postId)

    try {
      await deletePost(postId)
    } catch (err) {
      alert('Erro ao excluir post')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="meus-posts">
      <Header />

      <main className="meus-posts-main" role="main">
        <div className="meus-posts-container">
          <div className="meus-posts-header">
            <h1 id="meus-posts-title">Meus Posts</h1>
            <Button to="/criar-post" ariaLabel="Criar novo post">
              Criar Post
            </Button>
          </div>

          {loading && (
            <div className="meus-posts-loading" role="status" aria-live="polite">
              <p>Carregando posts...</p>
            </div>
          )}

          {error && (
            <div className="meus-posts-error" role="alert" aria-live="assertive">
              <p>{error}</p>
              <Button onClick={fetchMyPosts} ariaLabel="Tentar carregar posts novamente">
                Tentar novamente
              </Button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="meus-posts-empty" role="status" aria-live="polite">
              <p>Voce ainda nao criou nenhum post.</p>
              <Button to="/criar-post" ariaLabel="Criar seu primeiro post">
                Criar primeiro post
              </Button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="meus-posts-list" role="list" aria-label="Lista de posts">
              {posts.map((post) => (
                <article key={post.id} className="meus-posts-item" role="listitem">
                  <div className="meus-posts-item-content">
                    <h2 className="meus-posts-item-title">{post.titulo}</h2>
                    <p className="meus-posts-item-date">
                      Criado em {formatDate(post.created_at)}
                    </p>
                  </div>
                  <div className="meus-posts-item-actions">
                    <Button
                      to={`/posts/${post.id}`}
                      ariaLabel={`Ver post: ${post.titulo}`}
                    >
                      Ver
                    </Button>
                    <Button
                      to={`/editar-post/${post.id}`}
                      ariaLabel={`Editar post: ${post.titulo}`}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id, post.titulo)}
                      ariaLabel={`Excluir post: ${post.titulo}`}
                      disabled={deleting === post.id}
                    >
                      {deleting === post.id ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MeusPosts
