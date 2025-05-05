// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Import data router
const dataRoutes = require("./Routers/routerJson.js");

// Middleware to parse JSON
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
fs.mkdir(dataDir, { recursive: true }).catch(err => {
  console.error('Failed to create data directory:', err);
  process.exit(1);
});

// Use data router for all /data routes
app.use('/data', dataRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});