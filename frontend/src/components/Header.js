import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and redirect
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <h1>Sai's WhisperBox</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/messages">Messages</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
