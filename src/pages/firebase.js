import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    doc,
    getDocs,
    where,
    updateDoc,
    deleteDoc,
    addDoc,
    getDoc,
    documentId,
    setDoc,
    initializeFirestore,
  } from '@firebase/firestore';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

  
const firebaseConfig = {
    apiKey: 'AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc',
    authDomain: 'wp4-technician-dms.firebaseapp.com',
    projectId: 'wp4-technician-dms',
    storageBucket: 'wp4-technician-dms.appspot.com',
    messagingSenderId: '1065436189229',
    appId: '1:1065436189229:web:88094d3d71b15a0ab29ea4',
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  
  // Initialize Firestore db
  // const db = getFirestore(firebaseApp);
  
  // Access main collection
  // const mainCollectionRef = collection(db, 'SERVICE-REQUEST');
  
  // // Access FORMS document under main collection
  // const formsDocRef = doc(mainCollectionRef, 'FORMS');
  
  // // Add to subcollection
  // const serviceRequestCollectionRef = collection(formsDocRef, 'SERVICE-REQUEST');
  
  // // Access ARCHIVES document under main collection
  // const archivesRef = doc(mainCollectionRef, 'ARCHIVES');
  
  // const archivesCollectionRef = collection(archivesRef, 'ARCHIVES-FORMS');
  export const db = initializeFirestore(firebaseApp, {useFetchStreams: false});
  // Second declaration
  export const storage = getStorage(firebaseApp);
  export const auth = getAuth(firebaseApp)

  export default firebaseApp;