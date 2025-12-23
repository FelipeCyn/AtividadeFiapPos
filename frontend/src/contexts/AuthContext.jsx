import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedTeacher = localStorage.getItem('teacher')

    if (token && storedTeacher) {
      setIsLoggedIn(true)
      setTeacher(JSON.parse(storedTeacher))
    } else {
      setIsLoggedIn(false)
      setTeacher(null)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('teacher', JSON.stringify(data.teacher))
    setIsLoggedIn(true)
    setTeacher(data.teacher)

    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('teacher')
    setIsLoggedIn(false)
    setTeacher(null)
    navigate('/')
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const requireAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return false
    }
    return true
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      teacher,
      loading,
      login,
      logout,
      getToken,
      requireAuth,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
