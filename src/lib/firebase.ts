import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Initialize Firestore - check if custom databaseId is provided in config
const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };
