import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import './MessageForm.css';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(''); // To handle errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // API call to submit the message
      await axios.post(`${process.env.REACT_APP_API_URL}/messages`, {
        message, // Send the message in the request body
      });

      setSubmitted(true); // Set submitted state to true on success
    } catch (err) {
      console.error(err);
      setError('Failed to submit your message. Please try again.');
    }
  };

  return (
    <div className="message-form-container">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your anonymous message here..."
            required
            className="message-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <div className="thank-you-message">
          <h2>Thank You for Sharing! 🌟</h2>
          <p>Your message is safe with Sai's WhisperBox.</p>
          <p>Feel free to come back and share more thoughts anytime.</p>
        </div>
      )}
    </div>
  );
};

export default MessageForm;
