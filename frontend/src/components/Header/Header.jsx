import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import Button from '../Button'
import './Header.css'

function Header() {
  const { isLoggedIn, teacher, logout } = useAuth()

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="Blog FIAP - Ir para página inicial">
          Blog FIAP
        </Link>

        <nav className="header-nav" role="navigation" aria-label="Navegação principal">
          <Link to="/" className="header-link" aria-current="page">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <span className="header-teacher" aria-label={`Logado como ${teacher?.nome}`}>
                {teacher?.nome}
              </span>
              <Button to="/meus-posts" ariaLabel="Gerenciar meus posts">
                Meus Posts
              </Button>
              <Button to="/criar-post" ariaLabel="Criar novo post">
                Criar Post
              </Button>
              <Button onClick={logout} ariaLabel="Sair do sistema">
                Sair
              </Button>
            </>
          ) : (
            <Button to="/login" ariaLabel="Ir para página de login">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
