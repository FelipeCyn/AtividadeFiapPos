import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import Input from '../components/Input'
import Button from '../components/Button'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <main className="login-box" role="main">
        <h1 id="login-title">Login</h1>
        <p className="login-subtitle">Blog FIAP</p>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} aria-labelledby="login-title">
          <Input
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Sua senha"
            required
          />

          <div className="login-actions">
            <Button
              type="button"
              onClick={() => navigate('/')}
              ariaLabel="Voltar para a pagina inicial"
            >
              Voltar
            </Button>
            <Button type="submit" ariaLabel="Entrar no sistema" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Login
