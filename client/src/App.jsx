import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { usePuterStore } from './lib/puter'
import Home from './routes/home'
import Auth from './routes/auth'
import Upload from './routes/upload'
import Resume from './routes/resume'
import Wipe from './routes/wipe'

function App() {
  const { init } = usePuterStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/resume/:id" element={<Resume />} />
        <Route path="/wipe" element={<Wipe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App