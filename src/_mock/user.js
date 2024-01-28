import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { db } from '../firebase'; // Adjust the path as needed

// ----------------------------------------------------------------------
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Adjust the path as needed

// const Users = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const collectionRef = db.collection('WP4-pendingUsers'); // Replace 'yourCollection' with your actual collection name
//         const snapshot = await collectionRef.get();

//         const fetchedData = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setData(fetchedData);
//       } catch (error) {
//         console.error('Error fetching data: ', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // return (
//   //   <div>
//   //     <h1>Your Firebase Collection</h1>
//   //     <ul>
//   //       {data.map(item => (
//   //         <li key={item.id}>
//   //           <p>Name: {item.name}</p>
//   //           <p>Company: {item.company}</p>
//   //           {/* Add more fields as needed */}
//   //         </li>
//   //       ))}
//   //     </ul>
//   //   </div>
//   // );
// };

// export default Users;

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'Dean',
    'Technician',
    'Faculty',
  ]),
}));

export default users;

// import { getAuth, onAuthStateChanged } from '@firebase/auth';
// import { initializeApp } from 'firebase/app';
// import { useState, useEffect, useContext, createContext } from 'react';
// import { getFirestore, collection, doc } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// const firebaseConfig  = {
//   apiKey: "AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc",
//   authDomain: "wp4-technician-dms.firebaseapp.com",
//   projectId: "wp4-technician-dms",
//   storageBucket: "wp4-technician-dms.appspot.com",
//   messagingSenderId: "1065436189229",
//   appId: "1:1065436189229:web:88094d3d71b15a0ab29ea4"
// }


// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firestore db
// const db = getFirestore(firebaseApp);

// const Users = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const collectionRef = firebase.firestore().collection('WP4-pendingUsers'); // Replace 'yourCollection' with your actual collection name
//         const snapshot = await collectionRef.get();

//         const realData = snapshot.docs.map(doc => ({
//           id: doc.id,
//           avatarUrl: doc.data().avatarUrl,
//           name: doc.data().name,
//           company: doc.data().company,
//           isVerified: doc.data().isVerified,
//           status: doc.data().status,
//           role: doc.data().role,
//         }));

//         setData(realData);
//       } catch (error) {
//         console.error('Error fetching data: ', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Your Firebase Collection</h1>
//       <ul>
//         {data.map(item => (
//           <li key={item.id}>
//             <p>Name: {item.name}</p>
//             <p>Company: {item.company}</p>
//             <p>Status: {item.status}</p>
//             {/* Add more fields as needed */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Users;
