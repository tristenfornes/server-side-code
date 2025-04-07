const express = require('express');
const cors = require('cors');         // Import the cors package
const path = require('path');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Use the port provided by the environment (e.g., Render) or default to 3001
const PORT = process.env.PORT || 3001;

// Load games data from a JSON file located in the "data" folder
const games = require(path.join(__dirname, 'data', 'games.json'));

// Serve static files from the 'public' folder (for index.html, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// API endpoint to get all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// API endpoint to get a single game by id
app.get('/api/games/:id', (req, res) => {
  const gameId = Number(req.params.id);
  const game = games.find(g => g._id === gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

// Serve the index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
