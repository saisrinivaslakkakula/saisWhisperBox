import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MessageForm from './components/MessageForm';
import LoginPage from './components/LoginPage';
import MessageList from './components/MessageList';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import './App.css';


function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  return (
    <Router>
      <div className="App">
      {isLoggedIn ? <Header /> : <h1 className="header-title">Sai's WhisperBox</h1>}
        <Routes>
          <Route path="/" element={<MessageForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessageList />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
