const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const messagesRouter = require('./routes/messages');
const adminRouter = require('./routes/admin');

dotenv.config(); // Load environment variables

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in the .env file.');
  process.exit(1); // Exit the application if JWT_SECRET is missing
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/messages', messagesRouter);
app.use('/api/admin', adminRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`JWT_SECRET is properly configured.`);
});
