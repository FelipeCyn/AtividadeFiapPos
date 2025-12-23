import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth, usePosts } from '../hooks'
import Header from '../components/Header'
import Input from '../components/Input'
import Button from '../components/Button'
import './CriarPost.css'

function EditarPost() {
  const { id } = useParams()
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const navigate = useNavigate()
  const { teacher, requireAuth } = useAuth()
  const { fetchPostById, updatePost } = usePosts()

  useEffect(() => {
    if (!requireAuth()) return

    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      const post = await fetchPostById(id)

      if (!post) {
        setError('Post nao encontrado')
        return
      }

      const storedTeacher = JSON.parse(localStorage.getItem('teacher'))
      if (post.teacher_id !== storedTeacher?.id) {
        setError('Voce nao tem permissao para editar este post')
        return
      }

      setTitulo(post.titulo)
      setConteudo(post.conteudo)
    } catch (err) {
      setError('Erro ao carregar post')
    } finally {
      setLoadingPost(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!titulo || !conteudo) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      await updatePost(id, titulo, conteudo)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="criar-post">
        <Header />
        <main className="criar-post-main" role="main">
          <div className="criar-post-container">
            <p>Carregando...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="criar-post">
      <Header />

      <main className="criar-post-main" role="main">
        <div className="criar-post-container">
          <h1 id="editar-post-title">Editar Post</h1>

          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {!error && (
            <form onSubmit={handleSubmit} aria-labelledby="editar-post-title">
              <Input
                label="Titulo"
                type="text"
                id="titulo"
                value={titulo}
                onChange={setTitulo}
                placeholder="Digite o titulo do post"
                required
              />

              <div className="form-group">
                <label htmlFor="conteudo" className="form-label">
                  Conteudo
                </label>
                <textarea
                  id="conteudo"
                  className="form-textarea"
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  placeholder="Digite o conteudo do post"
                  required
                  rows={10}
                  aria-required="true"
                />
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  ariaLabel="Cancelar e voltar para a pagina inicial"
                >
                  Cancelar
                </Button>
                <Button type="submit" ariaLabel="Salvar alteracoes" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default EditarPost
