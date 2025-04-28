// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  sport:        { type: String, required: true },
  img_name:     { type: String, required: true },
  teamA:        { type: String, required: true },
  teamB:        { type: String, required: true },
  date:         { type: Date,   required: true },
  location:     { type: String, required: true },
  score:        { type: String, required: true },
  game_summary:{ type: String, required: true },
  play_by_play:{ type: String, required: true },
  match_stats: { type: Map, of: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
