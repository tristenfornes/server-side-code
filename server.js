const express = require('express');
const path = require('path');
const Joi = require('joi');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
let games = require(path.join(__dirname, 'data', 'games.json'));

const gameSchema = Joi.object({
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

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const game = games.find(g => g._id === id);
  game
    ? res.json(game)
    : res.status(404).json({ error: 'Game not found' });
});

app.post('/api/games', (req, res) => {
  const { error, value } = gameSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newId = games.length > 0
    ? Math.max(...games.map(g => g._id)) + 1
    : 1;
  const newGame = { _id: newId, ...value };
  games.push(newGame);
  res.status(201).json({ message: 'Game added', game: newGame });
});

app.put('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const { error, value } = gameSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const idx = games.findIndex(g => g._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Game not found' });

  games[idx] = { _id: id, ...value };
  res.json({ message: 'Game updated', game: games[idx] });
});

app.delete('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = games.findIndex(g => g._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Game not found' });

  games.splice(idx, 1);
  res.json({ message: 'Game deleted' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
