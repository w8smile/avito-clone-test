import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('user'))
  }, [location]) // Обновляем состояние при смене маршрута

  const handleLogin = () => {
    navigate('/auth')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  // Список страниц, на которых скрываем кнопку входа/выхода
  const hideAuthButton =
    location.pathname === '/auth' ||
    location.pathname === '/form' ||
    location.pathname.startsWith('/edit') ||
    location.pathname.startsWith('/item')

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <h1>Avito Clone</h1>
        </Link>

        <nav>
          <ul className="nav-links">
            {location.pathname !== '/form' &&
              !location.pathname.includes('/edit') &&
              !location.pathname.includes('/item') &&
              !location.pathname.includes('/auth') && (
                <Link to="/form" className="navbar-link">
                  <button className="navbar-btn">Создать объявление</button>
                </Link>
              )}
          </ul>
        </nav>

        {/* Кнопка входа/выхода (скрываем на указанных страницах) */}
        {!hideAuthButton && (
          <div className="auth-section">
            {isAuthenticated ? (
              <button className="auth-button logout" onClick={handleLogout}>
                Выйти
              </button>
            ) : (
              <button className="auth-button login" onClick={handleLogin}>
                Войти
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
