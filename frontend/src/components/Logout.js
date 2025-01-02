import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return null; // No UI for logout, just a redirect
};

export default Logout;
