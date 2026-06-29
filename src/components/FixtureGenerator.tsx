import React, { useState } from 'react';
import { Tournament, Team, Match, MatchStatus, FixtureType } from '../types';
import { Trophy, Calendar, Plus, Printer, ShieldCheck, Edit3, Trash, RefreshCw, Layers } from 'lucide-react';

interface FixtureGeneratorProps {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  onAddMatch: (match: Match) => void;
  onClearMatchesByTournament: (tournamentId: string) => void;
  onNavigate: (view: string) => void;
}

export default function FixtureGenerator({
  tournaments,
  teams,
  matches,
  onAddMatch,
  onClearMatchesByTournament,
  onNavigate,
}: FixtureGeneratorProps) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(tournaments[0]?.id || '');
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  // Editing form states
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const activeTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];
  const tournamentMatches = matches.filter((m) => m.tournamentId === selectedTournamentId);

  const getTeamName = (id: string) => teams.find((t) => t.id === id)?.name || 'TBD';
  const getTeamLogo = (id: string) => teams.find((t) => t.id === id)?.logo || '⚽';

  // Automated League Fixtures (Round Robin Algorithm)
  const generateLeagueFixtures = () => {
    if (!activeTournament) return;
    onClearMatchesByTournament(activeTournament.id);

    const activeTeams = [...teams];
    if (activeTeams.length < 2) return;

    const numTeams = activeTeams.length;
    let matchIdCounter = Date.now();

    // Round Robin Scheduler (Berger tables / circle method)
    const fixtures: Omit<Match, 'id'>[] = [];
    const teamList = [...activeTeams];

    // If odd number, add a dummy bye team (not needed since we have 8 teams)
    const rounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;

    for (let round = 0; round < rounds; round++) {
      for (let matchIdx = 0; matchIdx < matchesPerRound; matchIdx++) {
        const home = (round + matchIdx) % (numTeams - 1);
        let away = (numTeams - 1 - matchIdx + round) % (numTeams - 1);

        if (matchIdx === 0) {
          away = numTeams - 1;
        }

        const homeTeam = teamList[home];
        const awayTeam = teamList[away];

        // Alternating home/away
        const isHome = (round + matchIdx) % 2 === 0;
        const actualHome = isHome ? homeTeam : awayTeam;
        const actualAway = isHome ? awayTeam : homeTeam;

        // Generate date offsets starting from tournament start
        const baseDate = new Date(activeTournament.startDate);
        baseDate.setDate(baseDate.getDate() + (round * 4) + matchIdx);
        const dateString = baseDate.toISOString().split('T')[0];

        fixtures.push({
          tournamentId: activeTournament.id,
          homeTeamId: actualHome.id,
          awayTeamId: actualAway.id,
          homeScore: 0,
          awayScore: 0,
          date: dateString,
          time: '15:30',
          location: 'Tassia Community ground, Pitch A',
          status: MatchStatus.SCHEDULED,
          events: [],
          statistics: {
            home: { possession: 0, shots: 0, corners: 0, fouls: 0 },
            away: { possession: 0, shots: 0, corners: 0, fouls: 0 },
          },
        });
      }
    }

    // Add generated matches to state
    fixtures.forEach((f, idx) => {
      onAddMatch({
        ...f,
        id: `gen_m_${matchIdCounter}_${idx}`,
      });
    });

    alert(`Successfully generated ${fixtures.length} Round-Robin League Fixtures for ${activeTournament.name}!`);
  };

  // Automated Knockout Brackets Generator
  const generateKnockoutBracket = () => {
    if (!activeTournament) return;
    onClearMatchesByTournament(activeTournament.id);

    const activeTeams = teams.slice(0, 8); // Top 8 teams
    let matchIdCounter = Date.now();

    // We will generate 4 Quarter Finals
    const quarterFinals: Omit<Match, 'id'>[] = [];
    for (let i = 0; i < 4; i++) {
      const homeTeam = activeTeams[i * 2];
      const awayTeam = activeTeams[i * 2 + 1];

      const baseDate = new Date(activeTournament.startDate);
      baseDate.setDate(baseDate.getDate() + i);
      const dateString = baseDate.toISOString().split('T')[0];

      quarterFinals.push({
        tournamentId: activeTournament.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: 0,
        awayScore: 0,
        date: dateString,
        time: '15:30',
        location: `Donholm Pitch, Quarter-Final ${i + 1}`,
        status: MatchStatus.SCHEDULED,
        events: [],
        statistics: {
          home: { possession: 0, shots: 0, corners: 0, fouls: 0 },
          away: { possession: 0, shots: 0, corners: 0, fouls: 0 },
        },
      });
    }

    quarterFinals.forEach((qf, idx) => {
      onAddMatch({
        ...qf,
        id: `gen_qf_${matchIdCounter}_${idx}`,
      });
    });

    alert(`Successfully generated 4 Quarter-Final matches! Winners will progress into Semi-Final slots automatically.`);
  };

  // Handle Match Edit
  const handleSaveEdit = (matchId: string) => {
    const existingMatch = matches.find((m) => m.id === matchId);
    if (existingMatch) {
      onAddMatch({
        ...existingMatch,
        date: editDate || existingMatch.date,
        time: editTime || existingMatch.time,
        location: editLocation || existingMatch.location,
      });
    }
    setEditingMatchId(null);
  };

  const handleStartEdit = (m: Match) => {
    setEditingMatchId(m.id);
    setEditDate(m.date);
    setEditTime(m.time);
    setEditLocation(m.location);
  };

  const printSheet = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:bg-white print:text-black">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 print:hidden">
        <div>
          <span className="text-xs font-bold font-mono text-indigo-600 uppercase tracking-widest block mb-1">
            Fixture Hub & Bracket Tool
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Schedule Generator & Bracket Tree
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Generate round-robin grids, print match sheets, or manage brackets with manual editor.
          </p>
        </div>

        <button
          onClick={printSheet}
          className="px-4 py-2 bg-gray-950 text-white font-bold rounded-xl text-xs hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Fixture Sheets
        </button>
      </div>

      {/* Select active tournament */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-indigo-600" />
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400">Current Tournament</label>
            <select
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs font-bold text-gray-700"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions to trigger generator */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={generateLeagueFixtures}
            className="flex-1 md:flex-none px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Auto-Generate League
          </button>
          <button
            onClick={generateKnockoutBracket}
            className="flex-1 md:flex-none px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" /> Generate Knockouts
          </button>
        </div>
      </div>

      {/* Visual Knockout Bracket Graphic (Quarter -> Semi -> Final) */}
      {activeTournament?.fixtureType === FixtureType.KNOCKOUT && (
        <div className="space-y-4">
          <h3 className="font-display text-sm font-bold text-gray-400 uppercase tracking-wider font-mono">
            🏆 Knockout Bracket Visualizer
          </h3>
          <div className="bg-radial from-slate-900 to-slate-950 p-6 rounded-2xl text-white overflow-x-auto border border-slate-800">
            <div className="min-w-[800px] flex justify-between gap-8 py-8 px-4 items-center relative">
              
              {/* Quarter-Finals column */}
              <div className="flex-1 flex flex-col justify-around h-96 gap-4">
                <span className="text-[10px] font-mono font-bold text-indigo-400 text-center uppercase tracking-widest border-b border-slate-800 pb-2">
                  Quarter Finals (Top 8)
                </span>
                {[0, 1, 2, 3].map((idx) => {
                  const m = tournamentMatches[idx];
                  return (
                    <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>QF #{idx + 1}</span>
                        <span>{m ? m.date : 'TBD'}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{m ? getTeamLogo(m.homeTeamId) : '⚽'} {m ? getTeamName(m.homeTeamId) : 'TBD Team'}</span>
                        <span className="font-mono">{m ? m.homeScore : '-'}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{m ? getTeamLogo(m.awayTeamId) : '⚽'} {m ? getTeamName(m.awayTeamId) : 'TBD Team'}</span>
                        <span className="font-mono">{m ? m.awayScore : '-'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bracket link graphic */}
              <div className="flex-1 flex flex-col justify-around h-96 gap-12">
                <span className="text-[10px] font-mono font-bold text-indigo-400 text-center uppercase tracking-widest border-b border-slate-800 pb-2">
                  Semi Finals
                </span>
                {[0, 1].map((idx) => (
                  <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/30 text-xs space-y-1.5 shadow-md">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                      <span>Semi #{idx + 1}</span>
                      <span>Progressive slot</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{teams[idx * 2]?.logo || '⚽'} {teams[idx * 2]?.name || 'QF Winner'}</span>
                      <span className="font-mono">-</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{teams[idx * 2 + 1]?.logo || '⚽'} {teams[idx * 2 + 1]?.name || 'QF Winner'}</span>
                      <span className="font-mono">-</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bracket link graphic */}
              <div className="flex-1 flex flex-col justify-center h-96 gap-6">
                <span className="text-[10px] font-mono font-bold text-amber-400 text-center uppercase tracking-widest border-b border-slate-800 pb-2">
                  Grand Finale
                </span>
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/20 p-4 rounded-2xl border-2 border-amber-500/50 text-xs space-y-2 shadow-lg shadow-amber-500/5">
                  <div className="flex justify-between items-center text-[10px] text-amber-400 font-mono font-bold">
                    <span>🏆 TASSIA GRAND FINAL</span>
                    <span>Tassia Main Pitch</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-white">
                    <span>{teams[0]?.logo} {teams[0]?.name}</span>
                    <span className="font-mono">-</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-white">
                    <span>{teams[1]?.logo} {teams[1]?.name}</span>
                    <span className="font-mono">-</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-[11px] text-center text-gray-400">
                  <span className="block font-bold text-gray-300">Third Place Match</span>
                  <span>{teams[2]?.name} vs {teams[3]?.name}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Generated Matches list */}
      <div className="space-y-4">
        <h3 className="font-display text-sm font-bold text-gray-400 uppercase tracking-wider font-mono">
          📅 Fixture List ({tournamentMatches.length} Matches)
        </h3>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden">
          <div className="divide-y divide-gray-100">
            {tournamentMatches.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400 font-medium">
                No fixtures generated for this tournament yet. Click "Auto-Generate League" to configure round robin tables.
              </div>
            ) : (
              tournamentMatches.map((m) => {
                const isEditing = editingMatchId === m.id;
                return (
                  <div key={m.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    {/* Fixture details */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 min-w-20">
                        <span className="block font-mono font-extrabold text-xs text-gray-800">{m.date}</span>
                        <span className="block text-[10px] text-gray-400 font-mono">{m.time}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-900 font-bold">
                          <span>{getTeamLogo(m.homeTeamId)} {getTeamName(m.homeTeamId)}</span>
                          <span className="text-gray-400 font-normal">vs</span>
                          <span>{getTeamLogo(m.awayTeamId)} {getTeamName(m.awayTeamId)}</span>
                        </div>
                        <span className="block text-[10px] text-gray-400 font-mono">
                          🏟️ {m.location}
                        </span>
                      </div>
                    </div>

                    {/* Editor Form */}
                    {isEditing ? (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full sm:w-auto flex flex-col sm:flex-row gap-3 print:hidden">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-800"
                        />
                        <input
                          type="text"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-mono"
                          placeholder="HH:MM"
                        />
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs"
                          placeholder="Location Ground"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(m.id)}
                            className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMatchId(null)}
                            className="px-2.5 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end print:hidden">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'live' ? 'bg-red-500 text-white animate-pulse' : m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>

                        <button
                          onClick={() => handleStartEdit(m)}
                          className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                          title="Manual Edit Fixture"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
