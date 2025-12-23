import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import PostDetail from './pages/PostDetail'
import CriarPost from './pages/CriarPost'
import EditarPost from './pages/EditarPost'
import MeusPosts from './pages/MeusPosts'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/criar-post" element={<CriarPost />} />
          <Route path="/editar-post/:id" element={<EditarPost />} />
          <Route path="/meus-posts" element={<MeusPosts />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
