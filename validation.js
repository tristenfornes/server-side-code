// validation.js
const Joi = require('joi');

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

module.exports = { createGameSchema, updateGameSchema };
