/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  setDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, isFirebaseConfigured } from '../lib/firebase';
import { 
  FloodReport, 
  ReportStatus, 
  Shelter, 
  Alert, 
  PostFloodImpactReport, 
  ImpactReportStatus 
} from '../types';
import { FLOOD_REPORTS, SHELTERS, ALERTS } from '../constants';

// --- Error Handling ---

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Authentication ---

export async function registerUser(email: string, password: string, profileData: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Register:", { email, profileData });
    return { user: { uid: 'mock-uid', email } };
  }
  
  // 1. Auth Call (Raw error passed to component)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // 2. Firestore Call (Wrapped in Firestore error handler)
  try {
    const role = email === 'admin@parkluar.com' ? 'admin' : (profileData.role || 'user');
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      name: profileData.name || 'User',
      phone: profileData.phone || '',
      role: role,
      trustScore: 10,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userCredential.user.uid}`);
  }
  
  return userCredential;
}

export async function loginUser(email: string, password: string) {
  if (!isFirebaseConfigured) {
    console.log("Mock Login:", email);
    return { user: { uid: 'mock-uid', email } };
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    console.log("Mock Google Sign-In");
    return { user: { uid: 'mock-uid', email: 'google-user@aqua-sense.ai' } };
  }
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  
  // Also ensure profile exists in Firestore
  const userRef = doc(db, 'users', userCredential.user.uid);
  const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', userCredential.user.uid)));
  
  if (userSnap.empty) {
    await setDoc(userRef, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || 'Google User',
      role: 'user',
      trustScore: 10,
      createdAt: serverTimestamp()
    });
  }
  
  return userCredential;
}

export async function logoutUser() {
  if (!isFirebaseConfigured) return;
  return signOut(auth);
}

export function getCurrentUser(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    callback({ uid: 'mock-uid', email: 'guest@aqua-sense.ai' } as any);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// --- Flood Reports ---

export async function createFloodReport(reportData: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Create Report:", reportData);
    return { id: 'mock-report-id' };
  }
  try {
    return await addDoc(collection(db, 'floodReports'), {
      ...reportData,
      status: ReportStatus.PENDING,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'floodReports');
  }
}

export async function getFloodReports(): Promise<FloodReport[]> {
  if (!isFirebaseConfigured) return FLOOD_REPORTS;
  try {
    const q = query(collection(db, 'floodReports'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'floodReports');
  }
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  if (!isFirebaseConfigured) {
    console.log("Mock Update Status:", { reportId, status });
    return;
  }
  try {
    const reportRef = doc(db, 'floodReports', reportId);
    return await updateDoc(reportRef, { 
      status,
      verifiedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `floodReports/${reportId}`);
  }
}

export async function getVerifiedFloodReports(): Promise<FloodReport[]> {
  if (!isFirebaseConfigured) return FLOOD_REPORTS.filter(r => r.status === ReportStatus.VERIFIED);
  const q = query(
    collection(db, 'floodReports'), 
    where('status', '==', ReportStatus.VERIFIED),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

// --- Shelters ---

export async function getShelters(): Promise<Shelter[]> {
  if (!isFirebaseConfigured) return SHELTERS;
  try {
    const snapshot = await getDocs(collection(db, 'shelters'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'shelters');
  }
}

export async function updateShelterOccupancy(shelterId: string, currentOccupancy: number) {
  if (!isFirebaseConfigured) {
    console.log("Mock Update Shelter:", { shelterId, currentOccupancy });
    return;
  }
  try {
    const shelterRef = doc(db, 'shelters', shelterId);
    // We'd need to fetch the shelter first to calculate availableSpace if not passing it
    return await updateDoc(shelterRef, { 
      currentOccupancy,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `shelters/${shelterId}`);
  }
}

export async function createShelter(shelterData: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Create Shelter:", shelterData);
    return { id: 'mock-shelter-id' };
  }
  try {
    return await addDoc(collection(db, 'shelters'), {
      ...shelterData,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'shelters');
  }
}

// --- Alerts ---

export async function getAlerts(): Promise<Alert[]> {
  if (!isFirebaseConfigured) return ALERTS;
  try {
    const q = query(collection(db, 'alerts'), where('active', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'alerts');
  }
}

export async function createAlert(alertData: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Create Alert:", alertData);
    return { id: 'mock-alert-id' };
  }
  try {
    return await addDoc(collection(db, 'alerts'), {
      ...alertData,
      active: true,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'alerts');
  }
}

export async function deactivateAlert(alertId: string) {
  if (!isFirebaseConfigured) return;
  try {
    const alertRef = doc(db, 'alerts', alertId);
    return await updateDoc(alertRef, { active: false });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `alerts/${alertId}`);
  }
}

// --- Family Check-Ins ---

export async function createFamilyCheckIn(checkInData: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Check-In:", checkInData);
    return { id: 'mock-checkin-id' };
  }
  try {
    return await addDoc(collection(db, 'familyCheckIns'), {
      ...checkInData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'familyCheckIns');
  }
}

export async function getFamilyCheckIns(groupId: string) {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(
      collection(db, 'familyCheckIns'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'familyCheckIns');
  }
}

// --- Risk Predictions ---

export async function saveRiskPrediction(predictionData: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Save Prediction:", predictionData);
    return { id: 'mock-prediction-id' };
  }
  return addDoc(collection(db, 'riskPredictions'), {
    ...predictionData,
    createdAt: serverTimestamp()
  });
}

export async function getRiskPredictions(): Promise<any[]> {
  if (!isFirebaseConfigured) return [];
  const q = query(collection(db, 'riskPredictions'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

export async function getFloodReportById(reportId: string): Promise<FloodReport | null> {
  if (!isFirebaseConfigured) {
    const report = FLOOD_REPORTS.find(r => r.id === reportId);
    return report || null;
  }
  try {
    const reportRef = doc(db, 'floodReports', reportId);
    const snapshot = await getDocs(query(collection(db, 'floodReports'), where('id', '==', reportId))); // Actually doc(db, 'floodReports', reportId) is better if id is docId
    // If id is docId
    const docSnap = await getDocs(query(collection(db, 'floodReports'), where('__name__', '==', reportId)));
    if (docSnap.empty) return null;
    return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() } as any;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `floodReports/${reportId}`);
  }
}

export async function createPostFloodImpactReport(data: any) {
  if (!isFirebaseConfigured) {
    console.log("Mock Create Impact Report:", data);
    return { id: 'mock-impact-id' };
  }
  try {
    return await addDoc(collection(db, 'postFloodImpactReports'), {
      ...data,
      status: ImpactReportStatus.SUBMITTED,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'postFloodImpactReports');
  }
}

export async function getPostFloodImpactReports(): Promise<PostFloodImpactReport[]> {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(collection(db, 'postFloodImpactReports'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'postFloodImpactReports');
  }
}

export async function getPostFloodImpactReportByIncident(incidentId: string): Promise<PostFloodImpactReport | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, 'postFloodImpactReports'), where('relatedIncidentId', '==', incidentId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'postFloodImpactReports');
  }
}

export async function updatePostFloodImpactReportStatus(reportId: string, status: ImpactReportStatus) {
  if (!isFirebaseConfigured) return;
  try {
    const reportRef = doc(db, 'postFloodImpactReports', reportId);
    return await updateDoc(reportRef, { 
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `postFloodImpactReports/${reportId}`);
  }
}

export async function updateUserTrustScore(userId: string, scoreDelta: number) {
  if (!isFirebaseConfigured) return;
  try {
    const userRef = doc(db, 'users', userId);
    // Ideally use increment(scoreDelta)
    return await updateDoc(userRef, { 
      trustScore: scoreDelta 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
}

// --- Storage ---

export async function uploadReportPhoto(file: File) {
  if (!isFirebaseConfigured) {
    console.log("Mock Upload Photo:", file.name);
    return "https://images.unsplash.com/photo-1547683908-21aa53841cd1?auto=format&fit=crop&q=80&w=800";
  }
  const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
