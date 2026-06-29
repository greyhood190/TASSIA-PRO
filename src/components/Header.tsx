import React, { useState } from 'react';
import { UserRole, AppNotification, User } from '../types';
import { Search, Bell, Shield, Eye, Calendar, Trophy, Users, Star, MessageSquare, Newspaper, X, Check, LogIn, LogOut, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'live' | 'fixtures' | 'reports') => void;
  currentView: string;
  liveMatchCount: number;
  onOpenLiveMatch: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  isCloudSynced?: boolean;
}

export default function Header({
  activeRole,
  onRoleChange,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  searchTerm,
  onSearchChange,
  onNavigate,
  currentView,
  liveMatchCount,
  onOpenLiveMatch,
  currentUser,
  onLogout,
  onOpenAuth,
  isCloudSynced,
}: HeaderProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const roles = [
    { value: UserRole.SUPER_ADMIN, label: 'Super Admin', desc: 'Manage system settings, analytics & reports', icon: Shield },
    { value: UserRole.ORGANIZER, label: 'Tournament Organizer', desc: 'Create tournaments, fixtures & teams', icon: Trophy },
    { value: UserRole.REFEREE, label: 'Match Referee', desc: 'Update scores, record match events live', icon: Calendar },
    { value: UserRole.COACH, label: 'Team Coach', desc: 'Manage your squad and view player stats', icon: Users },
    { value: UserRole.PLAYER, label: 'Player Profile', desc: 'View stats, fixture sheets & your QR profile', icon: Star },
    { value: UserRole.FAN, label: 'Fan Hub', desc: 'Follow teams, vote in polls & post comments', icon: MessageSquare },
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-rose-500 text-white hover:bg-rose-600';
      case UserRole.ORGANIZER: return 'bg-amber-400 text-indigo-950 hover:bg-amber-500';
      case UserRole.REFEREE: return 'bg-yellow-400 text-indigo-950 hover:bg-yellow-500';
      case UserRole.COACH: return 'bg-emerald-400 text-indigo-950 hover:bg-emerald-500';
      case UserRole.PLAYER: return 'bg-sky-400 text-indigo-950 hover:bg-sky-500';
      case UserRole.FAN: return 'bg-purple-500 text-white hover:bg-purple-600';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-indigo-700 text-white border-b border-indigo-800 shadow-lg">
      {/* Top Bar for Live Match Warning */}
      {liveMatchCount > 0 && (
        <div className="w-full bg-emerald-500 text-indigo-950 text-xs py-2 px-4 font-extrabold flex items-center justify-between border-b border-emerald-400/20">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-950 animate-ping" />
            <span><strong>LIVE NOW:</strong> Tassia Community Cup matches are currently in progress!</span>
          </div>
          <button
            onClick={onOpenLiveMatch}
            className="underline hover:text-indigo-900 transition-colors cursor-pointer text-xs font-black uppercase tracking-wider"
          >
            Enter Match Center &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center text-indigo-900 shadow-md shadow-emerald-400/20 group-hover:scale-105 transition-all">
                <Trophy className="w-5 h-5 text-indigo-900 fill-indigo-900" />
              </div>
              <div>
                <span className="block font-display text-lg font-black tracking-tight leading-tight text-white flex items-center gap-1">
                  TASSIA <span className="font-light text-emerald-300">PRO</span>
                </span>
                <span className="block text-[9px] font-mono text-emerald-300/80 tracking-widest uppercase font-bold">
                  Grassroots Portal
                </span>
              </div>
            </button>

            {isCloudSynced ? (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/70 border border-indigo-500/50 text-[10px] font-mono font-black text-emerald-300 uppercase tracking-wider rounded-lg shadow-inner" title="Your grassroots database is synchronized in real-time with Google Cloud Firestore!">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Firestore Live
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/40 border border-indigo-600/30 text-[10px] font-mono font-bold text-indigo-200 uppercase tracking-wider rounded-lg" title="Running in local fallback database mode.">
                Local DB
              </div>
            )}

            {/* Main Menu Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('landing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'landing' ? 'text-indigo-950 bg-emerald-400 shadow-sm' : 'text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50'
                }`}
              >
                Home Portal
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'dashboard' ? 'text-indigo-950 bg-emerald-400 shadow-sm' : 'text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50'
                }`}
              >
                My Dashboard
              </button>
              <button
                onClick={() => onNavigate('live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'live' ? 'text-indigo-950 bg-emerald-400 shadow-sm' : 'text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50'
                }`}
              >
                Match Center
              </button>
              <button
                onClick={() => onNavigate('fixtures')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'fixtures' ? 'text-indigo-950 bg-emerald-400 shadow-sm' : 'text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50'
                }`}
              >
                Brackets & Fixtures
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'reports' ? 'text-indigo-950 bg-emerald-400 shadow-sm' : 'text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50'
                }`}
              >
                Export Reports
              </button>
            </nav>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-4">
            {/* Global Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50 rounded-lg transition-colors cursor-pointer"
              title="Global Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-indigo-100 hover:text-emerald-300 hover:bg-indigo-600/50 rounded-lg transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-400 text-indigo-950 text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-gray-50">
                    <span className="font-semibold text-xs text-gray-700">Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">
                        No recent notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-2.5 border-b border-gray-50/50 last:border-b-0 ${
                            !n.read ? 'bg-indigo-50/25' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'goal' ? '⚽' : n.type === 'fixture' ? '📅' : '📢'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 leading-snug">{n.title}</p>
                            <p className="text-[11px] text-gray-500 leading-normal mt-0.5">{n.content}</p>
                            <span className="text-[9px] text-gray-400 font-mono mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => onMarkNotificationRead(n.id)}
                              className="text-gray-300 hover:text-indigo-600 cursor-pointer"
                              title="Mark read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Simulation Role Selection badge */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${getRoleBadgeColor(
                  activeRole
                )}`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role:</span>{' '}
                {roles.find(r => r.value === activeRole)?.label}
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-50 mb-1">
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Role Simulator
                    </span>
                    <p className="text-[11px] text-gray-500">
                      Swap viewpoints instantly to test each user dashboard tier.
                    </p>
                  </div>
                  <div className="grid gap-1">
                    {roles.map(role => {
                      const Icon = role.icon;
                      const isActive = activeRole === role.value;
                      return (
                        <button
                          key={role.value}
                          onClick={() => {
                            onRoleChange(role.value);
                            setShowRoleMenu(false);
                            onNavigate('dashboard');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className={`mt-0.5 p-1 rounded ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-semibold leading-none mb-1">{role.label}</span>
                            <span className="block text-[10px] text-gray-400 leading-tight">{role.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Google / Standard User Account Profile */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-9 h-9 rounded-full bg-emerald-400 text-indigo-950 hover:bg-emerald-300 font-black text-xs flex items-center justify-center border-2 border-white cursor-pointer shadow-md transition-all uppercase"
                    title={currentUser.name}
                  >
                    {currentUser.name.charAt(0)}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-50 text-left">
                      <div className="text-center pb-3 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 font-black text-base flex items-center justify-center mx-auto mb-2 uppercase">
                          {currentUser.name.charAt(0)}
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">{currentUser.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{currentUser.email}</p>
                        
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full">
                          <UserCheck className="w-3 h-3" />
                          Verified Athlete Portal
                        </span>
                      </div>

                      <div className="py-2.5 space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Active Profile Access
                        </div>
                        <div className="px-2 py-1.5 bg-indigo-50/50 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-900">
                          <span>Role Level</span>
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] uppercase font-black tracking-wider rounded-sm">
                            {activeRole.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full mt-2 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-indigo-950 font-black rounded-lg text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-950" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 px-4 z-50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tournaments, clubs, players, matches, news..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  onSearchChange('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick tips or Search results in modal */}
            <div className="p-4 bg-gray-50/50 max-h-80 overflow-y-auto">
              {searchTerm ? (
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Search Matches
                  </span>
                  {/* Results preview can be rendered here or handled dynamically */}
                  <div className="text-xs text-gray-500">
                    Type query to filter list contents instantly across the portal.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Quick Links
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { onNavigate('live'); setShowSearchModal(false); }}
                      className="px-3 py-2 bg-white hover:bg-indigo-50/50 border border-gray-100 rounded-xl text-left text-xs font-semibold text-gray-700 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>⚡</span> Live Match Center
                    </button>
                    <button
                      onClick={() => { onNavigate('fixtures'); setShowSearchModal(false); }}
                      className="px-3 py-2 bg-white hover:bg-indigo-50/50 border border-gray-100 rounded-xl text-left text-xs font-semibold text-gray-700 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>🏆</span> Bracket Generator
                    </button>
                    <button
                      onClick={() => { onNavigate('reports'); setShowSearchModal(false); }}
                      className="px-3 py-2 bg-white hover:bg-indigo-50/50 border border-gray-100 rounded-xl text-left text-xs font-semibold text-gray-700 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>📊</span> Download Reports
                    </button>
                    <button
                      onClick={() => { onNavigate('landing'); setShowSearchModal(false); }}
                      className="px-3 py-2 bg-white hover:bg-indigo-50/50 border border-gray-100 rounded-xl text-left text-xs font-semibold text-gray-700 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>📰</span> Community News
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
