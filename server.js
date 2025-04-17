// server.js
const express = require('express');
const path = require('path');
const Joi = require('joi');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
let games = require(path.join(__dirname, 'data', 'games.json'));

// Schema for creating a new game (sport required)
const createGameSchema = Joi.object({
  sport: Joi.string().required(),
  img_name: Joi.string().required(),
  teamA: Joi.string().required(),
  teamB: Joi.string().required(),
  date: Joi.string().required(),
  location: Joi.string().required(),
  score: Joi.string().required(),
  game_summary: Joi.string().required(),
  play_by_play: Joi.string().required(),
  match_stats: Joi.object().required()
});

// Schema for updating an existing game (sport optional)
const updateGameSchema = Joi.object({
  sport: Joi.string().optional(),
  img_name: Joi.string().required(),
  teamA: Joi.string().required(),
  teamB: Joi.string().required(),
  date: Joi.string().required(),
  location: Joi.string().required(),
  score: Joi.string().required(),
  game_summary: Joi.string().required(),
  play_by_play: Joi.string().required(),
  match_stats: Joi.object().required()
});

// Serve static and images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// GET all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// GET single game
app.get('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const game = games.find(g => g._id === id);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

// POST new game
app.post('/api/games', (req, res) => {
  const { error, value } = createGameSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newId = games.length ? Math.max(...games.map(g => g._id)) + 1 : 1;
  const newGame = { _id: newId, ...value };
  games.push(newGame);
  res.status(201).json({ message: 'Game added', game: newGame });
});

// PUT update existing game
app.put('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = games.findIndex(g => g._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Game not found' });

  const { error, value } = updateGameSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Merge existing _id and sport if none provided
  const existing = games[idx];
  const updated = {
    _id: id,
    sport: value.sport || existing.sport,
    ...value
  };

  games[idx] = updated;
  res.json({ message: 'Game updated', game: updated });
});

// DELETE a game
app.delete('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = games.findIndex(g => g._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Game not found' });

  games.splice(idx, 1);
  res.json({ message: 'Game deleted' });
});

// Fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
