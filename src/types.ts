export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ORGANIZER = 'organizer',
  REFEREE = 'referee',
  COACH = 'coach',
  PLAYER = 'player',
  FAN = 'fan',
}

export enum FixtureType {
  LEAGUE = 'league',
  KNOCKOUT = 'knockout',
  GROUP_STAGE = 'group_stage',
  ROUND_ROBIN = 'round_robin',
  HYBRID = 'hybrid',
}

export enum TournamentStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
}

export enum PlayerStatus {
  ACTIVE = 'active',
  INJURED = 'injured',
  SUSPENDED = 'suspended',
}

export enum MatchEventType {
  GOAL = 'goal',
  CARD = 'card',
  SUBSTITUTION = 'substitution',
  COMMENTARY = 'commentary',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  teamId?: string; // For Coach and Player
  isVerified: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  season: string;
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  logo: string;
  description: string;
  status: TournamentStatus;
  fixtureType: FixtureType;
  teamsCount: number;
}

export interface TeamStats {
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Team {
  id: string;
  name: string;
  coach: string;
  logo: string;
  contactInfo: string;
  statistics: TeamStats;
  playersCount: number;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
  minutesPlayed: number;
  cleanSheets: number;
}

export interface Player {
  id: string;
  photo: string;
  name: string;
  jerseyNumber: number;
  position: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  statistics: PlayerStats;
  status: PlayerStatus;
  teamId: string;
}

export interface MatchEvent {
  id: string;
  time: number; // minute of the match
  type: MatchEventType;
  detail: string; // e.g., "Goal by John Doe"
  teamId?: string;
  playerId?: string;
  cardColor?: 'yellow' | 'red';
}

export interface TeamMatchStats {
  possession: number; // percentage
  shots: number;
  corners: number;
  fouls: number;
}

export interface MatchStats {
  home: TeamMatchStats;
  away: TeamMatchStats;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  location: string;
  status: MatchStatus;
  refereeId?: string;
  events: MatchEvent[];
  statistics: MatchStats;
  liveTimer?: number; // active minute if LIVE
}

export interface Standing {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  likedBy: string[]; // User IDs who liked
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  userVotes: { [userId: string]: string }; // userId -> optionId
  category: string;
  status: 'active' | 'closed';
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  type: 'fixture' | 'goal' | 'announcement' | 'system';
  createdAt: string;
  read: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver';
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  title: string;
  thumbnail?: string;
  downloads: number;
}
