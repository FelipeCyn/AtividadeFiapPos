import { useState } from 'react'

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getToken = () => localStorage.getItem('token')

  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/posts')

      if (!response.ok) {
        throw new Error('Erro ao carregar posts')
      }

      const data = await response.json()
      setPosts(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/posts/me', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar posts')
      }

      const data = await response.json()
      setPosts(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchPostById = async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`)

      if (!response.ok) {
        throw new Error('Post nao encontrado')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (query) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error('Erro ao buscar posts')
      }

      const data = await response.json()
      setPosts(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (titulo, conteudo) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ titulo, conteudo })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar post')
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (id, titulo, conteudo) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ titulo, conteudo })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar post')
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir post')
      }

      setPosts(posts.filter(post => post.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
    error,
    fetchAllPosts,
    fetchMyPosts,
    fetchPostById,
    searchPosts,
    createPost,
    updatePost,
    deletePost,
    setPosts,
    setError
  }
}

export default usePosts
