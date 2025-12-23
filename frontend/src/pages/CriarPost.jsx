import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, usePosts } from '../hooks'
import Header from '../components/Header'
import Input from '../components/Input'
import Button from '../components/Button'
import './CriarPost.css'

function CriarPost() {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { requireAuth } = useAuth()
  const { createPost } = usePosts()

  useEffect(() => {
    requireAuth()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!titulo || !conteudo) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      await createPost(titulo, conteudo)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="criar-post">
      <Header />

      <main className="criar-post-main" role="main">
        <div className="criar-post-container">
          <h1 id="criar-post-title">Criar Novo Post</h1>

          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} aria-labelledby="criar-post-title">
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
              <Button type="submit" ariaLabel="Publicar post" disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CriarPost
