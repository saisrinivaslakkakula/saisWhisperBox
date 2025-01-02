const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const sgMail = require('@sendgrid/mail');

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

    console.log("sg api key")
    console.log(process.env.SENDGRID_API_KEY)

    // Send notification email
    /*sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'saisrinivass.lakkakula@gmail.com', // Change to your recipient
  from: 'em9947.saisrinivasl.me', // Change to your verified sender
  subject: 'New Anonymous Message Received',
  text: 'New Anonymous Message Received',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })*/
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
