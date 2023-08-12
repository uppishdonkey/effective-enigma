const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use(routes);

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/challenge-18', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define the 'activity' variable
const activity = 'application'; // You can customize this as needed

// Start the server
app.listen(PORT, () => {
  console.log(`API server for ${activity} running on port ${PORT}!`);
});