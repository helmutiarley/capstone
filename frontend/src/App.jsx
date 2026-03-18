import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import PreferencesMe from './pages/PreferencesMe.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <header className="brand">
          <div>
            <p className="eyebrow">Capstone</p>
            <h1>Preferences Portal</h1>
            <p className="subtitle">Use HttpOnly cookies for secure sessions.</p>
          </div>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login
            </NavLink>
            <NavLink
              to="/preferences/me"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              My preferences
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/preferences/me" element={<PreferencesMe />} />
        </Routes>

        <footer className="foot">
          <p>
            Backend endpoints: <code>/api/auth/login</code> • <code>/api/auth/logout</code>
          </p>
          <p>
            Vite proxy → <code>http://localhost:3000</code>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
