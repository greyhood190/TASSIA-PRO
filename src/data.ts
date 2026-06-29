import {
  Tournament,
  TournamentStatus,
  FixtureType,
  Team,
  Player,
  PlayerStatus,
  Match,
  MatchStatus,
  MatchEventType,
  News,
  Poll,
  Sponsor,
  MediaItem,
  AppNotification
} from './types';

// Real Nairobi Eastlands Grassroots Clubs
export const initialSponsors: Sponsor[] = [
  { id: 'sp1', name: 'Safaricom', logo: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=100&auto=format&fit=crop&q=60', tier: 'platinum' },
  { id: 'sp2', name: 'SportPesa', logo: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=100&auto=format&fit=crop&q=60', tier: 'platinum' },
  { id: 'sp3', name: 'Coca-Cola East Africa', logo: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=100&auto=format&fit=crop&q=60', tier: 'gold' },
  { id: 'sp4', name: 'Equity Bank', logo: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=100&auto=format&fit=crop&q=60', tier: 'gold' },
  { id: 'sp5', name: 'Tassia Bakery', logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60', tier: 'silver' }
];

export const initialTournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Tassia Community Cup 2026',
    season: 'Season 4',
    location: 'Tassia Sports Ground, Embakasi',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    registrationDeadline: '2026-06-30',
    logo: '🏆',
    description: 'The biggest annual grassroots football tournament in Eastlands, bringing together local talent to promote unity and combat crime through sports.',
    status: TournamentStatus.ONGOING,
    fixtureType: FixtureType.LEAGUE,
    teamsCount: 8
  },
  {
    id: 't2',
    name: 'Eastlands Junior Championship',
    season: 'U17 Division',
    location: 'Donholm Primary Pitch',
    startDate: '2026-09-10',
    endDate: '2026-10-15',
    registrationDeadline: '2026-09-05',
    logo: '⚽',
    description: 'Nurturing the next generation of football stars. Strictly for players under 17 years.',
    status: TournamentStatus.UPCOMING,
    fixtureType: FixtureType.KNOCKOUT,
    teamsCount: 8
  }
];

export const initialTeams: Team[] = [
  {
    id: 'tm1',
    name: 'Tassia FC (The Hurricanes)',
    coach: 'Coach Patrick Mwangi',
    logo: '🦅',
    contactInfo: 'tassiafc@gmail.com | +254 712 345678',
    statistics: { wins: 4, losses: 1, draws: 1, goalsFor: 12, goalsAgainst: 5, points: 13 },
    playersCount: 5
  },
  {
    id: 'tm2',
    name: 'Embakasi Youth FC',
    coach: 'Coach James Omondi',
    logo: '🦁',
    contactInfo: 'embayouth@gmail.com | +254 722 987654',
    statistics: { wins: 3, losses: 1, draws: 2, goalsFor: 10, goalsAgainst: 6, points: 11 },
    playersCount: 5
  },
  {
    id: 'tm3',
    name: 'Pipeline Rangers',
    coach: 'Coach Kennedy Otieno',
    logo: '🐆',
    contactInfo: 'pipeline.rangers@outlook.com',
    statistics: { wins: 2, losses: 2, draws: 2, goalsFor: 8, goalsAgainst: 9, points: 8 },
    playersCount: 5
  },
  {
    id: 'tm4',
    name: 'Kware United',
    coach: 'Coach Samuel Waweru',
    logo: '🔥',
    contactInfo: 'kwareutd@gmail.com',
    statistics: { wins: 1, losses: 3, draws: 2, goalsFor: 6, goalsAgainst: 11, points: 5 },
    playersCount: 5
  },
  {
    id: 'tm5',
    name: 'Fedha Soccer Academy',
    coach: 'Coach David Kiprop',
    logo: '⭐',
    contactInfo: 'fedhasoccer@yahoo.com',
    statistics: { wins: 3, losses: 2, draws: 1, goalsFor: 9, goalsAgainst: 7, points: 10 },
    playersCount: 5
  },
  {
    id: 'tm6',
    name: 'Donholm All-Stars',
    coach: 'Coach Eric Ndwiga',
    logo: '⚡',
    contactInfo: 'donholmallstars@gmail.com',
    statistics: { wins: 2, losses: 3, draws: 1, goalsFor: 7, goalsAgainst: 9, points: 7 },
    playersCount: 5
  },
  {
    id: 'tm7',
    name: 'Nyayo Estate FC',
    coach: 'Coach Benjamin Mulwa',
    logo: '🏰',
    contactInfo: 'nyayoestatefc@gmail.com',
    statistics: { wins: 1, losses: 4, draws: 1, goalsFor: 5, goalsAgainst: 12, points: 4 },
    playersCount: 5
  },
  {
    id: 'tm8',
    name: 'Avenue Park Rangers',
    coach: 'Coach Peter Kamau',
    logo: '🛡️',
    contactInfo: 'avenueparkrangers@gmail.com',
    statistics: { wins: 1, losses: 4, draws: 1, goalsFor: 4, goalsAgainst: 11, points: 4 },
    playersCount: 5
  }
];

export const initialPlayers: Player[] = [
  // Team 1: Tassia FC
  {
    id: 'pl1',
    name: 'Brian "Okocha" Onyango',
    jerseyNumber: 10,
    position: 'Midfielder',
    age: 22,
    nationality: 'Kenya',
    height: '178 cm',
    weight: '72 kg',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 5, assists: 4, yellowCards: 1, redCards: 0, appearances: 6, minutesPlayed: 540, cleanSheets: 0 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm1'
  },
  {
    id: 'pl2',
    name: 'Kevin Wafula',
    jerseyNumber: 1,
    position: 'Goalkeeper',
    age: 24,
    nationality: 'Kenya',
    height: '188 cm',
    weight: '81 kg',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, appearances: 6, minutesPlayed: 540, cleanSheets: 3 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm1'
  },
  {
    id: 'pl3',
    name: 'Victor Wanyama Jr.',
    jerseyNumber: 6,
    position: 'Defender',
    age: 23,
    nationality: 'Kenya',
    height: '184 cm',
    weight: '78 kg',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 1, assists: 1, yellowCards: 2, redCards: 0, appearances: 5, minutesPlayed: 450, cleanSheets: 3 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm1'
  },
  {
    id: 'pl4',
    name: 'Dennis Oliech II',
    jerseyNumber: 9,
    position: 'Forward',
    age: 21,
    nationality: 'Kenya',
    height: '180 cm',
    weight: '75 kg',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 4, assists: 2, yellowCards: 1, redCards: 0, appearances: 6, minutesPlayed: 510, cleanSheets: 0 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm1'
  },
  {
    id: 'pl5',
    name: 'John Kamau',
    jerseyNumber: 4,
    position: 'Defender',
    age: 25,
    nationality: 'Kenya',
    height: '182 cm',
    weight: '79 kg',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 0, assists: 0, yellowCards: 3, redCards: 1, appearances: 4, minutesPlayed: 320, cleanSheets: 2 },
    status: PlayerStatus.SUSPENDED,
    teamId: 'tm1'
  },

  // Team 2: Embakasi Youth FC
  {
    id: 'pl6',
    name: 'Michael "Miki" Olunga Jr',
    jerseyNumber: 11,
    position: 'Forward',
    age: 20,
    nationality: 'Kenya',
    height: '190 cm',
    weight: '82 kg',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 6, assists: 1, yellowCards: 0, redCards: 0, appearances: 6, minutesPlayed: 520, cleanSheets: 0 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm2'
  },
  {
    id: 'pl7',
    name: 'Ayub Timbe Jr.',
    jerseyNumber: 7,
    position: 'Midfielder',
    age: 22,
    nationality: 'Kenya',
    height: '172 cm',
    weight: '68 kg',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 2, assists: 3, yellowCards: 1, redCards: 0, appearances: 6, minutesPlayed: 480, cleanSheets: 0 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm2'
  },
  {
    id: 'pl8',
    name: 'Arnold Origi Jr.',
    jerseyNumber: 18,
    position: 'Goalkeeper',
    age: 23,
    nationality: 'Kenya',
    height: '186 cm',
    weight: '83 kg',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, appearances: 6, minutesPlayed: 540, cleanSheets: 2 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm2'
  },

  // Team 3: Pipeline Rangers
  {
    id: 'pl9',
    name: 'Collins Injera Jr.',
    jerseyNumber: 14,
    position: 'Forward',
    age: 24,
    nationality: 'Kenya',
    height: '181 cm',
    weight: '76 kg',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 3, assists: 1, yellowCards: 1, redCards: 0, appearances: 6, minutesPlayed: 500, cleanSheets: 0 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm3'
  },
  {
    id: 'pl10',
    name: 'Haron Shakava',
    jerseyNumber: 5,
    position: 'Defender',
    age: 26,
    nationality: 'Kenya',
    height: '185 cm',
    weight: '80 kg',
    photo: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80',
    statistics: { goals: 1, assists: 0, yellowCards: 2, redCards: 0, appearances: 6, minutesPlayed: 540, cleanSheets: 1 },
    status: PlayerStatus.ACTIVE,
    teamId: 'tm3'
  }
];

export const initialMatches: Match[] = [
  {
    id: 'm1',
    tournamentId: 't1',
    homeTeamId: 'tm1',
    awayTeamId: 'tm2',
    homeScore: 2,
    awayScore: 1,
    date: '2026-06-25',
    time: '15:00',
    location: 'Tassia Sports Ground, Pitch A',
    status: MatchStatus.COMPLETED,
    refereeId: 'ref1',
    events: [
      { id: 'ev1', time: 14, type: MatchEventType.GOAL, detail: 'Goal scored by Michael Olunga Jr. - Assisted by Ayub Timbe', teamId: 'tm2', playerId: 'pl6' },
      { id: 'ev2', time: 35, type: MatchEventType.CARD, detail: 'Yellow Card: Victor Wanyama Jr.', teamId: 'tm1', playerId: 'pl3', cardColor: 'yellow' },
      { id: 'ev3', time: 42, type: MatchEventType.GOAL, detail: 'Goal scored by Brian Onyango', teamId: 'tm1', playerId: 'pl1' },
      { id: 'ev4', time: 78, type: MatchEventType.GOAL, detail: 'Goal scored by Dennis Oliech II - Pen.', teamId: 'tm1', playerId: 'pl4' }
    ],
    statistics: {
      home: { possession: 52, shots: 12, corners: 5, fouls: 8 },
      away: { possession: 48, shots: 9, corners: 4, fouls: 11 }
    }
  },
  {
    id: 'm2',
    tournamentId: 't1',
    homeTeamId: 'tm3',
    awayTeamId: 'tm4',
    homeScore: 1,
    awayScore: 1,
    date: '2026-06-26',
    time: '16:30',
    location: 'Tassia Sports Ground, Pitch B',
    status: MatchStatus.COMPLETED,
    refereeId: 'ref1',
    events: [
      { id: 'ev5', time: 10, type: MatchEventType.GOAL, detail: 'Goal scored by Collins Injera Jr.', teamId: 'tm3', playerId: 'pl9' },
      { id: 'ev6', time: 88, type: MatchEventType.GOAL, detail: 'Goal scored by Kware Equalizer', teamId: 'tm4' }
    ],
    statistics: {
      home: { possession: 45, shots: 8, corners: 3, fouls: 14 },
      away: { possession: 55, shots: 11, corners: 6, fouls: 9 }
    }
  },
  {
    id: 'm3',
    tournamentId: 't1',
    homeTeamId: 'tm1',
    awayTeamId: 'tm3',
    homeScore: 1,
    awayScore: 1,
    date: '2026-06-28',
    time: '14:00', // Matches today's date in local time metadata: June 28, 2026
    location: 'Tassia Sports Ground, Pitch A',
    status: MatchStatus.LIVE,
    refereeId: 'ref1',
    liveTimer: 67,
    events: [
      { id: 'ev7', time: 12, type: MatchEventType.GOAL, detail: 'Goal scored by Dennis Oliech II - Tap-in from close range', teamId: 'tm1', playerId: 'pl4' },
      { id: 'ev8', time: 44, type: MatchEventType.CARD, detail: 'Yellow Card: John Kamau', teamId: 'tm1', playerId: 'pl5', cardColor: 'yellow' },
      { id: 'ev9', time: 58, type: MatchEventType.GOAL, detail: 'Goal scored by Collins Injera Jr. - Screamer from outside the box', teamId: 'tm3', playerId: 'pl9' }
    ],
    statistics: {
      home: { possession: 58, shots: 9, corners: 4, fouls: 5 },
      away: { possession: 42, shots: 6, corners: 2, fouls: 8 }
    }
  },
  {
    id: 'm4',
    tournamentId: 't1',
    homeTeamId: 'tm2',
    awayTeamId: 'tm5',
    homeScore: 0,
    awayScore: 0,
    date: '2026-06-29',
    time: '15:30',
    location: 'Tassia Sports Ground, Pitch A',
    status: MatchStatus.SCHEDULED,
    refereeId: 'ref1',
    events: [],
    statistics: {
      home: { possession: 0, shots: 0, corners: 0, fouls: 0 },
      away: { possession: 0, shots: 0, corners: 0, fouls: 0 }
    }
  }
];

export const initialNews: News[] = [
  {
    id: 'n1',
    title: 'Hurricanes Dominate Embakasi Youth in Thrilling Opener',
    excerpt: 'Dennis Oliech II seals victory with a cold-blooded penalty in the 78th minute before a record community crowd.',
    content: 'The Tassia Community Cup 2026 got underway with a spectacular clash between Tassia FC (The Hurricanes) and Embakasi Youth. Over 3,000 spectators packed the Tassia Sports Ground, creating an electric atmosphere. Michael Olunga Jr. opened the scoring for Embakasi Youth, but Tassia fought back heroically with Brian Onyango equalizing and Dennis Oliech II netting the winning penalty. "This tournament brings out the best in Eastlands," said local organizer Patrick Mwangi.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    category: 'Match Review',
    createdAt: '2026-06-25T18:00:00Z',
    authorName: 'Pat Mwangi',
    likesCount: 145,
    commentsCount: 3,
    comments: [
      { id: 'c1', userId: 'usr_fan1', userName: 'Kevo Ombassa', content: 'What a game! Best penalty I have seen in grassroots level.', createdAt: '2026-06-25T18:30:00Z' },
      { id: 'c2', userId: 'usr_fan2', userName: 'Mercy Aoko', content: 'Hurricanes are taking the cup this year for sure!', createdAt: '2026-06-25T19:00:00Z' },
      { id: 'c3', userId: 'usr_fan3', userName: 'Coach James', content: 'We played well but tactical errors cost us. Congrats to Tassia.', createdAt: '2026-06-25T19:15:00Z' }
    ],
    likedBy: []
  },
  {
    id: 'n2',
    title: 'Registration Deadline Extended for Junior Championship',
    excerpt: 'Organizers announce extension to accommodate 4 additional grassroots teams looking to join the junior league.',
    content: 'Due to overwhelming demand from local academy coaches, the Eastlands Junior Championship organizing committee has extended the registration deadline to September 5th, 2026. This U17 tournament aims to provide a safe and competitive space for teenagers in Embakasi, Donholm, and surrounding areas. Scout teams from Kenyan Premier League clubs will be present.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80',
    category: 'Announcement',
    createdAt: '2026-06-27T10:00:00Z',
    authorName: 'Admin Desk',
    likesCount: 42,
    commentsCount: 1,
    comments: [
      { id: 'c4', userId: 'usr_fan4', userName: 'John Mulwa', content: 'Great initiative! This keeps the kids away from social vices during holidays.', createdAt: '2026-06-27T11:20:00Z' }
    ],
    likedBy: []
  }
];

export const initialPolls: Poll[] = [
  {
    id: 'p1',
    question: 'Who will win the Tassia Community Cup 2026?',
    options: [
      { id: 'op1', text: 'Tassia FC (The Hurricanes)', votes: 84 },
      { id: 'op2', text: 'Embakasi Youth FC', votes: 62 },
      { id: 'op3', text: 'Pipeline Rangers', votes: 23 },
      { id: 'op4', text: 'Fedha Soccer Academy', votes: 41 }
    ],
    userVotes: {},
    category: 'Tournament Prediction',
    status: 'active'
  },
  {
    id: 'p2',
    question: 'Who was the Man of the Match in Hurricanes vs Embakasi Youth?',
    options: [
      { id: 'op5', text: 'Brian Onyango (Tassia FC)', votes: 98 },
      { id: 'op6', text: 'Dennis Oliech II (Tassia FC)', votes: 71 },
      { id: 'op7', text: 'Michael Olunga Jr (Embakasi Youth)', votes: 122 }
    ],
    userVotes: {},
    category: 'Man of the Match',
    status: 'active'
  }
];

export const initialMedia: MediaItem[] = [
  { id: 'm1', type: 'photo', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80', title: 'Tassia Community Ground Fan Crowds', downloads: 128 },
  { id: 'm2', type: 'photo', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80', title: 'Hurricanes Warm up session', downloads: 95 },
  { id: 'm3', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400&auto=format&fit=crop&q=80', title: 'Hurricanes vs Embakasi Match Highlights', downloads: 350 }
];

export const initialNotifications: AppNotification[] = [
  { id: 'nt1', title: 'Match Starting Soon', content: 'The live match between Hurricanes and Pipeline is starting at 14:00 today!', type: 'fixture', createdAt: '2026-06-28T13:30:00Z', read: false },
  { id: 'nt2', title: 'Goal scored!', content: 'Dennis Oliech II scored for Hurricanes in the 12th minute.', type: 'goal', createdAt: '2026-06-28T14:12:00Z', read: false },
  { id: 'nt3', title: 'Registration Deadline', content: 'Tassia Community Cup registration closes in 2 days.', type: 'announcement', createdAt: '2026-06-28T09:00:00Z', read: true }
];

const LOCAL_STORAGE_KEY = 'tassia_portal_db_v1';

export interface DatabaseState {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  news: News[];
  polls: Poll[];
  notifications: AppNotification[];
  sponsors: Sponsor[];
  media: MediaItem[];
}

export function getDatabase(): DatabaseState {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse database state from local storage', e);
    }
  }

  // Initial State if nothing in local storage
  const state: DatabaseState = {
    tournaments: initialTournaments,
    teams: initialTeams,
    players: initialPlayers,
    matches: initialMatches,
    news: initialNews,
    polls: initialPolls,
    notifications: initialNotifications,
    sponsors: initialSponsors,
    media: initialMedia,
  };
  saveDatabase(state);
  return state;
}

export function saveDatabase(state: DatabaseState): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}
