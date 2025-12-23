import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import './PostDetail.css'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post não encontrado')
        }
        throw new Error('Erro ao carregar post')
      }

      const data = await response.json()
      setPost(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="post-detail">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="main-content" className="post-detail-main" role="main">
        <div className="post-detail-container">
          <nav className="post-detail-breadcrumb" aria-label="Navegação estrutural">
            <Link to="/" aria-label="Voltar para a página inicial">
              Voltar para Home
            </Link>
          </nav>

          {loading && (
            <div className="post-detail-loading" role="status" aria-live="polite">
              <p>Carregando post...</p>
            </div>
          )}

          {error && (
            <div className="post-detail-error" role="alert" aria-live="assertive">
              <p>{error}</p>
              <Link to="/" className="post-detail-back-link">
                Voltar para Home
              </Link>
            </div>
          )}

          {!loading && !error && post && (
            <article className="post-detail-content" aria-labelledby="post-title">
              <header className="post-detail-header">
                <h1 id="post-title">{post.titulo}</h1>
                <div className="post-detail-meta">
                  <span className="post-detail-author">
                    Por <strong>{post.autor}</strong>
                  </span>
                  {post.created_at && (
                    <time className="post-detail-date" dateTime={post.created_at}>
                      {formatDate(post.created_at)}
                    </time>
                  )}
                </div>
              </header>

              <div className="post-detail-body">
                <p>{post.conteudo}</p>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  )
}

export default PostDetail
