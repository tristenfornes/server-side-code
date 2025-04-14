const express = require('express');
const path = require('path');
const Joi = require('joi'); // Import Joi for validation
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS if needed (if your client is on another domain)
const cors = require('cors');
app.use(cors());

// Use the port provided by the environment or default to 3001
const PORT = process.env.PORT || 3001;

let games = require(path.join(__dirname, 'data', 'games.json'));

// Schema for validating a new game object
const gameSchema = Joi.object({
  img_name: Joi.string().required(),
  teamA: Joi.string().required(),
  teamB: Joi.string().required(),
  date: Joi.string().required(),         // You could use Joi.date() if you prefer
  location: Joi.string().required(),
  score: Joi.string().required(),
  game_summary: Joi.string().required(),
  play_by_play: Joi.string().required(),
  match_stats: Joi.object().required()
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// GET endpoint: return all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// GET endpoint: return a single game by id
app.get('/api/games/:id', (req, res) => {
  const gameId = Number(req.params.id);
  const game = games.find(g => g._id === gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

// POST endpoint: add a new game
app.post('/api/games', (req, res) => {
  const { error, value } = gameSchema.validate(req.body);
  if (error) {
    // If validation fails, return error details
    return res.status(400).json({ error: error.details[0].message });
  }

  // Generate a new _id (for simplicity, use max id + 1)
  const newId = games.length > 0 ? Math.max(...games.map(g => g._id)) + 1 : 1;
  const newGame = { _id: newId, ...value };
  
  // Add the new game to the array (in memory)
  games.push(newGame);

  // Return the newly added game with success status
  res.status(201).json({ message: 'Game added successfully', game: newGame });
});

// Serve the index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
