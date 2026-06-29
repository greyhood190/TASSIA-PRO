import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Check, AlertCircle, RefreshCw, Key, Shield, Eye, EyeOff } from 'lucide-react';
import { User, UserRole } from '../types';
import { 
  registerUserInFirestore, 
  findUserByEmailInFirestore, 
  updateUserPasswordInFirestore 
} from '../lib/firestoreService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

// Simple user structure for local storage authentication database
interface LocalAuthUser extends User {
  passwordHash: string;
}

const LOCAL_USERS_KEY = 'tassia_pro_users_db_v1';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  activeRole,
  onRoleChange,
}: AuthModalProps) {
  const [view, setView] = useState<'signin' | 'signup' | 'forgot' | 'google_signin' | 'google_signup'>('signin');
  
  // General Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FAN);
  
  // Google Flow state
  const [googleUsername, setGoogleUsername] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleConfirmPassword, setGoogleConfirmPassword] = useState('');
  const [googleFirstName, setGoogleFirstName] = useState('');
  const [googleLastName, setGoogleLastName] = useState('');
  const [googleEmailOrPhone, setGoogleEmailOrPhone] = useState('');

  // Password reset flow
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize custom users list in localStorage if not exists
  useEffect(() => {
    const existing = localStorage.getItem(LOCAL_USERS_KEY);
    if (!existing) {
      const defaultUsers: LocalAuthUser[] = [
        {
          id: 'usr_stevomunyue',
          name: 'Stevo Munyue',
          email: 'stevomunyue2020@gmail.com',
          role: UserRole.FAN,
          isVerified: true,
          passwordHash: 'password123',
        },
        {
          id: 'usr_admin',
          name: 'Tournament Director',
          email: 'admin@tassiapro.com',
          role: UserRole.SUPER_ADMIN,
          isVerified: true,
          passwordHash: 'admin123',
        },
        {
          id: 'usr_referee',
          name: 'Daniel Wanyama',
          email: 'referee@tassiapro.com',
          role: UserRole.REFEREE,
          isVerified: true,
          passwordHash: 'referee123',
        },
        {
          id: 'usr_coach',
          name: 'Patrick Mwangi',
          email: 'coach@tassiapro.com',
          role: UserRole.COACH,
          isVerified: true,
          passwordHash: 'coach123',
        }
      ];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  if (!isOpen) return null;

  // Helper: Fetch all users from simulator DB
  const getStoredUsers = (): LocalAuthUser[] => {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  };

  // Helper: Save user list to simulator DB
  const saveStoredUsers = (users: LocalAuthUser[]) => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setGoogleUsername('');
    setGooglePassword('');
    setGoogleConfirmPassword('');
    setGoogleFirstName('');
    setGoogleLastName('');
    setGoogleEmailOrPhone('');
    setResetStep(1);
    onClose();
  };

  // Google SVG Brand icon helper
  const GoogleLogo = () => (
    <svg className="w-5 h-5 mr-2 inline-block" viewBox="0 0 24 24" width="24" height="24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  // Mode submissions
  const handleStandardSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Check Firestore
      let matched = await findUserByEmailInFirestore(email);

      // 2. If not found in Firestore, check local database fallback
      if (!matched) {
        const users = getStoredUsers();
        const localMatched = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (localMatched && localMatched.passwordHash === password) {
          // Sync them to Firestore immediately!
          matched = await registerUserInFirestore(
            localMatched.id,
            localMatched.name,
            localMatched.email,
            localMatched.role,
            localMatched.passwordHash
          );
        }
      }

      if (!matched || matched.passwordHash !== password) {
        setError('Invalid email address or password.');
        setIsLoading(false);
        return;
      }

      // Successful Sign-In!
      onRoleChange(matched.role);
      onLoginSuccess(matched);
      setSuccess(`Welcome back, ${matched.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(`Database error: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  const handleStandardSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Check if user already exists in Firestore or local storage fallback
      const existingFirestoreUser = await findUserByEmailInFirestore(email);
      const localUsers = getStoredUsers();
      const existingLocalUser = localUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (existingFirestoreUser || existingLocalUser) {
        setError('This email address is already registered.');
        setIsLoading(false);
        return;
      }

      // 2. Create user record
      const userId = `usr_${Date.now()}`;
      const newUser = await registerUserInFirestore(
        userId,
        fullName.trim(),
        email.trim().toLowerCase(),
        selectedRole,
        password
      );

      // Save to local fallback too
      const localRecord: LocalAuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        passwordHash: newUser.passwordHash
      };
      saveStoredUsers([...localUsers, localRecord]);

      // Log them in immediately
      onRoleChange(newUser.role);
      onLoginSuccess(newUser);
      setSuccess('Account created successfully in Firebase! Welcome to Tassia Pro.');
      
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 1200);
    } catch (err: any) {
      setError(`Firebase error: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  // Google Simulated Login Submit
  const handleGoogleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!googleEmailOrPhone) {
      setError('Enter an email or phone number.');
      return;
    }

    setIsLoading(true);
    try {
      let targetEmail = googleEmailOrPhone.trim();
      if (!targetEmail.includes('@')) {
        targetEmail = `${targetEmail}@gmail.com`;
      }

      // Query Firestore
      let matched = await findUserByEmailInFirestore(targetEmail);

      // Local fallback
      if (!matched) {
        const users = getStoredUsers();
        const localMatched = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
        if (localMatched && (!googlePassword || localMatched.passwordHash === googlePassword)) {
          // Sync on-the-fly
          matched = await registerUserInFirestore(
            localMatched.id,
            localMatched.name,
            localMatched.email,
            localMatched.role,
            localMatched.passwordHash
          );
        }
      }

      if (!matched) {
        setError('Google account not found in our database. Tap "Create account" below.');
        setIsLoading(false);
        return;
      }

      // Google Accounts generally require password check if they pre-registered
      if (googlePassword) {
        if (matched.passwordHash !== googlePassword) {
          setError('Wrong password. Try again or reset it.');
          setIsLoading(false);
          return;
        }
      } else {
        // Ask for password
        setSuccess('Account located. Please enter your Google password.');
        setIsLoading(false);
        return;
      }

      onRoleChange(matched.role);
      onLoginSuccess(matched);
      setSuccess(`Signed in with Google as ${matched.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(`Database error: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  // Google Simulated Signup Submit (Creating custom Gmail address!)
  const handleGoogleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!googleFirstName || !googleLastName || !googleUsername || !googlePassword || !googleConfirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (googlePassword !== googleConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (googlePassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (googleUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    const createdGmail = `${googleUsername.trim().toLowerCase()}@gmail.com`;

    setIsLoading(true);
    try {
      // Check existing
      const existingFirestoreUser = await findUserByEmailInFirestore(createdGmail);
      const localUsers = getStoredUsers();
      const existingLocalUser = localUsers.some(u => u.email.toLowerCase() === createdGmail);

      if (existingFirestoreUser || existingLocalUser) {
        setError('That Google username is taken. Try another.');
        setIsLoading(false);
        return;
      }

      // Register
      const userId = `usr_g_${Date.now()}`;
      const newUser = await registerUserInFirestore(
        userId,
        `${googleFirstName.trim()} ${googleLastName.trim()}`,
        createdGmail,
        selectedRole,
        googlePassword
      );

      // Save to local fallback
      const localRecord: LocalAuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        passwordHash: newUser.passwordHash
      };
      saveStoredUsers([...localUsers, localRecord]);

      // Log them in
      onRoleChange(newUser.role);
      onLoginSuccess(newUser);
      setSuccess(`Your brand-new Google email ${createdGmail} was created in Firebase! Redirecting...`);
      
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(`Firebase error: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  // Forgot password flow
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (resetStep === 1) {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }

      setIsLoading(true);
      try {
        // Find in Firestore
        let matched = await findUserByEmailInFirestore(email);

        // Fallback local
        if (!matched) {
          const users = getStoredUsers();
          const localMatched = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
          if (localMatched) {
            matched = await registerUserInFirestore(
              localMatched.id,
              localMatched.name,
              localMatched.email,
              localMatched.role,
              localMatched.passwordHash
            );
          }
        }

        if (!matched) {
          setError('No account found with this email address.');
          setIsLoading(false);
          return;
        }

        // Generate simulated 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSentCode(code);
        setSuccess(`A password reset code has been sent to ${email}.`);
        setResetStep(2);
        setIsLoading(false);
        
        // Output code in a clear UI alert to make it incredibly functional & playable
        alert(`[SIMULATION ALERT] A password reset code has been sent to ${email}.\nYour 6-Digit Code is: ${code}`);
      } catch (err: any) {
        setError(`Database error: ${err.message || err}`);
        setIsLoading(false);
      }
    } else if (resetStep === 2) {
      if (!verificationCode) {
        setError('Please enter the 6-digit code.');
        return;
      }

      if (verificationCode !== sentCode) {
        setError('Incorrect verification code. Please try again.');
        return;
      }

      setResetStep(3);
    } else if (resetStep === 3) {
      if (!newPassword || !confirmNewPassword) {
        setError('Please fill in all password fields.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      setIsLoading(true);
      try {
        // 1. Find user in Firestore
        const matched = await findUserByEmailInFirestore(email);
        if (matched) {
          await updateUserPasswordInFirestore(matched.id, newPassword);
        }

        // 2. Fallback update local storage too
        const users = getStoredUsers();
        const updatedUsers = users.map(u => {
          if (u.email.toLowerCase() === email.toLowerCase()) {
            return { ...u, passwordHash: newPassword };
          }
          return u;
        });
        saveStoredUsers(updatedUsers);

        setSuccess('Password updated successfully in Firebase! You can now sign in.');
        
        setTimeout(() => {
          setIsLoading(false);
          setView('signin');
          setResetStep(1);
          setEmail('');
          setPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setVerificationCode('');
        }, 1200);
      } catch (err: any) {
        setError(`Firebase error: ${err.message || err}`);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className={`w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
          view.startsWith('google') ? 'border-gray-200' : 'border-indigo-100'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-6 flex items-center justify-between border-b ${
          view.startsWith('google') ? 'bg-gray-50 border-gray-100' : 'bg-gradient-to-r from-indigo-900 to-indigo-950 text-white border-indigo-800'
        }`}>
          <div>
            <span className={`block text-[10px] font-mono uppercase tracking-widest font-black ${
              view.startsWith('google') ? 'text-gray-400' : 'text-emerald-300'
            }`}>
              {view.startsWith('google') ? 'Google Account Service' : 'TASSIA TOURNAMENT PRO'}
            </span>
            <h3 className={`text-base font-black tracking-tight ${
              view.startsWith('google') ? 'text-gray-900' : 'text-white'
            }`}>
              {view === 'signin' && 'Sign In to Portal'}
              {view === 'signup' && 'Create Free Account'}
              {view === 'forgot' && 'Account Recovery'}
              {view === 'google_signin' && 'Sign in with Google'}
              {view === 'google_signup' && 'Create your Gmail Account'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
              view.startsWith('google') ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-indigo-800 text-indigo-200 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {/* Alerts */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-pulse">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2.5">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. SIGN IN VIEW */}
          {view === 'signin' && (
            <form onSubmit={handleStandardSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-700/15 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sign In Now'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-slate-200" />
                <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={() => setView('google_signin')}
                className="w-full py-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs hover:bg-indigo-50/10"
              >
                <GoogleLogo />
                Continue with Google
              </button>

              <div className="text-center pt-3 text-[11px] text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Create one free &rarr;
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGN UP VIEW */}
          {view === 'signup' && (
            <form onSubmit={handleStandardSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setView('google_signup')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline mt-1.5 flex items-center gap-1 cursor-pointer"
                >
                  <span className="text-[10px]">✨</span> Create a new @gmail.com address instead
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">App Role Profile</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700"
                >
                  <option value={UserRole.FAN}>⚽ Fan / Community Supporter</option>
                  <option value={UserRole.PLAYER}>🏃 Professional Player</option>
                  <option value={UserRole.COACH}>📋 Club Coach / Manager</option>
                  <option value={UserRole.REFEREE}>🏁 Tournament Referee</option>
                  <option value={UserRole.ORGANIZER}>🏆 Local Tournament Organizer</option>
                </select>
                <span className="block text-[10px] text-slate-400 mt-1">
                  Swaps dashboard access levels instantly when you log in!
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-700/15 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Register & Log In'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center pt-2 text-[11px] text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Sign In here &rarr;
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD VIEW */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-2">
                  <Key className="w-6 h-6 text-indigo-700" />
                </div>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  {resetStep === 1 && 'Enter your registered email address below. We will send a simulated recovery code to reset your credentials.'}
                  {resetStep === 2 && `Enter the 6-digit verification code sent to ${email}.`}
                  {resetStep === 3 && 'Choose a strong, secure password for your account recovery.'}
                </p>
              </div>

              {resetStep === 1 && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>
              )}

              {resetStep === 2 && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Verification Code</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="6-Digit Code"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-mono"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400 text-center mt-2">
                    Check your system alert banner for the simulated code!
                  </span>
                </div>
              )}

              {resetStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-700/15 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : resetStep === 1 ? (
                  'Send Recovery Code'
                ) : resetStep === 2 ? (
                  'Verify Code'
                ) : (
                  'Update Password'
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('signin');
                    setResetStep(1);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  &larr; Back to Login
                </button>
              </div>
            </form>
          )}

          {/* 4. GOOGLE BRANDED SIGN IN VIEW (`google_signin`) */}
          {view === 'google_signin' && (
            <form onSubmit={handleGoogleSignInSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="inline-block p-2 bg-slate-50 rounded-full mb-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h4 className="font-display text-lg font-bold text-gray-800 leading-tight">Google Sign In</h4>
                <p className="text-xs text-gray-500 mt-1">Use your Google or Gmail account to connect</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Email or Phone</label>
                <input
                  type="text"
                  placeholder="e.g. stevomunyue2020@gmail.com"
                  value={googleEmailOrPhone}
                  onChange={(e) => setGoogleEmailOrPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Google password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Default passwords are e.g. "password123" for pre-seeded users.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setView('google_signup')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Create Google Account
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Next'}
                  {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-100 text-[11px] text-gray-500">
                Want to sign in with standard email instead?{' '}
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Standard Sign In &rarr;
                </button>
              </div>
            </form>
          )}

          {/* 5. GOOGLE BRANDED SIGN UP VIEW (`google_signup`) */}
          {view === 'google_signup' && (
            <form onSubmit={handleGoogleSignUpSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-block p-1 bg-slate-50 rounded-full mb-1">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h4 className="font-display text-base font-bold text-gray-800 leading-tight">Create a Google Account</h4>
                <p className="text-[11px] text-gray-500">Choose your username to create your new @gmail.com email</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={googleFirstName}
                    onChange={(e) => setGoogleFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={googleLastName}
                    onChange={(e) => setGoogleLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Choose your Gmail username</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="username"
                    value={googleUsername}
                    onChange={(e) => setGoogleUsername(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-l-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 border-r-0"
                  />
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-xs font-bold text-gray-500 select-none">
                    @gmail.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Choose App Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500 text-gray-700"
                >
                  <option value={UserRole.FAN}>⚽ Fan / Supporters Tier</option>
                  <option value={UserRole.PLAYER}>🏃 Professional Player</option>
                  <option value={UserRole.COACH}>📋 Coach / Club Manager</option>
                  <option value={UserRole.REFEREE}>🏁 Match Referee</option>
                  <option value={UserRole.ORGANIZER}>🏆 Tournament Organizer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Confirm</label>
                  <input
                    type="password"
                    placeholder="Confirm"
                    value={googleConfirmPassword}
                    onChange={(e) => setGoogleConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setView('google_signin')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Sign in instead
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
