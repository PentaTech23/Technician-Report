import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { useState, useEffect, useContext, createContext } from 'react';
import { getFirestore, collection, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig  = {
  apiKey: "AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc",
  authDomain: "wp4-technician-dms.firebaseapp.com",
  projectId: "wp4-technician-dms",
  storageBucket: "wp4-technician-dms.appspot.com",
  messagingSenderId: "1065436189229",
  appId: "1:1065436189229:web:88094d3d71b15a0ab29ea4"
}


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore db
const db = getFirestore(firebaseApp);

// Access main collections
const mainCollectionRef = collection(db, "WP4-TESTING-AREA");
const userCollectionRef = collection(db, "WP4-pendingUsers");

// Access FORMS document under main collection
const formsDocRef = doc(mainCollectionRef, "FORMS");
const profilingDocRef = doc(mainCollectionRef, "PROFILING");
const reportDocRef = doc(mainCollectionRef, "REPORTS");

// Forms Sub-Collection
const BorrowersCollectionRef = collection(formsDocRef, "ITEM-BORROWERS");
const RequestCollectionRef = collection(formsDocRef, "ITEM-REQUEST");
const ServiceCollectionRef = collection(formsDocRef, "SERVICE-REQUEST");
const InspectionCollectionRef = collection(formsDocRef, "INSPECTION-REPORT-FORM");
// Profiling Sub-Collection
const MemorandumCollectionRef = collection(profilingDocRef, 'MEMORANDUM-OF-RECEIPTS');
const CondemnedCollectionRef = collection(profilingDocRef, 'CONDEMNED-ITEMS');
// Reports Sub-Collection

// Access ARCHIVES document under main collection
const archivesRef = doc(mainCollectionRef, "ARCHIVES");

const archivesCollectionRef = collection(archivesRef, "ARCHIVES-FORMS");

// Initialize Storage
const storage = getStorage(firebaseApp);

export const AuthContext = createContext()

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      setUser(authUser);
      setError(null); // Clear any previous errors
    }, (authError) => {
      setUser(null);
      setError(authError);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, error }} {...props} />;
};

export const useAuthState = () => {
  const auth = useContext(AuthContext)
  return { ...auth, isAuthenticated: auth.user !=null }
}

export {
  firebaseApp,
  db,
  mainCollectionRef,
  userCollectionRef,
  formsDocRef,
  BorrowersCollectionRef,
  RequestCollectionRef,
  ServiceCollectionRef,
  InspectionCollectionRef,
  MemorandumCollectionRef,
  CondemnedCollectionRef,
  archivesRef,
  archivesCollectionRef,
  storage
};