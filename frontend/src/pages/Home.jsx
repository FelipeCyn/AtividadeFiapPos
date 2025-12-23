import { useState, useEffect } from 'react'
import { useAuth, usePosts } from '../hooks'
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import Input from '../components/Input'
import Button from '../components/Button'
import './Home.css'

function Home() {
  const [search, setSearch] = useState('')
  const { teacher } = useAuth()
  const { posts, loading, error, fetchAllPosts, searchPosts } = usePosts()

  useEffect(() => {
    fetchAllPosts()
  }, [])

  const handleSearch = (value) => {
    setSearch(value)

    if (value.length >= 2) {
      searchPosts(value)
    } else if (value.length === 0) {
      fetchAllPosts()
    }
  }

  return (
    <div className="home">
      <a href="#main-content" className="skip-link">
        Pular para o conteudo principal
      </a>

      <Header />

      <main id="main-content" className="home-main" role="main">
        <div className="home-container">
          <section className="home-hero" aria-labelledby="hero-title">
            <h1 id="hero-title">Blog FIAP</h1>
            <p>Confira os ultimos posts e novidades</p>
          </section>

          <section className="search-section" aria-label="Buscar posts">
            <Input
              placeholder="Buscar posts por palavra-chave..."
              value={search}
              onChange={handleSearch}
              ariaLabel="Buscar posts por palavra-chave"
            />
          </section>

          {loading && (
            <div className="home-loading" role="status" aria-live="polite">
              <p>Carregando posts...</p>
            </div>
          )}

          {error && (
            <div className="home-error" role="alert" aria-live="assertive">
              <p>{error}</p>
              <Button
                onClick={() => fetchAllPosts()}
                ariaLabel="Tentar carregar posts novamente"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="home-empty" role="status" aria-live="polite">
              <p>Nenhum post encontrado.</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <section className="posts-grid" aria-label={`Lista de ${posts.length} posts`}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentTeacherId={teacher?.id} />
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
