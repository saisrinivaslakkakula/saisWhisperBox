const express = require('express');
const router = express.Router();
const axios = require("axios");
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all messages (protected)
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, filter = 'all' } = req.query;
    const offset = (page - 1) * limit;
  
    // Define filter condition based on the filter value
    let filterCondition = '';
    if (filter === '3') {
      filterCondition = "WHERE timestamp >= NOW() - INTERVAL '3 days'";
    } else if (filter === '7') {
      filterCondition = "WHERE timestamp >= NOW() - INTERVAL '7 days'";
    } else if (filter === '30') {
      filterCondition = "WHERE timestamp >= NOW() - INTERVAL '30 days'";
    }
  
    try {
      // Fetch filtered and paginated messages
      const result = await db.query(
        `
        SELECT * FROM messages
        ${filterCondition}
        ORDER BY timestamp DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      );
  
      // Fetch total count for pagination (with filter applied)
      const countResult = await db.query(
        `
        SELECT COUNT(*) AS total FROM messages
        ${filterCondition}
        `
      );
  
      const totalMessages = parseInt(countResult.rows[0].total, 10);
  
      res.status(200).json({
        messages: result.rows,
        totalMessages,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

// Add a new message
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Message content is required');
  }

  try {
    const result = await db.query(
      'INSERT INTO messages (message, timestamp) VALUES ($1, NOW()) RETURNING *',
      [message]
    );

      // Prepare email payload
    const emailPayload = {
      sender: process.env.EMAIL_FROM, // Sender email from .env
      to: [process.env.EMAIL_TO], // Recipient email from .env
      subject: "New Message Received", // Email subject
      text_body: `A new message has been received: ${message}`, // Email body
    };

    // Attempt to send the email
    try {
      const response = await axios.post(
        "https://api.smtp2go.com/v3/email/send",
        emailPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "X-Smtp2go-Api-Key": process.env.SMTP_API_KEY, // API key from .env
          },
        }
      );

      // Log email success or failure
      if (response.data.data.succeeded > 0) {
        console.log("Email sent successfully.");
      } else {
        console.error("Email send failed:", response.data);
      }
      

    } catch (emailError) {
      // Log email errors, but do not stop the process
      console.error("Error sending email:", emailError.response?.data || emailError.message);
    }


    res.status(201).json({
      success: true,
      message: "Message saved and email sent successfully.",
      messageId: result.rows[0].id,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
