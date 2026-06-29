import React, { useState } from 'react';
import { Tournament, TournamentStatus, Team, Player, Match, News, Sponsor, MediaItem } from '../types';
import { Trophy, Calendar, Users, Eye, ArrowRight, Heart, MessageSquare, Download, Flame, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  news: News[];
  sponsors: Sponsor[];
  media: MediaItem[];
  onOpenMatch: (matchId: string) => void;
  onLikeNews: (id: string) => void;
  onAddComment: (newsId: string, content: string) => void;
  currentUserRole: string;
  onNavigate: (view: 'landing' | 'dashboard' | 'live' | 'fixtures' | 'reports') => void;
}

export default function LandingPage({
  tournaments,
  teams,
  players,
  matches,
  news,
  sponsors,
  media,
  onOpenMatch,
  onLikeNews,
  onAddComment,
  currentUserRole,
  onNavigate,
}: LandingPageProps) {
  const [commentText, setCommentText] = useState<{ [newsId: string]: string }>({});
  const [activeNews, setActiveNews] = useState<string | null>(null);

  // Latest Completed Matches
  const completedMatches = matches
    .filter((m) => m.status === 'completed')
    .slice(0, 3);

  // Standings Calculation
  const standings = [...teams]
    .sort((a, b) => {
      if (b.statistics.points !== a.statistics.points) {
        return b.statistics.points - a.statistics.points;
      }
      const aGD = a.statistics.goalsFor - a.statistics.goalsAgainst;
      const bGD = b.statistics.goalsFor - b.statistics.goalsAgainst;
      return bGD - aGD;
    });

  // Top Scorers Calculation
  const topScorers = [...players]
    .sort((a, b) => b.statistics.goals - a.statistics.goals)
    .slice(0, 5);

  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || 'Unknown Team';
  const getTeamLogo = (id: string) => teams.find((t) => t.id === id)?.logo || '⚽';

  const handleCommentSubmit = (newsId: string) => {
    const text = commentText[newsId]?.trim();
    if (!text) return;
    onAddComment(newsId, text);
    setCommentText({ ...commentText, [newsId]: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white py-24 px-4 overflow-hidden border-b border-indigo-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-0 right-0 h-96 bg-emerald-500/20 rounded-full blur-[140px] -translate-y-1/2" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Eastlands Football & Unity
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-none"
          >
            Tassia Tournament <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-indigo-300">
              PRO Management Portal
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-indigo-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Professional-grade tournament brackets, live referee commentary, team profiles,
            instant standings, and fan engagement for community football clubs. Optimized for any device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-indigo-950 font-black rounded-xl shadow-lg shadow-emerald-400/20 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              Enter Dashboard Hub <ArrowRight className="w-4 h-4 text-indigo-950 stroke-[3]" />
            </button>
            <button
              onClick={() => onNavigate('live')}
              className="px-8 py-4 bg-indigo-800 hover:bg-indigo-700 text-white font-bold rounded-xl border border-indigo-600 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <Flame className="text-emerald-400 w-4 h-4 fill-emerald-400" /> Watch Live Match Center
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. SPONSORS BANNER */}
      <section className="bg-white py-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-mono text-gray-400 uppercase tracking-widest mb-6 font-semibold">
            PROUD COMMUNITY SPONSORS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all">
            {sponsors.map((sp) => (
              <div key={sp.id} className="flex items-center gap-2 bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100">
                <img
                  src={sp.logo}
                  alt={sp.name}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-bold text-gray-600 tracking-tight">{sp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT THE COMMUNITY PITCH */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono block mb-2">
            Grassroots Football Association
          </span>
          <h2 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            Unified Community Soccer
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm mb-6">
            Tassia Grassroots Football Association runs multiple youth and senior cups yearly at the Tassia Community Pitch.
            Our platform eliminates messy paperwork and WhatsApp spamming. We empower tournament organizers to schedule automatic brackets,
            referees to input cards and goals, and players to build their digital profiles.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-calculated standings & bracket triggers
            </li>
            <li className="flex items-center gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Digital Player QR cards & Referee sheets
            </li>
            <li className="flex items-center gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Offline resilience for low internet access
            </li>
          </ul>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
            alt="Tassia ground game"
            className="rounded-2xl shadow-xl w-full object-cover h-64 sm:h-80 border border-gray-100"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-xs hidden sm:block">
            <p className="text-xs text-gray-500 italic">"Football here is more than a game. It is a lifeline for our community."</p>
            <span className="block text-[11px] font-bold text-gray-900 mt-2">— Coach Patrick</span>
          </div>
        </div>
      </section>

      {/* 3. TOURNAMENTS & LATEST RESULTS GRID */}
      <section className="bg-slate-100/40 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
          
          {/* Active Tournaments Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-indigo-600" />
              <h3 className="font-display text-xl font-black text-slate-900 tracking-tight">Active Tournaments</h3>
            </div>
            {tournaments.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  t.status === TournamentStatus.ONGOING ? 'bg-emerald-400 text-indigo-950' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {t.status}
                </span>
                <div className="text-3xl mb-3">{t.logo}</div>
                <h4 className="font-bold text-slate-900 text-base">{t.name}</h4>
                <p className="text-xs text-indigo-600 font-bold mt-1">{t.season}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Starts: {t.startDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Results Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-emerald-500 animate-pulse" />
              <h3 className="font-display text-xl font-black text-slate-900 tracking-tight">Latest Results</h3>
            </div>
            {completedMatches.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl text-xs text-slate-400 border border-slate-200">
                No matches completed yet.
              </div>
            ) : (
              completedMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onOpenMatch(m.id)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold mb-2">
                    <span>{m.date}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Final</span>
                  </div>
                  <div className="grid grid-cols-5 items-center justify-center gap-1">
                    <div className="col-span-2 text-right">
                      <span className="block text-xs font-black text-slate-800 truncate">{getTeamName(m.homeTeamId)}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{getTeamLogo(m.homeTeamId)}</span>
                    </div>
                    <div className="col-span-1 text-center bg-indigo-950 text-emerald-400 rounded-lg py-1.5 px-2 font-mono font-black text-xs shadow-inner">
                      {m.homeScore} - {m.awayScore}
                    </div>
                    <div className="col-span-2 text-left">
                      <span className="block text-xs font-black text-slate-800 truncate">{getTeamName(m.awayTeamId)}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{getTeamLogo(m.awayTeamId)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-center text-indigo-600 hover:text-indigo-800 hover:underline block mt-3 font-bold">
                    View events & stats timeline &rarr;
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Top Scorers column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-indigo-500" />
              <h3 className="font-display text-xl font-black text-slate-900 tracking-tight">Golden Boot</h3>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-850 to-indigo-950 text-white p-5">
                <span className="text-[9px] uppercase font-mono tracking-widest font-black block text-emerald-300">
                  TASSIA COMMUNITY CUP
                </span>
                <p className="text-xs text-indigo-100 mt-1">Top Scorers Leaderboard</p>
              </div>
              <div className="divide-y divide-slate-100">
                {topScorers.map((player, idx) => (
                  <div key={player.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black font-mono text-slate-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-150"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="block text-xs font-bold text-slate-900 leading-tight">{player.name}</span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          {getTeamName(player.teamId)} ({player.position})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-700 font-mono block">
                        {player.statistics.goals} Goals
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        {player.statistics.assists} Assists
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURRENT STANDINGS & FEATURED TEAMS */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        
        {/* Standings Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-xl font-black text-slate-900 tracking-tight">Current Standings</h3>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Live auto-updates</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-900 text-indigo-10 border-b border-indigo-950 text-[10px] font-bold uppercase tracking-widest font-mono">
                    <th className="py-3.5 px-4 text-center w-12 text-emerald-400">Rank</th>
                    <th className="py-3.5 px-4 text-white">Club</th>
                    <th className="py-3.5 px-4 text-center w-12 text-white">P</th>
                    <th className="py-3.5 px-4 text-center w-12 text-white">W</th>
                    <th className="py-3.5 px-4 text-center w-12 text-white">D</th>
                    <th className="py-3.5 px-4 text-center w-12 text-white">L</th>
                    <th className="py-3.5 px-4 text-center w-12 text-white">GD</th>
                    <th className="py-3.5 px-4 text-center w-12 font-black text-emerald-400">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {standings.map((team, idx) => {
                    const gd = team.statistics.goalsFor - team.statistics.goalsAgainst;
                    const isTopThree = idx < 3;
                    return (
                      <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono font-black text-xs ${
                            idx === 0 ? 'bg-emerald-400 text-indigo-950 shadow-xs' : isTopThree ? 'bg-indigo-50 text-indigo-800' : 'text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <span className="text-lg">{team.logo}</span>
                            <span className="truncate">{team.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                          {team.statistics.wins + team.statistics.losses + team.statistics.draws}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">{team.statistics.wins}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">{team.statistics.draws}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">{team.statistics.losses}</td>
                        <td className={`py-3.5 px-4 text-center font-mono font-bold ${gd >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {gd > 0 ? `+${gd}` : gd}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-indigo-700">
                          {team.statistics.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Featured Teams list */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-display text-xl font-black text-slate-900 tracking-tight mb-2">Featured Clubs</h3>
          <div className="grid gap-3.5">
            {teams.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400/80 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.logo}</span>
                  <div>
                    <span className="block font-black text-slate-900 text-sm">{t.name}</span>
                    <span className="block text-xs text-slate-400 font-medium">Coach: {t.coach}</span>
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-150">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px]">Record</span>
                  <span className="font-extrabold text-indigo-700">{t.statistics.wins}W-{t.statistics.draws}D-{t.statistics.losses}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEWS, COMMENTS & FAN CHAT */}
      <section className="bg-gray-100 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono block mb-1">
                Community Feed
              </span>
              <h2 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight">
                Latest News & Reviews
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline">Updated Daily</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {news.map((n) => {
              const hasLiked = n.likedBy.includes(currentUserRole);
              const isExpanded = activeNews === n.id;

              return (
                <div key={n.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all">
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-48 object-cover border-b border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-indigo-600 font-mono font-bold">
                      <span>{n.category}</span>
                      <span className="text-gray-400 font-normal">
                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-indigo-600 cursor-pointer">
                      {n.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {isExpanded ? n.content : n.excerpt}
                    </p>

                    <button
                      onClick={() => setActiveNews(isExpanded ? null : n.id)}
                      className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer inline-block"
                    >
                      {isExpanded ? 'Show less' : 'Read full article &rarr;'}
                    </button>

                    {/* Social Interactions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => onLikeNews(n.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
                            hasLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${hasLiked ? 'fill-rose-500 text-rose-600' : ''}`} />
                          <span>{n.likesCount}</span>
                        </button>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          <span>{n.comments.length} Comments</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">By {n.authorName}</span>
                    </div>

                    {/* Expanded Comments Section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 bg-gray-50/50 p-4 rounded-xl">
                        <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">
                          Discussion
                        </span>
                        <div className="space-y-2.5 max-h-48 overflow-y-auto">
                          {n.comments.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No comments yet. Be the first!</p>
                          ) : (
                            n.comments.map((comm) => (
                              <div key={comm.id} className="text-xs leading-normal">
                                <span className="font-bold text-gray-900">{comm.userName}: </span>
                                <span className="text-gray-600">{comm.content}</span>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            placeholder="Add your voice to this community article..."
                            value={commentText[n.id] || ''}
                            onChange={(e) => setCommentText({ ...commentText, [n.id]: e.target.value })}
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-indigo-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(n.id)}
                          />
                          <button
                            onClick={() => handleCommentSubmit(n.id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. MEDIA GALLERY & FAN ENGAGEMENT POLL */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
        {/* Media Gallery with actual items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-gray-900">Media & Match Highlights</h3>
            <span className="text-xs text-gray-500">Updated from last match</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {media.map((med) => (
              <div key={med.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-2xs group relative">
                {med.type === 'video' ? (
                  <div className="relative">
                    <video src={med.url} poster={med.thumbnail} className="w-full h-36 object-cover" controls />
                    <span className="absolute top-2 left-2 bg-red-600 text-white font-mono font-bold text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Video Playback
                    </span>
                  </div>
                ) : (
                  <img src={med.url} alt={med.title} className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                )}
                <div className="p-3 bg-white">
                  <span className="block text-xs font-bold text-gray-900 truncate">{med.title}</span>
                  <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-gray-50">
                    <span className="text-[9px] text-gray-400 font-mono">Downloads: {med.downloads}</span>
                    <button className="text-indigo-600 hover:text-indigo-500 p-1 rounded-sm cursor-pointer" title="Download Asset">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold text-gray-900">What Tassia Says</h3>
          <div className="bg-gradient-to-r from-gray-900 to-slate-950 text-white rounded-2xl p-6 relative overflow-hidden border border-gray-800 space-y-4">
            <div className="absolute top-4 right-4 text-3xl font-serif text-slate-800 opacity-50 select-none">“</div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-300">
                <p className="italic leading-relaxed">
                  "This digital portal has changed everything for our young people in Kware and Tassia. Seeing their names on the standings list and Golden Boot stats makes them feel like true professional sports stars. It keeps them dedicated and disciplined!"
                </p>
                <span className="block text-white font-bold text-[10px] mt-2.5">— Pastor Waweru, Community Patron</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-300">
                <p className="italic leading-relaxed">
                  "As a referee, writing commentary notes on my phone during halftime and having kids and parents view match timeline in real time is incredible."
                </p>
                <span className="block text-white font-bold text-[10px] mt-2.5">— Referee John K.", KPL certified Grassroots Coordinator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="bg-indigo-600 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Register Your Club For The Upcoming Cup
          </h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto leading-relaxed">
            The Eastlands Junior Championship U17 Division is accepting signups. Complete team profiles, coach credentials, and register up to 18 squad players online.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all cursor-pointer text-xs"
            >
              Sign Up Team Now
            </button>
            <button
              onClick={() => onNavigate('fixtures')}
              className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white border border-indigo-500/30 font-semibold rounded-xl text-xs transition-all cursor-pointer"
            >
              View Bracket Schedule
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-display font-extrabold text-white text-lg tracking-tight">TASSIA CUP</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Automating tournament fixtures and stats calculation for Eastlands community football groups. Clean, lightweight, and offline resilient.
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">Quick Links</span>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white">Home Portal</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white">My Dashboard</button></li>
              <li><button onClick={() => onNavigate('live')} className="hover:text-white">Live Match Center</button></li>
              <li><button onClick={() => onNavigate('fixtures')} className="hover:text-white">Fixture Generation</button></li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">Simulate Role View</span>
            <ul className="space-y-2 text-xs">
              <li><span className="text-gray-500">Super Admin Controls</span></li>
              <li><span className="text-gray-500">Tournament Organizer Panels</span></li>
              <li><span className="text-gray-500">Referee Live Event recorders</span></li>
              <li><span className="text-gray-500">Player Profile and QR cards</span></li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">Ground Contacts</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tassia Sports ground, Off Outer Ring road, Embakasi East Constituency, Nairobi.<br />
              Email: info@tassiasoccer.or.ke
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 text-center text-xs text-gray-600 flex flex-col sm:flex-row justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Tassia Grassroots Football Association. All Rights Reserved.</span>
          <span className="font-mono text-[10px]">Portal version 1.2.0 - Optimized for Low Bandwidth</span>
        </div>
      </footer>
    </div>
  );
}
