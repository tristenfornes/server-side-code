const express = require('express');
const path = require('path');
const app = express();

// Use the port provided by Render (or default to 3001)
const PORT = process.env.PORT || 3001;

// JSON data array (add all your game objects here)
const games = [
  {
    "_id": 1,
    "img_name": "giants_cowboys.jpeg",
    "teamA": "Giants",
    "teamB": "Cowboys",
    "date": "2025-09-15",
    "location": "MetLife Stadium",
    "score": "21-17",
    "game_summary": "In a tightly contested NFL matchup, the Giants edged out the Cowboys in the final minutes.",
    "play_by_play": "Giants Fumble\n3 plays, -2 yards, 0:50\nCOW 0 - GI 0\nCowboys Punt\n3 plays, -12 yards, 1:20\nCOW 0 - GI 0\nGiants Pass Completion\n3 plays, +8 yards, 1:55\nCOW 0 - GI 0\nCowboys Run Play\n3 plays, +10 yards, 1:30\nCOW 0 - GI 0\nGiants Field Goal\n6 plays, 32 yards, 2:10\nCOW 0 - GI 3\nEND QUARTER 2\nCowboys Drive (Punt)\n3 plays, -3 yards, 1:30\nCOW 0 - GI 3\nGiants Touchdown Drive\n11 plays, 70 yards, 5:27\nCOW 7 - GI 3\nCowboys Field Goal\n11 plays, 45 yards, 4:35\nCOW 7 - GI 6\nEND GAME",
    "match_stats": {
      "total_yards": "350-320",
      "turnovers": "1-2",
      "penalty_yards": "45-55",
      "time_of_possession": "30:15-29:45"
    }
  },
  {
    "_id": 2,
    "img_name": "lions.jpeg",
    "teamA": "Lions",
    "teamB": "Falcons",
    "date": "2025-10-05",
    "location": "Ford Field",
    "score": "24-21",
    "game_summary": "In a nail-biting NFL battle at Ford Field, the Lions managed a narrow victory over the Falcons.",
    "play_by_play": "Lions Opening Drive - Touchdown\n4 plays, 28 yards, 2:00\nLIO 7 - FAL 0\nFalcons Counter - Field Goal\n3 plays, 35 yards, 2:15\nLIO 7 - FAL 3\nLions Defensive Stop - Interception\n2 plays, 0 yards, 1:00\nLIO 7 - FAL 3\nFalcons Final Drive - Punt\n3 plays, -4 yards, 1:45\nLIO 7 - FAL 3\nLions Game-Winning Field Goal\n5 plays, 40 yards, 0:50\nLIO 10 - FAL 3\nEND GAME",
    "match_stats": {
      "total_yards": "310-305",
      "turnovers": "1-1",
      "penalty_yards": "40-50",
      "time_of_possession": "29:30-30:30"
    }
  },
  {
    "_id": 3,
    "img_name": "warriors.jpeg",
    "teamA": "Warriors",
    "teamB": "Lakers",
    "date": "2025-03-14",
    "location": "Chase Center",
    "score": "120-115",
    "game_summary": "In an electrifying NBA showdown, the Warriors narrowly defeated the Lakers in a high-scoring battle.",
    "play_by_play": "1st Quarter:\nWarriors surge ahead with quick three-pointers and fast-break dunks; lead 30-28.\n2nd Quarter:\nLakers close the gap with efficient ball movement; halftime score 62-60 Warriors.\n3rd Quarter:\nBoth teams exchange scoring runs in a high-octane period; Warriors up 90-87.\n4th Quarter:\nClutch shooting from downtown secures a dramatic finish; final score 120-115.\nEND GAME",
    "match_stats": {
      "FG%": "48%-45%",
      "rebounds": "42-38",
      "assists": "25-23",
      "turnovers": "12-15"
    }
  },
  {
    "_id": 4,
    "img_name": "sharks.png",
    "teamA": "Sharks",
    "teamB": "Predators",
    "date": "2025-03-15",
    "location": "SAP Center at San Jose",
    "score": "3-2 OT",
    "game_summary": "In a thrilling NHL overtime battle, the Sharks edged out the Predators in a game full of momentum swings.",
    "play_by_play": "1st Period:\nSharks capitalize on a power play to take a 1-0 lead.\n2nd Period:\nPredators tie the game at 1-1 with a penalty kill advantage.\n3rd Period:\nBoth teams struggle to break through; score remains tied.\nOvertime:\nA swift breakaway by the Sharks results in the winning goal; final score 3-2 OT.\nEND GAME",
    "match_stats": {
      "shots_on_goal": "35-32",
      "penalty_minutes": "8-10",
      "hits": "12-9",
      "power_play_percentage": "25%-20%"
    }
  },
  {
    "_id": 5,
    "img_name": "real_barca.jpeg",
    "teamA": "Real Madrid",
    "teamB": "Barcelona",
    "date": "2025-04-20",
    "location": "Santiago Bernabéu Stadium",
    "score": "2-2",
    "game_summary": "In one of the fiercest El Clásico matches, Real Madrid and Barcelona battled to a dramatic 2-2 draw.",
    "play_by_play": "[00:00] Kick-off.\n[12'] Real Madrid launches a counterattack and scores a goal.\n[28'] Barcelona responds with a precise set-piece equalizer.\n[45+2'] Half-time, score 1-1.\n[60'] Real Madrid strikes again from long range.\n[75'] Barcelona is awarded a penalty but misses the conversion.\n[90+3'] Barcelona levels with a header; final score 2-2.\nEND GAME",
    "match_stats": {
      "possession": "55%-45%",
      "shots_on_target": "6-5",
      "fouls": "14-12",
      "corners": "7-4"
    }
  },
  {
    "_id": 6,
    "img_name": "mancity_liverpool.jpeg",
    "teamA": "Manchester City",
    "teamB": "Liverpool",
    "date": "2025-05-02",
    "location": "Etihad Stadium",
    "score": "3-2",
    "game_summary": "A nail-biting Premier League clash saw Manchester City edge past Liverpool in a game filled with twists and tactical brilliance.",
    "play_by_play": "[00:00] Kick-off.\n[10'] City scores on a fast break from distance.\n[23'] Liverpool answers with a clinical finish to tie the game.\n[35'] A set-piece goal gives City the lead.\n[55'] Liverpool’s near-miss on a powerful shot hits the post.\n[75'] In stoppage time, City clinches the win with a decisive goal; final score 3-2.\nEND GAME",
    "match_stats": {
      "possession": "60%-40%",
      "shots_on_target": "10-8",
      "fouls": "12-15",
      "corner_kicks": "6-5"
    }
  },
  {
    "_id": 7,
    "img_name": "raptors_celtics.jpeg",
    "teamA": "Toronto Raptors",
    "teamB": "Boston Celtics",
    "date": "2025-03-22",
    "location": "Scotiabank Arena",
    "score": "110-105",
    "game_summary": "In a thrilling NBA contest, the Toronto Raptors edged out the Boston Celtics in a fast-paced, high-scoring battle.",
    "play_by_play": "1st Quarter:\nRaptors build a slim lead with sharp perimeter shooting; score 28-26.\n2nd Quarter:\nCeltics tighten their defense; halftime score 55-53 in favor of the Raptors.\n3rd Quarter:\nHigh-scoring run as both teams trade buckets; Raptors lead 85-80.\n4th Quarter:\nA late rally by the Celtics is thwarted by clutch plays; final score 110-105.\nEND GAME",
    "match_stats": {
      "FG%": "47%-44%",
      "rebounds": "38-36",
      "assists": "24-21",
      "turnovers": "11-13"
    }
  },
  {
    "_id": 8,
    "img_name": "giants_dodgers.jpeg",
    "teamA": "Dodgers",
    "teamB": "Giants",
    "date": "2025-06-10",
    "location": "Dodger Stadium",
    "score": "5-3",
    "game_summary": "In a classic MLB rivalry game, the Dodgers triumphed over the Giants in a pitcher's duel.",
    "play_by_play": "Top 1st:\nDodgers score a run on a base hit.\nBottom 1st:\nGiants respond with a single, tying the inning.\nTop 4th:\nDodgers add two runs with consecutive hits, taking a 3-1 lead.\nBottom 5th:\nGiants score one run to narrow the margin.\nTop 9th:\nDodgers load the bases and score the go-ahead run.\nBottom 9th:\nGiants fail to rally; final score 5-3.\nEND GAME",
    "match_stats": {
      "innings": "9",
      "strikeouts": "12-10",
      "earned_run_average": "2.85-3.20",
      "hits": "8-9"
    }
  },
  {
    "_id": 9,
    "img_name": "eagles.jpeg",
    "teamA": "Eagles",
    "teamB": "Chiefs",
    "date": "2025-03-20",
    "location": "Lincoln Financial Field",
    "score": "28-31",
    "game_summary": "In a high-stakes NFL showdown, the Eagles narrowly fell to the Chiefs in a game marked by explosive plays and last-minute heroics.",
    "play_by_play": "Eagles Kickoff: Touchback.\n1st Quarter:\nA long touchdown pass propels the Eagles to a 7-0 lead.\n2nd Quarter:\nChiefs answer with a field goal, tying the score at 7-7.\n3rd Quarter:\nA critical turnover leads to a Chiefs touchdown, extending their lead to 14-7.\n4th Quarter:\nA late drive culminates in a game-sealing field goal; final score 31-28.\nEND GAME",
    "match_stats": {
      "total_yards": "380-405",
      "turnovers": "1-2",
      "penalty_yards": "50-65",
      "time_of_possession": "30:00-30:00"
    }
  }
];

// Serve static files from the 'public' folder (index.html, CSS, etc.)
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