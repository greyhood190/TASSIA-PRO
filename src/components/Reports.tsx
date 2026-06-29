import React from 'react';
import { Tournament, Team, Player, Match } from '../types';
import { Download, FileSpreadsheet, FileText, Clipboard, Table, Calendar } from 'lucide-react';

interface ReportsProps {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
}

export default function Reports({ tournaments, teams, players, matches }: ReportsProps) {

  // Helper: Trigger browser CSV download
  const triggerCSVDownload = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Export Standings CSV
  const exportStandingsCSV = () => {
    const headers = ['Rank', 'Club Name', 'Wins', 'Draws', 'Losses', 'Goals For', 'Goals Against', 'Goal Difference', 'Points'];
    
    const sortedTeams = [...teams].sort((a, b) => {
      if (b.statistics.points !== a.statistics.points) return b.statistics.points - a.statistics.points;
      const aGD = a.statistics.goalsFor - a.statistics.goalsAgainst;
      const bGD = b.statistics.goalsFor - b.statistics.goalsAgainst;
      return bGD - aGD;
    });

    const rows = sortedTeams.map((t, idx) => [
      String(idx + 1),
      t.name,
      String(t.statistics.wins),
      String(t.statistics.draws),
      String(t.statistics.losses),
      String(t.statistics.goalsFor),
      String(t.statistics.goalsAgainst),
      String(t.statistics.goalsFor - t.statistics.goalsAgainst),
      String(t.statistics.points)
    ]);

    triggerCSVDownload('tassia_standings_report_2026.csv', headers, rows);
  };

  // 2. Export Player Stats CSV
  const exportPlayerStatsCSV = () => {
    const headers = ['Player Name', 'Team', 'Position', 'Jersey Number', 'Goals', 'Assists', 'Yellow Cards', 'Red Cards', 'Appearances'];
    
    const rows = players.map(p => {
      const teamName = teams.find(t => t.id === p.teamId)?.name || 'Unknown';
      return [
        p.name,
        teamName,
        p.position,
        String(p.jerseyNumber),
        String(p.statistics.goals),
        String(p.statistics.assists),
        String(p.statistics.yellowCards),
        String(p.statistics.redCards),
        String(p.statistics.appearances)
      ];
    });

    triggerCSVDownload('tassia_player_statistics_leaderboard.csv', headers, rows);
  };

  // 3. Export Tournament Summary CSV
  const exportSummaryCSV = () => {
    const headers = ['Key Metric', 'Value'];
    const completedGames = matches.filter(m => m.status === 'completed').length;
    const totalGoals = players.reduce((sum, p) => sum + p.statistics.goals, 0);

    const rows = [
      ['Tournament Name', tournaments[0]?.name || 'Tassia Cup'],
      ['Season', tournaments[0]?.season || 'N/A'],
      ['Location Pitch', tournaments[0]?.location || 'N/A'],
      ['Total Registered Clubs', String(teams.length)],
      ['Total Active Athletes', String(players.length)],
      ['Total Match Fixtures Played', String(completedGames)],
      ['Total Community Goals Scored', String(totalGoals)],
      ['Sponsor Tiers', 'Platinum (2), Gold (2), Silver (1)'],
      ['Portal Admin Status', 'Operational']
    ];

    triggerCSVDownload('tassia_tournament_summary_2026.csv', headers, rows);
  };

  // 4. Export Match Referee Report CSV
  const exportRefereeReportCSV = () => {
    const headers = ['Fixture ID', 'Date', 'Teams', 'Score', 'Ref ID', 'Incidents Count'];
    const rows = matches.map(m => {
      const hName = teams.find(t => t.id === m.homeTeamId)?.name || 'TBD';
      const aName = teams.find(t => t.id === m.awayTeamId)?.name || 'TBD';
      return [
        m.id,
        m.date,
        `${hName} vs ${aName}`,
        m.status === 'scheduled' ? 'N/A' : `${m.homeScore}-${m.awayScore}`,
        m.refereeId || 'N/A',
        String(m.events.length)
      ];
    });

    triggerCSVDownload('tassia_referee_match_report.csv', headers, rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div>
        <span className="text-xs font-bold font-mono text-indigo-600 uppercase tracking-widest block mb-1">
          Export & Reporting Desk
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Downloadable Reports & Audits
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Download live CSV tables of standings, individual athlete cards, or referee checklists immediately.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs hover:border-indigo-100 transition-all space-y-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Standings Ledger</h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Current rankings, points, wins, and goal differences for all 8 grassroots clubs.
            </p>
          </div>
          <button
            onClick={exportStandingsCSV}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Download className="w-3.5 h-3.5" /> Export Standings CSV
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs hover:border-indigo-100 transition-all space-y-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <Clipboard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Player Statistics</h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Goals, assists, cards, appearances, and minutes played for all registered athletes.
            </p>
          </div>
          <button
            onClick={exportPlayerStatsCSV}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Download className="w-3.5 h-3.5" /> Export Player Stats CSV
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs hover:border-indigo-100 transition-all space-y-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Tournament Summary</h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Aggregated system metadata, metrics, and count of active tournaments and sponsors.
            </p>
          </div>
          <button
            onClick={exportSummaryCSV}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Download className="w-3.5 h-3.5" /> Export Summary CSV
          </button>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs hover:border-indigo-100 transition-all space-y-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Referee Match Audits</h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Checksheets of scores, registered goals, substitutions, cards and referee IDs.
            </p>
          </div>
          <button
            onClick={exportRefereeReportCSV}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Download className="w-3.5 h-3.5" /> Export Referee Report
          </button>
        </div>
      </div>

      {/* Visual report view layout */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="font-display font-bold text-sm text-gray-900 uppercase tracking-wide">
            Matchday Attendance & Security Logs Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold font-mono">
                <th className="p-3">Match Date</th>
                <th className="p-3">Venue Location</th>
                <th className="p-3">Fixture</th>
                <th className="p-3 text-center">Estimated Fans</th>
                <th className="p-3 text-center">Referee Status</th>
                <th className="p-3 text-right">Gate Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600 font-semibold">
              <tr>
                <td className="p-3">2026-06-25</td>
                <td className="p-3">Tassia Ground, Pitch A</td>
                <td className="p-3">Hurricanes vs Embakasi</td>
                <td className="p-3 text-center">3,200</td>
                <td className="p-3 text-center">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">APPROVED</span>
                </td>
                <td className="p-3 text-right text-gray-400">Normal Security</td>
              </tr>
              <tr>
                <td className="p-3">2026-06-26</td>
                <td className="p-3">Tassia Ground, Pitch B</td>
                <td className="p-3">Pipeline vs Kware</td>
                <td className="p-3 text-center">1,800</td>
                <td className="p-3 text-center">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">APPROVED</span>
                </td>
                <td className="p-3 text-right text-gray-400">Normal Security</td>
              </tr>
              <tr>
                <td className="p-3">2026-06-28</td>
                <td className="p-3">Tassia Ground, Pitch A</td>
                <td className="p-3">Hurricanes vs Pipeline (Live)</td>
                <td className="p-3 text-center">2,400</td>
                <td className="p-3 text-center">
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">ONGOING</span>
                </td>
                <td className="p-3 text-right text-gray-400">Increased Patrol</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
