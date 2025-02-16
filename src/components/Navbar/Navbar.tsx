import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export const Navbar = () => {
  const location = useLocation()

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
              !location.pathname.includes('/item') && (
                <Link to="/form" className="navbar-link">
                  <button className="navbar-btn">Создать объявление</button>
                </Link>
              )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
