const { connect, connection } = require('mongoose');
const mongoose = require('mongoose');
const Thought = require('../models/thought');

const connectionString =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thoughtsDB';

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Pass the useUnifiedTopology option
});

module.exports = connection;