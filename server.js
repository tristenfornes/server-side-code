const express = require('express');
const path = require('path');
const Joi = require('joi'); // For validation
const cors = require('cors'); // Enable cross-origin requests
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the port provided by the environment (e.g., Render) or default to 3001
const PORT = process.env.PORT || 3001;

// Load games data from a JSON file located in the "data" folder
let games = require(path.join(__dirname, 'data', 'games.json'));

// Joi schema for validating a game object, including the "sport" field
const gameSchema = Joi.object({
  sport: Joi.string().required(),
  img_name: Joi.string().required(),
  teamA: Joi.string().required(),
  teamB: Joi.string().required(),
  date: Joi.string().required(),         // Or Joi.date() if preferred
  location: Joi.string().required(),
  score: Joi.string().required(),
  game_summary: Joi.string().required(),
  play_by_play: Joi.string().required(),
  match_stats: Joi.object().required()
});

// Serve static files from the 'public' folder (for index.html, CSS, etc.)
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

// POST endpoint: add a new game after validating with Joi
app.post('/api/games', (req, res) => {
  const { error, value } = gameSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Generate a new _id (max existing _id + 1, or 1 if empty)
  const newId = games.length > 0 ? Math.max(...games.map(g => g._id)) + 1 : 1;
  const newGame = { _id: newId, ...value };

  // Add the new game to the array
  games.push(newGame);

  res.status(201).json({ message: 'Game added successfully', game: newGame });
});

// Serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
