// server.js
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');
const cors     = require('cors');
const multer   = require('multer');
const Joi      = require('joi');

const app = express();
app.use(cors());
app.use(express.json());

//–– MongoDB Connection ––
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

//–– Multer (image uploads) ––
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, 'images')),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

//–– Mongoose Model ––
const gameSchema = new mongoose.Schema({
  sport:         { type: String, required: true },
  img_name:      { type: String, required: true },
  teamA:         { type: String, required: true },
  teamB:         { type: String, required: true },
  date:          { type: Date,   required: true },
  location:      { type: String, required: true },
  score:         { type: String, required: true },
  game_summary:  { type: String, required: true },
  play_by_play:  { type: String, required: true },
  match_stats:   { type: Map, of: String, required: true }
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

//–– Joi Validation ––
const createGameSchema = Joi.object({
  sport:        Joi.string().required(),
  teamA:        Joi.string().required(),
  teamB:        Joi.string().required(),
  date:         Joi.date().required(),
  location:     Joi.string().required(),
  score:        Joi.string().required(),
  game_summary:Joi.string().required(),
  play_by_play:Joi.string().required(),
  match_stats:  Joi.object().pattern(/.*/, Joi.string()).required()
});

const updateGameSchema = Joi.object({
  sport:        Joi.string().optional(),
  teamA:        Joi.string().required(),
  teamB:        Joi.string().required(),
  date:         Joi.date().required(),
  location:     Joi.string().required(),
  score:        Joi.string().required(),
  game_summary:Joi.string().required(),
  play_by_play:Joi.string().required(),
  match_stats:  Joi.object().pattern(/.*/, Joi.string()).required()
});

//–– Static File Serving ––
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

//–– API Routes ––

// GET all games
app.get('/api/games', async (req, res) => {
  const games = await Game.find().sort('-date');
  res.json(games);
});

// GET one game
app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// POST new game (with image)
app.post(
  '/api/games',
  upload.single('image'),
  async (req, res) => {
    const payload = {
      ...req.body,
      img_name: req.file.filename,
      match_stats: JSON.parse(req.body.match_stats)
    };
    const { error, value } = createGameSchema.validate(payload);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const game = new Game(value);
    await game.save();
    res.status(201).json({ message: 'Game added', game });
  }
);

// PUT update game (optional new image)
app.put(
  '/api/games/:id',
  upload.single('image'),
  async (req, res) => {
    try {
      const stats = JSON.parse(req.body.match_stats);
      const payload = { ...req.body, match_stats: stats };
      if (req.file) payload.img_name = req.file.filename;

      const { error, value } = updateGameSchema.validate(payload);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const game = await Game.findByIdAndUpdate(req.params.id, value, { new: true });
      if (!game) return res.status(404).json({ error: 'Game not found' });

      res.json({ message: 'Game updated', game });
    } catch {
      res.status(400).json({ error: 'Invalid data or ID' });
    }
  }
);

// DELETE a game
app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json({ message: 'Game deleted' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

//–– Catch-all to serve your React app ––
// Changed from '*' to '/*' to avoid path-to-regexp error
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//–– Start server ––
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
