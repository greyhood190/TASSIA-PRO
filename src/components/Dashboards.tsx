import React, { useState } from 'react';
import { UserRole, Tournament, Team, Player, Match, News, Poll, AppNotification, PlayerStatus } from '../types';
import { Trophy, Users, Shield, Calendar, Award, MessageCircle, Plus, Eye, CheckCircle, XCircle, Trash2, Heart, ShieldAlert, BarChart3, QrCode } from 'lucide-react';

interface DashboardsProps {
  activeRole: UserRole;
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  news: News[];
  polls: Poll[];
  notifications: AppNotification[];
  onAddTournament: (tournament: Tournament) => void;
  onAddTeam: (team: Team) => void;
  onAddPlayer: (player: Player) => void;
  onAddNews: (article: News) => void;
  onApproveClub: (teamId: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'live' | 'fixtures' | 'reports') => void;
}

export default function Dashboards({
  activeRole,
  tournaments,
  teams,
  players,
  matches,
  news,
  polls,
  notifications,
  onAddTournament,
  onAddTeam,
  onAddPlayer,
  onAddNews,
  onApproveClub,
  onDeleteTeam,
  onNavigate,
}: DashboardsProps) {
  // Common state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 1. Organizer state: Create Tournament
  const [tName, setTName] = useState('');
  const [tSeason, setTSeason] = useState('Season 2026');
  const [tLocation, setTLocation] = useState('Tassia Ground, Pitch A');
  const [tDesc, setTDesc] = useState('');
  const [tType, setTType] = useState('league');

  // 2. Organizer state: Create Team
  const [teamName, setTeamName] = useState('');
  const [coachName, setCoachName] = useState('');
  const [contact, setContact] = useState('');
  const [logoChar, setLogoChar] = useState('⚽');

  // 3. Coach state: Create Player
  const [plName, setPlName] = useState('');
  const [plJersey, setPlJersey] = useState(10);
  const [plPos, setPlPos] = useState('Midfielder');
  const [plAge, setPlAge] = useState(21);
  const [plHeight, setPlHeight] = useState('175 cm');
  const [plWeight, setPlWeight] = useState('70 kg');

  // 4. Admin state: Create News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCat, setNewsCat] = useState('Announcement');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsBody, setNewsBody] = useState('');

  // 5. Follow list
  const [followedTeams, setFollowedTeams] = useState<string[]>(['tm1']);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) return;
    const newT: Tournament = {
      id: `t_${Date.now()}`,
      name: tName,
      season: tSeason,
      location: tLocation,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-08-30',
      registrationDeadline: '2026-06-30',
      logo: '🏆',
      description: tDesc,
      status: 'upcoming' as any,
      fixtureType: tType as any,
      teamsCount: 0
    };
    onAddTournament(newT);
    triggerToast(`Tournament "${tName}" created successfully!`);
    setTName('');
    setTDesc('');
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    const newTeam: Team = {
      id: `tm_${Date.now()}`,
      name: teamName,
      coach: coachName || 'TBD Coach',
      logo: logoChar,
      contactInfo: contact || 'N/A',
      statistics: { wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      playersCount: 0
    };
    onAddTeam(newTeam);
    triggerToast(`Club "${teamName}" onboarded!`);
    setTeamName('');
    setCoachName('');
    setContact('');
  };

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plName.trim()) return;
    const newPl: Player = {
      id: `pl_${Date.now()}`,
      name: plName,
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      jerseyNumber: Number(plJersey),
      position: plPos,
      age: Number(plAge),
      nationality: 'Kenya',
      height: plHeight,
      weight: plWeight,
      statistics: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, appearances: 0, minutesPlayed: 0, cleanSheets: 0 },
      status: PlayerStatus.ACTIVE,
      teamId: 'tm1' // Default to Coach's team: Tassia FC
    };
    onAddPlayer(newPl);
    triggerToast(`Athlete "${plName}" registered in Tassia FC squad!`);
    setPlName('');
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim()) return;
    const newArticle: News = {
      id: `n_${Date.now()}`,
      title: newsTitle,
      excerpt: newsExcerpt || newsBody.slice(0, 100),
      content: newsBody,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
      category: newsCat,
      createdAt: new Date().toISOString(),
      authorName: 'Super Admin Desk',
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      likedBy: []
    };
    onAddNews(newArticle);
    triggerToast(`Article "${newsTitle}" published successfully!`);
    setNewsTitle('');
    setNewsExcerpt('');
    setNewsBody('');
  };

  const toggleFollow = (teamId: string) => {
    if (followedTeams.includes(teamId)) {
      setFollowedTeams(followedTeams.filter(id => id !== teamId));
    } else {
      setFollowedTeams([...followedTeams, teamId]);
    }
  };

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Tassia FC';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Warning */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <span>✓</span> {successToast}
        </div>
      )}

      {/* Role Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-widest block">
            Tassia Portal Ecosystem
          </span>
          <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            {activeRole === UserRole.SUPER_ADMIN && <Shield className="text-rose-500 w-6 h-6" />}
            {activeRole === UserRole.ORGANIZER && <Trophy className="text-amber-500 w-6 h-6" />}
            {activeRole === UserRole.REFEREE && <Calendar className="text-yellow-500 w-6 h-6" />}
            {activeRole === UserRole.COACH && <Users className="text-emerald-500 w-6 h-6" />}
            {activeRole === UserRole.PLAYER && <Award className="text-blue-500 w-6 h-6" />}
            {activeRole === UserRole.FAN && <MessageCircle className="text-purple-500 w-6 h-6" />}
            {activeRole.replace('_', ' ').toUpperCase()} DASHBOARD
          </h2>
        </div>
        <p className="text-xs text-gray-500 max-w-sm">
          Simulated dashboard with real-time state persistence. Everything you create, add, or change updates instantly.
        </p>
      </div>

      {/* -------------------- SUPER ADMIN VIEW -------------------- */}
      {activeRole === UserRole.SUPER_ADMIN && (
        <div className="space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs text-center">
              <span className="block text-[10px] font-mono text-gray-400 uppercase">Clubs Onboarded</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1 block">{teams.length}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs text-center">
              <span className="block text-[10px] font-mono text-gray-400 uppercase">Registered Athletes</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1 block">{players.length}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs text-center">
              <span className="block text-[10px] font-mono text-gray-400 uppercase">Completed Matches</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1 block">
                {matches.filter(m => m.status === 'completed').length}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs text-center">
              <span className="block text-[10px] font-mono text-gray-400 uppercase">Active Fan Polls</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1 block">{polls.length}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Analytical Custom SVG Charts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                  <BarChart3 className="text-indigo-600 w-5 h-5" />
                  <span className="font-display font-bold text-xs text-gray-900 uppercase">Tournament Analytics Growth</span>
                </div>

                <div className="space-y-4">
                  {/* Goals per Team Chart */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-gray-500">Clubs Goals For Leaderboard (Attack Power)</span>
                    <div className="space-y-2">
                      {teams.slice(0, 5).map((team) => (
                        <div key={team.id} className="flex items-center gap-2.5 text-xs">
                          <span className="w-24 truncate font-bold text-gray-700">{team.name}</span>
                          <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${(team.statistics.goalsFor / 15) * 100}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono font-extrabold text-indigo-600">{team.statistics.goalsFor}G</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Club Approvals */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Grassroots Clubs Registry</span>
                <div className="divide-y divide-gray-50 text-xs">
                  {teams.map((t) => (
                    <div key={t.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{t.logo}</span>
                        <div>
                          <span className="block font-bold text-gray-900">{t.name}</span>
                          <span className="block text-[10px] text-gray-400">Coach: {t.coach} | Contacts: {t.contactInfo}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ✓ APPROVED
                        </span>
                        <button
                          onClick={() => onDeleteTeam(t.id)}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                          title="Disband Club"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Manage News */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Publish Community News</span>
              <form onSubmit={handleCreateNews} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-hidden"
                    placeholder="Headline title..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select
                    value={newsCat}
                    onChange={(e) => setNewsCat(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-700"
                  >
                    <option value="Announcement">📢 Announcement</option>
                    <option value="Match Review">⚽ Match Review</option>
                    <option value="Gallery">📸 Gallery Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Excerpt</label>
                  <input
                    type="text"
                    value={newsExcerpt}
                    onChange={(e) => setNewsExcerpt(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-hidden"
                    placeholder="Short 1-sentence preview..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Article Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newsBody}
                    onChange={(e) => setNewsBody(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-hidden"
                    placeholder="Write the full report..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm shadow-rose-100 transition-all"
                >
                  Publish Article & Feed Notify
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TOURNAMENT ORGANIZER VIEW -------------------- */}
      {activeRole === UserRole.ORGANIZER && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Tournament Form */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Setup New Tournament</span>
            <form onSubmit={handleCreateTournament} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tournament Name</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  placeholder="e.g. Tassia Winter Shield"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Season</label>
                  <input
                    type="text"
                    value={tSeason}
                    onChange={(e) => setTSeason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Ground Venue</label>
                  <input
                    type="text"
                    value={tLocation}
                    onChange={(e) => setTLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fixture Scheme</label>
                <select
                  value={tType}
                  onChange={(e) => setTType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-700"
                >
                  <option value="league">League (Round Robin)</option>
                  <option value="knockout">Pure Knockout Brackets</option>
                  <option value="group_stage">Hybrid Group + Playoffs</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={tDesc}
                  onChange={(e) => setTDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  rows={3}
                  placeholder="Promote values, reward scales, rules..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-all"
              >
                Launch Tournament Scheme
              </button>
            </form>
          </div>

          {/* Team Registration & Roster directory */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Onboard Football Club</span>
            <form onSubmit={handleCreateTeam} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  placeholder="e.g. Embakasi Sports Academy"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Coach Name</label>
                  <input
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                    placeholder="Head Coach Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Icon Logo</label>
                  <select
                    value={logoChar}
                    onChange={(e) => setLogoChar(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-700"
                  >
                    <option value="⚽">⚽ Soccer</option>
                    <option value="🦅">🦅 Eagle</option>
                    <option value="🦁">🦁 Lion</option>
                    <option value="🐅">🐅 Tiger</option>
                    <option value="🐆">🐆 Leopard</option>
                    <option value="🛡️">🛡️ Shield</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact Email / Phone</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  placeholder="coach@email.com | +254..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-all"
              >
                Approve & Register Club
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- REFEREE VIEW -------------------- */}
      {activeRole === UserRole.REFEREE && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div>
              <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase">Assigned Matches</span>
              <p className="text-xs text-gray-500">Pick an ongoing or scheduled match to record real-time goals and events.</p>
            </div>
            <button
              onClick={() => onNavigate('live')}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-yellow-100"
            >
              Launch Live Match Center &rarr;
            </button>
          </div>

          <div className="divide-y divide-gray-50 text-xs">
            {matches.map((m) => (
              <div key={m.id} className="py-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <span>{getTeamName(m.homeTeamId)}</span>
                    <span className="text-gray-400 font-normal">vs</span>
                    <span>{getTeamName(m.awayTeamId)}</span>
                  </div>
                  <span className="block text-[10px] text-gray-400 font-mono">VENUE: {m.location} | DATE: {m.date} @ {m.time}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  m.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600'
                }`}>
                  {m.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- COACH VIEW -------------------- */}
      {activeRole === UserRole.COACH && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Coach Squad Onboarding */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Register Athlete to Squad</span>
            <form onSubmit={handleCreatePlayer} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Athlete Full Name</label>
                <input
                  type="text"
                  required
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-hidden"
                  placeholder="e.g. Dennis Oliech Jr"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Jersey No.</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={plJersey}
                    onChange={(e) => setPlJersey(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Field Position</label>
                  <select
                    value={plPos}
                    onChange={(e) => setPlPos(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-700"
                  >
                    <option value="Goalkeeper">🧤 Goalkeeper</option>
                    <option value="Defender">🛡️ Defender</option>
                    <option value="Midfielder">🏃 Midfielder</option>
                    <option value="Forward">⚡ Forward</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={plAge}
                    onChange={(e) => setPlAge(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Height</label>
                  <input
                    type="text"
                    value={plHeight}
                    onChange={(e) => setPlHeight(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Weight</label>
                  <input
                    type="text"
                    value={plWeight}
                    onChange={(e) => setPlWeight(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-all"
              >
                Add Player to Squad Roster
              </button>
            </form>
          </div>

          {/* Squad sheet of coach's team (Tassia FC) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">My Team Squad (Tassia FC)</span>
            <div className="divide-y divide-gray-50 text-xs">
              {players
                .filter((p) => p.teamId === 'tm1')
                .map((player) => (
                  <div key={player.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={player.photo} alt={player.name} className="w-8 h-8 rounded-full object-cover border border-gray-100" referrerPolicy="no-referrer" />
                      <div>
                        <span className="block font-bold text-gray-900">{player.name}</span>
                        <span className="block text-[10px] text-gray-400">Position: {player.position} | Jersey: #{player.jerseyNumber}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                      {player.statistics.goals} GOALS
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- PLAYER VIEW -------------------- */}
      {activeRole === UserRole.PLAYER && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Player profile stats */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4 text-center">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
              alt="Brian Onyango"
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-indigo-600 p-1"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-display font-extrabold text-lg text-gray-900">Brian "Okocha" Onyango</h3>
              <span className="text-xs text-gray-500 font-mono">Tassia FC (#10) - Midfielder</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 text-center">
              <div>
                <span className="block text-xs font-mono text-gray-400">Goals</span>
                <span className="block text-lg font-bold text-indigo-600 font-mono">5</span>
              </div>
              <div>
                <span className="block text-xs font-mono text-gray-400">Assists</span>
                <span className="block text-lg font-bold text-indigo-600 font-mono">4</span>
              </div>
              <div>
                <span className="block text-xs font-mono text-gray-400">Played</span>
                <span className="block text-lg font-bold text-indigo-600 font-mono">6</span>
              </div>
            </div>

            <div className="space-y-1 text-left text-xs text-gray-600">
              <p>Height: <strong>178 cm</strong></p>
              <p>Weight: <strong>72 kg</strong></p>
              <p>Nationality: <strong>Kenyan</strong></p>
            </div>
          </div>

          {/* Certificate of participation (Printable) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-radial from-slate-900 to-slate-950 p-8 rounded-3xl text-white text-center border border-slate-800 space-y-4 shadow-xl">
              <span className="block text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                🏆 Tassia Grassroots Sports Certificate
              </span>
              <h4 className="font-display text-lg font-extrabold">Certificate of Participation</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                This certifies that <strong>Brian "Okocha" Onyango</strong> has actively registered and competed in the Tassia Community Cup 2026.
              </p>
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>PATRICK MWANGI (CHAIRMAN)</span>
                <span>SECURE DIGITAL RECORD</span>
              </div>
            </div>

            {/* QR Profile Card Check-in */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs flex items-center gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <QrCode className="w-14 h-14 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900">QR Check-in Profile</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Scan this QR code at the gate or pitchside checklist tables for instant referee check-in and security logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- FAN VIEW -------------------- */}
      {activeRole === UserRole.FAN && (
        <div className="space-y-8">
          {/* Vote in active polls */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-indigo-300 uppercase tracking-widest">
              🗳️ Community Fan Polls
            </h3>
            <p className="text-xs text-gray-400">Have your say! Vote on upcoming match predictions and player of the season.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                return (
                  <div key={poll.id} className="bg-slate-800 p-4 rounded-2xl space-y-3">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block">{poll.category}</span>
                    <p className="text-xs font-bold">{poll.question}</p>
                    <div className="space-y-1.5">
                      {poll.options.map((opt) => {
                        const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                        return (
                          <div key={opt.id} className="bg-slate-900 p-2 rounded-xl text-xs flex justify-between items-center border border-slate-800">
                            <span>{opt.text}</span>
                            <span className="font-mono text-[10px] text-gray-400">{pct}% ({opt.votes} votes)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Follow list */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">My Followed Clubs</span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teams.map((t) => {
                const isFollowed = followedTeams.includes(t.id);
                return (
                  <div key={t.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{t.logo}</span>
                      <span className="text-xs font-bold text-gray-900">{t.name}</span>
                    </div>
                    <button
                      onClick={() => toggleFollow(t.id)}
                      className={`p-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        isFollowed ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-indigo-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFollowed ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
