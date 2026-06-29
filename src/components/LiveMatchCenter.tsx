import React, { useState } from 'react';
import { Match, Team, Player, MatchEventType, UserRole, Poll, MatchEvent, MatchStatus } from '../types';
import { Calendar, Clock, MapPin, ShieldAlert, Award, MessageCircle, Send, Check, AlertTriangle, Plus, Play, Pause, Square } from 'lucide-react';

interface LiveMatchCenterProps {
  matches: Match[];
  teams: Team[];
  players: Player[];
  activeRole: UserRole;
  polls: Poll[];
  onVotePoll: (pollId: string, optionId: string) => void;
  onAddMatchComment: (matchId: string, author: string, content: string) => void;
  onUpdateMatchEvent: (matchId: string, event: Omit<MatchEvent, 'id'>) => void;
  onUpdateMatchStatus: (matchId: string, status: Match['status'], homeScore?: number, awayScore?: number) => void;
  onUpdateMatchTimer: (matchId: string, timerValue: number) => void;
}

export default function LiveMatchCenter({
  matches,
  teams,
  players,
  activeRole,
  polls,
  onVotePoll,
  onAddMatchComment,
  onUpdateMatchEvent,
  onUpdateMatchStatus,
  onUpdateMatchTimer,
}: LiveMatchCenterProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[2]?.id || matches[0]?.id || '');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'goals' | 'cards'>('all');
  const [pollVoted, setPollVoted] = useState<{ [pollId: string]: string }>({});

  // Referee input states
  const [refEventMinute, setRefEventMinute] = useState<number>(45);
  const [refEventType, setRefEventType] = useState<MatchEventType>(MatchEventType.GOAL);
  const [refEventPlayer, setRefEventPlayer] = useState<string>('');
  const [refEventTeam, setRefEventTeam] = useState<string>('');
  const [refEventDetail, setRefEventDetail] = useState<string>('');
  const [refCardColor, setRefCardColor] = useState<'yellow' | 'red'>('yellow');

  // Referee custom score states
  const [refHomeScore, setRefHomeScore] = useState<number>(0);
  const [refAwayScore, setRefAwayScore] = useState<number>(0);

  // Chat comments local state
  const [chatAuthor, setChatAuthor] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const match = matches.find((m) => m.id === selectedMatchId) || matches[0];
  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        No matches configured in the database.
      </div>
    );
  }

  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);

  // Filter players by match teams
  const homePlayers = players.filter((p) => p.teamId === match.homeTeamId);
  const awayPlayers = players.filter((p) => p.teamId === match.awayTeamId);
  const allMatchPlayers = [...homePlayers, ...awayPlayers];

  // Polls for this match or general
  const activePolls = polls.slice(0, 2);

  const handleVote = (pollId: string, optionId: string) => {
    onVotePoll(pollId, optionId);
    setPollVoted({ ...pollVoted, [pollId]: optionId });
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerObj = players.find((p) => p.id === refEventPlayer);
    const teamObj = teams.find((t) => t.id === refEventTeam);

    let finalDetail = refEventDetail.trim();
    if (!finalDetail) {
      if (refEventType === MatchEventType.GOAL) {
        finalDetail = `GOAL! ${playerObj ? playerObj.name : 'Unassigned Player'} scores for ${teamObj ? teamObj.name : 'team'}!`;
      } else if (refEventType === MatchEventType.CARD) {
        finalDetail = `${refCardColor === 'red' ? '🔴 RED CARD' : '🟨 YELLOW CARD'}: ${playerObj ? playerObj.name : 'Player'} (${teamObj ? teamObj.name : 'team'})`;
      } else if (refEventType === MatchEventType.SUBSTITUTION) {
        finalDetail = `🔄 Substitution: Player subbed off, replaced by ${playerObj ? playerObj.name : 'incoming player'}`;
      } else {
        finalDetail = `Commentary note: Match in progress.`;
      }
    }

    onUpdateMatchEvent(match.id, {
      time: Number(refEventMinute),
      type: refEventType,
      detail: finalDetail,
      teamId: refEventTeam || undefined,
      playerId: refEventPlayer || undefined,
      cardColor: refEventType === MatchEventType.CARD ? refCardColor : undefined,
    });

    // Reset fields
    setRefEventDetail('');
  };

  const incrementTimer = () => {
    const currentTimer = match.liveTimer || 0;
    if (currentTimer >= 90) return;
    onUpdateMatchTimer(match.id, currentTimer + 1);
  };

  const setCompleted = () => {
    if (window.confirm('Are you sure you want to end this match? Standing data and golden boot stats will calculate permanently.')) {
      onUpdateMatchStatus(match.id, MatchStatus.COMPLETED, match.homeScore, match.awayScore);
    }
  };

  const startLive = () => {
    onUpdateMatchStatus(match.id, MatchStatus.LIVE, 0, 0);
    onUpdateMatchTimer(match.id, 1);
  };

  const isRefereeRole = activeRole === UserRole.REFEREE || activeRole === UserRole.SUPER_ADMIN || activeRole === UserRole.ORGANIZER;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Selector Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Match Select</span>
          <span className="text-xs text-slate-500 font-medium">Pick any active, upcoming or historic fixture to view live.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matches.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMatchId(m.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                selectedMatchId === m.id
                  ? 'bg-emerald-400 text-indigo-950 border-emerald-400 shadow-md shadow-emerald-400/10'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {teams.find((t) => t.id === m.homeTeamId)?.logo} vs{' '}
              {teams.find((t) => t.id === m.awayTeamId)?.logo}{' '}
              <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                m.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
              }`}>
                {m.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scoreboard Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-850 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810d_1px,transparent_1px),linear-gradient(to_bottom,#10b9810d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Location & Referee Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-indigo-800 pb-4 text-xs text-indigo-200/75">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center gap-2 font-mono font-bold">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{match.date} @ {match.time}</span>
          </div>
        </div>

        {/* Match Timer */}
        <div className="my-6">
          {match.status === 'live' ? (
            <div className="inline-flex items-center gap-2 bg-emerald-450/15 border border-emerald-400/35 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest animate-pulse">
              <Clock className="w-3.5 h-3.5 text-emerald-450" />
              <span>LIVE - MINUTE {match.liveTimer}'</span>
            </div>
          ) : match.status === 'completed' ? (
            <span className="inline-block bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-black uppercase tracking-wider font-mono">
              FINAL SCORE
            </span>
          ) : (
            <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-300 text-xs font-black uppercase tracking-wider">
              UPCOMING GAME
            </span>
          )}
        </div>

        {/* Core Scores */}
        <div className="grid grid-cols-7 items-center justify-center my-6 gap-2">
          {/* Home Team */}
          <div className="col-span-3 text-right">
            <span className="text-3xl sm:text-5xl block">{homeTeam?.logo}</span>
            <span className="block font-display text-sm sm:text-xl font-black tracking-tight mt-2 text-white truncate">
              {homeTeam?.name}
            </span>
            <span className="block text-[11px] text-indigo-300/80 font-bold uppercase tracking-wider">Home</span>
          </div>

          {/* Scores */}
          <div className="col-span-1 flex flex-col justify-center items-center">
            {match.status === 'scheduled' ? (
              <span className="text-xl sm:text-2xl font-mono text-emerald-400 font-black tracking-widest">VS</span>
            ) : (
              <div className="bg-white/10 border border-white/20 px-6 py-2.5 rounded-2xl font-mono font-black text-3xl sm:text-5xl text-emerald-400 tracking-tight shadow-lg">
                {match.homeScore} - {match.awayScore}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-3 text-left">
            <span className="text-3xl sm:text-5xl block">{awayTeam?.logo}</span>
            <span className="block font-display text-sm sm:text-xl font-black tracking-tight mt-2 text-white truncate">
              {awayTeam?.name}
            </span>
            <span className="block text-[11px] text-indigo-300/80 font-bold uppercase tracking-wider">Away</span>
          </div>
        </div>
      </div>

      {/* REFEREE PANELS (SIMULATION ONLY) */}
      {isRefereeRole && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-sm bg-amber-500 text-black font-mono font-bold text-[10px]">ADMIN / REF</span>
            <h4 className="font-display font-bold text-gray-900 text-sm">Referee live timeline & score console</h4>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. Timer & Core Match Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs space-y-3.5">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Timer & Phase</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Current Minute: <strong>{match.liveTimer || 0}'</strong></span>
                {match.status === 'live' && (
                  <button
                    onClick={incrementTimer}
                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg cursor-pointer text-xs"
                  >
                    +1 Min
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {match.status === 'scheduled' && (
                  <button
                    onClick={startLive}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Match Live
                  </button>
                )}
                {match.status === 'live' && (
                  <>
                    <button
                      onClick={setCompleted}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5" /> Full-Time Whistle
                    </button>
                  </>
                )}
                {match.status === 'completed' && (
                  <div className="w-full text-center text-xs text-emerald-600 font-bold bg-emerald-50 py-2 border border-emerald-100 rounded-lg">
                    ✓ Match Completed. Standings Calculated.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Direct Score Changer */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs space-y-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Scores override</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Home Score</label>
                  <input
                    type="number"
                    min="0"
                    value={match.homeScore}
                    onChange={(e) => onUpdateMatchStatus(match.id, match.status, Number(e.target.value), match.awayScore)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-mono font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Away Score</label>
                  <input
                    type="number"
                    min="0"
                    value={match.awayScore}
                    onChange={(e) => onUpdateMatchStatus(match.id, match.status, match.homeScore, Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-mono font-bold text-gray-900"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">Changing these scores live updates all standings tables instantly.</p>
            </div>

            {/* 3. Add Event Form */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs space-y-3">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Record match event</span>
              <form onSubmit={handleAddEventSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={refEventType}
                    onChange={(e) => setRefEventType(e.target.value as MatchEventType)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700"
                  >
                    <option value={MatchEventType.GOAL}>⚽ Goal</option>
                    <option value={MatchEventType.CARD}>🟨 Card</option>
                    <option value={MatchEventType.SUBSTITUTION}>🔄 Substitution</option>
                    <option value={MatchEventType.COMMENTARY}>📢 Commentary</option>
                  </select>

                  <input
                    type="number"
                    value={refEventMinute}
                    onChange={(e) => setRefEventMinute(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs font-mono font-bold text-gray-800"
                    placeholder="Min"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={refEventTeam}
                    onChange={(e) => setRefEventTeam(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700"
                  >
                    <option value="">Select Team</option>
                    <option value={match.homeTeamId}>Home ({homeTeam?.name})</option>
                    <option value={match.awayTeamId}>Away ({awayTeam?.name})</option>
                  </select>

                  <select
                    value={refEventPlayer}
                    onChange={(e) => setRefEventPlayer(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700"
                  >
                    <option value="">Select Player</option>
                    {allMatchPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (#{p.jerseyNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {refEventType === MatchEventType.CARD && (
                  <div className="flex gap-4 p-1.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="radio"
                        checked={refCardColor === 'yellow'}
                        onChange={() => setRefCardColor('yellow')}
                      />
                      🟨 Yellow
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="radio"
                        checked={refCardColor === 'red'}
                        onChange={() => setRefCardColor('red')}
                      />
                      🔴 Red
                    </label>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Custom event details (optional)..."
                  value={refEventDetail}
                  onChange={(e) => setRefEventDetail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden"
                />

                <button
                  type="submit"
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Post Event to Feed
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Split: Timeline vs Stats */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left column: Match Events Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-bold text-gray-900">Match Events Timeline</h3>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTimelineFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  timelineFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTimelineFilter('goals')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  timelineFilter === 'goals' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ⚽ Goals
              </button>
              <button
                onClick={() => setTimelineFilter('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  timelineFilter === 'cards' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🟨 Cards
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs p-6 relative">
            <div className="absolute left-9 top-6 bottom-6 w-0.5 bg-gray-100 pointer-events-none" />

            {match.events.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-12">Match kickoff pending. No live events registered.</p>
            ) : (
              <div className="space-y-6 relative">
                {match.events
                  .filter((ev) => {
                    if (timelineFilter === 'goals') return ev.type === MatchEventType.GOAL;
                    if (timelineFilter === 'cards') return ev.type === MatchEventType.CARD;
                    return true;
                  })
                  .map((ev) => (
                    <div key={ev.id} className="flex items-start gap-4">
                      {/* Time Badge */}
                      <span className="w-10 text-center font-mono font-extrabold text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-sm py-1">
                        {ev.time}'
                      </span>

                      {/* Icon */}
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs shadow-inner">
                        {ev.type === MatchEventType.GOAL ? '⚽' : ev.type === MatchEventType.CARD ? (ev.cardColor === 'red' ? '🔴' : '🟨') : ev.type === MatchEventType.SUBSTITUTION ? '🔄' : '📢'}
                      </div>

                      {/* Detail Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900 leading-relaxed font-semibold">
                          {ev.detail}
                        </p>
                        {ev.playerId && (
                          <span className="block text-[10px] text-gray-400 font-mono">
                            Registered Athlete Profile Connected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Match Statistics & Fan engagement polls */}
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-gray-900">Game Analytics</h3>
          
          {/* Match Analytics Bars */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs space-y-4">
            {/* Possession */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>{match.status === 'scheduled' ? '50%' : `${match.statistics.home.possession}%`}</span>
                <span className="text-gray-400 font-normal">Ball Possession</span>
                <span>{match.status === 'scheduled' ? '50%' : `${match.statistics.away.possession}%`}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${match.statistics.home.possession}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${match.statistics.away.possession}%` }}
                />
              </div>
            </div>

            {/* Shots */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>{match.status === 'scheduled' ? '0' : match.statistics.home.shots}</span>
                <span className="text-gray-400 font-normal">Total Shots</span>
                <span>{match.status === 'scheduled' ? '0' : match.statistics.away.shots}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${(match.statistics.home.shots / (match.statistics.home.shots + match.statistics.away.shots || 1)) * 100}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${(match.statistics.away.shots / (match.statistics.home.shots + match.statistics.away.shots || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Corners */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>{match.status === 'scheduled' ? '0' : match.statistics.home.corners}</span>
                <span className="text-gray-400 font-normal">Corners</span>
                <span>{match.status === 'scheduled' ? '0' : match.statistics.away.corners}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${(match.statistics.home.corners / (match.statistics.home.corners + match.statistics.away.corners || 1)) * 100}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${(match.statistics.away.corners / (match.statistics.home.corners + match.statistics.away.corners || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Fouls */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-600 font-semibold">
                <span>{match.status === 'scheduled' ? '0' : match.statistics.home.fouls}</span>
                <span className="text-gray-400 font-normal">Fouls</span>
                <span>{match.status === 'scheduled' ? '0' : match.statistics.away.fouls}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${(match.statistics.home.fouls / (match.statistics.home.fouls + match.statistics.away.fouls || 1)) * 100}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: match.status === 'scheduled' ? '50%' : `${(match.statistics.away.fouls / (match.statistics.home.fouls + match.statistics.away.fouls || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fan Engagement Poll Section */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-1.5">
              <Award className="text-indigo-400 w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-indigo-300">Fan Engagement Poll</span>
            </div>

            {activePolls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              const userSelection = pollVoted[poll.id] || poll.userVotes[activeRole];

              return (
                <div key={poll.id} className="space-y-3 pt-3 border-t border-slate-800/80 first:border-t-0">
                  <p className="text-xs font-bold text-gray-100 leading-snug">{poll.question}</p>
                  <div className="grid gap-2">
                    {poll.options.map((opt) => {
                      const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      const hasVoted = !!userSelection;
                      const isVotedOption = userSelection === opt.id;

                      return (
                        <button
                          key={opt.id}
                          disabled={hasVoted}
                          onClick={() => handleVote(poll.id, opt.id)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs relative overflow-hidden transition-all border ${
                            isVotedOption
                              ? 'bg-indigo-600/20 border-indigo-500/80 text-white'
                              : hasVoted
                              ? 'bg-slate-800/40 border-slate-800/80 text-gray-400'
                              : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-gray-200 cursor-pointer'
                          }`}
                        >
                          <div
                            className="absolute top-0 left-0 bottom-0 bg-indigo-500/10 transition-all duration-500 pointer-events-none"
                            style={{ width: `${percentage}%` }}
                          />
                          <div className="relative flex justify-between items-center">
                            <span className="font-semibold">{opt.text}</span>
                            {hasVoted && (
                              <span className="font-mono text-[10px] font-bold text-indigo-400">
                                {percentage}% ({opt.votes})
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
