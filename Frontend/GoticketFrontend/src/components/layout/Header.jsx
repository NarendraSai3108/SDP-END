import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/landing" className="logo">🎫 Go Ticket</Link>
      <nav className="nav-links">
        <Link to="/landing" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link auth-btn">Login</Link>
        <Link to="/register" className="nav-link auth-btn register-btn">Register</Link>
      </nav>
    </header>
  );
};

export default Header;