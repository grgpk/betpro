const fs = require('fs');

const sports = ['football', 'basketball', 'tennis', 'volleyball'];
const statuses = ['upcoming', 'live', 'finished'];

const footballTeams = [
  'Manchester United',
  'Liverpool',
  'Chelsea',
  'Arsenal',
  'Bayern Munich',
  'PSG',
  'Juventus',
  'AC Milan',
  'Inter Milan',
  'Atletico Madrid',
  'Manchester City',
  'Tottenham',
  'Borussia Dortmund',
  'Ajax',
  'Barcelona',
];

const basketballTeams = [
  'Lakers',
  'Celtics',
  'Warriors',
  'Heat',
  'Bulls',
  'Knicks',
  'Nets',
  'Clippers',
  'Mavericks',
  'Suns',
  'Bucks',
  'Raptors',
  '76ers',
  'Rockets',
  'Spurs',
];

const tennisPlayers = [
  'Djokovic',
  'Nadal',
  'Federer',
  'Alcaraz',
  'Medvedev',
  'Zverev',
  'Tsitsipas',
  'Rublev',
  'Ruud',
  'Fritz',
  'Sinner',
  'Rune',
  'Norrie',
  'Hurkacz',
  'Murray',
];

const volleyballTeams = [
  'Brazil',
  'Poland',
  'USA',
  'Italy',
  'Russia',
  'France',
  'Serbia',
  'Argentina',
  'Japan',
  'Canada',
  'China',
  'Germany',
  'Netherlands',
  'Turkey',
  'Iran',
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomTeams(sport) {
  let teamPool;
  switch (sport) {
    case 'football':
      teamPool = footballTeams;
      break;
    case 'basketball':
      teamPool = basketballTeams;
      break;
    case 'tennis':
      teamPool = tennisPlayers;
      break;
    case 'volleyball':
      teamPool = volleyballTeams;
      break;
  }

  const home = getRandomElement(teamPool);
  let away = getRandomElement(teamPool);
  while (away === home) {
    away = getRandomElement(teamPool);
  }

  return { home, away };
}

function generateRandomDate() {
  const start = new Date('2025-10-01');
  const end = new Date('2025-12-31');
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomOdds(sport) {
  const homeOdds = (1.5 + Math.random() * 3).toFixed(2);
  const awayOdds = (1.5 + Math.random() * 3).toFixed(2);
  const odds = {
    home: parseFloat(homeOdds),
    away: parseFloat(awayOdds),
  };

  if (sport === 'football' || sport === 'volleyball') {
    odds.draw = parseFloat((2.5 + Math.random() * 1.5).toFixed(2));
  }

  return odds;
}

function generateEvent(id) {
  const sport = getRandomElement(sports);
  const status = getRandomElement(statuses);
  const teams = getRandomTeams(sport);
  const startTime = generateRandomDate();

  const titles = {
    football: [
      'Premier League Match',
      'Champions League',
      'FA Cup',
      'League Cup',
      'International Friendly',
    ],
    basketball: ['NBA Game', 'Playoff Match', 'Finals Game', 'Regular Season', 'All-Star Game'],
    tennis: ['Grand Slam Match', 'ATP Tour', 'Masters 1000', 'Finals', 'Championship Match'],
    volleyball: [
      'World Championship',
      'Olympic Qualifier',
      'Nations League',
      'Continental Cup',
      'Friendly Match',
    ],
  };

  const descriptions = {
    football: [
      'Exciting football match',
      'Top teams clash',
      'Derby match',
      'Title decider',
      'Relegation battle',
    ],
    basketball: [
      'High-scoring game expected',
      'Playoff intensity',
      'Championship on the line',
      'Rivalry renewed',
      'Season opener',
    ],
    tennis: [
      'Court battle',
      'Grand slam showdown',
      'Ranking points at stake',
      'Historic rivalry',
      'Surface specialists meet',
    ],
    volleyball: [
      'International competition',
      'Olympic qualification match',
      'Continental championship',
      'Friendly tournament',
      'Nations compete',
    ],
  };

  return {
    id: `gen-${id}`,
    title: `${getRandomElement(titles[sport])} - ${teams.home} vs ${teams.away}`,
    description: getRandomElement(descriptions[sport]),
    sport,
    homeTeam: teams.home,
    awayTeam: teams.away,
    startTime: startTime.toISOString(),
    status,
    odds: generateRandomOdds(sport),
    isLive: status === 'live',
  };
}

// Read existing db.json
const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find the highest numeric ID to avoid conflicts
let maxId = 0;
db.events.forEach((event) => {
  const numericId = parseInt(event.id.replace(/\D/g, '')) || 0;
  if (numericId > maxId) {
    maxId = numericId;
  }
});

// Generate 50 new events starting from maxId + 1
const newEvents = [];
for (let i = 1; i <= 50; i++) {
  newEvents.push(generateEvent(maxId + i));
}

// Add to existing events
db.events = [...db.events, ...newEvents];

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`✅ Added 50 new events to db.json`);
console.log(`📊 Total events: ${db.events.length}`);
console.log(`🔢 New IDs range: gen-${maxId + 1} to gen-${maxId + 50}`);
