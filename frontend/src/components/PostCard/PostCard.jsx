import { Link } from 'react-router-dom'
import Button from '../Button'
import './PostCard.css'

function PostCard({ post, currentTeacherId }) {
  const { id, titulo, autor, conteudo, created_at, teacher_id } = post

  const isOwner = () => {
    return currentTeacherId && currentTeacherId === teacher_id
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <article className="post-card" aria-labelledby={`post-title-${id}`}>
      <div className="post-card-content">
        <Link
          to={`/posts/${id}`}
          className="post-card-title"
          aria-label={`Ler post: ${titulo}`}
        >
          <h2 id={`post-title-${id}`}>{titulo}</h2>
        </Link>

        <p className="post-card-description">
          {truncateText(conteudo)}
        </p>

        <footer className="post-card-footer">
          <span className="post-card-author">
            Por <strong>{autor}</strong>
          </span>
          {created_at && (
            <time className="post-card-date" dateTime={created_at}>
              {formatDate(created_at)}
            </time>
          )}
        </footer>
      </div>

      <div className="post-card-actions">
        <Button
          to={`/posts/${id}`}
          ariaLabel={`Ler mais sobre: ${titulo}`}
        >
          Ler mais
        </Button>
        {isOwner() && (
          <Button
            to={`/editar-post/${id}`}
            ariaLabel={`Editar post: ${titulo}`}
          >
            Editar
          </Button>
        )}
      </div>
    </article>
  )
}

export default PostCard
