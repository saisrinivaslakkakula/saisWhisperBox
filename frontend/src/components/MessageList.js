import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MessageList.css';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('all'); // Default to "All Time"
  const messagesPerPage = 5;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/messages?page=${currentPage}&limit=${messagesPerPage}&filter=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const { messages, totalMessages } = response.data;
  
        setMessages(messages);
        setTotalPages(Math.ceil(totalMessages / messagesPerPage)); // Dynamically set total pages
      } catch (err) {
        setError('Failed to fetch messages. Please try again.');
      }
    };
  
    fetchMessages();
  }, [currentPage, filter]);
  

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  return (
    <div className="message-list-container">
      <h2>Messages</h2>
      {error && <p className="error">{error}</p>}

      {/* Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="filter">Filter by Date:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All Time</option>
          <option value="3">Last 3 Days</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {/* Message Cards */}
      <div className="messages-grid">
        {messages.map((msg) => (
          <div className="message-card" key={msg.id}>
            <p className="message-content">{msg.message}</p>
            <p className="message-timestamp">{msg.timestamp}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MessageList;
