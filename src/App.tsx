import React, { useState, useEffect } from 'react';
import { UserRole, Tournament, Team, Player, Match, News, Poll, AppNotification, MatchEvent, User } from './types';
import { getDatabase, saveDatabase } from './data';
import { saveDatabaseToFirestore, loadDatabaseFromFirestore } from './lib/firestoreService';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './lib/firebase';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboards from './components/Dashboards';
import LiveMatchCenter from './components/LiveMatchCenter';
import FixtureGenerator from './components/FixtureGenerator';
import Reports from './components/Reports';
import AuthModal from './components/AuthModal';

export default function App() {
  // Navigation & Simulation state
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.FAN);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'live' | 'fixtures' | 'reports'>('landing');
  const [searchTerm, setSearchTerm] = useState('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tassia_pro_logged_in_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync user profile state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tassia_pro_logged_in_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tassia_pro_logged_in_user');
    }
  }, [currentUser]);

  // Loaded database state
  const [dbState, setDbState] = useState(() => getDatabase());
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isFirebaseAuthed, setIsFirebaseAuthed] = useState(false);

  // Sign in anonymously and load from Firestore on mount
  useEffect(() => {
    const initFirebase = async () => {
      try {
        await signInAnonymously(auth);
        setIsFirebaseAuthed(true);
        
        const cloudData = await loadDatabaseFromFirestore();
        if (cloudData) {
          setDbState(cloudData);
          setIsCloudSynced(true);
        }
      } catch (err) {
        console.warn('Could not load from Firestore database, using local storage fallback:', err);
      }
    };
    initFirebase();
  }, []);

  // Save changes to localStorage and Firestore on state change
  useEffect(() => {
    saveDatabase(dbState);
    
    // Save to Firestore asynchronously if authenticated
    if (isFirebaseAuthed) {
      const syncToCloud = async () => {
        try {
          await saveDatabaseToFirestore(dbState);
          setIsCloudSynced(true);
        } catch (err) {
          console.warn('Could not sync to Firestore:', err);
          setIsCloudSynced(false);
        }
      };
      syncToCloud();
    }
  }, [dbState, isFirebaseAuthed]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRole(UserRole.FAN);
  };

  // Handler: Update active role
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };

  // Handler: Mark notification as read
  const handleMarkNotificationRead = (id: string) => {
    setDbState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  // Handler: Clear all notifications
  const handleClearNotifications = () => {
    setDbState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  // Handler: Add custom tournament (Tournament Module)
  const handleAddTournament = (newTournament: Tournament) => {
    setDbState((prev) => ({
      ...prev,
      tournaments: [newTournament, ...prev.tournaments],
    }));
  };

  // Handler: Add custom team (Team Module)
  const handleAddTeam = (newTeam: Team) => {
    setDbState((prev) => ({
      ...prev,
      teams: [newTeam, ...prev.teams],
    }));
  };

  // Handler: Add custom player (Player Module)
  const handleAddPlayer = (newPlayer: Player) => {
    setDbState((prev) => {
      // Increment squad count in team statistics
      const updatedTeams = prev.teams.map((t) =>
        t.id === newPlayer.teamId ? { ...t, playersCount: t.playersCount + 1 } : t
      );
      return {
        ...prev,
        players: [newPlayer, ...prev.players],
        teams: updatedTeams,
      };
    });
  };

  // Handler: Add custom published news article (News Module)
  const handleAddNews = (newNews: News) => {
    setDbState((prev) => ({
      ...prev,
      news: [newNews, ...prev.news],
    }));
  };

  // Handler: Like news article
  const handleLikeNews = (id: string) => {
    setDbState((prev) => ({
      ...prev,
      news: prev.news.map((n) => {
        if (n.id === id) {
          const isLiked = n.likedBy.includes(activeRole);
          const likedBy = isLiked
            ? n.likedBy.filter((role) => role !== activeRole)
            : [...n.likedBy, activeRole];
          const likesCount = isLiked ? n.likesCount - 1 : n.likesCount + 1;
          return { ...n, likedBy, likesCount };
        }
        return n;
      }),
    }));
  };

  // Handler: Add user comment to news article
  const handleAddComment = (newsId: string, content: string) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      userId: `usr_${activeRole}`,
      userName: activeRole.replace('_', ' ').toUpperCase(),
      content,
      createdAt: new Date().toISOString(),
    };

    setDbState((prev) => ({
      ...prev,
      news: prev.news.map((n) =>
        n.id === newsId
          ? { ...n, comments: [...n.comments, newComment], commentsCount: n.commentsCount + 1 }
          : n
      ),
    }));
  };

  // Handler: Add user comment to live match timeline
  const handleAddMatchComment = (matchId: string, author: string, content: string) => {
    const newCommentEvent: MatchEvent = {
      id: `mcomm_${Date.now()}`,
      time: 0,
      type: 'commentary' as any,
      detail: `💬 Fan Comment [${author || 'Anon Fan'}]: ${content}`,
    };

    setDbState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId ? { ...m, events: [newCommentEvent, ...m.events] } : m
      ),
    }));
  };

  // Handler: Add/append match event live from referee panel
  const handleUpdateMatchEvent = (matchId: string, event: Omit<MatchEvent, 'id'>) => {
    const finalEvent: MatchEvent = {
      ...event,
      id: `m_ev_${Date.now()}`,
    };

    setDbState((prev) => {
      // Check if event was a Goal, update scores dynamically
      let scoreUpdate = {};
      if (event.type === 'goal') {
        const match = prev.matches.find((m) => m.id === matchId);
        if (match) {
          const isHome = event.teamId === match.homeTeamId;
          scoreUpdate = {
            homeScore: isHome ? match.homeScore + 1 : match.homeScore,
            awayScore: isHome ? match.awayScore : match.awayScore + 1,
          };
        }
      }

      // Update player statistics if goals are recorded
      const updatedPlayers = prev.players.map((p) => {
        if (event.playerId && p.id === event.playerId) {
          if (event.type === 'goal') {
            return {
              ...p,
              statistics: { ...p.statistics, goals: p.statistics.goals + 1 },
            };
          }
          if (event.type === 'card' && event.cardColor === 'yellow') {
            return {
              ...p,
              statistics: { ...p.statistics, yellowCards: p.statistics.yellowCards + 1 },
            };
          }
          if (event.type === 'card' && event.cardColor === 'red') {
            return {
              ...p,
              statistics: { ...p.statistics, redCards: p.statistics.redCards + 1 },
            };
          }
        }
        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
        matches: prev.matches.map((m) =>
          m.id === matchId
            ? {
                ...m,
                events: [finalEvent, ...m.events],
                ...scoreUpdate,
              }
            : m
        ),
      };
    });
  };

  // Handler: Set match status live or completed, and update team points / records
  const handleUpdateMatchStatus = (
    matchId: string,
    status: Match['status'],
    homeScore?: number,
    awayScore?: number
  ) => {
    setDbState((prev) => {
      const match = prev.matches.find((m) => m.id === matchId);
      if (!match) return prev;

      const finalHomeScore = homeScore !== undefined ? homeScore : match.homeScore;
      const finalAwayScore = awayScore !== undefined ? awayScore : match.awayScore;

      // Recalculate standings IF match status shifts to COMPLETED
      let updatedTeams = [...prev.teams];
      if (status === 'completed' && match.status !== 'completed') {
        updatedTeams = prev.teams.map((t) => {
          // Home team
          if (t.id === match.homeTeamId) {
            const win = finalHomeScore > finalAwayScore;
            const draw = finalHomeScore === finalAwayScore;
            return {
              ...t,
              statistics: {
                wins: t.statistics.wins + (win ? 1 : 0),
                draws: t.statistics.draws + (draw ? 1 : 0),
                losses: t.statistics.losses + (!win && !draw ? 1 : 0),
                goalsFor: t.statistics.goalsFor + finalHomeScore,
                goalsAgainst: t.statistics.goalsAgainst + finalAwayScore,
                points: t.statistics.points + (win ? 3 : draw ? 1 : 0),
              },
            };
          }
          // Away team
          if (t.id === match.awayTeamId) {
            const win = finalAwayScore > finalHomeScore;
            const draw = finalHomeScore === finalAwayScore;
            return {
              ...t,
              statistics: {
                wins: t.statistics.wins + (win ? 1 : 0),
                draws: t.statistics.draws + (draw ? 1 : 0),
                losses: t.statistics.losses + (!win && !draw ? 1 : 0),
                goalsFor: t.statistics.goalsFor + finalAwayScore,
                goalsAgainst: t.statistics.goalsAgainst + finalHomeScore,
                points: t.statistics.points + (win ? 3 : draw ? 1 : 0),
              },
            };
          }
          return t;
        });
      } else if (status !== 'completed' && match.status === 'completed') {
        // Rollback previous calculations if status goes back to live or scheduled
        updatedTeams = prev.teams.map((t) => {
          if (t.id === match.homeTeamId) {
            const win = match.homeScore > match.awayScore;
            const draw = match.homeScore === match.awayScore;
            return {
              ...t,
              statistics: {
                wins: Math.max(0, t.statistics.wins - (win ? 1 : 0)),
                draws: Math.max(0, t.statistics.draws - (draw ? 1 : 0)),
                losses: Math.max(0, t.statistics.losses - (!win && !draw ? 1 : 0)),
                goalsFor: Math.max(0, t.statistics.goalsFor - match.homeScore),
                goalsAgainst: Math.max(0, t.statistics.goalsAgainst - match.awayScore),
                points: Math.max(0, t.statistics.points - (win ? 3 : draw ? 1 : 0)),
              },
            };
          }
          if (t.id === match.awayTeamId) {
            const win = match.awayScore > match.homeScore;
            const draw = match.homeScore === match.awayScore;
            return {
              ...t,
              statistics: {
                wins: Math.max(0, t.statistics.wins - (win ? 1 : 0)),
                draws: Math.max(0, t.statistics.draws - (draw ? 1 : 0)),
                losses: Math.max(0, t.statistics.losses - (!win && !draw ? 1 : 0)),
                goalsFor: Math.max(0, t.statistics.goalsFor - match.awayScore),
                goalsAgainst: Math.max(0, t.statistics.goalsAgainst - match.homeScore),
                points: Math.max(0, t.statistics.points - (win ? 3 : draw ? 1 : 0)),
              },
            };
          }
          return t;
        });
      }

      return {
        ...prev,
        teams: updatedTeams,
        matches: prev.matches.map((m) =>
          m.id === matchId
            ? {
                ...m,
                status,
                homeScore: finalHomeScore,
                awayScore: finalAwayScore,
              }
            : m
        ),
      };
    });
  };

  // Handler: Update active minute live timer on match
  const handleUpdateMatchTimer = (matchId: string, timerValue: number) => {
    setDbState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => (m.id === matchId ? { ...m, liveTimer: timerValue } : m)),
    }));
  };

  // Handler: Cast vote on a fan poll (Polls System)
  const handleVotePoll = (pollId: string, optionId: string) => {
    setDbState((prev) => ({
      ...prev,
      polls: prev.polls.map((poll) => {
        if (poll.id === pollId) {
          const userVotes = { ...poll.userVotes, [activeRole]: optionId };
          const options = poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return { ...poll, userVotes, options };
        }
        return poll;
      }),
    }));
  };

  // Handler: Clear all generated fixtures for a specific tournament (Organizer tool)
  const handleClearMatchesByTournament = (tournamentId: string) => {
    setDbState((prev) => ({
      ...prev,
      matches: prev.matches.filter((m) => m.tournamentId !== tournamentId),
    }));
  };

  // Handler: Append single manually/auto generated match (Fixture generator)
  const handleAddMatch = (newMatch: Match) => {
    setDbState((prev) => {
      // Check if match already exists by ID (replace/save edit) or push new
      const exists = prev.matches.some((m) => m.id === newMatch.id);
      const matches = exists
        ? prev.matches.map((m) => (m.id === newMatch.id ? newMatch : m))
        : [...prev.matches, newMatch];
      return { ...prev, matches };
    });
  };

  // Handler: Disband / Delete team
  const handleDeleteTeam = (teamId: string) => {
    setDbState((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
    }));
  };

  // Handler: Approve club
  const handleApproveClub = (teamId: string) => {
    // Already approved by default, dummy trigger
  };

  // Filter lists based on Global Search
  const filteredTournaments = dbState.tournaments.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTeams = dbState.teams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPlayers = dbState.players.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMatches = dbState.matches.filter((m) => {
    const homeName = dbState.teams.find((t) => t.id === m.homeTeamId)?.name || '';
    const awayName = dbState.teams.find((t) => t.id === m.awayTeamId)?.name || '';
    return (
      homeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      awayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const filteredNews = dbState.news.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const liveMatches = dbState.matches.filter((m) => m.status === 'live');

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen selection:bg-emerald-400 selection:text-indigo-950">
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        notifications={dbState.notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNavigate={setCurrentView}
        currentView={currentView}
        liveMatchCount={liveMatches.length}
        onOpenLiveMatch={() => setCurrentView('live')}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isCloudSynced={isCloudSynced}
      />

      <main className="transition-all duration-300">
        {currentView === 'landing' && (
          <LandingPage
            tournaments={filteredTournaments}
            teams={filteredTeams}
            players={filteredPlayers}
            matches={filteredMatches}
            news={filteredNews}
            sponsors={dbState.sponsors}
            media={dbState.media}
            onOpenMatch={() => setCurrentView('live')}
            onLikeNews={handleLikeNews}
            onAddComment={handleAddComment}
            currentUserRole={activeRole}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboards
            activeRole={activeRole}
            tournaments={filteredTournaments}
            teams={filteredTeams}
            players={filteredPlayers}
            matches={filteredMatches}
            news={filteredNews}
            polls={dbState.polls}
            notifications={dbState.notifications}
            onAddTournament={handleAddTournament}
            onAddTeam={handleAddTeam}
            onAddPlayer={handleAddPlayer}
            onAddNews={handleAddNews}
            onApproveClub={handleApproveClub}
            onDeleteTeam={handleDeleteTeam}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'live' && (
          <LiveMatchCenter
            matches={filteredMatches}
            teams={filteredTeams}
            players={filteredPlayers}
            activeRole={activeRole}
            polls={dbState.polls}
            onVotePoll={handleVotePoll}
            onAddMatchComment={handleAddMatchComment}
            onUpdateMatchEvent={handleUpdateMatchEvent}
            onUpdateMatchStatus={handleUpdateMatchStatus}
            onUpdateMatchTimer={handleUpdateMatchTimer}
          />
        )}

        {currentView === 'fixtures' && (
          <FixtureGenerator
            tournaments={filteredTournaments}
            teams={filteredTeams}
            matches={filteredMatches}
            onAddMatch={handleAddMatch}
            onClearMatchesByTournament={handleClearMatchesByTournament}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'reports' && (
          <Reports
            tournaments={filteredTournaments}
            teams={filteredTeams}
            players={filteredPlayers}
            matches={filteredMatches}
          />
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
