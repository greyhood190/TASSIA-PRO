import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { User, UserRole } from '../types';
import { DatabaseState } from '../data';

const USERS_COLLECTION = 'users';
const APP_STATE_COLLECTION = 'app_state';
const APP_STATE_DOCUMENT_ID = 'tassia_pro_shared_state';

export interface FirestoreUser extends User {
  passwordHash: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Handle Firestore permission or generic errors with a structured JSON format required by the platform.
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Register a new user in Firestore
 */
export async function registerUserInFirestore(
  userId: string,
  name: string,
  email: string,
  role: UserRole,
  passwordHash: string
): Promise<FirestoreUser> {
  const path = `${USERS_COLLECTION}/${userId}`;
  const userRef = doc(db, USERS_COLLECTION, userId);
  const newUser: FirestoreUser = {
    id: userId,
    name,
    email: email.toLowerCase().trim(),
    role,
    isVerified: true,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(userRef, newUser);
    return newUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Fetch user by email to support Sign In and password retrieval
 */
export async function findUserByEmailInFirestore(email: string): Promise<FirestoreUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    return userDoc.data() as FirestoreUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, USERS_COLLECTION);
  }
}

/**
 * Update user's password in Firestore
 */
export async function updateUserPasswordInFirestore(userId: string, newPasswordHash: string): Promise<void> {
  const path = `${USERS_COLLECTION}/${userId}`;
  const userRef = doc(db, USERS_COLLECTION, userId);
  try {
    await updateDoc(userRef, {
      passwordHash: newPasswordHash
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save / sync the entire sports portal database state to Firestore
 */
export async function saveDatabaseToFirestore(state: DatabaseState): Promise<void> {
  const path = `${APP_STATE_COLLECTION}/${APP_STATE_DOCUMENT_ID}`;
  try {
    const docRef = doc(db, APP_STATE_COLLECTION, APP_STATE_DOCUMENT_ID);
    await setDoc(docRef, {
      ...state,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // Soft log but throw structured error to propagate diagnostics
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (thrownError) {
      console.error('Failed to sync state to Firestore:', error);
      throw thrownError;
    }
  }
}

/**
 * Load the shared sports portal database state from Firestore
 */
export async function loadDatabaseFromFirestore(): Promise<DatabaseState | null> {
  const path = `${APP_STATE_COLLECTION}/${APP_STATE_DOCUMENT_ID}`;
  try {
    const docRef = doc(db, APP_STATE_COLLECTION, APP_STATE_DOCUMENT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove metadata if present
      delete data.lastUpdated;
      return data as DatabaseState;
    }
    return null;
  } catch (error) {
    // Soft log but throw structured error to propagate diagnostics
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (thrownError) {
      console.error('Failed to load state from Firestore:', error);
      throw thrownError;
    }
  }
}
